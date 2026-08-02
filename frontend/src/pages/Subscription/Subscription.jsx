import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSubscriptionStore } from "../../store/store";

/* ─── constants ─────────────────────────────────────────────────── */
const PLAN_DAYS = { TRIAL: 14, MONTHLY: 30, QUARTERLY: 90, HALF_YEARLY: 180, YEARLY: 365 };
const PLAN_LABELS = { TRIAL: "Trial (14 d)", MONTHLY: "Monthly (30 d)", QUARTERLY: "Quarterly (90 d)", HALF_YEARLY: "Half-Yearly (180 d)", YEARLY: "Yearly (365 d)" };

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtDT = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const daysLeft = (end) => {
  if (!end) return null;
  const diff = Math.ceil((new Date(end) - new Date()) / 86400000);
  return diff;
};

/* ─── status helpers ─────────────────────────────────────────────── */
const statusPill = (sub) => {
  if (!sub) return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#9ca3af", background: "#f3f4f6", border: "1px solid #e5e7eb" }}>No Subscription</span>;
  if (sub.status === "UPCOMING" || (sub.startDate && new Date(sub.startDate) > new Date())) {
    return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}>Upcoming</span>;
  }
  const cfg = {
    ACTIVE: { c: "#059669", bg: "rgba(5,150,105,0.08)", b: "rgba(5,150,105,0.2)", label: "Active" },
    EXPIRED: { c: "#D91E18", bg: "rgba(217,30,24,0.08)", b: "rgba(217,30,24,0.2)", label: "Expired" },
    SUSPENDED: { c: "#7c3aed", bg: "rgba(124,58,237,0.08)", b: "rgba(124,58,237,0.2)", label: "Suspended" },
  };
  const s = cfg[sub.status] || cfg.EXPIRED;
  return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: s.c, background: s.bg, border: `1px solid ${s.b}` }}>{s.label}</span>;
};

const daysLeftPill = (sub) => {
  if (!sub) return <span style={{ color: "#9ca3af" }}>—</span>;
  if (sub.startDate && new Date(sub.startDate) > new Date()) {
    const days = Math.ceil((new Date(sub.startDate) - new Date()) / 86400000);
    return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}>Starts in {days}d</span>;
  }
  if (sub.status !== "ACTIVE") return <span style={{ color: "#9ca3af" }}>—</span>;
  const d = daysLeft(sub.endDate);
  if (d <= 0) return <span style={{ color: "#D91E18", fontWeight: 700 }}>Expired</span>;
  if (d <= 7) return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#D91E18", background: "rgba(217,30,24,0.08)", border: "1px solid rgba(217,30,24,0.2)" }}>{d}d left ⚠</span>;
  if (d <= 30) return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#d97706", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)" }}>{d}d left</span>;
  return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)" }}>{d}d left</span>;
};

/* ─── receipt HTML builder ───────────────────────────────────────── */
const buildReceipt = (sub, entry, franchise) => {
  const planName = PLAN_LABELS[entry.plan] || entry.plan;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Subscription Receipt ${entry.receiptNo}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f5f7;padding:30px}
  .wrap{max-width:620px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12)}
  .hdr{background:linear-gradient(135deg,#D91E18,#F97316);padding:28px 32px 22px;color:#fff}
  .hdr h1{font-size:22px;font-weight:800;margin:0}
  .hdr p{font-size:13px;opacity:.82;margin-top:4px}
  .rcpt-no{font-size:11px;font-weight:700;letter-spacing:1.2px;opacity:.72;margin-top:8px;text-transform:uppercase}
  .body{padding:28px 32px}
  .section{margin-bottom:22px}
  .section-title{font-size:11px;font-weight:800;color:#9ca3af;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #f3f4f6}
  .row{display:flex;justify-content:space-between;margin-bottom:8px}
  .label{font-size:13px;color:#6b7280;font-weight:500}
  .value{font-size:13px;color:#1A1A1A;font-weight:700;text-align:right}
  .amount-box{background:linear-gradient(135deg,#059669,#34d399);border-radius:12px;padding:18px 24px;color:#fff;text-align:center;margin:18px 0}
  .amount-box .amt{font-size:36px;font-weight:900}
  .amount-box .sub-txt{font-size:12px;opacity:.82;margin-top:4px}
  .status-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:800;background:rgba(5,150,105,0.12);color:#059669;border:1px solid rgba(5,150,105,0.25)}
  .footer{background:#f9fafb;padding:16px 32px;font-size:11.5px;color:#9ca3af;text-align:center;border-top:1px solid #f3f4f6}
  @media print{body{padding:0;background:#fff}.wrap{box-shadow:none;border-radius:0}}
</style></head>
<body onload="window.print()">
<div class="wrap">
  <div class="hdr">
    <h1>Subscription Receipt</h1>
    <p>${franchise?.franchiseName || sub.franchiseName} — ${franchise?.franchiseId || sub.franchiseCode}</p>
    <div class="rcpt-no">Receipt No: ${entry.receiptNo}</div>
  </div>
  <div class="body">
    <div class="amount-box">
      <div class="amt">₹${Number(entry.amount || 0).toLocaleString("en-IN")}</div>
      <div class="sub-txt">Payment Amount · ${planName}</div>
    </div>
    <div class="section">
      <div class="section-title">Franchise Details</div>
      <div class="row"><span class="label">Franchise Name</span><span class="value">${franchise?.franchiseName || sub.franchiseName || "—"}</span></div>
      <div class="row"><span class="label">Franchise ID</span><span class="value">${franchise?.franchiseId || sub.franchiseCode || "—"}</span></div>
      <div class="row"><span class="label">Owner</span><span class="value">${franchise?.ownerName || sub.ownerName || "—"}</span></div>
      <div class="row"><span class="label">Contact</span><span class="value">${franchise?.contact || sub.contact || "—"}</span></div>
    </div>
    <div class="section">
      <div class="section-title">Subscription Details</div>
      <div class="row"><span class="label">Plan</span><span class="value">${planName}</span></div>
      <div class="row"><span class="label">Days Added</span><span class="value">${entry.daysAdded} days</span></div>
      <div class="row"><span class="label">Valid From</span><span class="value">${fmt(entry.previousEndDate || sub.startDate)}</span></div>
      <div class="row"><span class="label">Valid Until</span><span class="value">${fmt(entry.newEndDate)}</span></div>
      <div class="row"><span class="label">Payment Date</span><span class="value">${fmtDT(entry.paidAt)}</span></div>
      <div class="row"><span class="label">Processed By</span><span class="value">${entry.createdBy || "Admin"}</span></div>
      ${entry.notes ? `<div class="row"><span class="label">Notes</span><span class="value">${entry.notes}</span></div>` : ""}
    </div>
    <div style="text-align:center;margin-top:8px"><span class="status-badge">✓ Payment Confirmed</span></div>
  </div>
  <div class="footer">This is a computer-generated receipt. No signature required. · Chickoz ERP</div>
</div></body></html>`;
};

/* ─── modal shell ────────────────────────────────────────────────── */
const Modal = ({ title, onClose, children, width = 560 }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,15,15,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
    <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 72px rgba(0,0,0,0.22)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px 18px", borderBottom: "1px solid #f3f4f6" }}>
        <h5 style={{ fontWeight: 800, fontSize: 16, margin: 0, color: "#1A1A1A" }}>{title}</h5>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>×</button>
      </div>
      <div style={{ padding: "22px 28px" }}>{children}</div>
    </div>
  </div>
);

const FL = ({ children, required }) => (
  <label className="form-label" style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
    {children}{required && <span style={{ color: "#D91E18", marginLeft: 3 }}>*</span>}
  </label>
);

/* ════════════════════════════════════════════════════════════════════ */
const Subscription = () => {
  const { subscriptions, loading, fetchSubscriptions, enableSubscription, extendSubscription, suspendSubscription } = useSubscriptionStore();

  /* filters */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const perPage = 15;

  /* modals */
  const [viewItem, setViewItem] = useState(null); // { franchise, subscription }
  const [enableItem, setEnableItem] = useState(null);
  const [extendItem, setExtendItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [suspendItem, setSuspendItem] = useState(null);
  const [suspending, setSuspending] = useState(false);

  /* enable form */
  const [eForm, setEForm] = useState({ plan: "MONTHLY", amount: "", startDate: new Date().toISOString().split("T")[0], notes: "" });
  /* extend form */
  const [xForm, setXForm] = useState({ mode: "plan", plan: "MONTHLY", customDays: "", amount: "", notes: "" });

  useEffect(() => { fetchSubscriptions(); }, []);

  /* ── derived stats ── */
  const all = subscriptions;
  const active = all.filter(r => r.subscription?.status === "ACTIVE").length;
  const expired = all.filter(r => r.subscription?.status === "EXPIRED").length;
  const noSub = all.filter(r => !r.subscription).length;
  const expiring = all.filter(r => {
    const d = daysLeft(r.subscription?.endDate);
    return r.subscription?.status === "ACTIVE" && d !== null && d <= 7 && d > 0;
  }).length;

  /* ── filter + search ── */
  const filtered = all.filter(r => {
    const f = r.franchise;
    const s = r.subscription;
    const q = search.toLowerCase();
    const matchSearch = !q || f.franchiseName?.toLowerCase().includes(q) || f.franchiseId?.toLowerCase().includes(q) || f.ownerName?.toLowerCase().includes(q);
    const matchFilter = filter === "ALL" ||
      (filter === "ACTIVE" && s?.status === "ACTIVE") ||
      (filter === "EXPIRED" && s?.status === "EXPIRED") ||
      (filter === "SUSPENDED" && s?.status === "SUSPENDED") ||
      (filter === "NONE" && !s) ||
      (filter === "EXPIRING" && (() => { const d = daysLeft(s?.endDate); return s?.status === "ACTIVE" && d !== null && d <= 7 && d > 0; })());
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  /* ── actions ── */
  const handleEnable = async () => {
    if (!eForm.plan || !eForm.amount) { toast.error("Fill plan and amount"); return; }
    setSaving(true);
    try {
      await enableSubscription(enableItem.franchise._id, eForm);
      toast.success("Subscription enabled");
      await fetchSubscriptions();
      setEnableItem(null);
    } catch (e) { toast.error(e?.response?.data?.message || "Failed"); }
    setSaving(false);
  };

  const handleExtend = async () => {
    if (!xForm.amount) { toast.error("Enter amount"); return; }
    if (xForm.mode === "plan" && !xForm.plan) { toast.error("Select a plan"); return; }
    if (xForm.mode === "custom" && !xForm.customDays) { toast.error("Enter number of days"); return; }
    setSaving(true);
    try {
      const payload = xForm.mode === "plan"
        ? { plan: xForm.plan, amount: xForm.amount, notes: xForm.notes }
        : { customDays: xForm.customDays, amount: xForm.amount, notes: xForm.notes };
      await extendSubscription(extendItem.franchise._id, payload);
      toast.success("Subscription extended");
      await fetchSubscriptions();
      setExtendItem(null);
    } catch (e) { toast.error(e?.response?.data?.message || "Failed"); }
    setSaving(false);
  };

  const handleSuspendConfirm = async () => {
    setSuspending(true);
    try {
      await suspendSubscription(suspendItem.franchise._id);
      toast.success("Subscription suspended");
      await fetchSubscriptions();
      setSuspendItem(null);
    } catch (e) { toast.error("Failed to suspend"); }
    setSuspending(false);
  };

  const downloadReceipt = (sub, entry, franchise) => {
    const html = buildReceipt(sub, entry, franchise);
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, position: "relative", zIndex: 2 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(217,30,24,0.3)", flexShrink: 0 }}>
          <i className="bx bx-key" style={{ color: "#fff", fontSize: 22 }} />
        </div>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: 20, color: "#1A1A1A", margin: 0 }}>Subscription Management</h4>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Control ERP access for each franchise based on their subscription plan</p>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24, position: "relative", zIndex: 2 }}>
        {[
          { label: "Total Franchises", val: all.length, icon: "bx-store", c1: "#2563eb", c2: "#60a5fa" },
          { label: "Active", val: active, icon: "bx-check-circle", c1: "#059669", c2: "#34d399" },
          { label: "Expired", val: expired, icon: "bx-x-circle", c1: "#D91E18", c2: "#f87171" },
          { label: "No Subscription", val: noSub, icon: "bx-block", c1: "#6b7280", c2: "#9ca3af" },
          { label: "Expiring ≤7 days", val: expiring, icon: "bx-alarm-exclamation", c1: "#d97706", c2: "#fbbf24" },
        ].map(({ label, val, icon, c1, c2 }) => (
          <div key={label} style={{ flex: "1 1 160px", background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${c1},${c2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 10px ${c1}40`, flexShrink: 0 }}>
                <i className={`bx ${icon}`} style={{ color: "#fff", fontSize: 18 }} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#1A1A1A", lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="card" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", animation: "none", position: "relative", zIndex: 1 }}>
        <div className="card-header" style={{ padding: "16px 22px", background: "#fff", borderRadius: "14px 14px 0 0", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h5 style={{ fontWeight: 800, margin: 0, fontSize: 15 }}>Franchise Subscriptions</h5>
              <span style={{ background: "linear-gradient(135deg,#D91E18,#F97316)", color: "#fff", borderRadius: 10, padding: "2px 9px", fontSize: 11, fontWeight: 700, boxShadow: "0 2px 6px rgba(217,30,24,0.3)" }}>{filtered.length}</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div className="position-relative">
                <input className="form-control" style={{ paddingRight: 34, minWidth: 220 }} placeholder="Search franchise…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                <i className="bx bx-search position-absolute" style={{ top: "50%", right: 10, transform: "translateY(-50%)", color: "#adb5bd" }} />
              </div>
              <select className="form-select" style={{ minWidth: 160 }} value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="NONE">No Subscription</option>
                <option value="EXPIRING">Expiring Soon</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
              <div className="spinner-border text-danger mb-3" />
              <div style={{ fontSize: 13, fontWeight: 600 }}>Loading subscriptions…</div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 50, padding: "12px 16px" }}>#</th>
                    <th style={{ padding: "12px 16px" }}>Franchise</th>
                    <th style={{ padding: "12px 16px" }}>Plan</th>
                    <th style={{ padding: "12px 16px" }}>Start Date</th>
                    <th style={{ padding: "12px 16px" }}>End Date</th>
                    <th style={{ padding: "12px 16px" }}>Days Left</th>
                    <th style={{ padding: "12px 16px" }}>Status</th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: "center", padding: "52px 0", color: "#9ca3af" }}>
                      <i className="bx bx-search-alt" style={{ fontSize: 36, display: "block", marginBottom: 8 }} />No records found.
                    </td></tr>
                  ) : paged.map((row, i) => {
                    const f = row.franchise;
                    const s = row.subscription;
                    const canExtend = s && (s.status === "ACTIVE" || s.status === "UPCOMING" || s.status === "EXPIRED");
                    return (
                      <tr key={f._id}>
                        <td style={{ padding: "14px 16px", color: "#9ca3af", fontSize: 13 }}>{(page - 1) * perPage + i + 1}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{f.franchiseName || "—"}</div>
                          <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{f.franchiseId} · {f.ownerName}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {s ? <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}>{PLAN_LABELS[s.plan] || s.plan}</span> : <span style={{ color: "#9ca3af" }}>—</span>}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{fmt(s?.startDate)}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{fmt(s?.endDate)}</td>
                        <td style={{ padding: "14px 16px" }}>{daysLeftPill(s)}</td>
                        <td style={{ padding: "14px 16px" }}>{statusPill(s)}</td>
                        <td style={{ padding: "14px 16px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
                            {/* View */}
                            {s && (
                              <button title="View Details" onClick={() => setViewItem(row)}
                                style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}>
                                <i className="bx bx-show" style={{ fontSize: 16 }} />
                              </button>
                            )}
                            {/* Receipt */}
                            {s?.paymentHistory?.length > 0 && (
                              <button title="Download Latest Receipt"
                                onClick={() => downloadReceipt(s, s.paymentHistory[s.paymentHistory.length - 1], f)}
                                style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.color = "#059669"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}>
                                <i className="bx bx-receipt" style={{ fontSize: 16 }} />
                              </button>
                            )}
                            {/* Enable */}
                            {(!s || s.status === "EXPIRED" || s.status === "SUSPENDED") && (
                              <button title="Enable Subscription"
                                onClick={() => { setEnableItem(row); setEForm({ plan: "MONTHLY", amount: "", startDate: new Date().toISOString().split("T")[0], notes: "" }); }}
                                style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#D91E18,#F97316)", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 8px rgba(217,30,24,0.3)" }}>
                                <i className="bx bx-power-off" style={{ fontSize: 14 }} /> Enable
                              </button>
                            )}
                            {/* Extend */}
                            {canExtend && (s?.status === "ACTIVE" || s?.status === "UPCOMING") && (
                              <button title="Extend Subscription"
                                onClick={() => { setExtendItem(row); setXForm({ mode: "plan", plan: "MONTHLY", customDays: "", amount: "", notes: "" }); }}
                                style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#059669,#34d399)", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 8px rgba(5,150,105,0.3)" }}>
                                <i className="bx bx-plus-circle" style={{ fontSize: 14 }} /> Extend
                              </button>
                            )}
                            {/* Suspend */}
                            {(s?.status === "ACTIVE" || s?.status === "UPCOMING") && (
                              <button title="Suspend"
                                onClick={() => setSuspendItem(row)}
                                style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#7c3aed"; e.currentTarget.style.color = "#7c3aed"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}>
                                <i className="bx bx-pause-circle" style={{ fontSize: 16 }} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", flexWrap: "wrap", gap: 10, borderTop: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
              <ul className="pagination pagination-rounded mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(p => p - 1)}><i className="bx bx-chevron-left" /></button></li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <li key={p} className={`page-item ${page === p ? "active" : ""}`}><button className="page-link" onClick={() => setPage(p)}>{p}</button></li>)}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(p => p + 1)}><i className="bx bx-chevron-right" /></button></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ════════ ENABLE MODAL ════════ */}
      {enableItem && (
        <Modal title={`Enable Subscription — ${enableItem.franchise.franchiseName}`} onClose={() => setEnableItem(null)}>
          <div className="row g-3">
            <div className="col-12">
              <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <i className="bx bx-info-circle" style={{ color: "#F97316", fontSize: 20, flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 13, color: "#92400e" }}>
                  <strong>{enableItem.franchise.franchiseName}</strong> ({enableItem.franchise.franchiseId})<br />
                  <span style={{ fontSize: 12, color: "#b45309" }}>Owner: {enableItem.franchise.ownerName} · {enableItem.franchise.contact}</span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <FL required>Plan</FL>
              <select className="form-select" value={eForm.plan} onChange={e => setEForm(p => ({ ...p, plan: e.target.value }))}>
                {Object.entries(PLAN_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <FL required>Amount (₹)</FL>
              <input type="number" className="form-control" placeholder="0" value={eForm.amount} onChange={e => setEForm(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <FL required>Start Date</FL>
              <input type="date" className="form-control" value={eForm.startDate} onChange={e => setEForm(p => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <FL>End Date (auto)</FL>
              <input className="form-control" readOnly style={{ background: "#f9fafb", color: "#6b7280" }}
                value={eForm.startDate && eForm.plan ? (() => { const d = new Date(eForm.startDate); d.setDate(d.getDate() + PLAN_DAYS[eForm.plan]); return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); })() : "—"} />
            </div>
            <div className="col-12">
              <FL>Notes</FL>
              <textarea className="form-control" rows={2} placeholder="Optional notes…" value={eForm.notes} onChange={e => setEForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="col-12" style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8 }}>
              <button onClick={() => setEnableItem(null)} style={{ padding: "9px 22px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleEnable} disabled={saving} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#D91E18,#F97316)", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 3px 12px rgba(217,30,24,0.3)", opacity: saving ? 0.8 : 1 }}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : <><i className="bx bx-power-off me-1" />Enable Subscription</>}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ════════ EXTEND MODAL ════════ */}
      {extendItem && (
        <Modal title={`Extend Subscription — ${extendItem.franchise.franchiseName}`} onClose={() => setExtendItem(null)}>
          <div className="row g-3">
            {/* current status strip */}
            <div className="col-12">
              <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  {[
                    { label: "Current Plan", val: PLAN_LABELS[extendItem.subscription?.plan] || extendItem.subscription?.plan || "—" },
                    { label: "Expires", val: fmt(extendItem.subscription?.endDate) },
                    { label: "Days Left", val: (() => { const d = daysLeft(extendItem.subscription?.endDate); return d > 0 ? `${d} days` : "Expired"; })() },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A" }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* mode toggle */}
            <div className="col-12">
              <FL required>Extension Type</FL>
              <div style={{ display: "flex", gap: 10 }}>
                {[["plan", "By Plan"], ["custom", "Custom Days"]].map(([v, l]) => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 9, border: `1.5px solid ${xForm.mode === v ? "rgba(37,99,235,0.4)" : "#e5e7eb"}`, background: xForm.mode === v ? "rgba(37,99,235,0.04)" : "#fafafa", cursor: "pointer", flex: 1 }}>
                    <input type="radio" checked={xForm.mode === v} onChange={() => setXForm(p => ({ ...p, mode: v }))} style={{ accentColor: "#2563eb" }} />
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>{l}</span>
                  </label>
                ))}
              </div>
            </div>
            {xForm.mode === "plan" ? (
              <div className="col-12">
                <FL required>Select Plan</FL>
                <select className="form-select" value={xForm.plan} onChange={e => setXForm(p => ({ ...p, plan: e.target.value }))}>
                  {Object.entries(PLAN_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            ) : (
              <div className="col-12">
                <FL required>Number of Days</FL>
                <input type="number" className="form-control" placeholder="e.g. 45" value={xForm.customDays} onChange={e => setXForm(p => ({ ...p, customDays: e.target.value }))} />
              </div>
            )}
            <div className="col-md-6">
              <FL required>Amount (₹)</FL>
              <input type="number" className="form-control" placeholder="0" value={xForm.amount} onChange={e => setXForm(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <FL>New End Date (preview)</FL>
              <input className="form-control" readOnly style={{ background: "#f9fafb", color: "#059669", fontWeight: 700 }}
                value={(() => {
                  const days = xForm.mode === "plan" ? PLAN_DAYS[xForm.plan] : Number(xForm.customDays) || 0;
                  if (!days) return "—";
                  const from = extendItem.subscription?.endDate > new Date() ? new Date(extendItem.subscription.endDate) : new Date();
                  const d = new Date(from); d.setDate(d.getDate() + days);
                  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                })()} />
            </div>
            <div className="col-12">
              <FL>Notes</FL>
              <textarea className="form-control" rows={2} placeholder="Optional notes…" value={xForm.notes} onChange={e => setXForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="col-12" style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8 }}>
              <button onClick={() => setExtendItem(null)} style={{ padding: "9px 22px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleExtend} disabled={saving} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#059669,#34d399)", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 3px 12px rgba(5,150,105,0.3)", opacity: saving ? 0.8 : 1 }}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : <><i className="bx bx-plus-circle me-1" />Extend Subscription</>}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ════════ SUSPEND MODAL ════════ */}
      {suspendItem && (() => {
        const f = suspendItem.franchise;
        return (
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(15,15,15,0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
            animation: "fadeIn 0.18s ease",
          }}>
            <div style={{
              background: "#fff",
              borderRadius: 24,
              padding: "40px 32px 32px",
              maxWidth: 420, width: "100%",
              boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.1)",
              animation: "scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              textAlign: "center",
              position: "relative",
            }}>
              {/* Close */}
              <button
                onClick={() => setSuspendItem(null)}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#f3f4f6", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#9ca3af", fontSize: 20, lineHeight: 1,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                <i className="bx bx-x" />
              </button>

              {/* Icon with pulse rings */}
              <div style={{ position: "relative", display: "inline-flex", marginBottom: 22 }}>
                <div style={{
                  position: "absolute", inset: -10, borderRadius: "50%",
                  border: "1.5px solid rgba(124,58,237,0.18)",
                  animation: "pulseDot 2.2s ease infinite",
                }} />
                <div style={{
                  position: "absolute", inset: -20, borderRadius: "50%",
                  border: "1px solid rgba(124,58,237,0.08)",
                }} />
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 10px 28px rgba(124,58,237,0.38)",
                }}>
                  <i className="bx bx-pause-circle" style={{ color: "#fff", fontSize: 32 }} />
                </div>
              </div>

              <h4 style={{ fontWeight: 800, fontSize: 20, color: "#1A1A1A", margin: "0 0 10px" }}>
                Suspend Subscription?
              </h4>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(124,58,237,0.05)",
                border: "1px solid rgba(124,58,237,0.15)",
                borderRadius: 10, padding: "6px 14px",
                marginBottom: 14,
              }}>
                <span style={{ fontWeight: 800, color: "#7c3aed", fontSize: 12.5 }}>{f.franchiseId}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#d1d5db", flexShrink: 0 }} />
                <span style={{ color: "#374151", fontSize: 12.5, fontWeight: 600 }}>{f.franchiseName}</span>
              </div>

              <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.65, margin: "0 0 18px" }}>
                The franchise will{" "}
                <span style={{ color: "#7c3aed", fontWeight: 700 }}>lose access</span>{" "}
                to the ERP immediately. You can re-enable their subscription at any time.
              </p>

              {/* Info row */}
              <div style={{
                display: "flex", justifyContent: "center", gap: 20,
                background: "rgba(124,58,237,0.04)", borderRadius: 12,
                padding: "10px 16px", marginBottom: 24,
              }}>
                {[
                  { icon: "bx-lock-alt", text: "Access revoked" },
                  { icon: "bx-calendar-x", text: "Timer paused" },
                  { icon: "bx-undo", text: "Re-enable anytime" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>
                    <i className={`bx ${icon}`} style={{ fontSize: 15 }} />
                    {text}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setSuspendItem(null)}
                  style={{
                    flex: 1, padding: "13px 0", borderRadius: 12,
                    border: "1.5px solid #e5e7eb",
                    background: "#f9fafb", color: "#374151",
                    fontWeight: 600, fontSize: 14, cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspendConfirm}
                  disabled={suspending}
                  style={{
                    flex: 1, padding: "13px 0", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "linear-gradient(135deg, rgba(124,58,237,0.92) 0%, rgba(91,33,182,0.96) 100%)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    cursor: suspending ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.42), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    transition: "all 0.15s ease",
                    opacity: suspending ? 0.82 : 1,
                  }}
                  onMouseEnter={e => { if (!suspending) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.56), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.42), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)"; }}
                >
                  {suspending ? (
                    <>
                      <span className="spinner-border spinner-border-sm" style={{ width: 15, height: 15, borderWidth: 2 }} />
                      Suspending...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-pause-circle" style={{ fontSize: 17 }} />
                      Suspend
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════ VIEW MODAL ════════ */}
      {viewItem && (
        <Modal title={`Subscription — ${viewItem.franchise.franchiseName}`} onClose={() => setViewItem(null)} width={680}>
          {(() => {
            const f = viewItem.franchise;
            const s = viewItem.subscription;
            const d = daysLeft(s?.endDate);
            return (
              <div>
                {/* hero */}
                <div style={{ background: "linear-gradient(135deg,#1A1A1A,#2d2d2d)", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="bx bx-store" style={{ color: "#fff", fontSize: 22 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>{f.franchiseName}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{f.franchiseId} · {f.ownerName} · {f.contact}</div>
                    </div>
                    {statusPill(s)}
                  </div>
                  {/* progress bar */}
                  {s && (
                    <div style={{ marginTop: 14 }}>
                      {(() => {
                        const total = PLAN_DAYS[s.plan] || 30;
                        const used = Math.max(0, total - Math.max(0, d || 0));
                        const pct = Math.min(100, Math.round((used / total) * 100));
                        return (
                          <>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#9ca3af", marginBottom: 6 }}>
                              <span>Started {fmt(s.startDate)}</span>
                              <span>{d > 0 ? `${d} days remaining` : "Expired"} · Ends {fmt(s.endDate)}</span>
                            </div>
                            <div style={{ height: 8, background: "rgba(255,255,255,0.12)", borderRadius: 4, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${pct}%`, background: d <= 7 ? "linear-gradient(90deg,#D91E18,#f87171)" : d <= 30 ? "linear-gradient(90deg,#d97706,#fbbf24)" : "linear-gradient(90deg,#059669,#34d399)", borderRadius: 4, transition: "width 0.4s" }} />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
                {/* summary row */}
                {s && (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                    {[
                      { label: "Plan", val: PLAN_LABELS[s.plan] || s.plan },
                      { label: "Start", val: fmt(s.startDate) },
                      { label: "End", val: fmt(s.endDate) },
                      { label: "Payments", val: s.paymentHistory?.length || 0 },
                      { label: "Total Paid", val: `₹${(s.paymentHistory || []).reduce((a, b) => a + (b.amount || 0), 0).toLocaleString("en-IN")}` },
                    ].map(({ label, val }) => (
                      <div key={label} style={{ flex: "1 1 100px", padding: "10px 14px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                        <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A" }}>{val}</div>
                      </div>
                    ))}
                  </div>
                )}
                {/* payment history */}
                {s?.paymentHistory?.length > 0 ? (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>Payment History</div>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0 text-nowrap" style={{ fontSize: 13 }}>
                        <thead className="table-light">
                          <tr>
                            <th>#</th><th>Receipt</th><th>Plan</th><th>Days</th><th>Amount</th><th>Date</th><th>New Expiry</th><th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.paymentHistory.map((h, idx) => (
                            <tr key={idx}>
                              <td style={{ color: "#9ca3af" }}>{idx + 1}</td>
                              <td><span style={{ fontFamily: "monospace", fontSize: 11.5, color: "#374151" }}>{h.receiptNo}</span></td>
                              <td><span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}>{PLAN_LABELS[h.plan] || h.plan}</span></td>
                              <td><strong>+{h.daysAdded}d</strong></td>
                              <td><strong style={{ color: "#059669" }}>₹{Number(h.amount || 0).toLocaleString("en-IN")}</strong></td>
                              <td style={{ color: "#6b7280" }}>{fmtDT(h.paidAt)}</td>
                              <td style={{ color: "#6b7280" }}>{fmt(h.newEndDate)}</td>
                              <td>
                                <button title="Download Receipt" onClick={() => downloadReceipt(s, h, f)}
                                  style={{ width: 28, height: 28, borderRadius: 7, border: "1.5px solid #e5e7eb", background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.color = "#059669"; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}>
                                  <i className="bx bx-download" style={{ fontSize: 14 }} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "#9ca3af", fontSize: 13 }}>No payment history.</div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

    </div>
  );
};

export default Subscription;
