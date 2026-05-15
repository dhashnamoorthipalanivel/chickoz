// KishokWizardForm.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import KishokStageForm from "./KishokStageForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useKishokStore, usePaymentModes } from "../../../store/store";

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

  const { state } = useLocation();
  const navigate = useNavigate();

  const rowData = state?.rowData;

  const [formData, setFormData] = useState({});
  const isLocked =

    [
      "HOLD",
      "RETURN",
      "CANCELLED",
    ].includes(
      formData?.leadStatus
    ) ||

    formData?.isFranchiseCreated;
  const { paymentModes, fetchPaymentModes } = usePaymentModes();

  useEffect(() => {
    fetchPaymentModes();
  }, [])

  const { saveKishok } = useKishokStore();

  useEffect(() => {

    if (!rowData) return;

    setFormData(rowData);

    const completed =
      rowData.completedStages || [];

    const stageKeys =
      stages.map((s) => s.key);

    let openStage = 0;

    for (
      let i = 0;
      i < stageKeys.length;
      i++
    ) {

      const key =
        stageKeys[i];

      // ✅ PRODUCTION SPECIAL
      if (
        key === "PRODUCTION"
      ) {
        if (
          rowData.manufactureStatus !==
          "COMPLETED"
        ) {
          openStage = i;
          break;
        }
        continue;
      }
      // ✅ PAYMENT SPECIAL
      if (
        key === "PAYMENT"
      ) {
        const total =
          Number(
            rowData.cartAmount || 0
          );

        const paid =
          (rowData.payments || [])
            .reduce(
              (a, b) =>
                a +
                Number(
                  b.amount || 0
                ),
              0
            );

        if (paid < total) {

          openStage = i;
          break;
        }

        continue;
      }

      // ✅ NORMAL STAGES
      if (
        !completed.includes(key)
      ) {

        openStage = i;
        break;
      }
    }

    setActiveStage(openStage);

  }, [rowData]);

  const stageRequiredFields = {
    REQUIREMENT: ["requiredDate", "priority"],
    VENDOR_ASSIGN: ["vendorName", "assignDate", "expectedDate"],
    PRODUCTION: ["manufactureStatus", "dispatchDate", "cartImage"],
    PAYMENT: ["payments"],
  };

  const validateCurrentStage =
    () => {

      const currentStage =
        stages[activeStage].key;

      const required =
        stageRequiredFields[
        currentStage
        ] || [];

      for (let field of required) {
        const value =
          formData?.[field];
        // ✅ ARRAY VALIDATION
        if (Array.isArray(value)) {
          if (value.length === 0) {
            toast.error(
              "Please add payment"
            );
            return false;
          }
          continue;
        }

        // ✅ NORMAL VALIDATION
        if (!value || value.toString().trim() === "") {
          toast.error("Please fill all required fields");
          return false;
        }
      }

      return true;
    };

  const getStageStatus = (stageKey) => {
    const completedStages = formData.completedStages || [];
    // ✅ PAYMENT
    if (stageKey === "PAYMENT") {
      const total = Number(formData.cartAmount || 0);
      const paid = (formData.payments || [])
        .reduce(
          (a, b) =>
            a + Number(
              b.amount || 0
            ),
          0
        );

      if (paid === 0) {
        return "not-started";
      }

      if (paid < total) {
        return "in-progress";
      }

      return "completed";
    }


    // ✅ PRODUCTION
    if (
      stageKey === "PRODUCTION"
    ) {

      if (
        formData.manufactureStatus ===
        "COMPLETED"
      ) {
        return "completed";
      }

      if (
        formData.manufactureStatus
      ) {
        return "in-progress";
      }

      return "not-started";
    }


    // ✅ SAVE & NEXT ONLY
    if (
      completedStages.includes(
        stageKey
      )
    ) {
      return "completed";
    }


    const required =
      stageRequiredFields[
      stageKey
      ] || [];

    const filled =
      required.filter(
        (field) => {

          const value =
            formData[field];

          return (
            value &&
            value.toString()
              .trim() !== ""
          );
        }
      ).length;

    if (filled > 0) {
      return "in-progress";
    }

    return "not-started";
  };

  const allStagesCompleted =
    stages.every(
      (stage) =>
        getStageStatus(
          stage.key
        ) === "completed"
    );

  const handleNext = async () => {
    if (isLocked) return;
    if (!validateCurrentStage())
      return;

    try {
      const updatedData = {

        ...formData,

        completedStages: [
          ...new Set([
            ...(formData.completedStages || []),
            stages[activeStage].key,
          ]),
        ],
      };

      const payload = {
        ...updatedData,
      };

      // ✅ FILE FIX
      if (payload.cartImage) {

        const image =
          payload.cartImage;

        payload.cartImage =
          typeof image === "string"
            ? image
            : image.name;

        payload.cartImageName =
          typeof image === "string"
            ? image
            : image.name;
      }


      await saveKishok(
        formData._id,
        payload
      );

      setFormData(updatedData);

      toast.success(
        "Saved Successfully"
      );

      if (
        activeStage <
        stages.length - 1
      ) {
        setActiveStage(
          (prev) => prev + 1
        );
      }

    } catch (error) {

      toast.error(
        "Save Failed"
      );
    }
  };

  const handlePrev = () => {
    if (activeStage > 0) {
      setActiveStage((prev) => prev - 1);
    }
  };

  const handleSave = async () => {
    if (isLocked) return;
    try {

      const payload = {
        ...formData,
      };

      if (payload.cartImage) {

        const image =
          payload.cartImage;

        payload.cartImage =
          typeof image === "string"
            ? image
            : image.name;

        payload.cartImageName =
          typeof image === "string"
            ? image
            : image.name;
      }

      await saveKishok(
        formData._id,
        payload
      );

      toast.success(
        "Draft Saved"
      );

    } catch (error) {

      toast.error(
        "Save Failed"
      );
    }
  };

  const handleComplete = async () => {
    if (isLocked) return;
    if (!allStagesCompleted) {

      toast.error(
        "Complete all stages first"
      );

      return;
    }

    try {

      const payload = {

        ...formData,

        manufactureStatus:
          "COMPLETED",

        completedStages:
          stages.map(
            (s) => s.key
          ),
      };

      if (payload.cartImage) {

        const image =
          payload.cartImage;

        payload.cartImage =
          typeof image === "string"
            ? image
            : image.name;

        payload.cartImageName =
          typeof image === "string"
            ? image
            : image.name;
      }

      await saveKishok(
        formData._id,
        payload
      );

      toast.success(
        "Kishok Process Completed"
      );

    } catch (error) {

      toast.error(
        "Completion Failed"
      );
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">

        <button
          className="btn btn-secondary mb-3"

          onClick={() =>
            navigate("/manufacture-kishok")
          }
        >
          <i className="bx bx-left-arrow-alt me-1"></i>

          Back
        </button>

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
          paymentModes={paymentModes}
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
              {!(
                [
                  "HOLD",
                  "RETURN",
                  "CANCELLED",
                ].includes(
                  formData?.leadStatus
                ) ||

                formData?.isFranchiseCreated
              ) && (
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
                        disabled={!allStagesCompleted}
                      >
                        Mark Completed
                      </button>
                    )}

                  </div>)}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default KishokWizardForm;