import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Feather from 'react-feather';
import { fetchRoleAssignments, deleteRoleAssignment } from '../../api/userManagementApi';

const RoleAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAssignments = async () => {
    try {
      const data = await fetchRoleAssignments();
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this role assignment?')) return;
    try {
      await deleteRoleAssignment(id);
      loadAssignments();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove');
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">Role Assignments</h4>
                <div className="page-title-right">
                  <Link to="/role-assignments/create" className="btn btn-primary">
                    <Feather.Plus size={16} className="me-1" /> Assign Role
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
                      <table className="table align-middle table-nowrap">
                        <thead className="table-light">
                          <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>User Franchise</th>
                            <th>Assigned Role</th>
                            <th>Role Scope</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignments.map(item => (
                            <tr key={item._id}>
                              <td>{item.userId?.firstName} {item.userId?.lastName}</td>
                              <td>{item.userId?.email}</td>
                              <td>
                                {item.userId?.franchiseId ? (
                                  <span className="badge bg-soft-info text-info">
                                    {item.userId.franchiseId.name || item.userId.franchiseId.franchiseName}
                                  </span>
                                ) : (
                                  <span className="badge bg-soft-primary text-primary">Global</span>
                                )}
                              </td>
                              <td><strong>{item.roleId?.name}</strong></td>
                              <td>
                                {item.roleId?.franchiseId ? (
                                  <span className="badge bg-soft-warning text-warning">
                                    {item.roleId.franchiseId.name || item.roleId.franchiseId.franchiseName || 'Franchise Specific'}
                                  </span>
                                ) : (
                                  <span className="badge bg-soft-success text-success">Global Role</span>
                                )}
                              </td>
                              <td>
                                <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-soft-danger">
                                  <Feather.Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {assignments.length === 0 && (
                            <tr>
                              <td colSpan="6" className="text-center py-4 text-muted">No assignments found</td>
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

export default RoleAssignments;
