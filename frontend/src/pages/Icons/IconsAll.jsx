import React from 'react';
import { Link } from 'react-router-dom';

export const IconsBoxicons = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Boxicons</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Icons</Link></li><li className="breadcrumb-item active">Boxicons</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Regular Icons</h4></div>
                        <div className="card-body">
                            <div className="row icon-demo-content" id="boxicons">
                                {['bx-home','bx-user','bx-cog','bx-bell','bx-search','bx-star','bx-heart','bx-lock','bx-mail-send','bx-calendar','bx-camera','bx-chart','bx-cloud','bx-code','bx-copy','bx-data','bx-download','bx-edit','bx-file','bx-filter','bx-flag','bx-folder','bx-gift','bx-globe','bx-grid'].map(icon => (
                                    <div key={icon} className="col-xl-3 col-lg-4 col-sm-6">
                                        <div className="p-2 border rounded mb-3 d-flex align-items-center gap-2">
                                            <i className={`bx ${icon} font-size-24`}></i>
                                            <span className="text-muted font-size-12">{icon}</span>
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
);

export const IconsMaterialDesign = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Material Design</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Icons</Link></li><li className="breadcrumb-item active">Material Design</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Material Design Icons</h4></div>
                        <div className="card-body">
                            <div className="row">
                                {['mdi-home','mdi-account','mdi-cog','mdi-bell','mdi-magnify','mdi-star','mdi-heart','mdi-lock','mdi-email','mdi-calendar','mdi-camera','mdi-chart-bar','mdi-cloud','mdi-code-tags','mdi-content-copy','mdi-database','mdi-download','mdi-pencil','mdi-file','mdi-filter','mdi-flag','mdi-folder','mdi-gift','mdi-earth','mdi-grid'].map(icon => (
                                    <div key={icon} className="col-xl-3 col-lg-4 col-sm-6">
                                        <div className="p-2 border rounded mb-3 d-flex align-items-center gap-2">
                                            <i className={`mdi ${icon} font-size-24`}></i>
                                            <span className="text-muted font-size-12">{icon}</span>
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
);

export const IconsDripicons = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Dripicons</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Icons</Link></li><li className="breadcrumb-item active">Dripicons</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Drip Icons</h4></div>
                        <div className="card-body">
                            <div className="row">
                                {['alarm','archive','arrow-down','arrow-left','arrow-right','arrow-up','article','backspace','basket','battery-empty','battery-full','bell','blog','bluetooth','bold','bookmark','briefcase','brightness-max','brightness-min','browser'].map(icon => (
                                    <div key={icon} className="col-xl-3 col-lg-4 col-sm-6">
                                        <div className="p-2 border rounded mb-3 d-flex align-items-center gap-2">
                                            <i className={`dripicons-${icon} font-size-22`}></i>
                                            <span className="text-muted font-size-12">dripicons-{icon}</span>
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
);

export const IconsFontAwesome = () => (
    <div className="page-content">
        <div className="container-fluid">
            <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Font Awesome 5</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Icons</Link></li><li className="breadcrumb-item active">Font Awesome 5</li></ol></div></div></div></div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"><h4 className="card-title">Solid Icons</h4></div>
                        <div className="card-body">
                            <div className="row">
                                {['home','user','cog','bell','search','star','heart','lock','envelope','calendar','camera','chart-bar','cloud','code','copy','database','download','edit','file','filter','flag','folder','gift','globe','th'].map(icon => (
                                    <div key={icon} className="col-xl-3 col-lg-4 col-sm-6">
                                        <div className="p-2 border rounded mb-3 d-flex align-items-center gap-2">
                                            <i className={`fas fa-${icon} font-size-18`}></i>
                                            <span className="text-muted font-size-12">fa-{icon}</span>
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
);
