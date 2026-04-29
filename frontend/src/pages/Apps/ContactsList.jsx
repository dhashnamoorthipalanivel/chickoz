import React from 'react';
import { Link } from 'react-router-dom';

const ContactsList = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">User List</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Contacts</Link></li>
                                        <li className="breadcrumb-item active">User List</li>
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
                                            <Link className="nav-link active" to="/apps-contacts-list" data-bs-toggle="tooltip" data-bs-placement="top" title="List"><i className="bx bx-list-ul"></i></Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/apps-contacts-grid" data-bs-toggle="tooltip" data-bs-placement="top" title="Grid"><i className="bx bx-grid-alt"></i></Link>
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

                    <div className="table-responsive mb-4">
                        <table className="table align-middle datatable dt-responsive table-check nowrap" style={{ borderCollapse: 'collapse', borderSpacing: '0 8px', width: '100%' }}>
                            <thead>
                              <tr>
                                <th scope="col" style={{ width: '50px' }}>
                                    <div className="form-check font-size-16">
                                        <input type="checkbox" className="form-check-input" id="checkAll" />
                                        <label className="form-check-label" htmlFor="checkAll"></label>
                                    </div>
                                </th>
                                <th scope="col">Name</th>
                                <th scope="col">Position</th>
                                <th scope="col">Email</th>
                                <th scope="col">Tags</th>
                                <th style={{ width: '80px', minWidth: '80px' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck1" />
                                            <label className="form-check-label" htmlFor="contacusercheck1"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <img src="/assets/images/users/avatar-2.jpg" alt="" className="avatar-sm rounded-circle me-2" />
                                        <Link to="#" className="text-body">Phyllis Gatlin</Link>
                                    </td>
                                    <td>UI/UX Designer</td>
                                    <td>phyllisgatlin@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary">Photoshop</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary">illustrator</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck2" />
                                            <label className="form-check-label" htmlFor="contacusercheck2"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <img src="/assets/images/users/avatar-1.jpg" alt="" className="avatar-sm rounded-circle me-2" />
                                        <Link to="#" className="text-body">James Nix</Link>
                                    </td>
                                    <td>Frontend Developer</td>
                                    <td>jamesnix@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Html</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Css</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">2 + more</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck3" />
                                            <label className="form-check-label" htmlFor="contacusercheck3"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <img src="/assets/images/users/avatar-3.jpg" alt="" className="avatar-sm rounded-circle me-2" />
                                        <Link to="#" className="text-body">Darlene Smith</Link>
                                    </td>
                                    <td>Backend Developer</td>
                                    <td>darlenesmith@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Php</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Java</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Python</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck4" />
                                            <label className="form-check-label" htmlFor="contacusercheck4"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <div className="avatar-sm d-inline-block align-middle me-2">
                                            <div className="avatar-title bg-light-subtle text-light font-size-24 m-0 rounded-circle">
                                                <i className="bx bxs-user-circle"></i>
                                            </div>
                                        </div>
                                        <Link to="#" className="text-body">William Swift</Link>
                                    </td>
                                    <td>Full Stack Developer</td>
                                    <td>williamswift@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Ruby</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Php</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">2 + more</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck5" />
                                            <label className="form-check-label" htmlFor="contacusercheck5"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <div className="avatar-sm d-inline-block align-middle me-2">
                                            <div className="avatar-title bg-light-subtle text-light font-size-24 m-0 rounded-circle">
                                                <i className="bx bxs-user-circle"></i>
                                            </div>
                                        </div>
                                        <Link to="#" className="text-body">Kevin West</Link>
                                    </td>
                                    <td>Frontend Developer</td>
                                    <td>kevinwest@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Html</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Css</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">2 + more</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck6" />
                                            <label className="form-check-label" htmlFor="contacusercheck6"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <img src="/assets/images/users/avatar-6.jpg" alt="" className="avatar-sm rounded-circle me-2" />
                                        <Link to="#" className="text-body">Tommy Hayes</Link>
                                    </td>
                                    <td>UI/UX Designer</td>
                                    <td>tommyhayes@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Photoshop</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">illustrator</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck7" />
                                            <label className="form-check-label" htmlFor="contacusercheck7"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <img src="/assets/images/users/avatar-8.jpg" alt="" className="avatar-sm rounded-circle me-2" />
                                        <Link to="#" className="text-body">Diana Owens</Link>
                                    </td>
                                    <td>Graphic Designer</td>
                                    <td>dianaowens@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Photoshop</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">illustrator</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck8" />
                                            <label className="form-check-label" htmlFor="contacusercheck8"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <img src="/assets/images/users/avatar-9.jpg" alt="" className="avatar-sm rounded-circle me-2" />
                                        <Link to="#" className="text-body">Paul Sanchez</Link>
                                    </td>
                                    <td>Angular Developer</td>
                                    <td>paulsanchez@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Php</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Javascript</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck9" />
                                            <label className="form-check-label" htmlFor="contacusercheck9"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <img src="/assets/images/users/avatar-9.jpg" alt="" className="avatar-sm rounded-circle me-2" />
                                        <Link to="#" className="text-body">Peter Dryer</Link>
                                    </td>
                                    <td>Web Designer</td>
                                    <td>peterdryer@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Html</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Css</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">2 + more</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck10" />
                                            <label className="form-check-label" htmlFor="contacusercheck10"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <img src="/assets/images/users/avatar-4.jpg" alt="" className="avatar-sm rounded-circle me-2" />
                                        <Link to="#" className="text-body">Gerald Moyer</Link>
                                    </td>
                                    <td>Backend Developer</td>
                                    <td>geraldmoyer@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Php</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Javascript</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                        <div className="form-check font-size-16">
                                            <input type="checkbox" className="form-check-input" id="contacusercheck11" />
                                            <label className="form-check-label" htmlFor="contacusercheck11"></label>
                                        </div>
                                    </th>
                                    <td>
                                        <img src="/assets/images/users/avatar-2.jpg" alt="" className="avatar-sm rounded-circle me-2" />
                                        <Link to="#" className="text-body">Gail McGuire</Link>
                                    </td>
                                    <td>Backend Developer</td>
                                    <td>gailmcGuire@minia.com</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Php</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">Javascript</Link>
                                            <Link to="#" className="badge bg-primary-subtle text-primary font-size-11">2+ more</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                  </tr>
                            </tbody>
                        </table>
                        {/* end table */}
                    </div>
                    {/* end table responsive */}
                    
                </div> {/* container-fluid */}
            </div>
            {/* End Page-content */}
        </React.Fragment>
    );
};

export default ContactsList;
