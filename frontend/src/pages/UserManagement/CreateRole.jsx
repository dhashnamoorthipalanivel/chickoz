import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRole } from '../../api/userManagementApi';
import { getFranchises } from '../../api/franchiseApi';

const MENU_STRUCTURE = [
  { id: 'dashboard', label: 'Dashboard', submenus: [] },
  { id: 'store', label: 'Store Management', submenus: [
      { id: 'store-billing', label: 'Billing', hasCrud: true },
      { id: 'store-orders', label: 'Orders', hasCrud: true }
  ]},
  { id: 'reports', label: 'Reports', submenus: [
      { id: 'reports-admin', label: 'Admin Report', hasCrud: false },
      { id: 'reports-franchise', label: 'Franchise Report', hasCrud: false }
  ]},
  { id: 'masters', label: 'Masters', submenus: [
      { id: 'master-franchise', label: 'Franchise', hasCrud: true },
      { id: 'master-package', label: 'Package', hasCrud: true },
      { id: 'master-tax', label: 'Tax', hasCrud: true },
      { id: 'master-vendor', label: 'Vendor', hasCrud: true },
      { id: 'master-menu', label: 'Menu Configuration', hasCrud: true },
      { id: 'master-masala-items', label: 'Masala Items', hasCrud: true },
      { id: 'master-payment', label: 'Payment Mode', hasCrud: true },
      { id: 'master-order', label: 'Order Type', hasCrud: true },
      { id: 'master-lead', label: 'Lead Source', hasCrud: true },
      { id: 'master-document', label: 'Document', hasCrud: true },
      { id: 'master-material', label: 'Material', hasCrud: true },
      { id: 'master-customer', label: 'Customer', hasCrud: true },
      { id: 'master-table', label: 'Table Master', hasCrud: true },
  ]},
  { id: 'crm', label: 'CRM', submenus: [
      { id: 'crm-enquiry', label: 'Enquiry', hasCrud: true },
      { id: 'crm-lead', label: 'Lead', hasCrud: true }
  ]},
  { id: 'manufacture', label: 'Manufacture', submenus: [
      { id: 'manufacture-kishok', label: 'Kishok', hasCrud: true },
      { id: 'manufacture-masala-req', label: 'Masala Franchise Requests', hasCrud: true },
      { id: 'manufacture-masala-admin', label: 'Masala Admin Processing', hasCrud: true }
  ]},
  { id: 'users', label: 'User Management', submenus: [
      { id: 'users-list', label: 'Users', hasCrud: true },
      { id: 'roles-list', label: 'Roles', hasCrud: true },
      { id: 'role-assignments', label: 'Role Assignments', hasCrud: true }
  ]},
];

const CreateRole = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    franchiseId: '',
    permissions: []
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

  const togglePerm = (perm, isParent = false, parentId = null, isCrudChild = false, baseId = null) => {
    setFormData(prev => {
      let newPerms = new Set(prev.permissions);
      
      if (newPerms.has(perm)) {
        // DESELECTING
        newPerms.delete(perm);
        
        // If parent is deselected, deselect ALL children and their CRUD flags
        if (isParent) {
          const parentItem = MENU_STRUCTURE.find(m => m.id === perm);
          if (parentItem) {
            parentItem.submenus.forEach(sub => {
              newPerms.delete(sub.id);
              newPerms.delete(`${sub.id}_view`);
              newPerms.delete(`${sub.id}_create`);
              newPerms.delete(`${sub.id}_edit`);
              newPerms.delete(`${sub.id}_delete`);
            });
          }
        }
        
        // If base ID is deselected, deselect its CRUD flags
        if (!isParent && !isCrudChild) {
           newPerms.delete(`${perm}_view`);
           newPerms.delete(`${perm}_create`);
           newPerms.delete(`${perm}_edit`);
           newPerms.delete(`${perm}_delete`);
        }

        // If _view is deselected, deselect create, edit, delete
        if (isCrudChild && perm.endsWith('_view')) {
           newPerms.delete(`${baseId}_create`);
           newPerms.delete(`${baseId}_edit`);
           newPerms.delete(`${baseId}_delete`);
        }
        
      } else {
        // SELECTING
        newPerms.add(perm);
        
        // If child is selected, ensure base and parent are selected
        if (parentId) newPerms.add(parentId);
        if (baseId) newPerms.add(baseId);

        // If a CRUD flag (like _create) is selected, force _view to be selected
        if (isCrudChild && !perm.endsWith('_view')) {
           newPerms.add(`${baseId}_view`);
        }
        
        // If base is selected, ensure all CRUD options are selected
        if (!isParent && !isCrudChild) {
           const parentItem = MENU_STRUCTURE.find(m => m.id === parentId);
           const subItem = parentItem?.submenus.find(s => s.id === perm);
           if(subItem?.hasCrud) {
               newPerms.add(`${perm}_view`);
               newPerms.add(`${perm}_create`);
               newPerms.add(`${perm}_edit`);
               newPerms.add(`${perm}_delete`);
           }
        }
      }
      
      return { ...prev, permissions: Array.from(newPerms) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRole(formData);
      navigate('/roles');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create role');
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box">
                <h4 className="mb-0 font-size-18">Create Role</h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Role Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Manager, Marketing" />
                      </div>
                      <div className="col-md-6 mb-3">
                        {isSuperAdmin && (
                          <>
                            <label>Assign to Franchise (Optional)</label>
                            <select className="form-control" value={formData.franchiseId} onChange={e => setFormData({ ...formData, franchiseId: e.target.value })}>
                              <option value="">-- Global Role --</option>
                              {franchises.map(f => (
                                <option key={f._id} value={f._id}>{f.name} - {f.franchiseName}</option>
                              ))}
                            </select>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label>Description</label>
                      <textarea className="form-control" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="d-block mb-3 font-size-16 border-bottom pb-2">Menu & Submenu Permissions</label>
                      <div className="row">
                        {MENU_STRUCTURE.map(menu => (
                          <div className="col-md-6 col-xl-4 mb-4" key={menu.id}>
                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                              
                              {/* Card Header (Main Menu toggle) */}
                              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="form-check form-switch form-switch-md">
                                    <input 
                                      className="form-check-input" 
                                      type="checkbox" 
                                      id={`perm-${menu.id}`}
                                      checked={formData.permissions.includes(menu.id)}
                                      onChange={() => togglePerm(menu.id, true)}
                                      style={{ cursor: 'pointer' }}
                                    />
                                    <label className="form-check-label fw-bold text-dark font-size-16 ms-1" htmlFor={`perm-${menu.id}`} style={{ cursor: 'pointer' }}>
                                      {menu.label}
                                    </label>
                                  </div>
                                </div>
                                <hr className="text-muted opacity-25 mb-0 mt-3" />
                              </div>

                              {/* Card Body (Submenus & CRUD) */}
                              <div className="card-body px-4 py-3 bg-light bg-opacity-50">
                                {menu.submenus.length > 0 ? (
                                  <div className="d-flex flex-column gap-3">
                                    {menu.submenus.map(sub => (
                                      <div className="bg-white p-3 rounded-3 shadow-sm border border-light" key={sub.id}>
                                        <div className="form-check mb-2">
                                          <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id={`perm-${sub.id}`}
                                            checked={formData.permissions.includes(sub.id)}
                                            onChange={() => togglePerm(sub.id, false, menu.id)}
                                            style={{ cursor: 'pointer' }}
                                          />
                                          <label className="form-check-label fw-semibold text-secondary" htmlFor={`perm-${sub.id}`} style={{ cursor: 'pointer' }}>
                                            {sub.label}
                                          </label>
                                        </div>
                                        
                                        {/* CRUD OPTIONS */}
                                        {sub.hasCrud && (
                                           <div className="d-flex flex-wrap gap-2 mt-2 pt-2 border-top border-light">
                                             {['view', 'create', 'edit', 'delete'].map(action => (
                                                <div className="form-check form-check-inline me-0 mb-0" key={`${sub.id}_${action}`}>
                                                  <input 
                                                    className="form-check-input" 
                                                    style={{ width: '1em', height: '1em', cursor: 'pointer', marginTop: '0.2rem' }}
                                                    type="checkbox" 
                                                    id={`perm-${sub.id}_${action}`}
                                                    checked={formData.permissions.includes(`${sub.id}_${action}`)}
                                                    onChange={() => togglePerm(`${sub.id}_${action}`, false, menu.id, true, sub.id)}
                                                  />
                                                  <label className="form-check-label font-size-12 text-muted" htmlFor={`perm-${sub.id}_${action}`} style={{ cursor: 'pointer', marginLeft: '4px' }}>
                                                    {action.charAt(0).toUpperCase() + action.slice(1)}
                                                  </label>
                                                </div>
                                             ))}
                                           </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-muted font-size-13 text-center py-4">
                                    No submenus available
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary px-5">Create Role</button>
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

export default CreateRole;
