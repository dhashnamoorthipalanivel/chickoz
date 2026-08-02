import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useKishokStore } from "../../../store/store";

const formatLabel = (v) =>
  v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const statusPill = (status) => {
  const map = {
    PENDING: { color: "#6b7280", bg: "rgba(107,114,128,0.09)", border: "rgba(107,114,128,0.22)" },
    ASSIGNED: { color: "#2563eb", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.22)" },
    IN_PROGRESS: { color: "#F97316", bg: "rgba(249,115,22,0.09)", border: "rgba(249,115,22,0.25)" },
    HOLD: { color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.22)" },
    CANCELLED: { color: "#D91E18", bg: "rgba(217,30,24,0.08)", border: "rgba(217,30,24,0.18)" },
    COMPLETED: { color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.2)" },
  };
  const s = map[status] || { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, color: s.color, background: s.bg, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {formatLabel(status)}
    </span>
  );
};

const priorityPill = (priority) => {
  const urgent = priority === "Urgent";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: urgent ? "#D91E18" : "#d97706", background: urgent ? "rgba(217,30,24,0.08)" : "rgba(217,119,6,0.08)", border: `1px solid ${urgent ? "rgba(217,30,24,0.2)" : "rgba(217,119,6,0.22)"}`, whiteSpace: "nowrap" }}>
      {urgent ? <i className="bx bx-time-five" style={{ fontSize: 12 }} /> : <i className="bx bx-check-circle" style={{ fontSize: 12 }} />}
      {priority || "Normal"}
    </span>
  );
};

const statusColor = (s) => ({
  PENDING: "#6b7280", ASSIGNED: "#2563eb", IN_PROGRESS: "#F97316",
  HOLD: "#d97706", CANCELLED: "#D91E18", COMPLETED: "#059669",
})[s] || "#6b7280";

const downloadReceipt = (row) => {
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const fmtL = (v) => v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "—";
  const paid = (row.payments || []).reduce((a, b) => a + Number(b.amount || 0), 0);
  const total = Number(row.cartAmount || 0);
  const pending = Math.max(total - paid, 0);
  const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
  const sColor = statusColor(row.manufactureStatus);

  const payRows = (row.payments || []).map((p, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:#6b7280;">${i + 1}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${fmt(p.paymentDate)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;font-weight:700;color:#059669;">₹${Number(p.amount || 0).toLocaleString()}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">${p.paymentModeName || "—"}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Receipt – ${row.referenceId}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f5f6fa;color:#1A1A1A;padding:24px}
    .page{max-width:680px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.1)}
    .header{background:linear-gradient(135deg,#D91E18 0%,#F97316 100%);padding:28px 32px;color:#fff}
    .brand{font-size:26px;font-weight:900;letter-spacing:-0.5px}
    .brand span{opacity:.7;font-weight:400}
    .rcpt-title{font-size:13px;opacity:.85;margin-top:4px;letter-spacing:1px;text-transform:uppercase}
    .ref-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.35);border-radius:20px;padding:4px 14px;font-size:13px;font-weight:700;margin-top:12px}
    .body{padding:28px 32px}
    .section{margin-bottom:22px}
    .section-title{font-size:11px;font-weight:800;color:#9ca3af;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #f3f4f6}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .field label{font-size:10.5px;font-weight:700;color:#9ca3af;letter-spacing:.5px;text-transform:uppercase;display:block;margin-bottom:3px}
    .field .val{font-size:14px;font-weight:600;color:#1A1A1A}
    .status-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700}
    .pay-bar-wrap{background:#f3f4f6;border-radius:8px;overflow:hidden;height:8px;margin:8px 0 6px}
    .pay-bar{height:100%;border-radius:8px;background:linear-gradient(90deg,#D91E18,#F97316)}
    .pay-bar.full{background:linear-gradient(90deg,#059669,#34d399)}
    .amt-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:10px;background:#f9fafb;margin-bottom:8px}
    .amt-row .lbl{font-size:13px;color:#6b7280}
    .amt-row .val{font-size:15px;font-weight:900}
    table{width:100%;border-collapse:collapse;font-size:13px}
    thead th{background:#f9fafb;padding:10px 12px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;text-align:left}
    .footer{background:#f9fafb;padding:18px 32px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#9ca3af;border-top:1px solid #f3f4f6}
    .payl-note{display:flex;align-items:center;gap:8px;background:rgba(249,115,22,0.07);border:1px solid rgba(249,115,22,0.22);border-radius:8px;padding:10px 14px;font-size:12.5px;color:#92400e;font-weight:600;margin-top:10px}
    @media print{body{padding:0;background:#fff}.page{box-shadow:none;border-radius:0}}
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
      <div>
        <div class="brand">Chickoz <span>Industries</span></div>
        <div class="rcpt-title">Kishok Order Receipt</div>
        <div class="ref-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm1 4v2h8V7H8zm0 4v2h5v-2H8z"/></svg>
          ${row.referenceId || "—"}
        </div>
      </div>
      <div style="text-align:right">
        <div class="status-pill" style="background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.35);color:#fff">
          <span style="width:7px;height:7px;border-radius:50%;background:#fff;display:inline-block"></span>
          ${fmtL(row.manufactureStatus)}
        </div>
        ${row.priority ? `<div style="margin-top:8px;font-size:12px;opacity:.8">${row.priority === "Urgent" ? "⚡" : "✓"} ${row.priority} Priority</div>` : ""}
        <div style="font-size:11px;opacity:.7;margin-top:6px">Generated: ${fmt(new Date())}</div>
      </div>
    </div>
  </div>

  <div class="body">

    <!-- Customer & Order Info -->
    <div class="section">
      <div class="section-title">Customer & Order</div>
      <div class="grid">
        <div class="field"><label>Customer Name</label><div class="val">${row.customerName || "—"}</div></div>
        <div class="field"><label>Phone</label><div class="val">${row.phone || "—"}</div></div>
        <div class="field"><label>Place</label><div class="val">${row.place || "—"}</div></div>
        <div class="field"><label>Created Date</label><div class="val">${fmt(row.createdAt)}</div></div>
      </div>
    </div>

    <!-- Cart Details -->
    <div class="section">
      <div class="section-title">Cart Requirement</div>
      <div class="grid">
        <div class="field"><label>Package</label><div class="val">${row.packageName || "—"}</div></div>
        <div class="field"><label>Cart Size</label><div class="val">${row.cartSize || "—"}</div></div>
        <div class="field"><label>Accessories</label><div class="val">${row.accessories || "—"}</div></div>
        <div class="field"><label>Required Date</label><div class="val">${fmt(row.requiredDate)}</div></div>
        <div class="field"><label>Priority</label><div class="val">${row.priority || "—"}</div></div>
      </div>
    </div>

    ${(row.vendorName) ? `
    <!-- Vendor -->
    <div class="section">
      <div class="section-title">Vendor Details</div>
      <div class="grid">
        <div class="field"><label>Vendor Name</label><div class="val">${row.vendorName}</div></div>
        <div class="field"><label>Vendor Phone</label><div class="val">${row.vendorPhone || "—"}</div></div>
        <div class="field"><label>Assign Date</label><div class="val">${fmt(row.assignDate)}</div></div>
        <div class="field"><label>Expected Delivery</label><div class="val">${fmt(row.expectedDate)}</div></div>
      </div>
    </div>` : ""}

    <!-- Payment Summary -->
    ${total > 0 ? `
    <div class="section">
      <div class="section-title">Payment Summary</div>
      <div class="pay-bar-wrap"><div class="pay-bar ${pct === 100 ? "full" : ""}" style="width:${pct}%"></div></div>
      <div style="font-size:12px;color:#6b7280;margin-bottom:12px;text-align:right">${pct}% paid</div>
      <div class="amt-row"><span class="lbl">Cart Amount</span><span class="val" style="color:#374151">₹${total.toLocaleString()}</span></div>
      <div class="amt-row"><span class="lbl">Paid Amount</span><span class="val" style="color:#059669">₹${paid.toLocaleString()}</span></div>
      <div class="amt-row"><span class="lbl">Pending Amount</span><span class="val" style="color:${pending > 0 ? "#D91E18" : "#059669"}">₹${pending.toLocaleString()}</span></div>
      ${row.payLater && pending > 0 ? `<div class="payl-note">⚠ Pay Later enabled — ₹${pending.toLocaleString()} to be collected from customer.</div>` : ""}
    </div>` : ""}

    ${(row.payments || []).length > 0 ? `
    <!-- Payment History -->
    <div class="section">
      <div class="section-title">Payment History</div>
      <table>
        <thead><tr><th>#</th><th>Date</th><th>Amount</th><th>Mode</th></tr></thead>
        <tbody>${payRows}</tbody>
      </table>
    </div>` : ""}

  </div>

  <!-- Footer -->
  <div class="footer">
    <span>Chickoz Industries — Kishok Division</span>
    <span>Ref: ${row.referenceId || "—"}</span>
  </div>

</div>
<script>window.onload=()=>{window.print();}</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=750,height=900");
  if (!win) { alert("Please allow popups to download the receipt."); return; }
  win.document.write(html);
  win.document.close();
};

const Kiosk = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { kishoks, fetchKishoks } = useKishokStore();

  useEffect(() => { fetchKishoks(); }, []);

  const filtered = kishoks.filter(item =>
    (item.referenceId?.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search) ||
      item.place?.toLowerCase().includes(search.toLowerCase()) ||
      item.vendorName?.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "ALL" || item.manufactureStatus === statusFilter)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">

          {/* ── Page header ── */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", boxShadow: "0 4px 14px rgba(217,30,24,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="bx bx-cart" style={{ color: "#fff", fontSize: 22 }} />
                  </div>
                  <div>
                    <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Kishok Management</h4>
                    <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>Manufacture · Kishok</div>
                  </div>
                </div>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Kishok</li>
                </ol>
              </div>
            </div>
          </div>

          {/* ── Card ── */}
          <div className="row">
            <div className="col-12">
              <div className="card">

                {/* Card header */}
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h4 className="card-title mb-0">Cart Manufacturing Orders</h4>
                      <span style={{ background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color: "#fff", borderRadius: 10, padding: "2px 9px", fontSize: 11, fontWeight: 700, boxShadow: "0 2px 6px rgba(217,30,24,0.3)" }}>
                        {filtered.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-body">

                  {/* ── Filter bar ── */}
                  <div className="row mb-3 g-2 align-items-center">
                    <div className="col-auto d-flex align-items-center gap-2">
                      <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>Show</span>
                      <select className="form-select form-select-sm" style={{ width: 70 }} value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
                        {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>entries</span>
                    </div>

                    <div className="col-sm-12 col-md-4">
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by ref ID, name, phone, place or vendor…"
                          value={search}
                          onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                        <i className="bx bx-search position-absolute" style={{ top: "50%", right: 12, transform: "translateY(-50%)", color: "#adb5bd" }} />
                      </div>
                    </div>

                    <div className="col-sm-6 col-md-2">
                      <select className="form-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="HOLD">Hold</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    <div className="col text-end">
                      <span className="text-muted font-size-13">
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
                      </span>
                    </div>
                  </div>

                  {/* ── Table ── */}
                  <div className="table-responsive" style={{ overflowX: "auto" }}>
                    <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: 50 }}>S.No</th>
                          <th>Reference ID</th>
                          <th>Customer</th>
                          <th>Phone</th>
                          <th>Place</th>
                          <th>Package</th>
                          <th>Cart Size</th>
                          <th>Required Date</th>
                          <th>Priority</th>
                          <th>Vendor</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th className="text-center" style={{ position: "sticky", right: 0, zIndex: 1, background: "#fff", boxShadow: "-1px 0 0 #eff2f7" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paged.length === 0 ? (
                          <tr>
                            <td colSpan="13" className="text-center py-5 text-muted">
                              <i className="bx bx-cart display-4 d-block mb-2" />
                              No cart manufacturing orders found.
                            </td>
                          </tr>
                        ) : paged.map((row, i) => (
                          <tr key={row._id}>
                            <td>{(page - 1) * perPage + i + 1}</td>
                            <td>
                              <span style={{ fontWeight: 700, color: "#D91E18", fontSize: 13 }}>{row.referenceId}</span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1A1A1A" }}>{row.customerName}</div>
                            </td>
                            <td><span style={{ color: "#6b7280" }}>{row.phone}</span></td>
                            <td><span style={{ color: "#6b7280" }}>{row.place}</span></td>
                            <td>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: "#F97316", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)", whiteSpace: "nowrap" }}>
                                <i className="bx bx-package" style={{ fontSize: 12 }} />{row.packageName || "—"}
                              </span>
                            </td>
                            <td><span style={{ fontWeight: 600, color: "#374151" }}>{row.cartSize || "—"}</span></td>
                            <td><span style={{ fontWeight: 600, color: "#374151" }}>{fmtDate(row.requiredDate)}</span></td>
                            <td>{priorityPill(row.priority)}</td>
                            <td>
                              {row.vendorName
                                ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", whiteSpace: "nowrap" }}>
                                  <i className="bx bx-user" style={{ fontSize: 12 }} />{row.vendorName}
                                </span>
                                : <span style={{ color: "#c4cdd6", fontSize: 12 }}>—</span>
                              }
                            </td>
                            <td>{statusPill(row.manufactureStatus)}</td>
                            <td><span style={{ color: "#6b7280", fontSize: 12.5 }}>{fmtDate(row.createdAt)}</span></td>
                            <td style={{ position: "sticky", right: 0, zIndex: 1, background: "#fff", boxShadow: "-1px 0 0 #eff2f7" }}>
                              <div className="d-flex justify-content-center gap-2">
                                <Link
                                  to={`/manufacture-kishok/view/${row._id}`}
                                  state={{ rowData: row }}
                                  className="ckz-action-btn ckz-action-view"
                                  title="View"
                                >
                                  <i className="bx bx-show" />
                                </Link>
                                <Link
                                  to={`/manufacture-kishok/edit/${row._id}`}
                                  state={{ rowData: row }}
                                  className="ckz-action-btn ckz-action-edit"
                                  title="Edit"
                                >
                                  <i className="bx bx-edit-alt" />
                                </Link>
                                <button
                                  onClick={() => downloadReceipt(row)}
                                  title="Download Receipt"
                                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, border: "1.5px solid rgba(5,150,105,0.25)", background: "rgba(5,150,105,0.07)", color: "#059669", cursor: "pointer", fontSize: 15, transition: "all 0.18s" }}
                                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(5,150,105,0.15)"; e.currentTarget.style.borderColor = "rgba(5,150,105,0.5)"; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(5,150,105,0.07)"; e.currentTarget.style.borderColor = "rgba(5,150,105,0.25)"; }}
                                >
                                  <i className="bx bx-receipt" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* ── Pagination ── */}
                  {totalPages > 1 && (
                    <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                      <div className="text-muted font-size-13">
                        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                      </div>
                      <ul className="pagination pagination-rounded mb-0">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setPage(p => p - 1)}>
                            <i className="bx bx-chevron-left" />
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                          <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                          </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setPage(p => p + 1)}>
                            <i className="bx bx-chevron-right" />
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </React.Fragment>
  );
};

export default Kiosk;
