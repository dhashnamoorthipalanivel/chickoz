import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Feather from 'react-feather';
import { useTheme } from '../../context/ThemeContext';
import { logoutUser } from '../../api/authAPI';
import { toast } from 'react-toastify';
import { useAuthStore, useNotificationStore, useFranchiseStore } from '../../store/store';

/* ── Premium Profile Dropdown ─────────────────────────────────── */
const ProfileDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

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
        background: danger ? 'rgba(217,30,24,0.1)' : '#f3f3f6',
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
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={avatarUrl}
            alt="avatar"
            style={{
              width: 34, height: 34, borderRadius: '50%', objectFit: 'cover',
              border: '2px solid #D91E18', display: 'block',
            }}
          />
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 9, height: 9, borderRadius: '50%',
            background: '#10b981', border: '1.5px solid #fff',
          }} />
        </div>
        <div className="d-none d-xl-block" style={{ textAlign: 'left', lineHeight: 1.25 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', whiteSpace: 'nowrap' }}>
            {user?.firstName || 'User'} {user?.lastName || ''}
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize', fontWeight: 500 }}>
            {user?.role || 'Admin'}
          </div>
        </div>
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

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: 250, background: '#fff', borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)',
          border: '1px solid #f1f1f1', zIndex: 999,
          animation: 'ckzDropIn 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          overflow: 'hidden',
        }}>
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

          <div style={{ padding: '6px 8px' }}>
            {menuItem(<Feather.User size={15} />, 'My Profile', () => navigate('/my-profile'))}
            {menuItem(<Feather.Settings size={15} />, 'Account Settings', () => { })}
          </div>

          <div style={{ height: 1, background: '#f3f4f6', margin: '0 8px' }} />

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
  if (!dateStr) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${Math.max(1, diff)}s ago`;
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

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const { clearProfile } = useAuthStore();
  const { notifications = [], unreadCount = 0, fetchNotifications, sendNotification, markAsRead, markAllAsRead } = useNotificationStore();
  const { franchises = [], fetchFranchises } = useFranchiseStore();

  const [showSendModal, setShowSendModal] = useState(false);
  const [targetFranchiseId, setTargetFranchiseId] = useState("ALL");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    if (isAdmin && fetchFranchises) fetchFranchises();
  }, [isAdmin]);

  const handleSendAdminMessage = async (e) => {
    e.preventDefault();
    if (!msgTitle.trim() || !msgBody.trim()) {
      toast.error("Please enter both title and message");
      return;
    }
    try {
      setSendingMsg(true);
      const res = await sendNotification({
        franchiseId: targetFranchiseId,
        title: msgTitle,
        message: msgBody
      });
      toast.success(res?.message || "Message sent successfully!");
      setMsgTitle("");
      setMsgBody("");
      setShowSendModal(false);
      if (fetchNotifications) await fetchNotifications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSendingMsg(false);
    }
  };

  useEffect(() => {
    if (!user || !fetchNotifications) return;
    fetchNotifications();
    const id = setInterval(fetchNotifications, 10000);
    return () => clearInterval(id);
  }, [user?.id, user?.email]);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotificationOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());

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
      if (token) await logoutUser(token);
    } catch (_) {
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (clearProfile) clearProfile();
      toast.success("Logged out successfully");
      window.location.href = "/auth-login";
    }
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const safeFranchises = Array.isArray(franchises) ? franchises : [];

  return (
    <header id="page-topbar" style={{ zIndex: 99999 }}>
      <div className="navbar-header">
        <div className="d-flex align-items-center gap-3">
          <div className="navbar-brand-box">
            <Link to="/dashboard" className="logo logo-dark">
              <span className="logo-sm">
                <img src="/assets/images/logo.png" alt="" height={40} />
              </span>
              <span className="logo-lg" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/assets/images/logo.png" alt="" height={55} />
              </span>
            </Link>

            <Link to="/dashboard" className="logo logo-light">
              <span className="logo-sm">
                <img src="/assets/images/logo.png" alt="" height={40} />
              </span>
              <span className="logo-lg" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/assets/images/logo.png" alt="" height={55} />
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
            id="vertical-menu-btn"
            onClick={toggleSidebar}
          >
            <i className="fa fa-fw fa-bars" />
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Search bar */}
          <div className="dropdown d-inline-block d-lg-none">
            <button
              type="button"
              className="btn header-item noti-icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Feather.Search className="icon-lg" />
            </button>
            {isSearchOpen && (
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show">
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                      />
                      <button className="btn btn-primary" type="submit">
                        <i className="mdi mdi-magnify" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Time and Date display */}
          <div
            className="d-none d-md-flex align-items-center text-muted px-3 py-1 bg-light rounded-pill border"
            style={{ fontSize: '13px', fontWeight: '500' }}
          >
            <Feather.Clock className="me-2 text-primary icon-sm" />
            <span>{formattedTime}</span>
            <span className="mx-2 text-muted">|</span>
            <Feather.Calendar className="me-2 text-primary icon-sm" />
            <span>{formattedDate}</span>
          </div>

          {/* Theme toggle */}
          <div className="dropdown d-none d-sm-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon"
              onClick={toggleTheme}
            >
              {layoutMode === 'light' ? (
                <Feather.Moon className="icon-lg" />
              ) : (
                <Feather.Sun className="icon-lg" />
              )}
            </button>
          </div>

          {/* Notifications Dropdown */}
          {user && (
            <div ref={notifRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <button
                type="button"
                className="btn header-item noti-icon position-relative"
                onClick={() => {
                  setIsNotificationOpen(o => {
                    const next = !o;
                    if (next && fetchNotifications) fetchNotifications();
                    return next;
                  });
                }}
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
                  border: '1px solid #f1f1f1', zIndex: 999999,
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowSendModal(s => {
                              const next = !s;
                              if (next && fetchFranchises) fetchFranchises();
                              return next;
                            });
                          }}
                          style={{
                            border: 'none', background: showSendModal ? '#fee2e2' : '#eff6ff',
                            color: showSendModal ? '#dc2626' : '#2563eb',
                            fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '3px 9px',
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4
                          }}
                        >
                          <i className={`bx ${showSendModal ? 'bx-x' : 'bx-paper-plane'}`} />
                          {showSendModal ? 'Close' : '+ Send'}
                        </button>
                      )}
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
                  </div>

                  {/* Admin Send Message Form */}
                  {isAdmin && showSendModal && (
                    <form onSubmit={handleSendAdminMessage} style={{ background: '#f8fafc', padding: 14, borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#1e293b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="bx bx-paper-plane" style={{ color: '#D91E18' }} /> Send Message to Franchise
                      </div>
                      <div className="mb-2">
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4, display: 'block' }}>Target Franchise</label>
                        <select
                          className="form-select form-select-sm"
                          value={targetFranchiseId}
                          onChange={(e) => setTargetFranchiseId(e.target.value)}
                          style={{ fontSize: 12, borderRadius: 8, borderColor: '#cbd5e1' }}
                        >
                          <option value="ALL">📢 All Franchises (Broadcast)</option>
                          {safeFranchises.filter(f => !f.isDeleted).map((f) => (
                            <option key={f._id} value={f._id}>
                              🏢 {f.franchiseName || f.ownerName || f.email || 'Franchise'} ({f.franchiseId || 'FR'})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Notification Title (e.g. Important Announcement)"
                          value={msgTitle}
                          onChange={(e) => setMsgTitle(e.target.value)}
                          required
                          style={{ fontSize: 12, borderRadius: 8 }}
                        />
                      </div>
                      <div className="mb-2">
                        <textarea
                          className="form-control form-control-sm"
                          rows="2"
                          placeholder="Enter message for the franchise..."
                          value={msgBody}
                          onChange={(e) => setMsgBody(e.target.value)}
                          required
                          style={{ fontSize: 12, borderRadius: 8 }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={sendingMsg}
                        className="btn btn-sm btn-danger w-100"
                        style={{ fontSize: 12, fontWeight: 700, borderRadius: 8, background: 'linear-gradient(135deg,#D91E18,#F97316)', border: 'none' }}
                      >
                        {sendingMsg ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  )}

                  {/* List */}
                  <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                    {safeNotifications.length === 0 ? (
                      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                        <i className="bx bx-bell-off" style={{ fontSize: 32, color: '#d1d5db', display: 'block', marginBottom: 8 }} />
                        <span style={{ fontSize: 13, color: '#9ca3af' }}>No notifications yet</span>
                      </div>
                    ) : safeNotifications.map((n) => {
                      const isAdminMsg = n.type === 'ADMIN_MESSAGE';
                      const isMasala = n.type === 'NEW_MASALA_REQUEST';
                      const isStatusUpdate = n.type === 'MASALA_REQUEST_STATUS';
                      const isFollowUp = n.type === 'FOLLOW_UP_REMINDER';

                      let iconClass = 'bx-bell';
                      let iconBg = 'rgba(217,30,24,0.1)';
                      let iconColor = '#D91E18';

                      if (isAdminMsg) {
                        iconClass = 'bx-paper-plane';
                        iconBg = 'rgba(124,58,237,0.1)';
                        iconColor = '#7c3aed';
                      } else if (isFollowUp) {
                        iconClass = 'bx-calendar-event';
                        iconBg = 'rgba(234,179,8,0.1)'; // Yellow
                        iconColor = '#eab308';
                      } else if (isMasala) {
                        iconClass = 'bx-bowl-hot';
                        iconBg = 'rgba(249,115,22,0.1)';
                        iconColor = '#F97316';
                      } else if (isStatusUpdate) {
                        const status = n.data?.status || '';
                        if (status === 'APPROVED' || status === 'ACCEPTED') {
                          iconClass = 'bx-check-circle';
                          iconBg = 'rgba(22,163,74,0.1)';
                          iconColor = '#16a34a';
                        } else if (status === 'DISPATCHED') {
                          iconClass = 'bx-truck';
                          iconBg = 'rgba(37,99,235,0.1)';
                          iconColor = '#2563eb';
                        } else if (status === 'DELIVERED') {
                          iconClass = 'bx-package';
                          iconBg = 'rgba(5,150,105,0.1)';
                          iconColor = '#059669';
                        } else if (status === 'REJECTED' || status === 'CANCELLED') {
                          iconClass = 'bx-x-circle';
                          iconBg = 'rgba(220,38,38,0.1)';
                          iconColor = '#dc2626';
                        }
                      }

                      return (
                        <div
                          key={n._id}
                          onClick={async () => {
                            if (!n.isRead && markAsRead) await markAsRead(n._id);
                            setIsNotificationOpen(false);
                            
                            if (isFollowUp && n.data?.url) {
                              navigate(n.data.url);
                              return;
                            }

                            const targetReqId = n.data?.requestId;
                            if (isAdmin) {
                              if (targetReqId) {
                                navigate(`/manufacture-masala-admin-process/view/${targetReqId}`);
                              } else if (isMasala || isStatusUpdate) {
                                navigate('/manufacture-masala-admin-process');
                              } else {
                                navigate('/master-masala-items');
                              }
                            } else {
                              if (targetReqId) {
                                navigate(`/manufacture-masala-franchise-request/view/${targetReqId}`);
                              } else if (isMasala || isStatusUpdate) {
                                navigate('/manufacture-masala-franchise-request');
                              } else {
                                navigate('/manufacture-masala-franchise-request');
                              }
                            }
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
                            background: iconBg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <i
                              className={`bx ${iconClass}`}
                              style={{ fontSize: 18, color: iconColor }}
                            />
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {isAdminMsg && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', background: 'rgba(124,58,237,0.1)', padding: '1px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 4 }}>
                                Message from {n.data?.sender || 'Admin'}
                              </span>
                            )}
                            {isStatusUpdate && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: iconColor, background: iconBg, padding: '1px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 4 }}>
                                Status Update ({n.data?.status || 'Update'})
                              </span>
                            )}
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
