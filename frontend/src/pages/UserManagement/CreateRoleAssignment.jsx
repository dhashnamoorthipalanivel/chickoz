import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoleAssignment, fetchRoles, fetchUsers } from '../../api/userManagementApi';

const CreateRoleAssignment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userId: '', roleId: '' });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  
  useEffect(() => {
    // When fetching users and roles, the backend automatically enforces Franchise Isolation 
    // so we don't need to specify franchiseId here.
    Promise.all([fetchUsers(), fetchRoles()])
      .then(([usersRes, rolesRes]) => {
        if (usersRes.users) setUsers(usersRes.users);
        if (rolesRes) setRoles(rolesRes);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRoleAssignment(formData);
      navigate('/role-assignments');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign role');
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <h4 className="mb-0 font-size-18">Assign Role to User</h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label>Select User <span className="text-danger">*</span></label>
                      <select className="form-control" required value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })}>
                        <option value="">-- Choose User --</option>
                        {users.map(u => (
                          <option key={u._id} value={u._id}>{u.firstName} {u.lastName} ({u.email})</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label>Select Role <span className="text-danger">*</span></label>
                      <select className="form-control" required value={formData.roleId} onChange={e => setFormData({ ...formData, roleId: e.target.value })}>
                        <option value="">-- Choose Role --</option>
                        {roles.map(r => (
                          <option key={r._id} value={r._id}>{r.name} {r.franchiseId ? `(${r.franchiseId.name})` : '(Global)'}</option>
                        ))}
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary px-4">Assign Role</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateRoleAssignment;
