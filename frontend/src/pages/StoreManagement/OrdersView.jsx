import React from "react";
import { Link, useLocation } from "react-router-dom";

const OrdersView = () => {
  const { state } = useLocation();

  const data = state?.rowData || {
    orderId: "ORD001",
    franchiseId: "FR001",
    franchiseName: "Chennai Branch",
    customer: "Arun Kumar",
    phone: "9876543210",
    orderType: "Dine In",
    item: "Chicken Bucket",
    qty: 2,
    price: 580,
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    orderStatus: "Completed",
    createdDate: "2026-04-24",
    address: "Anna Nagar, Chennai",
    remarks: "Extra spicy required",
  };

  const statusBadge = (status) => {
    const map = {
      Completed: "bg-success",
      Preparing: "bg-warning text-dark",
      Cancelled: "bg-danger",
      Pending: "bg-secondary",
    };

    return (
      <span className={`badge ${map[status] || "bg-secondary"} fs-6`}>
        {status}
      </span>
    );
  };

  const paymentBadge = (status) => (
    <span
      className={`badge ${
        status === "Paid"
          ? "bg-success"
          : "bg-danger"
      }`}
    >
      {status}
    </span>
  );

  const totalAmount = Number(data.qty) * Number(data.price);

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">

              <h4 className="mb-sm-0 font-size-18">
                Order View
              </h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>

                  <li className="breadcrumb-item">
                    <Link to="/store-management-orders">Orders</Link>
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
                <h5 className="mb-1">{data.customer}</h5>
                <p className="text-muted mb-0">
                  Order ID : {data.orderId}
                </p>
              </div>

              <div>
                {statusBadge(data.orderStatus)}
              </div>

            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="row">

          {/* Left */}
          <div className="col-xl-8">

            {/* Customer Details */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Customer Details</h5>
              </div>

              <div className="card-body">
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label text-muted">
                      Customer Name
                    </label>
                    <div>{data.customer}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">
                      Phone
                    </label>
                    <div>{data.phone}</div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label text-muted">
                      Address
                    </label>
                    <div>{data.address}</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Order Details</h5>
              </div>

              <div className="card-body">

                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0">

                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>{data.item}</td>
                        <td>{data.qty}</td>
                        <td>₹ {data.price}</td>
                        <td>₹ {totalAmount}</td>
                      </tr>
                    </tbody>

                  </table>
                </div>

              </div>
            </div>

          </div>

          {/* Right */}
          <div className="col-xl-4">

            {/* Franchise Details */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Franchise Details</h5>
              </div>

              <div className="card-body">

                <div className="mb-3">
                  <label className="form-label text-muted">
                    Franchise ID
                  </label>
                  <div>{data.franchiseId}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">
                    Franchise Name
                  </label>
                  <div>{data.franchiseName}</div>
                </div>

                <div>
                  <label className="form-label text-muted">
                    Order Type
                  </label>
                  <div>{data.orderType}</div>
                </div>

              </div>
            </div>

            {/* Payment Details */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Payment Details</h5>
              </div>

              <div className="card-body">

                <div className="mb-3">
                  <label className="form-label text-muted">
                    Payment Status
                  </label>
                  <div>{paymentBadge(data.paymentStatus)}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">
                    Payment Method
                  </label>
                  <div>{data.paymentMethod}</div>
                </div>

                <div>
                  <label className="form-label text-muted">
                    Order Date
                  </label>
                  <div>{data.createdDate}</div>
                </div>

              </div>
            </div>

            {/* Remarks */}
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

            {/* Actions */}
            <div className="card">
              <div className="card-body d-grid gap-2">

                <button className="btn btn-success">
                  <i className="bx bx-printer me-1"></i>
                  Print Bill
                </button>

                <Link
                  to="/store-management-orders"
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

export default OrdersView;