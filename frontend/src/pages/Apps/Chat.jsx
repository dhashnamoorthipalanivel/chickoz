import React from 'react';
import { Link } from 'react-router-dom';

const Chat = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Chat</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Apps</Link></li>
                                        <li className="breadcrumb-item active">Chat</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* end page title */}

                    <div className="d-lg-flex">
                        <div className="chat-leftsidebar card">
                            <div className="p-3 px-4 border-bottom">
                                <div className="d-flex align-items-start ">
                                    <div className="flex-shrink-0 me-3 align-self-center">
                                        <img src="/assets/images/users/avatar-1.jpg" className="avatar-sm rounded-circle" alt="" />
                                    </div>
                                    
                                    <div className="flex-grow-1">
                                        <h5 className="font-size-16 mb-1"><Link to="#" className="text-dark">Shawn <i className="mdi mdi-circle text-success align-middle font-size-10 ms-1"></i></Link></h5>
                                        <p className="text-muted mb-0">Available</p>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <div className="dropdown chat-noti-dropdown">
                                            <button className="btn dropdown-toggle p-0" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <Link className="dropdown-item" to="#">Profile</Link>
                                                <Link className="dropdown-item" to="#">Edit</Link>
                                                <Link className="dropdown-item" to="#">Add Contact</Link>
                                                <Link className="dropdown-item" to="#">Setting</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3">
                                <div className="search-box position-relative">
                                    <input type="text" className="form-control rounded border" placeholder="Search..." />
                                    <i className="bx bx-search search-icon"></i>
                                </div>
                            </div>

                            <div className="chat-leftsidebar-nav">
                                <ul className="nav nav-pills nav-justified bg-light-subtle  p-1">
                                    <li className="nav-item">
                                        <a href="#chat" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
                                            <i className="bx bx-chat font-size-20 d-sm-none"></i>
                                            <span className="d-none d-sm-block">Chat</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#groups" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                                            <i className="bx bx-group font-size-20 d-sm-none"></i>
                                            <span className="d-none d-sm-block">Groups</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#contacts" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                                            <i className="bx bx-book-content font-size-20 d-sm-none"></i>
                                            <span className="d-none d-sm-block">Contacts</span>
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane show active" id="chat">
                                        <div className="chat-message-list" data-simplebar>
                                            <div className="pt-3">
                                                <div className="px-3">
                                                    <h5 className="font-size-14 mb-3">Recent</h5>
                                                </div>
                                                <ul className="list-unstyled chat-list">
                                                    <li className="active">
                                                        <Link to="#">
                                                            <div className="d-flex align-items-start">
                                                                <div className="flex-shrink-0 user-img online align-self-center me-3">
                                                                    <img src="/assets/images/users/avatar-2.jpg" className="rounded-circle avatar-sm" alt="" />
                                                                    <span className="user-status"></span>
                                                                </div>
                                                                <div className="flex-grow-1 overflow-hidden">
                                                                    <h5 className="text-truncate font-size-14 mb-1">Jennie Sherlock</h5>
                                                                    <p className="text-truncate mb-0">Hey! there I'm available</p>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <div className="font-size-11">02 min</div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                    <li className="unread">
                                                        <Link to="#">
                                                            <div className="d-flex align-items-start">
                                                                <div className="flex-shrink-0 user-img online align-self-center me-3">
                                                                    <div className="avatar-sm align-self-center">
                                                                        <span className="avatar-title rounded-circle  bg-primary-subtle text-primary">
                                                                            S
                                                                        </span>
                                                                    </div>
                                                                    <span className="user-status"></span>
                                                                </div>
                                                                <div className="flex-grow-1 overflow-hidden">
                                                                    <h5 className="text-truncate font-size-14 mb-1">Stacie Dube</h5>
                                                                    <p className="text-truncate mb-0">I've finished it! See you so</p>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <div className="font-size-11">10 min</div>
                                                                </div>
                                                                <div className="unread-message">
                                                                    <span className="badge bg-danger rounded-pill">1</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to="#">
                                                            <div className="d-flex align-items-start">
                                                                <div className="flex-shrink-0 user-img away align-self-center me-3">
                                                                    <img src="/assets/images/users/avatar-3.jpg" className="rounded-circle avatar-sm" alt="" />
                                                                    <span className="user-status"></span>
                                                                </div>
                                                                <div className="flex-grow-1 overflow-hidden">
                                                                    <h5 className="text-truncate font-size-14 mb-1">Katie Olson</h5>
                                                                    <p className="text-truncate mb-0">This theme is awesome!</p>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <div className="font-size-11">22 min</div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                    {/* Other items would be rendered here in a real app (e.g. via .map) */}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane" id="groups">
                                        <div className="chat-message-list" data-simplebar>
                                            <div className="pt-3">
                                                <div className="px-3">
                                                    <h5 className="font-size-14 mb-3">Groups</h5>
                                                </div>
                                                <ul className="list-unstyled chat-list">
                                                    <li>
                                                        <Link to="#">
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0 avatar-sm me-3">
                                                                    <span className="avatar-title rounded-circle  bg-primary-subtle text-primary">
                                                                        G
                                                                    </span>
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    <h5 className="font-size-14 mb-0">General</h5>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                    {/* Other group items */}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane" id="contacts">
                                        <div className="chat-message-list" data-simplebar>
                                            <div className="pt-3">
                                                <div className="px-3">
                                                    <h5 className="font-size-14 mb-3">Contacts</h5>
                                                </div>

                                                <div>
                                                    <div>
                                                        <div className="px-3 contact-list">A</div>

                                                        <ul className="list-unstyled chat-list">
                                                            <li>
                                                                <Link to="#">
                                                                    <h5 className="font-size-14 mb-0">Adam Miller</h5>
                                                                </Link>
                                                            </li>
        
                                                            <li>
                                                                <Link to="#">
                                                                    <h5 className="font-size-14 mb-0">Alfonso Fisher</h5>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="mt-4">
                                                        <div className="px-3 contact-list">B</div>

                                                        <ul className="list-unstyled chat-list">
                                                            <li>
                                                                <Link to="#">
                                                                    <h5 className="font-size-14 mb-0">Bonnie Harney</h5>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* end chat-leftsidebar */}

                        <div className="w-100 user-chat mt-4 mt-sm-0 ms-lg-1">
                            <div className="card">
                                <div className="p-3 px-lg-4 border-bottom">
                                    <div className="row">
                                        <div className="col-xl-4 col-7">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 avatar-sm me-3 d-sm-block d-none">
                                                    <img src="/assets/images/users/avatar-2.jpg" alt="" className="img-fluid d-block rounded-circle" />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h5 className="font-size-14 mb-1 text-truncate"><Link to="#" className="text-dark">Jennie Sherlock</Link></h5>
                                                    <p className="text-muted text-truncate mb-0">Online</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-8 col-5">
                                            <ul className="list-inline user-chat-nav text-end mb-0">
                                                <li className="list-inline-item">
                                                    <div className="dropdown">
                                                        <button className="btn nav-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <i className="bx bx-search"></i>
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
                                                            <form className="px-2">
                                                                <div>
                                                                    <input type="text" className="form-control border bg-light-subtle" placeholder="Search..." />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li className="list-inline-item">
                                                    <div className="dropdown">
                                                        <button className="btn nav-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <i className="bx bx-dots-horizontal-rounded"></i>
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-end">
                                                            <Link className="dropdown-item" to="#">Profile</Link>
                                                            <Link className="dropdown-item" to="#">Archive</Link>
                                                            <Link className="dropdown-item" to="#">Muted</Link>
                                                            <Link className="dropdown-item" to="#">Delete</Link>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>                                                                                                                                                                                                                                                                                        
                                        </div>
                                    </div>
                                </div>

                                <div className="chat-conversation p-3 px-2" data-simplebar>
                                    <ul className="list-unstyled mb-0">
                                        <li className="chat-day-title"> 
                                            <span className="title">Today</span>
                                        </li>
                                        <li>
                                            <div className="conversation-list">
                                                <div className="ctext-wrap">
                                                    <div className="ctext-wrap-content">
                                                        <h5 className="conversation-name"><Link to="#" className="user-name">Jennie Sherlock</Link> <span className="time">10:00</span></h5>
                                                        <p className="mb-0">Good morning !</p>
                                                    </div>
                                                    <div className="dropdown align-self-start">
                                                        <Link className="dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <i className="bx bx-dots-vertical-rounded"></i>
                                                        </Link>
                                                        <div className="dropdown-menu">
                                                            <Link className="dropdown-item" to="#">Copy</Link>
                                                            <Link className="dropdown-item" to="#">Save</Link>
                                                            <Link className="dropdown-item" to="#">Forward</Link>
                                                            <Link className="dropdown-item" to="#">Delete</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </li>

                                        <li className="right">
                                            <div className="conversation-list">
                                                <div className="ctext-wrap">
                                                    <div className="ctext-wrap-content">
                                                        <h5 className="conversation-name"><Link to="#" className="user-name">Shawn</Link> <span className="time">10:02</span></h5>
                                                        <p className="mb-0">Good morning</p>
                                                    </div>
                                                    <div className="dropdown align-self-start">
                                                        <Link className="dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <i className="bx bx-dots-vertical-rounded"></i>
                                                        </Link>
                                                        <div className="dropdown-menu">
                                                            <Link className="dropdown-item" to="#">Copy</Link>
                                                            <Link className="dropdown-item" to="#">Save</Link>
                                                            <Link className="dropdown-item" to="#">Forward</Link>
                                                            <Link className="dropdown-item" to="#">Delete</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </li>

                                        <li>
                                            <div className="conversation-list">
                                                <div className="ctext-wrap">
                                                    <div className="ctext-wrap-content">
                                                        <h5 className="conversation-name"><Link to="#" className="user-name">Jennie Sherlock</Link> <span className="time">10:04</span></h5>
                                                        <p className="mb-0">
                                                            Hello!
                                                        </p>
                                                    </div>
                                                    <div className="dropdown align-self-start">
                                                        <Link className="dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <i className="bx bx-dots-vertical-rounded"></i>
                                                        </Link>
                                                        <div className="dropdown-menu">
                                                            <Link className="dropdown-item" to="#">Copy</Link>
                                                            <Link className="dropdown-item" to="#">Save</Link>
                                                            <Link className="dropdown-item" to="#">Forward</Link>
                                                            <Link className="dropdown-item" to="#">Delete</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-3 border-top">
                                    <div className="row">
                                        <div className="col">
                                            <div className="position-relative">
                                                <input type="text" className="form-control border bg-light-subtle" placeholder="Enter Message..." />
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <button type="submit" className="btn btn-primary chat-send w-md waves-effect waves-light"><span className="d-none d-sm-inline-block me-2">Send</span> <i className="mdi mdi-send float-end"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end user chat */}
                    </div>
                    {/* End d-lg-flex  */}
                    
                </div> {/* container-fluid */}
            </div>
            {/* End Page-content */}
        </React.Fragment>
    );
};

export default Chat;
