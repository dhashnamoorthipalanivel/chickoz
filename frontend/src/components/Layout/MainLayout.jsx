import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import HeaderHorizontal from './HeaderHorizontal';
import Footer from './Footer';
import RightSidebar from './RightSidebar';
import TopbarLoader from './TopbarLoader';
import Waves from 'node-waves';
import 'node-waves/dist/waves.min.css';
import { useTheme } from '../../context/ThemeContext';
import SquarePatternBg from '../SquarePatternBg';
import SubscriptionExpired from '../../pages/Subscription/SubscriptionExpired';
import { useSubscriptionStore } from '../../store/store';
import { useAutoLogout } from '../../utils/sessionManager';

const MainLayout = ({ children }) => {
  useAutoLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Compute synchronously so admin users never see the blank flash
  const _user = JSON.parse(localStorage.getItem("user") || "{}");
  const _isFranchise = _user?.role === "user" || _user?.role === "franchise";

  const [subExpired, setSubExpired] = useState(false);
  const [subChecked, setSubChecked] = useState(!_isFranchise); // true for admins immediately

  const location = useLocation();
  const { fetchMySubscription } = useSubscriptionStore();

  /* Only franchise/user roles need the subscription check */
  useEffect(() => {
    if (!_isFranchise) return; // admin — already checked = true

    fetchMySubscription()
      .then(sub => {
        if (!sub || sub.status !== "ACTIVE") setSubExpired(true);
        setSubChecked(true);
      })
      .catch(() => setSubChecked(true));
  }, []);
  const {
    layout: contextLayout,
    layoutMode,
    layoutWidth,
    layoutPosition,
    topbarColor,
    sidebarSize,
    sidebarColor,
    direction,
    showRightSidebar
  } = useTheme();

  // Determine layout: check if route forces horizontal, otherwise use context
  const layout = location.pathname === '/layouts-horizontal' ? 'horizontal' : contextLayout;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    Waves.init();
  }, []);

  useEffect(() => {
    // Apply all layout-related attributes to the document/body
    document.body.setAttribute('data-layout', layout);
    document.body.setAttribute('data-bs-theme', layoutMode);
    document.body.setAttribute('data-layout-size', layoutWidth);
    document.body.setAttribute('data-layout-scrollable', layoutPosition === 'scrollable' ? 'true' : 'false');
    document.body.setAttribute('data-topbar', topbarColor);
    document.body.setAttribute('data-sidebar', sidebarColor);
    document.body.setAttribute('data-sidebar-size', sidebarSize);

    // Direction (LTR/RTL)
    document.documentElement.setAttribute('dir', direction);

    // Right sidebar open class
    if (showRightSidebar) {
      document.body.classList.add('right-bar-enabled');
    } else {
      document.body.classList.remove('right-bar-enabled');
    }

    // Cleanup for switching layouts
    if (layout === 'horizontal') {
      document.body.classList.remove('sidebar-enable');
      document.body.removeAttribute('data-sidebar-size');
    }
  }, [layout, layoutMode, layoutWidth, layoutPosition, topbarColor, sidebarSize, sidebarColor, direction, showRightSidebar]);

  useEffect(() => {
    // Sync sidebar toggle with body classes for mobile/desktop (Vertical only)
    if (layout === 'vertical') {
      if (isSidebarOpen) {
        document.body.classList.add('sidebar-enable');
        document.body.setAttribute('data-sidebar-size', sidebarSize);
      } else {
        document.body.classList.remove('sidebar-enable');
        document.body.setAttribute('data-sidebar-size', 'sm');
      }
    }
  }, [isSidebarOpen, layout, sidebarSize]);

  /* Show nothing until subscription check completes (avoid flash) */
  if (!subChecked) return null;
  if (subExpired) return <SubscriptionExpired />;

  return (
    <div id="layout-wrapper">
      <SquarePatternBg />
      <TopbarLoader />
      {layout === 'vertical' ? (
        <React.Fragment>
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar toggleSidebar={toggleSidebar} />
        </React.Fragment>
      ) : (
        <HeaderHorizontal />
      )}

      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            {children}
          </div>
        </div>
        <Footer />
      </div>
      <RightSidebar />
    </div>
  );
};

export default MainLayout;
