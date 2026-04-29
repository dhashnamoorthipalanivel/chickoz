import React from 'react';
import { Link } from 'react-router-dom';

// Extended Lightbox
export const ExtendedLightbox = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Lightbox</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Extended</Link></li><li className="breadcrumb-item active">Lightbox</li></ol></div></div></div></div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title">Image Gallery</h4><p className="card-title-desc">Click on any image to see the lightbox effect.</p></div>
                            <div className="card-body">
                                <div className="row">
                                    {[1,2,3,4,5,6].map(i => (
                                        <div className="col-xl-4 col-sm-6" key={i}>
                                            <div className="gallery-item mb-4">
                                                <div className="overflow-hidden rounded" style={{background:'var(--bs-gray-200)', height: '200px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                                    <i className="bx bx-image-alt" style={{fontSize:'3rem', color:'var(--bs-gray-400)'}}></i>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

// Extended Range Slider
export const ExtendedRangeSlider = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Range Slider</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Extended</Link></li><li className="breadcrumb-item active">Range Slider</li></ol></div></div></div></div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title">Default Slider</h4></div>
                            <div className="card-body">
                                <div className="mb-3"><label className="form-label">Basic Usage</label><input type="range" className="form-range" id="basicSlider" /></div>
                                <div className="mb-3"><label className="form-label">With Step</label><input type="range" className="form-range" min="0" max="100" step="10" /></div>
                                <div className="mb-3"><label className="form-label">Disabled</label><input type="range" className="form-range" disabled /></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title">Colored Sliders</h4></div>
                            <div className="card-body">
                                <div className="mb-3"><label className="form-label">Primary</label><input type="range" className="form-range" defaultValue="30" /></div>
                                <div className="mb-3"><label className="form-label">Success</label><input type="range" className="form-range" defaultValue="60" /></div>
                                <div className="mb-3"><label className="form-label">Warning</label><input type="range" className="form-range" defaultValue="80" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

// Extended Sweet Alert
export const ExtendedSweetAlert = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">SweetAlert 2</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Extended</Link></li><li className="breadcrumb-item active">SweetAlert 2</li></ol></div></div></div></div>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title">Basic Alerts</h4></div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-2">
                                    <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => alert('This is a basic alert!')}>Basic Alert</button>
                                    <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => alert('Great job!')}>Success Alert</button>
                                    <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => alert('Something went wrong!')}>Error Alert</button>
                                    <button type="button" className="btn btn-warning waves-effect waves-light" onClick={() => confirm('Are you sure?')}>Confirmation</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title">Advanced Options</h4></div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-2">
                                    <button type="button" className="btn btn-info waves-effect waves-light" onClick={() => alert('Auto close in 3 seconds!')}>Auto Close Timer</button>
                                    <button type="button" className="btn btn-secondary waves-effect waves-light" onClick={() => {const value = prompt('Enter your input:'); if(value) alert(`You entered: ${value}`);}}>Input Box</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

// Extended Rating
export const ExtendedRating = () => {
    const [rating, setRating] = React.useState(3);
    const [hover, setHover] = React.useState(0);
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Rating</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Extended</Link></li><li className="breadcrumb-item active">Rating</li></ol></div></div></div></div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header"><h4 className="card-title">Interactive Star Rating</h4></div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center gap-1">
                                        {[1,2,3,4,5].map(star => (
                                            <i key={star} className={`bx bxs-star font-size-24 cursor-pointer ${(hover || rating) >= star ? 'text-warning' : 'text-muted'}`} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => setRating(star)} style={{cursor:'pointer'}}></i>
                                        ))}
                                        <span className="ms-2 text-muted">{rating} / 5</span>
                                    </div>
                                    <p className="mt-3 text-muted">Selected: {rating} stars</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header"><h4 className="card-title">Read-only Ratings</h4></div>
                                <div className="card-body">
                                    {[5,4,3,2,1].map(r => (
                                        <div key={r} className="d-flex align-items-center gap-1 mb-2">
                                            {[1,2,3,4,5].map(s => (
                                                <i key={s} className={`bx bxs-star ${r >= s ? 'text-warning' : 'text-muted'}`}></i>
                                            ))}
                                            <span className="ms-2 badge bg-primary">{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

// Extended Notifications
export const ExtendedNotifications = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Notifications</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Extended</Link></li><li className="breadcrumb-item active">Notifications</li></ol></div></div></div></div>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title">Toast Notifications</h4></div>
                            <div className="card-body">
                                {['success','info','warning','danger'].map(type => (
                                    <div key={type} className={`alert alert-${type} d-flex align-items-center mb-3`} role="alert">
                                        <i className={`bx bx-${type === 'success' ? 'check-circle' : type === 'info' ? 'info-circle' : type === 'warning' ? 'error' : 'x-circle'} me-2 font-size-16`}></i>
                                        <div>A {type} notification example</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

// Extended Session Timeout
export const ExtendedSessionTimeout = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Session Timeout</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Extended</Link></li><li className="breadcrumb-item active">Session Timeout</li></ol></div></div></div></div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <p>The session timeout plugin will show a dialog to the user when their session is about to expire.</p>
                                <p className="text-muted">Wait 10 seconds without any activity to see the dialog appear.</p>
                                <button className="btn btn-primary" onClick={() => alert('Session timeout warning!')}>Trigger Manually</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);
