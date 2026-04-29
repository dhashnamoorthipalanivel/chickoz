import React from 'react';
import { Link } from 'react-router-dom';

const InvoiceList = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Invoice List</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Invoices</Link></li>
                                        <li className="breadcrumb-item active">Invoice List</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* end page title */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm">
                                            <div className="mb-4">
                                                <button type="button" className="btn btn-light waves-effect waves-light"><i className="bx bx-plus me-1"></i> Add Invoice</button>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div className="d-flex align-items-center gap-1 mb-4">
                                                <div className="input-group datepicker-range">
                                                    <input type="text" className="form-control flatpickr-input" data-input aria-describedby="date1" placeholder="Select date range" />
                                                    <button className="input-group-text" id="date1" data-toggle><i className="bx bx-calendar-event"></i></button>
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

                                    <div className="table-responsive">
                                        <table className="table align-middle datatable dt-responsive table-check nowrap" style={{ borderCollapse: 'collapse', borderSpacing: '0 8px', width: '100%' }}>
                                            <thead>
                                                <tr className="bg-transparent">
                                                    <th style={{ width: '30px' }}>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" name="check" className="form-check-input" id="checkAll" />
                                                            <label className="form-check-label" htmlFor="checkAll"></label>
                                                        </div>
                                                    </th>
                                                    <th style={{ width: '120px' }}>Invoice ID</th>
                                                    <th>Date</th>
                                                    <th>Billing Name</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th style={{ width: '150px' }}>Download Pdf</th>
                                                    <th style={{ width: '90px' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
    
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0215</Link> </td>
                                                    <td>
                                                        12 Oct, 2020
                                                    </td>
                                                    <td>Connie Franco</td>
                                                    
                                                    <td>
                                                        $26.30
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-success font-size-12">Paid</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0214</Link> </td>
                                                    <td>
                                                        11 Oct, 2020
                                                    </td>
                                                    <td>Paul Reynolds</td>
                                                    
                                                    <td>
                                                        $24.20
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-success font-size-12">Paid</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0213</Link> </td>
                                                    <td>
                                                        10 Oct, 2020
                                                    </td>
                                                    <td>Ronald Patterson</td>
                                                    
                                                    <td>
                                                        $20.20
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-warning font-size-12">Pending</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0212</Link> </td>
                                                    <td>
                                                        09 Oct, 2020
                                                    </td>
                                                    <td>Adella Perez</td>
                                                    
                                                    <td>
                                                        $16.80
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-success font-size-12">Paid</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0211</Link> </td>
                                                    <td>
                                                        08 Oct, 2020
                                                    </td>
                                                    <td>Theresa Mayers</td>
                                                    
                                                    <td>
                                                        $22.00
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-success font-size-12">Paid</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0210</Link> </td>
                                                    <td>
                                                        07 Oct, 2020
                                                    </td>
                                                    <td>Michael Wallace</td>
                                                    
                                                    <td>
                                                        $15.60
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-success font-size-12">Paid</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0209</Link> </td>
                                                    <td>
                                                        06 Oct, 2020
                                                    </td>
                                                    <td>Oliver Gonzales</td>
                                                    
                                                    <td>
                                                        $26.50
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-warning font-size-12">Pending</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0208</Link> </td>
                                                    <td>
                                                        05 Oct, 2020
                                                    </td>
                                                    <td>David Burke</td>
                                                    
                                                    <td>
                                                        $24.20
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-success font-size-12">Paid</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0207</Link> </td>
                                                    <td>
                                                        04 Oct, 2020
                                                    </td>
                                                    <td>Willie Verner</td>
                                                    
                                                    <td>
                                                        $21.30
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-warning font-size-12">Pending</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0206</Link> </td>
                                                    <td>
                                                        03 Oct, 2020
                                                    </td>
                                                    <td>Felix Perry</td>
                                                    
                                                    <td>
                                                        $22.60
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-success font-size-12">Paid</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0205</Link> </td>
                                                    <td>
                                                        02 Oct, 2020
                                                    </td>
                                                    <td>Virgil Kelley</td>
                                                    
                                                    <td>
                                                        $18.20
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-success font-size-12">Paid</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check font-size-16">
                                                            <input type="checkbox" className="form-check-input" />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                    </td>
                                                    
                                                    <td><Link to="#" className="text-body fw-medium">#MN0204</Link> </td>
                                                    <td>
                                                        01 Oct, 2020
                                                    </td>
                                                    <td>Matthew Lawler</td>
                                                    
                                                    <td>
                                                        $15.80
                                                    </td>
                                                    <td>
                                                        <div className="badge badge-soft-warning font-size-12">Pending</div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <button type="button" className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"><i className="bx bx-download label-icon"></i> Pdf</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="bx bx-dots-horizontal-rounded"></i>
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li><Link className="dropdown-item" to="#">Edit</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Print</Link></li>
                                                                <li><Link className="dropdown-item" to="#">Delete</Link></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* end table responsive */}
                                </div>
                                {/* end card body */}
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                    </div>
                    {/* end row */}
                </div> {/* container-fluid */}
            </div>
            {/* End Page-content */}
        </React.Fragment>
    );
};

export default InvoiceList;
