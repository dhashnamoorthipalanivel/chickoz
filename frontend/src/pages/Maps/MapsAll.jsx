import React from 'react';
import { Link } from 'react-router-dom';

export const MapsGoogle = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Google Maps</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Maps</Link></li><li className="breadcrumb-item active">Google Maps</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Basic Map</h4></div>
                        <div className="card-body p-0">
                            <div style={{background:'#e8eaed', height:'400px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'0 0 4px 4px'}}>
                                <div className="text-center text-muted">
                                    <i className="bx bx-map-pin display-1"></i>
                                    <p className="mt-2">Google Maps Integration</p>
                                    <small>Add your Google Maps API key to enable maps</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Satellite View</h4></div>
                        <div className="card-body p-0">
                            <div style={{background:'#4a4a4a', height:'400px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'0 0 4px 4px'}}>
                                <div className="text-center text-white">
                                    <i className="bx bx-satellite display-1"></i>
                                    <p className="mt-2">Satellite View</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const MapsVector = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Vector Maps</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Maps</Link></li><li className="breadcrumb-item active">Vector Maps</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">World Vector Map</h4><p className="card-title-desc">Install jsvectormap to enable vector maps</p></div>
                        <div className="card-body">
                            <div style={{background:'#f8f9fa', height:'500px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'4px', border:'2px dashed #ced4da'}}>
                                <div className="text-center text-muted">
                                    <i className="bx bx-world display-1"></i>
                                    <p className="mt-2">Vector Map</p>
                                    <code>npm install jsvectormap</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const MapsLeaflet = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Leaflet Maps</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Maps</Link></li><li className="breadcrumb-item active">Leaflet</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Leaflet Map</h4><p className="card-title-desc">Open-source JavaScript library for interactive maps</p></div>
                        <div className="card-body">
                            <div style={{background:'#e8eaed', height:'500px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'4px', border:'2px dashed #ced4da'}}>
                                <div className="text-center text-muted">
                                    <i className="bx bx-map display-1"></i>
                                    <p className="mt-2">Leaflet Map</p>
                                    <code>npm install react-leaflet leaflet</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
