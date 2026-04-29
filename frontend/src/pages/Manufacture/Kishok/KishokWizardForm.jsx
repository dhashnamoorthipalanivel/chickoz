// KishokWizardForm.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import KishokStageForm from "./KishokStageForm";

const stages = [
  { key: "REQUIREMENT", icon: "bx bx-cart" },
  { key: "VENDOR_ASSIGN", icon: "bx bx-user-plus" },
  { key: "PRODUCTION", icon: "bx bx-cog" },
  { key: "PAYMENT", icon: "bx bx-credit-card" },
];

const formatLabel = (value) =>
  value
    ?.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const KishokWizardForm = () => {
  const [activeStage, setActiveStage] = useState(0);

  const [formData, setFormData] = useState({
    package: "Standard",
    leadId: "LD001",
    customerName: "Arun Kumar",
    location: "Chennai",
  });

  const stageRequiredFields = {
    REQUIREMENT: ["requiredDate", "priority"],
    VENDOR_ASSIGN: ["vendorName", "assignDate", "expectedDate"],
    PRODUCTION: ["productionStatus"],
    PAYMENT: [],
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
      return value && value.toString().trim() !== "";
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
    toast.success("Kishok Process Completed");
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

        {/* Form */}
        <KishokStageForm
          activeStage={activeStage}
          stages={stages.map((s) => s.key)}
          formData={formData}
          setFormData={setFormData}
        />

        {/* Buttons */}
        <div className="card mt-3">
          <div className="card-body">

            <div className="d-flex justify-content-between flex-wrap gap-2">

              <button
                className="btn btn-secondary"
                onClick={handlePrev}
                disabled={activeStage === 0}
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
    </div>
  );
};

export default KishokWizardForm;