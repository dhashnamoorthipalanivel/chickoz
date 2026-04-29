import React from 'react';
import { Link } from 'react-router-dom';

const ProgressBars = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Progress Bars</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Components</Link></li>
                                        <li className="breadcrumb-item active">Progress Bars</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Default Examples</h4>
                                    <p className="card-title-desc">Progress components are built with two HTML elements, some CSS to set the width, and a few attributes.</p>
                                </div>

                                <div className="card-body">
                                    <div>
                                        <div className="progress mb-4">
                                            <div className="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress mb-4">
                                            <div className="progress-bar" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress mb-4">
                                            <div className="progress-bar" role="progressbar" style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress">
                                            <div className="progress-bar" role="progressbar" style={{ width: "100%" }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Backgrounds</h4>
                                    <p className="card-title-desc">Use background utility classes to change the appearance of individual progress bars.</p>
                                </div>

                                <div className="card-body">
                                    <div>
                                        <div className="progress mb-4">
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress mb-4">
                                            <div className="progress-bar bg-info" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress mb-4">
                                            <div className="progress-bar bg-warning" role="progressbar" style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress">
                                            <div className="progress-bar bg-danger" role="progressbar" style={{ width: "100%" }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
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
                                    <h4 className="card-title">Labels Example</h4>
                                    <p className="card-title-desc">Add labels to your progress bars by placing text within the <code className="highlighter-rouge">.progress-bar</code>.</p>
                                </div>

                                <div className="card-body">
                                    <div>
                                        <div className="progress">
                                            <div className="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Multiple bars</h4>
                                    <p className="card-title-desc">Include multiple progress bars in a progress component if you need.</p>
                                </div>

                                <div className="card-body">
                                    <div>
                                        <div className="progress">
                                            <div className="progress-bar" role="progressbar" style={{ width: "15%" }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: "30%" }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                                            <div className="progress-bar bg-info" role="progressbar" style={{ width: "20%" }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
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
                                    <h4 className="card-title">Height</h4>
                                    <p className="card-title-desc">We only set a <code>height</code> value on the <code>.progress-bar</code>, so if you change that value the outer <code>.progress</code> will automatically resize accordingly.</p>
                                </div>
                                
                                <div className="card-body">
                                    <div>
                                        <div className="mb-4">
                                            <h5 className="font-size-13">Progress sm</h5>
                                            <div className="progress progress-sm">
                                                <div className="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <h5 className="font-size-13">Progress md</h5>
                                            <div className="progress progress-md">
                                                <div className="progress-bar bg-success" role="progressbar" style={{ width: "40%" }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <h5 className="font-size-13">Progress lg</h5>
                                            <div className="progress progress-lg">
                                                <div className="progress-bar bg-warning" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-size-13">Progress xl</h5>
                                            <div className="progress progress-xl">
                                                <div className="progress-bar bg-danger" role="progressbar" style={{ width: "70%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Striped</h4>
                                    <p className="card-title-desc">Add <code>.progress-bar-striped</code> to any <code>.progress-bar</code> to apply a stripe via CSS gradient over the progress bar’s background color.</p>
                                </div>

                                <div className="card-body">
                                    <div className="progress mb-4">
                                        <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div className="progress mb-0">
                                        <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{ width: "40%" }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Animated stripes</h4>
                                    <p className="card-title-desc">The striped gradient can also be animated. Add <code>.progress-bar-animated</code> to <code>.progress-bar</code> to animate the stripes right to left via CSS3 animations.</p>
                                </div>

                                <div className="card-body">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: "75%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Animated Progress</h4>
                                    <p className="card-title-desc">Add <code>.animated-progess</code> class with <code>.progress-bar</code> for animated progressbar.</p>
                                </div>

                                <div className="card-body">
                                    <div>
                                        <div className="progress animated-progess mb-4">
                                            <div className="progress-bar" role="progressbar" style={{ width: "10%" }} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress animated-progess mb-4">
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress animated-progess mb-4">
                                            <div className="progress-bar bg-info" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress animated-progess mb-4">
                                            <div className="progress-bar bg-warning" role="progressbar" style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="progress animated-progess">
                                            <div className="progress-bar bg-danger" role="progressbar" style={{ width: "100%" }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Custom progress</h4>
                                    <p className="card-title-desc">Example of Custom progress</p>
                                </div>

                                <div className="card-body">
                                    <div className="py-2">
                                        <div className="custom-progess mb-5">
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-danger" role="progressbar" style={{ width: "84%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <div className="avatar-sm progress-icon">
                                                <span className="avatar-title rounded-circle border border-danger">
                                                    <i className="bx bxl-html5 text-danger font-size-18"></i>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="custom-progess mb-5">
                                            <div className="progress progress-sm">
                                                <div className="progress-bar" role="progressbar" style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <div className="avatar-sm progress-icon">
                                                <span className="avatar-title rounded-circle border border-primary">
                                                    <i className="bx bxl-css3 text-primary font-size-18"></i>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="custom-progess">
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-info" role="progressbar" style={{ width: "62%" }} aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <div className="avatar-sm progress-icon">
                                                <span className="avatar-title rounded-circle border border-info">
                                                    <i className="bx bxl-jquery text-info font-size-18"></i>
                                                </span>
                                            </div>
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
                                    <h5 className="card-title">Progress Example</h5>
                                    <p className="card-title-desc">You can use these classes with existing components to create new ones.</p>
                                </div>

                                <div className="card-body">
                                    <div className="position-relative m-4">
                                        <div className="progress" style={{ height: "1px" }}>
                                            <div className="progress-bar" role="progressbar" style={{ width: "50%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <button type="button" className="position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-pill" style={{ width: "2rem", height: "2rem" }}>1</button>
                                        <button type="button" className="position-absolute top-0 start-50 translate-middle btn btn-sm btn-primary rounded-pill" style={{ width: "2rem", height: "2rem" }}>2</button>
                                        <button type="button" className="position-absolute top-0 start-100 translate-middle btn btn-sm btn-secondary rounded-pill" style={{ width: "2rem", height: "2rem" }}>3</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProgressBars;
