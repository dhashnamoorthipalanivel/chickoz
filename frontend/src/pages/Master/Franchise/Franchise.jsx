import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFranchiseStore } from "../../../store/store";

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

const inviteStatusBadge = (status) => {
    const map = {
        DRAFT: "bg-secondary",
        INVITE_SENT: "bg-warning",
        ACTIVE: "bg-success",
        EXPIRED: "bg-danger",
    };

    const labels = {
        DRAFT: "Draft",
        INVITE_SENT: "Invite Sent",
        ACTIVE: "ERP Active",
        EXPIRED: "Expired",
    };

    return (
        <span className={`badge ${map[status] || "bg-secondary"}`}>
            {labels[status] || status}
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
    // const [data, setData] = useState(initialData);
    const [page, setPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);


    const { franchises, fetchFranchises } = useFranchiseStore();

    useEffect(() => {
        fetchFranchises();
    }, [])

    const perPage = 10;

    const filtered = franchises.filter((item) => {
        const matchSearch =
            item.franchiseName.toLowerCase().includes(search.toLowerCase()) ||
            item.location.toLowerCase().includes(search.toLowerCase()) ||
            item.franchiseCode.toLowerCase().includes(search.toLowerCase()) ||
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
                                                        S.No
                                                    </th>
                                                    {[
                                                        "Reference ID",
                                                        "Franchise ID",
                                                        "Franchise Name",
                                                        "Owner Name",
                                                        "Manager Name",
                                                        "Contact Number",
                                                        "Franchise Email",
                                                        "Package Name",
                                                        "Business Status",
"ERP Status",
"Opening Date",,
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
                                                    paged.map((row, index) => (
                                                        <tr
                                                            key={row._id}
                                                            className={selected.includes(row._id) ? "table-active" : ""}
                                                        >
                                                            <td>{(page - 1) * perPage + index + 1}</td>
                                                            <td>{row.referenceId}</td>
                                                            <td>{row.franchiseId}</td>
                                                            <td>{row.franchiseName}</td>
                                                            <td>{row.ownerName}</td>
                                                            <td>{row.manager}</td>
                                                            <td>{row.contact}</td>
                                                            <td>{row.email}</td>
                                                            <td>{typeBadge(row.packageName)}</td>
                                                            <td>{statusBadge(row.status)}</td>
                                                            <td>{inviteStatusBadge(row.inviteStatus)}</td>
                                                            <td>
                                                                {row.openingDate
                                                                    ? new Date(

                                                                        row.openingDate
                                                                    ).toLocaleDateString("en-GB")
                                                                    : "-"
                                                                }
                                                            </td>

                                                            <td>
                                                                <div className="d-flex justify-content-center gap-2">
                                                                    <Link
                                                                        to={`/master-franchise/edit/${row._id}`}
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        state={{ rowData: row }}
                                                                        title="Edit"
                                                                    >
                                                                        <i className="bx bx-edit-alt"></i>
                                                                    </Link>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        title="Delete"
                                                                        onClick={() => confirmDelete(row._id)}
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