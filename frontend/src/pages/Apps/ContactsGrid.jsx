import React from 'react';
import { Link } from 'react-router-dom';

const ContactsGrid = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">User Grid</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Contacts</Link></li>
                                        <li className="breadcrumb-item active">User Grid</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* end page title */}

                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h5 className="card-title">Contact List <span className="text-muted fw-normal ms-2">(834)</span></h5>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                <div>
                                    <ul className="nav nav-pills">
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/apps-contacts-list" data-bs-toggle="tooltip" data-bs-placement="top" title="List"><i className="bx bx-list-ul"></i></Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link active" to="/apps-contacts-grid" data-bs-toggle="tooltip" data-bs-placement="top" title="Grid"><i className="bx bx-grid-alt"></i></Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <Link to="#" className="btn btn-light"><i className="bx bx-plus me-1"></i> Add New</Link>
                                </div>
                                
                                <div className="dropdown">
                                    <Link className="btn btn-link text-muted py-1 font-size-16 shadow-none dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="bx bx-dots-horizontal-rounded"></i>
                                    </Link>
                                  
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><Link className="dropdown-item" to="#">Action</Link></li>
                                        <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                        <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* end row */}

                    <div className="row">
                        <div className="col-xl-3 col-sm-6">
                            <div className="card text-center">
                                <div className="card-body">
                                    <div className="dropdown text-end">
                                        <Link className="text-muted dropdown-toggle font-size-16" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                          <i className="bx bx-dots-horizontal-rounded"></i>
                                        </Link>
                                      
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <Link className="dropdown-item" to="#">Edit</Link>
                                            <Link className="dropdown-item" to="#">Action</Link>
                                            <Link className="dropdown-item" to="#">Remove</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="mx-auto mb-4">
                                        <img src="/assets/images/users/avatar-2.jpg" alt="" className="avatar-xl rounded-circle img-thumbnail" />
                                    </div>
                                    <h5 className="font-size-16 mb-1"><Link to="#" className="text-body">Phyllis Gatlin</Link></h5>
                                    <p className="text-muted mb-2">Full Stack Developer</p>
                                    
                                </div>

                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-user me-1"></i> Profile</button>
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-envelope-alt me-1"></i> Message</button>

                                </div>
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                        <div className="col-xl-3 col-sm-6">
                            <div className="card text-center">
                                <div className="card-body">
                                    <div className="dropdown text-end">
                                        <Link className="text-muted dropdown-toggle font-size-16" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                          <i className="bx bx-dots-horizontal-rounded"></i>
                                        </Link>
                                      
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <Link className="dropdown-item" to="#">Edit</Link>
                                            <Link className="dropdown-item" to="#">Action</Link>
                                            <Link className="dropdown-item" to="#">Remove</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="mx-auto mb-4">
                                        <img src="/assets/images/users/avatar-1.jpg" alt="" className="avatar-xl rounded-circle img-thumbnail" />
                                    </div>
                                    <h5 className="font-size-16 mb-1"><Link to="#" className="text-body">James Nix</Link></h5>
                                    <p className="text-muted mb-2">Full Stack Developer</p>
                                    
                                </div>

                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-user me-1"></i> Profile</button>
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-envelope-alt me-1"></i> Message</button>

                                </div>
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                        <div className="col-xl-3 col-sm-6">
                            <div className="card text-center">
                                <div className="card-body">
                                    <div className="dropdown text-end">
                                        <Link className="text-muted dropdown-toggle font-size-16" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                          <i className="bx bx-dots-horizontal-rounded"></i>
                                        </Link>
                                      
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <Link className="dropdown-item" to="#">Edit</Link>
                                            <Link className="dropdown-item" to="#">Action</Link>
                                            <Link className="dropdown-item" to="#">Remove</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="mx-auto mb-4">
                                        <img src="/assets/images/users/avatar-3.jpg" alt="" className="avatar-xl rounded-circle img-thumbnail" />
                                    </div>
                                    <h5 className="font-size-16 mb-1"><Link to="#" className="text-body">Darlene Smith</Link></h5>
                                    <p className="text-muted mb-2">UI/UX Designer</p>
                                    
                                </div>

                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-user me-1"></i> Profile</button>
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-envelope-alt me-1"></i> Message</button>
                                </div>
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                        <div className="col-xl-3 col-sm-6">
                            <div className="card text-center">
                                <div className="card-body">
                                    <div className="dropdown text-end">
                                        <Link className="text-muted dropdown-toggle font-size-16" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                          <i className="bx bx-dots-horizontal-rounded"></i>
                                        </Link>
                                      
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <Link className="dropdown-item" to="#">Edit</Link>
                                            <Link className="dropdown-item" to="#">Action</Link>
                                            <Link className="dropdown-item" to="#">Remove</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="avatar-xl mx-auto mb-4">
                                        <div className="avatar-title bg-light-subtle text-light display-4 m-0 rounded-circle">
                                            <i className="bx bxs-user-circle"></i>
                                        </div>
                                    </div>
                                    <h5 className="font-size-16 mb-1"><Link to="#" className="text-body">William Swift</Link></h5>
                                    <p className="text-muted mb-2">Backend Developer</p>
                                    
                                </div>

                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-user me-1"></i> Profile</button>
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-envelope-alt me-1"></i> Message</button>

                                </div>
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}

                        <div className="col-xl-3 col-sm-6">
                            <div className="card text-center">
                                <div className="card-body">
                                    <div className="dropdown text-end">
                                        <Link className="text-muted dropdown-toggle font-size-16" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                          <i className="bx bx-dots-horizontal-rounded"></i>
                                        </Link>
                                      
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <Link className="dropdown-item" to="#">Edit</Link>
                                            <Link className="dropdown-item" to="#">Action</Link>
                                            <Link className="dropdown-item" to="#">Remove</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="avatar-xl mx-auto mb-4">
                                        <div className="avatar-title bg-light-subtle text-light display-4 m-0 rounded-circle">
                                            <i className="bx bxs-user-circle"></i>
                                        </div>
                                    </div>
                                    <h5 className="font-size-16 mb-1"><Link to="#" className="text-body">Kevin West</Link></h5>
                                    <p className="text-muted mb-2">Full Stack Developer</p>
                                    
                                </div>

                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-user me-1"></i> Profile</button>
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-envelope-alt me-1"></i> Message</button>

                                </div>
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                        <div className="col-xl-3 col-sm-6">
                            <div className="card text-center">
                                <div className="card-body">
                                    <div className="dropdown text-end">
                                        <Link className="text-muted dropdown-toggle font-size-16" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                          <i className="bx bx-dots-horizontal-rounded"></i>
                                        </Link>
                                      
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <Link className="dropdown-item" to="#">Edit</Link>
                                            <Link className="dropdown-item" to="#">Action</Link>
                                            <Link className="dropdown-item" to="#">Remove</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="mx-auto mb-4">
                                        <img src="/assets/images/users/avatar-6.jpg" alt="" className="avatar-xl rounded-circle img-thumbnail" />
                                    </div>
                                    <h5 className="font-size-16 mb-1"><Link to="#" className="text-body">Tommy Hayes</Link></h5>
                                    <p className="text-muted mb-2">Backend Developer</p>
                                    
                                </div>

                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-user me-1"></i> Profile</button>
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-envelope-alt me-1"></i> Message</button>

                                </div>
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                        <div className="col-xl-3 col-sm-6">
                            <div className="card text-center">
                                <div className="card-body">
                                    <div className="dropdown text-end">
                                        <Link className="text-muted dropdown-toggle font-size-16" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                          <i className="bx bx-dots-horizontal-rounded"></i>
                                        </Link>
                                      
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <Link className="dropdown-item" to="#">Edit</Link>
                                            <Link className="dropdown-item" to="#">Action</Link>
                                            <Link className="dropdown-item" to="#">Remove</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="mx-auto mb-4">
                                        <img src="/assets/images/users/avatar-8.jpg" alt="" className="avatar-xl rounded-circle img-thumbnail" />
                                    </div>
                                    <h5 className="font-size-16 mb-1"><Link to="#" className="text-body">Diana Owens</Link></h5>
                                    <p className="text-muted mb-2">UI/UX Designer</p>
                                    
                                </div>

                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-user me-1"></i> Profile</button>
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-envelope-alt me-1"></i> Message</button>
                                </div>
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                        <div className="col-xl-3 col-sm-6">
                            <div className="card text-center">
                                <div className="card-body">
                                    <div className="dropdown text-end">
                                        <Link className="text-muted dropdown-toggle font-size-16" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                          <i className="bx bx-dots-horizontal-rounded"></i>
                                        </Link>
                                      
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <Link className="dropdown-item" to="#">Edit</Link>
                                            <Link className="dropdown-item" to="#">Action</Link>
                                            <Link className="dropdown-item" to="#">Remove</Link>
                                        </div>
                                    </div>
                                    
                                    <div className="mx-auto mb-4">
                                        <img src="/assets/images/users/avatar-9.jpg" alt="" className="avatar-xl rounded-circle img-thumbnail" />
                                    </div>
                                    <h5 className="font-size-16 mb-1"><Link to="#" className="text-body">Paul Sanchez</Link></h5>
                                    <p className="text-muted mb-2">Full Stack Developer</p>
                                    
                                </div>

                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-user me-1"></i> Profile</button>
                                    <button type="button" className="btn btn-outline-light text-truncate"><i className="uil uil-envelope-alt me-1"></i> Message</button>

                                </div>
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                        
                    </div>
                    {/* end row */}

                    <div className="row g-0 align-items-center mb-4">
                        <div className="col-sm-6">
                            <div>
                                <p className="mb-sm-0">Showing 1 to 10 of 57 entries</p>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="float-sm-end">
                                <ul className="pagination mb-sm-0">
                                    <li className="page-item disabled">
                                        <Link to="#" className="page-link"><i className="mdi mdi-chevron-left"></i></Link>
                                    </li>
                                    <li className="page-item">
                                        <Link to="#" className="page-link">1</Link>
                                    </li>
                                    <li className="page-item active">
                                        <Link to="#" className="page-link">2</Link>
                                    </li>
                                    <li className="page-item">
                                        <Link to="#" className="page-link">3</Link>
                                    </li>
                                    <li className="page-item">
                                        <Link to="#" className="page-link">4</Link>
                                    </li>
                                    <li className="page-item">
                                        <Link to="#" className="page-link">5</Link>
                                    </li>
                                    <li className="page-item">
                                        <Link to="#" className="page-link"><i className="mdi mdi-chevron-right"></i></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* end row */}
                    
                </div> {/* container-fluid */}
            </div>
            {/* End Page-content */}
        </React.Fragment>
    );
};

export default ContactsGrid;
