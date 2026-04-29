// LeadWizardForm.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import LeadStageForm from "./LeadStageForm";
import LeadInfoFrom from "./LeadInfoFrom";

const stages = [
  { key: "SITE_VISIT", icon: "bx bx-map" },
  { key: "APPROVAL", icon: "bx bx-check-shield" },
  { key: "TRAINING", icon: "bx bx-book" },
  { key: "PAYMENT", icon: "bx bx-credit-card" },
  { key: "FINAL_SETUP", icon: "bx bx-store" },
];

const formatLabel = (value) =>
  value?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const LeadWizardForm = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [formData, setFormData] = useState({});

  const stageRequiredFields = {
    SITE_VISIT: ["visitType", "visitDate", "location"],

    APPROVAL: ["siteStatus", "approvalStatus", "legalStatus"],

    TRAINING:
      formData.cartRequired === "yes"
        ? [
          "trainingStatus",
          "trainingStart",
          "cartRequired",
          "cartRequiredDate",
          "cartPriority",
        ]
        : ["trainingStatus", "trainingStart", "cartRequired"],

    PAYMENT: ["totalAmount"],

    FINAL_SETUP: [
      "contractSigned",
      "bankDetails",
      "kycDocument",
      "royaltyDocument",
    ],
  };

  const validateCurrentStage = () => {
    const currentStage = stages[activeStage].key;
    const required = stageRequiredFields[currentStage] || [];

    for (let field of required) {
      const value = formData[field];

      if (!value || value.toString().trim() === "") {
        toast.error("Please fill all required fields");
        return false;
      }
    }

    return true;
  };

  const getStageStatus = (stageKey) => {
    if (stageKey === "PAYMENT") {
      const total = Number(formData.totalAmount || 0);
      const paid = (formData.payments || []).reduce(
        (a, b) => a + b.amount,
        0
      );

      if (paid === 0) return "not-started";
      if (paid < total) return "in-progress";
      return "completed";
    }

    const required = stageRequiredFields[stageKey] || [];

    const filled = required.filter((field) => {
      const value = formData[field];

      if (value instanceof File) return true;
      if (typeof value === "string") return value.trim() !== "";

      return !!value;
    }).length;

    if (filled === 0) return "not-started";
    if (filled < required.length) return "in-progress";
    return "completed";
  };

  const handleNext = () => {
    if (!validateCurrentStage()) return;

    toast.success("Saved Successfully");

    if (activeStage < stages.length - 1) {
      setActiveStage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStage > 0) {
      setActiveStage((prev) => prev - 1);
    }
  };

  const handleSave = () => {
    if (!validateCurrentStage()) return;

    toast.success("Draft Saved");
  };

  const handleComplete = () => {
    toast.success("Lead Process Completed");
  };

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Header */}
        <div className="card mb-3">
          <div className="card-body">

            <div className="d-flex align-items-center justify-content-between">

              {stages.map((stage, index) => {
                const status = getStageStatus(stage.key);

                const circleClass =
                  status === "completed"
                    ? "bg-success text-white"
                    : status === "in-progress"
                      ? "bg-warning text-dark"
                      : activeStage === index
                        ? "bg-primary text-white"
                        : "bg-light";

                return (
                  <React.Fragment key={stage.key}>

                    <div className="d-flex flex-column align-items-center text-center flex-fill">

                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center ${circleClass}`}
                        style={{
                          width: "45px",
                          height: "45px",
                          cursor: "pointer",
                        }}
                        onClick={() => setActiveStage(index)}
                      >
                        <i className={stage.icon}></i>
                      </div>

                      <span className="mt-2 small fw-semibold">
                        {formatLabel(stage.key)}
                      </span>
                    </div>

                    {index !== stages.length - 1 && (
                      <div className="flex-fill mx-2">
                        <div
                          style={{
                            height: "2px",
                            backgroundColor:
                              status === "completed"
                                ? "green"
                                : "#dee2e6",
                          }}
                        ></div>
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
              stages={stages.map((s) => s.key)}
            />
            {/* Buttons */}
            <div className="card mt-3">
              <div className="card-body">

                <div className="d-flex justify-content-between flex-wrap gap-2">

                  <button
                    className="btn btn-secondary"
                    disabled={activeStage === 0}
                    onClick={handlePrev}
                  >
                    <i className="bx bx-left-arrow-alt me-1"></i>
                    Previous
                  </button>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-light border"
                      onClick={handleSave}
                    >
                      Save Draft
                    </button>

                    {activeStage !== stages.length - 1 ? (
                      <button
                        className="btn btn-primary"
                        onClick={handleNext}
                      >
                        Save & Next
                        <i className="bx bx-right-arrow-alt ms-1"></i>
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={handleComplete}
                      >
                        Mark Completed
                      </button>
                    )}

                  </div>

                </div>

              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <LeadInfoFrom formData={formData} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default LeadWizardForm;