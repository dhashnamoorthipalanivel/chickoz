import React, { useState } from "react";
import { Link } from "react-router-dom";


const initialData = [
    {
        id: 1,
        branchCode: "BR001",
        branchName: "Erode Main Franchise",
        location: "Erode",
        contact: "9874563210",
        manager: "Prakash",
        type: "HEAD_OFFICE",
        status: "UNDER_MAINTENANCE",
        openingDate: "2026-04-03",
    },
    {
        id: 2,
        branchCode: "BR002",
        branchName: "Salem Franchise",
        location: "Salem",
        contact: "9786541230",
        manager: "Karthik",
        type: "FRANCHISE",
        status: "ACTIVE",
        openingDate: "2026-03-25",
    },
    {
        id: 3,
        branchCode: "BR003",
        branchName: "Coimbatore Outlet",
        location: "Coimbatore",
        contact: "9845612378",
        manager: "Vignesh",
        type: "OUTLET",
        status: "INACTIVE",
        openingDate: "2026-02-15",
    },
    {
        id: 4,
        branchCode: "BR004",
        branchName: "Chennai Kitchen",
        location: "Chennai",
        contact: "9958741236",
        manager: "Arun",
        type: "KITCHEN",
        status: "ACTIVE",
        openingDate: "2026-01-10",
    },
    {
        id: 5,
        branchCode: "BR005",
        branchName: "Madurai Warehouse",
        location: "Madurai",
        contact: "9871236540",
        manager: "Suresh",
        type: "WAREHOUSE",
        status: "CLOSED",
        openingDate: "2025-12-05",
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
        ACTIVE: "bg-success",
        INACTIVE: "bg-danger",
        PENDING: "bg-warning",
        UNDER_MAINTENANCE: "bg-warning",
        CLOSED: "bg-secondary",
    };

    return (
        <span className={`badge ${map[status] || "bg-secondary"}`}>
            {formatLabel(status)}
        </span>
    );
};

const typeBadge = (type) => {
    const map = {
        HEAD_OFFICE: "bg-primary",
        FRANCHISE: "bg-info",
        OUTLET: "bg-success",
        KITCHEN: "bg-warning",
        WAREHOUSE: "bg-dark",
    };

    return (
        <span className={`badge ${map[type] || "bg-secondary"}`}>
            {formatLabel(type)}
        </span>
    );
};

const Franchise = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selected, setSelected] = useState([]);
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const perPage = 5;

    const filtered = data.filter((item) => {
        const matchSearch =
            item.branchName.toLowerCase().includes(search.toLowerCase()) ||
            item.location.toLowerCase().includes(search.toLowerCase()) ||
            item.branchCode.toLowerCase().includes(search.toLowerCase()) ||
            item.manager.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "ALL" || item.status === statusFilter;

        return matchSearch && matchStatus;
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
                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Franchise Management</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Franchise Management
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                        <h4 className="card-title mb-0">Franchise Records</h4>
                                        <div className="d-flex gap-2">
                                            {selected.length > 0 && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={handleBulkDelete}
                                                >
                                                    <i className="bx bx-trash me-1"></i> Delete (
                                                    {selected.length})
                                                </button>
                                            )}
                                            <Link to="/master-franchise/add" className="btn btn-sm btn-primary">
                                                <i className="bx bx-plus me-1"></i> Add Franchise
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    {/* Filters */}
                                    <div className="row mb-3 g-2">
                                        <div className="col-sm-8 col-md-6">
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search by Franchise name, Franchise code, city or manager..."
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

                                        <div className="col-sm-4 col-md-3">
                                            <select
                                                className="form-select"
                                                value={statusFilter}
                                                onChange={(e) => {
                                                    setStatusFilter(e.target.value);
                                                    setPage(1);
                                                }}
                                            >
                                                <option value="ALL">All Status</option>
                                                <option value="ACTIVE">Active</option>
                                                <option value="INACTIVE">Inactive</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="UNDER_MAINTENANCE">
                                                    Under Maintenance
                                                </option>
                                                <option value="CLOSED">Closed</option>
                                            </select>
                                        </div>

                                        <div className="col-md-3 text-end">
                                            <span className="text-muted font-size-13">
                                                {filtered.length} result
                                                {filtered.length !== 1 ? "s" : ""} found
                                            </span>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="table-responsive">
                                        <table className="table table-hover table-centered align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: "40px" }}>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={
                                                                    selected.length === paged.length &&
                                                                    paged.length > 0
                                                                }
                                                                onChange={toggleAll}
                                                                id="checkAll"
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="checkAll"
                                                            ></label>
                                                        </div>
                                                    </th>
                                                    {[
                                                        "Franchise Code",
                                                        "Franchise Name",
                                                        "Location",
                                                        "Contact Number",
                                                        "Manager Name",
                                                        "Franchise Type",
                                                        "Status",
                                                        "Opening Date",
                                                    ].map((column, index) => (
                                                        <th key={index}>{column}</th>
                                                    ))}
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {paged.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="10" className="text-center py-5 text-muted">
                                                            <i className="bx bx-search-alt display-4 d-block mb-2"></i>
                                                            No records found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paged.map((row) => (
                                                        <tr
                                                            key={row.id}
                                                            className={selected.includes(row.id) ? "table-active" : ""}
                                                        >
                                                            <td>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        checked={selected.includes(row.id)}
                                                                        onChange={() => toggleSelect(row.id)}
                                                                        id={`check-${row.id}`}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor={`check-${row.id}`}
                                                                    ></label>
                                                                </div>
                                                            </td>

                                                            <td>{row.branchCode}</td>
                                                            <td>{row.branchName}</td>
                                                            <td>{row.location}</td>
                                                            <td>{row.contact}</td>
                                                            <td>{row.manager}</td>
                                                            <td>{typeBadge(row.type)}</td>
                                                            <td>{statusBadge(row.status)}</td>
                                                            <td>{row.openingDate}</td>

                                                            <td>
                                                                <div className="d-flex justify-content-center gap-2">
                                                                    <Link
                                                                        to={`/master-franchise/edit/${row.id}`}
                                                                        className="btn btn-sm btn-outline-primary"
                                                                         state={{ rowData: row }}
                                                                        title="Edit"
                                                                    >
                                                                        <i className="bx bx-edit-alt"></i>
                                                                    </Link>
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

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                                            <div className="text-muted font-size-13">
                                                Showing {(page - 1) * perPage + 1} –{" "}
                                                {Math.min(page * perPage, filtered.length)} of{" "}
                                                {filtered.length} entries
                                            </div>

                                            <ul className="pagination pagination-rounded mb-0">
                                                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPage((p) => p - 1)}
                                                    >
                                                        <i className="bx bx-chevron-left"></i>
                                                    </button>
                                                </li>

                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                                    (p) => (
                                                        <li
                                                            key={p}
                                                            className={`page-item ${page === p ? "active" : ""}`}
                                                        >
                                                            <button className="page-link" onClick={() => setPage(p)}>
                                                                {p}
                                                            </button>
                                                        </li>
                                                    )
                                                )}

                                                <li
                                                    className={`page-item ${page === totalPages ? "disabled" : ""
                                                        }`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPage((p) => p + 1)}
                                                    >
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body text-center pb-4">
                                <div className="avatar-md mx-auto mb-4">
                                    <div className="avatar-title bg-danger-subtle text-danger rounded-circle font-size-32">
                                        <i className="bx bx-trash-alt"></i>
                                    </div>
                                </div>
                                <h5>Delete Record?</h5>
                                <p className="text-muted mb-0">
                                    Are you sure you want to delete this record? This action cannot
                                    be undone.
                                </p>
                            </div>

                            <div className="modal-footer border-0 pt-0 justify-content-center gap-2">
                                <button
                                    className="btn btn-secondary px-4"
                                    onClick={() => setShowDeleteModal(false)}
                                >
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
}

export default Franchise