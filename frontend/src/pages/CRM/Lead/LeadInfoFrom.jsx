import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateLead } from "../../../api/leadApi";
import { usePackageStore } from "../../../store/store";

const LeadInfoFrom = ({ formData, setFormData, isLocked }) => {

  const statusOnlyLock =
    [
      "HOLD",
      "RETURN",
      "CANCELLED",
    ].includes(
      formData?.leadStatus
    );

  const { packages, fetchPackages } = usePackageStore();

  const [localData, setLocalData] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => { fetchPackages(); }, []);

  useEffect(() => {
    setLocalData(formData || {});
    setIsChanged(false);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated;
    if (name === "interestedPackage") {
      const selectedPkg = packages.find(p => p._id === value);
      updated = { ...localData, interestedPackage: selectedPkg || value };
    } else {
      updated = { ...localData, [name]: value };
    }
    setLocalData(updated);

    const changed =
      JSON.stringify(updated) !== JSON.stringify(formData);

    setIsChanged(changed);
  };

  const handleUpdate =
    async () => {

      try {

        // ✅ UPDATE FRONTEND
        setFormData(localData);

        // ✅ UPDATE DATABASE
        await updateLead(
          localData._id,
          localData
        );

        toast.success(
          "Enquiry Info Updated"
        );

        setIsChanged(false);

      } catch (error) {

        console.log(error);

        toast.error(
          "Update Failed"
        );
      }
    };

  return (
    <div className="card" style={{ animation: "none", position: "relative", zIndex: 0 }}>
      <div className="card-body">

        <h5 className="mb-3">Enquiry Info</h5>

        <div className="row g-3">

          {/* Enquiry ID */}
          <div className="col-12">
            <label className="form-label">Reference ID</label>
            <input
              className="form-control"
              value={localData?.referenceId || ""}
              disabled={
                isLocked ||
                statusOnlyLock
              }
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
              disabled={
                isLocked ||
                statusOnlyLock
              }
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
              disabled={
                isLocked ||
                statusOnlyLock
              }
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
              disabled={
                isLocked ||
                statusOnlyLock
              }
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              State <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              name="state"
              value={localData?.state || ""}
              disabled={
                isLocked ||
                statusOnlyLock
              }
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              Post code <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              name="postCode"
              value={localData?.postCode || ""}
              disabled={
                isLocked ||
                statusOnlyLock
              }
              onChange={handleChange}
            />
          </div>

          {/* Interested Package */}
          <div className="col-12">
            <label className="form-label">
              Interested Package <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              name="interestedPackage"
              value={localData?.interestedPackage?._id || localData?.interestedPackage || ""}
              disabled={isLocked || statusOnlyLock}
              onChange={handleChange}
            >
              <option value="">Select Package</option>
              {packages.map(p => (
                <option key={p._id} value={p._id}>{p.packageName}</option>
              ))}
            </select>
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
              disabled={
                isLocked ||
                statusOnlyLock
              }
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
              name="leadStatus"
              value={
                localData?.leadStatus || ""
              }
              disabled={isLocked}
              onChange={handleChange}
            >
              <option value="">
                Select
              </option>

              <option value="NOT_STARTED">
                Not Started
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="HOLD">
                Hold
              </option>

              <option value="RETURN">
                Return
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
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