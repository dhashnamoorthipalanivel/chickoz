import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Feather from 'react-feather';
import { fetchRoles, deleteRole } from '../../api/userManagementApi';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await deleteRole(id);
      loadRoles();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Roles</h4>
                <div className="page-title-right">
                  <Link to="/roles/create" className="btn btn-primary">
                    <Feather.Plus size={16} className="me-1" /> Create Role
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-dark">
                          <tr>
                            <th>Role Name</th>
                            <th>Scope (Franchise)</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roles.map(role => (
                            <tr key={role._id}>
                              <td className="fw-bold">{role.name}</td>
                              <td>
                                {role.franchiseId ? (
                                  <span className="badge bg-soft-warning text-warning">{role.franchiseId.name}</span>
                                ) : (
                                  <span className="badge bg-soft-info text-info">Global</span>
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Link to={`/roles/edit/${role._id}`} className="btn btn-sm btn-soft-primary">
                                    <Feather.Edit size={14} />
                                  </Link>
                                  <button onClick={() => handleDelete(role._id)} className="btn btn-sm btn-soft-danger">
                                    <Feather.Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {roles.length === 0 && (
                            <tr>
                              <td colSpan="3" className="text-center py-4 text-muted">No roles found</td>
                            </tr>
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

export default RolesList;
