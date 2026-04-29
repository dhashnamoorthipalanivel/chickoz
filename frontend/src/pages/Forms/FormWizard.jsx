import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FormWizard = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [activeTab2, setActiveTab2] = useState(1);

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Form Wizard</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Forms</Link></li>
                                        <li className="breadcrumb-item active">Form Wizard</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Basic pills Wizard</h4>
                                </div>
                                <div className="card-body">
                                    <div id="basic-pills-wizard" className="twitter-bs-wizard">
                                        <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
                                                    <div className="step-icon"><i className="bx bx-list-ul"></i></div>
                                                    <span>Seller Details</span>
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
                                                    <div className="step-icon"><i className="bx bx-book-bookmark"></i></div>
                                                    <span>Company Document</span>
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>
                                                    <div className="step-icon"><i className="bx bxs-bank"></i></div>
                                                    <span>Bank Details</span>
                                                </button>
                                            </li>
                                        </ul>

                                        <div className="tab-content twitter-bs-wizard-tab-content">
                                            {activeTab === 1 && (
                                                <div className="tab-pane active">
                                                    <div className="text-center mb-4">
                                                        <h5>Seller Details</h5>
                                                        <p className="card-title-desc">Fill all information below</p>
                                                    </div>
                                                    <form>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-firstname-input" className="form-label">First name</label>
                                                                    <input type="text" className="form-control" id="basicpill-firstname-input" placeholder="Enter Your First Name" />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-lastname-input" className="form-label">Last name</label>
                                                                    <input type="text" className="form-control" id="basicpill-lastname-input" placeholder="Enter Your Last Name" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-phoneno-input" className="form-label">Phone</label>
                                                                    <input type="text" className="form-control" id="basicpill-phoneno-input" placeholder="Enter your Phone No." />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-email-input" className="form-label">Email</label>
                                                                    <input type="email" className="form-control" id="basicpill-email-input" placeholder="Enter your email" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-address-input" className="form-label">Address</label>
                                                                    <textarea id="basicpill-address-input" className="form-control" rows="2" placeholder="Enter your Address"></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <ul className="pager wizard twitter-bs-wizard-pager-link">
                                                        <li className="next"><button className="btn btn-primary" onClick={() => setActiveTab(2)}>Next <i className="bx bx-chevron-right ms-1"></i></button></li>
                                                    </ul>
                                                </div>
                                            )}
                                            {activeTab === 2 && (
                                                <div className="tab-pane active">
                                                    <div className="text-center mb-4">
                                                        <h5>Company Document</h5>
                                                        <p className="card-title-desc">Fill all information below</p>
                                                    </div>
                                                    <form>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-pancard-input" className="form-label">PAN Card</label>
                                                                    <input type="text" className="form-control" id="basicpill-pancard-input" placeholder="Enter your PAN No." />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-vatno-input" className="form-label">VAT/TIN No.</label>
                                                                    <input type="text" className="form-control" id="basicpill-vatno-input" placeholder="Enter your VAT/TIN No." />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-cstno-input" className="form-label">GST No.</label>
                                                                    <input type="text" className="form-control" id="basicpill-cstno-input" placeholder="Enter your GST No." />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-servicetax-input" className="form-label">Service Tax No.</label>
                                                                    <input type="text" className="form-control" id="basicpill-servicetax-input" placeholder="Enter your Service Tax No." />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <ul className="pager wizard twitter-bs-wizard-pager-link">
                                                        <li className="previous"><button className="btn btn-primary" onClick={() => setActiveTab(1)}><i className="bx bx-chevron-left me-1"></i> Previous</button></li>
                                                        <li className="next"><button className="btn btn-primary" onClick={() => setActiveTab(3)}>Next <i className="bx bx-chevron-right ms-1"></i></button></li>
                                                    </ul>
                                                </div>
                                            )}
                                            {activeTab === 3 && (
                                                <div className="tab-pane active">
                                                    <div className="text-center mb-4">
                                                        <h5>Bank Details</h5>
                                                        <p className="card-title-desc">Fill all information below</p>
                                                    </div>
                                                    <form>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-namecard-input" className="form-label">Name on Card</label>
                                                                    <input type="text" className="form-control" id="basicpill-namecard-input" placeholder="Enter your Name on Card" />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Credit Card Type</label>
                                                                    <select className="form-select">
                                                                        <option>Select Card Type</option>
                                                                        <option value="AE">American Express</option>
                                                                        <option value="VI">Visa</option>
                                                                        <option value="MC">MasterCard</option>
                                                                        <option value="DI">Discover</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-cardno-input" className="form-label">Credit Card Number</label>
                                                                    <input type="text" className="form-control" id="basicpill-cardno-input" placeholder="Enter your Credit Card Number" />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-card-verification-input" className="form-label">Card Verification Number</label>
                                                                    <input type="text" className="form-control" id="basicpill-card-verification-input" placeholder="Enter your Card Verification Number" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label htmlFor="basicpill-expiration-input" className="form-label">Expiration Date</label>
                                                                    <input type="date" className="form-control" id="basicpill-expiration-input" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <ul className="pager wizard twitter-bs-wizard-pager-link">
                                                        <li className="previous"><button className="btn btn-primary" onClick={() => setActiveTab(2)}><i className="bx bx-chevron-left me-1"></i> Previous</button></li>
                                                        <li className="float-end"><button className="btn btn-success">Save Changes</button></li>
                                                    </ul>
                                                </div>
                                            )}
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

export default FormWizard;
