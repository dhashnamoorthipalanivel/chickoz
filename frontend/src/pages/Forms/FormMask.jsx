import React from 'react';
import { Link } from 'react-router-dom';

const FormMask = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Form Mask</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Forms</Link></li>
                                        <li className="breadcrumb-item active">Form Mask</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Imask</h4>
                                    <p className="card-title-desc mb-0">vanilla javascript input mask</p>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div>
                                                    <div>
                                                        <label htmlFor="regexp-mask" className="form-label">RegExp (Russian postal code)</label>
                                                        <input type="text" className="form-control" id="regexp-mask" />
                                                        <div className="text-muted">/^[1-6]\d{'{0,5}'}$/</div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label htmlFor="phone-mask" className="form-label">Pattern (Phone)</label>
                                                        <input type="text" className="form-control" id="phone-mask" />
                                                        <div className="text-muted">+{'{7}'}(000)000-00-00</div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label htmlFor="number-mask" className="form-label">Number</label>
                                                        <input type="text" className="form-control" id="number-mask" />
                                                        <div className="text-muted">in range [-10000, 10000]</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mt-4 mt-lg-0">
                                                    <div>
                                                        <label htmlFor="date-mask" className="form-label">Date</label>
                                                        <input type="text" className="form-control" id="date-mask" />
                                                        <div className="text-muted">'dd.mm.yyyy' in range [01.01.1990, 01.01.2020]</div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label className="form-label">On-the-fly select</label>
                                                        <input type="text" className="form-control" id="dynamic-mask" />
                                                        <div className="text-muted">phone or email</div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label className="form-label">Mask in mask</label>
                                                        <input type="text" className="form-control" id="currency-mask" />
                                                        <div className="text-muted">currency input</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default FormMask;
