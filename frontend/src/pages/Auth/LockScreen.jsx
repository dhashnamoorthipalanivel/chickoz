import React from 'react';
import { Link } from 'react-router-dom';

const AuthLockScreen = () => (
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
                                            <h5 className="text-primary">Lock screen</h5>
                                            <p>Enter your password to unlock the screen!</p>
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
                                    <div className="user-thumb text-center mb-4">
                                        <img src="/assets/images/users/avatar-4.jpg" className="rounded-circle avatar-md img-thumbnail" alt="thumbnail" />
                                        <h5 className="font-size-15 mt-3">Admin</h5>
                                    </div>
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Password</label>
                                            <input type="password" className="form-control" placeholder="Enter Password" />
                                        </div>
                                        <div className="text-end">
                                            <button className="btn btn-primary w-md" type="submit">Unlock</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 text-center">
                            <p>Not you ? return <Link to="/login" className="fw-medium text-primary">Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);
export default AuthLockScreen;
