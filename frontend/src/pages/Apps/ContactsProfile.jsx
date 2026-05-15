import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/store";

const ContactsProfile = () => {
  const { profile, franchise, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  console.log("Profile :", profile);
  console.log("Franchise :", franchise)

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">

          {/* Page Title */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">
                  Profile
                </h4>
              </div>
            </div>
          </div>

          <div className="row">

            {/* LEFT SIDE */}
            <div className="col-xl-9 col-lg-8">

              {/* PROFILE HEADER */}
              <div className="card">
                <div className="card-body">

                  <div className="d-flex align-items-start">

                    <div className="avatar-xl me-3">
                      <img
                        src={
                          profile?.profileImage ||

                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(
                            profile?.firstName || "User"
                          ) +
                          "&background=0D8ABC&color=fff&size=200"
                        }
                        alt="profile"
                        className="img-fluid rounded-circle"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div className="flex-grow-1">

                      <h5 className="mb-1">
                        {profile?.firstName || "-"}
                      </h5>

                      <p className="text-muted mb-2">
                        {profile?.role || "-"}
                      </p>

                      <div className="text-muted font-size-13">

                        <div>
                          Franchise ID :
                          {" "}
                          {franchise?.franchiseId || "-"}
                        </div>

                        <div>
                          Status :
                          {" "}

                          <span className="badge bg-success">
                            {franchise?.status || "-"}
                          </span>
                        </div>

                      </div>
                    </div>

                    <div>
                      <Link
                        to="/auth-change-password"
                        className="btn btn-primary btn-sm"
                      >
                        Change Password
                      </Link>
                    </div>


                  </div>
                </div>
              </div>

              {/* TABS */}
              <div className="card">
                <div className="card-body">

                  <ul className="nav nav-tabs nav-tabs-custom">

                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-bs-toggle="tab"
                        href="#overview"
                      >
                        Overview
                      </a>
                    </li>

                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#work"
                      >
                        Work Info
                      </a>
                    </li>

                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#security"
                      >
                        Security
                      </a>
                    </li>

                  </ul>
                </div>
              </div>

              <div className="tab-content">

                {/* OVERVIEW */}
                <div
                  className="tab-pane active"
                  id="overview"
                >
                  <div className="card">
                    <div className="card-body">

                      <h5 className="mb-3">
                        Basic Information
                      </h5>

                      <p>
                        Name :
                        {" "}
                        {profile?.firstName || "-"}
                      </p>

                      <p>
                        Email :
                        {" "}
                        {profile?.email || "-"}
                      </p>

                      <p>
                        Phone :
                        {" "}
                        {profile?.phone || "-"}
                      </p>

                      <p>
                        Address :
                        {" "}
                        {franchise?.address || "-"}
                      </p>

                      <hr />

                      <h5 className="mb-3">
                        Organization Information
                      </h5>

                      <p>
                        Franchise ID :
                        {" "}
                        {franchise?.franchiseId || "-"}
                      </p>

                      <p>
                        Role :
                        {" "}
                        {profile?.role || "-"}
                      </p>

                      <p>
                        Department :
                        Admin
                      </p>

                      <p>
                        Assigned Unit :
                        {" "}
                        {
                          franchise?.franchiseName ||
                          "Head Office"
                        }
                      </p>

                      <p>
                        Joining Date :
                        {" "}

                        {
                          franchise?.createdAt

                            ? new Date(
                              franchise.createdAt
                            ).toLocaleDateString()

                            : "-"
                        }
                      </p>

                      <hr />

                      <h5 className="mb-3">
                        Module Access
                      </h5>

                      <div className="d-flex gap-2 flex-wrap">

                        <span className="badge bg-primary">
                          CRM
                        </span>

                        <span className="badge bg-primary">
                          Master
                        </span>

                        <span className="badge bg-primary">
                          Billing
                        </span>

                        <span className="badge bg-primary">
                          Reports
                        </span>

                        <span className="badge bg-primary">
                          Manufacture
                        </span>

                        <span className="badge bg-primary">
                          Store
                        </span>

                      </div>
                    </div>
                  </div>
                </div>

                {/* WORK INFO */}
                <div
                  className="tab-pane"
                  id="work"
                >
                  <div className="card">
                    <div className="card-body">

                      <h5 className="mb-3">
                        Work Information
                      </h5>

                      <p>
                        Designation :
                        {" "}
                        {profile?.role || "-"}
                      </p>

                      <p>
                        Department :
                        Admin
                      </p>

                      <p>
                        Assigned Unit :
                        {" "}
                        {
                          franchise?.franchiseName ||
                          "Head Office"
                        }
                      </p>

                      <p>
                        Reporting Manager :
                        Owner
                      </p>

                      <hr />

                      <h5 className="mb-3">
                        Operational Access
                      </h5>

                      <p>
                        CRM Access : Yes
                      </p>

                      <p>
                        Billing Access :
                        {" "}
                        {
                          franchise?.isActiveForBilling
                            ? "Yes"
                            : "No"
                        }
                      </p>

                      <p>
                        Reports Access :
                        {" "}
                        {
                          franchise?.allowReports
                            ? "Yes"
                            : "No"
                        }
                      </p>

                      <p>
                        Master Access : Yes
                      </p>

                      <p>
                        Lead Approval : Yes
                      </p>

                    </div>
                  </div>
                </div>

                {/* SECURITY */}
                <div
                  className="tab-pane"
                  id="security"
                >
                  <div className="card">
                    <div className="card-body">

                      <h5 className="mb-3">
                        Security Settings
                      </h5>

                      <p>
                        Username :
                        {" "}
                        {profile?.email || "-"}
                      </p>

                      <p>
                        Password :
                        ********
                      </p>

                      <p>
                        Last Changed :
                        {" "}

                        {
                          profile?.updatedAt

                            ? new Date(
                              profile.updatedAt
                            ).toLocaleDateString()

                            : "-"
                        }
                      </p>

                      <button className="btn btn-primary btn-sm">
                        Change Password
                      </button>

                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-xl-3 col-lg-4">

              {/* ASSIGNED UNIT */}
              <div className="card">
                <div className="card-body">

                  <h5>
                    Assigned Unit
                  </h5>

                  <p>
                    {
                      franchise?.franchiseName ||
                      "Head Office"
                    }
                  </p>

                  <p>
                    {franchise?.location || "-"}
                  </p>

                  <span className="badge bg-success">
                    {franchise?.status || "-"}
                  </span>

                </div>
              </div>

              {/* LOGIN ACTIVITY */}
              <div className="card">
                <div className="card-body">

                  <h5>
                    Login Activity
                  </h5>

                  <p>
                    Last Login :
                    {" "}

                    {
                      profile?.lastLogin

                        ? new Date(
                          profile.lastLogin
                        ).toLocaleString()

                        : "-"
                    }
                  </p>

                  <p>
                    Account Created :
                    {" "}

                    {
                      profile?.createdAt

                        ? new Date(
                          profile.createdAt
                        ).toLocaleDateString()

                        : "-"
                    }
                  </p>

                  <p>
                    Last Updated :
                    {" "}

                    {
                      profile?.updatedAt

                        ? new Date(
                          profile.updatedAt
                        ).toLocaleDateString()

                        : "-"
                    }
                  </p>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ContactsProfile;