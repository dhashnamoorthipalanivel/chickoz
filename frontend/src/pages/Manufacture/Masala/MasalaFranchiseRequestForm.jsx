import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const MasalaFranchiseRequestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const editData = state?.rowData;

  const isEdit = !!id;

  const [formData, setFormData] = useState({
    franchiseId: "",
    franchiseName: "",
    orderDate: "",
    requiredDate: "",
    priority: "",
    paymentOption: "",
    remarks: "",
    items: [
      {
        itemName: "",
        quantity: "",
      },
    ],
  });

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        franchiseId: editData.franchiseId || "",
        franchiseName: editData.franchiseName || "",
        orderDate: editData.createdDate || "",
        requiredDate: editData.requiredDate || "",
        priority: editData.priority || "",
        paymentOption: editData.paymentOption || "",
        remarks: editData.remarks || "",
        items: editData.items || [
          {
            itemName: "",
            quantity: "",
          },
        ],
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        orderDate: new Date().toISOString().split("T")[0],
      }));
    }
  }, [isEdit, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];

    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      items: updated,
    }));
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemName: "",
          quantity: "",
        },
      ],
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length === 1) return;

    const updated = formData.items.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      items: updated,
    }));
  };

  const validateForm = () => {
    if (
      !formData.franchiseId ||
      !formData.franchiseName ||
      !formData.requiredDate ||
      !formData.priority ||
      !formData.paymentOption
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    const invalidItem = formData.items.some(
      (item) => !item.itemName || !item.quantity
    );

    if (invalidItem) {
      toast.error("Please fill item details");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    toast.success(
      isEdit
        ? "Request Updated Successfully"
        : "Request Created Successfully"
    );

    setTimeout(() => {
      navigate("/masala/franchise-request");
    }, 1000);
  };

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">

              <h4 className="mb-sm-0 font-size-18">
                {isEdit
                  ? "Edit Franchise Request"
                  : "Create Franchise Request"}
              </h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>

                  <li className="breadcrumb-item">
                    <Link to="/masala/franchise-request">
                      Franchise Requests
                    </Link>
                  </li>

                  <li className="breadcrumb-item active">
                    {isEdit ? "Edit" : "Add"}
                  </li>
                </ol>
              </div>

            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="row">

            {/* Left */}
            <div className="col-xl-8">

              <div className="card">
                <div className="card-body">

                  <h5 className="mb-3">Request Details</h5>

                  <div className="row g-3">

                    <div className="col-md-6">
                      <label className="form-label">
                        Franchise ID <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        name="franchiseId"
                        className="form-control"
                        value={formData.franchiseId}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Franchise Name <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        name="franchiseName"
                        className="form-control"
                        value={formData.franchiseName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Order Date
                      </label>

                      <input
                        type="date"
                        name="orderDate"
                        className="form-control"
                        value={formData.orderDate}
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Required Date <span className="text-danger">*</span>
                      </label>

                      <input
                        type="date"
                        name="requiredDate"
                        className="form-control"
                        value={formData.requiredDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Priority <span className="text-danger">*</span>
                      </label>

                      <select
                        name="priority"
                        className="form-select"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option>Normal</option>
                        <option>Urgent</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Payment Option <span className="text-danger">*</span>
                      </label>

                      <select
                        name="paymentOption"
                        className="form-select"
                        value={formData.paymentOption}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option>Advance</option>
                        <option>Credit</option>
                        <option>Cash</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">
                        Remarks
                      </label>

                      <textarea
                        rows="3"
                        name="remarks"
                        className="form-control"
                        value={formData.remarks}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                  </div>

                </div>
              </div>

              {/* Items */}
              <div className="card">
                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="mb-0">Order Items</h5>

                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={addItemRow}
                    >
                      <i className="bx bx-plus me-1"></i>
                      Add Item
                    </button>

                  </div>

                  {formData.items.map((item, index) => (
                    <div
                      className="row g-3 align-items-end mb-3"
                      key={index}
                    >

                      <div className="col-md-7">
                        <label className="form-label">
                          Item Name <span className="text-danger">*</span>
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          value={item.itemName}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "itemName",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">
                          Quantity <span className="text-danger">*</span>
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-danger w-100"
                          onClick={() =>
                            removeItemRow(index)
                          }
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>

                    </div>
                  ))}

                </div>
              </div>

            </div>

            {/* Right */}
            <div className="col-xl-4">

              <div className="card">
                <div className="card-body">

                  <h5 className="mb-3">Summary</h5>

                  <div className="mb-3">
                    <label className="form-label text-muted">
                      Total Items
                    </label>

                    <div>{formData.items.length}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted">
                      Total Quantity
                    </label>

                    <div>
                      {formData.items.reduce(
                        (sum, item) =>
                          sum + Number(item.quantity || 0),
                        0
                      )}
                    </div>
                  </div>

                  <div className="d-grid gap-2 mt-4">

                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {isEdit
                        ? "Update Request"
                        : "Create Request"}
                    </button>

                    <Link
                      to="/masala/franchise-request"
                      className="btn btn-light border"
                    >
                      Cancel
                    </Link>

                  </div>

                </div>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default MasalaFranchiseRequestForm;