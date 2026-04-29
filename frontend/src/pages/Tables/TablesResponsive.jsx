import React from 'react';
import { Link } from 'react-router-dom';

const TablesResponsive = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Responsive Tables</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Tables</Link></li><li className="breadcrumb-item active">Responsive</li></ol></div></div></div></div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header"><h4 className="card-title">Responsive Table</h4><p className="card-title-desc">Responsive tables allow tables to be scrolled horizontally with ease.</p></div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-centered mb-0">
                                        <thead><tr><th>#</th><th>First Name</th><th>Last Name</th><th>Username</th><th>Role</th><th>Email</th><th>City</th><th>Country</th><th>Status</th></tr></thead>
                                        <tbody>
                                            <tr><td>1</td><td>Mark</td><td>Otto</td><td>@mdo</td><td>Admin</td><td>mark@example.com</td><td>New York</td><td>USA</td><td><span className="badge bg-success">Active</span></td></tr>
                                            <tr><td>2</td><td>Jacob</td><td>Thornton</td><td>@fat</td><td>Editor</td><td>jacob@example.com</td><td>London</td><td>UK</td><td><span className="badge bg-success">Active</span></td></tr>
                                            <tr><td>3</td><td>Larry</td><td>Bird</td><td>@twitter</td><td>Author</td><td>larry@example.com</td><td>Tokyo</td><td>Japan</td><td><span className="badge bg-warning">Pending</span></td></tr>
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
export default TablesResponsive;
