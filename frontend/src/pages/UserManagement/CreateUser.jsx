import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, fetchRoles } from '../../api/userManagementApi';
import { getFranchises } from '../../api/franchiseApi';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    franchiseId: '',
    role: 'user'
  });
  
  const [franchises, setFranchises] = useState([]);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (isSuperAdmin) {
      getFranchises().then(res => {
        if (res.data) setFranchises(res.data);
      }).catch(err => console.error(err));
    }
  }, [isSuperAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      navigate('/users');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create user');
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <h4 className="mb-0 font-size-18">Create User</h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>First Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Last Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label>Email <span className="text-danger">*</span></label>
                      <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div className="mb-3">
                      <label>Phone <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>

                    <div className="mb-3">
                      <label>Password <span className="text-danger">*</span></label>
                      <input type="password" className="form-control" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    {isSuperAdmin && (
                      <div className="mb-3">
                        <label>Assign to Franchise (Optional, leave blank for global user)</label>
                        <select className="form-control" value={formData.franchiseId} onChange={e => setFormData({ ...formData, franchiseId: e.target.value })}>
                          <option value="">-- Global --</option>
                          {franchises.map(f => (
                            <option key={f._id} value={f._id}>{f.name} - {f.franchiseName}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mb-4">
                      <label>Internal Role Type (System Access Level) <span className="text-danger">*</span></label>
                      <select className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                        <option value="user">Standard User</option>
                        {isSuperAdmin && <option value="admin">Admin</option>}
                      </select>
                      <small className="text-muted d-block mt-1">To give specific menu access (like "Manager"), create a Role and use the Role Assignments page after creating this user.</small>
                    </div>

                    <button type="submit" className="btn btn-primary px-4">Create User</button>
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

export default CreateUser;
