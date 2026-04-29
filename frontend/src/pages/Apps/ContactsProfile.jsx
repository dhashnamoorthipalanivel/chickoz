import React from 'react';
import { Link } from 'react-router-dom';

const ContactsProfile = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Profile</h4>
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
                                            <img src="/assets/images/users/avatar-2.jpg" alt="" className="img-fluid rounded-circle" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="mb-1">Dhashnamoorthi</h5>
                                            <p className="text-muted mb-2">Super Admin</p>

                                            <div className="text-muted font-size-13">
                                                <div>Franchise ID : EMP001</div>
                                                <div>Status : <span className="badge bg-success">Active</span></div>
                                            </div>
                                        </div>

                                        <div>
                                        
                                            <button className="btn btn-primary btn-sm">Change Password</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TABS */}
                            <div className="card">
                                <div className="card-body">
                                    <ul className="nav nav-tabs nav-tabs-custom">
                                        <li className="nav-item">
                                            <a className="nav-link active" data-bs-toggle="tab" href="#overview">Overview</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-bs-toggle="tab" href="#work">Work Info</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-bs-toggle="tab" href="#security">Security</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="tab-content">

                                {/* OVERVIEW */}
                                <div className="tab-pane active" id="overview">
                                    <div className="card">
                                        <div className="card-body">

                                            <h5 className="mb-3">Basic Information</h5>
                                            <p>Name : Dhashnamoorthi</p>
                                            <p>Email : admin@fooderp.com</p>
                                            <p>Phone : 9876543210</p>
                                            <p>Address : Erode, Tamil Nadu</p>

                                            <hr />

                                            <h5 className="mb-3">Organization Information</h5>
                                            <p>Frachise ID : EMP001</p>
                                            <p>Role : Super Admin</p>
                                            <p>Department : Admin</p>
                                            <p>Assigned Unit : Head Office</p>
                                            <p>Joining Date : 01 Jan 2026</p>

                                            <hr />

                                            <h5 className="mb-3">Module Access</h5>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <span className="badge bg-primary">CRM</span>
                                                <span className="badge bg-primary">Master</span>
                                                <span className="badge bg-primary">Billing</span>
                                                <span className="badge bg-primary">Reports</span>
                                                <span className="badge bg-primary">Manufacture</span>
                                                <span className="badge bg-primary">Store</span>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* WORK INFO */}
                                <div className="tab-pane" id="work">
                                    <div className="card">
                                        <div className="card-body">

                                            <h5 className="mb-3">Work Information</h5>
                                            <p>Designation : Admin</p>
                                            <p>Department : Admin</p>
                                            <p>Assigned Unit : Head Office</p>
                                            <p>Reporting Manager : Owner</p>

                                            <hr />

                                            <h5 className="mb-3">Operational Access</h5>
                                            <p>CRM Access : Yes</p>
                                            <p>Billing Access : Yes</p>
                                            <p>Reports Access : Yes</p>
                                            <p>Master Access : Yes</p>
                                            <p>Lead Approval : Yes</p>

                                        </div>
                                    </div>
                                </div>

                                {/* SECURITY */}
                                <div className="tab-pane" id="security">
                                    <div className="card">
                                        <div className="card-body">

                                            <h5 className="mb-3">Security Settings</h5>
                                            <p>Username : admin</p>
                                            <p>Password : ********</p>
                                            <p>Last Changed : 10 Apr 2026</p>

                                            <button className="btn btn-primary btn-sm">Change Password</button>

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
                                    <h5>Assigned Unit</h5>
                                    <p>Head Office</p>
                                    <p>Erode</p>
                                    <span className="badge bg-success">Active</span>
                                </div>
                            </div>

                            {/* LOGIN ACTIVITY */}
                            <div className="card">
                                <div className="card-body">
                                    <h5>Login Activity</h5>
                                    <p>Last Login : Today 10:30 AM</p>
                                    <p>Account Created : 01 Jan 2026</p>
                                    <p>Last Updated : 05 Apr 2026</p>
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