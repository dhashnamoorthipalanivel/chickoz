import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialData = [
    {
        id: 1,
        franchiseCode: "FR001",
        franchiseName: "Chickoz Erode",
        ownerName: "Prakash",
        location: "Erode",
        type: "FRANCHISE",
        assignedMenuCount: 12,
        status: "ACTIVE",
    },
    {
        id: 2,
        franchiseCode: "FR002",
        franchiseName: "Chickoz Salem",
        ownerName: "Karthik",
        location: "Salem",
        type: "FRANCHISE",
        assignedMenuCount: 9,
        status: "ACTIVE",
    },
    {
        id: 3,
        franchiseCode: "FR003",
        franchiseName: "Chickoz Coimbatore",
        ownerName: "Arun",
        location: "Coimbatore",
        type: "OUTLET",
        assignedMenuCount: 15,
        status: "INACTIVE",
    },
    {
        id: 4,
        franchiseCode: "FR004",
        franchiseName: "Chickoz Karur",
        ownerName: "Vignesh",
        location: "Karur",
        type: "FRANCHISE",
        assignedMenuCount: 7,
        status: "ACTIVE",
    },
    {
        id: 5,
        franchiseCode: "FR005",
        franchiseName: "Chickoz Namakkal",
        ownerName: "Suresh",
        location: "Namakkal",
        type: "OUTLET",
        assignedMenuCount: 10,
        status: "ACTIVE",
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
    };

    return (
        <span className={`badge ${map[status] || "bg-secondary"}`}>
            {formatLabel(status)}
        </span>
    );
};

const typeBadge = (type) => {
    const map = {
        FRANCHISE: "bg-primary-subtle text-primary",
        OUTLET: "bg-warning-subtle text-warning",
        HEAD_OFFICE: "bg-info-subtle text-info",
    };

    return (
        <span className={`badge ${map[type] || "bg-secondary"}`}>
            {formatLabel(type)}
        </span>
    );
};

const FranchiseMenuVisibility = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [page, setPage] = useState(1);

    const perPage = 5;

    const filtered = initialData.filter((item) => {
        const matchSearch =
            item.franchiseName.toLowerCase().includes(search.toLowerCase()) ||
            item.franchiseCode.toLowerCase().includes(search.toLowerCase()) ||
            item.location.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "ALL" || item.status === statusFilter;

        const matchType =
            typeFilter === "ALL" || item.type === typeFilter;

        return matchSearch && matchStatus && matchType;
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">
                                    Franchise Menu Visibility
                                </h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Franchise Menu Visibility
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
                                        <h4 className="card-title mb-0">
                                            Franchise Menu Assignment Records
                                        </h4>
                                        {/* <div>
                                            <span className="badge bg-info-subtle text-info px-3 py-2">
                                                Admin Controlled Module
                                            </span>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="card-body">
                                    {/* Filters */}
                                    <div className="row mb-3 g-2">
                                        <div className="col-sm-12 col-md-5">
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search by franchise name, code or location..."
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
                                                <option value="ACTIVE">Active</option>
                                                <option value="INACTIVE">Inactive</option>
                                            </select>
                                        </div>

                                        <div className="col-sm-6 col-md-2">
                                            <select
                                                className="form-select"
                                                value={typeFilter}
                                                onChange={(e) => {
                                                    setTypeFilter(e.target.value);
                                                    setPage(1);
                                                }}
                                            >
                                                <option value="ALL">All Type</option>
                                                <option value="FRANCHISE">Franchise</option>
                                                <option value="OUTLET">Outlet</option>
                                                <option value="HEAD_OFFICE">Head Office</option>
                                            </select>
                                        </div>

                                        <div className="col-md-2 text-end d-flex align-items-center justify-content-md-end">
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
                                                    <th>Franchise Code</th>
                                                    <th>Franchise Name</th>
                                                    <th>Owner Name</th>
                                                    <th>Location</th>
                                                    <th>Type</th>
                                                    <th>Assigned Menu Count</th>
                                                    <th>Status</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {paged.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="text-center py-5 text-muted">
                                                            <i className="bx bx-search-alt display-4 d-block mb-2"></i>
                                                            No franchise records found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paged.map((row) => (
                                                        <tr key={row.id}>
                                                            <td>{row.franchiseCode}</td>
                                                            <td>{row.franchiseName}</td>
                                                            <td>{row.ownerName}</td>
                                                            <td>{row.location}</td>
                                                            <td>{typeBadge(row.type)}</td>
                                                            <td>
                                                                <span className="badge bg-soft-primary text-primary px-3 py-2">
                                                                    {row.assignedMenuCount} Items
                                                                </span>
                                                            </td>
                                                            <td>{statusBadge(row.status)}</td>
                                                            <td>
                                                                <div className="d-flex justify-content-center">
                                                                    <Link
                                                                        to={`/master-franchise-menu-visibility/edit/${row.id}`}
                                                                        state={{ rowData: row }}
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        title="Edit Menu Visibility"
                                                                    >
                                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                                    </Link>
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
                                                    className={`page-item ${page === totalPages ? "disabled" : ""}`}
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
        </React.Fragment>
    );
};

export default FranchiseMenuVisibility;