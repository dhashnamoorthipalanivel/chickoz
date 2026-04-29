import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialData = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'Admin', status: 'Active', date: '2024-01-15', avatar: 'JS' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Editor', status: 'Active', date: '2024-02-20', avatar: 'SJ' },
    { id: 3, name: 'Michael Brown', email: 'm.brown@example.com', role: 'Author', status: 'Inactive', date: '2024-01-08', avatar: 'MB' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', role: 'Subscriber', status: 'Active', date: '2024-03-10', avatar: 'ED' },
    { id: 5, name: 'Robert Wilson', email: 'r.wilson@example.com', role: 'Editor', status: 'Pending', date: '2024-02-05', avatar: 'RW' },
    { id: 6, name: 'Jessica Lee', email: 'jess.lee@example.com', role: 'Author', status: 'Active', date: '2024-03-18', avatar: 'JL' },
    { id: 7, name: 'David Taylor', email: 'd.taylor@example.com', role: 'Admin', status: 'Active', date: '2024-01-22', avatar: 'DT' },
    { id: 8, name: 'Amanda White', email: 'a.white@example.com', role: 'Subscriber', status: 'Inactive', date: '2024-02-28', avatar: 'AW' },
];

const statusBadge = (status) => {
    const map = { Active: 'bg-success', Inactive: 'bg-danger', Pending: 'bg-warning' };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
};

const roleBadge = (role) => {
    const map = { Admin: 'bg-primary', Editor: 'bg-info', Author: 'bg-secondary', Subscriber: 'bg-light text-dark' };
    return <span className={`badge ${map[role] || 'bg-secondary'}`}>{role}</span>;
};

const avatarColors = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-purple', 'bg-pink', 'bg-secondary'];

const CustomList = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selected, setSelected] = useState([]);
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState(null);
    const perPage = 5;

    const toggleStatus = (id) => {
        setData(prev => prev.map(row => {
            if (row.id !== id) return row;
            const next = row.status === 'Active' ? 'Inactive' : 'Active';
            setToast({ id, name: row.name, status: next });
            setTimeout(() => setToast(null), 2500);
            return { ...row, status: next };
        }));
    };

    const filtered = data.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase()) ||
            item.role.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const toggleAll = () => {
        if (selected.length === paged.length) setSelected([]);
        else setSelected(paged.map(r => r.id));
    };

    const confirmDelete = (id) => { setDeleteId(id); setShowDeleteModal(true); };
    const handleDelete = () => {
        setData(prev => prev.filter(r => r.id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Custom List</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Custom List</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="row">
                        {[
                            { title: 'Total Users', value: data.length, icon: 'bx-group', color: 'primary', bg: 'bg-primary-subtle' },
                            { title: 'Active', value: data.filter(d => d.status === 'Active').length, icon: 'bx-check-circle', color: 'success', bg: 'bg-success-subtle' },
                            { title: 'Inactive', value: data.filter(d => d.status === 'Inactive').length, icon: 'bx-x-circle', color: 'danger', bg: 'bg-danger-subtle' },
                            { title: 'Pending', value: data.filter(d => d.status === 'Pending').length, icon: 'bx-time', color: 'warning', bg: 'bg-warning-subtle' },
                        ].map((stat, i) => (
                            <div className="col-xl-3 col-md-6" key={i}>
                                <div className="card card-h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <span className="text-muted mb-3 lh-1 d-block text-truncate">{stat.title}</span>
                                                <h4 className="mb-3"><span>{stat.value}</span></h4>
                                            </div>
                                            <div className={`avatar-sm flex-shrink-0 ${stat.bg} rounded`}>
                                                <span className={`avatar-title ${stat.bg} text-${stat.color} font-size-20 rounded`}>
                                                    <i className={`bx ${stat.icon}`}></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Card */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                        <h4 className="card-title mb-0">User Records</h4>
                                        <div className="d-flex gap-2">
                                            {selected.length > 0 && (
                                                <button className="btn btn-sm btn-danger" onClick={() => { setData(prev => prev.filter(r => !selected.includes(r.id))); setSelected([]); }}>
                                                    <i className="bx bx-trash me-1"></i> Delete ({selected.length})
                                                </button>
                                            )}
                                            <Link to="/custom-create" className="btn btn-sm btn-primary">
                                                <i className="bx bx-plus me-1"></i> Add New
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    {/* Filters */}
                                    <div className="row mb-3 g-2">
                                        <div className="col-sm-8 col-md-6">
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search by name, email or role..."
                                                    value={search}
                                                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                                                />
                                                <i className="bx bx-search position-absolute" style={{ top: '50%', right: '12px', transform: 'translateY(-50%)', color: '#adb5bd' }}></i>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 col-md-3">
                                            <select className="form-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                                                <option value="All">All Status</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3 text-end">
                                            <span className="text-muted font-size-13">{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</span>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="table-responsive">
                                        <table className="table table-hover table-centered align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: '40px' }}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={toggleAll} id="checkAll" />
                                                            <label className="form-check-label" htmlFor="checkAll"></label>
                                                        </div>
                                                    </th>
                                                    <th>User</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th>Status</th>
                                                    <th>Join Date</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paged.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-5 text-muted">
                                                            <i className="bx bx-search-alt display-4 d-block mb-2"></i>
                                                            No records found.
                                                        </td>
                                                    </tr>
                                                ) : paged.map((row, idx) => (
                                                    <tr key={row.id} className={selected.includes(row.id) ? 'table-active' : ''}>
                                                        <td>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} id={`check-${row.id}`} />
                                                                <label className="form-check-label" htmlFor={`check-${row.id}`}></label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className={`avatar-sm ${avatarColors[idx % avatarColors.length]} rounded-circle d-flex align-items-center justify-content-center text-white font-size-13 fw-semibold`} style={{ minWidth: '36px', height: '36px', fontSize: '0.75rem' }}>
                                                                    {row.avatar}
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0 font-size-14">{row.name}</h6>
                                                                    <p className="text-muted mb-0 font-size-12">ID: #{row.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><a href={`mailto:${row.email}`} className="text-body">{row.email}</a></td>
                                                        <td>{roleBadge(row.role)}</td>
                                                        <td>{statusBadge(row.status)}</td>
                                                        <td>{row.date}</td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <Link to={`/custom-edit?id=${row.id}`} className="btn btn-sm btn-outline-primary" title="Edit">
                                                                    <i className="bx bx-edit-alt"></i>
                                                                </Link>
                                                                <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => confirmDelete(row.id)}>
                                                                    <i className="bx bx-trash-alt"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                                            <div className="text-muted font-size-13">
                                                Showing {((page - 1) * perPage) + 1} – {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                                            </div>
                                            <ul className="pagination pagination-rounded mb-0">
                                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                                    <button className="page-link" onClick={() => setPage(p => p - 1)}>
                                                        <i className="bx bx-chevron-left"></i>
                                                    </button>
                                                </li>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                    <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                                                        <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                                    <button className="page-link" onClick={() => setPage(p => p + 1)}>
                                                        <i className="bx bx-chevron-right"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Toggle Toast */}
            {toast && (
                <div
                    style={{
                        position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
                        minWidth: '280px', animation: 'fadeIn 0.3s ease'
                    }}
                >
                    <div className={`toast show align-items-center text-white border-0 ${toast.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        <div className="d-flex">
                            <div className="toast-body d-flex align-items-center gap-2">
                                <i className={`bx ${toast.status === 'Active' ? 'bx-check-circle' : 'bx-x-circle'} font-size-18`}></i>
                                <div>
                                    <strong>{toast.name}</strong> set to
                                    <span className={`badge ms-1 ${toast.status === 'Active' ? 'bg-light text-success' : 'bg-light text-secondary'}`}>{toast.status}</span>
                                </div>
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast(null)}></button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body text-center pb-4">
                                <div className="avatar-md mx-auto mb-4">
                                    <div className="avatar-title bg-danger-subtle text-danger rounded-circle font-size-32">
                                        <i className="bx bx-trash-alt"></i>
                                    </div>
                                </div>
                                <h5>Delete Record?</h5>
                                <p className="text-muted mb-0">Are you sure you want to delete this record? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer border-0 pt-0 justify-content-center gap-2">
                                <button className="btn btn-secondary px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn btn-danger px-4" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default CustomList;
