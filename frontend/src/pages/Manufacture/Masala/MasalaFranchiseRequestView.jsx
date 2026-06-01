import React, { useEffect } from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { useMasalaRequestStore } from "../../../store/store";

const MasalaFranchiseRequestView = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const {
        singleRequest,
        fetchSingleRequest,
        loading,
    } = useMasalaRequestStore();

    // ======================================================
    // FETCH REQUEST
    // ======================================================

    useEffect(() => {

        if (id) {

            fetchSingleRequest(id);
        }

    }, [id]);

    const data = singleRequest;

    // const data ;

    // ======================================================
    // LOADING
    // ======================================================

    if (loading || !data) {

        return (

            <div className="text-center py-5">

                Loading...

            </div>
        );
    }

    // ======================================================
    // FORMAT LABEL
    // ======================================================

    const formatLabel = (value) =>
        value
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) =>
                c.toUpperCase()
            );

    // ======================================================
    // STATUS CLASS
    // ======================================================

    const statusClass =
        data.status === "APPROVED"
            ? "bg-info"
            : data.status === "DISPATCHED"
                ? "bg-primary"
                : data.status === "DELIVERED"
                    ? "bg-success"
                    : data.status === "REJECTED"
                        ? "bg-danger"
                        : data.status === "UNDER_REVIEW"
                            ? "bg-warning text-dark"
                            : "bg-secondary";

    const priorityClass =
        data.priority === "Urgent"
            ? "bg-danger"
            : "bg-warning text-dark";

    return (

        <div className="page-content">

            <div className="container-fluid">

                {/* ====================================================== */}
                {/* PAGE TITLE */}
                {/* ====================================================== */}

                <div className="row">

                    <div className="col-12">

                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">

                            <h4 className="mb-sm-0 font-size-18">

                                Franchise Request View

                            </h4>

                            <div>

    <button
        type="button"
        className="btn btn-light border d-flex align-items-center gap-1"
        onClick={() => navigate(-1)}
    >

        <i className="bx bx-arrow-back"></i>

        Back

    </button>

</div>

                            <div className="page-title-right">

                                <ol className="breadcrumb m-0">

                                    <li className="breadcrumb-item">

                                        <Link to="/dashboard">
                                            Dashboard
                                        </Link>

                                    </li>

                                    <li className="breadcrumb-item">

                                        <Link to="/manufacture-masala-franchise-request">
                                            Franchise Requests
                                        </Link>

                                    </li>

                                    <li className="breadcrumb-item active">
                                        View
                                    </li>

                                </ol>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ====================================================== */}
                {/* SUMMARY */}
                {/* ====================================================== */}

                <div className="card">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                            <div>

                                <h4 className="mb-1">

                                    {
                                        data.franchise?.franchiseName
                                    }

                                </h4>

                                <p className="text-muted mb-1">

                                    Request ID :
                                    {" "}

                                    <strong>
                                        {data.requestId}
                                    </strong>

                                </p>

                                <p className="text-muted mb-0">

                                    Created :
                                    {" "}

                                    {
                                        new Date(
                                            data.createdAt
                                        ).toLocaleString()
                                    }

                                </p>

                            </div>

                            <div className="text-end">

                                <span className={`badge ${statusClass} fs-6`}>

                                    {
                                        formatLabel(
                                            data.status
                                        )
                                    }

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="row">

                    {/* ====================================================== */}
                    {/* LEFT */}
                    {/* ====================================================== */}

                    <div className="col-xl-8">

                        {/* ====================================================== */}
                        {/* REQUEST DETAILS */}
                        {/* ====================================================== */}

                        <div className="card">

                            <div className="card-header">

                                <h5 className="mb-0">
                                    Request Details
                                </h5>

                            </div>

                            <div className="card-body">

                                <div className="row g-4">

                                    <div className="col-md-6">

                                        <label className="form-label text-muted">
                                            Franchise ID
                                        </label>

                                        <div>
                                            {data.franchise?.franchiseId}
                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label text-muted">
                                            Phone
                                        </label>

                                        <div>
                                            {data.franchise?.phone || "-"}
                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label text-muted">
                                            Location
                                        </label>

                                        <div>
                                            {data.franchise?.location || "-"}
                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label text-muted">
                                            Email
                                        </label>

                                        <div>
                                            {data.franchise?.email || "-"}
                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label text-muted">
                                            Required Date
                                        </label>

                                        <div>

                                            {
                                                new Date(
                                                    data.requiredDate
                                                ).toLocaleDateString()
                                            }

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label text-muted">
                                            Priority
                                        </label>

                                        <div>

                                            <span className={`badge ${priorityClass}`}>

                                                {data.priority}

                                            </span>

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label text-muted">
                                            Payment Option
                                        </label>

                                        <div>
                                            {data.paymentOption}
                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label text-muted">
                                            Payment Status
                                        </label>

                                        <div>
                                            {formatLabel(data.paymentStatus)}
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ====================================================== */}
                        {/* ORDER ITEMS */}
                        {/* ====================================================== */}

                        <div className="card">

                            <div className="card-header">

                                <h5 className="mb-0">
                                    Order Items
                                </h5>

                            </div>

                            <div className="card-body">

                                <div className="table-responsive">

                                    <table className="table table-bordered align-middle mb-0">

                                        <thead className="table-light">

                                            <tr>

                                                <th>S.No</th>

                                                <th>Item Name</th>

                                                <th>Pack Size</th>

                                                <th>Unit</th>

                                                <th>Price</th>

                                                <th>Quantity</th>

                                                <th>Amount</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                data.items?.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <tr key={index}>

                                                            <td>
                                                                {index + 1}
                                                            </td>

                                                            <td>
                                                                {item.itemName}
                                                            </td>

                                                            <td>
                                                                {item.packSize}
                                                            </td>

                                                            <td>
                                                                {formatLabel(item.unit)}
                                                            </td>

                                                            <td>
                                                                ₹{item.price}
                                                            </td>

                                                            <td>
                                                                {item.quantity}
                                                            </td>

                                                            <td>
                                                                ₹{item.amount}
                                                            </td>

                                                        </tr>
                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>

                                {/* TOTALS */}

                                <div className="row mt-4">

                                    <div className="col-md-4">

                                        <div className="border rounded p-3">

                                            <small className="text-muted">
                                                Total Items
                                            </small>

                                            <h5 className="mb-0 mt-1">
                                                {data.totalItems}
                                            </h5>

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="border rounded p-3">

                                            <small className="text-muted">
                                                Total Quantity
                                            </small>

                                            <h5 className="mb-0 mt-1">
                                                {data.totalQty}
                                            </h5>

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="border rounded p-3">

                                            <small className="text-muted">
                                                Total Amount
                                            </small>

                                            <h5 className="mb-0 mt-1">
                                                ₹{data.totalAmount}
                                            </h5>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ====================================================== */}
                    {/* RIGHT */}
                    {/* ====================================================== */}

                    <div className="col-xl-4">

                        {/* ====================================================== */}
                        {/* FRANCHISE REMARKS */}
                        {/* ====================================================== */}

                        <div className="card">

                            <div className="card-header">

                                <h5 className="mb-0">
                                    Franchise Remarks
                                </h5>

                            </div>

                            <div className="card-body">

                                <p className="mb-0 text-muted">

                                    {data.remarks || "-"}

                                </p>

                            </div>

                        </div>

                        {/* ====================================================== */}
                        {/* ADMIN REMARKS */}
                        {/* ====================================================== */}

                        <div className="card">

                            <div className="card-header">

                                <h5 className="mb-0">
                                    Admin Remarks
                                </h5>

                            </div>

                            <div className="card-body">

                                <p className="mb-0 text-muted">

                                    {data.adminRemarks || "-"}

                                </p>

                            </div>

                        </div>

                        {/* ====================================================== */}
                        {/* DISPATCH DETAILS */}
                        {/* ====================================================== */}

                        {
                            data.status === "DISPATCHED" && (

                                <div className="card">

                                    <div className="card-header">

                                        <h5 className="mb-0">
                                            Dispatch Details
                                        </h5>

                                    </div>

                                    <div className="card-body">

                                        <div className="mb-3">

                                            <small className="text-muted">
                                                Transport Name
                                            </small>

                                            <div>
                                                {data.transportName || "-"}
                                            </div>

                                        </div>

                                        <div className="mb-3">

                                            <small className="text-muted">
                                                Tracking Number
                                            </small>

                                            <div>
                                                {data.trackingNumber || "-"}
                                            </div>

                                        </div>

                                        <div className="mb-3">

                                            <small className="text-muted">
                                                Dispatch Remarks
                                            </small>

                                            <div>
                                                {data.dispatchRemarks || "-"}
                                            </div>

                                        </div>

                                        <div>

                                            <small className="text-muted">
                                                Dispatch Date
                                            </small>

                                            <div>

                                                {
                                                    new Date(
                                                        data.dispatchedDate
                                                    ).toLocaleString()
                                                }

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )
                        }

                        {/* ====================================================== */}
                        {/* STATUS TIMELINE */}
                        {/* ====================================================== */}

                        <div className="card">

                            <div className="card-header">

                                <h5 className="mb-0">
                                    Status Timeline
                                </h5>

                            </div>

                            <div className="card-body">

                                {
                                    data.statusHistory?.length > 0 ? (

                                        data.statusHistory.map(
                                            (
                                                history,
                                                index
                                            ) => (

                                                <div
                                                    key={index}
                                                    className="border-bottom pb-3 mb-3"
                                                >

                                                    <div className="fw-bold">

                                                        {
                                                            formatLabel(
                                                                history.status
                                                            )
                                                        }

                                                    </div>

                                                    <div className="small text-muted">

                                                        {
                                                            new Date(
                                                                history.updatedAt
                                                            ).toLocaleString()
                                                        }

                                                    </div>

                                                    <div>

                                                        {
                                                            history.remarks || "-"
                                                        }

                                                    </div>

                                                </div>
                                            )
                                        )

                                    ) : (

                                        <div className="text-muted">
                                            No history available
                                        </div>

                                    )
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default MasalaFranchiseRequestView;