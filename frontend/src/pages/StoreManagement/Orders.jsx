import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialData = [
  {
    id: 1,
    orderId: "ORD001",
    franchiseId: "FR001",
    franchiseName: "Chennai Branch",
    customer: "Arun Kumar",
    orderType: "Dine In",
    item: "Chicken Bucket",
    qty: 2,
    price: 580,
    paymentStatus: "Paid",
    orderStatus: "Completed",
    createdDate: "2026-04-24",
  },
  {
    id: 2,
    orderId: "ORD002",
    franchiseId: "FR002",
    franchiseName: "Coimbatore Branch",
    customer: "Suresh",
    orderType: "Take Away",
    item: "Burger Combo",
    qty: 1,
    price: 320,
    paymentStatus: "Pending",
    orderStatus: "Preparing",
    createdDate: "2026-04-24",
  },
];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = initialData.filter((row) => {
    const matchSearch =
      row.orderId.toLowerCase().includes(search.toLowerCase()) ||
      row.franchiseId.toLowerCase().includes(search.toLowerCase()) ||
      row.franchiseName.toLowerCase().includes(search.toLowerCase()) ||
      row.customer.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" ||
      row.orderStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const orderBadge = (status) => {
    const map = {
      Completed: "bg-success",
      Preparing: "bg-warning text-dark",
      Cancelled: "bg-danger",
      Pending: "bg-secondary",
    };

    return (
      <span className={`badge ${map[status] || "bg-secondary"}`}>
        {status}
      </span>
    );
  };

  const paymentBadge = (status) => (
    <span
      className={`badge ${status === "Paid"
        ? "bg-success"
        : "bg-danger"
        }`}
    >
      {status}
    </span>
  );

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">

              <h4 className="mb-sm-0 font-size-18">
                Franchise Orders
              </h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>

                  <li className="breadcrumb-item active">
                    Orders
                  </li>
                </ol>
              </div>

            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">
              Orders List
            </h4>
          </div>

          <div className="card-body">

            {/* Filters */}
            <div className="row g-2 mb-3">

              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search order id, franchise, customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option value="ALL">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle text-nowrap mb-0">

                <thead className="table-light">
                  <tr>
                    <th>S.No</th>
                    <th>Order ID</th>
                    <th>Franchise ID</th>
                    <th>Franchise Name</th>
                    <th>Customer</th>
                    <th>Order Type</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan="13"
                        className="text-center py-5 text-muted"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row, index) => (
                      <tr key={row.id}>
                        <td>{index + 1}</td>
                        <td>{row.orderId}</td>
                        <td>{row.franchiseId}</td>
                        <td>{row.franchiseName}</td>
                        <td>{row.customer}</td>
                        <td>{row.orderType}</td>
                        <td>{row.item}</td>
                        <td>{row.qty}</td>
                        <td>₹ {row.price}</td>
                        <td>{paymentBadge(row.paymentStatus)}</td>
                        <td>{orderBadge(row.orderStatus)}</td>
                        <td>{row.createdDate}</td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">

                            <Link
                              to={`/store-management-orders/view/${row.id}`}
                              state={{ rowData: row }}
                              className="btn btn-sm btn-outline-primary"
                              title="View"
                            >
                              <i className="bx bx-show"></i>
                            </Link>

                            <button
                              className="btn btn-sm btn-outline-success"
                              title="Invoice"
                            >
                              <i className="bx bx-receipt"></i>
                            </button>

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
  );
};

export default Orders;