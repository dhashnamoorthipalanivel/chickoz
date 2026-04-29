import React from 'react';
import { Link } from 'react-router-dom';

const TablesBasic = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Basic Tables</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="#">Tables</Link></li>
                                        <li className="breadcrumb-item active">Basic Tables</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Basic example</h4>
                                    <p className="card-title-desc">For basic styling—light padding and only horizontal dividers—add the base class <code>.table</code> to any <code>&lt;table&gt;</code>.</p>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-centered table-nowrap mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>Username</th>
                                                    <th>Role</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td>1</td><td>Mark</td><td>Otto</td><td>@mdo</td><td>Admin</td><td><span className="badge bg-success">Active</span></td></tr>
                                                <tr><td>2</td><td>Jacob</td><td>Thornton</td><td>@fat</td><td>Editor</td><td><span className="badge bg-success">Active</span></td></tr>
                                                <tr><td>3</td><td>Larry</td><td>Bird</td><td>@twitter</td><td>Author</td><td><span className="badge bg-warning">Pending</span></td></tr>
                                                <tr><td>4</td><td>John</td><td>Doe</td><td>@johndoe</td><td>Subscriber</td><td><span className="badge bg-danger">Inactive</span></td></tr>
                                                <tr><td>5</td><td>Ana</td><td>Smith</td><td>@asmith</td><td>Author</td><td><span className="badge bg-success">Active</span></td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Striped rows</h4>
                                    <p className="card-title-desc">Use <code>.table-striped</code> to add zebra-striping to any table row within the <code>&lt;tbody&gt;</code>.</p>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-centered mb-0">
                                            <thead>
                                                <tr><th>#</th><th>First Name</th><th>Last Name</th><th>Username</th></tr>
                                            </thead>
                                            <tbody>
                                                <tr><td>1</td><td>Mark</td><td>Otto</td><td>@mdo</td></tr>
                                                <tr><td>2</td><td>Jacob</td><td>Thornton</td><td>@fat</td></tr>
                                                <tr><td>3</td><td>Larry</td><td>Bird</td><td>@twitter</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Bordered table</h4>
                                    <p className="card-title-desc">Add <code>.table-bordered</code> for borders on all sides of the table and cells.</p>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-centered mb-0">
                                            <thead>
                                                <tr><th>#</th><th>First Name</th><th>Last Name</th><th>Username</th></tr>
                                            </thead>
                                            <tbody>
                                                <tr><td>1</td><td>Mark</td><td>Otto</td><td>@mdo</td></tr>
                                                <tr><td>2</td><td>Jacob</td><td>Thornton</td><td>@fat</td></tr>
                                                <tr><td>3</td><td>Larry</td><td>Bird</td><td>@twitter</td></tr>
                                            </tbody>
                                        </table>
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

export default TablesBasic;
