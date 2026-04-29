// KishokStageForm.jsx
import React, { useEffect } from "react";

const KishokStageForm = ({
  activeStage,
  stages,
  formData,
  setFormData,
}) => {
  const stage = stages[activeStage];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Auto Fetch Package Details
  useEffect(() => {
    if (formData.package === "Basic") {
      setFormData((prev) => ({
        ...prev,
        cartSize: "4 x 4",
        brandingType: "Sticker",
        accessories: "Basic Setup",
        totalAmount: 85000,
      }));
    }

    if (formData.package === "Standard") {
      setFormData((prev) => ({
        ...prev,
        cartSize: "6 x 4",
        brandingType: "ACP Branding",
        accessories: "Sink + Rack",
        totalAmount: 125000,
      }));
    }

    if (formData.package === "Premium") {
      setFormData((prev) => ({
        ...prev,
        cartSize: "8 x 6",
        brandingType: "LED Branding",
        accessories: "Full Setup",
        totalAmount: 175000,
      }));
    }
  }, [formData.package]);

  const paidAmount = (formData.payments || []).reduce(
    (a, b) => a + b.amount,
    0
  );

  const totalAmount = Number(formData.totalAmount || 0);
  const isFullyPaid = paidAmount >= totalAmount;

  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-3">

          {stage === "REQUIREMENT" && (
            <>
              <h5 className="mb-2">Cart Requirement</h5>

              <div className="col-md-6">
                <label className="form-label">Lead ID</label>
                <input className="form-control" value={formData.leadId} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Customer Name</label>
                <input className="form-control" value={formData.customerName} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input className="form-control" value={formData.location} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Package</label>
                <input className="form-control" value={formData.package} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Cart Size</label>
                <input className="form-control" value={formData.cartSize || ""} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Branding Type</label>
                <input className="form-control" value={formData.brandingType || ""} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Accessories</label>
                <input className="form-control" value={formData.accessories || ""} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Required Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="requiredDate"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Priority <span className="text-danger">*</span></label>
                <select
                  name="priority"
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

          {stage === "VENDOR_ASSIGN" && (
            <>
              <h5 className="mb-2">Vendor Assignment</h5>

              <div className="col-md-6">
                <label className="form-label">Vendor Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="vendorName"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Vendor Phone</label>
                <input
                  type="text"
                  name="vendorPhone"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Assign Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="assignDate"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Expected Delivery <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="expectedDate"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {stage === "PRODUCTION" && (
            <>
              <h5 className="mb-2">Production</h5>

              <div className="col-md-6">
                <label className="form-label">Production Status</label>
                <select
                  name="productionStatus"
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Dispatch Date</label>
                <input
                  type="date"
                  name="dispatchDate"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Cart Image</label>
                <input type="file" className="form-control" />
              </div>
            </>
          )}

          {stage === "PAYMENT" && (
            <>
              <h5 className="mb-2">Payment</h5>

              <div className="col-md-6">
                <label className="form-label">Total Amount</label>
                <input
                  className="form-control"
                  value={formData.totalAmount || ""}
                  readOnly
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Amount <span className="text-danger">*</span></label>
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

              <div className="col-md-6">
                <label className="form-label">Date <span className="text-danger">*</span></label>
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
                      date: formData.tempDate,
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

              <div className="col-md-6">
                <label className="form-label">Paid Amount</label>
                <input className="form-control" value={paidAmount} readOnly />
              </div>

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

        </div>
      </div>
    </div>
  );
};

export default KishokStageForm;