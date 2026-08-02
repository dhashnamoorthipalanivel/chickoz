import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import MetisMenu from 'metismenujs';
import * as Feather from 'react-feather';
import logoIcon from '/assets/images/logo-1.png';
import logoFull from '/assets/images/logo-2.png';

const Sidebar = ({ toggleSidebar }) => {
  const menuRef = useRef(null);
  const metisMenuRef = useRef(null);
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const isAdmin = role === "admin" || role === "super_admin";
  const isFranchise = role === "user" || role === "franchise";

  useEffect(() => {
    if (!metisMenuRef.current) {
      metisMenuRef.current = new MetisMenu("#side-menu");
    }

    const pathName = location.pathname;

    menuRef.current?.querySelectorAll(".mm-active").forEach(el => el.classList.remove("mm-active"));
    menuRef.current?.querySelectorAll(".mm-show").forEach(el => el.classList.remove("mm-show"));
    menuRef.current?.querySelectorAll(".active").forEach(el => el.classList.remove("active"));

    // Prefix match: find the longest href that is a prefix of the current path
    const allLinks = menuRef.current?.querySelectorAll("a[href]") || [];
    let activeLink = null;
    let bestLen = 0;
    allLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href !== "#" && href !== "/" && pathName.startsWith(href) && href.length > bestLen) {
        activeLink = link;
        bestLen = href.length;
      }
    });

    if (activeLink) {
      activeLink.classList.add("active");
      let parent = activeLink.parentElement;
      while (parent) {
        if (parent.tagName === "LI") parent.classList.add("mm-active");
        if (parent.tagName === "UL") parent.classList.add("mm-show");
        parent = parent.parentElement;
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (metisMenuRef.current) {
        metisMenuRef.current.dispose();
        metisMenuRef.current = null;
      }
    };
  }, []);

  const avatarUrl = user?.profileImage
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || "U")}&background=D91E18&color=fff&size=64`;

  return (
    <div className="vertical-menu ckz-sidebar">
      <SimpleBar className="h-100">

        {/* ── Brand / Logo ── */}
        <div className="ckz-sidebar-brand-row">

          {/* Full sidebar: white card with wide logo-2 */}
          <div className="ckz-brand-full">
            <Link to="/dashboard" className="ckz-brand-card">
              <img src={logoFull} alt="Chickoz" className="ckz-brand-img-full" />
            </Link>
            <button type="button" className="ckz-sidebar-toggle" onClick={toggleSidebar} title="Collapse sidebar">
              <i className="fa fa-bars" style={{ fontSize: 13 }} />
            </button>
          </div>

          {/* Mini sidebar: icon-only logo-1, larger */}
          <div className="ckz-brand-mini">
            <Link to="/dashboard" className="ckz-brand-icon-wrap">
              <img src={logoIcon} alt="Chickoz" className="ckz-brand-img-mini" />
            </Link>
          </div>

        </div>

        {/* ── Navigation ── */}
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu" ref={menuRef}>

            <li className="menu-title">Main</li>

            {isAdmin ? (
              <>
                <li>
                  <Link to="/dashboard">
                    <Feather.Home size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/franchise-dashboard">
                    <Feather.Grid size={18} />
                    <span>Franchise Dashboard</span>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/dashboard">
                  <Feather.Home size={18} />
                  <span>Dashboard</span>
                </Link>
              </li>
            )}

            {/* Reports */}
            {isAdmin && (
              <li>
                <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                  <Feather.FileText size={18} />
                  <span>Reports</span>
                </a>
                <ul className="sub-menu" aria-expanded="false">
                  <li><Link to="/reports-admin">Admin Report</Link></li>
                  <li><Link to="/reports-franchise">Franchise Report</Link></li>
                </ul>
              </li>
            )}
            {isFranchise && (
              <li>
                <Link to="/reports-franchise">
                  <Feather.FileText size={18} />
                  <span>Reports</span>
                </Link>
              </li>
            )}

            {isAdmin && (
              <li>
                <Link to="/subscription-management">
                  <Feather.Key size={18} />
                  <span>Subscriptions</span>
                </Link>
              </li>
            )}

            {isAdmin && (
              <li>
                <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                  <Feather.Users size={18} />
                  <span>CRM</span>
                </a>
                <ul className="sub-menu" aria-expanded="false">
                  <li><Link to="/crm-enquiry">Enquiry</Link></li>
                  <li><Link to="/crm-lead">Lead</Link></li>
                </ul>
              </li>
            )}

            <li className="menu-title">Operations</li>

            {isAdmin && (
              <li>
                <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                  <Feather.Package size={18} />
                  <span>Manufacture</span>
                </a>
                <ul className="sub-menu" aria-expanded="false">
                  <li><Link to="/manufacture-kishok">Kishok</Link></li>
                  <li>
                    <a href="#" onClick={e => e.preventDefault()} className="has-arrow">Masala</a>
                    <ul className="sub-menu" aria-expanded="false">
                      <li><Link to="/manufacture-masala-franchise-request">Franchise Requests</Link></li>
                      <li><Link to="/manufacture-masala-admin-process">Admin Processing</Link></li>
                    </ul>
                  </li>
                </ul>
              </li>
            )}

            {isFranchise && (
              <li>
                <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                  <Feather.Package size={18} />
                  <span>Masala</span>
                </a>
                <ul className="sub-menu" aria-expanded="false">
                  <li><Link to="/manufacture-masala-franchise-request">Franchise Request</Link></li>
                </ul>
              </li>
            )}

            <li>
              <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                <Feather.ShoppingBag size={18} />
                <span>Store / POS</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/store-management-billing">Billing</Link></li>
                <li><Link to="/store-management-orders">Orders</Link></li>
              </ul>
            </li>

            {isAdmin && (
              <li className="menu-title">Configuration</li>
            )}

            {isAdmin && (
              <li>
                <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                  <Feather.Layers size={18} />
                  <span>Masters</span>
                </a>
                <ul className="sub-menu" aria-expanded="false">
                  <li><Link to="/master-franchise">Franchise</Link></li>
                  <li><Link to="/master-package">Package</Link></li>
                  <li><Link to="/master-tax">Tax</Link></li>
                  <li><Link to="/master-vendor">Vendor</Link></li>
                  <li>
                    <a href="#" onClick={e => e.preventDefault()} className="has-arrow">Menu</a>
                    <ul className="sub-menu" aria-expanded="false">
                      <li><Link to="/master-menu-item">Menu Item</Link></li>
                      <li><Link to="/master-franchise-menu-visibility">Franchise Menu Visibility</Link></li>
                      <li><Link to="/master-franchise-menu-availability">Franchise Menu Availability</Link></li>
                    </ul>
                  </li>
                  <li><Link to="/master-masala-items">Masala Items</Link></li>
                  <li><Link to="/master-payment-mode">Payment Mode</Link></li>
                  <li><Link to="/master-order-type">Order Type</Link></li>
                  <li><Link to="/master-lead-source">Lead Source</Link></li>
                  <li><Link to="/master-document">Document</Link></li>
                  <li><Link to="/master-material">Material</Link></li>
                </ul>
              </li>
            )}

            {isFranchise && (
              <li>
                <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                  <Feather.Layers size={18} />
                  <span>Masters</span>
                </a>
                <ul className="sub-menu" aria-expanded="false">
                  <li><Link to="/master-franchise-menu-availability">Franchise Menu Availability</Link></li>
                </ul>
              </li>
            )}

          </ul>
        </div>

        {/* ── User Profile ── */}
        <div className="ckz-sidebar-user">
          <img src={avatarUrl} alt="avatar" className="ckz-user-avatar" />
          <div className="ckz-user-info">
            <div className="ckz-user-name">{user?.firstName || "User"}</div>
            <div className="ckz-user-role">{user?.role || "Admin"}</div>
          </div>
          <Feather.ChevronRight size={15} className="ckz-user-arrow" />
        </div>

      </SimpleBar>
    </div>
  );
};

export default Sidebar;
