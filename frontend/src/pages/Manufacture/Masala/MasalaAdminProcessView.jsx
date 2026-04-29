import React from "react";
import { Link, useLocation } from "react-router-dom";

const MasalaAdminProcessView = () => {
    const { state } = useLocation();

    const data = state?.rowData || {
        requestId: "REQ001",
        franchiseId: "FR001",
        franchiseName: "Chennai Branch",
        phone: "9876543210",
        location: "Chennai",
        requiredDate: "2026-04-28",
        priority: "Urgent",
        paymentOption: "Advance",
        status: "REQUESTED",
        createdDate: "2026-04-24",
        itemCount: 3,
        totalQty: 25,
        remarks: "Need urgent supply for weekend sales.",
        items: [
            { itemName: "Chicken Masala", quantity: 10 },
            { itemName: "Fry Mix", quantity: 8 },
            { itemName: "Spicy Coating", quantity: 7 },
        ],
    };

    const formatLabel = (value) =>
        value
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    const statusClass =
        data.status === "APPROVED"
            ? "bg-info"
            : data.status === "DISPATCHED"
                ? "bg-primary"
                : data.status === "DELIVERED"
                    ? "bg-success"
                    : data.status === "REJECTED"
                        ? "bg-danger"
                        : "bg-secondary";

    const priorityClass =
        data.priority === "Urgent"
            ? "bg-danger"
            : "bg-warning text-dark";

    return (
        <div className="page-content">
            <div className="container-fluid">

                {/* Page Title */}
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">

                            <h4 className="mb-sm-0 font-size-18">
                                Admin Process View
                            </h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard">Dashboard</Link>
                                    </li>

                                    <li className="breadcrumb-item">
                                        <Link to="/manufacture-masala-admin-process">
                                            Admin Process
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

                {/* Summary */}
                <div className="card">
                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                            <div>
                                <h5 className="mb-1">{data.franchiseName}</h5>
                                <p className="text-muted mb-0">
                                    Request ID : {data.requestId}
                                </p>
                            </div>

                            <div className="text-end">
                                <span className={`badge ${statusClass} fs-6`}>
                                    {formatLabel(data.status)}
                                </span>
                            </div>

                        </div>

                    </div>
                </div>

                {/* Main Content */}
                <div className="row">

                    {/* Left */}
                    <div className="col-xl-8">

                        {/* Request Details */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Request Details</h5>
                            </div>

                            <div className="card-body">
                                <div className="row g-3">

                                    <div className="col-md-6">
                                        <label className="form-label text-muted">
                                            Franchise ID
                                        </label>
                                        <div>{data.franchiseId}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label text-muted">
                                            Phone
                                        </label>
                                        <div>{data.phone}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label text-muted">
                                            Location
                                        </label>
                                        <div>{data.location}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label text-muted">
                                            Created Date
                                        </label>
                                        <div>{data.createdDate}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label text-muted">
                                            Required Date
                                        </label>
                                        <div>{data.requiredDate}</div>
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
                                        <div>{data.paymentOption}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label text-muted">
                                            Total Items
                                        </label>
                                        <div>{data.itemCount}</div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Order Items</h5>
                            </div>

                            <div className="card-body">

                                <div className="table-responsive">
                                    <table className="table table-bordered align-middle mb-0">

                                        <thead className="table-light">
                                            <tr>
                                                <th>S.No</th>
                                                <th>Item Name</th>
                                                <th>Quantity</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {(data.items && data.items.length > 0) ? (
                                                data.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.itemName}</td>
                                                        <td>{item.quantity}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center text-muted">
                                                        No items found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right */}
                    <div className="col-xl-4">

                        {/* Notes */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Remarks</h5>
                            </div>

                            <div className="card-body">
                                <p className="mb-0 text-muted">
                                    {data.remarks || "-"}
                                </p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Quick Actions</h5>
                            </div>

                            <div className="card-body d-grid gap-2">

                                <button className="btn btn-success">
                                    <i className="bx bx-check me-1"></i>
                                    Approve Request
                                </button>

                                <button className="btn btn-info text-white">
                                    <i className="bx bx-send me-1"></i>
                                    Dispatch Order
                                </button>

                                <button className="btn btn-danger">
                                    <i className="bx bx-x me-1"></i>
                                    Reject Request
                                </button>

                                <Link
                                    to="/manufacture-masala-admin-process"
                                    className="btn btn-light border"
                                >
                                    Back to List
                                </Link>

                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default MasalaAdminProcessView;