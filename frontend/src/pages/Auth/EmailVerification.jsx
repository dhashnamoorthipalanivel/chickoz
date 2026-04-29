import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthEmailVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    return (
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
                                                <p className="text-muted mb-5">Please enter the 6 digit code sent to <span className="fw-semibold">example@abc.com</span></p>
                                                <div className="d-flex gap-2 justify-content-center mb-4">
                                                    {otp.map((val, idx) => (
                                                        <input key={idx} type="text" className="form-control text-center" maxLength={1} style={{width: '3rem', height: '3rem', fontSize: '1.2rem'}} value={val} onChange={e => {const n = [...otp]; n[idx] = e.target.value; setOtp(n);}} />
                                                    ))}
                                                </div>
                                                <div className="mt-4">
                                                    <Link to="/" className="btn btn-success w-md">Confirm</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 text-center">
                                <p>Did not receive a code? <a href="#!" className="fw-medium text-primary">Resend</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default AuthEmailVerification;
