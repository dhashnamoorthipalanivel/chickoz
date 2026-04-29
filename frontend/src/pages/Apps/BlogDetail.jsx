import React from 'react';
import { Link } from 'react-router-dom';

const BlogDetail = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Blog Details</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Blog</Link></li>
                                        <li className="breadcrumb-item active">Blog Details</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* end page title */}

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="">
                                        <div className="text-center mb-3">
                                            <h4>Beautiful Day with Friends</h4>
                                        </div>
                                        <div className="mb-4">
                                            <img src="/assets/images/small/img-2.jpg" alt="" className="img-thumbnail mx-auto d-block" />
                                        </div>

                                        <div className="text-center">
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <div>
                                                        <h6 className="mb-2">Categories</h6>
                                                        <p className="text-muted font-size-15">Project</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className="mt-4 mt-sm-0">
                                                        <h6 className="mb-2">Date</h6>
                                                        <p className="text-muted font-size-15">20 June, 2022</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className="mt-4 mt-sm-0">
                                                        <p className="text-muted mb-2">Post by</p>
                                                        <h5 className="font-size-15">Gilbert Smith</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />

                                        <div className="mt-4">
                                            <div className="text-muted font-size-14">
                                                <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam enim ad minima veniam quis</p>

                                                <p className="mb-4">Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt</p>

                                                <blockquote className="p-4 border-light border rounded mb-4">
                                                    <div className="d-flex">
                                                        <div className="me-3">
                                                            <i className="bx bxs-quote-alt-left text-body font-size-24"></i>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0"> At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium deleniti atque corrupti quos dolores et quas molestias excepturi sint quidem rerum facilis est</p>
                                                        </div>
                                                    </div>

                                                </blockquote>

                                                <p>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit</p>


                                                <div className="mt-4">
                                                    <h5 className="mb-3">Title: </h5>

                                                    <div>
                                                        <div className="row">
                                                            <div className="col-lg-4 col-sm-6">
                                                                <div>
                                                                    <ul className="ps-4">
                                                                        <li className="py-1">Donec sodales sagittis</li>
                                                                        <li className="py-1">Sed consequat leo eget</li>
                                                                        <li className="py-1">Aliquam lorem ante</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 col-sm-6">
                                                                <div>
                                                                    <ul className="ps-4">
                                                                        <li className="py-1">Aenean ligula eget</li>
                                                                        <li className="py-1">Cum sociis natoque</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <hr />

                                            <div className="mt-5">
                                                <h5 className="font-size-15"><i className="bx bx-message-dots text-muted align-middle me-1"></i> Comments :</h5>

                                                <div>
                                                    <div className="d-flex py-3">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light text-primary">
                                                                    <i className="bx bxs-user"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h5 className="font-size-14 mb-1">Delores Williams <small className="text-muted float-end">1 hr Ago</small></h5>
                                                            <p className="text-muted">If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual</p>
                                                            <div>
                                                                <Link to="#" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex py-3 border-top">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-xs">
                                                                <img src="/assets/images/users/avatar-2.jpg" alt="" className="img-fluid d-block rounded-circle" />
                                                            </div>
                                                        </div>

                                                        <div className="flex-grow-1">
                                                            <h5 className="font-size-14 mb-1">Clarence Smith <small className="text-muted float-end">2 hrs Ago</small></h5>
                                                            <p className="text-muted">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet</p>
                                                            <div>
                                                                <Link to="#" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                                                            </div>

                                                            <div className="d-flex pt-3">
                                                                <div className="flex-shrink-0 me-3">
                                                                    <div className="avatar-xs">
                                                                        <div className="avatar-title rounded-circle bg-light text-primary">
                                                                            <i className="bx bxs-user"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex-grow-1">
                                                                    <h5 className="font-size-14 mb-1">Silvia Martinez <small className="text-muted float-end">2 hrs Ago</small></h5>
                                                                    <p className="text-muted">To take a trivial example, which of us ever undertakes laborious physical exercise</p>
                                                                    <div>
                                                                        <Link to="#" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex py-3 border-top">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-xs">
                                                                <div className="avatar-title rounded-circle bg-light text-primary">
                                                                    <i className="bx bxs-user"></i>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex-grow-1">
                                                            <h5 className="font-size-14 mb-1">Keith McCoy <small className="text-muted float-end">12 Aug</small></h5>
                                                            <p className="text-muted">Donec posuere vulputate arcu. phasellus accumsan cursus velit</p>
                                                            <div>
                                                                <Link to="#" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <hr />
                                            <div className="mt-5">
                                                <h5 className="font-size-16 mb-3">Leave a Reply:</h5>

                                                <form>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="commentname-input" className="form-label">Name</label>
                                                                <input type="text" className="form-control" id="commentname-input" placeholder="Enter name" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="commentemail-input" className="form-label">Email</label>
                                                                <input type="email" className="form-control" id="commentemail-input" placeholder="Enter email" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="commentmessage-input" className="form-label">Message</label>
                                                        <textarea className="form-control" id="commentmessage-input" placeholder="Your message..." rows="3"></textarea>
                                                    </div>

                                                    <div className="text-end">
                                                        <button type="submit" className="btn btn-primary w-sm">Submit</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* end card body */}
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}

                        <div className="col-lg-4 ">
                            <div className="row">
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

                    </div>
                </div> {/* container-fluid */}
            </div>
            {/* End Page-content */}
        </React.Fragment>
    );
};

export default BlogDetail;
