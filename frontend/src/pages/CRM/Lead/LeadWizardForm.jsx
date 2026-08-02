// LeadWizardForm.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LeadStageForm from "./LeadStageForm";
import LeadInfoFrom from "./LeadInfoFrom";
import { useLeadStore, usePaymentModes } from "../../../store/store";
import { createFranchise, getLeadById, updateLead } from "../../../api/leadApi";
import { useNavigate, useParams } from "react-router-dom";
import CircularLoader from "../../../components/Common/CircularLoader";

const stages = [
  { key: "SITE_VISIT", icon: "bx bx-map", label: "Site Visit", sub: "Walk-in & location" },
  { key: "APPROVAL", icon: "bx bx-check-shield", label: "Approval", sub: "Legal & site status" },
  { key: "TRAINING", icon: "bx bx-book", label: "Training", sub: "Cart & training" },
  { key: "PAYMENT", icon: "bx bx-credit-card", label: "Payment", sub: "Fees & collection" },
  { key: "FINAL_SETUP", icon: "bx bx-store", label: "Final Setup", sub: "KYC & contract" },
];

const stageKeys = stages.map(s => s.key);

const formatLabel = (value) =>
  value?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

/* ── Stage circle gradient per status ── */
const stageStyle = (status, isActive) => {
  if (status === "completed") return { bg: "linear-gradient(135deg,#059669,#34d399)", shadow: "rgba(5,150,105,0.35)" };
  if (status === "cancelled") return { bg: "linear-gradient(135deg,#D91E18,#f87171)", shadow: "rgba(217,30,24,0.35)" };
  if (status === "in-progress") return { bg: "linear-gradient(135deg,#d97706,#fbbf24)", shadow: "rgba(217,119,6,0.35)" };
  if (isActive) return { bg: "linear-gradient(135deg,#D91E18,#F97316)", shadow: "rgba(217,30,24,0.35)" };
  return { bg: "linear-gradient(135deg,#d1d5db,#e5e7eb)", shadow: "transparent" };
};

const LeadWizardForm = ({ onBack }) => {
  const [activeStage, setActiveStage] = useState(0);
  const [showFranchiseModal, setShowFranchiseModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Processing...");

  const [formData, setFormData] = useState({
    stages: {
      SITE_VISIT: { completed: false, data: { visitType: "", visitDate: "", location: "", deliveryLocation: "" } },
      APPROVAL: { completed: false, data: { siteStatus: "", approvalStatus: "", legalStatus: "" } },
      TRAINING: { completed: false, data: { trainingStatus: "", trainingStart: "", parentsDetails: "", cartRequired: false, cartRequiredDate: "", cartPriority: "", cartSize: "", brandingType: "", accessories: "", cartManufactureStatus: "NOT_ASSIGNED", cartAssignedVendor: "" } },
      PAYMENT: { completed: false, data: { totalAmount: 0, payments: [] } },
      FINAL_SETUP: { completed: false, data: { contractSigned: "", bankDetails: "", bankAccountHolderName: "", bankName: "", bankIfscCode: "", kycDocument: "", royaltyDocument: "", ewayBillFile: "", draftAmount: "" } },
    },
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchLeads } = useLeadStore();

  /* ── All business logic unchanged ── */

  const checkStageCompleted = (stageKey, data) => {
    const stage = data?.stages?.[stageKey]?.data || {};
    if (stageKey === "SITE_VISIT") return stage.visitType && stage.visitDate && stage.location;
    if (stageKey === "APPROVAL") return stage.siteStatus === "Approved" && stage.approvalStatus === "Approved" && stage.legalStatus === "Completed";
    if (stageKey === "TRAINING") return stage.trainingStatus === "Completed";
    if (stageKey === "PAYMENT") {
      if (stage.payLater) return true;
      const total = Number(stage.totalAmount || 0);
      const paid = (stage.payments || []).reduce((a, b) => a + b.amount, 0);
      return total > 0 && paid >= total;
    }
    if (stageKey === "FINAL_SETUP") return stage.contractSigned === "Yes";
    return false;
  };

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await getLeadById(id);
        const leadData = res.data;
        if (leadData?.interestedPackage && typeof leadData.interestedPackage === "object") {
          const trainingData = leadData.stages?.TRAINING?.data;
          if (trainingData) {
            if (trainingData.cartAmount === undefined || trainingData.cartAmount === 0) {
              trainingData.cartAmount = trainingData.cartRequired === "yes" ? Number(leadData.interestedPackage.cartAmount || 0) : 0;
            }
            if (!trainingData.cartSize) {
              trainingData.cartSize = leadData.interestedPackage.cartSize || "";
            }
            if (!trainingData.brandingType) {
              trainingData.brandingType = leadData.interestedPackage.brandingType || "";
            }
            if (trainingData.accessories === undefined) {
              const pkgMats = leadData.interestedPackage.packageMaterials || [];
              trainingData.accessories = pkgMats.length > 0
                ? pkgMats.map(m => (typeof m === "string" ? m : m.materialName)).filter(Boolean).join(", ")
                : leadData.interestedPackage.accessories || "";
            }
          }
        }
        setFormData(leadData);
        const firstIncomplete = stages.findIndex(s => !checkStageCompleted(s.key, res.data));
        setActiveStage(firstIncomplete === -1 ? stages.length - 1 : firstIncomplete);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) fetchLead();
  }, [id]);

  const stageRequiredFields = {
    SITE_VISIT: ["visitType", "visitDate", "location"],
    APPROVAL: ["siteStatus", "approvalStatus", "legalStatus"],
    TRAINING: formData?.stages?.TRAINING?.data?.cartRequired === "yes"
      ? ["trainingStatus", "trainingStart", "cartRequired", "cartSize", "cartRequiredDate", "cartPriority"]
      : ["trainingStatus", "trainingStart", "cartRequired"],
    PAYMENT: ["totalAmount"],
    FINAL_SETUP: ["contractSigned", "bankDetails", "bankAccountHolderName", "bankName", "bankIfscCode", "kycDocument", "royaltyDocument"],
  };

  const validateCurrentStage = () => {
    const currentStage = stages[activeStage].key;
    const required = stageRequiredFields[currentStage] || [];
    for (let field of required) {
      const value = formData?.stages?.[currentStage]?.data?.[field];
      if (!value || value.toString().trim() === "") {
        toast.error("Please fill all required fields");
        return false;
      }
    }
    return true;
  };

  const getStageStatus = (stageKey) => {
    if (stageKey === "PAYMENT") {
      if (formData?.stages?.PAYMENT?.data?.payLater) {
        return "completed";
      } else {
        const total = Number(formData?.stages?.PAYMENT?.data?.totalAmount || 0);
        const paid = (formData?.stages?.PAYMENT?.data?.payments || []).reduce((a, b) => a + (Number(b.amount) || 0), 0);
        if (paid === 0) return "not-started";
        if (paid < total) return "in-progress";
        return "completed";
      }
    }

    if (stageKey === "APPROVAL") {
      const { siteStatus, approvalStatus, legalStatus } = formData?.stages?.APPROVAL?.data || {};
      if (!siteStatus && !approvalStatus && !legalStatus) return "not-started";
      if (siteStatus === "Approved" && approvalStatus === "Approved" && legalStatus === "Completed") return "completed";
      return "in-progress";
    }

    if (stageKey === "TRAINING") {
      const { trainingStatus, cartRequired, cartManufactureStatus } = formData?.stages?.TRAINING?.data || {};
      if (!trainingStatus) return "not-started";
      if (cartRequired === "yes") {
        if (trainingStatus === "Completed" && cartManufactureStatus === "COMPLETED") return "completed";
        if (cartManufactureStatus === "CANCELLED") return "cancelled";
        return "in-progress";
      }
      return trainingStatus === "Completed" ? "completed" : "in-progress";
    }

    if (stageKey === "FINAL_SETUP") {
      const { contractSigned, bankDetails, kycDocument, royaltyDocument } = formData?.stages?.FINAL_SETUP?.data || {};
      if (!contractSigned && !bankDetails && !kycDocument && !royaltyDocument) return "not-started";
      if (contractSigned === "Yes" && bankDetails && kycDocument && royaltyDocument) return "completed";
      return "in-progress";
    }

    const required = stageRequiredFields[stageKey] || [];
    const filled = required.filter(field => {
      const value = formData?.stages?.[stageKey]?.data?.[field];
      if (value instanceof File) return true;
      if (typeof value === "string") return value.trim() !== "";
      return !!value;
    }).length;
    if (filled === 0) return "not-started";
    if (filled < required.length) return "in-progress";
    return "completed";
  };

  const allStagesCompleted = stages.every(s => getStageStatus(s.key) === "completed");

  const sanitizeLeadPayload = (raw) => {
    let p;
    try {
      p = JSON.parse(JSON.stringify(raw));
    } catch (_) {
      p = { ...raw };
    }
    if (p.interestedPackage && typeof p.interestedPackage === "object") {
      p.interestedPackage = p.interestedPackage._id || p.interestedPackage.id || p.interestedPackage;
    }
    if (p.leadSource && typeof p.leadSource === "object") {
      p.leadSource = p.leadSource._id || p.leadSource.id || p.leadSource;
    }
    const finalSetup = p?.stages?.FINAL_SETUP?.data;
    if (finalSetup) {
      if (raw?.stages?.FINAL_SETUP?.data?.kycDocument instanceof File) {
        finalSetup.kycDocument = raw.stages.FINAL_SETUP.data.kycDocument.name;
        finalSetup.kycDocumentName = raw.stages.FINAL_SETUP.data.kycDocument.name;
      }
      if (raw?.stages?.FINAL_SETUP?.data?.royaltyDocument instanceof File) {
        finalSetup.royaltyDocument = raw.stages.FINAL_SETUP.data.royaltyDocument.name;
        finalSetup.royaltyDocumentName = raw.stages.FINAL_SETUP.data.royaltyDocument.name;
      }
      if (raw?.stages?.FINAL_SETUP?.data?.ewayBillFile instanceof File) {
        finalSetup.ewayBillFile = raw.stages.FINAL_SETUP.data.ewayBillFile.name;
        finalSetup.ewayBillFileName = raw.stages.FINAL_SETUP.data.ewayBillFile.name;
      }
    }
    return p;
  };

  const handleNext = async () => {
    if (!validateCurrentStage()) return;
    setActionLoading(true);
    setLoadingMsg("Saving progress...");
    try {
      const currentStage = stages[activeStage].key;
      const updatedData = { ...formData, stages: { ...formData.stages, [currentStage]: { ...formData.stages[currentStage], completed: true } } };
      const payload = sanitizeLeadPayload(formData);
      console.log("payload: ", payload);
      await updateLead(formData._id, payload);
      setFormData(updatedData);
      await fetchLeads();
      toast.success("Saved Successfully");
      if (activeStage < stages.length - 1) setActiveStage(prev => prev + 1);
    } catch (error) {
      console.log(error);
      toast.error("Update Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrev = () => {
    if (activeStage > 0) setActiveStage(prev => prev - 1);
  };

  const handleSave = async () => {
    setActionLoading(true);
    setLoadingMsg("Saving draft...");
    try {
      const payload = sanitizeLeadPayload(formData);
      const currentStage = stages[activeStage].key;
      const updatedData = { ...formData, stages: { ...formData.stages, [currentStage]: { ...formData.stages[currentStage], completed: getStageStatus(currentStage) === "completed" } } };
      console.log("payload: ", payload);
      await updateLead(formData._id, payload);
      setFormData(updatedData);
      await fetchLeads();
      toast.success("Saved Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Save Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!allStagesCompleted) { toast.error("Complete all stages first"); return; }
    setActionLoading(true);
    setLoadingMsg("Completing lead setup...");
    try {
      const payload = sanitizeLeadPayload(formData);
      payload.leadStatus = "COMPLETED";
      await updateLead(formData._id, payload);
      setFormData(prev => ({ ...prev, leadStatus: "COMPLETED" }));
      await fetchLeads();
      toast.success("Lead Completed Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Completion Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateFranchise = async () => {
    try {
      if (formData.isFranchiseCreated) {
        toast.info("Franchise already created for this lead. Redirecting to Franchise Master...");
        setShowFranchiseModal(false);
        navigate("/master-franchise");
        return;
      }

      setActionLoading(true);
      setLoadingMsg("Creating Franchise...");

      const res = await createFranchise(formData._id);
      const isAlready = res?.data?.alreadyExisted;

      if (isAlready) {
        toast.info("Franchise already created for this lead. Redirecting to Franchise Master...");
      } else {
        toast.success("Franchise Created Successfully! Redirecting to Franchise Master...");
      }

      setFormData(prev => ({ ...prev, isFranchiseCreated: true, leadStatus: "COMPLETED" }));
      setShowFranchiseModal(false);
      navigate("/master-franchise");
    } catch (error) {
      const msg = error.response?.data?.message || "";
      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("duplicate")) {
        toast.info("Franchise already created for this lead. Redirecting to Franchise Master...");
        setFormData(prev => ({ ...prev, isFranchiseCreated: true, leadStatus: "COMPLETED" }));
        setShowFranchiseModal(false);
        navigate("/master-franchise");
      } else {
        toast.error(msg || "Franchise Creation Failed");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const { paymentModes, fetchPaymentModes } = usePaymentModes();

  useEffect(() => {
    const manualStatuses = ["HOLD", "RETURN", "CANCELLED", "COMPLETED"];
    if (manualStatuses.includes(formData.leadStatus)) return;
    const allStages = Object.values(formData.stages || {});
    let hasAnyData = false;
    allStages.forEach(stage => {
      Object.values(stage.data || {}).forEach(value => {
        if (value !== "" && value !== null && value !== undefined && value !== false) hasAnyData = true;
      });
    });
    const autoStatus = hasAnyData ? "IN_PROGRESS" : "NOT_STARTED";
    if (formData.leadStatus !== autoStatus) setFormData(prev => ({ ...prev, leadStatus: autoStatus }));
  }, [formData.stages]);

  useEffect(() => { fetchPaymentModes(); }, []);

  /* ── Derived display values ── */
  const isLocked = ["HOLD", "RETURN", "CANCELLED"].includes(formData?.leadStatus) || formData?.isFranchiseCreated;
  const customerName = formData?.name || "—";
  const customerPhone = formData?.phone || "";
  const customerPlace = formData?.place || "";

  /* ── Status pill ── */
  const statusPill = (s) => {
    const map = { COMPLETED: ["#059669", "rgba(5,150,105,0.1)"], IN_PROGRESS: ["#d97706", "rgba(217,119,6,0.1)"], HOLD: ["#7c3aed", "rgba(124,58,237,0.1)"], CANCELLED: ["#D91E18", "rgba(217,30,24,0.1)"], RETURN: ["#D91E18", "rgba(217,30,24,0.1)"] };
    const [c, bg] = map[s] || ["#6b7280", "#f3f4f6"];
    return (
      <span style={{ padding: "3px 11px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: c, background: bg, border: `1px solid ${c}30` }}>
        {formatLabel(s) || "New"}
      </span>
    );
  };

  return (
    <div className="page-content">
      {actionLoading && <CircularLoader overlay message={loadingMsg} />}
      <div className="container-fluid">

        {/* Back button */}
        <div className="mb-3" style={{ position: "relative", zIndex: 0 }}>
          <button type="button" onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer" }}>
            <i className="bx bx-arrow-back" style={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, position: "relative", zIndex: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(217,30,24,0.3)", flexShrink: 0 }}>
            <i className="bx bx-network-chart" style={{ color: "#fff", fontSize: 22 }} />
          </div>
          <div>
            <h4 style={{ fontWeight: 900, fontSize: 20, color: "#1A1A1A", margin: 0 }}>Lead Pipeline</h4>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Manage each stage to convert this lead into a franchise</p>
          </div>
        </div>

        {/* Customer info banner */}
        {formData?.name && (
          <div style={{ background: "linear-gradient(135deg,#1A1A1A,#2d2d2d)", borderRadius: 14, padding: "14px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", position: "relative", zIndex: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#D91E18,#F97316)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="bx bx-user" style={{ color: "#fff", fontSize: 18 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>{customerName}</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 1 }}>
                {customerPhone && <span style={{ marginRight: 12 }}><i className="bx bx-phone me-1" />{customerPhone}</span>}
                {customerPlace && <span><i className="bx bx-map-pin me-1" />{customerPlace}</span>}
              </div>
            </div>
            {formData.leadStatus && statusPill(formData.leadStatus)}
          </div>
        )}

        {/* ── Stepper ── */}
        <div className="card mb-3" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", animation: "none", position: "relative", zIndex: 0 }}>
          <div className="card-body" style={{ padding: "22px 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>

              {stages.map((stage, index) => {
                const status = getStageStatus(stage.key);
                const isActive = activeStage === index;
                const { bg, shadow } = stageStyle(status, isActive);
                const isCompleted = status === "completed";

                return (
                  <React.Fragment key={stage.key}>
                    {/* Step circle + label */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", minWidth: 70 }}>
                      <div
                        onClick={() => setActiveStage(index)}
                        style={{ width: 48, height: 48, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 4px 14px ${shadow}`, position: "relative", transition: "transform 0.2s", ...(isActive ? { transform: "scale(1.1)", outline: `3px solid ${isCompleted ? "#059669" : "#D91E18"}`, outlineOffset: 3 } : {}) }}>
                        {isCompleted
                          ? <i className="bx bx-check" style={{ color: "#fff", fontSize: 22, fontWeight: 900 }} />
                          : <i className={stage.icon} style={{ color: isActive || status !== "not-started" ? "#fff" : "#9ca3af", fontSize: 20 }} />
                        }
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: isActive ? "#D91E18" : "#374151", whiteSpace: "nowrap" }}>{stage.label}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af", whiteSpace: "nowrap" }}>{stage.sub}</div>
                      </div>
                    </div>

                    {/* Connector */}
                    {index !== stages.length - 1 && (
                      <div style={{ flex: 1, marginTop: 23, padding: "0 4px" }}>
                        <div style={{ height: 3, borderRadius: 2, background: status === "completed" ? "linear-gradient(90deg,#059669,#34d399)" : "#e5e7eb", transition: "background 0.3s" }} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="row">

          <div className="col-xl-8">
            <LeadStageForm
              activeStage={activeStage}
              formData={formData}
              setFormData={setFormData}
              stages={stages.map(s => s.key)}
              paymentModes={paymentModes}
              isLocked={isLocked}
            />

            {formData?.isFranchiseCreated && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.22)", borderRadius: 10, padding: "12px 16px", marginTop: 12 }}>
                <i className="bx bx-check-circle" style={{ color: "#059669", fontSize: 20 }} />
                <span style={{ fontSize: 13.5, color: "#059669", fontWeight: 700 }}>Franchise already created. Editing is disabled.</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="card mt-3" style={{ borderRadius: 14, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", animation: "none", position: "relative", zIndex: 0 }}>
              <div className="card-body" style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>

                  {/* Previous */}
                  <button
                    type="button"
                    disabled={activeStage === 0}
                    onClick={handlePrev}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: activeStage === 0 ? "#9ca3af" : "#374151", fontWeight: 700, fontSize: 13.5, cursor: activeStage === 0 ? "default" : "pointer", opacity: activeStage === 0 ? 0.5 : 1 }}>
                    <i className="bx bx-left-arrow-alt" style={{ fontSize: 16 }} /> Previous
                  </button>

                  {!isLocked && (
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {/* Save Draft */}
                      <button type="button" onClick={handleSave}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                        <i className="bx bx-save" style={{ fontSize: 16 }} /> Save Draft
                      </button>

                      {activeStage !== stages.length - 1 ? (
                        /* Save & Next */
                        <button type="button" onClick={handleNext}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#D91E18,#F97316)", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 3px 12px rgba(217,30,24,0.3)" }}>
                          Save & Next <i className="bx bx-right-arrow-alt" style={{ fontSize: 16 }} />
                        </button>
                      ) : (
                        /* Mark Completed */
                        <button type="button" onClick={handleComplete} disabled={!allStagesCompleted}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: "none", background: allStagesCompleted ? "linear-gradient(135deg,#059669,#34d399)" : "#d1d5db", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: allStagesCompleted ? "pointer" : "default", boxShadow: allStagesCompleted ? "0 3px 12px rgba(5,150,105,0.3)" : "none" }}>
                          <i className="bx bx-check-circle" style={{ fontSize: 16 }} /> Mark Completed
                        </button>
                      )}

                      {/* Create Franchise */}
                      {activeStage === stages.length - 1 && formData?.leadStatus === "COMPLETED" && allStagesCompleted && !formData?.isFranchiseCreated && (
                        <button type="button" onClick={() => setShowFranchiseModal(true)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#2563eb,#60a5fa)", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 3px 12px rgba(37,99,235,0.3)" }}>
                          <i className="bx bx-store" style={{ fontSize: 16 }} /> Create Franchise
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <LeadInfoFrom formData={formData} setFormData={setFormData} isLocked={formData?.isFranchiseCreated} />
          </div>
        </div>
      </div>

      {/* Create Franchise modal */}
      {showFranchiseModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 16, border: "none" }}>
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close" onClick={() => setShowFranchiseModal(false)} />
              </div>
              <div className="modal-body text-center pb-3">
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,#2563eb,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}>
                  <i className="bx bx-store" style={{ color: "#fff", fontSize: 30 }} />
                </div>
                <h5 style={{ fontWeight: 800 }}>Create Franchise?</h5>
                <p className="text-muted mb-0">Are you sure you want to create a franchise for this lead?</p>
              </div>
              <div className="modal-footer border-0 pt-0 justify-content-center gap-2">
                <button type="button" onClick={() => setShowFranchiseModal(false)}
                  style={{ padding: "9px 22px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="button" onClick={handleCreateFranchise}
                  style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#2563eb,#60a5fa)", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 3px 12px rgba(37,99,235,0.3)" }}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadWizardForm;
