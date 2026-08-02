import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePaymentModes } from "../../../store/store";

const formatLabel = (v) =>
  v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const InfoRow = ({ label, children }) => (
  <div style={{ padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{children || "—"}</div>
  </div>
);

const SectionHeader = ({ icon, title, c1 = "#D91E18", c2 = "#F97316" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #f3f4f6" }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${c1},${c2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 10px ${c1}40`, flexShrink: 0 }}>
      <i className={icon} style={{ color: "#fff", fontSize: 17 }} />
    </div>
    <h5 style={{ fontWeight: 800, fontSize: 15, color: "#1A1A1A", margin: 0 }}>{title}</h5>
  </div>
);

const statusPill = (status) => {
  const map = {
    PENDING:     { color: "#6b7280", bg: "rgba(107,114,128,0.09)", border: "rgba(107,114,128,0.22)" },
    ASSIGNED:    { color: "#2563eb", bg: "rgba(37,99,235,0.08)",   border: "rgba(37,99,235,0.22)"   },
    IN_PROGRESS: { color: "#F97316", bg: "rgba(249,115,22,0.09)",  border: "rgba(249,115,22,0.25)"  },
    HOLD:        { color: "#d97706", bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.22)"   },
    CANCELLED:   { color: "#D91E18", bg: "rgba(217,30,24,0.08)",   border: "rgba(217,30,24,0.18)"   },
    COMPLETED:   { color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.2)"    },
  };
  const s = map[status] || { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 13px", borderRadius: 20, fontSize: 12.5, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
      {formatLabel(status)}
    </span>
  );
};

const KishokView = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const data      = state?.rowData || {};

  const { paymentModes, fetchPaymentModes } = usePaymentModes();
  useEffect(() => { fetchPaymentModes(); }, []);

  const modeName = (id) =>
    paymentModes?.find(m => String(m._id) === String(id))?.paymentName || "—";

  const paidAmount    = (data.payments || []).reduce((a, b) => a + Number(b.amount || 0), 0);
  const cartAmount    = Number(data.cartAmount || 0);
  const pendingAmount = Math.max(cartAmount - paidAmount, 0);
  const payPct        = cartAmount > 0 ? Math.round((paidAmount / cartAmount) * 100) : 0;

  return (
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
                  <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Kishok Detail</h4>
                  <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>Manufacture · Kishok · View</div>
                </div>
              </div>
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item"><Link to="/manufacture-kishok">Kishok</Link></li>
                <li className="breadcrumb-item active">View</li>
              </ol>
            </div>
          </div>
        </div>

        {/* ── Hero summary card ── */}
        <div className="card mb-4" style={{ borderRadius: 16, overflow: "hidden", border: "none", boxShadow: "0 4px 24px rgba(217,30,24,0.12)" }}>
          <div style={{ background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", padding: "24px 28px" }}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 22, margin: 0 }}>{data.customerName || "—"}</h3>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 6, display: "flex", flexWrap: "wrap", gap: "0 18px" }}>
                  <span><i className="bx bx-hash me-1" />Ref: <strong style={{ color: "#fff" }}>{data.referenceId || "—"}</strong></span>
                  <span><i className="bx bx-phone me-1" />{data.phone || "—"}</span>
                  <span><i className="bx bx-map me-1" />{data.place || "—"}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                {statusPill(data.manufactureStatus)}
                {data.priority && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)" }}>
                    {data.priority === "Urgent" ? <i className="bx bx-time-five" /> : <i className="bx bx-check-circle" />}
                    {data.priority}
                  </span>
                )}
              </div>
            </div>
          </div>

          {cartAmount > 0 && (
            <div style={{ padding: "16px 28px", background: "#fff" }}>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: 12.5, fontWeight: 600 }}>
                <span style={{ color: "#6b7280" }}>Payment Progress</span>
                <span style={{ color: payPct === 100 ? "#059669" : "#F97316", fontWeight: 800 }}>{payPct}% paid</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ width: `${payPct}%`, height: "100%", background: payPct === 100 ? "linear-gradient(90deg,#059669,#34d399)" : "linear-gradient(90deg,#D91E18,#F97316)", borderRadius: 10, transition: "width 0.6s ease" }} />
              </div>
              <div className="d-flex gap-4 mt-2" style={{ fontSize: 12.5 }}>
                <span style={{ color: "#6b7280" }}>Total: <strong style={{ color: "#1A1A1A" }}>₹{cartAmount.toLocaleString()}</strong></span>
                <span style={{ color: "#059669" }}>Paid: <strong>₹{paidAmount.toLocaleString()}</strong></span>
                <span style={{ color: "#D91E18" }}>Pending: <strong>₹{pendingAmount.toLocaleString()}</strong></span>
              </div>
            </div>
          )}
        </div>

        <div className="row">

          {/* ── Left col ── */}
          <div className="col-xl-8">

            {/* Cart Requirement */}
            <div className="card" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="card-body" style={{ padding: "22px 24px" }}>
                <SectionHeader icon="bx bx-cart" title="Cart Requirement" />
                <div className="row">
                  <div className="col-md-6">
                    <InfoRow label="Phone">{data.phone}</InfoRow>
                    <InfoRow label="Place">{data.place}</InfoRow>
                    <InfoRow label="Package">
                      {data.packageName && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#F97316", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.22)" }}>
                          <i className="bx bx-package" style={{ fontSize: 11 }} />{data.packageName}
                        </span>
                      )}
                    </InfoRow>
                    <InfoRow label="Cart Size">{data.cartSize}</InfoRow>
                  </div>
                  <div className="col-md-6">
                    <InfoRow label="Accessories">{data.accessories}</InfoRow>
                    <InfoRow label="Required Date">{fmtDate(data.requiredDate)}</InfoRow>
                    <InfoRow label="Priority">
                      {data.priority && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: data.priority === "Urgent" ? "#D91E18" : "#d97706", background: data.priority === "Urgent" ? "rgba(217,30,24,0.08)" : "rgba(217,119,6,0.08)", border: `1px solid ${data.priority === "Urgent" ? "rgba(217,30,24,0.2)" : "rgba(217,119,6,0.22)"}` }}>
                          {data.priority === "Urgent" ? <i className="bx bx-time-five" style={{ fontSize: 11 }} /> : <i className="bx bx-check-circle" style={{ fontSize: 11 }} />}{data.priority}
                        </span>
                      )}
                    </InfoRow>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Assignment */}
            <div className="card" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="card-body" style={{ padding: "22px 24px" }}>
                <SectionHeader icon="bx bx-user-plus" title="Vendor Assignment" c1="#2563eb" c2="#60a5fa" />
                <div className="row">
                  <div className="col-md-6">
                    <InfoRow label="Vendor Name">
                      {data.vendorName
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}><i className="bx bx-user" style={{ fontSize: 11 }} />{data.vendorName}</span>
                        : null}
                    </InfoRow>
                    <InfoRow label="Vendor Phone">{data.vendorPhone}</InfoRow>
                  </div>
                  <div className="col-md-6">
                    <InfoRow label="Assign Date">{fmtDate(data.assignDate)}</InfoRow>
                    <InfoRow label="Expected Delivery">{fmtDate(data.expectedDate)}</InfoRow>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            {data.payments?.length > 0 && (
              <div className="card" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="card-body" style={{ padding: "22px 24px" }}>
                  <SectionHeader icon="bx bx-credit-card" title="Payment History" c1="#059669" c2="#34d399" />
                  <div className="table-responsive">
                    <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: 50 }}>S.No</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Mode</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.payments.map((p, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td><span style={{ color: "#6b7280", fontSize: 13 }}>{fmtDate(p.paymentDate)}</span></td>
                            <td><strong style={{ color: "#059669", fontSize: 14 }}>₹{Number(p.amount || 0).toLocaleString()}</strong></td>
                            <td><span style={{ color: "#374151", fontSize: 13 }}>{modeName(p.paymentMode)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ── Right col ── */}
          <div className="col-xl-4">

            {/* Production */}
            <div className="card" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="card-body" style={{ padding: "22px 24px" }}>
                <SectionHeader icon="bx bx-cog" title="Production" c1="#7c3aed" c2="#a78bfa" />
                <InfoRow label="Production Status">{statusPill(data.manufactureStatus)}</InfoRow>
                <InfoRow label="Dispatch Date">{fmtDate(data.dispatchDate)}</InfoRow>
                {data.cartImageName && (
                  <InfoRow label="Cart Image">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)" }}>
                      <i className="bx bx-image" style={{ fontSize: 11 }} />{data.cartImageName}
                    </span>
                  </InfoRow>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            {cartAmount > 0 && (
              <div className="card" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="card-body" style={{ padding: "22px 24px" }}>
                  <SectionHeader icon="bx bx-wallet" title="Payment Summary" c1="#059669" c2="#34d399" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Total Amount",   value: cartAmount,    color: "#374151" },
                      { label: "Paid Amount",    value: paidAmount,    color: "#059669" },
                      { label: "Pending Amount", value: pendingAmount, color: "#D91E18" },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f9fafb", borderRadius: 10 }}>
                        <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{label}</span>
                        <span style={{ fontSize: 15, fontWeight: 900, color }}>₹{value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="card" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="card-body" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 18px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                >
                  <i className="bx bx-arrow-back" style={{ fontSize: 16 }} /> Back to List
                </button>
                <button
                  onClick={() => navigate(`/manufacture-kishok/edit/${data._id}`, { state: { rowData: data } })}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(217,30,24,0.28)" }}
                >
                  <i className="bx bx-edit-alt" style={{ fontSize: 16 }} /> Edit Record
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default KishokView;
