import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialData = [
    {
        id: 1,
        leadId: "LD001",
        customerName: "Arun Kumar",
        phone: "9876543210",
        location: "Chennai",
        packageName: "Starter Package",
        cartSize: "4 x 4",
        requiredDate: "2026-04-28",
        priority: "Urgent",
        vendor: "Not Assigned",
        status: "PENDING",
        createdDate: "2026-04-22",
    },
    {
        id: 2,
        leadId: "LD002",
        customerName: "Suresh",
        phone: "9123456780",
        location: "Coimbatore",
        packageName: "Professional Package",
        cartSize: "6 x 4",
        requiredDate: "2026-04-30",
        priority: "Normal",
        vendor: "ABC Fabrication",
        status: "IN_PROGRESS",
        createdDate: "2026-04-21",
    },
];

const Kiosk = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filtered = initialData.filter((item) => {
        const matchSearch =
            item.leadId.toLowerCase().includes(search.toLowerCase()) ||
            item.customerName.toLowerCase().includes(search.toLowerCase()) ||
            item.phone.includes(search) ||
            item.location.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "ALL" || item.status === statusFilter;

        return matchSearch && matchStatus;
    });

    const statusBadge = (status) => {
        const map = {
            PENDING: "bg-secondary",
            ASSIGNED: "bg-info",
            IN_PROGRESS: "bg-primary",
            COMPLETED: "bg-success",
        };

        return (
            <span className={`badge ${map[status]}`}>
                {status.replace("_", " ")}
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

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Kiosk Management</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Kiosk Orders
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
                                    Cart Manufacturing Orders
                                </h4>

                                <div className="d-flex gap-2 flex-wrap">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search lead, name, phone..."
                                        style={{ width: "240px" }}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />

                                    <select
                                        className="form-select"
                                        style={{ width: "180px" }}
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                    >
                                        <option value="ALL">All Status</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="ASSIGNED">Assigned</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">

                            {/* Table */}
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered align-middle text-nowrap mb-0">

                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Lead ID</th>
                                            <th>Customer</th>
                                            <th>Phone</th>
                                            <th>Location</th>
                                            <th>Package</th>
                                            <th>Cart Size</th>
                                            <th>Required Date</th>
                                            <th>Priority</th>
                                            <th>Vendor</th>
                                            <th>Status</th>
                                            <th>Created Date</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="13"
                                                    className="text-center text-muted py-5"
                                                >
                                                    No kiosk orders found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((row, index) => (
                                                <tr key={row.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{row.leadId}</td>
                                                    <td>{row.customerName}</td>
                                                    <td>{row.phone}</td>
                                                    <td>{row.location}</td>
                                                    <td>{row.packageName}</td>
                                                    <td>{row.cartSize}</td>
                                                    <td>{row.requiredDate}</td>
                                                    <td>{priorityBadge(row.priority)}</td>
                                                    <td>{row.vendor}</td>
                                                    <td>{statusBadge(row.status)}</td>
                                                    <td>{row.createdDate}</td>

                                                    <td>
                                                        <div className="d-flex justify-content-center gap-2">

                                                            <Link
                                                                to={`/manufacture-kishok/view/${row.id}`}
                                                                state={{ rowData: row }}
                                                                className="btn btn-sm btn-outline-primary"
                                                                title="Edit"
                                                            >
                                                                <i className="bx bx-show"></i>
                                                            </Link>

                                                            <Link
                                                                to={`/manufacture-kishok/edit/${row.id}`}
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
                                        )}
                                    </tbody>

                                </table>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
};

export default Kiosk;