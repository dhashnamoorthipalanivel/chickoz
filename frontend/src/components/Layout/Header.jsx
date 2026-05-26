import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Feather from 'react-feather';
import { useTheme } from '../../context/ThemeContext';
import { logoutUser } from '../../api/authAPI'
import { toast } from 'react-toastify';
import logo from '/assets/images/logo-1.png'
import { useAuthStore } from '../../store/store';

const Header = ({ toggleSidebar }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { layoutMode, toggleTheme, toggleRightSidebar } = useTheme();

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const { clearProfile } = useAuthStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Date and time 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleLogOut = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await logoutUser(token);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      clearProfile();

      toast.success(res.message || "Logout successful");

      setTimeout(() => {
        navigate("/auth-login");
      }, 1000);
    } catch (error) {
      console.log("Logout Error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          {/* LOGO */}
          <div className="navbar-brand-box">
            <Link to="/dashboard" className="logo logo-dark">
              <span className="logo-sm">
                <img src={logo} alt="chickoz_logo" height="40" />
              </span>
              <span className="logo-lg">
                <img src={logo} alt="chickoz_logo" height="40" /> <span className="logo-txt">Chickoz</span>
              </span>
            </Link>
            <Link to="/dashboard" className="logo logo-light">
              <span className="logo-sm">
                <img src={logo} alt="chickoz_logo" height="40" />
              </span>
              <span className="logo-lg">
                <img src={logo} alt="chickoz_logo" height="40" /> <span className="logo-txt">Chickoz</span>
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-sm px-3 font-size-16 header-item"
            id="vertical-menu-btn"
            onClick={toggleSidebar}
          >
            <i className="fa fa-fw fa-bars"></i>
          </button>

          {/* App Search */}
          <form className="app-search d-none d-lg-block">
            <div className="position-relative">
              <input type="text" className="form-control" placeholder="Search..." />
              <button className="btn btn-primary" type="button">
                <i className="bx bx-search-alt align-middle"></i>
              </button>
            </div>
          </form>
        </div>

        <div className="d-flex">
          <div className="dropdown d-inline-block d-lg-none ms-2">
            <button
              type="button"
              className="btn header-item"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Feather.Search className="icon-lg" />
            </button>
            <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 ${isSearchOpen ? 'show' : ''}`}>
              <form className="p-3">
                <div className="form-group m-0">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search ..." />
                    <button className="btn btn-primary" type="submit"><i className="mdi mdi-magnify"></i></button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Live Date & Time */}
          {/* Live Date & Time */}
          <div className="d-none d-lg-flex align-items-center me-3 gap-3">

            {/* Time */}
            <div className="d-flex align-items-center gap-1">
              <Feather.Clock size={16} className="text-primary" />

              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: layoutMode === 'light' ? '#2d3748' : '#e2e8f0'
                }}
              >
                {formattedTime}
              </span>
            </div>

            {/* Date */}
            <div className="d-flex align-items-center gap-1">
              <Feather.Calendar size={16} className="text-primary" />

              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: layoutMode === 'light' ? '#718096' : '#94a3b8'
                }}
              >
                {formattedDate}
              </span>
            </div>

          </div>

          {/* Theme Toggle Button */}
          <div className="dropdown d-none d-sm-inline-block">
            <button
              type="button"
              className="btn header-item"
              onClick={toggleTheme}
            >
              {layoutMode === 'light' ? (
                <Feather.Moon className="icon-lg" />
              ) : (
                <Feather.Sun className="icon-lg" />
              )}
            </button>
          </div>

          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon position-relative"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Feather.Bell className="icon-lg" />
              <span className="badge bg-danger rounded-pill">5</span>
            </button>
            <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 ${isNotificationOpen ? 'show' : ''}`} style={{ right: 0 }}>
              <div className="p-3">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="m-0"> Notifications </h6>
                  </div>
                </div>
              </div>
              <div style={{ maxHeight: '230px' }} className="simplebar-scrollable-y">
                {/* Notification Items */}
                <a href="#!" className="text-reset notification-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <img src="/assets/images/users/avatar-3.jpg" className="rounded-circle avatar-sm" alt="user-pic" />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">James Lemire</h6>
                      <div className="font-size-13 text-muted">
                        <p className="mb-1">It will seem like simplified English.</p>
                        <p className="mb-0"><i className="mdi mdi-clock-outline"></i> <span>1 hour ago</span></p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Settings / Right Sidebar Toggle */}
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon right-bar-toggle"
              onClick={toggleRightSidebar}
            >
              <Feather.Settings className="icon-lg" />
            </button>
          </div>

          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item bg-light-subtle border-start border-end"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img className="rounded-circle header-profile-user" src={user?.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.firstName || "User"
              ) + "&background=0D8ABC&color=fff"} alt="Header Avatar" />
              <span className="d-none d-xl-inline-block ms-1 fw-medium">{user?.firstName || "User"}</span>
              <small className="d-block text-muted">{user?.role}</small>
              <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
            </button>
            <div className={`dropdown-menu dropdown-menu-end ${isProfileOpen ? 'show' : ''}`} style={{ right: 0 }}>
              <Link className="dropdown-item" to="/apps-contacts-profile"><i className="mdi mdi-face-man font-size-16 align-middle me-1"></i> Profile</Link>
              <div className="dropdown-divider"></div>
              <button
                type="button"
                className="dropdown-item"
                onClick={handleLogOut}
              >
                <i className="mdi mdi-logout font-size-16 align-middle me-1"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
