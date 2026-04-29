import React from 'react';
import { Link } from 'react-router-dom';

const AuthLogout = () => (
    <React.Fragment>
        <div className="account-pages my-5 pt-sm-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card overflow-hidden">
                            <div className="bg-primary-subtle">
                                <div className="row">
                                    <div className="col-7"><div className="text-primary p-4"><h5 className="text-primary">Log Out</h5><p>You are logging out of Minia.</p></div></div>
                                    <div className="col-5 align-self-end"><img src="/assets/images/profile-img.png" alt="" className="img-fluid" /></div>
                                </div>
                            </div>
                            <div className="card-body pt-0">
                                <div className="p-2">
                                    <div className="text-center">
                                        <div className="avatar-md mx-auto">
                                            <div className="avatar-title rounded-circle bg-light">
                                                <i className="bx bx-power-off h1 mb-0 text-primary"></i>
                                            </div>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <h4>You are Logged Out</h4>
                                            <p className="text-muted">Click below to Login again to your account.</p>
                                            <div className="mt-4">
                                                <Link to="/login" className="btn btn-primary">Sign In</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);
export default AuthLogout;
