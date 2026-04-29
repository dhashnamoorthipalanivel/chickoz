import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthTwoStepVerification = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
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
                                            <div className="p-2 mt-4">
                                                <h4>Verify Your Mobile No</h4>
                                                <p className="text-muted mb-5">Enter the 6 digit code sent to your mobile number.</p>
                                                <div className="d-flex gap-2 justify-content-center mb-4">
                                                    {code.map((val, idx) => (
                                                        <input key={idx} type="text" className="form-control text-center" maxLength={1} style={{width: '3rem', height: '3rem', fontSize: '1.2rem'}} value={val} onChange={e => {const n = [...code]; n[idx] = e.target.value; setCode(n);}} />
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
                                <p><Link to="/login" className="fw-medium text-primary">Back to Sign in</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default AuthTwoStepVerification;
