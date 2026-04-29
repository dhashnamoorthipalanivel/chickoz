import React from 'react';
import { Link } from 'react-router-dom';

const Modals = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Modals</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Components</Link></li>
                                        <li className="breadcrumb-item active">Modals</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Modals Examples</h4>
                                    <p className="card-title-desc">Modals are streamlined, but flexible dialog prompts powered by JavaScript.</p>
                                </div>
                                <div className="card-body">
                                    <div className="modal bs-example-modal" tabIndex="-1" role="dialog" style={{display: 'block', position: 'relative', zIndex: 1}}>
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Modal title</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <p>One fine body&hellip;</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-primary">Save changes</button>
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Default Modal</h4>
                                    <p className="card-title-desc">Toggle a working modal demo by clicking the button below.</p>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#myModal">Standard modal</button>
                                        <div id="myModal" className="modal fade" tabIndex="-1" aria-labelledby="myModalLabel" aria-hidden="true" data-bs-scroll="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="myModalLabel">Default Modal Heading</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <h5>Overflowing text to show scroll behavior</h5>
                                                        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary waves-effect" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" className="btn btn-primary waves-effect waves-light">Save changes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Fullscreen Modal</h4>
                                    <p className="card-title-desc">Another override is the option to pop up a modal that covers the user viewport.</p>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#exampleModalFullscreen">Fullscreen modal</button>
                                        <div id="exampleModalFullscreen" className="modal fade" tabIndex="-1" aria-labelledby="exampleModalFullscreenLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-fullscreen">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalFullscreenLabel">Fullscreen Modal</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <h5>Overflowing text to show scroll behavior</h5>
                                                        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary waves-effect" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" className="btn btn-primary waves-effect waves-light">Save changes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Optional Sizes</h4>
                                    <p className="card-title-desc">Modals have three optional sizes, available via modifier classes.</p>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap gap-3">
                                        <div>
                                            <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">Extra large modal</button>
                                            <div className="modal fade bs-example-modal-xl" tabIndex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-xl">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="myExtraLargeModalLabel">Extra large modal</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <p>Cras mattis consectetur purus sit amet fermentum.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-light waves-effect" data-bs-toggle="modal" data-bs-target=".bs-example-modal-lg">Large modal</button>
                                            <div className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-lg">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="myLargeModalLabel">Large modal</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <p>Cras mattis consectetur purus sit amet fermentum.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-success waves-effect waves-light" data-bs-toggle="modal" data-bs-target=".bs-example-modal-sm">Small modal</button>
                                            <div className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-sm">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="mySmallModalLabel">Small modal</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <p>Cras mattis consectetur purus sit amet fermentum.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Vertically Centered</h5>
                                    <p className="card-title-desc">Add <code>.modal-dialog-centered</code> to vertically center the modal.</p>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target=".bs-example-modal-center">Center modal</button>
                                        <div className="modal fade bs-example-modal-center" tabIndex="-1" role="dialog" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Center modal</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <p>Cras mattis consectetur purus sit amet fermentum.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Scrollable Modal</h5>
                                    <p className="card-title-desc">You can also create a scrollable modal that allows scroll the modal body.</p>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap gap-3">
                                        <div>
                                            <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#exampleModalLongScrollable">Long Scrollable Modal</button>
                                            <div className="modal fade" id="exampleModalLongScrollable" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongScrollableTitle" aria-hidden="true">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="exampleModalLongScrollableTitle">Long Scrollable Modal</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <p>Cras mattis consectetur purus sit amet fermentum.</p>
                                                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p>
                                                            <p>Aenean lacinia bibendum nulla sed consectetur.</p>
                                                            <p>Cras mattis consectetur purus sit amet fermentum.</p>
                                                            <p>More content here so it scrolls...</p>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                                            <button type="button" className="btn btn-primary">Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#exampleModalScrollable">Scrollable Modal</button>
                                            <div className="modal fade" id="exampleModalScrollable" tabIndex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-scrollable">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="exampleModalScrollableTitle">Scrollable Modal</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <p>Cras mattis consectetur purus sit amet fermentum.</p>
                                                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p>
                                                            <p>Aenean lacinia bibendum nulla sed consectetur.</p>
                                                            <p>Cras mattis consectetur purus sit amet fermentum.</p>
                                                            <p>More content here so it scrolls...</p>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                                            <button type="button" className="btn btn-primary">Save changes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Static Backdrop</h5>
                                    <p className="card-title-desc">When backdrop is set to static, the modal will not close when clicking outside it.</p>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                            Static backdrop modal
                                        </button>
                                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Modal title</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <p>I will not close if you click outside me. Don't even try to press escape key.</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" className="btn btn-primary">Understood</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Varying Modal Content</h4>
                                    <p className="card-title-desc">Use <code>event.relatedTarget</code> and HTML <code>data-bs-*</code> attributes to vary the contents.</p>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap gap-3">
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalVarying" data-bs-whatever="@mdo">Open modal for @mdo</button>
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalVarying" data-bs-whatever="@fat">Open modal for @fat</button>
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalVarying" data-bs-whatever="@getbootstrap">Open modal for @getbootstrap</button>

                                        <div className="modal fade" id="exampleModalVarying" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">New message</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form>
                                                            <div className="mb-3">
                                                                <label htmlFor="recipient-name" className="col-form-label">Recipient:</label>
                                                                <input type="text" className="form-control" id="recipient-name" />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="message-text" className="col-form-label">Message:</label>
                                                                <textarea className="form-control" id="message-text"></textarea>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" className="btn btn-primary">Send message</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Toggle between modals</h4>
                                    <p className="card-title-desc">Toggle between multiple modals with some clever placement of attributes.</p>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#firstmodal">Open First Modal</button>

                                        <div className="modal fade" id="firstmodal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalToggleLabel">Modal 1</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <p>Show a second modal and hide this one with the button below.</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button className="btn btn-primary" data-bs-target="#secondmodal" data-bs-toggle="modal" data-bs-dismiss="modal">Open Second Modal</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal fade" id="secondmodal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalToggleLabel2">Modal 2</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <p>Hide this modal and show the first with the button below.</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button className="btn btn-primary" data-bs-target="#firstmodal" data-bs-toggle="modal" data-bs-dismiss="modal">Back to First</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

export default Modals;
