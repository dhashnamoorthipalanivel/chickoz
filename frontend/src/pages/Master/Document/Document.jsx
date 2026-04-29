import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDocuments } from "../../../store/store";

const initialData = [
    {
        id: 1,
        documentCode: "GST_CERT",
        documentName: "GST Certificate",
        documentType: "LEGAL",
        isMandatory: true,
        status: "ACTIVE",
    },
    {
        id: 2,
        documentCode: "FSSAI",
        documentName: "FSSAI License",
        documentType: "LICENSE",
        isMandatory: true,
        status: "ACTIVE",
    },
    {
        id: 3,
        documentCode: "OWNER_ID",
        documentName: "Owner ID Proof",
        documentType: "IDENTITY",
        isMandatory: true,
        status: "ACTIVE",
    },
    {
        id: 4,
        documentCode: "SHOP_PHOTO",
        documentName: "Shop Front Photo",
        documentType: "MEDIA",
        isMandatory: false,
        status: "ACTIVE",
    },
    {
        id: 5,
        documentCode: "FRANCHISE_AGR",
        documentName: "Franchise Agreement",
        documentType: "LEGAL",
        isMandatory: false,
        status: "INACTIVE",
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

const yesNoBadge = (value) => {
    return value ? (
        <span className="badge bg-success-subtle text-success">Yes</span>
    ) : (
        <span className="badge bg-danger-subtle text-danger">No</span>
    );
};

const Document = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [selected, setSelected] = useState([]);
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const perPage = 10;

    const {documents, fetchDocuments, deleteDocument}  = useDocuments();

    useEffect(() => {
        fetchDocuments();
    },[])

    const filtered = documents.filter((item) => {
        const matchSearch =
            item.documentName.toLowerCase().includes(search.toLowerCase()) ||
            item.documentCode.toLowerCase().includes(search.toLowerCase()) ||
            item.documentType.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "ALL" || item.status === statusFilter;

        const matchType =
            typeFilter === "ALL" || item.documentType === typeFilter;

        return matchSearch && matchStatus && matchType;
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
            setSelected(paged.map((r) => r._id));
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
    try {
        await deleteDocument(deleteId);
        await fetchDocuments();

        setShowDeleteModal(false);
        setDeleteId(null);

        setSelected((prev) =>
            prev.filter((item) => item !== deleteId)
        );

    } catch (error) {
        console.log(error);
    }
};

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Document Management</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Document Management
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
                                        <h4 className="card-title mb-0">Document Records</h4>
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
                                            <Link to="/master-document/add" className="btn btn-sm btn-primary">
                                                <i className="bx bx-plus me-1"></i> Add Document
                                            </Link>
                                        </div>
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
                                                    placeholder="Search by document name, code or type..."
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
                                                <option value="ALL">All Types</option>
                                                <option value="LEGAL">Legal</option>
                                                <option value="LICENSE">License</option>
                                                <option value="IDENTITY">Identity</option>
                                                <option value="MEDIA">Media</option>
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
                                                    <th style={{ width: "40px" }}>
                                                        S.No
                                                    </th>
                                                    <th>Document Code</th>
                                                    <th>Document Name</th>
                                                    <th>Document Type</th>
                                                    <th>Mandatory</th>
                                                    <th>Status</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {paged.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="9" className="text-center py-5 text-muted">
                                                            <i className="bx bx-search-alt display-4 d-block mb-2"></i>
                                                            No document records found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paged.map((row, index) => (
                                                        <tr
                                                            key={row._id}
                                                            className={selected.includes(row._id) ? "table-active" : ""}
                                                        >
                                                             <td>{(page - 1) * perPage + index + 1}</td>

                                                            <td>{row.documentCode}</td>
                                                            <td>{row.documentName}</td>
                                                            <td>{formatLabel(row.documentType)}</td>
                                                            <td>{yesNoBadge(row.isMandatory)}</td>
                                                            <td>{statusBadge(row.status)}</td>

                                                            <td>
                                                                <div className="d-flex justify-content-center gap-2">
                                                                    <Link
                                                                        to={`/master-document/edit/${row._id}`}
                                                                        state={{ rowData: row }}
                                                                        className="btn btn-sm btn-outline-primary"
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
                                <h5>Delete Document?</h5>
                                <p className="text-muted mb-0">
                                    Are you sure you want to delete this document? This action cannot
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
};

export default Document;