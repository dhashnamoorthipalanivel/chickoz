import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Feather from 'react-feather';
import { useTheme } from '../../context/ThemeContext';

const HeaderHorizontal = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const { layoutMode, toggleTheme, toggleRightSidebar } = useTheme();

  // Simplified toggle handlers for the dropdowns
  const toggleDropdown = (setter) => {
    setter(prev => !prev);
  };

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            {/* LOGO */}
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src="/assets/images/logo-sm.svg" alt="" height="24" />
                </span>
                <span className="logo-lg">
                  <img src="/assets/images/logo-sm.svg" alt="" height="24" /> <span className="logo-txt">Minia</span>
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src="/assets/images/logo-sm.svg" alt="" height="24" />
                </span>
                <span className="logo-lg">
                  <img src="/assets/images/logo-sm.svg" alt="" height="24" /> <span className="logo-txt">Minia</span>
                </span>
              </Link>
            </div>

            <button type="button" className="btn btn-sm px-3 font-size-16 d-lg-none header-item waves-effect waves-light" data-bs-toggle="collapse" data-bs-target="#topnav-menu-content">
              <i className="fa fa-fw fa-bars"></i>
            </button>

            {/* App Search*/}
            <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input type="text" className="form-control" placeholder="Search..." />
                <button className="btn btn-primary" type="button"><i className="bx bx-search-alt align-middle"></i></button>
              </div>
            </form>
          </div>

          <div className="d-flex">
            <div className={`dropdown d-inline-block d-lg-none ms-2 ${isSearchOpen ? 'show' : ''}`}>
              <button onClick={() => toggleDropdown(setIsSearchOpen)} type="button" className="btn header-item" id="page-header-search-dropdown">
                <Feather.Search className="icon-lg" />
              </button>
              <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 ${isSearchOpen ? 'show' : ''}`} style={isSearchOpen ? { position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(0px, 72px)'} : {}}>
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

            <div className={`dropdown d-none d-sm-inline-block ${isLangOpen ? 'show' : ''}`}>
              <button onClick={() => toggleDropdown(setIsLangOpen)} type="button" className="btn header-item">
                <img id="header-lang-img" src="/assets/images/flags/us.jpg" alt="Header Language" height="16" />
              </button>
              <div className={`dropdown-menu dropdown-menu-end ${isLangOpen ? 'show' : ''}`} style={isLangOpen ? { position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(0px, 72px)'} : {}}>
                <a href="#" onClick={e=>e.preventDefault()} className="dropdown-item notify-item language">
                  <img src="/assets/images/flags/us.jpg" alt="user-image" className="me-1" height="12" /> <span className="align-middle">English</span>
                </a>
                <a href="#" onClick={e=>e.preventDefault()} className="dropdown-item notify-item language">
                  <img src="/assets/images/flags/spain.jpg" alt="user-image" className="me-1" height="12" /> <span className="align-middle">Spanish</span>
                </a>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="dropdown d-none d-sm-inline-block">
              <button type="button" className="btn header-item" onClick={toggleTheme}>
                {layoutMode === 'light' ? (
                  <Feather.Moon className="icon-lg" />
                ) : (
                  <Feather.Sun className="icon-lg" />
                )}
              </button>
            </div>

            <div className={`dropdown d-none d-lg-inline-block ms-1 ${isAppsOpen ? 'show' : ''}`}>
              <button onClick={() => toggleDropdown(setIsAppsOpen)} type="button" className="btn header-item">
                <Feather.Grid className="icon-lg" />
              </button>
              <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-end ${isAppsOpen ? 'show' : ''}`} style={isAppsOpen ? { position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(0px, 72px)'} : {}}>
                <div className="p-2">
                  <div className="row g-0">
                    <div className="col">
                      <a className="dropdown-icon-item" href="#" onClick={e=>e.preventDefault()}>
                        <img src="/assets/images/brands/github.png" alt="Github" />
                        <span>GitHub</span>
                      </a>
                    </div>
                    <div className="col">
                      <a className="dropdown-icon-item" href="#" onClick={e=>e.preventDefault()}>
                        <img src="/assets/images/brands/bitbucket.png" alt="bitbucket" />
                        <span>Bitbucket</span>
                      </a>
                    </div>
                    <div className="col">
                      <a className="dropdown-icon-item" href="#" onClick={e=>e.preventDefault()}>
                        <img src="/assets/images/brands/dribbble.png" alt="dribbble" />
                        <span>Dribbble</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`dropdown d-inline-block ${isNotifOpen ? 'show' : ''}`}>
              <button onClick={() => toggleDropdown(setIsNotifOpen)} type="button" className="btn header-item noti-icon position-relative">
                <Feather.Bell className="icon-lg" />
                <span className="badge bg-danger rounded-pill">5</span>
              </button>
              <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 ${isNotifOpen ? 'show' : ''}`} style={isNotifOpen ? { position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(0px, 72px)'} : {}}>
                <div className="p-3">
                  <div className="row align-items-center">
                    <div className="col">
                      <h6 className="m-0"> Notifications </h6>
                    </div>
                    <div className="col-auto">
                      <a href="#!" onClick={e=>e.preventDefault()} className="small text-reset text-decoration-underline"> Unread (3)</a>
                    </div>
                  </div>
                </div>
                <div data-simplebar style={{ maxHeight: '230px' }}>
                  <a href="#!" onClick={e=>e.preventDefault()} className="text-reset notification-item">
                    <div className="d-flex">
                      <div className="avatar-sm me-3">
                        <span className="avatar-title bg-primary rounded-circle font-size-16">
                          <i className="bx bx-cart"></i>
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">Your order is placed</h6>
                        <div className="font-size-13 text-muted">
                          <p className="mb-1">If several languages coalesce the grammar</p>
                          <p className="mb-0"><i className="mdi mdi-clock-outline"></i> <span>3 min ago</span></p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="p-2 border-top d-grid">
                  <a className="btn btn-sm btn-link font-size-14 text-center" href="#!" onClick={e=>e.preventDefault()}>
                    <i className="mdi mdi-arrow-right-circle me-1"></i> <span>View More..</span> 
                  </a>
                </div>
              </div>
            </div>

            {/* Right Sidebar Toggle */}
            <div className="dropdown d-inline-block">
              <button type="button" className="btn header-item right-bar-toggle me-2" onClick={toggleRightSidebar}>
                <Feather.Settings className="icon-lg" />
              </button>
            </div>

            <div className={`dropdown d-inline-block ${isProfileOpen ? 'show' : ''}`}>
              <button onClick={() => toggleDropdown(setIsProfileOpen)} type="button" className="btn header-item bg-light-subtle border-start border-end">
                <img className="rounded-circle header-profile-user" src="/assets/images/users/avatar-1.jpg" alt="Header Avatar" />
                <span className="d-none d-xl-inline-block ms-1 fw-medium">Shawn L.</span>
                <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
              </button>
              <div className={`dropdown-menu dropdown-menu-end ${isProfileOpen ? 'show' : ''}`} style={isProfileOpen ? { position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(0px, 72px)'} : {}}>
                <Link className="dropdown-item" to="/apps-contacts-profile"><i className="mdi mdi-face-man font-size-16 align-middle me-1"></i> Profile</Link>
                <Link className="dropdown-item" to="/auth-lock-screen"><i className="mdi mdi-lock font-size-16 align-middle me-1"></i> Lock screen</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to="/auth-logout"><i className="mdi mdi-logout font-size-16 align-middle me-1"></i> Logout</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="topnav">
        <div className="container-fluid">
          <nav className="navbar navbar-light navbar-expand-lg topnav-menu">
            <div className="collapse navbar-collapse" id="topnav-menu-content">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle arrow-none" to="/" id="topnav-dashboard" role="button">
                    <Feather.Home /> <span data-key="t-dashboards">Dashboard</span>
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-uielement" role="button">
                    <Feather.Briefcase />
                    <span data-key="t-elements">Elements</span> 
                    <div className="arrow-down"></div>
                  </a>

                  <div className="dropdown-menu mega-dropdown-menu px-2 dropdown-mega-menu-xl" aria-labelledby="topnav-uielement">
                    <div className="ps-2 p-lg-0">
                      <div className="row">
                        <div className="col-lg-8">
                          <div>
                            <div className="menu-title">Elements</div>
                            <div className="row g-0">
                              <div className="col-lg-5">
                                <div>
                                  <Link to="/ui-alerts" className="dropdown-item">Alerts</Link>
                                  <Link to="/ui-buttons" className="dropdown-item">Buttons</Link>
                                  <Link to="/ui-cards" className="dropdown-item">Cards</Link>
                                  <Link to="/ui-carousel" className="dropdown-item">Carousel</Link>
                                  <Link to="/ui-dropdowns" className="dropdown-item">Dropdowns</Link>
                                  <Link to="/ui-grid" className="dropdown-item">Grid</Link>
                                  <Link to="/ui-images" className="dropdown-item">Images</Link>
                                  <Link to="/ui-modals" className="dropdown-item">Modals</Link>
                                  <Link to="/ui-offcanvas" className="dropdown-item">Offcanvas</Link>
                                </div>
                              </div>
                              <div className="col-lg-5">
                                <div>
                                  <Link to="/ui-progressbars" className="dropdown-item">Progress Bars</Link>
                                  <Link to="/ui-placeholders" className="dropdown-item">Placeholders</Link>
                                  <Link to="/ui-tabs-accordions" className="dropdown-item">Tabs & Accordions</Link>
                                  <Link to="/ui-typography" className="dropdown-item">Typography</Link>
                                  <Link to="/ui-toasts" className="dropdown-item">Toasts</Link>
                                  <Link to="/ui-video" className="dropdown-item">Video</Link>
                                  <Link to="/ui-general" className="dropdown-item">General</Link>
                                  <Link to="/ui-colors" className="dropdown-item">Colors</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div>
                            <div className="menu-title">Extended</div>
                            <div>
                              <Link to="/extended-lightbox" className="dropdown-item">Lightbox</Link>
                              <Link to="/extended-rangeslider" className="dropdown-item">Range Slider</Link>
                              <Link to="/extended-sweet-alert" className="dropdown-item">SweetAlert 2</Link>
                              <Link to="/extended-session-timeout" className="dropdown-item">Session Timeout</Link>
                              <Link to="/extended-rating" className="dropdown-item">Rating</Link>
                              <Link to="/extended-notifications" className="dropdown-item">Notifications</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-pages" role="button">
                    <Feather.Grid /> <span data-key="t-apps">Apps</span> <div className="arrow-down"></div>
                  </a>
                  <div className="dropdown-menu" aria-labelledby="topnav-pages">
                    <Link to="/apps-calendar" className="dropdown-item">Calendar</Link>
                    <Link to="/apps-chat" className="dropdown-item">Chat</Link>
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-email" role="button">
                        <span data-key="t-email">Email</span> <div className="arrow-down"></div>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-email">
                        <Link to="/apps-email-inbox" className="dropdown-item">Inbox</Link>
                        <Link to="/apps-email-read" className="dropdown-item">Read Email</Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-contact" role="button">
                        <span data-key="t-contacts">Contacts</span> <div className="arrow-down"></div>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-contact">
                        <Link to="/apps-contacts-grid" className="dropdown-item">User Grid</Link>
                        <Link to="/apps-contacts-list" className="dropdown-item">User List</Link>
                        <Link to="/apps-contacts-profile" className="dropdown-item">Profile</Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle d-flex justify-content-between align-items-center" href="#" onClick={e=>e.preventDefault()} id="topnav-blog" role="button">
                        <span data-key="t-blog">Blog</span> 
                        <span className="badge bg-danger-subtle text-danger">New</span>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-blog">
                        <Link to="/apps-blog-grid" className="dropdown-item">Blog Grid</Link>
                        <Link to="/apps-blog-list" className="dropdown-item">Blog List</Link>
                        <Link to="/apps-blog-detail" className="dropdown-item">Blog Details</Link>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-components" role="button">
                    <Feather.Box /> <span data-key="t-components">Components</span> <div className="arrow-down"></div>
                  </a>
                  <div className="dropdown-menu" aria-labelledby="topnav-components">
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-form" role="button">
                        <span data-key="t-forms">Forms</span> <div className="arrow-down"></div>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-form">
                        <Link to="/form-elements" className="dropdown-item">Basic Elements</Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-table" role="button">
                        <span data-key="t-tables">Tables</span> <div className="arrow-down"></div>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-table">
                        <Link to="/tables-basic" className="dropdown-item">Bootstrap Basic</Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-charts" role="button">
                        <span data-key="t-charts">Charts</span> <div className="arrow-down"></div>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-charts">
                        <Link to="/charts-apex" className="dropdown-item">Apex charts</Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-icons" role="button">
                        <span data-key="t-icons">Icons</span> <div className="arrow-down"></div>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-icons">
                        <Link to="/icons-boxicons" className="dropdown-item">Boxicons</Link>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-more" role="button">
                    <Feather.FileText /> <span data-key="t-extra-pages">Pages</span> <div className="arrow-down"></div>
                  </a>
                  <div className="dropdown-menu" aria-labelledby="topnav-more">
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-auth" role="button">
                        <span data-key="t-authentication">Authentication</span> <div className="arrow-down"></div>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-auth">
                        <Link to="/auth-login" className="dropdown-item">Login</Link>
                        <Link to="/auth-register" className="dropdown-item">Register</Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-utility" role="button">
                        <span data-key="t-utility">Utility</span> <div className="arrow-down"></div>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-utility">
                        <Link to="/pages-starter" className="dropdown-item">Starter Page</Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a className="dropdown-item dropdown-toggle arrow-none" href="#" onClick={e=>e.preventDefault()} id="topnav-custom" role="button">
                        <span data-key="t-custom">Custom Pages</span> <div className="arrow-down"></div>
                      </a>
                      <div className="dropdown-menu" aria-labelledby="topnav-custom">
                        <Link to="/custom-list" className="dropdown-item">List Page</Link>
                        <Link to="/custom-create" className="dropdown-item">Create Page</Link>
                        <Link to="/custom-edit" className="dropdown-item">Edit Page</Link>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HeaderHorizontal;
