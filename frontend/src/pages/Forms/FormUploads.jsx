import React from 'react';
import { Link } from 'react-router-dom';

const FormUploads = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">File Upload</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Forms</Link></li>
                                        <li className="breadcrumb-item active">File Upload</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Dropzone</h4>
                                    <p className="card-title-desc">DropzoneJS is an open source library that provides drag'n'drop file uploads with image previews.</p>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <div className="dropzone" style={{border: '2px dashed #ced4da', borderRadius: '6px', padding: '40px', textAlign: 'center', background: '#f8f9fa', cursor: 'pointer'}}>
                                            <div className="dz-message needsclick">
                                                <div className="mb-3">
                                                    <i className="display-4 text-muted bx bx-cloud-upload"></i>
                                                </div>
                                                <h5>Drop files here or click to upload.</h5>
                                                <input name="file" type="file" multiple className="d-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <button type="button" className="btn btn-primary waves-effect waves-light">Send Files</button>
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

export default FormUploads;
