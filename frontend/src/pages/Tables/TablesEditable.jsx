import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TablesEditable = () => {
    const [rows, setRows] = useState([
        { id: 1, name: 'Tiger Nixon', position: 'System Architect', office: 'Edinburgh', age: 61 },
        { id: 2, name: 'Garrett Winters', position: 'Accountant', office: 'Tokyo', age: 63 },
        { id: 3, name: 'Ashton Cox', position: 'Junior Technical Author', office: 'San Francisco', age: 66 },
    ]);

    const handleEdit = (id, field, value) => {
        setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row"><div className="col-12"><div className="page-title-box d-sm-flex align-items-center justify-content-between"><h4 className="mb-sm-0 font-size-18">Editable Tables</h4><div className="page-title-right"><ol className="breadcrumb m-0"><li className="breadcrumb-item"><Link to="#">Tables</Link></li><li className="breadcrumb-item active">Editable</li></ol></div></div></div></div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header"><h4 className="card-title">Editable Table</h4><p className="card-title-desc">Click on any cell to edit its content inline.</p></div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-centered mb-0">
                                            <thead className="table-light">
                                                <tr><th>#</th><th>Name</th><th>Position</th><th>Office</th><th>Age</th></tr>
                                            </thead>
                                            <tbody>
                                                {rows.map(row => (
                                                    <tr key={row.id}>
                                                        <td>{row.id}</td>
                                                        <td contentEditable suppressContentEditableWarning onBlur={e => handleEdit(row.id, 'name', e.target.innerText)}>{row.name}</td>
                                                        <td contentEditable suppressContentEditableWarning onBlur={e => handleEdit(row.id, 'position', e.target.innerText)}>{row.position}</td>
                                                        <td contentEditable suppressContentEditableWarning onBlur={e => handleEdit(row.id, 'office', e.target.innerText)}>{row.office}</td>
                                                        <td contentEditable suppressContentEditableWarning onBlur={e => handleEdit(row.id, 'age', e.target.innerText)}>{row.age}</td>
                                                    </tr>
                                                ))}
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
export default TablesEditable;
