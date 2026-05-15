// KishokStageForm.jsx
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const KishokStageForm = ({
  activeStage,
  stages,
  formData,
  setFormData,
  paymentModes
}) => {
  const stage = stages[activeStage];
  const stageData = formData || {};

  const isLocked =[
    "HOLD",
    "RETURN",
    "CANCELLED",
  ].includes(
    formData?.leadStatus
  ) ||

  formData?.isFranchiseCreated;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const paidAmount =
    (stageData.payments || [])
      .reduce(
        (a, b) =>
          a + Number(b.amount || 0),
        0
      );

  const cartAmount = Number(formData.cartAmount ?? 0);
  const isFullyPaid = cartAmount > 0 && paidAmount >= cartAmount;

  return (
    <div className="card">
      <div className="card-body" style={{ pointerEvents: isLocked ? "none" : "auto", opacity: isLocked ? 0.8 : 1, }}>
        {
  isLocked && (

    <div className="alert alert-danger mb-3">

      {
        formData?.isFranchiseCreated ? (

          <>
            <strong>
              Franchise already created.
            </strong>

            {" "}Editing is disabled.
          </>

        ) : (

          <>
            Lead is{" "}

            <strong>
              {formData?.leadStatus}
            </strong>

            . Editing is disabled.
          </>
        )
      }

    </div>
  )
}
        <div className="row g-3">
          {stage === "REQUIREMENT" && (
            <>
              <h5 className="mb-2">Cart Requirement</h5>

              <div className="col-md-6">
                <label className="form-label">Reference ID</label>
                <input className="form-control" value={formData.referenceId || ""} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Customer Name</label>
                <input className="form-control" value={formData.customerName || ""} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Place</label>
                <input className="form-control" value={formData.place || ""} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label">Package</label>
                <input className="form-control" value={formData.packageName || ""} readOnly />
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
   value={
      formData.requiredDate
         ? new Date(formData.requiredDate)
              .toISOString()
              .split("T")[0]
         : ""
   }
   className="form-control"
   readOnly
/>
              </div>

              <div className="col-md-6">
                <label className="form-label">Priority <span className="text-danger">*</span></label>
                <select
                  name="priority"
                  className="form-select"
                  value={formData.priority || ""}
                  onChange={handleChange}
                  disabled
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
                  value={formData.vendorName || ""}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Vendor Phone</label>
                <input
                  type="text"
                  name="vendorPhone"
                  value={formData.vendorPhone || ""}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Assign Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="assignDate"
                  value={
                    formData.assignDate
                      ? new Date(formData.assignDate)
                        .toISOString()
                        .split("T")[0]
                      : ""
                  }
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Expected Delivery <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="expectedDate"
                  value={
                    formData.expectedDate
                      ? new Date(formData.expectedDate)
                        .toISOString()
                        .split("T")[0]
                      : ""
                  }
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
                <label className="form-label">Manufacture Status <span className="text-danger">*</span></label>
                <select
                  name="manufactureStatus"
                  value={formData.manufactureStatus || ""}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="">Select</option>

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="ASSIGNED">
                    Assigned
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="HOLD">
                    Hold
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Dispatch Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="dispatchDate"
                  value={formData.dispatchDate ? new Date(formData.dispatchDate).toISOString()
                    .split("T")[0]
                    : ""
                  }
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">
                  Cart Image
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setFormData((prev) => ({
                      ...prev,
                      cartImage: file,
                      cartImageName:
                        file.name,
                    }));
                  }}
                />
                {
                  (
                    formData.cartImageName ||
                    formData.cartImage
                  ) && (

                    <div className="mt-2">

                      <span className="badge bg-success">

                        <i className="bx bx-check-circle me-1"></i>

                        {
                          formData.cartImageName ||

                          (
                            typeof formData.cartImage ===
                              "string"

                              ? formData.cartImage

                              : formData.cartImage?.name
                          )
                        }

                      </span>

                    </div>
                  )
                }
              </div>
            </>
          )}

          {stage === "PAYMENT" && (
            <>
              <h5 className="mb-2">Payment</h5>

              <div className="col-md-6">
                <label className="form-label">Cart Amount</label>
                <input
                  className="form-control"
                  value={formData.cartAmount || ""}
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

                <label className="form-label">
                  Payment Mode
                  <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  value={
                    formData.tempPaymentMode || ""
                  }
                  disabled={isFullyPaid}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tempPaymentMode:
                        e.target.value,
                    }))
                  }
                >

                  <option value="">Select</option>
                  {
                    paymentModes?.length > 0 ? (
                      paymentModes.map((mode) => (
                        <option
                          key={mode._id}
                          value={mode._id}
                        >
                          {mode.paymentName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Payment Modes</option>
                    )
                  }
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label d-block">&nbsp;</label>

                <button
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={isFullyPaid}
                  onClick={() => {

                    if (
                      !formData.tempAmount ||
                      !formData.tempDate ||
                      !formData.tempPaymentMode
                    ) {
                      toast.error("Please fill all payment fields");
                      return;
                    }

                    const enteredAmount =
  Number(formData.tempAmount);

const pendingAmount =
  Math.max(
    cartAmount - paidAmount,
    0
  );

if (
  enteredAmount >
  pendingAmount
) {

  toast.error(
    "Amount exceeds pending amount"
  );

  return;
}

                    const newPayment = {
                      amount: Number(
                        formData.tempAmount), paymentDate: formData.tempDate,
                      paymentMode: formData.tempPaymentMode || null,
                    };

                    const updatedPayments = [
                      ...(formData.payments || []),
                      newPayment,
                    ];

                    const updatedPaid =
                      updatedPayments.reduce(
                        (a, b) =>
                          a + Number(
                            b.amount || 0
                          ),
                        0
                      );

                    setFormData((prev) => ({
                      ...prev,
                      payments:
                        updatedPayments,
                      paidAmount:
                        updatedPaid,
                      pendingAmount:
                        Number(
                          prev.cartAmount || 0
                        ) - updatedPaid,

                      tempAmount: "",
                      tempDate: "",
                      tempPaymentMode: "",
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
                      <th>Payment Mode</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(formData.payments || []).map((p, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "-"}</td>
                        <td>{p.amount}</td>
                        <td>{paymentModes?.find((x) => String(x._id) === String(p.paymentMode))?.paymentName || "-"}</td>
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
                  value={Math.max(cartAmount - paidAmount, 0)}
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