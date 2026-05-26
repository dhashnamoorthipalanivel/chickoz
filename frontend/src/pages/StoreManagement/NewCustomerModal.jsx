import React, { useState } from "react";
import { useCustomerStore } from "../../store/store";
import { toast } from "react-toastify";

const NewCustomerModal = ({ show, onClose, franchiseId, onCustomerCreated, }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const { createCustomer } = useCustomerStore();

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setForm((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, ""),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      // VALIDATION
      if (!form.name || !form.phone) {
        toast.error("Name and phone are required");
        return;
      }

      // API PAYLOAD
      const payload = {
        customerName: form.name,
        mobile: form.phone,
        email: form.email,
        franchiseId,
      };

      // CREATE CUSTOMER
      await createCustomer(payload);

      if (onCustomerCreated) {
        onCustomerCreated({
          customerName: form.name,
          mobile: form.phone,
          email: form.email,
        });
      }

      toast.success ("Customer created successfully");

      // RESET
      setForm({
        name: "",
        email: "",
        phone: "",
      });

      onClose();

    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to create customer"
      );
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Create New Customer</h5>
            <button
              type="button"
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center ms-auto shadow-sm"
              onClick={onClose}
              aria-label="Close"
              style={{
                width: "38px",
                height: "38px",
                border: "1px solid #e9ecef"
              }}
            >
              <i className="bx bx-x fs-4 text-dark"></i>
            </button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Customer Name
                <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter customer name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number
                <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                maxLength={10}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCustomerModal;