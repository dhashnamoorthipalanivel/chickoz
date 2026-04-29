import React, { useEffect } from "react";

const LeadStageForm = ({ activeStage, formData, setFormData, stages }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const stage = stages[activeStage];

    {/* CALCULATE */ }
    const paidAmount = (formData.payments || []).reduce((a, b) => a + b.amount, 0);
    const totalAmount = Number(formData.totalAmount || 0);
    const isFullyPaid = paidAmount >= totalAmount;

    // Cart size and package
    useEffect(() => {
        if (formData.package === "Basic") {
            setFormData(prev => ({
                ...prev,
                cartSize: "4 x 4",
                brandingType: "Sticker",
                accessories: "Basic Setup"
            }));
        }

        if (formData.package === "Standard") {
            setFormData(prev => ({
                ...prev,
                cartSize: "6 x 4",
                brandingType: "ACP Branding",
                accessories: "Sink + Rack"
            }));
        }

        if (formData.package === "Premium") {
            setFormData(prev => ({
                ...prev,
                cartSize: "8 x 6",
                brandingType: "Premium LED Branding",
                accessories: "Full Setup"
            }));
        }
    }, [formData.package]);

    return (
        <div className="card">
            <div className="card-body">

                <div className="row g-3">

                    {/* SITE VISIT */}
                    {stage === "SITE_VISIT" && (
                        <>
                            <h5 className="mb-2">Site Visit & Walk-in</h5>

                            <div className="col-md-6">
                                <label className="form-label">Visit Type <span className="text-danger">*</span></label>
                                <select name="visitType" className="form-select" onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Walk-in</option>
                                    <option>Site Visit</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Visit Date <span className="text-danger">*</span></label>
                                <input type="date" name="visitDate" className="form-control" onChange={handleChange} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Location <span className="text-danger">*</span></label>
                                <input type="text" name="location" className="form-control" onChange={handleChange} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Delivery Location</label>
                                <input type="text" name="deliveryLocation" className="form-control" onChange={handleChange} />
                            </div>
                        </>
                    )}

                    {/* APPROVAL */}
                    {stage === "APPROVAL" && (
                        <>
                            <h5 className="mb-2">Approval & Legal</h5>

                            <div className="col-md-6">
                                <label className="form-label">Site Status <span className="text-danger">*</span></label>
                                <select name="siteStatus" className="form-select" onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Pending</option>
                                    <option>Approved</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Approval Status <span className="text-danger">*</span></label>
                                <select name="approvalStatus" className="form-select" onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option>Approved</option>
                                    <option>Rejected</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Legal Formalities <span className="text-danger">*</span></label>
                                <select name="legalStatus" className="form-select" onChange={handleChange}>
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
                                        className="form-control"
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Parent Details */}
                                <div className="col-md-6">
                                    <label className="form-label">Parent Details</label>
                                    <input
                                        type="text"
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
                                        className="form-select"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                {/* Cart Fields */}
                                {formData.cartRequired === "yes" && (
                                    <>
                                        <div className="col-md-6">
                                            <label className="form-label">Cart Size</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.cartSize || ""}
                                                readOnly
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Branding Type</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.brandingType || ""}
                                                readOnly
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Accessories</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.accessories || ""}
                                                readOnly
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Required Date</label>
                                            <input
                                                type="date"
                                                name="cartRequiredDate"
                                                className="form-control"
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Priority</label>
                                            <select
                                                name="cartPriority"
                                                className="form-select"
                                                onChange={handleChange}
                                            >
                                                <option value="">Select</option>
                                                <option>Normal</option>
                                                <option>Urgent</option>
                                            </select>
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

                            {/* TOTAL */}
                            <div className="col-md-6">
                                <label className="form-label">Total Amount <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    name="totalAmount"
                                    className="form-control"
                                    value={formData.totalAmount || ""}
                                    onChange={handleChange}
                                />
                            </div>


                            {/* TEMP AMOUNT */}
                            <div className="col-md-6">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.tempAmount || ""}
                                    disabled={isFullyPaid}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            tempAmount: e.target.value,
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
                                    value={formData.tempDate || ""}
                                    disabled={isFullyPaid}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            tempDate: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            {/* ADD BUTTON */}
                            <div className="col-md-6">
                                <label className="form-label d-block">&nbsp;</label>
                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    disabled={isFullyPaid}
                                    onClick={() => {
                                        if (!formData.tempAmount || !formData.tempDate) return;

                                        const newPayment = {
                                            amount: Number(formData.tempAmount),
                                            date: formData.tempDate || "-", // optional date
                                        };

                                        setFormData((prev) => ({
                                            ...prev,
                                            payments: [...(prev.payments || []), newPayment],
                                            tempAmount: "",
                                            tempDate: "",
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
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(formData.payments || []).map((p, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{p.date}</td>
                                                <td>{p.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAID */}
                            <div className="col-md-6">
                                <label className="form-label">Paid Amount</label>
                                <input
                                    className="form-control"
                                    value={paidAmount}
                                    readOnly
                                />
                            </div>

                            {/* PENDING */}
                            <div className="col-md-6">
                                <label className="form-label">Pending</label>
                                <input
                                    className="form-control"
                                    value={totalAmount - paidAmount}
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
                                <select name="contractSigned" className="form-select" onChange={handleChange}>
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
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            kycDocument: e.target.files[0],
                                        }))
                                    }
                                />
                            </div>

                            <div className="col-md-6 mt-3">
                                <label>Bank Details <span className="text-danger">*</span></label>
                                <input type="text" name="bankDetails" className="form-control" onChange={handleChange} />
                            </div>

                            <div className="col-md-6 mt-3">
                                <label>Royalty Document <span className="text-danger">*</span></label>
                                <input
                                    type="file"
                                    name="royaltyDocument"
                                    className="form-control"
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            royaltyDocument: e.target.files[0],
                                        }))
                                    }
                                />
                            </div>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
};

export default LeadStageForm;