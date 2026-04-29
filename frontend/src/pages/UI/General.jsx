import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const General = () => {
    
    // Initialize tooltips and popovers if bootstrap is available globally
    useEffect(() => {
        if (typeof window !== 'undefined' && window.bootstrap) {
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.map(function (popoverTriggerEl) {
                return new window.bootstrap.Popover(popoverTriggerEl);
            });

            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new window.bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }, []);

    return (
        <div className="page-content">
            <div className="container-fluid">

                {/* start page title */}
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0 font-size-18">General</h4>

                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><Link to="#">Components</Link></li>
                                    <li className="breadcrumb-item active">General</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end page title */}

                <div className="row">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Badges</h4>
                                <p className="card-title-desc">Add any of the below mentioned modifier classes to change the appearance of a badge.</p>
                            </div>

                            <div className="card-body">
                                <div>
                                    <h5 className="font-size-14">Default</h5>
                                    <div className="d-flex flex-wrap gap-2 mt-1">
                                        <span className="badge bg-primary">Primary</span>
                                        <span className="badge bg-success">Success</span>
                                        <span className="badge bg-info">Info</span>
                                        <span className="badge bg-warning">Warning</span>
                                        <span className="badge bg-danger">Danger</span>
                                        <span className="badge bg-dark">Dark</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="font-size-14">Soft Badge</h5>
                                    <div className="d-flex flex-wrap gap-2 mt-1">
                                        <span className="badge bg-primary-subtle text-primary">Primary</span>
                                        <span className="badge bg-success-subtle text-success">Success</span>
                                        <span className="badge bg-info-subtle text-info">Info</span>
                                        <span className="badge bg-warning-subtle text-warning">Warning</span>
                                        <span className="badge bg-danger-subtle text-danger">Danger</span>
                                        <span className="badge bg-dark-subtle text-dark">Dark</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Pill Badges</h4>
                                <p className="card-title-desc">Use the <code>.rounded-pill</code> modifier class to make badges more rounded.</p>
                            </div>

                            <div className="card-body">
                                <div>
                                    <h5 className="font-size-14">Default</h5>
                                    <div className="d-flex flex-wrap gap-2 mt-1">
                                        <span className="badge rounded-pill bg-primary">Primary</span>
                                        <span className="badge rounded-pill bg-success">Success</span>
                                        <span className="badge rounded-pill bg-info">Info</span>
                                        <span className="badge rounded-pill bg-warning">Warning</span>
                                        <span className="badge rounded-pill bg-danger">Danger</span>
                                        <span className="badge rounded-pill bg-dark">Dark</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="font-size-14">Soft Badge</h5>
                                    <div className="d-flex flex-wrap gap-2 mt-1">
                                        <span className="badge rounded-pill bg-primary-subtle text-primary">Primary</span>
                                        <span className="badge rounded-pill bg-success-subtle text-success">Success</span>
                                        <span className="badge rounded-pill bg-info-subtle text-info">Info</span>
                                        <span className="badge rounded-pill bg-warning-subtle text-warning">Warning</span>
                                        <span className="badge rounded-pill bg-danger-subtle text-danger">Danger</span>
                                        <span className="badge rounded-pill bg-dark-subtle text-dark">Dark</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Badges in Buttons</h4>
                                <p className="card-title-desc">Badges can be used as part of links or buttons to provide a counter.</p>
                            </div>

                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-2">
                                    <button type="button" className="btn btn-primary">
                                        Notifications <span className="badge bg-success ms-1">4</span>
                                    </button>
                                    <button type="button" className="btn btn-success">
                                        Messages <span className="badge bg-danger ms-1">2</span>
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary">
                                        Draft <span className="badge bg-success ms-1">2</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Badges Position Examples</h4>
                                <p className="card-title-desc">Example of Badges Position</p>
                            </div>

                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-3">
                                    <button type="button" className="btn btn-primary position-relative">
                                        Mails <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">+99 <span className="visually-hidden">unread messages</span></span>
                                    </button>

                                    <button type="button" className="btn btn-light position-relative">
                                        Alerts <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1"><span className="visually-hidden">unread messages</span></span>
                                    </button>

                                    <button type="button" className="btn btn-primary position-relative p-0 avatar-sm rounded">
                                        <span className="avatar-title bg-transparent">
                                            <i className="bx bxs-envelope"></i>
                                        </span>
                                        <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1"><span className="visually-hidden">unread messages</span></span>
                                    </button>

                                    <button type="button" className="btn btn-light position-relative p-0 avatar-sm rounded-circle">
                                        <span className="avatar-title bg-transparent text-reset">
                                            <i className="bx bxs-bell"></i>
                                        </span>
                                    </button>

                                    <button type="button" className="btn btn-light position-relative p-0 avatar-sm rounded-circle">
                                        <span className="avatar-title bg-transparent text-reset">
                                            <i className="bx bx-menu"></i>
                                        </span>
                                        <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-success p-1"><span className="visually-hidden">unread messages</span></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Popovers</h4>
                                <p className="card-title-desc">Four options are available: top, right, bottom, and left aligned. Directions are mirrored when using Bootstrap in RTL.</p>
                            </div>

                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-2">
                                    <button type="button" className="btn btn-secondary waves-effect" data-bs-toggle="popover" data-bs-placement="top"
                                        data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
                                        Popover on top
                                    </button>
                                
                                    <button type="button" className="btn btn-secondary waves-effect" data-bs-toggle="popover" data-bs-placement="right"
                                        data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
                                        Popover on right
                                    </button>
                                
                                    <button type="button" className="btn btn-secondary waves-effect" data-bs-toggle="popover" data-bs-placement="bottom"
                                        data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
                                        Popover on bottom
                                    </button>
                                
                                    <button type="button" className="btn btn-secondary waves-effect" data-bs-toggle="popover" data-bs-placement="left"
                                        title="Popover Title" data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
                                        Popover on left
                                    </button>
                                
                                    <button type="button" className="btn btn-success waves-effect waves-light" data-bs-toggle="popover"
                                        data-bs-trigger="focus" title="Dismissible popover"
                                        data-bs-content="And here's some amazing content. It's very engaging. Right?">Dismissible popover</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Tooltips</h4>
                                <p className="card-title-desc">Hover over the links below to see tooltips:</p>
                            </div>

                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-2">
                                    <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
                                        Tooltip on top
                                    </button>
                                
                                    <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">
                                        Tooltip on right
                                    </button>
                                
                                    <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">
                                        Tooltip on bottom
                                    </button>
                                
                                    <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">
                                        Tooltip on left
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Pagination Default Example</h4>
                                <p className="card-title-desc">Pagination links indicate a series of related content exists across multiple pages.</p>
                            </div>

                            <div className="card-body">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        <li className="page-item"><Link className="page-link" to="#">Previous</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">Next</Link></li>
                                    </ul>
                                </nav>

                                <nav aria-label="Page navigation example">
                                    <ul className="pagination mb-0">
                                        <li className="page-item">
                                            <Link className="page-link" to="#" aria-label="Previous">
                                                <i className="mdi mdi-chevron-left"></i>
                                            </Link>
                                        </li>
                                        <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                        <li className="page-item">
                                            <Link className="page-link" to="#" aria-label="Next">
                                                <i className="mdi mdi-chevron-right"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="font-size-14">Pagination Disabled and Active</h5>
                                <p className="card-title-desc">Pagination links are customizable for different circumstances. Use <code>.disabled</code> for links that appear un-clickable and <code>.active</code> to indicate the current page.</p>
                            </div>

                            <div className="card-body">
                                <nav aria-label="...">
                                    <ul className="pagination">
                                        <li className="page-item disabled">
                                            <Link className="page-link" to="#" tabIndex="-1">Previous</Link>
                                        </li>
                                        <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                        <li className="page-item active">
                                            <Link className="page-link" to="#">2 <span className="sr-only">(current)</span></Link>
                                        </li>
                                        <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                        <li className="page-item">
                                            <Link className="page-link" to="#">Next</Link>
                                        </li>
                                    </ul>
                                </nav>

                                <nav aria-label="...">
                                    <ul className="pagination mb-0">
                                        <li className="page-item disabled">
                                            <span className="page-link"><i className="mdi mdi-chevron-left"></i></span>
                                        </li>
                                        <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                        <li className="page-item active">
                                            <span className="page-link">
                                                2
                                                <span className="sr-only">(current)</span>
                                            </span>
                                        </li>
                                        <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                        <li className="page-item">
                                            <Link className="page-link" to="#"><i className="mdi mdi-chevron-right"></i></Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="font-size-14">Pagination Sizing</h5>
                                <p className="card-title-desc">Fancy larger or smaller pagination? Add <code>.pagination-lg</code> or <code>.pagination-sm</code> for additional sizes.</p>
                            </div>

                            <div className="card-body">
                                <nav aria-label="...">
                                    <ul className="pagination pagination-lg">
                                        <li className="page-item disabled">
                                            <Link className="page-link" to="#" tabIndex="-1">Previous</Link>
                                        </li>
                                        <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                        <li className="page-item">
                                            <Link className="page-link" to="#">Next</Link>
                                        </li>
                                    </ul>
                                </nav>

                                <nav aria-label="...">
                                    <ul className="pagination pagination-sm mb-0">
                                        <li className="page-item disabled">
                                            <Link className="page-link" to="#" tabIndex="-1">Previous</Link>
                                        </li>
                                        <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                        <li className="page-item">
                                            <Link className="page-link" to="#">Next</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="font-size-14">Pagination Alignment</h5>
                                <p className="card-title-desc">Change the alignment of pagination components with flexbox utilities.</p>
                            </div>

                            <div className="card-body">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination justify-content-center">
                                        <li className="page-item disabled">
                                            <Link className="page-link" to="#" tabIndex="-1">Previous</Link>
                                        </li>
                                        <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                        <li className="page-item">
                                            <Link className="page-link" to="#">Next</Link>
                                        </li>
                                    </ul>
                                </nav>

                                <nav aria-label="Page navigation example">
                                    <ul className="pagination justify-content-end mb-0">
                                        <li className="page-item disabled">
                                            <Link className="page-link" to="#" tabIndex="-1">Previous</Link>
                                        </li>
                                        <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                        <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                        <li className="page-item">
                                            <Link className="page-link" to="#">Next</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>                        

                <div className="row">
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Border Spinner</h4>
                                <p className="card-title-desc">Use the border spinners for a lightweight loading indicator.</p>
                            </div>

                            <div className="card-body">                                        
                                <div>
                                    <div className="spinner-border text-primary m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-border text-secondary m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-border text-success m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-border text-info m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-border text-warning m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-border text-danger m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-border text-dark m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                       
                    
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Growing Spinner</h4>
                                <p className="card-title-desc">If you don’t fancy a border spinner, switch to the grow spinner. While it doesn’t technically spin, it does repeatedly grow!</p>
                            </div>
                            
                            <div className="card-body">
                                <div>
                                    <div className="spinner-grow text-primary m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-grow text-secondary m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-grow text-success m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-grow text-info m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-grow text-warning m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-grow text-danger m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    <div className="spinner-grow text-dark m-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Close Button</h4>
                                <p className="card-title-desc">Provide an option to dismiss or close a component with <code>.btn-close</code>. Default styling is limited, but highly customizable. Modify the Sass variables to replace the default <code>background-image</code>.</p>
                            </div>

                            <div className="card-body">                                        
                                <button type="button" className="btn-close" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Disable Close Button</h4>
                                <p className="card-title-desc">Disabled close buttons change their <code>opacity</code>. We’ve also applied <code>pointer-events: none</code> and <code>user-select: none</code> to preventing hover and active states from triggering.</p>
                            </div>

                            <div className="card-body">                                        
                                <button type="button" className="btn-close" disabled aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-6">
                        <div className="card overflow-hidden">
                            <div className="card-header">
                                <h4 className="card-title">Close Button White Variant</h4>
                                <p className="card-title-desc">Change the default <code>.btn-close</code> to be white with the <code>.btn-close-white</code> class. This class uses the <code>filter</code> property to invert the <code>background-image</code>.</p>
                            </div>

                            <div className="card-body bg-dark">                                        
                                <button type="button" className="btn-close btn-close-white" aria-label="Close"></button>&nbsp;
                                <button type="button" className="btn-close btn-close-white" disabled aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default General;
