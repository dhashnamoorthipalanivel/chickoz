import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import KishokStageForm from "./KishokStageForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useKishokStore, usePaymentModes } from "../../../store/store";

const stages = [
  { key: "REQUIREMENT", icon: "bx bx-cart", label: "Requirement" },
  { key: "VENDOR_ASSIGN", icon: "bx bx-user-plus", label: "Vendor Assign" },
  { key: "PRODUCTION", icon: "bx bx-cog", label: "Production" },
  { key: "PAYMENT", icon: "bx bx-credit-card", label: "Payment" },
];

const formatLabel = (v) =>
  v?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";

const KishokWizardForm = () => {
  const [activeStage, setActiveStage] = useState(0);
  const { state } = useLocation();
  const navigate = useNavigate();
  const rowData = state?.rowData;

  const [formData, setFormData] = useState({});
  const isLocked =
    ["HOLD", "RETURN", "CANCELLED"].includes(formData?.leadStatus) ||
    formData?.isFranchiseCreated;

  const { paymentModes, fetchPaymentModes } = usePaymentModes();
  useEffect(() => { fetchPaymentModes(); }, []);

  const { saveKishok } = useKishokStore();

  useEffect(() => {
    if (!rowData) return;
    setFormData(rowData);

    const completed = rowData.completedStages || [];
    const stageKeys = stages.map(s => s.key);
    let openStage = 0;

    for (let i = 0; i < stageKeys.length; i++) {
      const key = stageKeys[i];

      if (key === "PRODUCTION") {
        if (rowData.manufactureStatus !== "COMPLETED") { openStage = i; break; }
        continue;
      }
      if (key === "PAYMENT") {
        const total = Number(rowData.cartAmount || 0);
        const paid = (rowData.payments || []).reduce((a, b) => a + Number(b.amount || 0), 0);
        if (paid < total) { openStage = i; break; }
        continue;
      }
      if (!completed.includes(key)) { openStage = i; break; }
    }

    setActiveStage(openStage);
  }, [rowData]);

  const stageRequiredFields = {
    REQUIREMENT: ["requiredDate", "priority"],
    VENDOR_ASSIGN: ["vendorName", "assignDate", "expectedDate"],
    PRODUCTION: ["manufactureStatus", "dispatchDate", "cartImage"],
    PAYMENT: ["payments"],
  };

  const getStageStatus = (stageKey) => {
    const completedStages = formData.completedStages || [];

    if (stageKey === "PAYMENT") {
      if (formData.payLater) return "completed";
      const total = Number(formData.cartAmount || 0);
      const paid = (formData.payments || []).reduce((a, b) => a + Number(b.amount || 0), 0);
      if (paid === 0) return "not-started";
      if (paid < total) return "in-progress";
      return "completed";
    }

    if (stageKey === "PRODUCTION") {
      if (formData.manufactureStatus === "COMPLETED") return "completed";
      if (formData.manufactureStatus) return "in-progress";
      return "not-started";
    }

    if (completedStages.includes(stageKey)) return "completed";

    const required = stageRequiredFields[stageKey] || [];
    const filled = required.filter(f => { const v = formData[f]; return v && v.toString().trim() !== ""; }).length;
    if (filled > 0) return "in-progress";
    return "not-started";
  };

  const validateCurrentStage = () => {
    const currentStage = stages[activeStage].key;
    // payLater bypasses the payment required-fields check
    if (currentStage === "PAYMENT" && formData.payLater) return true;
    const required = stageRequiredFields[currentStage] || [];
    for (let field of required) {
      const value = formData?.[field];
      if (Array.isArray(value)) {
        if (value.length === 0) { toast.error("Please add payment"); return false; }
        continue;
      }
      if (!value || value.toString().trim() === "") { toast.error("Please fill all required fields"); return false; }
    }
    return true;
  };

  const allStagesCompleted = stages.every(s => getStageStatus(s.key) === "completed");

  const handleNext = async () => {
    if (isLocked && !formData.isFranchiseCreated) return;
    if (!validateCurrentStage()) return;
    try {
      const updatedData = {
        ...formData,
        completedStages: [...new Set([...(formData.completedStages || []), stages[activeStage].key])],
      };
      const payload = { ...updatedData };
      if (payload.cartImage) {
        const img = payload.cartImage;
        payload.cartImage = typeof img === "string" ? img : img.name;
        payload.cartImageName = typeof img === "string" ? img : img.name;
      }
      await saveKishok(formData._id, payload);
      setFormData(updatedData);
      toast.success("Saved Successfully");
      if (activeStage < stages.length - 1) setActiveStage(p => p + 1);
    } catch { toast.error("Save Failed"); }
  };

  const handlePrev = () => { if (activeStage > 0) setActiveStage(p => p - 1); };

  const handleSave = async () => {
    if (isLocked && !formData.isFranchiseCreated) return;
    try {
      const payload = { ...formData };
      if (payload.cartImage) {
        const img = payload.cartImage;
        payload.cartImage = typeof img === "string" ? img : img.name;
        payload.cartImageName = typeof img === "string" ? img : img.name;
      }
      await saveKishok(formData._id, payload);
      toast.success(formData.isFranchiseCreated ? "Payment Details Saved" : "Draft Saved");
    } catch { toast.error("Save Failed"); }
  };

  const handleComplete = async () => {
    if (isLocked && !formData.isFranchiseCreated) return;
    if (!allStagesCompleted) { toast.error("Complete all stages first"); return; }
    try {
      const payload = {
        ...formData,
        manufactureStatus: "COMPLETED",
        completedStages: stages.map(s => s.key),
      };
      if (payload.cartImage) {
        const img = payload.cartImage;
        payload.cartImage = typeof img === "string" ? img : img.name;
        payload.cartImageName = typeof img === "string" ? img : img.name;
      }
      await saveKishok(formData._id, payload);
      toast.success("Kishok Process Completed");
    } catch { toast.error("Completion Failed"); }
  };

  /* ── Stepper colours ── */
  const stageStyle = (index) => {
    const key = stages[index].key;
    const status = getStageStatus(key);
    const active = activeStage === index;

    if (status === "completed")
      return { circle: "linear-gradient(135deg,#059669,#34d399)", icon: "#fff", line: "#059669" };
    if (active)
      return { circle: "linear-gradient(135deg,#D91E18,#F97316)", icon: "#fff", line: "#e5e7eb" };
    if (status === "in-progress")
      return { circle: "linear-gradient(135deg,#d97706,#fbbf24)", icon: "#fff", line: "#e5e7eb" };
    return { circle: "#f3f4f6", icon: "#9ca3af", line: "#e5e7eb" };
  };

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* ── Back + Page header ── */}
        <div className="row mb-0">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer", flexShrink: 0 }}
                  title="Back"
                >
                  <i className="bx bx-arrow-back" style={{ fontSize: 17 }} />
                </button>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", boxShadow: "0 4px 14px rgba(217,30,24,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="bx bx-edit-alt" style={{ color: "#fff", fontSize: 22 }} />
                </div>
                <div>
                  <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Edit Kishok Order</h4>
                  <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>Manufacture · Kishok · Edit</div>
                </div>
              </div>
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><span style={{ cursor: "pointer", color: "#F97316" }} onClick={() => navigate("/dashboard")}>Dashboard</span></li>
                <li className="breadcrumb-item"><span style={{ cursor: "pointer", color: "#F97316" }} onClick={() => navigate("/manufacture-kishok")}>Kishok</span></li>
                <li className="breadcrumb-item active">Edit</li>
              </ol>
            </div>
          </div>
        </div>

        {/* ── Customer info banner ── */}
        {formData.customerName && (
          <div style={{ background: "linear-gradient(90deg,rgba(217,30,24,0.06),rgba(249,115,22,0.04))", border: "1px solid rgba(249,115,22,0.18)", borderRadius: 12, padding: "12px 20px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bx bx-user" style={{ color: "#fff", fontSize: 18 }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#1A1A1A" }}>{formData.customerName}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{formData.phone} &nbsp;·&nbsp; {formData.place}</div>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#F97316" }}>Ref: {formData.referenceId}</span>
          </div>
        )}

        {/* ── Wizard stepper card ── */}
        <div className="card mb-3" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", animation: "none", position: "relative" }}>
          <div className="card-body" style={{ padding: "22px 28px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {stages.map((stage, index) => {
                const ss = stageStyle(index);
                const status = getStageStatus(stage.key);
                return (
                  <React.Fragment key={stage.key}>

                    {/* Step circle */}
                    <div
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: "0 0 auto", cursor: "pointer" }}
                      onClick={() => setActiveStage(index)}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: ss.circle, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: activeStage === index ? "0 4px 14px rgba(217,30,24,0.28)" : "none", transition: "all 0.25s", position: "relative" }}>
                        {status === "completed"
                          ? <i className="bx bx-check" style={{ color: ss.icon, fontSize: 22, fontWeight: 900 }} />
                          : <i className={stage.icon} style={{ color: ss.icon, fontSize: 20 }} />
                        }
                        {activeStage === index && (
                          <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "2.5px solid #F97316", opacity: 0.5 }} />
                        )}
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: activeStage === index ? "#D91E18" : status === "completed" ? "#059669" : "#6b7280", whiteSpace: "nowrap" }}>
                          {stage.label}
                        </div>
                        <div style={{ fontSize: 10.5, color: status === "completed" ? "#059669" : status === "in-progress" ? "#d97706" : "#c4cdd6", fontWeight: 600, marginTop: 1 }}>
                          {status === "completed" ? "Done" : status === "in-progress" ? "In Progress" : "Pending"}
                        </div>
                      </div>
                    </div>

                    {/* Connector line */}
                    {index !== stages.length - 1 && (
                      <div style={{ flex: 1, height: 2.5, background: status === "completed" ? "linear-gradient(90deg,#059669,#34d399)" : "#e5e7eb", borderRadius: 2, margin: "0 10px", marginBottom: 26, transition: "background 0.3s" }} />
                    )}

                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Stage form ── */}
        <KishokStageForm
          activeStage={activeStage}
          stages={stages.map(s => s.key)}
          formData={formData}
          setFormData={setFormData}
          paymentModes={paymentModes}
        />

        {/* ── Action buttons ── */}
        <div className="card mt-3" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", animation: "none", position: "relative", zIndex: 1 }}>
          <div className="card-body" style={{ padding: "18px 24px" }}>
            <div className="d-flex justify-content-between flex-wrap gap-2">

              <button
                onClick={handlePrev}
                disabled={activeStage === 0}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: activeStage === 0 ? "#c4cdd6" : "#374151", fontWeight: 700, fontSize: 14, cursor: activeStage === 0 ? "not-allowed" : "pointer", opacity: activeStage === 0 ? 0.6 : 1 }}
              >
                <i className="bx bx-left-arrow-alt" style={{ fontSize: 18 }} /> Previous
              </button>

              {(!isLocked || formData.isFranchiseCreated) && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={handleSave}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                  >
                    <i className="bx bx-save" style={{ fontSize: 16 }} /> Save {formData.isFranchiseCreated ? "Payment" : "Draft"}
                  </button>

                  {activeStage !== stages.length - 1 ? (
                    <button
                      onClick={handleNext}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(217,30,24,0.28)" }}
                    >
                      Save & Next <i className="bx bx-right-arrow-alt" style={{ fontSize: 18 }} />
                    </button>
                  ) : (
                    <button
                      onClick={handleComplete}
                      disabled={!allStagesCompleted}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 9, border: "none", background: allStagesCompleted ? "linear-gradient(135deg,#059669,#34d399)" : "#e5e7eb", color: allStagesCompleted ? "#fff" : "#9ca3af", fontWeight: 700, fontSize: 14, cursor: allStagesCompleted ? "pointer" : "not-allowed", boxShadow: allStagesCompleted ? "0 4px 14px rgba(5,150,105,0.3)" : "none" }}
                    >
                      <i className="bx bx-check-circle" style={{ fontSize: 17 }} /> Mark Completed
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default KishokWizardForm;
