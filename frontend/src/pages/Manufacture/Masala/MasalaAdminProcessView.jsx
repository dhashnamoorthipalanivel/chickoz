import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMasalaRequestStore } from "../../../store/store";

/* ─── helpers ─────────────────────────────────────────────── */
const fl = (v) => v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "—";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const fmtDateTime = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

/* ─── status meta ──────────────────────────────────────────── */
const STATUS_META = {
  REQUESTED: { color: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.25)", icon: "bx-time-five", step: 1 },
  UNDER_REVIEW: { color: "#d97706", bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.28)", icon: "bx-search-alt", step: 2 },
  APPROVED: { color: "#2563eb", bg: "rgba(37,99,235,0.1)", border: "rgba(37,99,235,0.25)", icon: "bx-check-circle", step: 3 },
  DISPATCHED: { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.25)", icon: "bx-package", step: 4 },
  DELIVERED: { color: "#059669", bg: "rgba(5,150,105,0.1)", border: "rgba(5,150,105,0.25)", icon: "bx-check-double", step: 5 },
  REJECTED: { color: "#D91E18", bg: "rgba(217,30,24,0.1)", border: "rgba(217,30,24,0.22)", icon: "bx-x-circle", step: 99 },
};
const STATUS_STEPS = ["REQUESTED", "UNDER_REVIEW", "APPROVED", "DISPATCHED", "DELIVERED"];
const ALL_STATUSES = ["UNDER_REVIEW", "APPROVED", "DELIVERED", "REJECTED"];

/* ─── sub-components ───────────────────────────────────────── */
const StatusPill = ({ status }) => {
  const s = STATUS_META[status] || STATUS_META.REQUESTED;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 800, color: s.color, background: "#fff", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
      <i className={`bx ${s.icon}`} style={{ fontSize: 14 }} />{fl(status)}
    </span>
  );
};

const InfoField = ({ icon, label, children }) => (
  <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
    <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,rgba(217,30,24,0.08) 0%,rgba(249,115,22,0.05) 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <i className={`bx ${icon}`} style={{ color: "#D91E18", fontSize: 15 }} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: "#1A1A1A", fontWeight: 600 }}>{children || <span style={{ color: "#d1d5db" }}>—</span>}</div>
    </div>
  </div>
);

const Skeleton = ({ h = 18, w = "100%", r = 8, mb = 0 }) => (
  <div style={{ height: h, width: w, borderRadius: r, background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaeb 50%,#f3f4f6 75%)", backgroundSize: "200% 100%", animation: "skeletonShimmer 1.5s infinite", marginBottom: mb }} />
);

/* ─── main component ───────────────────────────────────────── */
const MasalaAdminProcessView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [adminRemarks, setAdminRemarks] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fileUpload, setFileUpload] = useState(null);

  const { singleRequest, fetchSingleRequest, updateRequestStatus, loading } = useMasalaRequestStore();

  useEffect(() => { if (id) fetchSingleRequest(id); }, [id]);

  const data = singleRequest;
  useEffect(() => { if (data?.status) setSelectedStatus(data.status); }, [data]);

  /* ── loading ── */
  if (loading || !data) {
    return (
      <div className="page-content"><div className="container-fluid">
        <div style={{ background: "linear-gradient(135deg,#1A1A1A 0%,#2d1010 50%,#D91E18 100%)", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", animation: "pulse 1.5s infinite" }} />
            <div>
              <div style={{ height: 20, width: 220, borderRadius: 8, background: "rgba(255,255,255,0.2)", marginBottom: 10, animation: "pulse 1.5s infinite" }} />
              <div style={{ height: 14, width: 140, borderRadius: 6, background: "rgba(255,255,255,0.12)", animation: "pulse 1.5s infinite" }} />
            </div>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-xl-8"><div className="card"><div className="card-body" style={{ padding: 24 }}>
            <Skeleton h={20} w="35%" mb={20} /><div className="row g-3">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="col-md-6"><Skeleton h={55} r={10} /></div>)}</div>
          </div></div></div>
          <div className="col-xl-4"><div className="card"><div className="card-body" style={{ padding: 24 }}>
            <Skeleton h={20} w="50%" mb={20} />{[1, 2, 3, 4].map(i => <Skeleton key={i} h={44} r={10} mb={12} />)}
          </div></div></div>
        </div>
        <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 22px", borderRadius: 30, background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
            <div className="spinner-border" style={{ width: 18, height: 18, borderWidth: 2.5, color: "#D91E18" }} role="status" />
            Loading request details…
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}} @keyframes skeletonShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      </div></div>
    );
  }

  const totalCalc = data.items?.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.price || 0), 0) || data.totalAmount || 0;
  const currentStep = data.status === "REJECTED" ? -1 : (STATUS_META[data.status]?.step || 1);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) { toast.error("Please select a status"); return; }
    try {
      const formData = new FormData();
      formData.append("status", selectedStatus);
      formData.append("adminRemarks", adminRemarks);
      if (fileUpload) formData.append("deliveryDocument", fileUpload);
      
      const res = await updateRequestStatus(id, fileUpload ? formData : { status: selectedStatus, adminRemarks });
      if (res?.success) {
        toast.success(`${data.requestId} → ${fl(selectedStatus)}`);
        fetchSingleRequest(id);
        setAdminRemarks("");
        setFileUpload(null);
      } else {
        toast.error(res?.message || "Failed to update");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update");
    }
  };

  return (
    <React.Fragment>
      <style>{`@keyframes fadeSlideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .adm-ani{animation:fadeSlideUp 0.35s ease both}`}</style>

      <div className="page-content"><div className="container-fluid">

        {/* ── Page header ── */}
        <div className="row adm-ani"><div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className="bx bx-arrow-back" style={{ fontSize: 16 }} />
              </button>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", boxShadow: "0 4px 14px rgba(217,30,24,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bx bx-shield-alt" style={{ color: "#fff", fontSize: 22 }} />
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Admin Process View</h4>
                <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>Masala · Admin Processing · View</div>
              </div>
            </div>
            <ol className="breadcrumb m-0">
              <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/manufacture-masala-admin-process">Admin Processing</Link></li>
              <li className="breadcrumb-item active">View</li>
            </ol>
          </div>
        </div></div>

        {/* ── Hero banner ── */}
        <div className="row mb-3 adm-ani"><div className="col-12">
          <div style={{ background: "linear-gradient(135deg,#1A1A1A 0%,#2d1010 50%,#D91E18 100%)", borderRadius: 20, padding: "24px 28px", position: "relative", boxShadow: "0 8px 32px rgba(217,30,24,0.28)" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
              <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ position: "absolute", bottom: -60, right: 80, width: 150, height: 150, borderRadius: "50%", background: "rgba(249,115,22,0.08)" }} />
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.18)" }}>
                  <i className="bx bx-store" style={{ color: "#fff", fontSize: 26 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 19, color: "#fff" }}>{data.franchise?.franchiseName || "—"}</div>
                  <div style={{ fontSize: 11.5, fontFamily: "monospace", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{data.franchise?.franchiseId}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", marginTop: 5 }}>{fmtDateTime(data.createdAt)}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.18)", textAlign: "center" }}>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Request ID</div>
                  <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13.5, color: "#fff", whiteSpace: "nowrap" }}>{data.requestId || "—"}</div>
                </div>
                <StatusPill status={data.status} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              {[
                { icon: "bx-list-ul", label: "Items", value: data.totalItems ?? "—", color: "#F97316" },
                { icon: "bx-layer", label: "Quantity", value: data.totalQty ?? "—", color: "#60a5fa" },
                { icon: "bx-rupee", label: "Amount", value: `₹${Number(data.totalAmount || totalCalc).toLocaleString()}`, color: "#34d399" },
                { icon: "bx-calendar-check", label: "Required", value: fmtDate(data.requiredDate), color: "#a78bfa" },
                { icon: "bx-error", label: "Priority", value: data.priority || "—", color: data.priority === "Urgent" ? "#f87171" : "#93c5fd" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 13px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <i className={`bx ${s.icon}`} style={{ fontSize: 17, color: s.color }} />
                  <div>
                    <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div></div>

        {/* ── Body ── */}
        <div className="row g-3 adm-ani">

          {/* ── Left ── */}
          <div className="col-xl-8">

            {/* Request Details */}
            <div className="card mb-3" style={{ borderRadius: 16, border: "1.5px solid #f3f4f6", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div className="card-body" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, paddingBottom: 14, borderBottom: "1.5px solid #f3f4f6" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,rgba(217,30,24,0.12) 0%,rgba(249,115,22,0.08) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="bx bx-detail" style={{ color: "#D91E18", fontSize: 17 }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A" }}>Request Details</span>
                </div>
                <div className="row g-0">
                  <div className="col-md-6" style={{ paddingRight: 20 }}>
                    <InfoField icon="bx-id-card" label="Franchise ID"  >{data.franchise?.franchiseId}</InfoField>
                    <InfoField icon="bx-map-pin" label="Location"      >{data.franchise?.location}</InfoField>
                    <InfoField icon="bx-calendar-check" label="Required Date" >{fmtDate(data.requiredDate)}</InfoField>
                    <InfoField icon="bx-credit-card" label="Payment Option">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)" }}>
                        <i className="bx bx-rupee" style={{ fontSize: 12 }} />{data.paymentOption}
                      </span>
                    </InfoField>
                  </div>
                  <div className="col-md-6" style={{ paddingLeft: 20, borderLeft: "1.5px solid #f3f4f6" }}>
                    <InfoField icon="bx-phone" label="Phone"          >{data.franchise?.phone}</InfoField>
                    <InfoField icon="bx-envelope" label="Email"          >{data.franchise?.email}</InfoField>
                    <InfoField icon="bx-wallet" label="Payment Status" >{fl(data.paymentStatus)}</InfoField>
                    <InfoField icon="bx-message-square-detail" label="Franchise Remarks">{data.remarks || "—"}</InfoField>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card" style={{ borderRadius: 16, border: "1.5px solid #f3f4f6", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div className="card-body" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, paddingBottom: 14, borderBottom: "1.5px solid #f3f4f6" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,rgba(217,30,24,0.12) 0%,rgba(249,115,22,0.08) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="bx bx-list-ul" style={{ color: "#D91E18", fontSize: 17 }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A" }}>Order Items</span>
                  {data.items?.length > 0 && <span style={{ marginLeft: "auto", background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color: "#fff", borderRadius: 10, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{data.items.length}</span>}
                </div>
                <div className="table-responsive">
                  <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th style={{ fontSize: 12 }}>#</th>
                        <th style={{ fontSize: 12 }}>Item Name</th>
                        <th style={{ fontSize: 12 }}>Pack Size</th>
                        <th style={{ fontSize: 12 }}>Unit</th>
                        <th style={{ fontSize: 12 }}>Price</th>
                        <th style={{ fontSize: 12 }}>Qty</th>
                        <th style={{ fontSize: 12 }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items?.length ? data.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>{i + 1}</td>
                          <td><span style={{ fontWeight: 700, color: "#1A1A1A" }}>{item.itemName}</span></td>
                          <td><span style={{ fontWeight: 600, color: "#374151" }}>{item.packSize}</span></td>
                          <td><span style={{ display: "inline-flex", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#6b7280", background: "#f3f4f6" }}>{fl(item.unit)}</span></td>
                          <td><span style={{ fontWeight: 600, color: "#374151" }}>₹{Number(item.price || 0).toLocaleString()}</span></td>
                          <td><span style={{ fontWeight: 800, color: "#1A1A1A" }}>{item.quantity}</span></td>
                          <td><span style={{ fontWeight: 800, color: "#059669" }}>₹{(Number(item.quantity || 0) * Number(item.price || 0)).toLocaleString()}</span></td>
                        </tr>
                      )) : (
                        <tr><td colSpan="7" className="text-center py-4 text-muted">No items</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="row g-3 mt-3">
                  {[
                    { label: "Total Items", val: data.totalItems, icon: "bx-list-ul", color: "#F97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.22)" },
                    { label: "Total Quantity", val: data.totalQty, icon: "bx-layer", color: "#2563eb", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.22)" },
                    { label: "Total Amount", val: `₹${Number(data.totalAmount || totalCalc).toLocaleString()}`, icon: "bx-rupee", color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.22)" },
                  ].map(s => (
                    <div key={s.label} className="col-md-4">
                      <div style={{ padding: "14px", borderRadius: 12, background: s.bg, border: `1.5px solid ${s.border}`, textAlign: "center" }}>
                        <i className={`bx ${s.icon}`} style={{ fontSize: 20, color: s.color, display: "block", marginBottom: 5 }} />
                        <div style={{ fontSize: 11, color: s.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{s.label}</div>
                        <div style={{ fontWeight: 800, fontSize: 20, color: s.color }}>{s.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── Right ── */}
          <div className="col-xl-4">

            {/* Process Panel */}
            <div className="card mb-3" style={{ borderRadius: 16, border: "1.5px solid rgba(217,30,24,0.15)", boxShadow: "0 1px 8px rgba(217,30,24,0.08)" }}>
              <div className="card-body" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: "1.5px solid #f3f4f6" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,rgba(217,30,24,0.12) 0%,rgba(249,115,22,0.08) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="bx bx-shield-alt" style={{ color: "#D91E18", fontSize: 17 }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A" }}>Process Request</span>
                </div>

                <div className="mb-3">
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" }}>Update Status</label>
                  <select className="form-select" style={{ borderRadius: 9, fontSize: 13.5 }} value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                    <option value="">Select Status</option>
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{fl(s)}</option>)}
                  </select>
                </div>

                <div className="mb-3">
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" }}>File Upload</label>
                  <input type="file" className="form-control" style={{ borderRadius: 9, fontSize: 13 }} onChange={e => setFileUpload(e.target.files[0])} />
                  
                  {data.deliveryDocument && (
                    <div style={{ marginTop: 10, padding: "8px 12px", background: "#f0f9ff", border: "1px dashed #bae6fd", borderRadius: 8, display: "inline-block" }}>
                      <a href={`http://localhost:3000/uploads/${data.deliveryDocument}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#0284c7", textDecoration: "none" }}>
                        <i className="bx bx-file" style={{ fontSize: 16 }} />
                        View Uploaded Document
                      </a>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" }}>Admin Remarks</label>
                  <textarea rows={4} className="form-control" style={{ borderRadius: 9, fontSize: 13, resize: "vertical" }} placeholder="Enter admin remarks..." value={adminRemarks} onChange={e => setAdminRemarks(e.target.value)} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={handleStatusUpdate} disabled={loading} style={{ padding: "12px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 14px rgba(217,30,24,0.3)", opacity: loading ? 0.8 : 1 }}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14, borderWidth: 2 }} /> Updating...</>
                      : <><i className="bx bx-check-circle" style={{ fontSize: 16 }} />Update Status</>
                    }
                  </button>
                  <button onClick={() => navigate(-1)} style={{ padding: "10px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    Back to List
                  </button>
                </div>
              </div>
            </div>

            {/* Status Stepper */}
            <div className="card mb-3" style={{ borderRadius: 16, border: "1.5px solid #f3f4f6", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div className="card-body" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: "1.5px solid #f3f4f6" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,rgba(217,30,24,0.12) 0%,rgba(249,115,22,0.08) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="bx bx-git-branch" style={{ color: "#D91E18", fontSize: 17 }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1A1A" }}>Status Progress</span>
                </div>
                {data.status === "REJECTED" ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(217,30,24,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", border: "2px solid rgba(217,30,24,0.25)" }}>
                      <i className="bx bx-x-circle" style={{ fontSize: 26, color: "#D91E18" }} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: "#D91E18" }}>Request Rejected</div>
                  </div>
                ) : (
                  <div style={{ paddingLeft: 2 }}>
                    {STATUS_STEPS.map((key, idx) => {
                      const m = STATUS_META[key];
                      const done = currentStep > m.step;
                      const active = currentStep === m.step;
                      const isLast = idx === STATUS_STEPS.length - 1;
                      return (
                        <div key={key} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: isLast ? 0 : 20 }}>
                          {!isLast && <div style={{ position: "absolute", left: 15, top: 32, bottom: 0, width: 2, background: done ? m.color : "#f3f4f6", borderRadius: 2 }} />}
                          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: done ? m.color : active ? m.bg : "#f9fafb", border: `2px solid ${done || active ? m.color : "#e5e7eb"}`, boxShadow: active ? `0 0 0 4px ${m.bg}` : "none" }}>
                            {done ? <i className="bx bx-check" style={{ fontSize: 15, color: "#fff" }} /> : <i className={`bx ${m.icon}`} style={{ fontSize: 13, color: active ? m.color : "#d1d5db" }} />}
                          </div>
                          <div style={{ paddingTop: 5 }}>
                            <div style={{ fontWeight: active ? 700 : 600, fontSize: 13, color: currentStep < m.step ? "#d1d5db" : "#1A1A1A" }}>{fl(key)}</div>
                            {active && <div style={{ fontSize: 11, color: m.color, fontWeight: 700, marginTop: 1 }}>Current</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* History log */}
                {data.statusHistory?.length > 0 && (
                  <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1.5px solid #f3f4f6" }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>History</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {data.statusHistory.map((h, i) => {
                        const m = STATUS_META[h.status] || STATUS_META.REQUESTED;
                        return (
                          <div key={i} style={{ display: "flex", gap: 9, padding: "9px 11px", borderRadius: 9, background: "#f9fafb", border: "1px solid #f3f4f6" }}>
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: m.bg, border: `1.5px solid ${m.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <i className={`bx ${m.icon}`} style={{ fontSize: 12, color: m.color }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: 12, color: m.color }}>{fl(h.status)}</div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{fmtDateTime(h.updatedAt)}</div>
                              {h.remarks && <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 3 }}>{h.remarks}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Remarks (saved) */}
            {data.adminRemarks && (
              <div className="card mb-3" style={{ borderRadius: 16, border: "1.5px solid #f3f4f6" }}>
                <div className="card-body" style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <i className="bx bx-shield-alt" style={{ fontSize: 16, color: "#D91E18" }} />
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: "#1A1A1A" }}>Admin Remarks</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, background: "#f9fafb", borderRadius: 9, padding: "11px 14px", border: "1.5px solid #f3f4f6" }}>{data.adminRemarks}</div>
                </div>
              </div>
            )}



          </div>
        </div>

      </div></div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </React.Fragment>
  );
};

export default MasalaAdminProcessView;
