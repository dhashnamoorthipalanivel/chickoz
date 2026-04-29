// KishokView.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const KishokView = () => {
  const { state } = useLocation();

  const data = state?.rowData || {
    leadId: "LD001",
    customerName: "Arun Kumar",
    phone: "9876543210",
    location: "Chennai",
    packageName: "Standard",
    cartSize: "6 x 4",
    brandingType: "ACP Branding",
    accessories: "Sink + Rack",
    requiredDate: "2026-04-30",
    priority: "Urgent",
    vendorName: "ABC Fabrication",
    vendorPhone: "9000000000",
    assignDate: "2026-04-24",
    expectedDate: "2026-04-29",
    productionStatus: "In Progress",
    dispatchDate: "-",
    totalAmount: 125000,
    paidAmount: 50000,
    pendingAmount: 75000,
    createdDate: "2026-04-22",
    status: "IN_PROGRESS",
  };

  const badgeClass =
    data.status === "COMPLETED"
      ? "bg-success"
      : data.status === "IN_PROGRESS"
      ? "bg-primary"
      : data.status === "ASSIGNED"
      ? "bg-info"
      : "bg-secondary";

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0 font-size-18">Kishok View</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/kishok">Kishok</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    View
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Top Summary */}
        <div className="card">
          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div>
                <h5 className="mb-1">{data.customerName}</h5>
                <p className="text-muted mb-0">
                  Lead ID : {data.leadId}
                </p>
              </div>

              <div className="text-end">
                <span className={`badge ${badgeClass} fs-6`}>
                  {data.status.replace("_", " ")}
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="row">

          {/* Left */}
          <div className="col-xl-8">

            {/* Requirement */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Cart Requirement</h5>
              </div>

              <div className="card-body">
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label text-muted">Phone</label>
                    <div>{data.phone}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Location</label>
                    <div>{data.location}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Package</label>
                    <div>{data.packageName}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Cart Size</label>
                    <div>{data.cartSize}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Branding Type</label>
                    <div>{data.brandingType}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Accessories</label>
                    <div>{data.accessories}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Required Date</label>
                    <div>{data.requiredDate}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Priority</label>
                    <div>{data.priority}</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Vendor */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Vendor Details</h5>
              </div>

              <div className="card-body">
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label text-muted">Vendor Name</label>
                    <div>{data.vendorName}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Vendor Phone</label>
                    <div>{data.vendorPhone}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Assign Date</label>
                    <div>{data.assignDate}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Expected Date</label>
                    <div>{data.expectedDate}</div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Right */}
          <div className="col-xl-4">

            {/* Production */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Production</h5>
              </div>

              <div className="card-body">

                <div className="mb-3">
                  <label className="form-label text-muted">
                    Production Status
                  </label>
                  <div>{data.productionStatus}</div>
                </div>

                <div>
                  <label className="form-label text-muted">
                    Dispatch Date
                  </label>
                  <div>{data.dispatchDate}</div>
                </div>

              </div>
            </div>

            {/* Payment */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Payment</h5>
              </div>

              <div className="card-body">

                <div className="mb-3">
                  <label className="form-label text-muted">
                    Total Amount
                  </label>
                  <div>₹ {data.totalAmount}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">
                    Paid Amount
                  </label>
                  <div className="text-success">
                    ₹ {data.paidAmount}
                  </div>
                </div>

                <div>
                  <label className="form-label text-muted">
                    Pending Amount
                  </label>
                  <div className="text-danger">
                    ₹ {data.pendingAmount}
                  </div>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <div className="card-body d-grid gap-2">

                <Link
                  to="/kishok"
                  className="btn btn-light border"
                >
                  Back to List
                </Link>

                <Link
                  to={`/kishok/edit/${data.leadId}`}
                  state={{ rowData: data }}
                  className="btn btn-primary"
                >
                  Edit Record
                </Link>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default KishokView;