import React from 'react';
import { Link } from 'react-router-dom';

const AuthRecoverPw = () => (
    <React.Fragment>
        <div className="account-pages my-5 pt-sm-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card overflow-hidden">
                            <div className="bg-primary-subtle">
                                <div className="row">
                                    <div className="col-7">
                                        <div className="text-primary p-4">
                                            <h5 className="text-primary">Reset Password</h5>
                                            <p>Re-Password with Minia.</p>
                                        </div>
                                    </div>
                                    <div className="col-5 align-self-end">
                                        <img src="/assets/images/profile-img.png" alt="" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                            <div className="card-body pt-0">
                                <div>
                                    <Link to="/">
                                        <div className="avatar-md profile-user-wid mb-4">
                                            <span className="avatar-title rounded-circle bg-light">
                                                <img src="/assets/images/logo.svg" alt="" className="rounded-circle" height="34" />
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                                <div className="p-2">
                                    <div className="alert alert-success text-center mb-4" role="alert">
                                        Enter your Email and instructions will be sent to you!
                                    </div>
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" placeholder="Enter email" />
                                        </div>
                                        <div className="text-end">
                                            <button className="btn btn-primary w-md" type="submit">Reset</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 text-center">
                            <p>Remember It ? <Link to="/login" className="fw-medium text-primary"> Sign In here</Link> </p>
                            <p>© {new Date().getFullYear()} Minia. Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);
export default AuthRecoverPw;
