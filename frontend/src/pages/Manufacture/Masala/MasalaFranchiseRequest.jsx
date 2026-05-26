import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMasalaRequestStore } from "../../../store/store";
import { useEffect } from "react";

const initialData = [
  {
    id: 1,
    requestId: "REQ001",
    franchiseId: "FR001",
    franchiseName: "Chennai Branch",
    itemCount: 3,
    totalQty: 25,
    requiredDate: "2026-04-28",
    priority: "Urgent",
    paymentOption: "Advance",
    status: "REQUESTED",
    createdDate: "2026-04-24",
  },
  {
    id: 2,
    requestId: "REQ002",
    franchiseId: "FR002",
    franchiseName: "Coimbatore Branch",
    itemCount: 2,
    totalQty: 12,
    requiredDate: "2026-04-30",
    priority: "Normal",
    paymentOption: "Credit",
    status: "APPROVED",
    createdDate: "2026-04-23",
  },
];

const formatLabel = (value) =>
  value
    ?.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const statusBadge = (status) => {
  const map = {
    REQUESTED: "bg-secondary",
    UNDER_REVIEW: "bg-warning text-dark",
    APPROVED: "bg-info",
    DISPATCHED: "bg-primary",
    DELIVERED: "bg-success",
    REJECTED: "bg-danger",
  };

  return (
    <span className={`badge ${map[status] || "bg-secondary"}`}>
      {formatLabel(status)}
    </span>
  );
};

const priorityBadge = (priority) => {
  return (
    <span
      className={`badge ${priority === "Urgent"
        ? "bg-danger"
        : "bg-warning text-dark"
        }`}
    >
      {priority}
    </span>
  );
};

const MasalaFranchiseRequest = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { requests, fetchMyRequests, loading } = useMasalaRequestStore();

  console.log("Request :", requests)

  useEffect(() => {
    fetchMyRequests();
  }, [])

  const filtered = requests.filter((item) => {

    const searchText =
      search.toLowerCase();

    const matchSearch =

      item.requestId
        ?.toLowerCase()
        .includes(searchText) ||

      item.franchise?.franchiseId
        ?.toString()
        .toLowerCase()
        .includes(searchText) ||

      item.franchise?.franchiseName
        ?.toLowerCase()
        .includes(searchText);

    const matchStatus =
      statusFilter === "ALL" ||
      item.status === statusFilter;

    return (
      matchSearch &&
      matchStatus
    );
  });

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0 font-size-18">
                Masala Franchise Requests
              </h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Franchise Requests
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

              <h4 className="card-title mb-0">
                Request Records
              </h4>

              <Link
                to="/manufacture-masala-franchise-request/add"
                className="btn btn-sm btn-primary"
              >
                <i className="bx bx-plus me-1"></i>
                Create Request
              </Link>

            </div>
          </div>

          <div className="card-body">

            {/* Filters */}
            <div className="row g-2 mb-3">

              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search request ID, franchise ID, branch..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option value="ALL">All Status</option>
                  <option value="REQUESTED">Requested</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

            </div>

            {/* Table */}
            <div className="table-responsive">



              <table className="table table-hover table-bordered align-middle text-nowrap mb-0">

                <thead className="table-light">
                  <tr>
                    <th>S.No</th>
                    <th>Request ID</th>
                    <th>Franchise ID</th>
                    <th>Branch Name</th>
                    <th>Items</th>
                    <th>Total Qty</th>
                    <th>Required Date</th>
                    <th>Priority</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {
                    loading ? (

                      <tr>
                        <td
                          colSpan="12"
                          className="text-center py-5"
                        >
                          Loading requests...
                        </td>
                      </tr>

                    ) : filtered.length === 0 ? (

                      <tr>
                        <td
                          colSpan="12"
                          className="text-center py-5 text-muted"
                        >
                          No request records found.
                        </td>
                      </tr>

                    ) : (

                      filtered.map((row, index) => (
                        <tr key={row._id}>

                          <td>{index + 1}</td>

                          <td>{row.requestId}</td>

                          <td>
                            {row.franchise?.franchiseId}
                          </td>

                          <td>
                            {row.franchise?.franchiseName}
                          </td>

                          <td>{row.totalItems}</td>

                          <td>{row.totalQty}</td>

                          <td>
                            {
                              new Date(row.requiredDate)
                                .toLocaleDateString()
                            }
                          </td>

                          <td>
                            {priorityBadge(row.priority)}
                          </td>

                          <td>{row.paymentOption}</td>

                          <td>
                            {statusBadge(row.status)}
                          </td>

                          <td>
                            {
                              new Date(row.createdAt)
                                .toLocaleDateString()
                            }
                          </td>

                          <td>
                            <div className="d-flex justify-content-center gap-2">

                              <Link
                                to={`/manufacture-masala-franchise-request/view/${row._id}`}
                                state={{ rowData: row }}
                                className="btn btn-sm btn-outline-primary"
                                title="View"
                              >
                                <i className="bx bx-show"></i>
                              </Link>

                              <Link
                                to={`/manufacture-masala-franchise-request/edit/${row._id}`}
                                state={{ rowData: row }}
                                className="btn btn-sm btn-outline-warning"
                                title="Edit"
                              >
                                <i className="bx bx-edit"></i>
                              </Link>

                            </div>
                          </td>

                        </tr>
                      ))
                    )
                  }

                </tbody>

              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MasalaFranchiseRequest;