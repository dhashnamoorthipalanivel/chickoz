import React from "react";
import { toast } from "react-toastify";

const SectionHeader = ({ icon, title, c1 = "#D91E18", c2 = "#F97316" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #f3f4f6" }}>
    <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${c1},${c2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 10px ${c1}38`, flexShrink: 0 }}>
      <i className={icon} style={{ color: "#fff", fontSize: 16 }} />
    </div>
    <h5 style={{ fontWeight: 800, fontSize: 15, color: "#1A1A1A", margin: 0 }}>{title}</h5>
  </div>
);

const FieldLabel = ({ children, required }) => (
  <label className="form-label" style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
    {children}{required && <span style={{ color: "#D91E18", marginLeft: 3 }}>*</span>}
  </label>
);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const KishokStageForm = ({ activeStage, stages, formData, setFormData, paymentModes }) => {
  const stage    = stages[activeStage];
  const isLocked =
    ["HOLD", "RETURN", "CANCELLED"].includes(formData?.leadStatus) ||
    formData?.isFranchiseCreated;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const paidAmount  = (formData?.payments || []).reduce((a, b) => a + Number(b.amount || 0), 0);
  const cartAmount  = Number(formData?.cartAmount ?? 0);
  const isFullyPaid = cartAmount > 0 && paidAmount >= cartAmount;
  const pending     = Math.max(cartAmount - paidAmount, 0);

  return (
    <div className="card" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <div className="card-body" style={{ padding: "24px 26px", pointerEvents: isLocked ? "none" : "auto", opacity: isLocked ? 0.8 : 1 }}>

        {isLocked && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(217,30,24,0.07)", border: "1px solid rgba(217,30,24,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
            <i className="bx bx-lock-alt" style={{ color: "#D91E18", fontSize: 20, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: "#D91E18", fontWeight: 600 }}>
              {formData?.isFranchiseCreated
                ? "Franchise already created — editing is disabled."
                : `Lead is ${formData?.leadStatus} — editing is disabled.`}
            </span>
          </div>
        )}

        <div className="row g-3">

          {/* ── REQUIREMENT ── */}
          {stage === "REQUIREMENT" && (
            <>
              <div className="col-12">
                <SectionHeader icon="bx bx-cart" title="Cart Requirement" />
              </div>

              <div className="col-md-6">
                <FieldLabel>Reference ID</FieldLabel>
                <input className="form-control" value={formData.referenceId || ""} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              <div className="col-md-6">
                <FieldLabel>Customer Name</FieldLabel>
                <input className="form-control" value={formData.customerName || ""} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              <div className="col-md-6">
                <FieldLabel>Place</FieldLabel>
                <input className="form-control" value={formData.place || ""} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              <div className="col-md-6">
                <FieldLabel>Package</FieldLabel>
                <input className="form-control" value={formData.packageName || ""} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              <div className="col-md-6">
                <FieldLabel>Cart Size</FieldLabel>
                <input className="form-control" value={formData.cartSize || ""} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              <div className="col-md-6">
                <FieldLabel>Branding Type</FieldLabel>
                <input className="form-control" value={formData.brandingType || ""} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              <div className="col-md-6">
                <FieldLabel>Accessories</FieldLabel>
                <input className="form-control" value={formData.accessories || ""} readOnly style={{ background: "#f9fafb", color: "#6b7280" }} />
              </div>

              <div className="col-md-6">
                <FieldLabel required>Required Date</FieldLabel>
                <input
                  type="date"
                  name="requiredDate"
                  className="form-control"
                  readOnly
                  style={{ background: "#f9fafb", color: "#6b7280" }}
                  value={formData.requiredDate ? new Date(formData.requiredDate).toISOString().split("T")[0] : ""}
                />
              </div>

              <div className="col-md-6">
                <FieldLabel required>Priority</FieldLabel>
                <select name="priority" className="form-select" value={formData.priority || ""} onChange={handleChange} disabled>
                  <option value="">Select</option>
                  <option>Normal</option>
                  <option>Urgent</option>
                </select>
              </div>
            </>
          )}

          {/* ── VENDOR ASSIGN ── */}
          {stage === "VENDOR_ASSIGN" && (
            <>
              <div className="col-12">
                <SectionHeader icon="bx bx-user-plus" title="Vendor Assignment" c1="#2563eb" c2="#60a5fa" />
              </div>

              <div className="col-md-6">
                <FieldLabel required>Vendor Name</FieldLabel>
                <input type="text" name="vendorName" value={formData.vendorName || ""} className="form-control" onChange={handleChange} placeholder="Enter vendor name" />
              </div>

              <div className="col-md-6">
                <FieldLabel>Vendor Phone</FieldLabel>
                <input type="text" name="vendorPhone" value={formData.vendorPhone || ""} className="form-control" onChange={handleChange} placeholder="Enter vendor phone" />
              </div>

              <div className="col-md-6">
                <FieldLabel required>Assign Date</FieldLabel>
                <input
                  type="date"
                  name="assignDate"
                  className="form-control"
                  value={formData.assignDate ? new Date(formData.assignDate).toISOString().split("T")[0] : ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <FieldLabel required>Expected Delivery</FieldLabel>
                <input
                  type="date"
                  name="expectedDate"
                  className="form-control"
                  value={formData.expectedDate ? new Date(formData.expectedDate).toISOString().split("T")[0] : ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* ── PRODUCTION ── */}
          {stage === "PRODUCTION" && (
            <>
              <div className="col-12">
                <SectionHeader icon="bx bx-cog" title="Production" c1="#7c3aed" c2="#a78bfa" />
              </div>

              <div className="col-md-6">
                <FieldLabel required>Manufacture Status</FieldLabel>
                <select name="manufactureStatus" value={formData.manufactureStatus || ""} className="form-select" onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="HOLD">Hold</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="col-md-6">
                <FieldLabel required>Dispatch Date</FieldLabel>
                <input
                  type="date"
                  name="dispatchDate"
                  className="form-control"
                  value={formData.dispatchDate ? new Date(formData.dispatchDate).toISOString().split("T")[0] : ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <FieldLabel required>Cart Image</FieldLabel>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setFormData(prev => ({ ...prev, cartImage: file, cartImageName: file.name }));
                  }}
                />
                {(formData.cartImageName || formData.cartImage) && (
                  <div className="mt-2">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.22)" }}>
                      <i className="bx bx-check-circle" style={{ fontSize: 14 }} />
                      {formData.cartImageName || (typeof formData.cartImage === "string" ? formData.cartImage : formData.cartImage?.name)}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── PAYMENT ── */}
          {stage === "PAYMENT" && (
            <>
              <div className="col-12">
                <SectionHeader icon="bx bx-credit-card" title="Payment" c1="#059669" c2="#34d399" />
              </div>

              {/* ── Pay Later toggle ── */}
              <div className="col-12">
                <label
                  style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${formData.payLater ? "rgba(249,115,22,0.4)" : "#e5e7eb"}`, background: formData.payLater ? "rgba(249,115,22,0.05)" : "#fafafa", cursor: "pointer", transition: "all 0.2s", userSelect: "none" }}
                >
                  {/* Custom toggle */}
                  <div style={{ position: "relative", flexShrink: 0, marginTop: 1 }}>
                    <input
                      type="checkbox"
                      checked={!!formData.payLater}
                      onChange={e => setFormData(prev => ({ ...prev, payLater: e.target.checked }))}
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                    />
                    <div style={{ width: 42, height: 24, borderRadius: 12, background: formData.payLater ? "linear-gradient(135deg,#D91E18,#F97316)" : "#d1d5db", transition: "background 0.25s", display: "flex", alignItems: "center", padding: "0 3px" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transform: formData.payLater ? "translateX(18px)" : "translateX(0)", transition: "transform 0.25s" }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: formData.payLater ? "#D91E18" : "#374151" }}>
                      Pay Later
                    </div>
                    <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>
                      {formData.payLater
                        ? "Order can be marked complete without full payment. Payment can still be collected later."
                        : "Enable to allow completing this order before full payment is received."}
                    </div>
                  </div>
                </label>

                {formData.payLater && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.22)" }}>
                    <i className="bx bx-info-circle" style={{ color: "#F97316", fontSize: 18, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>
                      Pay Later is active — this order can be completed with a pending balance. Ensure payment is collected from the customer.
                    </span>
                  </div>
                )}
              </div>

              {/* Payment summary strip */}
              <div className="col-12">
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
                  {[
                    { label: "Cart Amount",    value: cartAmount,  color: "#374151" },
                    { label: "Paid",           value: paidAmount,  color: "#059669" },
                    { label: "Pending",        value: pending,     color: pending > 0 ? "#D91E18" : "#059669" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ flex: "1 1 120px", padding: "10px 14px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color }}>₹{Number(value || 0).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {!isFullyPaid && (
                <>
                  <div className="col-md-6">
                    <FieldLabel required>Amount</FieldLabel>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.tempAmount || ""}
                      placeholder={`Max ₹${pending.toLocaleString()}`}
                      onChange={e => setFormData(prev => ({ ...prev, tempAmount: e.target.value }))}
                    />
                  </div>

                  <div className="col-md-6">
                    <FieldLabel required>Payment Date</FieldLabel>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.tempDate || ""}
                      onChange={e => setFormData(prev => ({ ...prev, tempDate: e.target.value }))}
                    />
                  </div>

                  <div className="col-md-6">
                    <FieldLabel required>Payment Mode</FieldLabel>
                    <select
                      className="form-select"
                      value={formData.tempPaymentMode || ""}
                      onChange={e => setFormData(prev => ({ ...prev, tempPaymentMode: e.target.value }))}
                    >
                      <option value="">Select Mode</option>
                      {paymentModes?.length > 0
                        ? paymentModes.map(m => <option key={m._id} value={m._id}>{m.paymentName}</option>)
                        : <option disabled>No Payment Modes</option>}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <FieldLabel>{" "}</FieldLabel>
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.tempAmount || !formData.tempDate || !formData.tempPaymentMode) {
                          toast.error("Please fill all payment fields"); return;
                        }
                        const entered = Number(formData.tempAmount);
                        if (entered > pending) { toast.error("Amount exceeds pending amount"); return; }

                        const newPayment = { amount: entered, paymentDate: formData.tempDate, paymentMode: formData.tempPaymentMode || null };
                        const updatedPayments = [...(formData.payments || []), newPayment];
                        const updatedPaid     = updatedPayments.reduce((a, b) => a + Number(b.amount || 0), 0);

                        setFormData(prev => ({
                          ...prev,
                          payments:      updatedPayments,
                          paidAmount:    updatedPaid,
                          pendingAmount: Number(prev.cartAmount || 0) - updatedPaid,
                          tempAmount:    "",
                          tempDate:      "",
                          tempPaymentMode: "",
                        }));
                      }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "10px 16px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#059669,#34d399)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 3px 10px rgba(5,150,105,0.25)" }}
                    >
                      <i className="bx bx-plus-circle" style={{ fontSize: 16 }} /> Add Payment
                    </button>
                  </div>
                </>
              )}

              {isFullyPaid && (
                <div className="col-12">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 10, padding: "12px 16px" }}>
                    <i className="bx bx-check-circle" style={{ color: "#059669", fontSize: 22 }} />
                    <span style={{ fontSize: 14, color: "#059669", fontWeight: 700 }}>Payment fully collected. No pending amount.</span>
                  </div>
                </div>
              )}

              {/* Payment history table */}
              {(formData.payments || []).length > 0 && (
                <div className="col-12">
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>Payment History</div>
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
                        {(formData.payments || []).map((p, i) => (
                          <tr key={i}>
                            <td style={{ color: "#6b7280" }}>{i + 1}</td>
                            <td style={{ color: "#6b7280", fontSize: 13 }}>{fmtDate(p.paymentDate)}</td>
                            <td><strong style={{ color: "#059669" }}>₹{Number(p.amount || 0).toLocaleString()}</strong></td>
                            <td style={{ color: "#374151", fontSize: 13 }}>{paymentModes?.find(x => String(x._id) === String(p.paymentMode))?.paymentName || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default KishokStageForm;
