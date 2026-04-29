import React from 'react';
import { Link } from 'react-router-dom';

const EmailRead = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Read Email</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Email</Link></li>
                                        <li className="breadcrumb-item active">Read Email</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* end page title */}

                    <div className="row">
                        <div className="col-12">
                            {/* Left sidebar */}
                            <div className="email-leftbar card">
                                <button type="button" className="btn btn-danger btn-block w-100 waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#composemodal">
                                    Compose
                                </button>
                                <div className="mail-list mt-4">
                                    <Link to="#" className="active"><i className="mdi mdi-email-outline me-2"></i> Inbox <span className="ms-1 float-end">(18)</span></Link>
                                    <Link to="#"><i className="mdi mdi-star-outline me-2"></i>Starred</Link>
                                    <Link to="#"><i className="mdi mdi-diamond-stone me-2"></i>Important</Link>
                                    <Link to="#"><i className="mdi mdi-file-outline me-2"></i>Draft</Link>
                                    <Link to="#"><i className="mdi mdi-email-check-outline me-2"></i>Sent Mail</Link>
                                    <Link to="#"><i className="mdi mdi-trash-can-outline me-2"></i>Trash</Link>
                                </div>

                                <h6 className="mt-4">Labels</h6>

                                <div className="mail-list mt-1">
                                    <Link to="#"><span className="mdi mdi-arrow-right-drop-circle text-info float-end"></span>Theme Support</Link>
                                    <Link to="#"><span className="mdi mdi-arrow-right-drop-circle text-warning float-end"></span>Freelance</Link>
                                    <Link to="#"><span className="mdi mdi-arrow-right-drop-circle text-primary float-end"></span>Social</Link>
                                    <Link to="#"><span className="mdi mdi-arrow-right-drop-circle text-danger float-end"></span>Friends</Link>
                                    <Link to="#"><span className="mdi mdi-arrow-right-drop-circle text-success float-end"></span>Family</Link>
                                </div>

                                <h6 className="mt-4">Chat</h6>

                                <div className="mt-2">
                                    <Link to="#" className="d-flex align-items-start">
                                        <img className="flex-shrink-0 me-3 rounded-circle" src="/assets/images/users/avatar-2.jpg" alt="Generic placeholder" height="36" />
                                        <div className="flex-grow-1 chat-user-box">
                                            <p className="user-title m-0">Scott Median</p>
                                            <p className="text-muted">Hello</p>
                                        </div>
                                    </Link>
    
                                    <Link to="#" className="d-flex align-items-start">
                                        <img className="flex-shrink-0 me-3 rounded-circle" src="/assets/images/users/avatar-3.jpg" alt="Generic placeholder" height="36" />
                                        <div className="flex-grow-1 chat-user-box">
                                            <p className="user-title m-0">Julian Rosa</p>
                                            <p className="text-muted">What about our next..</p>
                                        </div>
                                    </Link>
    
                                    <Link to="#" className="d-flex align-items-start">
                                        <img className="flex-shrink-0 me-3 rounded-circle" src="/assets/images/users/avatar-4.jpg" alt="Generic placeholder" height="36" />
                                        <div className="flex-grow-1 chat-user-box">
                                            <p className="user-title m-0">David Medina</p>
                                            <p className="text-muted">Yeah everything is fine</p>
                                        </div>
                                    </Link>
    
                                    <Link to="#" className="d-flex align-items-start">
                                        <img className="flex-shrink-0 me-3 rounded-circle" src="/assets/images/users/avatar-6.jpg" alt="Generic placeholder" height="36" />
                                        <div className="flex-grow-1 chat-user-box">
                                            <p className="user-title m-0">Jay Baker</p>
                                            <p className="text-muted">Wow that's great</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {/* End Left sidebar */}

                            {/* Right Sidebar */}
                            <div className="email-rightbar mb-3">

                                <div className="card">
                                    <div className="btn-toolbar gap-2 p-3" role="toolbar">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-primary waves-light waves-effect"><i className="fa fa-inbox"></i></button>
                                            <button type="button" className="btn btn-primary waves-light waves-effect"><i className="fa fa-exclamation-circle"></i></button>
                                            <button type="button" className="btn btn-primary waves-light waves-effect"><i className="far fa-trash-alt"></i></button>
                                        </div>
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-primary waves-light waves-effect dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-folder"></i> <i className="mdi mdi-chevron-down ms-1"></i>
                                            </button>
                                            <div className="dropdown-menu">
                                                <Link className="dropdown-item" to="#">Updates</Link>
                                                <Link className="dropdown-item" to="#">Social</Link>
                                                <Link className="dropdown-item" to="#">Team Manage</Link>
                                            </div>
                                        </div>
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-primary waves-light waves-effect dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-tag"></i> <i className="mdi mdi-chevron-down ms-1"></i>
                                            </button>
                                            <div className="dropdown-menu">
                                                <Link className="dropdown-item" to="#">Updates</Link>
                                                <Link className="dropdown-item" to="#">Social</Link>
                                                <Link className="dropdown-item" to="#">Team Manage</Link>
                                            </div>
                                        </div>

                                        <div className="btn-group">
                                            <button type="button" className="btn btn-primary waves-light waves-effect dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                More <i className="mdi mdi-dots-vertical ms-2"></i>
                                            </button>
                                            <div className="dropdown-menu">
                                                <Link className="dropdown-item" to="#">Mark as Unread</Link>
                                                <Link className="dropdown-item" to="#">Mark as Important</Link>
                                                <Link className="dropdown-item" to="#">Add to Tasks</Link>
                                                <Link className="dropdown-item" to="#">Add Star</Link>
                                                <Link className="dropdown-item" to="#">Mute</Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="flex-shrink-0 me-3">
                                                <img className="rounded-circle avatar-sm" src="/assets/images/users/avatar-2.jpg" alt="Generic placeholder" />
                                            </div>
                                            <div className="flex-grow-1">
                                                <h5 className="font-size-14 mb-0">Humberto D. Champion</h5>
                                                <small className="text-muted">support@domain.com</small>
                                            </div>
                                        </div>

                                        <h4 className="font-size-16">This Week's Top Stories</h4>

                                        <p>Dear Lorem Ipsum,</p>
                                        <p>Praesent dui ex, dapibus eget mauris ut, finibus vestibulum enim. Quisque arcu leo, facilisis in fringilla id, luctus in tortor. Nunc vestibulum est quis orci varius viverra. Curabitur dictum volutpat massa vulputate molestie. In at felis ac velit maximus convallis.
                                        </p>
                                        <p>Sed elementum turpis eu lorem interdum, sed porttitor eros commodo. Nam eu venenatis tortor, id lacinia diam. Sed aliquam in dui et porta. Sed bibendum orci non tincidunt ultrices. Vivamus fringilla, mi lacinia dapibus condimentum, ipsum urna lacinia lacus, vel tincidunt mi nibh sit amet lorem.</p>
                                        <p>Sincerly,</p>
                                        <hr/>

                                        <div className="row">
                                            <div className="col-xl-2 col-6">
                                                <div className="card">
                                                    <img className="card-img-top img-fluid" src="/assets/images/small/img-3.jpg" alt="Card cap" />
                                                    <div className="py-2 text-center">
                                                        <a download="img-3.jpg" href="/assets/images/small/img-3.jpg" className="fw-medium">Download</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-2 col-6">
                                                <div className="card">
                                                    <img className="card-img-top img-fluid" src="/assets/images/small/img-4.jpg" alt="Card cap" />
                                                    <div className="py-2 text-center">
                                                        <a download="img-4.jpg" href="/assets/images/small/img-4.jpg" className="fw-medium">Download</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to="#" className="btn btn-secondary waves-effect mt-4"><i className="mdi mdi-reply me-1"></i> Reply</Link>
                                    </div>

                                </div>
                            </div>
                            {/* card */}

                        </div>
                        {/* end Col */}

                    </div>
                    {/* end row */}
                    
                </div> {/* container-fluid */}
            </div>
            {/* End Page-content */}

            {/* Modal */}
            <div className="modal fade" id="composemodal" tabIndex="-1" role="dialog" aria-labelledby="composemodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title font-size-16" id="composemodalTitle">New Message</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="mb-3">
                                    <input type="email" className="form-control" placeholder="To" />
                                </div>

                                <div className="mb-3">
                                    <input type="text" className="form-control" placeholder="Subject" />
                                </div>
                                <div className="mb-3 email-editor">
                                    <div id="email-editor"></div>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Send <i className="fab fa-telegram-plane ms-1"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            {/* end modal */}
            
        </React.Fragment>
    );
};

export default EmailRead;
