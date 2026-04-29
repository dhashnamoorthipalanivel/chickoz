import React from 'react';
import { Link } from 'react-router-dom';

const BlogList = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Blog List</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Blog</Link></li>
                                        <li className="breadcrumb-item active">Blog List</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* end page title */}

                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h5 className="card-title">Blog List <span className="text-muted fw-normal ms-2">(535)</span></h5>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                <div>
                                    <ul className="nav nav-pills">
                                        <li className="nav-item">
                                            <Link className="nav-link active" to="/apps-blog-list" data-bs-toggle="tooltip" data-bs-placement="top" title="List"><i className="bx bx-list-ul"></i></Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/apps-blog-grid" data-bs-toggle="tooltip" data-bs-placement="top" title="Grid"><i className="bx bx-grid-alt"></i></Link>
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
                        <div className="col-xl-8">
                            <div className="card">
                                <img src="/assets/images/small/img-3.jpg" alt="" className="img-fluid" />
                                <div className="card-body">
                                    <p className="text-muted mb-2">16 June, 2022</p>
                                    <h5 className=""><Link to="#" className="text-body">Coffee with friends</Link></h5>
                                    <p className="mb-0 font-size-15">Contrary to popular belief, Lorem Ipsum is not simply random text,a Latin professor at Hampden-Sydney College in Virginia.</p>
                                    <div className="mt-3">
                                        <Link to="#" className="align-middle font-size-15">Read more <i className="mdi mdi-chevron-right"></i></Link>
                                    </div>
                                </div>
                            </div> {/* end card */}

                            <div className="card">
                                <img src="/assets/images/small/img-5.jpg" alt="" className="img-fluid" />
                                <div className="card-body">
                                    <p className="text-muted mb-2">22 May, 2022</p>
                                    <h5 className=""><Link to="#" className="text-body">Working day with our new ideas</Link></h5>
                                    <p className="mb-0 font-size-15">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
                                    <div className="mt-3">
                                        <Link to="#" className="align-middle font-size-15">Read more <i className="mdi mdi-chevron-right"></i></Link>
                                    </div>
                                </div>
                            </div> {/* end card */}

                            <div className="card">
                                <img src="/assets/images/small/img-1.jpg" alt="" className="img-fluid" />
                                <div className="card-body">
                                    <p className="text-muted mb-2">12 june, 2022</p>
                                    <h5 className=""><Link to="#" className="text-body">Project discussion with team</Link></h5>
                                    <p className="mb-0 font-size-15">Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words.</p>
                                    <div className="mt-3">
                                        <Link to="#" className="align-middle font-size-15">Read more <i className="mdi mdi-chevron-right"></i></Link>
                                    </div>
                                </div>
                            </div> {/* end card */}
                        </div>
                        {/* end col */}

                        <div className="col-xl-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="search-box">
                                        <h5 className="mb-3">Search</h5>
                                        <div className="position-relative px-2">
                                            <input type="text" className="form-control rounded bg-light border-light" placeholder="Search..." />
                                            <i className="mdi mdi-magnify search-icon"></i>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <h5 className="mb-3">Categories</h5>
                                        <ul className="list-unstyled fw-medium px-2">
                                            <li><Link to="#" className="text-body pb-3 d-block border-bottom">Design<span className="badge bg-primary-subtle text-primary rounded-pill ms-1 float-end font-size-12">02</span></Link></li>
                                            <li><Link to="#" className="text-body py-3 d-block border-bottom">Development <span className="badge bg-primary-subtle text-primary rounded-pill float-end ms-1 font-size-12">04</span></Link></li>
                                            <li><Link to="#" className="text-body py-3 d-block border-bottom">Business<span className="badge bg-primary-subtle text-primary rounded-pill ms-1 float-end font-size-12">12</span></Link></li>
                                            <li><Link to="#" className="text-body py-3 d-block border-bottom">Project<span className="badge bg-primary-subtle text-primary rounded-pill ms-1 float-end font-size-12">08</span></Link></li>
                                            <li><Link to="#" className="text-body pt-3 pb-0 d-block">Travel<span className="badge bg-primary-subtle text-primary rounded-pill ms-1 float-end font-size-12">10</span></Link></li>
                                        </ul>
                                    </div>
                                    <div className="mt-5">
                                        <h5 className="mb-3">Upcoming Post</h5>
                                        <div className="list-group list-group-flush">
                                            <Link to="#" className="list-group-item text-muted pb-3 pt-0 px-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <img src="/assets/images/small/img-7.jpg" alt="" className="avatar-lg h-auto d-block rounded" />
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-13 text-truncate">Beautiful Day with Friends</h5>
                                                        <p className="mb-0 text-truncate">20 August, 2022 <span className="">/ 05:00 AM</span></p>
                                                    </div>
                                                    <div className="fs-1">
                                                        <i className="mdi mdi-calendar"></i>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to="#" className="list-group-item text-muted py-3 px-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <img src="/assets/images/small/img-2.jpg" alt="" className="avatar-lg h-auto d-block rounded" />
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-13 text-truncate">Drawing a sketch</h5>
                                                        <p className="mb-0 text-truncate">20 August, 2022 <span className="">/ 05:05 AM</span></p>
                                                    </div>
                                                    <div className="fs-1">
                                                        <i className="mdi mdi-calendar"></i>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to="#" className="list-group-item text-muted py-3 px-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <img src="/assets/images/small/img-6.jpg" alt="" className="avatar-lg h-auto d-block rounded" />
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-13 text-truncate">Project discussion with team</h5>
                                                        <p className="mb-0 text-truncate">20 August, 2022 <span className="">/ 05:10 PM</span></p>
                                                    </div>
                                                    <div className="fs-1">
                                                        <i className="mdi mdi-calendar"></i>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to="#" className="list-group-item text-muted py-3 px-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <img src="/assets/images/small/img-1.jpg" alt="" className="avatar-lg h-auto d-block rounded" />
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-13 text-truncate">Coffee with friends</h5>
                                                        <p className="mb-0 text-truncate">20 August, 2022 <span className="">/ 05:30 PM</span></p>
                                                    </div>
                                                    <div className="fs-1">
                                                        <i className="mdi mdi-calendar"></i>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="mb-3">Popular Post</h5>
                                        <div className="list-group list-group-flush">

                                            <Link to="#" className="list-group-item text-muted pb-3 pt-0 px-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <img src="/assets/images/small/img-3.jpg" alt="" className="avatar-xl h-auto d-block rounded" />
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-13 text-truncate">Beautiful Day with Friends</h5>
                                                        <p className="mb-0 text-truncate">10 Apr, 2022</p>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to="#" className="list-group-item text-muted py-3 px-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <img src="/assets/images/small/img-4.jpg" alt="" className="avatar-xl h-auto d-block rounded" />
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-13 text-truncate">Drawing a sketch</h5>
                                                        <p className="mb-0 text-truncate">24 May, 2022</p>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to="#" className="list-group-item text-muted py-3 px-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <img src="/assets/images/small/img-1.jpg" alt="" className="avatar-xl h-auto d-block rounded" />
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="font-size-13 text-truncate">Coffee with friends</h5>
                                                        <p className="mb-0 text-truncate">15 June, 2022</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="mb-3">Tag Clouds</h5>
                                        <div className="px-2">
                                            <Link to="#" className="font-size-17"><span className="badge bg-primary-subtle text-primary">Design</span></Link>
                                            <Link to="#" className="font-size-17"><span className="badge bg-primary-subtle text-primary">Development</span></Link>
                                            <Link to="#" className="font-size-17"><span className="badge bg-primary-subtle text-primary">Wordpress</span></Link>
                                            <Link to="#" className="font-size-17"><span className="badge bg-primary-subtle text-primary">HTML</span></Link>
                                            <Link to="#" className="font-size-17"><span className="badge bg-primary-subtle text-primary">Project</span></Link>
                                            <Link to="#" className="font-size-17"><span className="badge bg-primary-subtle text-primary">Business</span></Link>
                                            <Link to="#" className="font-size-17"><span className="badge bg-primary-subtle text-primary">Travel</span></Link>
                                            <Link to="#" className="font-size-17"><span className="badge bg-primary-subtle text-primary">Photography</span></Link>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="mb-3">Instagram Post</h5>
                                        <div className="gap-2 hstack flex-wrap px-2">
                                            <img src="/assets/images/small/img-3.jpg" alt="" className="avatar-xl rounded" />
                                            <img src="/assets/images/small/img-1.jpg" alt="" className="avatar-xl rounded" />
                                            <img src="/assets/images/small/img-2.jpg" alt="" className="avatar-xl rounded" />
                                            <img src="/assets/images/small/img-4.jpg" alt="" className="avatar-xl rounded" />
                                            <img src="/assets/images/small/img-5.jpg" alt="" className="avatar-xl rounded" />
                                            <img src="/assets/images/small/img-6.jpg" alt="" className="avatar-xl rounded" />
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="mb-3">Email Newsletter</h5>
                                        <div className="">
                                            <div className="input-group mb-0 px-2">
                                                <input type="text" className="form-control" placeholder="Enter Email" />
                                                <div className="input-group-append">
                                                    <span className="input-group-text"><i className="mdi mdi-send-outline"></i></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> {/* end card */}
                        </div>
                    </div>
                    {/* end row */}

                    <div className="row justify-content-center mb-4">
                        <div className="col-md-3">
                            <div className="">
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

export default BlogList;
