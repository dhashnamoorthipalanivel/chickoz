import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Feather from 'react-feather';
import { useTheme } from '../../context/ThemeContext';
import { logoutUser } from '../../api/authAPI'
import { toast } from 'react-toastify';
import { useAuthStore, useNotificationStore } from '../../store/store';

/* ── Premium Profile Dropdown ─────────────────────────────────── */
const ProfileDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const avatarUrl = user?.profileImage
    || `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.firstName || 'U') + ' ' + (user?.lastName || ''))}&background=D91E18&color=fff&size=128&bold=true`;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menuItem = (icon, label, onClick, danger = false) => (
    <button
      type="button"
      onClick={() => { setOpen(false); onClick && onClick(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '9px 16px', border: 'none', background: 'transparent',
        cursor: 'pointer', borderRadius: 8, transition: 'all 0.14s',
        color: danger ? '#D91E18' : '#374151', fontSize: 13.5, fontWeight: 500,
        textAlign: 'left',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? 'rgba(217,30,24,0.06)' : '#f5f5f5'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: danger ? 'rgba(217,30,24,0.1)' : '#f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? '#D91E18' : '#6b7280',
      }}>
        {icon}
      </span>
      {label}
    </button>
  );

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '6px 12px 6px 6px',
          border: '1.5px solid #eef0f3',
          borderRadius: 40, background: open ? '#f8f8f8' : '#fff',
          cursor: 'pointer', transition: 'all 0.15s',
          boxShadow: open ? '0 0 0 3px rgba(217,30,24,0.08)' : 'none',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.borderColor = '#D91E18'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = '#eef0f3'; }}
      >
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={avatarUrl}
            alt="avatar"
            style={{
              width: 34, height: 34, borderRadius: '50%', objectFit: 'cover',
              border: '2px solid #D91E18', display: 'block',
            }}
          />
          {/* Online dot */}
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 9, height: 9, borderRadius: '50%',
            background: '#10b981', border: '1.5px solid #fff',
          }} />
        </div>
        {/* Name + role */}
        <div className="d-none d-xl-block" style={{ textAlign: 'left', lineHeight: 1.25 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', whiteSpace: 'nowrap' }}>
            {user?.firstName || 'User'} {user?.lastName || ''}
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize', fontWeight: 500 }}>
            {user?.role || 'Admin'}
          </div>
        </div>
        {/* Chevron */}
        <Feather.ChevronDown
          size={14}
          className="d-none d-xl-block"
          style={{
            color: '#9ca3af', flexShrink: 0,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: 250, background: '#fff', borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)',
          border: '1px solid #f1f1f1', zIndex: 9999,
          animation: 'ckzDropIn 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          overflow: 'hidden',
        }}>
          {/* Header card */}
          <div style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #2d2d2d 100%)',
            padding: '18px 16px 16px', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={avatarUrl}
                alt="avatar"
                style={{
                  width: 48, height: 48, borderRadius: '50%', objectFit: 'cover',
                  border: '2.5px solid #D91E18',
                }}
              />
              <span style={{
                position: 'absolute', bottom: 1, right: 1,
                width: 11, height: 11, borderRadius: '50%',
                background: '#10b981', border: '2px solid #1A1A1A',
              }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.firstName || 'User'} {user?.lastName || ''}
              </div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize', marginTop: 2 }}>
                {user?.role || 'Admin'}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5,
                background: 'rgba(16,185,129,0.18)', borderRadius: 20,
                padding: '2px 8px',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                <span style={{ fontSize: 10.5, color: '#10b981', fontWeight: 600 }}>Online</span>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: '6px 8px' }}>
            {menuItem(<Feather.User size={15} />, 'My Profile', () => {})}
            {menuItem(<Feather.Settings size={15} />, 'Account Settings', () => {})}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#f3f4f6', margin: '0 8px' }} />

          {/* Logout */}
          <div style={{ padding: '6px 8px 8px' }}>
            {menuItem(<Feather.LogOut size={15} />, 'Sign Out', onLogout, true)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Relative time helper ─────────────────────────────────────── */
const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Header = ({ toggleSidebar }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { layoutMode, toggleTheme, toggleRightSidebar } = useTheme();
  const notifRef = useRef(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const { clearProfile } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  // Fetch notifications for admin + poll every 30s
  useEffect(() => {
    if (!isAdmin) return;
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, [isAdmin]);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotificationOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
        navigate("/auth-login", { replace: true });
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

          {/* Live Date & Time pill */}
          <div className="d-none d-lg-flex align-items-center me-2">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "6px 14px", borderRadius: 20,
              border: "1.5px solid rgba(217,30,24,0.25)",
              background: "rgba(217,30,24,0.04)",
            }}>
              <Feather.Clock size={14} style={{ color: "#D91E18", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", letterSpacing: 0.1, whiteSpace: "nowrap" }}>
                {formattedDate},&nbsp;{formattedTime}
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

          {isAdmin && (
            <div ref={notifRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <button
                type="button"
                className="btn header-item noti-icon position-relative"
                onClick={() => setIsNotificationOpen(o => !o)}
              >
                <Feather.Bell className="icon-lg" />
                {unreadCount > 0 && (
                  <span className="badge bg-danger rounded-pill">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </button>

              {isNotificationOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 360, background: '#fff', borderRadius: 14,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07)',
                  border: '1px solid #f1f1f1', zIndex: 9999,
                  animation: 'ckzDropIn 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                  overflow: 'hidden',
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px 12px',
                    borderBottom: '1px solid #f3f4f6',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: 'linear-gradient(135deg,#D91E18 0%,#F97316 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className="bx bx-bell" style={{ color: '#fff', fontSize: 15 }} />
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span style={{
                          background: '#D91E18', color: '#fff', fontSize: 10, fontWeight: 700,
                          borderRadius: 20, padding: '1px 6px', lineHeight: '16px',
                        }}>{unreadCount}</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        style={{
                          border: 'none', background: 'transparent', cursor: 'pointer',
                          fontSize: 11.5, fontWeight: 600, color: '#D91E18', padding: '2px 6px',
                        }}
                      >Mark all read</button>
                    )}
                  </div>

                  {/* List */}
                  <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                        <i className="bx bx-bell-off" style={{ fontSize: 32, color: '#d1d5db', display: 'block', marginBottom: 8 }} />
                        <span style={{ fontSize: 13, color: '#9ca3af' }}>No notifications yet</span>
                      </div>
                    ) : notifications.map((n) => {
                      const isMasala = n.type === 'NEW_MASALA_REQUEST';
                      return (
                        <div
                          key={n._id}
                          onClick={async () => {
                            if (!n.isRead) await markAsRead(n._id);
                            setIsNotificationOpen(false);
                            if (isMasala) navigate('/manufacture-masala-admin-process');
                            else navigate('/manufacture-masala/masala-items');
                          }}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                            padding: '12px 16px', cursor: 'pointer',
                            background: n.isRead ? 'transparent' : 'rgba(217,30,24,0.03)',
                            borderBottom: '1px solid #f9fafb',
                            transition: 'background 0.13s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f8f9fa'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(217,30,24,0.03)'; }}
                        >
                          {/* Icon */}
                          <div style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: isMasala ? 'rgba(249,115,22,0.1)' : 'rgba(217,30,24,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <i
                              className={`bx ${isMasala ? 'bx-bowl-hot' : 'bx-error'}`}
                              style={{ fontSize: 18, color: isMasala ? '#F97316' : '#D91E18' }}
                            />
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: n.isRead ? 500 : 700, fontSize: 13, color: '#1A1A1A', marginBottom: 2 }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.45, marginBottom: 4 }}>
                              {n.message}
                            </div>
                            <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <i className="bx bx-time-five" style={{ fontSize: 12 }} />
                              {timeAgo(n.createdAt)}
                            </div>
                          </div>
                          {/* Unread dot */}
                          {!n.isRead && (
                            <div style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: '#D91E18', flexShrink: 0, marginTop: 4,
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

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

          {/* ── Premium Profile Dropdown ── */}
          <ProfileDropdown user={user} onLogout={handleLogOut} />
        </div>
      </div>
    </header>
  );
};

export default Header;
