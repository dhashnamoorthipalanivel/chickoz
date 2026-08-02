import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLeadStore, usePaymentModes } from "../../../store/store";

const STAGES = [
  { key: "SITE_VISIT", label: "Site Visit", icon: "bx-map" },
  { key: "APPROVAL", label: "Approval", icon: "bx-check-shield" },
  { key: "TRAINING", label: "Training", icon: "bx-book" },
  { key: "PAYMENT", label: "Payment", icon: "bx-credit-card" },
  { key: "FINAL_SETUP", label: "Final Setup", icon: "bx-store" },
];

const formatLabel = (value) =>
  value?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const getCompletedStages = (stagesObj) => {
  const completed = [];
  if (stagesObj?.SITE_VISIT?.data?.visitType && stagesObj?.SITE_VISIT?.data?.visitDate && stagesObj?.SITE_VISIT?.data?.location)
    completed.push("SITE_VISIT");
  if (stagesObj?.APPROVAL?.data?.siteStatus === "Approved" && stagesObj?.APPROVAL?.data?.approvalStatus === "Approved" && stagesObj?.APPROVAL?.data?.legalStatus === "Completed")
    completed.push("APPROVAL");
  if (stagesObj?.TRAINING?.data?.trainingStatus === "Completed")
    completed.push("TRAINING");
  const total = Number(stagesObj?.PAYMENT?.data?.totalAmount || 0);
  const paid = (stagesObj?.PAYMENT?.data?.payments || []).reduce((a, b) => a + Number(b.amount || 0), 0);
  if (stagesObj?.PAYMENT?.data?.payLater || (total > 0 && paid >= total)) completed.push("PAYMENT");
  if (stagesObj?.FINAL_SETUP?.data?.contractSigned === "Yes") completed.push("FINAL_SETUP");
  return completed;
};

const LEAD_STATUS_STYLE = {
  NOT_STARTED: { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" },
  IN_PROGRESS: { color: "#2563EB", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.18)" },
  COMPLETED: { color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.18)" },
  HOLD: { color: "#D97706", bg: "rgba(217,119,6,0.09)", border: "rgba(217,119,6,0.2)" },
  CANCELLED: { color: "#991B1B", bg: "rgba(153,27,27,0.08)", border: "rgba(153,27,27,0.18)" },
  RETURN: { color: "#0891B2", bg: "rgba(8,145,178,0.08)", border: "rgba(8,145,178,0.18)" },
};

const getLeadStatus = (completedStages) => {
  if (completedStages.length === 0) return "NOT_STARTED";
  if (completedStages.length === STAGES.length) return "COMPLETED";
  return "IN_PROGRESS";
};

// A single label-value row for stage data display
const DataRow = ({ label, value, highlight }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", borderBottom: "1px solid #f5f5f5" }}>
    <span style={{ minWidth: 160, fontSize: 12, color: "#9ca3af", fontWeight: 600, paddingTop: 1 }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: highlight ? 700 : 500, color: highlight ? "#1A1A1A" : "#374151", flex: 1 }}>
      {value || "—"}
    </span>
  </div>
);

// Stage data panels per stage key
const SiteVisitData = ({ data }) => (
  <div>
    <DataRow label="Visit Type" value={data.visitType} highlight />
    <DataRow label="Visit Date" value={fmtDate(data.visitDate)} />
    <DataRow label="Location" value={data.location} highlight />
    <DataRow label="Delivery Location" value={data.deliveryLocation} />
  </div>
);

const ApprovalData = ({ data }) => (
  <div>
    <DataRow label="Site Status" value={data.siteStatus} highlight />
    <DataRow label="Approval Status" value={data.approvalStatus} highlight />
    <DataRow label="Legal Formalities" value={data.legalStatus} />
  </div>
);

const TrainingData = ({ data }) => {
  const cartYes = data.cartRequired === "yes" || data.cartRequired === true;
  return (
    <div>
      <DataRow label="Training Status" value={data.trainingStatus} highlight />
      <DataRow label="Training Start" value={fmtDate(data.trainingStart)} />
      <DataRow label="Parent Details" value={data.parentsDetails} />
      <DataRow label="Cart Required" value={cartYes ? "Yes" : data.cartRequired === "no" ? "No" : "—"} />
      {cartYes && (
        <>
          <DataRow label="Cart Size" value={data.cartSize} />
          <DataRow label="Accessories" value={data.accessories} />
          <DataRow label="Cart Required Date" value={fmtDate(data.cartRequiredDate)} />
          <DataRow label="Priority" value={data.cartPriority} highlight />
          <DataRow label="Cart Manufacture" value={formatLabel(data.cartManufactureStatus)} />
        </>
      )}
    </div>
  );
};

const PaymentData = ({ data, paymentModes = [] }) => {
  const payments = data.payments || [];
  const paidAmount = data.paidAmount ?? payments.reduce((a, b) => a + Number(b.amount || 0), 0);
  const total = Number(data.totalAmount || 0);
  const pending = data.pendingAmount ?? Math.max(total - paidAmount, 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          { label: "Total Amount", value: `₹ ${total.toLocaleString()}`, color: "#1A1A1A" },
          { label: "Paid", value: `₹ ${Number(paidAmount).toLocaleString()}`, color: "#059669" },
          { label: "Pending", value: `₹ ${Number(pending).toLocaleString()}`, color: pending > 0 ? "#D91E18" : "#059669" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ flex: 1, minWidth: 100, padding: "10px 14px", borderRadius: 12, background: "#f9fafb", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {data.payLater && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", marginBottom: 14 }}>
          <i className="bx bx-error-circle" style={{ color: "#ea580c", fontSize: 18 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#9a3412" }}>Pay Later Enabled — Payment pending collection.</span>
        </div>
      )}
      {payments.length > 0 ? (
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Payment History</div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #f0f0f0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["#", "Date", "Mode", "Amount"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textAlign: "left", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} style={{ borderBottom: i < payments.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                    <td style={{ padding: "8px 12px", fontSize: 12.5, color: "#6b7280" }}>{i + 1}</td>
                    <td style={{ padding: "8px 12px", fontSize: 12.5 }}>{fmtDate(p.date)}</td>
                    <td style={{ padding: "8px 12px", fontSize: 12.5 }}>{paymentModes.find(m => String(m._id) === String(p.paymentMode))?.paymentName || p.paymentMode || "—"}</td>
                    <td style={{ padding: "8px 12px", fontSize: 12.5, fontWeight: 700, color: "#059669" }}>₹ {Number(p.amount || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 12.5, color: "#9ca3af", fontStyle: "italic" }}>No payment entries yet.</div>
      )}
    </div>
  );
};

const FinalSetupData = ({ data }) => (
  <div>
    <DataRow label="Contract Signed" value={data.contractSigned} highlight />
    <DataRow label="Bank Account Number" value={data.bankDetails} />
    <DataRow label="Bank Account Holder Name" value={data.bankAccountHolderName} />
    <DataRow label="Bank Name" value={data.bankName} />
    <DataRow label="Bank IFSC Code" value={data.bankIfscCode} />
    <DataRow label="Draft Amount" value={data.draftAmount} />
    <DataRow label="E-Way Bill" value={data.ewayBillFileName || (data.ewayBillFile ? "Uploaded" : null)} />
    <DataRow label="KYC Document" value={data.kycDocumentName || (data.kycDocument ? "Uploaded" : null)} />
    <DataRow label="Royalty Document" value={data.royaltyDocumentName || (data.royaltyDocument ? "Uploaded" : null)} />
  </div>
);

const StageDataPanel = ({ stage, stageObj, isDone, isCurrent, paymentModes }) => {
  const data = stageObj?.data || {};
  const hasAnyData = Object.entries(data).some(([, v]) =>
    v !== "" && v !== null && v !== undefined && v !== 0 && !(Array.isArray(v) && v.length === 0)
  );

  const borderColor = isDone ? "rgba(5,150,105,0.22)" : isCurrent ? "rgba(37,99,235,0.22)" : "#efefef";
  const headerBg = isDone ? "rgba(5,150,105,0.04)" : isCurrent ? "rgba(37,99,235,0.04)" : "#fafafa";
  const iconColor = isDone ? "#059669" : isCurrent ? "#2563EB" : "#d1d5db";
  const iconBg = isDone ? "rgba(5,150,105,0.1)" : isCurrent ? "rgba(37,99,235,0.1)" : "#f3f4f6";

  return (
    <div style={{ borderRadius: 14, border: `1.5px solid ${borderColor}`, overflow: "hidden", background: "#fff" }}>
      {/* Stage header */}
      <div style={{ padding: "14px 18px", background: headerBg, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {isDone
            ? <i className="bx bx-check" style={{ fontSize: 20, color: "#059669" }} />
            : <i className={`bx ${stage.icon}`} style={{ fontSize: 18, color: iconColor }} />
          }
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1A1A1A" }}>{stage.label}</div>
        </div>
        <div>
          {isDone && (
            <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(5,150,105,0.1)", color: "#059669", border: "1px solid rgba(5,150,105,0.2)" }}>Completed</span>
          )}
          {isCurrent && !isDone && (
            <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(37,99,235,0.1)", color: "#2563EB", border: "1px solid rgba(37,99,235,0.2)" }}>In Progress</span>
          )}
          {!isDone && !isCurrent && (
            <span style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#f9fafb", color: "#9ca3af", border: "1px solid #e5e7eb" }}>Pending</span>
          )}
        </div>
      </div>

      {/* Stage data */}
      {hasAnyData ? (
        <div style={{ padding: "14px 18px" }}>
          {stage.key === "SITE_VISIT" && <SiteVisitData data={data} />}
          {stage.key === "APPROVAL" && <ApprovalData data={data} />}
          {stage.key === "TRAINING" && <TrainingData data={data} />}
          {stage.key === "PAYMENT" && <PaymentData data={data} paymentModes={paymentModes} />}
          {stage.key === "FINAL_SETUP" && <FinalSetupData data={data} />}
        </div>
      ) : (
        <div style={{ padding: "12px 18px", fontSize: 12.5, color: "#9ca3af", fontStyle: "italic" }}>
          No data entered for this stage yet.
        </div>
      )}
    </div>
  );
};

const LeadView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchLeadById } = useLeadStore();
  const { paymentModes, fetchPaymentModes } = usePaymentModes();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentModes();
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchLeadById(id);
        setLead(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="page-content">
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: 320 }}>
          <div className="spinner-border" style={{ color: "#2563EB" }} />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="page-content">
        <div className="container-fluid text-center py-5">
          <i className="bx bx-error display-3 text-muted d-block mb-2" />
          <p className="text-muted">Lead not found.</p>
          <Link to="/crm-lead" className="btn btn-primary btn-sm">Back to Leads</Link>
        </div>
      </div>
    );
  }

  const completedStages = getCompletedStages(lead.stages);
  const leadStatus = lead.leadStatus === "NEW" ? getLeadStatus(completedStages) : (lead.leadStatus || "NOT_STARTED");
  const progress = Math.round((completedStages.length / STAGES.length) * 100);
  const statusStyle = LEAD_STATUS_STYLE[leadStatus] || LEAD_STATUS_STYLE.NOT_STARTED;
  const initials = (lead.name || "?")[0].toUpperCase();

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">

          {/* Top bar */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={() => navigate("/crm-lead")}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      border: "1.5px solid #e5e7eb", background: "#f9fafb",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.15s ease", color: "#374151",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                  >
                    <i className="bx bx-arrow-back" style={{ fontSize: 18 }} />
                  </button>
                  <div>
                    <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Lead Details</h4>
                    <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 1 }}>
                      CRM · Leads · {lead.referenceId}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/crm-lead/${lead._id}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "9px 20px", borderRadius: 10,
                    background: "linear-gradient(135deg, rgba(37,99,235,0.92) 0%, rgba(124,58,237,0.96) 100%)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)",
                    color: "#fff", WebkitTextFillColor: "#fff", fontWeight: 700, fontSize: 13.5,
                    textDecoration: "none", transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(37,99,235,0.45), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)"; }}
                >
                  <i className="bx bx-folder-open" style={{ fontSize: 17, color: "#fff" }} />
                  Open Stage Workflow
                </Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card" style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "none" }}>

                {/* Dark header band */}
                <div style={{
                  background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
                  padding: "26px 28px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 54, height: 54, borderRadius: 15,
                      background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                      boxShadow: "0 4px 14px rgba(37,99,235,0.45)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, fontWeight: 800, color: "#fff",
                    }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{lead.name}</div>
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                        {lead.referenceId}{lead.phone && ` · ${lead.phone}`}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                      color: statusStyle.color, background: statusStyle.bg, border: `1px solid ${statusStyle.border}`,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusStyle.color }} />
                      {formatLabel(leadStatus)}
                    </span>
                    {lead.isFranchiseCreated && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                        color: "#059669", background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.28)",
                      }}>
                        <i className="bx bx-store" style={{ fontSize: 13 }} /> Franchise Created
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-body" style={{ padding: "24px 28px" }}>

                  {/* Info grid */}
                  <div className="row g-3 mb-4">
                    {[
                      { icon: "bx-phone", label: "Phone", value: lead.phone },
                      { icon: "bx-map-pin", label: "Place", value: lead.place },
                      { icon: "bx-user", label: "Assigned To", value: lead.assignedTo },
                      { icon: "bx-calendar", label: "Created", value: fmtDate(lead.createdAt) },
                    ].map(({ icon, label, value }) => (
                      <div className="col-sm-6 col-md-3" key={label}>
                        <div style={{ padding: "13px 15px", borderRadius: 13, background: "#f9fafb", border: "1px solid #f0f0f0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                            <i className={`bx ${icon}`} style={{ fontSize: 14, color: "#9ca3af" }} />
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
                          </div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1A1A" }}>{value || "—"}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>Overall Progress</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: progress === 100 ? "#059669" : "#2563EB" }}>{progress}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 99, background: "#f3f4f6", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 99,
                        width: `${progress}%`,
                        background: progress === 100 ? "#059669" : "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <div style={{ marginTop: 6, fontSize: 11.5, color: "#9ca3af" }}>
                      {completedStages.length} of {STAGES.length} stages completed
                    </div>
                  </div>

                  {/* Pipeline (visual only) */}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 18 }}>Stage Pipeline</div>
                    <div style={{ display: "flex", overflowX: "auto", paddingBottom: 4 }}>
                      {STAGES.map((stage, idx) => {
                        const isDone = completedStages.includes(stage.key);
                        const isCurrent = !isDone && (idx === 0 || completedStages.includes(STAGES[idx - 1]?.key));
                        const prevDone = idx > 0 && completedStages.includes(STAGES[idx - 1]?.key);
                        return (
                          <div key={stage.key} style={{ flex: 1, minWidth: 110, position: "relative" }}>
                            {idx > 0 && (
                              <div style={{ position: "absolute", top: 26, left: 0, width: "50%", height: 2, zIndex: 0, background: prevDone ? "#059669" : "#e5e7eb" }} />
                            )}
                            {idx < STAGES.length - 1 && (
                              <div style={{ position: "absolute", top: 26, right: 0, width: "50%", height: 2, zIndex: 0, background: isDone ? "#059669" : "#e5e7eb" }} />
                            )}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 6px", textAlign: "center", position: "relative", zIndex: 0 }}>
                              <div style={{
                                width: 52, height: 52, borderRadius: 15,
                                background: isDone ? "linear-gradient(135deg, #059669 0%, #047857 100%)" : isCurrent ? "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" : "#f3f4f6",
                                border: isDone || isCurrent ? "none" : "2px solid #e5e7eb",
                                boxShadow: isDone ? "0 4px 12px rgba(5,150,105,0.3)" : isCurrent ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: 8, transition: "all 0.2s ease",
                              }}>
                                {isDone
                                  ? <i className="bx bx-check" style={{ fontSize: 24, color: "#fff" }} />
                                  : <i className={`bx ${stage.icon}`} style={{ fontSize: 20, color: isCurrent ? "#fff" : "#d1d5db" }} />
                                }
                              </div>
                              <div style={{ fontSize: 11.5, fontWeight: isDone || isCurrent ? 700 : 500, color: isDone ? "#059669" : isCurrent ? "#2563EB" : "#9ca3af" }}>
                                {stage.label}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stage data cards */}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>Stage Details</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {STAGES.map((stage, idx) => {
                        const isDone = completedStages.includes(stage.key);
                        const isCurrent = !isDone && (idx === 0 || completedStages.includes(STAGES[idx - 1]?.key));
                        return (
                          <StageDataPanel
                            key={stage.key}
                            stage={stage}
                            stageObj={lead.stages?.[stage.key]}
                            isDone={isDone}
                            isCurrent={isCurrent}
                            paymentModes={paymentModes}
                          />
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </React.Fragment>
  );
};

export default LeadView;
