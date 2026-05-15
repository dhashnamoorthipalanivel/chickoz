import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import MetisMenu from 'metismenujs';
import * as Feather from 'react-feather';

const Sidebar = () => {
  const menuRef = useRef(null);
  const location = useLocation();

  // Fetch the role 
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;

  const isAdmin = role === "admin" || role === "super_admin";

  const isFranchise = role === "user" || role === "franchise";



  useEffect(() => {
    const pathName = location.pathname;

    // Clear ALL active/show classes first so no stale highlights remain
    menuRef.current?.querySelectorAll('li').forEach(li => {
      li.classList.remove('mm-active');
    });
    menuRef.current?.querySelectorAll('ul.sub-menu').forEach(ul => {
      ul.classList.remove('mm-show');
    });
    menuRef.current?.querySelectorAll('a').forEach(a => {
      a.classList.remove('active');
    });

    // Now set active only on the exact match
    menuRef.current?.querySelectorAll('a').forEach((item) => {
      const href = item.getAttribute('href');
      const isExactMatch = href === pathName || (pathName === '/' && href === '/');
      if (isExactMatch) {
        item.classList.add('active');
        let parent = item.parentElement; // li
        if (parent) {
          parent.classList.add('mm-active');
          let parent2 = parent.parentElement; // ul.sub-menu
          if (parent2) {
            parent2.classList.add('mm-show');
            let parent3 = parent2.parentElement; // li (parent menu item)
            if (parent3) {
              parent3.classList.add('mm-active');
              let parent4 = parent3.parentElement; // ul.sub-menu (nested)
              if (parent4) {
                parent4.classList.add('mm-show');
                let parent5 = parent4.parentElement; // li (top group)
                if (parent5) {
                  parent5.classList.add('mm-active');
                }
              }
            }
          }
        }
      }
    });

    let menu = new MetisMenu('#side-menu');

    return () => {
      if (menu) {
        menu.dispose();
      }
    };

  }, [location.pathname]);

  return (
    <div className="vertical-menu">
      <SimpleBar className="h-100">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu" ref={menuRef}>
            <li className="menu-title">Menu</li>

            <li>
              <Link to="/dashboard">
                <Feather.Home className="icon-sm" />
                <span>Dashboard</span>
              </Link>
            </li>

            {/* <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Grid className="icon-sm" />
                <span>Apps</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/apps-calendar">Calendar</Link></li>
                <li><Link to="/apps-chat">Chat</Link></li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">Email</a>
                  <ul className="sub-menu" aria-expanded="false">
                    <li><Link to="/apps-email-inbox">Inbox</Link></li>
                    <li><Link to="/apps-email-read">Read Email</Link></li>
                  </ul>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">Invoices</a>
                  <ul className="sub-menu" aria-expanded="false">
                    <li><Link to="/apps-invoices-list">Invoice List</Link></li>
                    <li><Link to="/apps-invoices-detail">Invoice Detail</Link></li>
                  </ul>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">Contacts</a>
                  <ul className="sub-menu" aria-expanded="false">
                    <li><Link to="/apps-contacts-grid">User Grid</Link></li>
                    <li><Link to="/apps-contacts-list">User List</Link></li>
                    <li><Link to="/apps-contacts-profile">Profile</Link></li>
                  </ul>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                    <span>Blog</span>
                    <span className="badge rounded-pill badge-soft-danger float-end">New</span>
                  </a>
                  <ul className="sub-menu" aria-expanded="false">
                    <li><Link to="/apps-blog-grid">Blog Grid</Link></li>
                    <li><Link to="/apps-blog-list">Blog List</Link></li>
                    <li><Link to="/apps-blog-detail">Blog Details</Link></li>
                  </ul>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Users className="icon-sm" />
                <span>Authentication</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/auth-login">Login</Link></li>
                <li><Link to="/auth-register">Register</Link></li>
                <li><Link to="/auth-recoverpw">Recover Password</Link></li>
                <li><Link to="/auth-lock-screen">Lock Screen</Link></li>
                <li><Link to="/auth-logout">Log Out</Link></li>
                <li><Link to="/auth-confirm-mail">Confirm Mail</Link></li>
                <li><Link to="/auth-email-verification">Email Verification</Link></li>
                <li><Link to="/auth-two-step-verification">Two Step Verification</Link></li>
              </ul>
            </li> */}

            {/* <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.FileText className="icon-sm" />
                <span>Pages</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/pages-starter">Starter Page</Link></li>
                <li><Link to="/pages-maintenance">Maintenance</Link></li>
                <li><Link to="/pages-comingsoon">Coming Soon</Link></li>
                <li><Link to="/pages-timeline">Timeline</Link></li>
                <li><Link to="/pages-faqs">FAQs</Link></li>
                <li><Link to="/pages-pricing">Pricing</Link></li>
                <li><Link to="/pages-404">Error 404</Link></li>
                <li><Link to="/pages-500">Error 500</Link></li>
              </ul>
            </li> */}

            {/* <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.FilePlus className="icon-sm" />
                <span>Custom Pages</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/custom-list">List Page</Link></li>
                <li><Link to="/custom-create">Create Page</Link></li>
                <li><Link to="/custom-edit">Edit Page</Link></li>
              </ul>
            </li>

            <li>
              <Link to="/layouts-horizontal">
                <Feather.Layout className="icon-sm" />
                <span>Horizontal</span>
              </Link>
            </li> */}

            {/* CRM */}
            {
              isAdmin && (
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                    <Feather.Users className="icon-sm" />
                    <span>CRM</span>
                  </a>
                  <ul className="sub-menu" aria-expanded="false">
                    <li><Link to="/crm-enquiry">Enquiry</Link></li>
                    <li><Link to="/crm-lead">Lead</Link></li>

                  </ul>
                </li>
              )}

            {/* Manufacture */}
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Package className="icon-sm" />
                <span>Manufacture</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                {
                  isAdmin && (

                    <li>
                      <Link to="/manufacture-kishok">
                        Kishok
                      </Link>
                    </li>
                  )
                }
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">Masala</a>
                  <ul className="sub-menu" aria-expanded="true">
                    <li><Link to="/manufacture-masala-franchise-request">Franchise Requests</Link></li>
                    {
                      isAdmin && (

                        <li>
                          <Link to="/manufacture-masala-admin-process">
                            Admin Processing
                          </Link>
                        </li>
                      )
                    }
                  </ul>
                </li>

              </ul>
            </li>

            {/* POS */}
            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.ShoppingBag className="icon-sm" />
                <span>POS</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/store-management-billing">Billing</Link></li>
                <li><Link to="/store-management-orders">Orders</Link></li>

              </ul>
            </li>

            {/* Master */}
            {
              isAdmin && (
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                    <Feather.Layers className="icon-sm" />
                    <span>Master</span>
                  </a>
                  <ul className="sub-menu" aria-expanded="false">
                    <li><Link to="/master-franchise">Franchise</Link></li>
                    <li><Link to="/master-package">Package</Link></li>
                    <li><Link to="/master-tax">Tax</Link></li>
                    {/* <li><Link to="/master-food-category">Food Category</Link></li> */}
                    {/* <li><Link to="/master-kitchen-station">Kitchen Station</Link></li> */}
                    <li>

                      <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">Menu</a>
                      <ul className="sub-menu" aria-expanded="true">
                        <li><Link to="/master-menu-item">Menu Item</Link></li>
                        <li><Link to="/master-franchise-menu-visibility">Franchise Menu Visibility</Link></li>
                        <li><Link to="/master-franchise-menu-availability">Franchise Menu Availability</Link></li>
                      </ul>


                    </li>
                    <li><Link to="/master-masala-items">Masala Items</Link></li>
                    {/* <li><Link to="/master-raw-material">Raw Material</Link></li> */}
                    {/* <li><Link to="/master-vendor">Vendor</Link></li> */}
                    {/* <li><Link to="/master-table">Table</Link></li> */}
                    <li><Link to="/master-payment-mode">Payment mode</Link></li>
                    <li><Link to="/master-order-type">Order Type</Link></li>
                    <li><Link to="/master-lead-source">Lead Source</Link></li>
                    <li><Link to="/master-document">Document</Link></li>
                  </ul>
                </li>)}

            {
              isFranchise && (
                <li>
                  <a
                    href="#"
                    onClick={(e) =>
                      e.preventDefault()
                    }
                    className="has-arrow"
                  >

                    <Feather.Layers className="icon-sm" />
                    <span>
                      Master
                    </span>
                  </a>
                  <ul
                    className="sub-menu"
                    aria-expanded="false"
                  >
                    <li>
                      <Link to="/master-franchise-menu-availability">
                        Franchise Menu Availability
                      </Link>
                    </li>
                  </ul>
                </li>
              )
            }

            {/* <li className="menu-title mt-2">Elements</li> */}

            {/* <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Briefcase className="icon-sm" />
                <span>Components</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/ui-alerts">Alerts</Link></li>
                <li><Link to="/ui-buttons">Buttons</Link></li>
                <li><Link to="/ui-cards">Cards</Link></li>
                <li><Link to="/ui-carousel">Carousel</Link></li>
                <li><Link to="/ui-dropdowns">Dropdowns</Link></li>
                <li><Link to="/ui-grid">Grid</Link></li>
                <li><Link to="/ui-images">Images</Link></li>
                <li><Link to="/ui-modals">Modals</Link></li>
                <li><Link to="/ui-offcanvas">Offcanvas</Link></li>
                <li><Link to="/ui-progressbars">Progress Bars</Link></li>
                <li><Link to="/ui-placeholders">Placeholders</Link></li>
                <li><Link to="/ui-tabs-accordions">Tabs & Accordions</Link></li>
                <li><Link to="/ui-typography">Typography</Link></li>
                <li><Link to="/ui-toasts">Toasts</Link></li>
                <li><Link to="/ui-video">Video</Link></li>
                <li><Link to="/ui-general">General</Link></li>
                <li><Link to="/ui-colors">Colors</Link></li>
                <li><Link to="/ui-utilities">Utilities</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Gift className="icon-sm" />
                <span>Extended</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/extended-lightbox">Lightbox</Link></li>
                <li><Link to="/extended-rangeslider">Range Slider</Link></li>
                <li><Link to="/extended-sweet-alert">SweetAlert 2</Link></li>
                <li><Link to="/extended-session-timeout">Session Timeout</Link></li>
                <li><Link to="/extended-rating">Rating</Link></li>
                <li><Link to="/extended-notifications">Notifications</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Box className="icon-sm" />
                <span className="badge rounded-pill badge-soft-danger text-danger float-end">7</span>
                <span>Forms</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/form-elements">Basic Elements</Link></li>
                <li><Link to="/form-validation">Validation</Link></li>
                <li><Link to="/form-advanced">Advanced Plugins</Link></li>
                <li><Link to="/form-editors">Editors</Link></li>
                <li><Link to="/form-uploads">File Upload</Link></li>
                <li><Link to="/form-wizard">Wizard</Link></li>
                <li><Link to="/form-mask">Mask</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Sliders className="icon-sm" />
                <span>Tables</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/tables-basic">Bootstrap Basic</Link></li>
                <li><Link to="/tables-datatable">DataTables</Link></li>
                <li><Link to="/tables-responsive">Responsive</Link></li>
                <li><Link to="/tables-editable">Editable</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.PieChart className="icon-sm" />
                <span>Charts</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/charts-apex">Apexcharts</Link></li>
                <li><Link to="/charts-echart">Echarts</Link></li>
                <li><Link to="/charts-chartjs">Chartjs</Link></li>
                <li><Link to="/charts-knob">Jquery Knob</Link></li>
                <li><Link to="/charts-sparkline">Sparkline</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Cpu className="icon-sm" />
                <span>Icons</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/icons-boxicons">Boxicons</Link></li>
                <li><Link to="/icons-materialdesign">Material Design</Link></li>
                <li><Link to="/icons-dripicons">Dripicons</Link></li>
                <li><Link to="/icons-fontawesome">Font Awesome 5</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Map className="icon-sm" />
                <span>Maps</span>
              </a>
              <ul className="sub-menu" aria-expanded="false">
                <li><Link to="/maps-google">Google</Link></li>
                <li><Link to="/maps-vector">Vector</Link></li>
                <li><Link to="/maps-leaflet">Leaflet</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">
                <Feather.Share2 className="icon-sm" />
                <span>Multi Level</span>
              </a>
              <ul className="sub-menu" aria-expanded="true">
                <li><a href="#" onClick={(e) => e.preventDefault()}>Level 1.1</a></li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="has-arrow">Level 1.2</a>
                  <ul className="sub-menu" aria-expanded="true">
                    <li><a href="#" onClick={(e) => e.preventDefault()}>Level 2.1</a></li>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>Level 2.2</a></li>
                  </ul>
                </li>
              </ul>
            </li> */}
          </ul>

        </div>
      </SimpleBar>
    </div>
  );
};

export default Sidebar;
