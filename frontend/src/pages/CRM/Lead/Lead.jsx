import React, { useState } from "react";
import { Link } from "react-router-dom";

const stages = [
  "SITE_VISIT",
  "WALK_IN",
  "APPROVAL",
  "TRAINING",
  "TRAINING_COMPLETED",
  "OPENING",
  "CART_DELIVERY",
];

const initialData = [
  {
    id: 1,
    leadId: "LED001",
    name: "Arun Kumar",
    phone: "9876543210",
    place: "Chennai",
    assignedTo: "Dhash",
    createdDate: "2026-04-07",
    completedStages: ["SITE_VISIT", "WALK_IN"],
  },
  {
    id: 2,
    leadId: "LED002",
    name: "Suresh",
    phone: "9123456780",
    place: "Coimbatore",
    assignedTo: "Raja",
    createdDate: "2026-04-06",
    completedStages: [],
  },
  {
    id: 3,
    leadId: "LED003",
    name: "Karthik",
    phone: "9988776655",
    place: "Madurai",
    assignedTo: "Vicky",
    createdDate: "2026-04-05",
    completedStages: stages,
  },
];

const formatLabel = (value) =>
  value
    ?.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getLeadStatus = (completedStages) => {
  if (completedStages.length === 0) return "NOT_STARTED";
  if (completedStages.length === stages.length) return "COMPLETED";
  return "ON_GOING";
};

const statusBadge = (status) => {
  const map = {
    NOT_STARTED: "bg-secondary",
    ON_GOING: "bg-warning text-dark",
    COMPLETED: "bg-success",
  };

  return <span className={`badge ${map[status]}`}>{formatLabel(status)}</span>;
};

const Lead = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [data, setData] = useState(initialData);

  const filtered = data.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.leadId.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search);

    const leadStatus = getLeadStatus(item.completedStages);

    const matchStatus =
      statusFilter === "ALL" || leadStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex justify-content-between align-items-center">
              <h4>Lead Management</h4>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4 className="card-title">Lead Records</h4>
          </div>

          <div className="card-body">

            {/* Filters */}
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="ON_GOING">On Going</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Lead ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Place</th>
                    <th>Current Stage</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Assigned To</th>
                    <th>Created Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => {
                      const leadStatus = getLeadStatus(row.completedStages);

                      const currentStage =
                        row.completedStages.length > 0
                          ? row.completedStages[row.completedStages.length - 1]
                          : "NOT_STARTED";

                      const progress = Math.round(
                        (row.completedStages.length / stages.length) * 100
                      );

                      return (
                        <tr key={row.id}>
                          <td>{row.leadId}</td>
                          <td>{row.name}</td>
                          <td>{row.phone}</td>
                          <td>{row.place}</td>

                          <td>{formatLabel(currentStage)}</td>

                          <td>{statusBadge(leadStatus)}</td>

                          <td style={{ minWidth: "120px" }}>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <small>{progress}%</small>
                          </td>

                          <td>{row.assignedTo}</td>
                          <td>{row.createdDate}</td>

                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              {/* <Link
                                to={`/crm-lead/view/${row.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bx bx-show"></i>
                              </Link> */}

                              <Link
                                to={`/crm-lead/edit/${row.id}`}
                                className="btn btn-sm btn-outline-success"
                              >
                                <i className="bx bx-edit"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Lead;