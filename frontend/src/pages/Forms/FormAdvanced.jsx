import React from 'react';
import { Link } from 'react-router-dom';

const FormAdvanced = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {/* start page title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Forms Advanced Plugins</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Forms</Link></li>
                                        <li className="breadcrumb-item active">Forms Advanced Plugins</li>
                                    </ol>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* end page title */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Css Switch</h4>
                                    <p className="card-title-desc">Here are a few types of switches. </p>
                                </div>
                                {/* end card header */}
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <h5 className="font-size-14 mb-3">Example switch</h5>
                                            <div className="d-flex flex-wrap gap-2">
                                                <input type="checkbox" id="switch1" switch="none" defaultChecked />
                                                <label htmlFor="switch1" data-on-label="On" data-off-label="Off"></label>
                                                
                                                <input type="checkbox" id="switch2" switch="default" defaultChecked />
                                                <label htmlFor="switch2" data-on-label="" data-off-label=""></label>

                                                <input type="checkbox" id="switch3" switch="bool" defaultChecked />
                                                <label htmlFor="switch3" data-on-label="Yes" data-off-label="No"></label>

                                                <input type="checkbox" id="switch6" switch="primary" defaultChecked />
                                                <label htmlFor="switch6" data-on-label="Yes" data-off-label="No"></label>

                                                <input type="checkbox" id="switch4" switch="success" defaultChecked />
                                                <label htmlFor="switch4" data-on-label="Yes" data-off-label="No"></label>

                                                <input type="checkbox" id="switch7" switch="info" defaultChecked />
                                                <label htmlFor="switch7" data-on-label="Yes" data-off-label="No"></label>

                                                <input type="checkbox" id="switch5" switch="warning" defaultChecked />
                                                <label htmlFor="switch5" data-on-label="Yes" data-off-label="No"></label>

                                                <input type="checkbox" id="switch8" switch="danger" defaultChecked />
                                                <label htmlFor="switch8" data-on-label="Yes" data-off-label="No"></label>

                                                <input type="checkbox" id="switch9" switch="dark" defaultChecked />
                                                <label htmlFor="switch9" data-on-label="Yes" data-off-label="No"></label>
                                            </div>
                                        </div>
                                        {/* end col */}

                                        <div className="col-lg-6">
                                            <div className="mt-4 mt-lg-0">
                                                <h5 className="font-size-14 mb-3">Square switch</h5>
                                                <div className="d-flex flex-wrap gap-2">
                                                    <div className="square-switch">
                                                        <input type="checkbox" id="square-switch1" switch="none" defaultChecked />
                                                        <label htmlFor="square-switch1" data-on-label="On" data-off-label="Off"></label>
                                                    </div>
                                                    <div className="square-switch">
                                                        <input type="checkbox" id="square-switch2" switch="info" defaultChecked />
                                                        <label htmlFor="square-switch2" data-on-label="Yes" data-off-label="No"></label>
                                                    </div>
                                                    <div className="square-switch">
                                                        <input type="checkbox" id="square-switch3" switch="bool" defaultChecked />
                                                        <label htmlFor="square-switch3" data-on-label="Yes" data-off-label="No"></label>
                                                    </div>
                                                    <div className="square-switch">
                                                        <input type="checkbox" id="square-switch4" switch="warning" defaultChecked />
                                                        <label htmlFor="square-switch4" data-on-label="Yes" data-off-label="No"></label>
                                                    </div>
                                                    <div className="square-switch">
                                                        <input type="checkbox" id="square-switch5" switch="danger" defaultChecked />
                                                        <label htmlFor="square-switch5" data-on-label="Yes" data-off-label="No"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* end col */}
                                    </div>
                                    {/* end row */}
                                </div>
                                {/* end card body */}
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                    </div>
                    {/* end row */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Choices</h4>
                                    <p className="card-title-desc">Choices.js is a lightweight, configurable select box/text input plugin.</p>
                                </div>
                                {/* end card header */}

                                <div className="card-body">
                                    <div>
                                        <h5 className="font-size-14 mb-3">Single select input Example</h5>

                                        <div className="row">
                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-single-default" className="form-label font-size-13 text-muted">Default</label>
                                                    <select className="form-control" data-trigger name="choices-single-default" id="choices-single-default" placeholder="This is a search placeholder">
                                                        <option value="">This is a placeholder</option>
                                                        <option value="Choice 1">Choice 1</option>
                                                        <option value="Choice 2">Choice 2</option>
                                                        <option value="Choice 3">Choice 3</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-single-groups" className="form-label font-size-13 text-muted">Option groups</label>
                                                    <select className="form-control" data-trigger name="choices-single-groups" id="choices-single-groups">
                                                        <option value="">Choose a city</option>
                                                        <optgroup label="UK">
                                                            <option value="London">London</option>
                                                            <option value="Manchester">Manchester</option>
                                                            <option value="Liverpool">Liverpool</option>
                                                        </optgroup>
                                                        <optgroup label="FR">
                                                            <option value="Paris">Paris</option>
                                                            <option value="Lyon">Lyon</option>
                                                            <option value="Marseille">Marseille</option>
                                                        </optgroup>
                                                        <optgroup label="DE" disabled>
                                                            <option value="Hamburg">Hamburg</option>
                                                            <option value="Munich">Munich</option>
                                                            <option value="Berlin">Berlin</option>
                                                        </optgroup>
                                                        <optgroup label="US">
                                                            <option value="New York">New York</option>
                                                            <option value="Washington" disabled>Washington</option>
                                                            <option value="Michigan">Michigan</option>
                                                        </optgroup>
                                                        <optgroup label="SP">
                                                            <option value="Madrid">Madrid</option>
                                                            <option value="Barcelona">Barcelona</option>
                                                            <option value="Malaga">Malaga</option>
                                                        </optgroup>
                                                        <optgroup label="CA">
                                                            <option value="Montreal">Montreal</option>
                                                            <option value="Toronto">Toronto</option>
                                                            <option value="Vancouver">Vancouver</option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-single-no-search" className="form-label font-size-13 text-muted">Options added via config with no search</label>
                                                    <select className="form-control" name="choices-single-no-search" id="choices-single-no-search" defaultValue="0">
                                                        <option value="0">Zero</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-single-no-sorting" className="form-label font-size-13 text-muted">Options added via config with no search</label>
                                                    <select className="form-control" name="choices-single-no-sorting" id="choices-single-no-sorting">
                                                        <option value="Madrid">Madrid</option>
                                                        <option value="Toronto">Toronto</option>
                                                        <option value="Vancouver">Vancouver</option>
                                                        <option value="London">London</option>
                                                        <option value="Manchester">Manchester</option>
                                                        <option value="Liverpool">Liverpool</option>
                                                        <option value="Paris">Paris</option>
                                                        <option value="Malaga">Malaga</option>
                                                        <option value="Washington" disabled>Washington</option>
                                                        <option value="Lyon">Lyon</option>
                                                        <option value="Marseille">Marseille</option>
                                                        <option value="Hamburg">Hamburg</option>
                                                        <option value="Munich">Munich</option>
                                                        <option value="Barcelona">Barcelona</option>
                                                        <option value="Berlin">Berlin</option>
                                                        <option value="Montreal">Montreal</option>
                                                        <option value="New York">New York</option>
                                                        <option value="Michigan">Michigan</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {/* end row */}
                                    </div>
                                    {/* Single select input Example */}

                                    <div className="mt-4">
                                        <h5 className="font-size-14 mb-3">Multiple select input</h5>

                                        <div className="row">
                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-multiple-default" className="form-label font-size-13 text-muted">Default</label>
                                                    <select className="form-control" data-trigger name="choices-multiple-default" id="choices-multiple-default" placeholder="This is a placeholder" multiple defaultValue={['Choice 1']}>
                                                        <option value="Choice 1">Choice 1</option>
                                                        <option value="Choice 2">Choice 2</option>
                                                        <option value="Choice 3">Choice 3</option>
                                                        <option value="Choice 4" disabled>Choice 4</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-multiple-remove-button" className="form-label font-size-13 text-muted">With remove button</label>
                                                    <select className="form-control" name="choices-multiple-remove-button" id="choices-multiple-remove-button" placeholder="This is a placeholder" multiple defaultValue={['Choice 1']}>
                                                        <option value="Choice 1">Choice 1</option>
                                                        <option value="Choice 2">Choice 2</option>
                                                        <option value="Choice 3">Choice 3</option>
                                                        <option value="Choice 4">Choice 4</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-multiple-groups" className="form-label font-size-13 text-muted">Option groups</label>
                                                    <select className="form-control" name="choices-multiple-groups" id="choices-multiple-groups" placeholder="This is a placeholder" multiple>
                                                        <option value="">Choose a city</option>
                                                        <optgroup label="UK">
                                                            <option value="London">London</option>
                                                            <option value="Manchester">Manchester</option>
                                                            <option value="Liverpool">Liverpool</option>
                                                        </optgroup>
                                                        <optgroup label="FR">
                                                            <option value="Paris">Paris</option>
                                                            <option value="Lyon">Lyon</option>
                                                            <option value="Marseille">Marseille</option>
                                                        </optgroup>
                                                        <optgroup label="DE" disabled>
                                                            <option value="Hamburg">Hamburg</option>
                                                            <option value="Munich">Munich</option>
                                                            <option value="Berlin">Berlin</option>
                                                        </optgroup>
                                                        <optgroup label="US">
                                                            <option value="New York">New York</option>
                                                            <option value="Washington" disabled>Washington</option>
                                                            <option value="Michigan">Michigan</option>
                                                        </optgroup>
                                                        <optgroup label="SP">
                                                            <option value="Madrid">Madrid</option>
                                                            <option value="Barcelona">Barcelona</option>
                                                            <option value="Malaga">Malaga</option>
                                                        </optgroup>
                                                        <optgroup label="CA">
                                                            <option value="Montreal">Montreal</option>
                                                            <option value="Toronto">Toronto</option>
                                                            <option value="Vancouver">Vancouver</option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                        {/* end row */}
                                    </div>
                                    {/* multi select input Example */}

                                    <div className="mt-4">
                                        <h5 className="font-size-14 mb-3">Text inputs</h5>

                                        <div className="row">
                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-text-remove-button" className="form-label font-size-13 text-muted">Limited to 5 values with remove button</label>
                                                    <input className="form-control" id="choices-text-remove-button" type="text" defaultValue="Task-1,Task-2" placeholder="Enter something" />
                                                </div>
                                            </div>
                                            {/* end col */}

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-text-unique-values" className="form-label font-size-13 text-muted">Unique values only, no pasting</label>
                                                    <input className="form-control" id="choices-text-unique-values" type="text" defaultValue="Project-A, Project-B" placeholder="This is a placeholder" />
                                                </div>
                                            </div>
                                            {/* end col */}
                                        </div>
                                        {/* end row */}

                                        <div>
                                            <label htmlFor="choices-text-disabled" className="form-label font-size-13 text-muted">Disabled</label>
                                            <input className="form-control" id="choices-text-disabled" type="text" defaultValue="josh@joshuajohnson.co.uk, joe@bloggs.co.uk" placeholder="This is a placeholder" />
                                        </div>
                                    </div>
                                </div>
                                {/* end card body */}
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                    </div>
                    {/* end row */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Colorpicker</h4>
                                    <p className="card-title-desc">Flat, Simple, Hackable Color-Picker.</p>
                                </div>
                                <div className="card-body">

                                    <div className="text-center">
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <div className="mt-4">
                                                    <h5 className="font-size-14">Classic Demo</h5>
                                                    <div className="classic-colorpicker"></div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="mt-4">
                                                    <h5 className="font-size-14">Monolith Demo</h5>
                                                    <div className="monolith-colorpicker"></div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="mt-4">
                                                    <h5 className="font-size-14">Nano Demo</h5>
                                                    <div className="nano-colorpicker"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* end card body */}
                            </div>
                            {/* end card */}
                        </div>
                        {/* end col */}
                    </div>
                    {/* end row */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Datepicker</h4>
                                    <p className="card-title-desc">flatpickr is a lightweight and powerful datetime picker.</p>
                                </div>
                                <div className="card-body">

                                    <form action="#">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Basic</label>
                                                    <input type="text" className="form-control" id="datepicker-basic" />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">DateTime</label>
                                                    <input type="text" className="form-control" id="datepicker-datetime" />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Human-friendly Dates</label>
                                                    <input type="text" className="form-control flatpickr-input" id="datepicker-humanfd" />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">MinDate and MaxDate</label>
                                                    <input type="text" className="form-control" id="datepicker-minmax" />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Disabling dates</label>
                                                    <input type="text" className="form-control" id="datepicker-disable" />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Selecting multiple dates</label>
                                                    <input type="text" className="form-control" id="datepicker-multiple" />
                                                </div>

                                                <div>
                                                    <label className="form-label">Range</label>
                                                    <input type="text" className="form-control" id="datepicker-range" />
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="mt-3 mt-lg-0">
                                                    <div className="mb-3">
                                                        <label className="form-label">Timepicker</label>
                                                        <input type="text" className="form-control" id="datepicker-timepicker" />
                                                    </div>

                                                    <div>
                                                        <label className="form-label">Inline Date Picker Demo</label>
                                                        <input type="text" className="form-control" id="datepicker-inline" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
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

export default FormAdvanced;
