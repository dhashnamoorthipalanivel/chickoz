import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as Feather from "react-feather";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const SocialLeadsList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Form State
  const [packages, setPackages] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [formData, setFormData] = useState({
    place: "",
    interestedPackage: "",
    state: "",
    address: "",
    postCode: ""
  });
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchDropdownData();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_URL}/raw-leads/pending`, getHeaders());
      setLeads(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load social leads");
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const pkgRes = await axios.get(`${API_URL}/packages`, getHeaders());
      setPackages(pkgRes.data.data || pkgRes.data || []);
    } catch (err) {
      console.error("Failed to load dropdowns");
    }
  };

  const openConvertModal = (lead) => {
    setSelectedLead(lead);
    setFormData({ place: "", interestedPackage: "", state: "", address: "", postCode: "" });
    setShowModal(true);
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!formData.place || !formData.interestedPackage) {
      return toast.error("Please fill in all required fields");
    }
    
    setConverting(true);
    try {
      const res = await axios.post(`${API_URL}/raw-leads/${selectedLead._id}/convert`, formData, getHeaders());
      toast.success("Successfully converted to Enquiry!");
      setShowModal(false);
      setLeads(leads.filter(l => l._id !== selectedLead._id));
      
      // Optionally navigate to the new enquiry or let them stay
      // navigate(`/crm-enquiry`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to convert lead");
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center page-title-box">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)", boxShadow: "0 4px 14px rgba(37,99,235,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Feather.Inbox size={22} color="#fff" />
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>Social Leads</h4>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 1 }}>Pending Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Lead Info</th>
                        <th>Contact</th>
                        <th>Platform / Campaign</th>
                        <th>Received On</th>
                        <th className="text-end pe-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            <Feather.CheckCircle size={40} className="mb-3 text-success opacity-50" /><br/>
                            No pending social leads to review. You're all caught up!
                          </td>
                        </tr>
                      ) : (
                        leads.map((lead) => (
                          <tr key={lead._id}>
                            <td className="ps-4">
                              <h6 className="mb-0 fw-bold">{lead.name}</h6>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <Feather.Phone size={14} className="text-muted" /> {lead.phone}
                              </div>
                              {lead.email && (
                                <div className="d-flex align-items-center gap-2 mt-1">
                                  <Feather.Mail size={14} className="text-muted" /> <small>{lead.email}</small>
                                </div>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${lead.platform === 'FACEBOOK' ? 'bg-primary' : lead.platform === 'GOOGLE' ? 'bg-warning' : 'bg-secondary'}`}>
                                {lead.platform}
                              </span>
                              {lead.campaignName && <div className="small text-muted mt-1">{lead.campaignName}</div>}
                            </td>
                            <td>
                              <small className="text-muted">{new Date(lead.createdAt).toLocaleString()}</small>
                            </td>
                            <td className="text-end pe-4">
                              <button onClick={() => openConvertModal(lead)} className="btn btn-sm btn-success d-inline-flex align-items-center gap-1 shadow-sm">
                                <Feather.ArrowRight size={14} /> Convert to Enquiry
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Convert Modal */}
        {showModal && (
          <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <form onSubmit={handleConvert}>
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold">Convert to Enquiry</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p className="text-muted mb-4">Please provide the missing details to officially convert <strong>{selectedLead?.name}</strong> into an Enquiry.</p>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-dark">Place / City <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" required value={formData.place} onChange={e => setFormData({...formData, place: e.target.value})} placeholder="e.g. Chennai" />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium text-dark">Interested Package <span className="text-danger">*</span></label>
                      <select className="form-select" required value={formData.interestedPackage} onChange={e => setFormData({...formData, interestedPackage: e.target.value})}>
                        <option value="">Select Package</option>
                        {packages.map(pkg => (
                          <option key={pkg._id} value={pkg._id}>{pkg.packageName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label fw-medium text-muted">State <small>(Optional)</small></label>
                        <input type="text" className="form-control" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label fw-medium text-muted">Pincode <small>(Optional)</small></label>
                        <input type="text" className="form-control" value={formData.postCode} onChange={e => setFormData({...formData, postCode: e.target.value})} />
                      </div>
                    </div>

                  </div>
                  <div className="modal-footer border-0 pt-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)} disabled={converting}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={converting}>
                      {converting ? "Converting..." : "Confirm & Convert"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SocialLeadsList;
