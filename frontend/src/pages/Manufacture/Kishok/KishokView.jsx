// KishokView.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const KishokView = () => {
  const { state } = useLocation();

  const data = state?.rowData || {}

  const badgeClass =
    data.manufactureStatus ===
      "COMPLETED"

      ? "bg-success"

      : data.manufactureStatus ===
        "IN_PROGRESS"

        ? "bg-primary"

        : data.manufactureStatus ===
          "ASSIGNED"

          ? "bg-info"

          : "bg-secondary";

          const formatLabel = (value) =>
        value
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) =>
                c.toUpperCase()
            );

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
                    <Link to="/manufacture-kishok">Kishok</Link>
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
                  Reference ID : {data.referenceId}
                </p>
              </div>

              <div className="text-end">
                <span className={`badge ${badgeClass} fs-6`}>
                  {formatLabel(data.manufactureStatus?.replace("_", " "))}
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
                    <label className="form-label text-muted">Place</label>
                    <div>{data.place}</div>
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
                    <div>
                      {
                        data.requiredDate
                          ? new Date(
                            data.requiredDate
                          ).toLocaleDateString()
                          : "-"
                      }
                    </div>
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
                    <div>
                      {
                        data.assignDate
                          ? new Date(
                            data.assignDate
                          ).toLocaleDateString()
                          : "-"
                      }
                    </div>

                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Expected Date</label>
                    <div>
                      {
                        data.expectedDate
                          ? new Date(
                            data.expectedDate
                          ).toLocaleDateString()
                          : "-"
                      }
                    </div>
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
                  <div>{formatLabel(data.manufactureStatus)}</div>
                </div>

                <div>
                  <label className="form-label text-muted">
                    Dispatch Date
                  </label>
                  <div>
                    {
                      data.dispatchDate
                        ? new Date(
                          data.dispatchDate
                        ).toLocaleDateString()
                        : "-"
                    }
                  </div>
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
                    Cart Amount
                  </label>
                  <div>₹ {data.cartAmount}</div>
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
                  to="/manufacture-kishok"
                  className="btn btn-light border"
                >
                  Back to List
                </Link>

                <Link
                  to={`/manufacture-kishok/edit/${data._id}`}
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