import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Feather from 'react-feather';
import SimpleBar from 'simplebar-react';
import MetisMenu from 'metismenujs';

const Sidebar = ({ toggleSidebar }) => {
  const menuRef = useRef(null);
  const metisMenuRef = useRef(null);
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const permissions = user.permissions || [];

  // RBAC Helper
  const hasPerm = (perm) => permissions.includes('all') || permissions.includes(perm);

  const role = user?.role;
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === "admin" || role === "super_admin";
  const isFranchise = role === "franchise";

  useEffect(() => {
    if (!metisMenuRef.current) {
      metisMenuRef.current = new MetisMenu("#side-menu");
    }

    const pathName = location.pathname;

    // Clear all existing menu states
    menuRef.current?.querySelectorAll(".mm-active").forEach(el => el.classList.remove("mm-active"));
    menuRef.current?.querySelectorAll(".active").forEach(el => el.classList.remove("active"));
    menuRef.current?.querySelectorAll(".mm-show").forEach(el => el.classList.remove("mm-show"));

    let matchingMenuItem = null;
    const links = menuRef.current?.getElementsByTagName("a") || [];

    for (let i = 0; i < links.length; i++) {
      const hrefAttr = links[i].getAttribute("href");
      if (hrefAttr === "#") continue;

      if (pathName === links[i].pathname) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");
      const parent = matchingMenuItem.parentElement;

      if (parent) {
        parent.classList.add("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.add("mm-show");
          const parent3 = parent2.parentElement;

          if (parent3) {
            parent3.classList.add("mm-active");
            parent3.childNodes[0].classList.add("mm-active");
            const parent4 = parent3.parentElement;

            if (parent4) {
              parent4.classList.add("mm-show");
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.add("mm-active");
                parent5.childNodes[0].classList.add("mm-active");
              }
            }
          }
        }
      }
    }
  }, [location.pathname]);

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="ckz-sidebar-brand-row">
          <div className="ckz-brand-full">
            <Link to="/dashboard" className="ckz-brand-card">
              <img src="/assets/images/logo-2.png" alt="Chickoz" className="ckz-brand-img-full" />
            </Link>
          </div>
          <div className="ckz-brand-mini">
            <Link to="/dashboard" className="ckz-brand-icon-wrap">
              <img src="/assets/images/logo-1.png" alt="Chickoz" className="ckz-brand-img-mini" />
            </Link>
          </div>
        </div>
        <div data-simplebar className="h-100">
          <SimpleBar style={{ maxHeight: '100%' }}>
            <div id="sidebar-menu" ref={menuRef}>
              <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title mt-2">Main</li>

                {hasPerm('dashboard') && (
                  <>
                    <li>
                      <Link to="/dashboard">
                        <Feather.Home size={18} />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    {isSuperAdmin && (
                      <li>
                        <Link to="/franchise-dashboard">
                          <Feather.Grid size={18} />
                          <span>Franchise Dashboard</span>
                        </Link>
                      </li>
                    )}
                  </>
                )}

                {hasPerm('reports') && (
                  <li>
                    <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                      <Feather.FileText size={18} />
                      <span>Reports</span>
                    </a>
                    <ul className="sub-menu" aria-expanded="false">
                      {isSuperAdmin && hasPerm('reports-admin') && <li><Link to="/reports-admin">Admin Report</Link></li>}
                      {hasPerm('reports-franchise') && <li><Link to="/reports-franchise">Franchise Report</Link></li>}
                    </ul>
                  </li>
                )}

                {isSuperAdmin && (
                  <li>
                    <Link to="/subscription-management">
                      <Feather.Key size={18} />
                      <span>Subscriptions</span>
                    </Link>
                  </li>
                )}

                {hasPerm('crm') && (
                  <li>
                    <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                      <Feather.Users size={18} />
                      <span>CRM</span>
                    </a>
                    <ul className="sub-menu" aria-expanded="false">
                      <li><Link to="/crm/dashboard">Dashboard</Link></li>
                      <li><Link to="/crm/social-leads">Social Leads</Link></li>
                      {hasPerm('crm-enquiry') && <li><Link to="/crm-enquiry">Enquiry</Link></li>}
                      {hasPerm('crm-lead') && <li><Link to="/crm-lead">Legacy Leads</Link></li>}
                      {/* <li><Link to="/crm/kanban">Pipeline Kanban</Link></li> */}
                      {/* <li><Link to="/crm/automations">Automations</Link></li> */}
                      <li><Link to="/crm/integrations">Integrations</Link></li>
                    </ul>
                  </li>
                )}

                <li className="menu-title">Operations</li>

                {hasPerm('manufacture') && (
                  <li>
                    <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                      <Feather.Package size={18} />
                      <span>Manufacture</span>
                    </a>
                    <ul className="sub-menu" aria-expanded="false">
                      {isAdmin && hasPerm('manufacture-kishok') && <li><Link to="/manufacture-kishok">Kishok</Link></li>}
                      <li>
                        <a href="#" onClick={e => e.preventDefault()} className="has-arrow">Masala</a>
                        <ul className="sub-menu" aria-expanded="false">
                          {hasPerm('manufacture-masala-req') && <li><Link to="/manufacture-masala-franchise-request">Franchise Requests</Link></li>}
                          {isAdmin && hasPerm('manufacture-masala-admin') && <li><Link to="/manufacture-masala-admin-process">Admin Processing</Link></li>}
                        </ul>
                      </li>
                    </ul>
                  </li>
                )}

                {hasPerm('store') && (
                  <li>
                    <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                      <Feather.ShoppingBag size={18} />
                      <span>Store / POS</span>
                    </a>
                    <ul className="sub-menu" aria-expanded="false">
                      {hasPerm('store-billing') && <li><Link to="/store-management-billing">Billing</Link></li>}
                      {hasPerm('store-orders') && <li><Link to="/store-management-orders">Orders</Link></li>}
                    </ul>
                  </li>
                )}

                {hasPerm('masters') && (
                  <>
                    <li className="menu-title">Configuration</li>
                    <li>
                      <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                        <Feather.Layers size={18} />
                        <span>Masters</span>
                      </a>
                      <ul className="sub-menu" aria-expanded="false">
                        {isAdmin && (
                          <>
                            {hasPerm('master-franchise') && <li><Link to="/master-franchise">Franchise</Link></li>}
                            {hasPerm('master-package') && <li><Link to="/master-package">Package</Link></li>}
                            {hasPerm('master-tax') && <li><Link to="/master-tax">Tax</Link></li>}
                            {hasPerm('master-vendor') && <li><Link to="/master-vendor">Vendor</Link></li>}
                            {hasPerm('master-menu') && (
                              <li>
                                <a href="#" onClick={e => e.preventDefault()} className="has-arrow">Menu</a>
                                <ul className="sub-menu" aria-expanded="false">
                                  <li><Link to="/master-menu-item">Menu Item</Link></li>
                                  <li><Link to="/master-franchise-menu-visibility">Franchise Menu Visibility</Link></li>
                                </ul>
                              </li>
                            )}
                            {hasPerm('master-masala-items') && <li><Link to="/master-masala-items">Masala Items</Link></li>}
                            {hasPerm('master-payment') && <li><Link to="/master-payment-mode">Payment Mode</Link></li>}
                            {hasPerm('master-order') && <li><Link to="/master-order-type">Order Type</Link></li>}
                            {hasPerm('master-lead') && <li><Link to="/master-lead-source">Lead Source</Link></li>}
                            {hasPerm('master-document') && <li><Link to="/master-document">Document</Link></li>}
                            {hasPerm('master-material') && <li><Link to="/master-material">Material</Link></li>}
                          </>
                        )}
                        <li><Link to="/master-franchise-menu-availability">Franchise Menu Availability</Link></li>
                        {hasPerm('master-customer') && <li><Link to="/master-customer">Customer</Link></li>}
                        {hasPerm('master-table') && <li><Link to="/master-table">Table Master</Link></li>}
                      </ul>
                    </li>
                  </>
                )}

                {hasPerm('users') && (
                  <>
                    <li className="menu-title">Security</li>
                    <li>
                      <a href="#" onClick={e => e.preventDefault()} className="has-arrow">
                        <Feather.Shield size={18} />
                        <span>User Management</span>
                      </a>
                      <ul className="sub-menu" aria-expanded="false">
                        {hasPerm('users-list') && <li><Link to="/users">Users</Link></li>}
                        {hasPerm('roles-list') && <li><Link to="/roles">Roles</Link></li>}
                        {hasPerm('role-assignments') && <li><Link to="/role-assignments">Assignments</Link></li>}
                      </ul>
                    </li>
                  </>
                )}

              </ul>
            </div>
          </SimpleBar>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
