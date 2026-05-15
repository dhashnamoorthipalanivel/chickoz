import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/store";
import { toast } from "react-toastify";

const ChangePassword = () => {

    const navigate = useNavigate();
    const {sendChangePasswordOtp} = useAuthStore();

    const [form, setForm] =
        useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // EMPTY CHECK
    if (!form.currentPassword ||!form.newPassword ||!form.confirmPassword
    ) {
        toast.error("All fields are required");
        return;
    }

    // PASSWORD LENGTH
    if (
        form.newPassword.length < 6
    ) {
        toast.error("New password must be at least 6 characters");
        return;
    }

    // PASSWORD MATCH
    if (form.newPassword !==form.confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }

    // SAME PASSWORD
    if (form.currentPassword ===form.newPassword) {
        toast.error("New password cannot be same as current password");
        return;
    }
    try {

    const payload = {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
    };

    const response = await sendChangePasswordOtp(payload);

    toast.success( response.message);

    // OTP PAGE
    navigate("/auth-two-step-verification" );

} catch (error) {
    toast.error(error?.response?.data?.message ||"Failed to send OTP"
    );
}
};

    return (
        <React.Fragment>
            <div className="account-pages my-5 pt-sm-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card overflow-hidden">
                                {/* HEADER */}

                                <div className="bg-primary-subtle">
                                    <div className="row">
                                        <div className="col-7">
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">
                                                    Change Password
                                                </h5>
                                                <p>
                                                    Update your password securely.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-5 align-self-end">
                                            <img
                                                src="/assets/images/profile-img.png"
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* BODY */}
                                <div className="card-body pt-0">
                                    {/* LOGO */}
                                    <div>
                                        <Link to="/">
                                            <div className="avatar-md profile-user-wid mb-4">
                                                <span className="avatar-title rounded-circle bg-light">
                                                    <img
                                                        src="/assets/images/logo.svg"
                                                        alt=""
                                                        className="rounded-circle"
                                                        height="34"
                                                    />
                                                </span>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* FORM */}
                                    <div className="p-2">
                                        <form
                                            onSubmit={handleSubmit}
                                        >

                                            {/* CURRENT PASSWORD */}
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Enter current password"
                                                    name="currentPassword"
                                                    value={form.currentPassword}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            {/* NEW PASSWORD */}
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Enter new password"
                                                    name="newPassword"
                                                    value={form.newPassword}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {/* CONFIRM PASSWORD */}
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Confirm new password"
                                                    name="confirmPassword"
                                                    value={form.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            {/* BUTTON */}
                                            <div className="text-end">
                                                <button
                                                    className="btn btn-primary w-md"
                                                    type="submit"
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/* FOOTER */}

                            <div className="mt-5 text-center">
                                <p>
                                    © {new Date().getFullYear()} Chickoz.
                                    Crafted with{" "}
                                    <i className="mdi mdi-heart text-danger"></i>
                                    {" "}by Ahattrickz Info Tech
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ChangePassword;