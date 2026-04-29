import React from 'react';
import { Link } from 'react-router-dom';

const FormElements = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Basic Elements</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Forms</Link></li>
                                        <li className="breadcrumb-item active">Basic Elements</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* end page title */}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Textual inputs</h4>
                                    <p className="card-title-desc">Here are examples of <code>.form-control</code> applied to each
                                        textual HTML5 <code>&lt;input&gt;</code> <code>type</code>.</p>
                                </div>
                                <div className="card-body p-4">
    
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-text-input" className="form-label">Text</label>
                                                    <input className="form-control" type="text" defaultValue="Artisanal kale" id="example-text-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-search-input" className="form-label">Search</label>
                                                    <input className="form-control" type="search" defaultValue="How do I shoot web" id="example-search-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-email-input" className="form-label">Email</label>
                                                    <input className="form-control" type="email" defaultValue="bootstrap@example.com" id="example-email-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-url-input" className="form-label">URL</label>
                                                    <input className="form-control" type="url" defaultValue="https://getbootstrap.com" id="example-url-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-tel-input" className="form-label">Telephone</label>
                                                    <input className="form-control" type="tel" defaultValue="1-(555)-555-5555" id="example-tel-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-password-input" className="form-label">Password</label>
                                                    <input className="form-control" type="password" defaultValue="hunter2" id="example-password-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-number-input" className="form-label">Number</label>
                                                    <input className="form-control" type="number" defaultValue="42" id="example-number-input" />
                                                </div>
                                                <div>
                                                    <label htmlFor="example-datetime-local-input" className="form-label">Date and time</label>
                                                    <input className="form-control" type="datetime-local" defaultValue="2019-08-19T13:45:00" id="example-datetime-local-input" />
                                                </div>
                                                
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="mt-3 mt-lg-0">
                                                <div className="mb-3">
                                                    <label htmlFor="example-date-input" className="form-label">Date</label>
                                                    <input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-month-input" className="form-label">Month</label>
                                                    <input className="form-control" type="month" defaultValue="2019-08" id="example-month-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-week-input" className="form-label">Week</label>
                                                    <input className="form-control" type="week" defaultValue="2019-W33" id="example-week-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-time-input" className="form-label">Time</label>
                                                    <input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="example-color-input" className="form-label">Color picker</label>
                                                    <input type="color" className="form-control form-control-color mw-100" id="example-color-input" defaultValue="#5156be" title="Choose your color" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Select</label>
                                                    <select className="form-select" defaultValue="Select">
                                                        <option>Select</option>
                                                        <option>Large select</option>
                                                        <option>Small select</option>
                                                    </select>
                                                </div>
        
                                                <div>
                                                    <label htmlFor="exampleDataList" className="form-label">Datalists</label>
                                                    <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
                                                    <datalist id="datalistOptions">
                                                        <option value="San Francisco" />
                                                        <option value="New York" />
                                                        <option value="Seattle" />
                                                        <option value="Los Angeles" />
                                                        <option value="Chicago" />
                                                    </datalist>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> {/* end col */}
                    </div>
                    {/* end row */}

                    {/* Start row */}
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Sizing</h4>
                                    <p className="card-title-desc">Set heights using classes like <code>.form-control-lg</code> and <code>.form-control-sm</code>.</p>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="mb-4">
                                            <label className="form-label" htmlFor="default-input">Default input</label>
                                            <input className="form-control" type="text" id="default-input" placeholder="Default input" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label" htmlFor="form-sm-input">Form Small input</label>
                                            <input className="form-control form-control-sm" type="text" id="form-sm-input" placeholder=".form-control-sm" />
                                        </div>
                                        <div>
                                            <label className="form-label" htmlFor="form-lg-input">Form Large input</label>
                                            <input className="form-control form-control-lg" type="text" id="form-lg-input" placeholder=".form-control-lg" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* end col */}
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Range Inputs</h4>
                                    <p className="card-title-desc">Create custom <code>&lt;input type="range"&gt;</code>
                                        controls with <code>.form-range</code>.</p>
                                </div>
                                <div className="card-body">
                                    

                                    <div className="mb-3">
                                        <label htmlFor="customRange1" className="form-label">Example range</label>
                                        <input type="range" className="form-range" id="customRange1" />
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="font-size-14 mb-1">Min and max</h5>
                                        <p className="card-title-desc mb-2">Range inputs have implicit values for min and
                                            max—0 and 100, respectively.</p>
                                        <input type="range" className="form-range" min="0" max="5" id="customRange2" />
                                    </div>

                                    <div>
                                        <h5 className="font-size-14 mb-1">Steps</h5>
                                        <p className="card-title-desc mb-2">By default, range inputs “snap” to integer
                                            values. To change this, you can specify a <code>step</code> value.</p>
                                        <input type="range" className="form-range" min="0" max="5" id="customRange3" />
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* end col */}
                    </div>
                    {/* End row */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Form layouts</h4>
                                    <p className="card-title-desc">Form layout options : from inline, horizontal & custom grid implementations</p>
                                </div>
                                <div className="card-body p-4">
                                    
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <div>
                                                <h5 className="font-size-14 mb-4"><i className="mdi mdi-arrow-right text-primary me-1"></i> Form groups</h5>
                                                <form>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="formrow-firstname-input">First name</label>
                                                        <input type="text" className="form-control" id="formrow-firstname-input" placeholder="Enter Name" />
                                                    </div>
        
                                                    <div className="row">                                                            
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label" htmlFor="formrow-email-input">Email</label>
                                                                <input type="email" className="form-control" id="formrow-email-input" placeholder="Enter your Email" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label" htmlFor="formrow-password-input">Password</label>
                                                                <input type="password" className="form-control" id="formrow-password-input" placeholder="Enter your password" />
                                                            </div>
                                                        </div>
                                                    </div>
        
        
                                                    <div className="form-group">
                                                        
                                                        <div className="form-check">
                                                            <input type="checkbox" className="form-check-input" id="formrow-customCheck" />
                                                            <label className="form-check-label" htmlFor="formrow-customCheck">Check me out</label>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <button type="submit" className="btn btn-primary w-md">Submit</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 ms-lg-auto">
                                            <div className="mt-4 mt-lg-0">
                                                <h5 className="font-size-14 mb-4"><i className="mdi mdi-arrow-right text-primary me-1"></i> Horizontal form</h5>
                                                
                                                <form>
                                                    <div className="row mb-4">
                                                        <label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label">First name</label>
                                                        <div className="col-sm-9">
                                                          <input type="text" className="form-control" id="horizontal-firstname-input" placeholder="Enter your First Name" />
                                                        </div>
                                                    </div>
                                                    <div className="row mb-4">
                                                        <label htmlFor="horizontal-email-input" className="col-sm-3 col-form-label">Email</label>
                                                        <div className="col-sm-9">
                                                            <input type="email" className="form-control" id="horizontal-email-input" placeholder="Enter your Email" />
                                                        </div>
                                                    </div>
                                                    <div className="row mb-4">
                                                        <label htmlFor="horizontal-password-input" className="col-sm-3 col-form-label">Password</label>
                                                        <div className="col-sm-9">
                                                          <input type="password" className="form-control" id="horizontal-password-input" placeholder="Enter your password" />
                                                        </div>
                                                    </div>
        
                                                    <div className="row justify-content-end">
                                                        <div className="col-sm-9">
                                                            <div className="form-check mb-4">
                                                                <input type="checkbox" className="form-check-input" id="horizontal-customCheck" />
                                                                <label className="form-check-label" htmlFor="horizontal-customCheck">Remember me</label>
                                                            </div>
        
                                                            <div>
                                                                <button type="submit" className="btn btn-primary w-md">Submit</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-lg-6">
                                            <h5 className="font-size-14 mb-4"><i className="mdi mdi-arrow-right text-primary me-1"></i> Inline forms layout</h5>
                                    
                                            <form className="row gx-3 gy-2 align-items-center mb-4 mb-lg-0">
                                                <div className="col-sm-4">
                                                    <label className="visually-hidden" htmlFor="specificSizeInputName">Name</label>
                                                    <input type="text" className="form-control" id="specificSizeInputName" placeholder="Enter Name" />
                                                </div>
                                                <div className="col-sm-4">
                                                    <label className="visually-hidden" htmlFor="specificSizeInputGroupUsername">Username</label>
                                                    <div className="input-group">
                                                        <div className="input-group-text">@</div>
                                                        <input type="text" className="form-control" id="specificSizeInputGroupUsername" placeholder="Username" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-auto">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="autoSizingCheck2" />
                                                        <label className="form-check-label" htmlFor="autoSizingCheck2">
                                                            Remember me
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-auto">
                                                    <button type="submit" className="btn btn-primary">Submit</button>
                                                </div>
                                            </form>
                                        </div>

                                        <div className="col-lg-6">
                                            <h5 className="font-size-14 mb-4"><i className="mdi mdi-arrow-right text-primary me-1"></i> Floating Label</h5>

                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="form-floating mb-3 mb-lg-0">
                                                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                                        <label htmlFor="floatingInput">Email address</label>
                                                    </div>                                                        
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-floating">
                                                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                                        <label htmlFor="floatingPassword">Password</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-lg-6">
                                            <h5 className="font-size-14 mb-4"><i className="mdi mdi-arrow-right text-primary me-1"></i> Inline forms layout used by hstack</h5>
                                            <form className="row gx-3 gy-2 align-items-center">
                                                <div className="hstack gap-3">
                                                    <input className="form-control me-auto" type="text" placeholder="Add your item here..." />
                                                    <button type="button" className="btn btn-secondary">Submit</button>
                                                    <div className="vr"></div>
                                                    <button type="reset" className="btn btn-outline-danger">Reset</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Form Layout */}

                    <div className="row">
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Checkboxes</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div >
                                                <h5 className="font-size-14 mb-3"><i className="mdi mdi-arrow-right text-primary me-1"></i> Form Checkboxes
                                                </h5>
                                                <div className="form-check mb-3">
                                                    <input className="form-check-input" type="checkbox" id="formCheck1" />
                                                    <label className="form-check-label" htmlFor="formCheck1">
                                                        Form Checkbox
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="formCheck2" defaultChecked />
                                                    <label className="form-check-label" htmlFor="formCheck2">
                                                        Form Checkbox checked
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">

                                            <div className="mt-4 mt-md-0">
                                                <h5 className="font-size-14 mb-3"><i className="mdi mdi-arrow-right text-primary me-1"></i> Form Checkboxes
                                                    Right</h5>
                                                <div>
                                                    <div className="form-check form-check-right mb-3">
                                                        <input className="form-check-input" type="checkbox" id="formCheckRight1" />
                                                        <label className="form-check-label" htmlFor="formCheckRight1">
                                                            Form Checkbox Right
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="form-check form-check-right">
                                                        <input className="form-check-input" type="checkbox" id="formCheckRight2"
                                                            defaultChecked />
                                                        <label className="form-check-label" htmlFor="formCheckRight2">
                                                            Form Checkbox Right checked
                                                        </label>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Radios</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div>
                                                <h5 className="font-size-14 mb-3"><i className="mdi mdi-arrow-right text-primary me-1"></i>Form Radios</h5>
                                                <div className="form-check mb-3">
                                                    <input className="form-check-input" type="radio" name="formRadios"
                                                        id="formRadios1" defaultChecked />
                                                    <label className="form-check-label" htmlFor="formRadios1">
                                                        Form Radio
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="formRadios"
                                                        id="formRadios2" />
                                                    <label className="form-check-label" htmlFor="formRadios2">
                                                        Form Radio checked
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mt-4 mt-md-0">
                                                <h5 className="font-size-14 mb-3"><i className="mdi mdi-arrow-right text-primary me-1"></i>Form Radios Right</h5>
                                                <div>
                                                    <div className="form-check form-check-right mb-3">
                                                        <input className="form-check-input" type="radio" name="formRadiosRight"
                                                            id="formRadiosRight1" defaultChecked />
                                                        <label className="form-check-label" htmlFor="formRadiosRight1">
                                                            Form Radio Right
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="form-check form-check-right">
                                                        <input className="form-check-input" type="radio" name="formRadiosRight"
                                                            id="formRadiosRight2" />
                                                        <label className="form-check-label" htmlFor="formRadiosRight2">
                                                            Form Radio Right checked
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                    {/* end row */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Switches</h4>
                                    <p className="card-title-desc">A switch has the markup of a custom checkbox but uses the <code>.form-switch</code> class to render a toggle switch. Switches also support the <code>disabled</code> attribute.</p>
                                </div>
                                <div className="card-body">
                                    

                                    <div className="row">

                                        <div className="col-md-6">
                                            <div>
                                                <h5 className="font-size-14 mb-3"><i className="mdi mdi-arrow-right text-primary me-1"></i>Switch examples</h5>


                                                <div className="form-check form-switch mb-3" dir="ltr">
                                                    <input type="checkbox" className="form-check-input" id="customSwitch1" defaultChecked />
                                                    <label className="form-check-label" htmlFor="customSwitch1">Toggle this switch element</label>
                                                </div>
                                                <div className="form-check form-switch" dir="ltr">
                                                    <input type="checkbox" className="form-check-input" disabled id="customSwitch2" />
                                                    <label className="form-check-label" htmlFor="customSwitch2">Disabled switch element</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mt-4 mt-md-0">
                                                <h5 className="font-size-14 mb-3"><i className="mdi mdi-arrow-right text-primary me-1"></i>Switch sizes</h5>
    
                                                <div className="form-check form-switch mb-3" dir="ltr">
                                                    <input type="checkbox" className="form-check-input" id="customSwitchsizesm" defaultChecked />
                                                    <label className="form-check-label" htmlFor="customSwitchsizesm">Small Size Switch</label>
                                                </div>
    
                                                <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                    <input type="checkbox" className="form-check-input" id="customSwitchsizemd" />
                                                    <label className="form-check-label" htmlFor="customSwitchsizemd">Medium Size Switch</label>
                                                </div>
    
                                                <div className="form-check form-switch form-switch-lg mb-3" dir="ltr">
                                                    <input type="checkbox" className="form-check-input" id="customSwitchsizelg" defaultChecked />
                                                    <label className="form-check-label" htmlFor="customSwitchsizelg">Large Size Switch</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

export default FormElements;
