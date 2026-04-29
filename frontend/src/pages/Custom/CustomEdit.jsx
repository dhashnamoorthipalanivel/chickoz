import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Pre-filled data for editing (simulated fetch)
const RECORDS = {
    1: { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', phone: '+1 555-0101', role: 'Admin', status: 'Active', address: '123 Main St', city: 'New York', country: 'United States', zipCode: '10001', bio: 'Experienced admin with 5+ years in the field.', website: 'https://johnsmith.com', twitter: '@johnsmith', linkedin: 'linkedin.com/in/johnsmith', notifications: true, twoFactor: true, newsletter: false },
    2: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@example.com', phone: '+1 555-0102', role: 'Editor', status: 'Active', address: '456 Oak Ave', city: 'Chicago', country: 'United States', zipCode: '60601', bio: 'Content editor with a passion for good writing.', website: '', twitter: '@sarahj', linkedin: '', notifications: true, twoFactor: false, newsletter: true },
};

const CustomEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryId = new URLSearchParams(location.search).get('id');
    const prefill = RECORDS[queryId] || null;

    const [form, setForm] = useState(prefill || {
        firstName: '', lastName: '', email: '', phone: '', role: 'Editor', status: 'Active',
        address: '', city: '', country: '', zipCode: '', bio: '', website: '',
        twitter: '', linkedin: '', notifications: true, twoFactor: false, newsletter: true,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [avatar, setAvatar] = useState(null);
    const [showDiscard, setShowDiscard] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'First name is required';
        if (!form.lastName.trim()) e.lastName = 'Last name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.role) e.role = 'Please select a role';
        return e;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); setActiveTab('basic'); return; }
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);
            setTimeout(() => navigate('/custom-list'), 1500);
        }, 1200);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const tabList = [
        { id: 'basic', label: 'Basic Info', icon: 'bx-user' },
        { id: 'contact', label: 'Contact & Location', icon: 'bx-map' },
        { id: 'social', label: 'Social & Bio', icon: 'bx-share-alt' },
        { id: 'settings', label: 'Settings', icon: 'bx-cog' },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    {/* Page Title */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <h4 className="mb-sm-0 font-size-18">Edit Record</h4>
                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                                        <li className="breadcrumb-item"><Link to="/custom-list">Custom List</Link></li>
                                        <li className="breadcrumb-item active">Edit</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {success && (
                        <div className="alert alert-success d-flex align-items-center gap-2">
                            <i className="bx bx-check-circle font-size-18"></i>
                            <div><strong>Updated!</strong> Record saved successfully. Redirecting...</div>
                        </div>
                    )}

                    {/* Edit Banner */}
                    {prefill && (
                        <div className="alert alert-info-subtle d-flex align-items-center gap-2 border-start border-info border-3 bg-info-subtle mb-3">
                            <i className="bx bx-info-circle font-size-18 text-info"></i>
                            <span className="font-size-13">Editing record for <strong>{prefill.firstName} {prefill.lastName}</strong>. Changes will be saved upon submission.</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* LEFT: Profile Card */}
                            <div className="col-xl-3">
                                <div className="card">
                                    <div className="card-body text-center">
                                        <div className="mb-3">
                                            <div className="position-relative d-inline-block">
                                                {avatar ? (
                                                    <img src={avatar} alt="avatar" className="rounded-circle border" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '100px', height: '100px', fontSize: '2rem', margin: '0 auto' }}>
                                                        {form.firstName?.[0]}{form.lastName?.[0]}
                                                    </div>
                                                )}
                                                <label className="position-absolute bottom-0 end-0" style={{ cursor: 'pointer' }}>
                                                    <span className="avatar-title rounded-circle bg-light border" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <i className="bx bxs-camera text-muted" style={{ fontSize: '14px' }}></i>
                                                    </span>
                                                    <input type="file" accept="image/*" className="d-none" onChange={handleAvatarChange} />
                                                </label>
                                            </div>
                                            <h5 className="mt-3 mb-1 font-size-16">{form.firstName} {form.lastName}</h5>
                                            {form.role && <span className="badge bg-primary">{form.role}</span>}
                                            <div className="mt-1">
                                                {form.status === 'Active' && <span className="badge bg-success ms-1">Active</span>}
                                                {form.status === 'Inactive' && <span className="badge bg-danger ms-1">Inactive</span>}
                                                {form.status === 'Pending' && <span className="badge bg-warning ms-1">Pending</span>}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="text-start">
                                            {[
                                                { icon: 'bx-envelope', val: form.email || '—' },
                                                { icon: 'bx-phone', val: form.phone || '—' },
                                                { icon: 'bx-map', val: form.city ? `${form.city}, ${form.country}` : '—' },
                                            ].map((item, i) => (
                                                <div key={i} className="d-flex align-items-center gap-2 mb-2 text-muted font-size-13">
                                                    <i className={`bx ${item.icon} font-size-16 text-primary`}></i>
                                                    <span className="text-truncate">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <hr />

                                        {/* Tab Progress Indicator */}
                                        <div className="text-start mb-3">
                                            <p className="text-muted font-size-12 mb-2">Form Progress</p>
                                            {tabList.map(tab => (
                                                <div
                                                    key={tab.id}
                                                    className={`d-flex align-items-center gap-2 p-2 rounded mb-1 cursor-pointer ${activeTab === tab.id ? 'bg-primary-subtle text-primary' : 'text-muted'}`}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <i className={`bx ${tab.icon} font-size-16`}></i>
                                                    <span className="font-size-13">{tab.label}</span>
                                                    {activeTab === tab.id && <i className="bx bx-chevron-right ms-auto"></i>}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                                {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bx bx-save me-1"></i>Update Record</>}
                                            </button>
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setShowDiscard(true)}>
                                                <i className="bx bx-x me-1"></i>Discard Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Danger Zone Card */}
                                <div className="card border border-danger">
                                    <div className="card-header bg-danger-subtle border-danger">
                                        <h6 className="mb-0 text-danger"><i className="bx bx-error me-1"></i>Danger Zone</h6>
                                    </div>
                                    <div className="card-body">
                                        <p className="text-muted font-size-13 mb-3">Permanently delete this record. This action cannot be undone.</p>
                                        <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => { if (window.confirm('Are you sure you want to delete this record?')) navigate('/custom-list'); }}>
                                            <i className="bx bx-trash me-1"></i>Delete Record
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Tabbed Form */}
                            <div className="col-xl-9">
                                <div className="card">
                                    <div className="card-header p-0 border-bottom-0">
                                        <ul className="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
                                            {tabList.map(tab => (
                                                <li key={tab.id} className="nav-item">
                                                    <button className={`nav-link py-3 ${activeTab === tab.id ? 'active' : ''}`} type="button" onClick={() => setActiveTab(tab.id)}>
                                                        <i className={`bx ${tab.icon} me-1 d-block d-sm-inline`}></i>
                                                        <span className="d-none d-sm-inline">{tab.label}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="card-body">

                                        {/* Basic Info */}
                                        {activeTab === 'basic' && (
                                            <div>
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label">First Name <span className="text-danger">*</span></label>
                                                        <input type="text" className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} name="firstName" value={form.firstName} onChange={handleChange} />
                                                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Last Name <span className="text-danger">*</span></label>
                                                        <input type="text" className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} name="lastName" value={form.lastName} onChange={handleChange} />
                                                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Email Address <span className="text-danger">*</span></label>
                                                        <div className="input-group">
                                                            <span className="input-group-text"><i className="bx bx-envelope"></i></span>
                                                            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={form.email} onChange={handleChange} />
                                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Phone Number</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text"><i className="bx bx-phone"></i></span>
                                                            <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Role <span className="text-danger">*</span></label>
                                                        <select className={`form-select ${errors.role ? 'is-invalid' : ''}`} name="role" value={form.role} onChange={handleChange}>
                                                            <option value="">Select a role...</option>
                                                            <option>Admin</option>
                                                            <option>Editor</option>
                                                            <option>Author</option>
                                                            <option>Subscriber</option>
                                                        </select>
                                                        {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Status</label>
                                                        <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                                                            <option>Active</option>
                                                            <option>Inactive</option>
                                                            <option>Pending</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-end mt-4">
                                                    <button type="button" className="btn btn-primary" onClick={() => setActiveTab('contact')}>
                                                        Next <i className="bx bx-chevron-right ms-1"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Contact & Location */}
                                        {activeTab === 'contact' && (
                                            <div>
                                                <div className="row g-3">
                                                    <div className="col-12">
                                                        <label className="form-label">Street Address</label>
                                                        <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label">City</label>
                                                        <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label">Country</label>
                                                        <select className="form-select" name="country" value={form.country} onChange={handleChange}>
                                                            <option value="">Select country...</option>
                                                            {['India', 'United States', 'United Kingdom', 'Australia', 'Canada', 'Germany', 'France', 'Japan', 'Singapore', 'UAE'].map(c => (
                                                                <option key={c}>{c}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label">ZIP / Postal Code</label>
                                                        <input type="text" className="form-control" name="zipCode" value={form.zipCode} onChange={handleChange} />
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between mt-4">
                                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveTab('basic')}><i className="bx bx-chevron-left me-1"></i> Previous</button>
                                                    <button type="button" className="btn btn-primary" onClick={() => setActiveTab('social')}>Next <i className="bx bx-chevron-right ms-1"></i></button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Social & Bio */}
                                        {activeTab === 'social' && (
                                            <div>
                                                <div className="row g-3">
                                                    <div className="col-12">
                                                        <label className="form-label">Bio</label>
                                                        <textarea className="form-control" name="bio" value={form.bio} onChange={handleChange} rows="4"></textarea>
                                                        <div className="text-end text-muted font-size-12 mt-1">{form.bio.length}/500</div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Website</label>
                                                        <div className="input-group"><span className="input-group-text"><i className="bx bx-globe"></i></span>
                                                            <input type="url" className="form-control" name="website" value={form.website} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Twitter</label>
                                                        <div className="input-group"><span className="input-group-text"><i className="bx bxl-twitter text-info"></i></span>
                                                            <input type="text" className="form-control" name="twitter" value={form.twitter} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">LinkedIn</label>
                                                        <div className="input-group"><span className="input-group-text"><i className="bx bxl-linkedin text-primary"></i></span>
                                                            <input type="text" className="form-control" name="linkedin" value={form.linkedin} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between mt-4">
                                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveTab('contact')}><i className="bx bx-chevron-left me-1"></i> Previous</button>
                                                    <button type="button" className="btn btn-primary" onClick={() => setActiveTab('settings')}>Next <i className="bx bx-chevron-right ms-1"></i></button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Settings */}
                                        {activeTab === 'settings' && (
                                            <div>
                                                <h6 className="mb-3 font-size-15 text-muted text-uppercase letter-spacing">Preferences</h6>
                                                <div className="row g-3">
                                                    {[
                                                        { name: 'notifications', label: 'Email Notifications', desc: 'Receive email updates about your account activity', icon: 'bx-bell' },
                                                        { name: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', icon: 'bx-shield-quarter' },
                                                        { name: 'newsletter', label: 'Newsletter Subscription', desc: 'Receive weekly newsletter and product updates', icon: 'bx-news' },
                                                    ].map(setting => (
                                                        <div className="col-12" key={setting.name}>
                                                            <div className={`p-3 rounded border ${form[setting.name] ? 'border-primary bg-primary-subtle' : ''}`}>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="flex-grow-1">
                                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                                            <i className={`bx ${setting.icon} font-size-18 text-primary`}></i>
                                                                            <h6 className="mb-0">{setting.label}</h6>
                                                                        </div>
                                                                        <p className="text-muted mb-0 font-size-13 ms-4">{setting.desc}</p>
                                                                    </div>
                                                                    <div className="form-check form-switch ms-3">
                                                                        <input className="form-check-input" type="checkbox" role="switch" name={setting.name} checked={form[setting.name]} onChange={handleChange} style={{ width: '2.5rem', height: '1.3rem' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="d-flex justify-content-between mt-4">
                                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveTab('social')}><i className="bx bx-chevron-left me-1"></i> Previous</button>
                                                    <button type="submit" className="btn btn-success px-4" disabled={submitting}>
                                                        {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bx bx-check me-1"></i>Update Record</>}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Discard Changes Modal */}
            {showDiscard && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <button type="button" className="btn-close" onClick={() => setShowDiscard(false)}></button>
                            </div>
                            <div className="modal-body text-center pb-0">
                                <div className="avatar-md mx-auto mb-4">
                                    <div className="avatar-title bg-warning-subtle text-warning rounded-circle font-size-28">
                                        <i className="bx bx-error-circle"></i>
                                    </div>
                                </div>
                                <h5>Discard Changes?</h5>
                                <p className="text-muted mb-0">Any unsaved changes will be lost. Are you sure you want to go back?</p>
                            </div>
                            <div className="modal-footer border-0 justify-content-center gap-2">
                                <button className="btn btn-secondary px-4" onClick={() => setShowDiscard(false)}>Keep Editing</button>
                                <button className="btn btn-warning px-4" onClick={() => navigate('/custom-list')}>Discard & Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default CustomEdit;
