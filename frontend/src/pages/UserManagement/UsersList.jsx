import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Feather from 'react-feather';
import { fetchUsers, deleteUser } from '../../api/userManagementApi';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const isSuperAdmin = role === "super_admin";
  const isFranchiseAdmin = role === "franchise"; 

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers('', search, 1);
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const totalPages = Math.ceil(users.length / perPage);
  const paged = users.slice((page - 1) * perPage, page * perPage);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">

          {/* ── Page header ── */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "linear-gradient(135deg, #D91E18 0%, #F97316 100%)",
                    boxShadow: "0 4px 14px rgba(217,30,24,0.32)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className="bx bx-user" style={{ color: "#fff", fontSize: 22 }} />
                  </div>
                  <div>
                    <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>
                      User Management
                    </h4>
                    <div style={{ fontSize: 12, color: "#F97316", fontWeight: 600, marginTop: 1 }}>
                      Configuration · Users
                    </div>
                  </div>
                </div>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">User Management</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h4 className="card-title mb-0">User Records</h4>
                      <span style={{
                        background: "linear-gradient(135deg,#D91E18 0%,#F97316 100%)",
                        color: "#fff", borderRadius: 10,
                        padding: "2px 9px", fontSize: 11, fontWeight: 700,
                        boxShadow: "0 2px 6px rgba(217,30,24,0.3)",
                      }}>{users.length}</span>
                    </div>
                    <Link
                      to="/users/create"
                      className="btn btn-primary"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "8px 18px", borderRadius: 10,
                        fontWeight: 700, fontSize: 13.5,
                      }}
                    >
                      <i className="bx bx-plus" style={{ fontSize: 16 }} /> Add User
                    </Link>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="row mb-3 g-2 align-items-center">
                    <div className="col-auto d-flex align-items-center gap-2">
                      <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>Show</span>
                      <select className="form-select form-select-sm" style={{ width: 70 }} value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                        {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <span style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>entries</span>
                    </div>
                    <div className="col-sm-12 col-md-4">
                      <div className="position-relative">
                        <input
                           type="text"
                           className="form-control"
                           placeholder="Search users..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                         />
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center p-4">Loading...</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-centered table-nowrap mb-0">
                        <thead className="thead-light">
                          <tr>
                            <th>User</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Franchise</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paged.length > 0 ? paged.map((u) => (
                            <tr key={u._id} className="adm-tr">
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div style={{width: 32, height: 32, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 'bold'}}>
                                    {u.firstName?.[0]}{u.lastName?.[0]}
                                  </div>
                                  <div>
                                    <div style={{fontWeight: 600, color: '#1f2937'}}>{u.firstName} {u.lastName}</div>
                                    <div style={{fontSize: 12, color: '#6b7280'}}>{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{u.phone || '-'}</td>
                              <td>
                                {u.role === 'admin' ? (
                                  <span className="badge bg-soft-danger text-danger">Admin</span>
                                ) : (
                                  <span className="badge bg-soft-info text-info">{u.role}</span>
                                )}
                              </td>
                              <td>
                                {u.franchiseId ? (
                                  <span className="badge bg-soft-warning text-warning">
                                    {u.franchiseId.name || u.franchiseId.franchiseName}
                                  </span>
                                ) : (
                                  <span className="badge bg-soft-primary text-primary">Global</span>
                                )}
                              </td>
                              <td>
                                <Link to={`/users/${u._id}/edit`} className="text-primary me-2"><Feather.Edit2 size={16} /></Link>
                                <button onClick={() => handleDelete(u._id)} className="btn btn-sm btn-soft-danger">
                                  <Feather.Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan="5" className="text-center">No users found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UsersList;
