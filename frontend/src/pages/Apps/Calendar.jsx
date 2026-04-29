import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Calendar = () => {
    useEffect(() => {
        // Here you would typically initialize FullCalendar or something similar
        // if this were a fully functional app, but for HTML migration we just render the DOM.
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Calendar</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Apps</Link></li>
                                        <li className="breadcrumb-item active">Calendar</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* end page title */}

                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-xl-3 col-lg-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-grid">
                                                <button className="btn font-size-16 btn-primary" id="btn-new-event">
                                                    <i className="mdi mdi-plus-circle-outline"></i> Create New Event
                                                </button>
                                            </div>
                                            
                                            <div id="external-events" className="mt-2">
                                                <br />
                                                <p className="text-muted">Drag and drop your event or click in the calendar</p>
                                                <div className="external-event fc-event text-success bg-success-subtle" data-class="bg-success">
                                                    <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>New Event Planning
                                                </div>
                                                <div className="external-event fc-event text-info bg-info-subtle" data-class="bg-info">
                                                    <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Meeting
                                                </div>
                                                <div className="external-event fc-event text-warning bg-warning-subtle" data-class="bg-warning">
                                                    <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Generating Reports
                                                </div>
                                                <div className="external-event fc-event text-danger bg-danger-subtle" data-class="bg-danger">
                                                    <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Create New theme
                                                </div>
                                                <div className="external-event fc-event text-dark bg-dark-subtle" data-class="bg-dark">
                                                    <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2"></i>Team Meeting
                                                </div>
                                            </div>

                                            <div className="row justify-content-center mt-5">
                                                <div className="col-lg-12 col-sm-6">
                                                    <img src="/assets/images/undraw-calendar.svg" alt="" className="img-fluid d-block" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> {/* end col*/}

                                <div className="col-xl-9 col-lg-8">
                                    <div className="card">
                                        <div className="card-body">
                                            <div id="calendar"></div>
                                        </div>
                                    </div>
                                </div> {/* end col */}

                            </div>
                            {/* end row */}

                            <div style={{ clear: 'both' }}></div>

                            {/* Add New Event MODAL */}
                            <div className="modal fade" id="event-modal" tabIndex="-1">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header py-3 px-4 border-bottom-0">
                                            <h5 className="modal-title" id="modal-title">Event</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                                        </div>
                                        <div className="modal-body p-4">
                                            <form className="needs-validation" name="event-form" id="form-event" noValidate>
                                                <input type="hidden" name="eventid" id="eventid" />
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label">Event Name</label>
                                                            <input className="form-control" placeholder="Insert Event Name"
                                                                type="text" name="title" id="event-title" required />
                                                            <div className="invalid-feedback">Please provide a valid event name</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="mb-3">
                                                            <label className="form-label">Category</label>
                                                            <select className="form-control form-select" name="category" id="event-category" defaultValue="">
                                                                <option disabled value=""> --Select-- </option>
                                                                <option value="bg-danger">Danger</option>
                                                                <option value="bg-success">Success</option>
                                                                <option value="bg-primary">Primary</option>
                                                                <option value="bg-info">Info</option>
                                                                <option value="bg-dark">Dark</option>
                                                                <option value="bg-warning">Warning</option>
                                                            </select>
                                                            <div className="invalid-feedback">Please select a valid event category</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col-6">
                                                        <button type="button" className="btn btn-danger" id="btn-delete-event">Delete</button>
                                                    </div>
                                                    <div className="col-6 d-flex text-end justify-content-end">
                                                        <button type="button" className="btn btn-light me-1" data-bs-dismiss="modal">Close</button>
                                                        <button type="submit" className="btn btn-success" id="btn-save-event">Save</button>
                                                        <button type="submit" className="btn btn-success d-none" id="edit-event-btn">Update</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div> {/* end modal-content*/}
                                </div> {/* end modal dialog*/}
                            </div>
                            {/* end modal*/}
                        </div>
                    </div>
                    
                </div> {/* container-fluid */}
            </div>
            {/* End Page-content */}
        </React.Fragment>
    );
};

export default Calendar;
