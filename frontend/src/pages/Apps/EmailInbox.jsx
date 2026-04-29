import React from 'react';
import { Link } from 'react-router-dom';

const EmailInbox = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Email Inbox</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Email</Link></li>
                                        <li className="breadcrumb-item active">Email Inbox</li>
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
                                <button type="button" className="btn btn-danger w-100 waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#composemodal">
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
                                    <ul className="message-list">
                                        <li>
                                            <div className="col-mail col-mail-1">
                                                <div className="checkbox-wrapper-mail">
                                                    <input type="checkbox" id="chk19" />
                                                    <label htmlFor="chk19" className="toggle"></label>
                                                </div>
                                                <Link to="#" className="title">Peter, me (3)</Link><span className="star-toggle far fa-star"></span>
                                            </div>
                                            <div className="col-mail col-mail-2">
                                                <Link to="#" className="subject">Hello – <span className="teaser">Trip home from Colombo has been arranged, then Jenna will come get me from Stockholm. :)</span>
                                                </Link>
                                                <div className="date">Mar 6</div>
                                            </div>
                                        </li>
            
                                        <li>
                                            <div className="col-mail col-mail-1">
                                                <div className="checkbox-wrapper-mail">
                                                    <input type="checkbox" id="chk20" />
                                                    <label htmlFor="chk20" className="toggle"></label>
                                                </div>
                                                <Link to="#" className="title">me, Susanna (7)</Link><span className="star-toggle far fa-star"></span>
                                            </div>
                                            <div className="col-mail col-mail-2">
                                                <Link to="#" className="subject"><span className="bg-warning badge me-2">Freelance</span>Since you asked... and i'm
                                                    inconceivably bored at the train station –
                                                    <span className="teaser">Alright thanks. I'll have to re-book that somehow, i'll get back to you.</span>
                                                </Link>
                                                <div className="date">Mar 6</div>
                                            </div>
                                        </li>
    
                                        <li>
                                            <div className="col-mail col-mail-1">
                                                <div className="checkbox-wrapper-mail">
                                                    <input type="checkbox" id="chk6" />
                                                    <label htmlFor="chk6" className="toggle"></label>
                                                </div>
                                                <Link to="#" className="title">Web Support Dennis</Link><span className="star-toggle far fa-star"></span>
                                            </div>
                                            <div className="col-mail col-mail-2">
                                                <Link to="#" className="subject">Re: New mail settings – 
                                                    <span className="teaser">Will you answer him asap?</span>
                                                </Link>
                                                <div className="date">Mar 7</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="col-mail col-mail-1">
                                                <div className="checkbox-wrapper-mail">
                                                    <input type="checkbox" id="chk7" />
                                                    <label htmlFor="chk7" className="toggle"></label>
                                                </div>
                                                <Link to="#" className="title">me, Peter (2)</Link><span className="star-toggle far fa-star"></span>
                                            </div>
                                            <div className="col-mail col-mail-2">
                                                <Link to="#" className="subject"><span className="bg-info badge me-2">Support</span>Off on Thursday - 
                                                    <span className="teaser">Eff that place, you might as well stay here with us instead! Sent from my iPhone 4  4 mar 2014 at 5:55 pm</span>
                                                </Link>
                                                <div className="date">Mar 4</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="col-mail col-mail-1">
                                                <div className="checkbox-wrapper-mail">
                                                    <input type="checkbox" id="chk8" />
                                                    <label htmlFor="chk8" className="toggle"></label>
                                                </div>
                                                <Link to="#" className="title">Medium</Link><span className="star-toggle far fa-star"></span>
                                            </div>
                                            <div className="col-mail col-mail-2">
                                                <Link to="#" className="subject"><span className="bg-primary badge me-2">Social</span>This Week's Top Stories – 
                                                    <span className="teaser">Our top pick for you on Medium this week The Man Who Destroyed America’s Ego</span>
                                                </Link>
                                                <div className="date">Feb 28</div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="col-mail col-mail-1">
                                                <div className="checkbox-wrapper-mail">
                                                    <input type="checkbox" id="chk9" />
                                                    <label htmlFor="chk9" className="toggle"></label>
                                                </div>
                                                <Link to="#" className="title">Death to Stock</Link><span className="star-toggle far fa-star"></span>
                                            </div>
                                            <div className="col-mail col-mail-2">
                                                <Link to="#" className="subject">Montly High-Res Photos – 
                                                    <span className="teaser">To create this month's pack, we hosted a party with local musician Jared Mahone here in Columbus, Ohio.</span>
                                                </Link>
                                                <div className="date">Feb 28</div>
                                            </div>
                                        </li>
    
                                        <li className="unread">
                                            <div className="col-mail col-mail-1">
                                                <div className="checkbox-wrapper-mail">
                                                    <input type="checkbox" id="chk3" />
                                                    <label htmlFor="chk3" className="toggle"></label>
                                                </div>
                                                <Link to="#" className="title">Randy, me (5)</Link><span className="star-toggle far fa-star"></span>
                                            </div>
                                            <div className="col-mail col-mail-2">
                                                <Link to="#" className="subject"><span className="bg-success badge me-2">Family</span>Last pic over my village – 
                                                    <span className="teaser">Yeah i'd like that! Do you remember the video you showed me of your train ride between Colombo and Kandy? The one with the mountain view? I would love to see that one again!</span>
                                                </Link>
                                                <div className="date">5:01 am</div>
                                            </div>
                                        </li>
                                    </ul>
    
                                </div> {/* card */}
    
                                <div className="row">
                                    <div className="col-7">
                                        Showing 1 - 20 of 1,524
                                    </div>
                                    <div className="col-5">
                                        <div className="btn-group float-end">
                                            <button type="button" className="btn btn-sm btn-success waves-effect"><i className="fa fa-chevron-left"></i></button>
                                            <button type="button" className="btn btn-sm btn-success waves-effect"><i className="fa fa-chevron-right"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div> {/* end Col-9 */}
    
                        </div>
    
                    </div>{/* End row */}
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

export default EmailInbox;
