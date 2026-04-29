import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialData = [
  {
    id: 1,
    enquiryId: "ENQ001",
    name: "Arun Kumar",
    phone: "9876543210",
    place: "Chennai",
    interestedPackage: "Starter Package",
    leadSource: "WEBSITE",
    status: "NEW",
    followUpDate: "2026-04-10",
    assignedTo: "Dhash",
    createdDate: "2026-04-07",
  },
  {
    id: 2,
    enquiryId: "ENQ002",
    name: "Suresh",
    phone: "9123456780",
    place: "Coimbatore",
    interestedPackage: "Professional Package",
    leadSource: "INSTAGRAM",
    status: "FOLLOW_UP",
    followUpDate: "2026-04-12",
    assignedTo: "Raja",
    createdDate: "2026-04-06",
  },
  {
    id: 3,
    enquiryId: "ENQ003",
    name: "Karthik",
    phone: "9988776655",
    place: "Madurai",
    interestedPackage: "Enterprise Package",
    leadSource: "REFERENCE",
    status: "CONVERTED_TO_LEAD",
    followUpDate: "2026-04-15",
    assignedTo: "Vicky",
    createdDate: "2026-04-05",
  },
  {
    id: 4,
    enquiryId: "ENQ004",
    name: "Praveen",
    phone: "9090909090",
    place: "Salem",
    interestedPackage: "Custom Package",
    leadSource: "FACEBOOK",
    status: "CANCELLED",
    followUpDate: "2026-04-09",
    assignedTo: "Ajay",
    createdDate: "2026-04-04",
  },
];

const formatLabel = (value) => {
  return value
    ?.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const statusBadge = (status) => {
  const map = {
    NEW: "bg-primary",
    FOLLOW_UP: "bg-warning text-dark",
    CONVERTED_TO_LEAD: "bg-success",
    HOLD: "bg-secondary",
    CANCELLED: "bg-danger",
  };

  return (
    <span className={`badge ${map[status] || "bg-secondary"}`}>
      {formatLabel(status)}
    </span>
  );
};

const leadSourceBadge = (source) => {
  const map = {
    WEBSITE: "bg-primary-subtle text-primary",
    INSTAGRAM: "bg-danger-subtle text-danger",
    FACEBOOK: "bg-info-subtle text-info",
    REFERENCE: "bg-success-subtle text-success",
    WALK_IN: "bg-warning-subtle text-warning",
  };

  return (
    <span className={`badge ${map[source] || "bg-secondary"}`}>
      {formatLabel(source)}
    </span>
  );
};

const Enquiry = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [leadSourceFilter, setLeadSourceFilter] = useState("ALL");
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const perPage = 10;

  const filtered = data.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.enquiryId.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.toLowerCase().includes(search.toLowerCase()) ||
      item.place.toLowerCase().includes(search.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    const matchLeadSource =
      leadSourceFilter === "ALL" || item.leadSource === leadSourceFilter;

    return matchSearch && matchStatus && matchLeadSource;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === paged.length) {
      setSelected([]);
    } else {
      setSelected(paged.map((r) => r.id));
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((r) => r.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
    setSelected((prev) => prev.filter((id) => id !== deleteId));
  };

  const handleBulkDelete = () => {
    setData((prev) => prev.filter((r) => !selected.includes(r.id)));
    setSelected([]);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Enquiry Management</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      Enquiry Management
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <h4 className="card-title mb-0">Enquiry Records</h4>
                    <div className="d-flex gap-2">
                      {selected.length > 0 && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={handleBulkDelete}
                        >
                          <i className="bx bx-trash me-1"></i> Delete ({selected.length})
                        </button>
                      )}
                      <Link to="/crm-enquiry/add" className="btn btn-sm btn-primary">
                        <i className="bx bx-plus me-1"></i> Add Enquiry
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="row mb-3 g-2">
                    <div className="col-sm-12 col-md-5">
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by enquiry ID, name, phone, place or assigned to..."
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                          }}
                        />
                        <i
                          className="bx bx-search position-absolute"
                          style={{
                            top: "50%",
                            right: "12px",
                            transform: "translateY(-50%)",
                            color: "#adb5bd",
                          }}
                        ></i>
                      </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                      <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="ALL">All Status</option>
                        <option value="NEW">New</option>
                        <option value="FOLLOW_UP">Follow Up</option>
                        <option value="CONVERTED_TO_LEAD">Converted To Lead</option>
                        <option value="HOLD">Hold</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    <div className="col-sm-6 col-md-2">
                      <select
                        className="form-select"
                        value={leadSourceFilter}
                        onChange={(e) => {
                          setLeadSourceFilter(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="ALL">All Lead Sources</option>
                        <option value="WEBSITE">Website</option>
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="FACEBOOK">Facebook</option>
                        <option value="REFERENCE">Reference</option>
                        <option value="WALK_IN">Walk In</option>
                      </select>
                    </div>

                    <div className="col-md-2 text-end d-flex align-items-center justify-content-md-end">
                      <span className="text-muted font-size-13">
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
                      </span>
                    </div>
                  </div>

                  <div className="table-responsive" style={{ overflowX: "auto" }}>
                    <table className="table table-hover table-centered align-middle mb-0 text-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "40px" }}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selected.length === paged.length && paged.length > 0}
                                onChange={toggleAll}
                                id="checkAll"
                              />
                              <label className="form-check-label" htmlFor="checkAll"></label>
                            </div>
                          </th>
                          <th>Enquiry ID</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Place</th>
                          <th>Interested Package</th>
                          <th>Lead Source</th>
                          <th>Status</th>
                          <th>Follow-up Date</th>
                          <th>Assigned To</th>
                          <th>Created Date</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paged.length === 0 ? (
                          <tr>
                            <td colSpan="12" className="text-center py-5 text-muted">
                              <i className="bx bx-search-alt display-4 d-block mb-2"></i>
                              No enquiry records found.
                            </td>
                          </tr>
                        ) : (
                          paged.map((row) => (
                            <tr key={row.id} className={selected.includes(row.id) ? "table-active" : ""}>
                              <td>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selected.includes(row.id)}
                                    onChange={() => toggleSelect(row.id)}
                                    id={`check-${row.id}`}
                                  />
                                  <label className="form-check-label" htmlFor={`check-${row.id}`}></label>
                                </div>
                              </td>

                              <td>{row.enquiryId}</td>
                              <td>{row.name}</td>
                              <td>{row.phone}</td>
                              <td>{row.place}</td>
                              <td>{row.interestedPackage}</td>
                              <td>{leadSourceBadge(row.leadSource)}</td>
                              <td>{statusBadge(row.status)}</td>
                              <td>{row.followUpDate}</td>
                              <td>{row.assignedTo}</td>
                              <td>{row.createdDate}</td>

                              <td>
                                <div className="d-flex justify-content-center gap-2">
                                  <Link
                                    to={`/crm-enquiry/edit/${row.id}`}
                                    state={{ rowData: row }}
                                    className="btn btn-sm btn-outline-primary"
                                    title="Edit"
                                  >
                                    <i className="bx bx-edit-alt"></i>
                                  </Link>

                                  {row.status !== "CONVERTED_TO_LEAD" && (
                                    <button
                                      className="btn btn-sm btn-outline-success"
                                      title="Convert To Lead"
                                    >
                                      <i className="bx bx-transfer-alt"></i>
                                    </button>
                                  )}

                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete"
                                    onClick={() => confirmDelete(row.id)}
                                  >
                                    <i className="bx bx-trash-alt"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                      <div className="text-muted font-size-13">
                        Showing {(page - 1) * perPage + 1} –{" "}
                        {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                      </div>

                      <ul className="pagination pagination-rounded mb-0">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setPage((p) => p - 1)}>
                            <i className="bx bx-chevron-left"></i>
                          </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setPage(p)}>
                              {p}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setPage((p) => p + 1)}>
                            <i className="bx bx-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>

              <div className="modal-body text-center pb-4">
                <div className="avatar-md mx-auto mb-4">
                  <div className="avatar-title bg-danger-subtle text-danger rounded-circle font-size-32">
                    <i className="bx bx-trash-alt"></i>
                  </div>
                </div>
                <h5>Delete Enquiry Record?</h5>
                <p className="text-muted mb-0">
                  Are you sure you want to delete this enquiry record? This action cannot be undone.
                </p>
              </div>

              <div className="modal-footer border-0 pt-0 justify-content-center gap-2">
                <button className="btn btn-secondary px-4" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger px-4" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Enquiry;