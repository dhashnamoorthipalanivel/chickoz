import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();

  const [register, setRegister] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        register
      );

      console.log("Register Success:", res.data);

      toast.success(res.data.message || "Registered successfully");

      setTimeout(() => {
        navigate("/auth-login");
      }, 1500);

    } catch (error) {
      console.log("Register Error:", error);
      console.log("Response Data:", error.response?.data);
      console.log("Status Code:", error.response?.status);

      toast.error(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-xxl-3 col-lg-4 col-md-5">
            <div className="auth-full-page-content d-flex p-sm-5 p-4">
              <div className="w-100">
                <div className="d-flex flex-column h-100">
                  <div className="mb-4 mb-md-5 text-center">
                    <Link to="/" className="d-block auth-logo">
                      <img
                        src="/assets/images/logo-sm.svg"
                        alt=""
                        height="28"
                      />{" "}
                      <span className="logo-txt">Minia</span>
                    </Link>
                  </div>

                  <div className="auth-content my-auto">
                    <div className="text-center">
                      <h5 className="mb-0">Register Account</h5>
                      <p className="text-muted mt-2">
                        Get your free Minia account now.
                      </p>
                    </div>

                    <form
                      className="needs-validation mt-4 pt-2"
                      noValidate
                      onSubmit={handleRegister}
                    >
                      {/* EMAIL */}
                      <div className="mb-3">
                        <label htmlFor="useremail" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="useremail"
                          placeholder="Enter email"
                          required
                          name="email"
                          value={register.email}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          Please Enter Email
                        </div>
                      </div>

                      {/* USERNAME */}
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          placeholder="Enter username"
                          required
                          name="username"
                          value={register.username}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          Please Enter Username
                        </div>
                      </div>

                      {/* PASSWORD */}
                      <div className="mb-3">
                        <label htmlFor="userpassword" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="userpassword"
                          placeholder="Enter password"
                          required
                          name="password"
                          value={register.password}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          Please Enter Password
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="mb-0">
                          By registering you agree to the Minia{" "}
                          <Link to="#!" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>

                      <div className="mb-3">
                        <button
                          className="btn btn-primary w-100 waves-effect waves-light"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Registering..." : "Register"}
                        </button>
                      </div>
                    </form>

                    <div className="mt-4 pt-2 text-center">
                      <div className="signin-other-title">
                        <h5 className="font-size-14 mb-3 text-muted fw-medium">
                          - Sign up using -
                        </h5>
                      </div>

                      <ul className="list-inline mb-0">
                        <li className="list-inline-item">
                          <a
                            href="#!"
                            className="social-list-item bg-primary text-white border-primary"
                          >
                            <i className="mdi mdi-facebook"></i>
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a
                            href="#!"
                            className="social-list-item bg-info text-white border-info"
                          >
                            <i className="mdi mdi-twitter"></i>
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a
                            href="#!"
                            className="social-list-item bg-danger text-white border-danger"
                          >
                            <i className="mdi mdi-google"></i>
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-5 text-center">
                      <p className="text-muted mb-0">
                        Already have an account ?{" "}
                        <Link
                          to="/auth-login"
                          className="text-primary fw-semibold"
                        >
                          Login
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 mt-md-5 text-center">
                    <p className="mb-0">
                      © {new Date().getFullYear()} Minia. Crafted with{" "}
                      <i className="mdi mdi-heart text-danger"></i> by
                      Themesbrand
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-9 col-lg-8 col-md-7">
            <div className="auth-bg pt-md-5 p-4 d-flex">
              <div className="bg-overlay bg-primary"></div>
              <ul className="bg-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
              <div className="row justify-content-center align-items-center">
                <div className="col-xl-7">
                  <div className="p-0 p-sm-4 px-xl-0">
                    <div
                      id="reviewcarouselIndicators"
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-indicators carousel-indicators-rounded justify-content-start ms-0 mb-0">
                        <button
                          type="button"
                          data-bs-target="#reviewcarouselIndicators"
                          data-bs-slide-to="0"
                          className="active"
                          aria-current="true"
                          aria-label="Slide 1"
                        ></button>
                        <button
                          type="button"
                          data-bs-target="#reviewcarouselIndicators"
                          data-bs-slide-to="1"
                          aria-label="Slide 2"
                        ></button>
                        <button
                          type="button"
                          data-bs-target="#reviewcarouselIndicators"
                          data-bs-slide-to="2"
                          aria-label="Slide 3"
                        ></button>
                      </div>

                      <div className="carousel-inner">
                        <div className="carousel-item active">
                          <div className="testi-contain text-white">
                            <i className="bx bxs-quote-alt-left text-success display-6"></i>
                            <h4 className="mt-4 fw-medium lh-base text-white">
                              “I feel confident imposing change on myself.”
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
                                    Richard Drews
                                  </h5>
                                  <p className="mb-0 text-white-50">
                                    Web Designer
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

      {/* Toast Container optional if not in App.jsx */}
    </div>
  );
};

export default Register;