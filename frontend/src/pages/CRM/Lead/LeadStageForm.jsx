import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";


const formatLabel = (value) => {
    return value
        ?.toString()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const LeadStageForm = ({ activeStage, formData, setFormData, stages, paymentModes, isLocked }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        const currentStage = stages[activeStage];

        setFormData((prev) => {
            const updatedData = {
                ...prev.stages[
                    currentStage
                ].data,
                [name]: name.toLowerCase().includes("date")
   ? new Date(value)
   : value,
            };
            // ✅ CART REQUIRED LOGIC
            if (name === "cartRequired") {
                // ✅ NO
                if (value === "no") {
                    updatedData.cartRequiredDate = "";
                    updatedData.cartPriority = "";
                    updatedData.cartSize = "";
                    updatedData.cartAmount = 0;
                    updatedData.cartManufactureStatus = "NOT_REQUIRED";
                    updatedData.cartAssignedVendor = "";
                    updatedData.brandingType = "";
                    updatedData.accessories = "";
                }
                // ✅ YES AGAIN
                if (value === "yes") {
                    updatedData.cartRequiredDate = "";
                    updatedData.cartPriority = "";
                    updatedData.cartSize =
                        formData?.interestedPackage
                            ?.cartSize || "";
                    updatedData.cartAmount =
                        formData?.interestedPackage
                            ?.cartAmount || 0;
                    updatedData.brandingType =
                        formData?.interestedPackage
                            ?.brandingType || "";

                    updatedData.accessories =
                        formData?.interestedPackage
                            ?.accessories || "";
                    updatedData.cartManufactureStatus = "PENDING";
                }
            }

            return {
                ...prev,
                stages: {
                    ...prev.stages,
                    [currentStage]: {
                        ...prev.stages[
                        currentStage
                        ],
                        data: updatedData,
                    },
                },
            };
        });
    };

    const stage = stages[activeStage];

    const stageData =
        formData?.stages?.[
            stage
        ]?.data || {};

    // const isLocked = [
    //     "HOLD",
    //     "RETURN",
    //     "CANCELLED",
    // ].includes(
    //     formData?.leadStatus
    // );

    {/* CALCULATE */ }
    const paidAmount = (stageData.payments || []).reduce((a, b) => a + b.amount, 0);
    // 
    const packageData = formData?.interestedPackage || {};
    const cartRequired = formData?.stages?.TRAINING?.data?.cartRequired;

    const packagePrice = Number(packageData.price || 0);
    const cartAmount = Number(packageData.cartAmount || 0);
    const gstPercentage = Number(packageData.taxPercentage || 0);

    // ✅ BASE AMOUNT
    let baseAmount = packagePrice;

    // ✅ ADD CART ONLY IF YES
    if (cartRequired === "yes" || cartRequired === true
    ) {
        baseAmount += cartAmount;
    }
    // ✅ GST
    let gstAmount = 0;

    if (packageData.isTaxApplicable) {

        if (packageData.isTaxInclusive) {

            gstAmount =
                (baseAmount * gstPercentage)
                / (100 + gstPercentage);

        } else {

            gstAmount =
                (baseAmount * gstPercentage)
                / 100;
        }
    }
    // ✅ FINAL TOTAL
    const totalAmount = packageData.isTaxInclusive ? Math.round(baseAmount) : Math.round(
        baseAmount + gstAmount);
    const isFullyPaid = paidAmount >= totalAmount;

    useEffect(() => {
        setFormData((prev) => {
            const currentPaid =
                prev?.stages?.PAYMENT
                    ?.data?.paidAmount || 0;

            const currentPending =
                prev?.stages?.PAYMENT
                    ?.data?.pendingAmount || 0;

            const newPending =
                Math.max(totalAmount - paidAmount, 0);

            // ✅ PREVENT LOOP
            if (currentPaid === paidAmount && currentPending === newPending) {
                return prev;
            }

            return {
                ...prev,
                stages: {
                    ...prev.stages,
                    PAYMENT: {
                        ...prev.stages.PAYMENT,
                        data: {
                            ...prev.stages.PAYMENT.data,
                            paidAmount: paidAmount,
                            pendingAmount:
                                newPending,
                        },
                    },
                },
            };
        });

    }, [paidAmount, totalAmount]);

    // Cart size and package
    // useEffect(() => {
    //     if (stageData.package === "Basic") {
    //         setFormData(prev => ({
    //             ...prev,
    //             cartSize: "4 x 4",
    //             brandingType: "Sticker",
    //             accessories: "Basic Setup"
    //         }));
    //     }

    //     if (stageData.package === "Standard") {
    //         setFormData(prev => ({
    //             ...prev,
    //             cartSize: "6 x 4",
    //             brandingType: "ACP Branding",
    //             accessories: "Sink + Rack"
    //         }));
    //     }

    //     if (stageData.package === "Premium") {
    //         setFormData(prev => ({
    //             ...prev,
    //             cartSize: "8 x 6",
    //             brandingType: "Premium LED Branding",
    //             accessories: "Full Setup"
    //         }));
    //     }
    // }, [stageData.package]);

    useEffect(() => {

        if (!formData?.interestedPackage) return;

        const pkg = formData.interestedPackage;

        setFormData((prev) => {

            // if (
            //     prev?.stages?.PAYMENT?.data?.totalAmount === pkg.totalAmount
            // ) {
            //     return prev;
            // }

            return {
                ...prev,
                stages: {
                    ...prev.stages,
                    TRAINING: {

                        ...prev.stages.TRAINING,

                        data: {

                            ...prev.stages.TRAINING.data,

                            cartRequired:
                                prev?.stages?.TRAINING
                                    ?.data?.cartRequired || "",

                            trainingStatus:
                                prev?.stages?.TRAINING
                                    ?.data?.trainingStatus || "",

                            trainingStart:
                                prev?.stages?.TRAINING
                                    ?.data?.trainingStart || "",

                            parentsDetails:
                                prev?.stages?.TRAINING
                                    ?.data?.parentsDetails || "",

                            cartRequiredDate:
                                prev?.stages?.TRAINING
                                    ?.data?.cartRequiredDate || "",

                            cartPriority:
                                prev?.stages?.TRAINING
                                    ?.data?.cartPriority || "",

                            cartManufactureStatus:
                                prev?.stages?.TRAINING
                                    ?.data?.cartManufactureStatus || "",

                            cartAssignedVendor:
                                prev?.stages?.TRAINING
                                    ?.data?.cartAssignedVendor || "",

                            cartSize:
                                prev?.stages?.TRAINING
                                    ?.data?.cartRequired === "yes"
                                    ||
                                    prev?.stages?.TRAINING
                                        ?.data?.cartRequired === true
                                    ? pkg.cartSize || ""
                                    : "",

                            cartAmount:
                                prev?.stages?.TRAINING
                                    ?.data?.cartRequired === "yes"
                                    ||
                                    prev?.stages?.TRAINING
                                        ?.data?.cartRequired === true
                                    ? pkg.cartAmount || 0
                                    : 0,
                        },
                    },

                    PAYMENT: {
                        ...prev.stages.PAYMENT,
                        data: {
                            ...prev.stages.PAYMENT.data,
                            totalAmount: totalAmount,
                            advanceAmount:
                                pkg.advanceAmount || 0,
                        },
                    },
                },
            };
        });

    }, [formData?.interestedPackage, formData?.stages?.TRAINING?.data?.cartRequired]);

    return (
        <div className="card">
            <div className="card-body" style={{ pointerEvents: isLocked ? "none" : "auto", opacity: isLocked ? 0.8 : 1, }}>
                {isLocked && (<div className="alert alert-danger">  Lead is {" "} <strong> {formatLabel(formData.leadStatus)}</strong>. Editing is disabled. </div>)}
                <div className="row g-3">

                    {/* SITE VISIT */}
                    {stage === "SITE_VISIT" && (
                        <>
                            <h5 className="mb-2">Site Visit & Walk-in</h5>

                            <div className="col-md-6">
                                <label className="form-label">Visit Type <span className="text-danger">*</span></label>
                                <select name="visitType" className="form-select" value={stageData.visitType || ""} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Walk-in</option>
                                    <option>Site Visit</option>
                                </select>
                            </div>

                            <div className="col-md-6">

                                <label className="form-label">
                                    Visit Date
                                    <span className="text-danger">*</span>
                                </label>

                                <input type="date" name="visitDate" className="form-control"
                                    value={
  stageData.visitDate
    ? new Date(stageData.visitDate)
        .toISOString()
        .split("T")[0]
    : ""
} onChange={handleChange} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Location <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    name="location"
                                    className="form-control"
                                    value={stageData.location || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Delivery Location</label>
                                <input
                                    type="text"
                                    name="deliveryLocation"
                                    className="form-control"
                                    value={stageData.deliveryLocation || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {/* APPROVAL */}
                    {stage === "APPROVAL" && (
                        <>
                            <h5 className="mb-2">Approval & Legal</h5>

                            <div className="col-md-6">
                                <label className="form-label">Site Status <span className="text-danger">*</span></label>
                                <select name="siteStatus" className="form-select" value={stageData.siteStatus || ""} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Pending</option>
                                    <option>Approved</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Approval Status <span className="text-danger">*</span></label>
                                <select name="approvalStatus" className="form-select" value={stageData.approvalStatus || ""} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Approved</option>
                                    <option>Rejected</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Legal Formalities <span className="text-danger">*</span></label>
                                <select name="legalStatus" className="form-select" value={stageData.legalStatus || ""} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Pending</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* TRAINING */}
                    {stage === "TRAINING" && (
                        <>
                            <h5 className="mb-3">Training</h5>
                            <div className="row g-3">
                                {/* Training Status */}
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Training Status <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        name="trainingStatus"
                                        className="form-select"
                                        value={
                                            stageData.trainingStatus || ""
                                        }
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </div>

                                {/* Training Start */}
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Training Start Date <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="trainingStart"
                                        value={
                                            stageData.trainingStart
                                                ? new Date(
                                                    stageData.trainingStart
                                                )
                                                    .toISOString()
                                                    .split("T")[0]
                                                : ""
                                        }
                                        className="form-control"
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Parent Details */}
                                <div className="col-md-6">
                                    <label className="form-label">Parent Details</label>
                                    <input
                                        type="text"
                                        value={stageData.parentsDetails || ""}
                                        name="parentsDetails"
                                        className="form-control"
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Cart Required */}
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Cart Required <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        name="cartRequired"
                                        value={stageData.cartRequired === true ? "yes" : stageData.cartRequired === false ? "no" : stageData.cartRequired || ""
                                        }
                                        className="form-select"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                {/* Cart Fields */}
                                {(stageData.cartRequired === "yes" || stageData.cartRequired === true) && (
                                    <>
                                        <div className="col-md-6">
                                            <label className="form-label">Cart Size <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={stageData.cartSize || ""}
                                                readOnly
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Branding Type</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={stageData.brandingType || ""}
                                                readOnly
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Accessories</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={stageData.accessories || ""}
                                                readOnly
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Required Date <span className="text-danger">*</span></label>
                                            <input
                                                type="date"
                                                value={
                                                    stageData.cartRequiredDate
                                                        ? new Date(
                                                            stageData.cartRequiredDate
                                                        )
                                                            .toISOString()
                                                            .split("T")[0]
                                                        : ""
                                                }
                                                name="cartRequiredDate"
                                                className="form-control"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Priority <span className="text-danger">*</span></label>
                                            <select
                                                name="cartPriority"
                                                value={stageData.cartPriority || ""}
                                                className="form-select"
                                                onChange={handleChange}
                                            >
                                                <option value="">Select</option>
                                                <option>Normal</option>
                                                <option>Urgent</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Cart Manufacture Status
                                            </label>

                                            <input type="text" className="form-control"
                                                value={
                                                    formatLabel(stageData.cartManufactureStatus) ||
                                                    "NOT_REQUIRED"
                                                }
                                                readOnly
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {/* PAYMENT */}
                    {stage === "PAYMENT" && (
                        <>
                            <h5 className="mb-2">Payment</h5>

                            {/* PACKAGE AMOUNT */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Package Amount
                                </label>

                                <input
                                    className="form-control"
                                    value={
                                        formData?.interestedPackage?.price || 0
                                    }
                                    readOnly
                                />
                            </div>

                            {/* GST PERCENTAGE */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    GST Percentage
                                </label>

                                <input
                                    className="form-control"
                                    value={
                                        `${formData?.interestedPackage?.taxPercentage || 0}%`
                                    }
                                    readOnly
                                />
                            </div>

                            {/* CART AMOUNT */}
                            {(
                                formData?.stages?.TRAINING
                                    ?.data?.cartRequired === "yes"

                                ||

                                formData?.stages?.TRAINING
                                    ?.data?.cartRequired === true
                            ) && (

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Cart Amount
                                        </label>

                                        <input
                                            className="form-control"
                                            value={
                                                formData?.interestedPackage
                                                    ?.cartAmount || 0
                                            }
                                            readOnly
                                        />
                                    </div>

                                )}

                            {/* TOTAL PAYABLE */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Total Payable Amount
                                </label>

                                <input
                                    className="form-control"
                                    value={totalAmount}
                                    readOnly
                                />
                            </div>

                            {/* ADVANCE */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Advance Amount
                                </label>

                                <input
                                    className="form-control"
                                    value={
                                        formData?.interestedPackage?.advanceAmount || 0
                                    }
                                    readOnly
                                />
                            </div>

                            {/* ROYALTY */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Royalty
                                </label>
                                <input
                                    className="form-control"
                                    value={
                                        formData?.interestedPackage?.royaltyType === "PERCENTAGE"
                                            ? `${formData?.interestedPackage?.royaltyValue}%`
                                            : `₹ ${formData?.interestedPackage?.royaltyValue}`
                                    }
                                    readOnly
                                />
                            </div>


                            {/* TEMP AMOUNT */}
                            <div className="col-md-6">
                                <label className="form-label">Amount <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={stageData.tempAmount || ""}
                                    disabled={isFullyPaid}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            stages: {
                                                ...prev.stages,
                                                PAYMENT: {
                                                    ...prev.stages.PAYMENT,
                                                    data: {
                                                        ...prev.stages.PAYMENT.data,
                                                        tempAmount:
                                                            e.target.value,
                                                    },
                                                },
                                            },
                                        }))
                                    }
                                />
                            </div>

                            {/* TEMP DATE (NOT MANDATORY) */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Date <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={stageData.tempDate || ""}
                                    disabled={isFullyPaid}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            stages: {
                                                ...prev.stages,
                                                PAYMENT: {
                                                    ...prev.stages.PAYMENT,
                                                    data: {
                                                        ...prev.stages.PAYMENT.data,
                                                        tempDate: e.target.value,
                                                    },
                                                },
                                            },
                                        }))
                                    }
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Payment Mode
                                    <span className="text-danger">*</span>
                                </label>

                                <select
                                    className="form-select"
                                    value={stageData.tempPaymentMode || ""}
                                    disabled={isFullyPaid}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            stages: {
                                                ...prev.stages,
                                                PAYMENT: {
                                                    ...prev.stages.PAYMENT,
                                                    data: {
                                                        ...prev.stages.PAYMENT.data,
                                                        tempPaymentMode:
                                                            e.target.value,
                                                    },
                                                },
                                            },
                                        }))
                                    }
                                >
                                    <option value="">Select</option>

                                    {paymentModes?.length > 0 ? (
                                        paymentModes.map((mode) => (
                                            <option
                                                key={mode._id}
                                                value={mode._id}
                                            >
                                                {mode.paymentName}
                                            </option>))) : (
                                        <option disabled>
                                            No Payment Modes
                                        </option>
                                    )}
                                </select>
                            </div>



                            {/* ADD BUTTON */}
                            <div className="col-md-6">
                                <label className="form-label d-block">&nbsp;</label>
                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    disabled={isFullyPaid}
                                    onClick={() => {
                                        if (
                                            !stageData.tempAmount ||
                                            !stageData.tempDate ||
                                            !stageData.tempPaymentMode
                                        ) {
                                            toast.error("Fill all payment fields");
                                            return;
                                        }

                                        const selectedMode = paymentModes.find((x) => String(x._id) ===
                                            String(stageData.tempPaymentMode));

                                        const enteredAmount =
                                            Number(stageData.tempAmount);

                                        const newPayment = {
                                            amount: enteredAmount,
                                            date: stageData.tempDate,
                                            paymentMode: stageData.tempPaymentMode,
                                        };

                                        if (
                                            enteredAmount >
                                            stageData.pendingAmount
                                        ) {
                                            toast.error(
                                                "Amount exceeds pending amount"
                                            );

                                            return;
                                        }

                                        setFormData((prev) => ({
                                            ...prev,
                                            stages: {
                                                ...prev.stages,
                                                PAYMENT: {
                                                    ...prev.stages.PAYMENT,
                                                    data: {
                                                        ...prev.stages.PAYMENT.data,
                                                        payments: [
                                                            ...(prev.stages.PAYMENT
                                                                ?.data?.payments || []),
                                                            newPayment,

                                                        ],
                                                        tempAmount: "",
                                                        tempDate: "",
                                                        tempPaymentMode: "",
                                                        paidAmount:
                                                            paidAmount +
                                                            Number(stageData.tempAmount),

                                                        pendingAmount:
                                                            Math.max(
                                                                totalAmount -
                                                                (
                                                                    paidAmount +
                                                                    Number(stageData.tempAmount)
                                                                ),
                                                                0
                                                            ),

                                                    },
                                                },
                                            },
                                        }));
                                    }}
                                >
                                    Add Payment
                                </button>
                            </div>

                            {/* PAYMENT LIST */}
                            <div className="col-md-12">
                                <label className="form-label">Payment History</label>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Date</th>
                                            <th>Payment Mode</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {(stageData.payments || []).length > 0 ? (

                                            (stageData.payments || []).map((p, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        {p.date
                                                            ? new Date(p.date).toLocaleDateString()
                                                            : "-"}
                                                    </td>
                                                    <td>
                                                        {
                                                            paymentModes.find(
                                                                (x) =>
                                                                    String(x._id) ===
                                                                    String(p.paymentMode)
                                                            )?.paymentName || "-"
                                                        }
                                                    </td>

                                                    <td>{p.amount}</td>
                                                </tr>
                                            ))

                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="text-center text-muted"
                                                >
                                                    No Payments Added
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAID */}
                            <div className="col-md-6">
                                <label className="form-label">Paid Amount</label>
                                <input
                                    className="form-control"
                                    value={
                                        stageData.paidAmount || 0
                                    }
                                    readOnly
                                />
                            </div>

                            {/* PENDING */}
                            <div className="col-md-6">
                                <label className="form-label">Pending</label>
                                <input
                                    className="form-control"
                                    value={
                                        stageData.pendingAmount || 0
                                    }
                                    readOnly
                                />
                            </div>
                        </>
                    )}

                    {/* FINAL */}
                    {stage === "FINAL_SETUP" && (
                        <>
                            <h5 className="mb-2">Contract & Documents</h5>

                            <div className="col-md-6">
                                <label className="form-label">Contract Signed <span className="text-danger">*</span></label>
                                <select name="contractSigned" className="form-select" value={stageData.contractSigned || ""} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label>KYC Document <span className="text-danger">*</span></label>
                                <input
                                    type="file"
                                    name="kycDocument"
                                    className="form-control"
                                    onChange={(e) => {

                                        const file =
                                            e.target.files[0];

                                        if (!file) return;

                                        setFormData((prev) => ({
                                            ...prev,
                                            stages: {
                                                ...prev.stages,
                                                FINAL_SETUP: {
                                                    ...prev.stages.FINAL_SETUP,
                                                    data: {
                                                        ...prev.stages.FINAL_SETUP.data,

                                                        kycDocument:
                                                            file,
                                                        kycDocumentName:
                                                            file.name,
                                                    },
                                                },
                                            },
                                        }));
                                    }}
                                />
                                {
                                    stageData.kycDocumentName && (
                                        <div className="mt-2">
                                            <span className="badge bg-success">
                                                <i className="bx bx-check-circle me-1"></i>
                                                {
                                                    stageData.kycDocumentName
                                                }
                                            </span>
                                        </div>
                                    )
                                }
                            </div>

                            <div className="col-md-6 mt-3">
                                <label>Bank Details <span className="text-danger">*</span></label>
                                <input type="text" name="bankDetails" className="form-control" value={stageData.bankDetails || ""} onChange={handleChange} />
                            </div>

                            <div className="col-md-6 mt-3">
                                <label>Royalty Document <span className="text-danger">*</span></label>
                                <input
                                    type="file"
                                    name="royaltyDocument"
                                    className="form-control"
                                    onChange={(e) => {

                                        const file =
                                            e.target.files[0];

                                        if (!file) return;

                                        setFormData((prev) => ({
                                            ...prev,
                                            stages: {
                                                ...prev.stages,
                                                FINAL_SETUP: {
                                                    ...prev.stages.FINAL_SETUP,
                                                    data: {
                                                        ...prev.stages.FINAL_SETUP.data,

                                                        royaltyDocument:
                                                            file,

                                                        royaltyDocumentName:
                                                            file.name,
                                                    },
                                                },
                                            },
                                        }));
                                    }}
                                />

                                {
                                    stageData.royaltyDocumentName && (

                                        <div className="mt-2">

                                            <span className="badge bg-success">

                                                <i className="bx bx-check-circle me-1"></i>

                                                {
                                                    stageData.royaltyDocumentName
                                                }

                                            </span>

                                        </div>
                                    )
                                }
                            </div>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
};

export default LeadStageForm;