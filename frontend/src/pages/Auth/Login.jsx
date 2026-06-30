import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {loginUser} from "../../api/authAPI";
import logo from '/assets/images/logo-1.png';

const Login = () => {

  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Login 
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!login.email || !login.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // backend expects email + password
      const payload = {
        email: login.email,
        password: login.password
      };

      const res =  await loginUser(payload);

      // save token + user
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success(res.message || "Login successful!");

      // small delay so toast can be seen
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (error) {
      console.log("Full Error:", error);
      console.log("Response Data:", error.response?.data);
      console.log("Status Code:", error.response?.status);

      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-xxl-8 col-lg-7 col-md-6">
            <div className="auth-bg pt-md-5 p-4 d-flex">
              <div className="bg-overlay bg-primary"></div>
              <ul className="bg-bubbles">
                <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
              </ul>
              <div className="row justify-content-center align-items-center">
                <div className="col-xl-7">
                  <div className="p-0 p-sm-4 px-xl-0">
                    <div id="reviewcarouselIndicators" className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-indicators carousel-indicators-rounded justify-content-start ms-0 mb-0">
                        <button type="button" data-bs-target="#reviewcarouselIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#reviewcarouselIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#reviewcarouselIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                      </div>
                      <div className="carousel-inner">
                        <div className="carousel-item active">
                          <div className="testi-contain text-white">
                            <i className="bx bxs-quote-alt-left text-success display-6"></i>
                            <h4 className="mt-4 fw-medium lh-base text-white">“I feel confident imposing change on myself. It's a lot more progressing fun than looking back.”</h4>
                            <div className="mt-4 pt-3 pb-5">
                              <div className="d-flex align-items-start">
                                <div className="flex-shrink-0">
                                  <img src="/assets/images/users/avatar-1.jpg" className="avatar-md img-fluid rounded-circle" alt="..." />
                                </div>
                                <div className="flex-grow-1 ms-3 mb-4">
                                  <h5 className="font-size-18 text-white">Richard Drews</h5>
                                  <p className="mb-0 text-white-50">Web Designer</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* More carousel items can be added here */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-lg-5 col-md-6">
            <div className="auth-full-page-content d-flex p-sm-5 p-4">
              <div className="w-100">
                <div className="d-flex flex-column h-100">
                  <div className="mb-4 mb-md-5 text-center">
                    <Link to="/" className="d-block auth-logo">
                      <img src={logo} alt="chickoz_logo" height="60" /> <span className="logo-txt">Chickoz</span>
                    </Link>
                  </div>
                  <div className="auth-content my-auto">
                    <div className="text-center">
                      <h5 className="mb-0">Welcome Back !</h5>
                      <p className="text-muted mt-2">Sign in to continue to Chickoz.</p>
                    </div>
                    <form className="mt-4 pt-2" onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter email"
                          name='email'
                          value={login.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-start">
                          <div className="flex-grow-1">
                            <label className="form-label">Password</label>
                          </div>
                          <div className="flex-shrink-0">
                            <Link to="/" className="text-muted">Forgot password?</Link>
                          </div>
                        </div>

                        <div className="input-group auth-pass-inputgroup">
                          <input type="password" className="form-control" placeholder="Enter password" aria-label="Password" aria-describedby="password-addon"
                            name='password'
                            value={login.password}
                            onChange={handleChange}
                          />

                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="remember-check" />
                            <label className="form-check-label" htmlFor="remember-check">
                              Remember me
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">
                          {loading ? "Log In..." : "Log In"}
                        </button>
                      </div>
                    </form>

                  </div>
                  <div className="mt-4 mt-md-5 text-center">
                    <p className="mb-0">© {new Date().getFullYear()} Chickoz. Crafted with <i className="mdi mdi-heart text-danger"></i> by Ahattrickz Info Tech</p>
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

export default Login;
