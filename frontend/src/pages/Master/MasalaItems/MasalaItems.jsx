import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useMasalaItems } from '../../../store/store';


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

const MasalaItems = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const perPage = 10;

    // Masala items data fetch from store
    const { masalaItems, fetchMasalaItems, deleteMasalaItem } = useMasalaItems();

    useEffect(() => {
        fetchMasalaItems();
    }, [])

    const filtered = masalaItems.filter((item) => {
        const matchSearch =
            item.itemName.toLowerCase().includes(search.toLowerCase()) ||
            item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase());

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
            setSelected(paged.map((r) => r._id));
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteMasalaItem(deleteId);
            await fetchMasalaItems();

            setShowDeleteModal(false);
            setDeleteId(null);

            setSelected((prev) =>
                prev.filter((item) => item !== deleteId)
            );

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18"> Masala Item Management</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Masala Items
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
                                        <h4 className="card-title mb-0">Masala Item Records</h4>
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
                                            <Link to="/master-masala-items/add" className="btn btn-sm btn-primary">
                                                <i className="bx bx-plus me-1"></i> Add Masala
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
                                                    placeholder="Search by masala item name, code or type..."
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

                                        <div className="col-md-4 text-end d-flex align-items-center justify-content-md-end">
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
                                                    <th style={{ width: "70px" }}>S.No</th>
                                                    <th>Item Code</th>
                                                    <th>Item Name</th>
                                                    <th>Category</th>
                                                    <th>Pack Size</th>
                                                    <th>Price</th>
                                                    <th>GST %</th>
                                                    <th>Stock</th>
                                                    <th>Status</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {paged.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="9" className="text-center py-5 text-muted">
                                                            <i className="bx bx-search-alt display-4 d-block mb-2"></i>
                                                            No masala items records found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paged.map((row, index) => (
                                                        <tr
                                                            key={row._id}
                                                            className={selected.includes(row._id) ? "table-active" : ""}
                                                        >
                                                            <td>{(page - 1) * perPage + index + 1}</td>

                                                            <td>{row.itemCode}</td>
                                                            <td>{row.itemName}</td>
                                                            <td>{row.category}</td>
                                                            <td>{row.packSize} {formatLabel(row.unit)}</td>
                                                            <td>₹ {row.price}</td>
                                                            <td>{row.taxId?.taxPercentage || 0}%</td>
                                                            <td>{row.stock}</td>
                                                            <td>{statusBadge(row.status)}</td>

                                                            <td>
                                                                <div className="d-flex justify-content-center gap-2">
                                                                    <Link
                                                                        to={`/master-masala-items/edit/${row._id}`}
                                                                        state={{ rowData: row }}
                                                                        className="btn btn-sm btn-outline-primary"
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
                                <h5>Delete Masala Item?</h5>
                                <p className="text-muted mb-0">
                                    Are you sure you want to delete this masala item? This action cannot
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
    )
}

export default MasalaItems