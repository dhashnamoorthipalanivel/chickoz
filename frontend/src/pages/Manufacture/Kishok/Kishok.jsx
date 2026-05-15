import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useKishokStore } from "../../../store/store";


const formatLabel = (value) => {
    return value
        ?.toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const statusBadge = (status) => {
    const map = {
        COMPLETED: "bg-success",
        HOLD: "bg-warning",
        CANCELLED : "bg-danger",
        IN_PROGRESS : "bg-primary",
    };

    return (
        <span className={`badge ${map[status] || "bg-secondary"}`}>
            {formatLabel(status)}
        </span>
    );
};

const Kiosk = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const {kishoks, fetchKishoks,} = useKishokStore();

    useEffect(() => {
        fetchKishoks();
    },[])

    const filtered = kishoks.filter((item) => {
        const matchSearch =
            item.referenceId.toLowerCase().includes(search.toLowerCase()) ||
            item.customerName.toLowerCase().includes(search.toLowerCase()) ||
            item.phone.includes(search) ||
            item.place.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "ALL" || item.manufactureStatus === statusFilter;

        return matchSearch && matchStatus;
    });



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
                                            <th>Reference ID</th>
                                            <th>Customer</th>
                                            <th>Phone</th>
                                            <th>Place</th>
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
                                                <tr key={row._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{row.referenceId}</td>
                                                    <td>{row.customerName}</td>
                                                    <td>{row.phone}</td>
                                                    <td>{row.place}</td>
                                                    <td>{row.packageName}</td>
                                                    <td>{row.cartSize}</td>
                                                    <td>{row.requiredDate? new Date(row.requiredDate).toLocaleDateString(): "-"}</td>
                                                    <td>{priorityBadge(row.priority)}</td>
                                                    <td>{row.vendorName || "-"}</td>
                                                    <td>{statusBadge(row.manufactureStatus)}</td>
                                                    <td>{row.createdAt ? new Date(row.createdAt).toLocaleDateString(): "-"}</td>

                                                    <td>
                                                        <div className="d-flex justify-content-center gap-2">

                                                            <Link
                                                                to={`/manufacture-kishok/view/${row._id}`}
                                                                state={{ rowData: row }}
                                                                className="btn btn-sm btn-outline-primary"
                                                                title="Edit"
                                                            >
                                                                <i className="bx bx-show"></i>
                                                            </Link>

                                                            <Link
                                                                to={`/manufacture-kishok/edit/${row._id}`}
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