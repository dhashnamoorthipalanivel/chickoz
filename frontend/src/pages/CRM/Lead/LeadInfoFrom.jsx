import React, { useState, useEffect } from "react";

const LeadInfoFrom = ({ formData, setFormData }) => {

  const [localData, setLocalData] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setLocalData(formData || {});
    setIsChanged(false);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = { ...localData, [name]: value };
    setLocalData(updated);

    const changed =
      JSON.stringify(updated) !== JSON.stringify(formData);

    setIsChanged(changed);
  };

  const handleUpdate = () => {
    setFormData(localData);
    setIsChanged(false);
  };

  return (
    <div className="card">
      <div className="card-body">

        <h5 className="mb-3">Enquiry Info</h5>

        <div className="row g-3">

          {/* Enquiry ID */}
          <div className="col-12">
            <label className="form-label">Enquiry ID</label>
            <input
              className="form-control"
              value={localData?.enquiryId || ""}
              disabled
            />
          </div>

          {/* Name */}
          <div className="col-12">
            <label className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              name="name"
              value={localData?.name || ""}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="col-12">
            <label className="form-label">
              Phone <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              name="phone"
              value={localData?.phone || ""}
              onChange={handleChange}
            />
          </div>

          {/* Place */}
          <div className="col-12">
            <label className="form-label">
              Place <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              name="place"
              value={localData?.place || ""}
              onChange={handleChange}
            />
          </div>

          {/* Interested Package */}
          <div className="col-12">
            <label className="form-label">
              Interested Package <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              name="interestedPackage"
              value={localData?.interestedPackage || ""}
              onChange={handleChange}
            />
          </div>

          {/* Assigned To */}
          <div className="col-12">
            <label className="form-label">
              Assigned To <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              name="assignedTo"
              value={localData?.assignedTo || ""}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="col-12">
            <label className="form-label">
              Status <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              name="status"
              value={localData?.status || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="INPROGRESS">In Progress</option>
              <option value="HOLD">Hold</option>
              <option value="CANCEL">Cancel</option>
              <option value="RETURN">Return</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

        </div>

        {/* UPDATE BUTTON */}
        {isChanged && (
          <div className="mt-3 text-end">
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeadInfoFrom;