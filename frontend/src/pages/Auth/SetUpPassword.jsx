import React, {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useSearchParams,
    useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import api from "../../api/apiClient";

const SetUpPassword = () => {

    const validatePassword = (password) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        return passwordRegex.test(password);
    };

    // ✅ URL TOKEN
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const navigate = useNavigate();

    // ✅ PASSWORD STATE
    const [passwordData, setPasswordData] = useState({
        password: "",
        confirmPassword: "",
    });

    // ✅ EMAIL
    const [email, setEmail] = useState("");

    // ✅ TOKEN STATUS
    const [isTokenValid, setIsTokenValid] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    // ✅ VERIFY TOKEN
    useEffect(() => {

        if (token) {

            verifyToken();

        } else {

            setIsTokenValid(false);

            toast.error(
                "Invitation token missing"
            );
        }

    }, []);

    const verifyToken =
        async () => {
            try {
                const res = await api.get(`/franchises/verify-invite-token?token=${token}`);

                setEmail(res.data.franchise.email);

                setIsTokenValid(true);

            } catch (error) {

                toast.error(

                    error.response?.data?.message ||

                    "Invalid invitation link"
                );

                setIsTokenValid(false);
            }
        };

    // ✅ HANDLE INPUT
    const handleChange =
        (e) => {

            const {
                name,
                value,
            } = e.target;

            setPasswordData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

    // ✅ PASSWORD STRENGTH
    const getPasswordStrength =
        (password) => {

            if (password.length < 6) {
                return "Weak";
            }

            const hasUpper =
                /[A-Z]/.test(password);

            const hasLower =
                /[a-z]/.test(password);

            const hasNumber =
                /[0-9]/.test(password);

            const hasSpecial =
                /[^A-Za-z0-9]/.test(password);

            if (

                hasUpper &&
                hasLower &&
                hasNumber &&
                hasSpecial &&
                password.length >= 8

            ) {

                return "Strong";
            }

            return "Medium";
        };

    // ✅ SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        // EMPTY CHECK
        if (!passwordData.password || !passwordData.confirmPassword
        ) {
            toast.error("Please enter all fields");
            return;
        }

        // PASSWORD MATCH
        if (
            passwordData.password !== passwordData.confirmPassword
        ) {
            toast.error("Passwords do not match");
            return;
        }

        // STRONG PASSWORD
        if (!validatePassword(passwordData.password)) {
            toast.error(
                "Password must contain uppercase, lowercase, number, special character and minimum 8 characters"
            );
            return;
        }

        try {

            setIsLoading(true);

            const res = await api.post("/franchises/setup-password",
                {
                    token,
                    password: passwordData.password,
                }
            );

            toast.success(res.data.message);

            setTimeout(() => {
                navigate("/auth-login");
            }, 1500);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {

            setIsLoading(false);
        }
    };

    return (

        <div className="auth-page">

            <div className="container-fluid p-0">

                <div className="row g-0">

                    {/* LEFT SIDE */}
                    <div className="col-xxl-3 col-lg-4 col-md-5">

                        <div className="auth-full-page-content d-flex p-sm-5 p-4">

                            <div className="w-100">

                                <div className="d-flex flex-column h-100">

                                    {/* LOGO */}
                                    <div className="mb-4 mb-md-5 text-center">

                                        <Link
                                            to="/"
                                            className="d-block auth-logo"
                                        >

                                            <img
                                                src="/assets/images/logo-sm.svg"
                                                alt=""
                                                height="28"
                                            />

                                            <span className="logo-txt">
                                                Chickoz
                                            </span>

                                        </Link>

                                    </div>

                                    {/* CONTENT */}
                                    <div className="auth-content my-auto">

                                        <div className="text-center">

                                            <h5 className="mb-0">
                                                Setup Password
                                            </h5>

                                            <p className="text-muted mt-2">
                                                Create your new password.
                                            </p>

                                        </div>

                                        {/* INVALID TOKEN */}
                                        {
                                            !isTokenValid ? (
                                                <div className="alert alert-danger mt-4">
                                                    Invalid or expired invitation link
                                                </div>

                                            ) : (

                                                // ✅ FORM
                                                <form
                                                    className="needs-validation mt-4 pt-2"
                                                    noValidate
                                                    onSubmit={handleSubmit}
                                                >

                                                    {/* EMAIL */}
                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            Email
                                                        </label>

                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            value={email}
                                                            readOnly
                                                        />

                                                    </div>

                                                    {/* PASSWORD */}
                                                    <div className="mb-3">

                                                        <label
                                                            htmlFor="password"
                                                            className="form-label"
                                                        >
                                                            Password
                                                        </label>

                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="password"
                                                            placeholder="Enter password"
                                                            name="password"
                                                            value={passwordData.password}
                                                            onChange={handleChange}
                                                        />

                                                        {/* STRENGTH */}
                                                        {
                                                            passwordData.password && (
                                                                <small
                                                                    className={
                                                                        getPasswordStrength(
                                                                            passwordData.password
                                                                        ) === "Strong"

                                                                            ? "text-success"

                                                                            : getPasswordStrength(
                                                                                passwordData.password
                                                                            ) === "Medium"

                                                                                ? "text-warning"

                                                                                : "text-danger"
                                                                    }
                                                                >

                                                                    Password Strength :
                                                                    {" "}

                                                                    {
                                                                        getPasswordStrength(
                                                                            passwordData.password
                                                                        )
                                                                    }

                                                                </small>
                                                            )
                                                        }

                                                        <div className="mt-2">
                                                            <small className="text-muted">
                                                                Password must contain:
                                                                <br />
                                                                • Minimum 8 characters
                                                                <br />
                                                                • One uppercase letter
                                                                <br />
                                                                • One lowercase letter
                                                                <br />
                                                                • One number
                                                                <br />
                                                                • One special character
                                                            </small>
                                                        </div>

                                                    </div>

                                                    {/* CONFIRM PASSWORD */}
                                                    <div className="mb-3">

                                                        <label
                                                            htmlFor="confirmPassword"
                                                            className="form-label"
                                                        >

                                                            Confirm Password

                                                        </label>

                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="confirmPassword"
                                                            placeholder="Confirm password"
                                                            name="confirmPassword"
                                                            value={
                                                                passwordData.confirmPassword
                                                            }
                                                            onChange={handleChange}
                                                        />

                                                        {/* MISMATCH */}
                                                        {
                                                            passwordData.confirmPassword &&

                                                            passwordData.password !==

                                                            passwordData.confirmPassword && (

                                                                <small className="text-danger">

                                                                    Passwords do not match

                                                                </small>
                                                            )
                                                        }

                                                        {/* MATCH */}
                                                        {
                                                            passwordData.confirmPassword &&

                                                            passwordData.password ===

                                                            passwordData.confirmPassword && (

                                                                <small className="text-success">

                                                                    Passwords match

                                                                </small>
                                                            )
                                                        }
                                                    </div>

                                                    {/* BUTTON */}
                                                    <div className="mb-3">
                                                        <button
                                                            className="btn btn-primary w-100 waves-effect waves-light"
                                                            type="submit"
                                                            disabled={
                                                                isLoading ||
                                                                !passwordData.password ||
                                                                !passwordData.confirmPassword ||
                                                                passwordData.password !== passwordData.confirmPassword ||
                                                                !validatePassword(passwordData.password)
                                                            }
                                                        >
                                                            {isLoading ? "Saving..." : "Set Password"
                                                            }
                                                        </button>
                                                    </div>
                                                </form>
                                            )
                                        }

                                        {/* LOGIN */}
                                        <div className="mt-5 text-center">
                                            <p className="text-muted mb-0">
                                                Back to Login ?
                                                <Link to="/auth-login" className="text-primary fw-semibold ms-1">
                                                    Login
                                                </Link>
                                            </p>
                                        </div>
                                    </div>

                                    {/* FOOTER */}
                                    <div className="mt-4 mt-md-5 text-center">
                                        <p className="mb-0">
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

                    {/* RIGHT SIDE */}
                    <div className="col-xxl-9 col-lg-8 col-md-7">

                        <div className="auth-bg pt-md-5 p-4 d-flex">

                            <div className="bg-overlay bg-primary"></div>

                            <ul className="bg-bubbles">
                                <li></li><li></li><li></li><li></li><li></li>
                                <li></li><li></li><li></li><li></li><li></li>
                            </ul>

                            <div className="row justify-content-center align-items-center">

                                <div className="col-xl-7">

                                    <div className="p-0 p-sm-4 px-xl-0">

                                        <div
                                            id="reviewcarouselIndicators"
                                            className="carousel slide"
                                            data-bs-ride="carousel"
                                        >

                                            <div className="carousel-inner">

                                                <div className="carousel-item active">

                                                    <div className="testi-contain text-white">

                                                        <i className="bx bxs-quote-alt-left text-success display-6"></i>

                                                        <h4 className="mt-4 fw-medium lh-base text-white">

                                                            “Security starts with a strong password.”

                                                        </h4>

                                                        <div className="mt-4 pt-3 pb-5">

                                                            <div className="d-flex align-items-start">

                                                                <div className="flex-shrink-0">

                                                                    <img
                                                                        src="/assets/images/users/avatar-1.jpg"
                                                                        className="avatar-md img-fluid rounded-circle"
                                                                        alt="..."
                                                                    />

                                                                </div>

                                                                <div className="flex-grow-1 ms-3 mb-4">

                                                                    <h5 className="font-size-18 text-white">
                                                                        Welcome User
                                                                    </h5>

                                                                    <p className="mb-0 text-white-50">

                                                                        Setup your account password

                                                                    </p>

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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetUpPassword;