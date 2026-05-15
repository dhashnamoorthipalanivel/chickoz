import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMenuItems } from "../../../store/store";


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

const foodTypeBadge = (type) => {
    const map = {
        VEG: "bg-success-subtle text-success",
        NON_VEG: "bg-danger-subtle text-danger",
        BEVERAGE: "bg-info-subtle text-info",
    };

    return (
        <span className={`badge ${map[type] || "bg-secondary"}`}>
            {formatLabel(type)}
        </span>
    );
};

const itemTypeBadge = (type) => {
    return (
        <span className={`badge ${type ? "bg-success" : "bg-primary"}`}>
            {type ? "Combo" : "Single"}
        </span>
    )
}

const MenuItem = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const perPage = 10;

    // fetch menu item from store 
    const { menuItems, fetchMenuItems, deleteMenuItem } = useMenuItems();


    useEffect(() => {
        fetchMenuItems();
    }, [])

    const filtered = menuItems.filter((item) => {
        const matchSearch =
            item.menuName.toLowerCase().includes(search.toLowerCase()) ||
            item.menuCode.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "ALL" || item.status === statusFilter;

        const matchCategory =
            categoryFilter === "ALL" || item.category === categoryFilter;

        return matchSearch && matchStatus && matchCategory;
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
            await deleteMenuItem(deleteId);
            await fetchMenuItems();

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
                                <h4 className="mb-sm-0 font-size-18">Menu Item Management</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Menu Item Management
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
                                        <h4 className="card-title mb-0">Menu Item Records</h4>
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
                                            <Link to="/master-menu-item/add" className="btn btn-sm btn-primary">
                                                <i className="bx bx-plus me-1"></i> Add Menu Item
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
                                                    placeholder="Search by menu name, code or category..."
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
                                                value={categoryFilter}
                                                onChange={(e) => {
                                                    setCategoryFilter(e.target.value);
                                                    setPage(1);
                                                }}
                                            >
                                                <option value="ALL">All Categories</option>
                                                <option value="FRIED_CHICKEN">Fried Chicken</option>
                                                <option value="NUGGETS">Nuggets</option>
                                                <option value="FRIES">Fries</option>
                                                <option value="SANDWICH">Sandwich</option>
                                                <option value="FRANKIES">Frankies</option>
                                                <option value="BURGER">Burger</option>
                                                <option value="MOMOS">Momos</option>
                                                <option value="MOJITO">Mojito</option>
                                                <option value="BUBBLE_TEA">Bubble Tea</option>
                                                <option value="DESSERT">Dessert</option>
                                                <option value="COMBO">Combo</option>
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

                                                    <th>Image</th>

                                                    <th>Menu Details</th>

                                                    <th>Category</th>

                                                    <th>Portion</th>

                                                    <th>Pricing</th>

                                                    <th>Status</th>

                                                    <th className="text-center">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {paged.length === 0 ? (

                                                    <tr>
                                                        <td
                                                            colSpan="8"
                                                            className="text-center py-5 text-muted"
                                                        >
                                                            <i className="bx bx-search-alt display-4 d-block mb-2"></i>

                                                            No menu items found.
                                                        </td>
                                                    </tr>

                                                ) : (

                                                    paged.map((row, index) => (

                                                        <tr
                                                            key={row._id}
                                                            className={
                                                                selected.includes(row._id)
                                                                    ? "table-active"
                                                                    : ""
                                                            }
                                                        >

                                                            {/* S.NO */}
                                                            <td>
                                                                {(page - 1) * perPage + index + 1}
                                                            </td>

                                                            {/* IMAGE */}
                                                            <td>

                                                                <img
                                                                    src={
                                                                        row.image ||
                                                                        "https://placehold.co/45x45?text=Menu"
                                                                    }
                                                                    alt={row.menuName}
                                                                    className="rounded"
                                                                    width="45"
                                                                    height="45"
                                                                    style={{
                                                                        objectFit: "cover",
                                                                    }}
                                                                />

                                                            </td>

                                                            {/* MENU DETAILS */}
                                                            <td>

                                                                <div className="fw-semibold">
                                                                    {row.menuName}
                                                                </div>

                                                                <div className="text-muted small">
                                                                    #{row.menuCode}
                                                                </div>

                                                                <div className="d-flex gap-1 flex-wrap mt-1">

                                                                    {/* FOOD TYPE */}
                                                                    <span
                                                                        className={`badge ${row.foodType === "VEG"
                                                                                ? "bg-success-subtle text-success"
                                                                                : row.foodType === "NON_VEG"
                                                                                    ? "bg-danger-subtle text-danger"
                                                                                    : "bg-info-subtle text-info"
                                                                            }`}
                                                                    >
                                                                        {formatLabel(row.foodType)}
                                                                    </span>

                                                                    {/* ITEM TYPE */}
                                                                    <span
                                                                        className={`badge ${row.isCombo
                                                                                ? "bg-warning-subtle text-warning"
                                                                                : "bg-primary-subtle text-primary"
                                                                            }`}
                                                                    >
                                                                        {row.isCombo
                                                                            ? "Combo"
                                                                            : "Single"}
                                                                    </span>

                                                                    {/* ADDON */}
                                                                    {
                                                                        row.isAddonAllowed && (
                                                                            <span className="badge bg-dark-subtle text-dark">
                                                                                Addons
                                                                            </span>
                                                                        )
                                                                    }

                                                                    {/* OFFER */}
                                                                    {
                                                                        row.hasOffer && (
                                                                            <span className="badge bg-success-subtle text-success">
                                                                                Offer
                                                                            </span>
                                                                        )
                                                                    }

                                                                </div>

                                                            </td>

                                                            {/* CATEGORY */}
                                                            <td>
                                                                {formatLabel(row.category)}
                                                            </td>

                                                            {/* PORTION */}
                                                            <td>
                                                                <div className="fw-medium">
                                                                    {row.portionQty}
                                                                    {" "}
                                                                    {formatLabel(row.portionName)}
                                                                </div>
                                                            </td>

                                                            {/* PRICING */}
                                                            <td>

                                                                {
                                                                    row.hasOffer ? (

                                                                        <>
                                                                            <div
                                                                                className="text-decoration-line-through text-muted small"
                                                                            >
                                                                                ₹ {row.price}
                                                                            </div>

                                                                            <div className="fw-semibold text-success">

                                                                                ₹ {

                                                                                    row.offerType === "PERCENTAGE"

                                                                                        ? (
                                                                                            row.price -
                                                                                            (
                                                                                                row.price *
                                                                                                row.offerValue
                                                                                            ) / 100
                                                                                        ).toFixed(2)

                                                                                        : (
                                                                                            row.price -
                                                                                            row.offerValue
                                                                                        ).toFixed(2)
                                                                                }

                                                                            </div>
                                                                        </>

                                                                    ) : (

                                                                        <div className="fw-semibold">
                                                                            ₹ {row.price}
                                                                        </div>

                                                                    )
                                                                }

                                                                {
                                                                    row.isTaxApplicable &&
                                                                    row.taxId && (
                                                                        <div className="small text-muted">
                                                                            {row.taxId.taxName}
                                                                        </div>
                                                                    )
                                                                }

                                                            </td>

                                                            {/* STATUS */}
                                                            <td>

                                                                <div className="d-flex flex-column gap-1">

                                                                    {statusBadge(row.status)}

                                                                    {
                                                                        !row.isVisibleInBilling && (
                                                                            <span className="badge bg-secondary-subtle text-secondary">
                                                                                Hidden In Billing
                                                                            </span>
                                                                        )
                                                                    }

                                                                </div>

                                                            </td>

                                                            {/* ACTIONS */}
                                                            <td>

                                                                <div className="d-flex justify-content-center gap-2">

                                                                    <Link
                                                                        to={`/master-menu-item/edit/${row._id}`}
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
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="d-flex align-items-center justify-content-center rounded-circle border-0 bg-light"
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <i className="bx bx-x fs-4"></i>
                                </button>
                            </div>

                            <div className="modal-body text-center pb-4">
                                <div className="avatar-md mx-auto mb-4">
                                    <div className="avatar-title bg-danger-subtle text-danger rounded-circle font-size-32">
                                        <i className="bx bx-trash-alt"></i>
                                    </div>
                                </div>
                                <h5>Delete Menu Item?</h5>
                                <p className="text-muted mb-0">
                                    Are you sure you want to delete this menu item? This action cannot
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

export default MenuItem;