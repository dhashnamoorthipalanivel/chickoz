import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/store';
import { toast } from 'react-toastify';

const AuthTwoStepVerification = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { verifyChangePasswordOtp, clearProfile, } = useAuthStore();

    const handleVerify = async () => {

        console.log("Verification button clicked");

        setLoading(true);
        try {
            const otpValue = code.join("");

            if (otpValue.length !== 6) {
                toast.error("Enter valid OTP");
                return;
            }

            console.log("CALLING VERIFY API");

            const response = await verifyChangePasswordOtp({
                otp: code.join(""),
            })

            console.log("VERIFY RESPONSE:",response);

            toast.success(response.message);

            // LOGOUT
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            clearProfile();
            // LOGIN PAGE
            navigate("/");

        } catch (error) {
            toast.error(error?.response?.data?.message || "OTP verification failed"
            );
        } finally {

            setLoading(false);
        }
    };
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
                                                        <input key={idx} type="text" className="form-control text-center" maxLength={1} style={{ width: '3rem', height: '3rem', fontSize: '1.2rem' }} value={val}
                                                            onChange={(e) => {

                                                                const value = e.target.value;

                                                                // ONLY NUMBER
                                                                if (!/^[0-9]?$/.test(value)) {
                                                                    return;
                                                                }

                                                                const n = [...code];
                                                                n[idx] = value;
                                                                setCode(n);

                                                                // AUTO NEXT
                                                                if (value && e.target.nextSibling) {
                                                                    e.target.nextSibling.focus();
                                                                }
                                                            }}

                                                            onKeyDown={(e) => {
                                                                if (e.key === "Backspace" && !code[idx] && e.target.previousSibling
                                                                ) {
                                                                    e.target.previousSibling.focus();
                                                                }
                                                            }} />
                                                    ))}
                                                </div>
                                                <div className="mt-4">
                                                    <button className="btn btn-success w-md" onClick={handleVerify} disabled={loading}>
                                                        {loading ? "Verifying..." : "Confirm"}</button>
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
