import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEnquiryStore, useLeadSources, usePackageStore, useAuthStore } from "../../../store/store";
import { getFollowupHistory, addFollowupEntry } from "../../../api/enquiryApi";
import { toast } from "react-toastify";

/* ─── Helpers ──────────────────────────────────────────────── */

const formatLabel = (value) =>
    value?.toString().toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const formatDateTime = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

/* ─── Status Pill ──────────────────────────────────────────── */

const STATUS_META = {
    NEW: { color: "#F97316", bg: "rgba(249,115,22,0.09)", label: "New" },
    FOLLOW_UP: { color: "#D91E18", bg: "rgba(217,30,24,0.08)", label: "Follow Up" },
    HOLD: { color: "#6b7280", bg: "#f3f4f6", label: "Hold" },
    CANCELLED: { color: "#1A1A1A", bg: "#f5f5f5", label: "Cancelled" },
    CONVERTED_TO_LEAD: { color: "#3B2418", bg: "#F4E7D3", label: "Converted" },
};

const StatusPill = ({ status }) => {
    const m = STATUS_META[status] || { color: "#6b7280", bg: "#f3f4f6", label: status };
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
            color: m.color, background: m.bg, border: `1px solid ${m.color}28`,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, display: "inline-block" }} />
            {m.label}
        </span>
    );
};

/* ─── Brand token shorthand ────────────────────────────────── */
const B = {
    red: "#D91E18",
    orange: "#F97316",
    brown: "#3B2418",
    dark: "#1A1A1A",
    cream: "#F4E7D3",
    bg: "#FFF8F3",
    grad: "linear-gradient(135deg, #D91E18 0%, #F97316 100%)",
    gradSoft: "linear-gradient(135deg, #FFF8F3 0%, #F4E7D3 100%)",
    shadow: "0 4px 14px rgba(217,30,24,0.32)",
    border: "rgba(244,231,211,0.9)",
    radius: 14,
    ease: "cubic-bezier(0.4,0,0.2,1)",
};

/* ─── Form Config ──────────────────────────────────────────── */

const ENQUIRY_CONFIG = {
    listPath: "/crm-enquiry",
    icon: "bx-user-voice",
    tabs: ["basic", "lead", "followup"],
    fields: {
        basic: [
            { name: "referenceId", label: "Reference ID", type: "text", required: true, placeholder: "Auto-generated", maxLength: 50, disabled: true },
            { name: "name", label: "Name", type: "text", required: true, placeholder: "Customer full name", maxLength: 100 },
            { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "10-digit mobile number", maxLength: 10 },
            { name: "email", label: "Email", type: "email", required: true, placeholder: "email@example.com", maxLength: 100 },
            { name: "address", label: "Address", type: "textarea", required: true, placeholder: "Full address", col: 12, maxLength: 500 },
            { name: "place", label: "Place / City", type: "text", required: true, placeholder: "Enter city", maxLength: 100 },
            { name: "state", label: "State", type: "text", required: true, placeholder: "Enter state", maxLength: 100 },
            { name: "postCode", label: "Post Code / Zip", type: "text", required: true, placeholder: "Eg: 638001", maxLength: 12 },

        ],
        lead: [
            { name: "interestedPackage", label: "Interested Package", type: "select", required: true },
            { name: "leadSource", label: "Lead Source", type: "select", required: true },
            { name: "status", label: "Status", type: "select", required: true, options: ["NEW", "FOLLOW_UP", "HOLD", "CANCELLED"] },
            { name: "assignedTo", label: "Assigned To", type: "text", required: true, placeholder: "Sales person name", maxLength: 100 },
        ],
        followup: [
            { name: "followUpDate", label: "Follow-up Date", type: "date", required: false },
            { name: "createdDate", label: "Created Date", type: "date", required: false, disabled: true },
            { name: "remarks", label: "Remarks / Notes", type: "textarea", required: false, placeholder: "Enter notes", col: 12, maxLength: 1000 },
        ],
    },
    initialValues: {
        referenceId: "", name: "", phone: "", email: "", place: "", state: "", postCode: "",
        address: "", interestedPackage: "", leadSource: "", status: "NEW",
        followUpDate: "", assignedTo: "",
        createdDate: new Date().toISOString().split("T")[0],
        remarks: "",
    },
};

const TAB_ICONS = { basic: "bx-user", lead: "bx-briefcase", followup: "bx-calendar-check" };
const TAB_LABELS = { basic: "Basic Info", lead: "Lead Info", followup: "Follow Up" };

/* ─── Followup Tab (Edit Mode) ─────────────────────────────── */

const FollowupTab = ({ enquiryId, assignedBy, creationEntry }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fu, setFu] = useState({ followUpDate: "", status: "", remarks: "" });
    const [errs, setErrs] = useState({});

    const hasCreation = !!(creationEntry && (creationEntry.followUpDate || creationEntry.remarks));
    const hasAny = history.length > 0 || hasCreation;

    const fetchHistory = useCallback(async () => {
        if (!enquiryId) return;
        setLoading(true);
        try {
            const res = await getFollowupHistory(enquiryId);
            setHistory(res.data || []);
        } catch { toast.error("Failed to load history"); }
        finally { setLoading(false); }
    }, [enquiryId]);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    const validate = () => {
        const e = {};
        if (!fu.followUpDate) e.followUpDate = "Date is required";
        if (!fu.remarks.trim()) e.remarks = "Remarks are required";
        return e;
    };

    const handleAdd = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrs(e); return; }
        setSaving(true);
        try {
            await addFollowupEntry(enquiryId, {
                followUpDate: fu.followUpDate,
                status: fu.status || undefined,
                remarks: fu.remarks,
                addedBy: assignedBy || "Admin",
            });
            toast.success("Follow-up logged!");
            setFu({ followUpDate: "", status: "", remarks: "" });
            setErrs({});
            fetchHistory();
        } catch { toast.error("Failed to log follow-up"); }
        finally { setSaving(false); }
    };

    const set = (k, v) => { setFu(p => ({ ...p, [k]: v })); setErrs(p => ({ ...p, [k]: "" })); };

    return (
        <div>
            {/* ── Add Entry Card ── */}
            <div style={{
                background: B.gradSoft,
                border: `1px solid ${B.border}`,
                borderRadius: 12, padding: "20px 22px", marginBottom: 24,
                boxShadow: "0 2px 12px rgba(59,36,24,0.06)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: B.grad,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: B.shadow,
                    }}>
                        <i className="bx bx-plus" style={{ color: "#fff", fontSize: 18 }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: B.dark }}>Log New Follow-up</div>
                        <div style={{ fontSize: 12, color: B.orange, fontWeight: 600 }}>Track every interaction</div>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Follow-up Date <span style={{ color: B.red }}>*</span></label>
                        <input
                            type="date"
                            className={`form-control ${errs.followUpDate ? "is-invalid" : ""}`}
                            value={fu.followUpDate}
                            onChange={(e) => set("followUpDate", e.target.value)}
                        />
                        {errs.followUpDate && <div className="invalid-feedback">{errs.followUpDate}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Update Status <span style={{ fontWeight: 400, textTransform: "none", fontSize: 11, color: "#9ca3af" }}>(optional)</span></label>
                        <select
                            className="form-select"
                            value={fu.status}
                            onChange={(e) => set("status", e.target.value)}
                        >
                            <option value="">Keep current status</option>
                            <option value="NEW">New</option>
                            <option value="FOLLOW_UP">Follow Up</option>
                            <option value="HOLD">Hold</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <label className="form-label">Remarks / Notes <span style={{ color: B.red }}>*</span></label>
                        <textarea
                            className={`form-control ${errs.remarks ? "is-invalid" : ""}`}
                            rows={3}
                            maxLength={1000}
                            placeholder="What happened? Any next steps or observations?"
                            value={fu.remarks}
                            onChange={(e) => set("remarks", e.target.value)}
                        />
                        {errs.remarks && <div className="invalid-feedback">{errs.remarks}</div>}
                        <div style={{ textAlign: "right", fontSize: 11, color: "#b5b0a8", marginTop: 4 }}>{fu.remarks.length}/1000</div>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm px-4"
                        disabled={saving}
                        onClick={handleAdd}
                    >
                        {saving
                            ? <><span className="spinner-border spinner-border-sm me-2" />Logging...</>
                            : <><i className="bx bx-check-circle me-1" />Log Follow-up</>
                        }
                    </button>
                </div>
            </div>

            {/* ── History Timeline ── */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <i className="bx bx-history" style={{ fontSize: 17, color: B.orange }} />
                    <span style={{ fontWeight: 800, fontSize: 14, color: B.dark }}>Follow-up History</span>
                    {history.length > 0 && (
                        <span style={{
                            background: B.grad, color: "#fff",
                            borderRadius: 10, padding: "1px 9px",
                            fontSize: 11, fontWeight: 700,
                            boxShadow: "0 2px 6px rgba(217,30,24,0.3)",
                        }}>{history.length}</span>
                    )}
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "28px 0", color: "#b5b0a8" }}>
                        <span className="spinner-border spinner-border-sm me-2" style={{ borderTopColor: B.orange }} />
                        Loading history...
                    </div>
                )}

                {!loading && !hasAny && (
                    <div style={{
                        textAlign: "center", padding: "36px 16px",
                        background: "#fafaf8", borderRadius: 10,
                        border: `1.5px dashed ${B.cream}`,
                    }}>
                        <i className="bx bx-calendar-x" style={{ fontSize: 38, color: B.cream, display: "block", marginBottom: 10 }} />
                        <div style={{ fontSize: 13.5, color: "#9ca3af", fontWeight: 600 }}>No follow-ups logged yet</div>
                        <div style={{ fontSize: 12, color: "#d1d5db", marginTop: 4 }}>Use the form above to log the first one</div>
                    </div>
                )}

                {!loading && hasAny && (
                    <div style={{ position: "relative", paddingLeft: 26 }}>
                        {/* Vertical line */}
                        <div style={{
                            position: "absolute", left: 8, top: 10, bottom: 10,
                            width: 2.5,
                            background: `linear-gradient(180deg, ${B.red} 0%, ${B.orange} 60%, ${B.cream} 100%)`,
                            borderRadius: 2,
                        }} />

                        {history.map((entry, idx) => (
                            <div key={entry._id} style={{ position: "relative", marginBottom: (idx < history.length - 1 || hasCreation) ? 18 : 0 }}>
                                {/* Timeline dot */}
                                <div style={{
                                    position: "absolute", left: -22, top: 14,
                                    width: 14, height: 14, borderRadius: "50%",
                                    background: idx === 0 ? B.grad : "#e5e7eb",
                                    border: `2.5px solid ${idx === 0 ? B.bg : "#f3f4f6"}`,
                                    boxShadow: idx === 0 ? "0 0 0 3px rgba(217,30,24,0.18)" : "none",
                                    animation: idx === 0 ? "pulseDot 2s ease infinite" : "none",
                                }} />

                                <div style={{
                                    background: idx === 0 ? "#fff" : "#fafaf8",
                                    border: `1px solid ${idx === 0 ? B.border : "#f0ece6"}`,
                                    borderRadius: 12,
                                    padding: "14px 18px",
                                    boxShadow: idx === 0 ? "0 3px 16px rgba(59,36,24,0.09)" : "0 1px 4px rgba(59,36,24,0.04)",
                                    transition: "box-shadow 0.2s ease",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <i className="bx bx-calendar-event" style={{ color: B.orange, fontSize: 15 }} />
                                            <span style={{ fontWeight: 800, fontSize: 13.5, color: B.dark }}>
                                                {formatDate(entry.followUpDate)}
                                            </span>
                                            {idx === 0 && (
                                                <span style={{
                                                    fontSize: 10, fontWeight: 800, color: "#fff",
                                                    background: B.grad, borderRadius: 4, padding: "1px 7px",
                                                    boxShadow: "0 2px 6px rgba(217,30,24,0.28)",
                                                }}>LATEST</span>
                                            )}
                                        </div>
                                        {entry.status && <StatusPill status={entry.status} />}
                                    </div>

                                    {entry.remarks && (
                                        <p style={{
                                            margin: "0 0 10px", fontSize: 13.5, color: "#374151",
                                            lineHeight: 1.65, whiteSpace: "pre-wrap",
                                        }}>
                                            {entry.remarks}
                                        </p>
                                    )}

                                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, color: "#b5b0a8" }}>
                                        <span><i className="bx bx-user me-1" style={{ color: B.orange }} />{entry.addedBy}</span>
                                        <span style={{ color: B.cream }}>·</span>
                                        <span><i className="bx bx-time me-1" style={{ color: B.orange }} />{formatDateTime(entry.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* ── Creation-time followup (from the enquiry document itself) ── */}
                        {hasCreation && (
                            <div style={{ position: "relative" }}>
                                <div style={{
                                    position: "absolute", left: -22, top: 14,
                                    width: 14, height: 14, borderRadius: "50%",
                                    background: "#e5e7eb",
                                    border: "2.5px solid #f3f4f6",
                                }} />
                                <div style={{
                                    background: "#fafaf8",
                                    border: "1px solid #f0ece6",
                                    borderRadius: 12, padding: "14px 18px",
                                    boxShadow: "0 1px 4px rgba(59,36,24,0.04)",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <i className="bx bx-calendar-plus" style={{ color: B.orange, fontSize: 15 }} />
                                            <span style={{ fontWeight: 800, fontSize: 13.5, color: B.dark }}>
                                                {creationEntry.followUpDate ? formatDate(creationEntry.followUpDate) : "—"}
                                            </span>
                                            <span style={{
                                                fontSize: 10, fontWeight: 800, color: "#fff",
                                                background: "#6b7280", borderRadius: 4, padding: "1px 7px",
                                            }}>CREATED</span>
                                        </div>
                                        {creationEntry.status && <StatusPill status={creationEntry.status} />}
                                    </div>

                                    {creationEntry.remarks && (
                                        <p style={{
                                            margin: "0 0 10px", fontSize: 13.5, color: "#374151",
                                            lineHeight: 1.65, whiteSpace: "pre-wrap",
                                        }}>
                                            {creationEntry.remarks}
                                        </p>
                                    )}

                                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, color: "#b5b0a8" }}>
                                        <span><i className="bx bx-user me-1" style={{ color: B.orange }} />{creationEntry.addedBy}</span>
                                        <span style={{ color: B.cream }}>·</span>
                                        <span><i className="bx bx-time me-1" style={{ color: B.orange }} />{formatDateTime(creationEntry.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Main Enquiry Form ─────────────────────────────────────── */

const EnquiryForm = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const mode = id ? "edit" : "add";
    const initialData = location.state?.rowData || {};
    const config = ENQUIRY_CONFIG;

    const [activeTab, setActiveTab] = useState(location.state?.activeTab || config.tabs[0]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const { leadSources, fetchLeadSources } = useLeadSources();
    const { packages, fetchPackages } = usePackageStore();
    const { createEnquiry, getNextReferenceId, updateEnquiry } = useEnquiryStore();
    const { profile } = useAuthStore();

    useEffect(() => { fetchLeadSources(); fetchPackages(); }, []);

    useEffect(() => {
        if (mode !== "add") return;
        getNextReferenceId().then((res) =>
            setForm((p) => ({ ...p, referenceId: res?.referenceId || "" }))
        );
    }, [mode]);

    const mergedInitialValues = useMemo(() => ({
        ...config.initialValues,
        ...initialData,
        interestedPackage: initialData.interestedPackage?._id || initialData.interestedPackage || "",
        leadSource: initialData.leadSource?._id || initialData.leadSource || "",
        followUpDate: initialData.followUpDate
            ? new Date(initialData.followUpDate).toISOString().split("T")[0] : "",
        createdDate: initialData.createdAt
            ? new Date(initialData.createdAt).toISOString().split("T")[0]
            : config.initialValues.createdDate,
    }), [initialData]);

    const [form, setForm] = useState(() => mergedInitialValues);

    useEffect(() => {
        setForm(mergedInitialValues);
        setErrors({});
        setActiveTab(location.state?.activeTab || "basic");
    }, [id, location.state?.activeTab]);

    const validate = () => {
        const e = {};
        config.tabs.forEach((tab) => {
            if (mode === "edit" && tab === "followup") return;
            config.fields[tab]?.forEach((field) => {
                if (field.required && !field.disabled && !(form[field.name] ?? "").toString().trim())
                    e[field.name] = `${field.label} is required`;
                if (field.type === "email" && form[field.name] && !/\S+@\S+\.\S+/.test(form[field.name]))
                    e[field.name] = "Enter a valid email address";
            });
        });
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            const firstBadTab = config.tabs.find((t) => config.fields[t]?.some((f) => errs[f.name]));
            if (firstBadTab) setActiveTab(firstBadTab);
            return;
        }
        try {
            console.log("Submitting form data:", form);
            setSubmitting(true);
            const payload = {
                name: form.name, phone: form.phone, email: form.email,
                place: form.place, state: form.state, postCode: form.postCode, address: form.address,
                interestedPackage: form.interestedPackage, leadSource: form.leadSource,
                status: form.status, followUpDate: form.followUpDate,
                assignedTo: form.assignedTo, remarks: form.remarks,
            };
            if (mode === "add") {
                await createEnquiry(payload);
                toast.success("Enquiry created successfully");
            } else {
                await updateEnquiry(initialData._id, payload);
                toast.success("Enquiry updated successfully");
            }
            setTimeout(() => navigate(config.listPath), 1000);
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const currentTabIndex = config.tabs.indexOf(activeTab);
    const handleNext = (e) => { e.preventDefault(); e.stopPropagation(); if (currentTabIndex < config.tabs.length - 1) setActiveTab(config.tabs[currentTabIndex + 1]); };
    const handlePrevious = (e) => { e.preventDefault(); e.stopPropagation(); if (currentTabIndex > 0) setActiveTab(config.tabs[currentTabIndex - 1]); };

    /* ── Field renderer ── */
    const renderField = (field) => {
        const common = {
            name: field.name,
            value: form[field.name] ?? "",
            onChange: handleChange,
            className: `form-control ${errors[field.name] ? "is-invalid" : ""}`,
            placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
            maxLength: field.maxLength,
            disabled: field.disabled || false,
            autoComplete: "off",
        };

        if (field.type === "textarea") return (
            <>
                <textarea {...common} rows="3" />
                {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
            </>
        );

        if (field.type === "select") {
            if (field.name === "interestedPackage") return (
                <>
                    <select name={field.name} value={form[field.name] ?? ""} onChange={handleChange} className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}>
                        <option value="">Select Package</option>
                        {packages.map((p) => <option key={p._id} value={p._id}>{p.packageName}</option>)}
                    </select>
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </>
            );

            if (field.name === "leadSource") return (
                <>
                    <select name={field.name} value={form[field.name] ?? ""} onChange={handleChange} className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}>
                        <option value="">Select Lead Source</option>
                        {leadSources.map((s) => <option key={s._id} value={s._id}>{s.leadSourceName}</option>)}
                    </select>
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </>
            );

            return (
                <>
                    <select name={field.name} value={form[field.name] ?? ""} onChange={handleChange} className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}>
                        <option value="">Select {field.label}</option>
                        {[...field.options, ...(form.status === "CONVERTED_TO_LEAD" ? ["CONVERTED_TO_LEAD"] : [])].map((opt) => (
                            <option key={opt} value={opt}>{formatLabel(opt)}</option>
                        ))}
                    </select>
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                </>
            );
        }

        return (
            <>
                <input type={field.type || "text"} {...common} />
                {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
            </>
        );
    };

    /* ── Render ── */
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* Page header */}
                    <div className="row mb-3">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 12,
                                        background: B.grad, boxShadow: B.shadow,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        animation: "scaleIn 0.3s ease",
                                    }}>
                                        <i className={`bx ${config.icon}`} style={{ color: "#fff", fontSize: 22 }} />
                                    </div>
                                    <div>
                                        <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: B.dark }}>
                                            {mode === "edit" ? "Edit Enquiry" : "New Enquiry"}
                                        </h4>
                                        {mode === "edit" && initialData.referenceId && (
                                            <div style={{ fontSize: 12, color: B.orange, fontWeight: 700, marginTop: 1 }}>
                                                # {initialData.referenceId}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <button type="button" onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                                        <i className="bx bx-arrow-back" style={{ fontSize: 15 }} /> Back
                                    </button>
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                        <li className="breadcrumb-item"><Link to={config.listPath}>Enquiry</Link></li>
                                        <li className="breadcrumb-item active">{mode === "edit" ? "Edit" : "Create"}</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row">
                            <div className="col-12">
                                <div className="card" style={{ overflow: "hidden" }}>

                                    {/* Tab Strip */}
                                    <div style={{
                                        background: B.gradSoft,
                                        borderBottom: `1.5px solid ${B.border}`,
                                        padding: "0 8px",
                                        display: "flex",
                                    }}>
                                        {config.tabs.map((tab) => {
                                            const isActive = activeTab === tab;
                                            const hasError = config.fields[tab]?.some((f) => errors[f.name]);
                                            return (
                                                <button
                                                    key={tab}
                                                    type="button"
                                                    onClick={() => setActiveTab(tab)}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: 7,
                                                        padding: "14px 22px",
                                                        background: "none", border: "none", cursor: "pointer",
                                                        borderBottom: isActive ? `3px solid ${B.red}` : "3px solid transparent",
                                                        fontWeight: isActive ? 800 : 500,
                                                        fontSize: 13,
                                                        color: isActive ? B.red : "#9ca3af",
                                                        transition: `all 0.22s ${B.ease}`,
                                                        position: "relative",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    <i className={`bx ${TAB_ICONS[tab]}`} style={{ fontSize: 15 }} />
                                                    {TAB_LABELS[tab]}
                                                    {hasError && (
                                                        <span style={{
                                                            width: 7, height: 7, borderRadius: "50%",
                                                            background: B.red,
                                                            position: "absolute", top: 10, right: 8,
                                                            boxShadow: "0 0 0 2px rgba(217,30,24,0.2)",
                                                        }} />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Tab Content */}
                                    <div style={{ padding: "26px 28px" }}>
                                        {activeTab === "followup" && mode === "edit" ? (
                                            <FollowupTab
                                                enquiryId={initialData._id}
                                                assignedBy={profile?.name || form.assignedTo || "Admin"}
                                                creationEntry={
                                                    (initialData.followUpDate || initialData.remarks)
                                                        ? {
                                                            followUpDate: initialData.followUpDate,
                                                            remarks: initialData.remarks,
                                                            status: initialData.status,
                                                            addedBy: initialData.assignedTo || "Admin",
                                                            createdAt: initialData.createdAt,
                                                        }
                                                        : null
                                                }
                                            />
                                        ) : (
                                            <div className="row g-3">
                                                {config.fields[activeTab]?.map((field) => (
                                                    <div key={field.name} className={`col-md-${field.col || 6}`}>
                                                        <label className="form-label">
                                                            {field.label}
                                                            {field.required && <span style={{ color: B.red, marginLeft: 3 }}>*</span>}
                                                        </label>
                                                        {renderField(field)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Nav buttons */}
                                        <div style={{
                                            display: "flex", justifyContent: "space-between",
                                            alignItems: "center", flexWrap: "wrap", gap: 10,
                                            marginTop: 28, paddingTop: 20,
                                            borderTop: `1px solid ${B.border}`,
                                        }}>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={handlePrevious}
                                                disabled={currentTabIndex === 0}
                                            >
                                                <i className="bx bx-chevron-left me-1" /> Previous
                                            </button>

                                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                                <Link to={config.listPath} className="btn btn-outline-secondary btn-sm">
                                                    <i className="bx bx-x me-1" /> Cancel
                                                </Link>

                                                {currentTabIndex < config.tabs.length - 1 ? (
                                                    <button type="button" className="btn btn-primary btn-sm" onClick={handleNext}>
                                                        Next <i className="bx bx-chevron-right ms-1" />
                                                    </button>
                                                ) : (
                                                    <button type="submit" className="btn btn-primary btn-sm" disabled={submitting} style={{ minWidth: 148 }}>
                                                        {submitting ? (
                                                            <><span className="spinner-border spinner-border-sm me-2" />{mode === "edit" ? "Updating..." : "Saving..."}</>
                                                        ) : (
                                                            <><i className="bx bx-save me-1" />{mode === "edit" ? "Update Record" : "Save Record"}</>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

export default EnquiryForm;
