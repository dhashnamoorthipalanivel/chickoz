import React from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useTheme } from '../../context/ThemeContext';

const RightSidebar = () => {
    const {
        layout, setLayout,
        layoutMode, setLayoutMode,
        layoutWidth, setLayoutWidth,
        layoutPosition, setLayoutPosition,
        topbarColor, setTopbarColor,
        sidebarSize, setSidebarSize,
        sidebarColor, setSidebarColor,
        direction, setDirection,
        showRightSidebar, setShowRightSidebar
    } = useTheme();

    // Do not return null here, as the CSS transition depends on the element being in the DOM
    // and the body class 'right-bar-enabled' shifting it.

    return (
        <React.Fragment>
            <div className="right-bar">
                <SimpleBar style={{ height: '100%' }}>
                    <div className="p-4">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <h5 className="m-0">Theme Customizer</h5>
                            <a 
                                href="#!" 
                                onClick={(e) => { e.preventDefault(); setShowRightSidebar(false); }}
                                className="right-bar-toggle ms-auto"
                            >
                                <i className="mdi mdi-close noti-icon"></i>
                            </a>
                        </div>

                        <hr className="m-0" />

                        <div className="p-0">
                            <h6 className="mt-4 mb-3 fw-bold">Layout</h6>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="layout" id="layout-vertical" value="vertical" checked={layout === 'vertical'} onChange={(e) => setLayout(e.target.value)} />
                                <label className="form-check-label" htmlFor="layout-vertical">Vertical</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="layout" id="layout-horizontal" value="horizontal" checked={layout === 'horizontal'} onChange={(e) => setLayout(e.target.value)} />
                                <label className="form-check-label" htmlFor="layout-horizontal">Horizontal</label>
                            </div>

                            <h6 className="mt-4 mb-3 fw-bold">Layout Mode</h6>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="layoutMode" id="layout-mode-light" value="light" checked={layoutMode === 'light'} onChange={(e) => setLayoutMode(e.target.value)} />
                                <label className="form-check-label" htmlFor="layout-mode-light">Light</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="layoutMode" id="layout-mode-dark" value="dark" checked={layoutMode === 'dark'} onChange={(e) => setLayoutMode(e.target.value)} />
                                <label className="form-check-label" htmlFor="layout-mode-dark">Dark</label>
                            </div>

                            <h6 className="mt-4 mb-3 fw-bold">Layout Width</h6>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="layoutWidth" id="layout-width-fluid" value="fluid" checked={layoutWidth === 'fluid'} onChange={(e) => setLayoutWidth(e.target.value)} />
                                <label className="form-check-label" htmlFor="layout-width-fluid">Fluid</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="layoutWidth" id="layout-width-boxed" value="boxed" checked={layoutWidth === 'boxed'} onChange={(e) => setLayoutWidth(e.target.value)} />
                                <label className="form-check-label" htmlFor="layout-width-boxed">Boxed</label>
                            </div>

                            <h6 className="mt-4 mb-3 fw-bold">Layout Position</h6>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="layoutPosition" id="layout-position-fixed" value="fixed" checked={layoutPosition === 'fixed'} onChange={(e) => setLayoutPosition(e.target.value)} />
                                <label className="form-check-label" htmlFor="layout-position-fixed">Fixed</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="layoutPosition" id="layout-position-scrollable" value="scrollable" checked={layoutPosition === 'scrollable'} onChange={(e) => setLayoutPosition(e.target.value)} />
                                <label className="form-check-label" htmlFor="layout-position-scrollable">Scrollable</label>
                            </div>

                            <h6 className="mt-4 mb-3 fw-bold">Topbar Color</h6>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="topbarColor" id="topbar-color-light" value="light" checked={topbarColor === 'light'} onChange={(e) => setTopbarColor(e.target.value)} />
                                <label className="form-check-label" htmlFor="topbar-color-light">Light</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="topbarColor" id="topbar-color-dark" value="dark" checked={topbarColor === 'dark'} onChange={(e) => setTopbarColor(e.target.value)} />
                                <label className="form-check-label" htmlFor="topbar-color-dark">Dark</label>
                            </div>

                            {layout === 'vertical' && (
                                <React.Fragment>
                                    <h6 className="mt-4 mb-3 fw-bold">Sidebar Size</h6>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="sidebarSize" id="sidebar-size-default" value="lg" checked={sidebarSize === 'lg'} onChange={(e) => setSidebarSize(e.target.value)} />
                                        <label className="form-check-label" htmlFor="sidebar-size-default">Default</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="sidebarSize" id="sidebar-size-compact" value="md" checked={sidebarSize === 'md'} onChange={(e) => setSidebarSize(e.target.value)} />
                                        <label className="form-check-label" htmlFor="sidebar-size-compact">Compact</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="sidebarSize" id="sidebar-size-small" value="sm" checked={sidebarSize === 'sm'} onChange={(e) => setSidebarSize(e.target.value)} />
                                        <label className="form-check-label" htmlFor="sidebar-size-small">Small (Icon View)</label>
                                    </div>

                                    <h6 className="mt-4 mb-3 fw-bold">Sidebar Color</h6>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="sidebarColor" id="sidebar-color-light" value="light" checked={sidebarColor === 'light'} onChange={(e) => setSidebarColor(e.target.value)} />
                                        <label className="form-check-label" htmlFor="sidebar-color-light">Light</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="sidebarColor" id="sidebar-color-dark" value="dark" checked={sidebarColor === 'dark'} onChange={(e) => setSidebarColor(e.target.value)} />
                                        <label className="form-check-label" htmlFor="sidebar-color-dark">Dark</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="sidebarColor" id="sidebar-color-brand" value="brand" checked={sidebarColor === 'brand'} onChange={(e) => setSidebarColor(e.target.value)} />
                                        <label className="form-check-label" htmlFor="sidebar-color-brand">Brand</label>
                                    </div>
                                </React.Fragment>
                            )}

                            <h6 className="mt-4 mb-3 fw-bold">Direction</h6>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="direction" id="direction-ltr" value="ltr" checked={direction === 'ltr'} onChange={(e) => setDirection(e.target.value)} />
                                <label className="form-check-label" htmlFor="direction-ltr">LTR</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="direction" id="direction-rtl" value="rtl" checked={direction === 'rtl'} onChange={(e) => setDirection(e.target.value)} />
                                <label className="form-check-label" htmlFor="direction-rtl">RTL</label>
                            </div>
                        </div>
                    </div>
                </SimpleBar>
            </div>
            {/* Backdrop */}
            <div 
                className="rightbar-overlay" 
                style={{ display: showRightSidebar ? 'block' : 'none' }}
                onClick={() => setShowRightSidebar(false)}
            ></div>
        </React.Fragment>
    );
};

export default RightSidebar;
