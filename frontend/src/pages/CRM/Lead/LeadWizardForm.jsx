// LeadWizardForm.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LeadStageForm from "./LeadStageForm";
import LeadInfoFrom from "./LeadInfoFrom";
import { useLeadStore, usePaymentModes } from "../../../store/store";
import { getLeadById, updateLead } from "../../../api/leadApi";
import { useNavigate, useParams } from "react-router-dom";

const stages = [
  { key: "SITE_VISIT", icon: "bx bx-map" },
  { key: "APPROVAL", icon: "bx bx-check-shield" },
  { key: "TRAINING", icon: "bx bx-book" },
  { key: "PAYMENT", icon: "bx bx-credit-card" },
  { key: "FINAL_SETUP", icon: "bx bx-store" },
];

const stageKeys = [
  "SITE_VISIT",
  "APPROVAL",
  "TRAINING",
  "PAYMENT",
  "FINAL_SETUP",
];

const formatLabel = (value) =>
  value?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const LeadWizardForm = ({ onBack, }) => {
  const [activeStage, setActiveStage] = useState(0);
  const [formData, setFormData] = useState({

    stages: {

      SITE_VISIT: {
        completed: false,

        data: {
          visitType: "",
          visitDate: "",
          location: "",
          deliveryLocation: "",
        },
      },

      APPROVAL: {
        completed: false,

        data: {
          siteStatus: "",
          approvalStatus: "",
          legalStatus: "",
        },
      },

      TRAINING: {
        completed: false,

        data: {
          trainingStatus: "",
          trainingStart: "",
          parentsDetails: "",

          cartRequired: false,

          cartRequiredDate: "",

          cartPriority: "",

          cartSize: "",

          brandingType: "",

          accessories: "",
          cartManufactureStatus:
            "NOT_ASSIGNED",

          cartAssignedVendor: "",
        },
      },

      PAYMENT: {
        completed: false,

        data: {
          totalAmount: 0,

          payments: [],
        },
      },

      FINAL_SETUP: {
        completed: false,

        data: {
          contractSigned: "",

          bankDetails: "",

          kycDocument: "",

          royaltyDocument: "",
        },
      },
    },
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchLeads } = useLeadStore();

  const checkStageCompleted =
    (stageKey, data) => {

      const stage =
        data?.stages?.[
          stageKey
        ]?.data || {};

      // SITE VISIT
      if (stageKey === "SITE_VISIT") {
        return (
          stage.visitType &&
          stage.visitDate &&
          stage.location
        );
      }

      // APPROVAL
      if (stageKey === "APPROVAL") {

        return (

          stage.siteStatus ===
          "Approved" &&

          stage.approvalStatus ===
          "Approved" &&

          stage.legalStatus ===
          "Completed"
        );
      }

      // TRAINING
      if (stageKey === "TRAINING") {
        return (
          stage.trainingStatus ===
          "Completed"
        );
      }

      // PAYMENT
      if (stageKey === "PAYMENT") {

        const total =
          Number(
            stage.totalAmount || 0
          );

        const paid =
          (stage.payments || [])
            .reduce(
              (a, b) =>
                a + b.amount,
              0
            );

        return (
          total > 0 &&
          paid >= total
        );
      }

      // FINAL
      if (
        stageKey ===
        "FINAL_SETUP"
      ) {
        return (
          stage.contractSigned ===
          "Yes"
        );
      }

      return false;
    };

  useEffect(() => {

    const fetchLead = async () => {
      try {
        const res = await getLeadById(id);

const leadData = res.data;

if (
  leadData?.interestedPackage &&
  typeof leadData.interestedPackage === "object"
) {

  leadData.stages.TRAINING.data.cartAmount =
    leadData.stages.TRAINING.data.cartRequired === "yes"
      ? Number(
          leadData.interestedPackage.cartAmount || 0
        )
      : 0;

  leadData.stages.TRAINING.data.cartSize =
    leadData.interestedPackage.cartSize || "";

  leadData.stages.TRAINING.data.brandingType =
    leadData.interestedPackage.brandingType || "";

  leadData.stages.TRAINING.data.accessories =
    leadData.interestedPackage.accessories || "";
}

setFormData(leadData);

        const stagesData = res.data.stages || {};

        const firstIncomplete =
          stages.findIndex(
            (s) =>
              !checkStageCompleted(
                s.key,
                res.data
              )
          );

        setActiveStage(
          firstIncomplete === -1
            ? stages.length - 1
            : firstIncomplete
        );

      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchLead();
    }

  }, [id]);

  const stageRequiredFields = {
    SITE_VISIT: ["visitType", "visitDate", "location"],

    APPROVAL: ["siteStatus", "approvalStatus", "legalStatus"],

    TRAINING:
      formData?.stages?.TRAINING
        ?.data?.cartRequired === "yes"
        ? [
          "trainingStatus",
          "trainingStart",
          "cartRequired",
          "cartSize",
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
      const value =
        formData?.stages?.[
          currentStage
        ]?.data?.[field];

      if (!value || value.toString().trim() === "") {
        toast.error("Please fill all required fields");
        return false;
      }
    }

    return true;
  };

  const getStageStatus = (stageKey) => {
    if (stageKey === "PAYMENT") {
      const total = Number(
        formData?.stages?.PAYMENT
          ?.data?.totalAmount || 0
      );
      const paid = (
        formData?.stages?.PAYMENT
          ?.data?.payments || []
      ).reduce(
        (a, b) => a + b.amount || 0,
        0
      );

      if (paid === 0) return "not-started";
      if (paid < total) return "in-progress";
      return "completed";
    }

    if (stageKey === "APPROVAL") {

      const approvalData =
        formData?.stages
          ?.APPROVAL?.data;

      const {
        siteStatus,
        approvalStatus,
        legalStatus,
      } = approvalData || {};

      // nothing filled
      if (
        !siteStatus &&
        !approvalStatus &&
        !legalStatus
      ) {
        return "not-started";
      }

      // fully approved
      if (
        siteStatus ===
        "Approved" &&

        approvalStatus ===
        "Approved" &&

        legalStatus ===
        "Completed"
      ) {

        return "completed";
      }

      // rejected / pending / partial
      return "in-progress";
    }

    if (stageKey === "TRAINING") {

      const trainingData =
        formData?.stages?.TRAINING
          ?.data;

      const {
        trainingStatus,
        cartRequired,
        cartManufactureStatus,
      } = trainingData || {};


      // NOTHING STARTED
      if (!trainingStatus) {
        return "not-started";
      }


      // CART REQUIRED FLOW
      if (cartRequired === "yes") {

        // FULLY COMPLETED
        if (
          trainingStatus ==="Completed"
          &&
          cartManufactureStatus ==="COMPLETED"
        ) {
          return "completed";
        }
        // CANCELLED
        if (
          cartManufactureStatus ==="CANCELLED"
        ) {
          return "cancelled";
        }

        // ASSIGNED / HOLD / IN_PROGRESS
        return "in-progress";
      }


      // NORMAL FLOW
      return trainingStatus ==="Completed"
        ? "completed": "in-progress";
    }

if (
  stageKey ===
  "FINAL_SETUP"
) {

  const finalData =
    formData?.stages
      ?.FINAL_SETUP?.data || {};

  const {
    contractSigned,
    bankDetails,
    kycDocument,
    royaltyDocument,
  } = finalData;

  // NOTHING
  if (
    !contractSigned &&
    !bankDetails &&
    !kycDocument &&
    !royaltyDocument
  ) {
    return "not-started";
  }

  // ONLY YES = COMPLETED
  if (
    contractSigned === "Yes" &&
    bankDetails &&
    kycDocument &&
    royaltyDocument
  ) {
    return "completed";
  }

  // NO / PARTIAL
  return "in-progress";
}

    const required = stageRequiredFields[stageKey] || [];

    const filled = required.filter((field) => {
      const value =
        formData?.stages?.[
          stageKey
        ]?.data?.[field];

      if (value instanceof File) return true;
      if (typeof value === "string") return value.trim() !== "";

      return !!value;
    }).length;

    if (filled === 0) return "not-started";
    if (filled < required.length) return "in-progress";
    return "completed";
  };

  const allStagesCompleted =
  stages.every(
    (stage) =>
      getStageStatus(
        stage.key
      ) === "completed"
  );

  const handleNext = async () => {

    if (
      !validateCurrentStage()
    ) return;

    try {
      const currentStage = stages[activeStage].key;

      const updatedData = {
        ...formData,
        stages: {
          ...formData.stages,
          [currentStage]: {
            ...formData.stages[
            currentStage
            ],

            completed: true,
          },
        },
      };

      const payload = structuredClone(formData);

      const finalSetup =
  payload?.stages
    ?.FINAL_SETUP?.data;

if (
  finalSetup?.kycDocument instanceof File
) {

  finalSetup.kycDocumentName =
    finalSetup.kycDocument.name;

  finalSetup.kycDocument =
    finalSetup.kycDocument.name;
}

if (
  finalSetup?.royaltyDocument instanceof File
) {

  finalSetup.royaltyDocumentName =
    finalSetup.royaltyDocument.name;

  finalSetup.royaltyDocument =
    finalSetup.royaltyDocument.name;
}

      await updateLead(formData._id, payload);

      setFormData(updatedData);

      await fetchLeads();

      toast.success(
        "Saved Successfully"
      );

      if (activeStage < stages.length - 1) {
        setActiveStage(
          (prev) => prev + 1
        );
      }

    } catch (error) {
      console.log(error);
      toast.error("Update Failed");
    }
  };

  const handlePrev = () => {
    if (activeStage > 0) {
      setActiveStage((prev) => prev - 1);
    }
  };

  const handleSave = async () => {
    try {
      const payload =
  JSON.parse(
    JSON.stringify(formData)
  );

const finalSetup =
  payload?.stages
    ?.FINAL_SETUP?.data;

// ✅ KYC
if (
  formData?.stages
    ?.FINAL_SETUP?.data
    ?.kycDocument instanceof File
) {

  finalSetup.kycDocument =
    formData.stages
      .FINAL_SETUP.data
      .kycDocument.name;

  finalSetup.kycDocumentName =
    formData.stages
      .FINAL_SETUP.data
      .kycDocument.name;
}

// ✅ ROYALTY
if (
  formData?.stages
    ?.FINAL_SETUP?.data
    ?.royaltyDocument instanceof File
) {

  finalSetup.royaltyDocument =
    formData.stages
      .FINAL_SETUP.data
      .royaltyDocument.name;

  finalSetup.royaltyDocumentName =
    formData.stages
      .FINAL_SETUP.data
      .royaltyDocument.name;
}

      const currentStage = stages[activeStage].key;

      const updatedData = {
        ...formData,
        stages: {
          ...formData.stages,
          [currentStage]: {
            ...formData.stages[currentStage],

            completed:
              getStageStatus(
                currentStage
              ) === "completed",
          },
        },
      };

      await updateLead(
        formData._id,
        payload
      );

      setFormData(
        updatedData
      );

      await fetchLeads();

      toast.success(
        "Saved Successfully"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Save Failed"
      );
    }
  };

  const handleComplete = async () => {
    if (
      !allStagesCompleted
    ) {
      toast.error(
        "Complete all stages first"
      );
      return;
    }

    

    try {

      const payload =
  JSON.parse(
    JSON.stringify(formData)
  );

const finalSetup =
  payload?.stages
    ?.FINAL_SETUP?.data;

// ✅ KYC
if (
  formData?.stages
    ?.FINAL_SETUP?.data
    ?.kycDocument instanceof File
) {

  finalSetup.kycDocument =
    formData.stages
      .FINAL_SETUP.data
      .kycDocument.name;

  finalSetup.kycDocumentName =
    formData.stages
      .FINAL_SETUP.data
      .kycDocument.name;
}

// ✅ ROYALTY
if (
  formData?.stages
    ?.FINAL_SETUP?.data
    ?.royaltyDocument instanceof File
) {

  finalSetup.royaltyDocument =
    formData.stages
      .FINAL_SETUP.data
      .royaltyDocument.name;

  finalSetup.royaltyDocumentName =
    formData.stages
      .FINAL_SETUP.data
      .royaltyDocument.name;
}

      const updatedData = {
        ...formData,
        leadStatus:
          "COMPLETED",
      };

      await updateLead(
        formData._id,
        updatedData
      );

      setFormData(
        updatedData
      );

      toast.success(
        "Lead Process Completed"
      );

    } catch (error) {
      toast.error(
        "Completion Failed"
      );
    }
  };


  const { paymentModes, fetchPaymentModes } = usePaymentModes();

  useEffect(() => {

    const manualStatuses = [
      "HOLD",
      "RETURN",
      "CANCELLED",
    ];

    // 🚨 MANUAL STATUS SELECTED
    if (
      manualStatuses.includes(
        formData.leadStatus
      )
    ) {
      return;
    }

    const allStages =
      Object.values(
        formData.stages || {}
      );

    let totalFields = 0;
    let filledFields = 0;

    allStages.forEach((stage) => {

      Object.values(
        stage.data || {}
      ).forEach((value) => {

        // skip arrays empty
        if (Array.isArray(value)) {

          totalFields++;

          if (value.length > 0) {
            filledFields++;
          }

          return;
        }

        totalFields++;

        if (
          typeof value === "string"
        ) {

          if (value.trim() !== "") {
            filledFields++;
          }

        } else if (
          value !== null &&
          value !== false &&
          value !== 0 &&
          value !== undefined
        ) {

          filledFields++;
        }
      });
    });

    let autoStatus =
      "NOT_STARTED";

    if (
      filledFields > 0 &&
      filledFields < totalFields
    ) {

      autoStatus =
        "IN_PROGRESS";

    } else if (
      totalFields > 0 &&
      filledFields === totalFields
    ) {

      autoStatus =
        "COMPLETED";
    }

    setFormData((prev) => ({
      ...prev,

      leadStatus:
        autoStatus,
    }));

  }, [formData.stages]);

  useEffect(() => {
    fetchPaymentModes();
  }, [])

  return (
    <div className="page-content">
      <div className="container-fluid">

        <div className="mb-3">

          <button
            className="btn btn-secondary"

            onClick={() =>
              navigate("/crm-lead")
            }
          >
            <i className="bx bx-left-arrow-alt me-1"></i>

            Back
          </button>

        </div>

        {/* Header */}
        <div className="card mb-3">
          <div className="card-body">

            <div className="d-flex align-items-center justify-content-between">

              {stages.map((stage, index) => {
                const status = getStageStatus(stage.key);

                const circleClass =

                  status === "completed"

                    ? "bg-success text-white"

                    : status === "cancelled"

                      ? "bg-danger text-white"

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
              paymentModes={paymentModes}
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
                        disabled={!allStagesCompleted}
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
            <LeadInfoFrom formData={formData} setFormData={setFormData} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default LeadWizardForm;