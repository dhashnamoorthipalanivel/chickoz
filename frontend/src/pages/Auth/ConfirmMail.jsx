import React from 'react';
import { Link } from 'react-router-dom';

const AuthConfirmMail = () => (
    <React.Fragment>
        <div className="account-pages my-5 pt-sm-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card overflow-hidden">
                            <div className="card-body">
                                <div className="p-2">
                                    <div className="text-center">
                                        <div className="avatar-md mx-auto">
                                            <div className="avatar-title rounded-circle bg-light">
                                                <i className="bx bxs-envelope h1 mb-0 text-primary"></i>
                                            </div>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <h4>Verify your email</h4>
                                            <p className="text-muted">We have sent you verification email <span className="fw-semibold">example@abc.com</span>, Please check it</p>
                                            <div className="mt-4">
                                                <Link to="/login" className="btn btn-success">Back to Sign in</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 text-center">
                            <p>Did not receive an email? <a href="#!" className="fw-medium text-primary">Resend</a></p>
                            <p>© {new Date().getFullYear()} Minia. Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);
export default AuthConfirmMail;
