import React from 'react';
import { Link } from 'react-router-dom';

export const UIToasts = () => {
    const [show, setShow] = React.useState({});
    const toggle = (id) => setShow(prev => ({ ...prev, [id]: !prev[id] }));
    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Toasts</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">UI Elements</Link></li><li className="breadcrumb-item active">Toasts</li></ol></div></div></div></div>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title">Basic Toasts</h4></div>
                            <div className="card-body">
                                {['primary','success','danger','warning','info'].map(type => (
                                    <div key={type} className="mb-3">
                                        <button className={`btn btn-${type} btn-sm me-2`} onClick={() => toggle(type)}>Show {type} toast</button>
                                        {show[type] && (
                                            <div className={`toast show align-items-center text-white bg-${type} border-0 mt-2`} role="alert">
                                                <div className="d-flex">
                                                    <div className="toast-body text-capitalize">{type} toast notification!</div>
                                                    <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => toggle(type)}></button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title">Translucent Toasts</h4></div>
                            <div className="card-body" style={{background:'#6c757d', borderRadius:'4px'}}>
                                <div className="toast fade show" role="alert">
                                    <div className="toast-header">
                                        <div className="avatar-xs me-2"><div className="avatar-title rounded-circle bg-primary">M</div></div>
                                        <strong className="me-auto">Minia</strong>
                                        <small>just now</small>
                                        <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                                    </div>
                                    <div className="toast-body">Hello, world! This is a toast message.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const UIVideo = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Video</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">UI Elements</Link></li><li className="breadcrumb-item active">Video</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Ratio 16:9</h4></div>
                        <div className="card-body">
                            <div className="ratio ratio-16x9">
                                <iframe src="https://www.youtube.com/embed/1y_kfWUCFDQ" title="YouTube video" allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Ratio 4:3</h4></div>
                        <div className="card-body">
                            <div className="ratio ratio-4x3">
                                <iframe src="https://www.youtube.com/embed/1y_kfWUCFDQ" title="YouTube video" allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const UIUtilities = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Utilities</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">UI Elements</Link></li><li className="breadcrumb-item active">Utilities</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Background Colors</h4></div>
                        <div className="card-body">
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {['primary','secondary','success','danger','warning','info','light','dark'].map(c => (
                                    <span key={c} className={`badge bg-${c} p-3 font-size-12`}>{c}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Text Colors</h4></div>
                        <div className="card-body">
                            {['primary','secondary','success','danger','warning','info','muted'].map(c => (
                                <p key={c} className={`text-${c}`}>.text-{c}: The quick brown fox jumps over the lazy dog.</p>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Spacing Utilities</h4></div>
                        <div className="card-body">
                            <div className="bg-primary text-white p-2 mb-2 rounded">p-2: padding 0.5rem</div>
                            <div className="bg-success text-white p-3 mb-2 rounded">p-3: padding 1rem</div>
                            <div className="bg-info text-white p-4 mb-2 rounded">p-4: padding 1.5rem</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
