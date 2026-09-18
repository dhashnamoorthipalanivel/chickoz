import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as Feather from "react-feather";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const LeadDetailHub = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  const fetchLeadData = async () => {
    try {
      // In a real app, we would have a specific endpoint for Lead details or use the existing one
      // Since we don't have a specific getLeadById yet that aggregates everything, we'll fetch pipeline and find it
      // or we can fetch activities
      const actRes = await axios.get(`${API_URL}/crm/activities/${id}`, getHeaders());
      setActivities(actRes.data.activities || []);
      
      // To get lead info, we could fetch from /leads endpoint if it exists
      const leadRes = await axios.get(`${API_URL}/leads/${id}`, getHeaders());
      setLead(leadRes.data.lead || leadRes.data);
      
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load lead details");
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/crm/activities`, {
        leadId: id,
        activityType: "NOTE",
        notes: noteText
      }, getHeaders());
      setActivities([res.data, ...activities]);
      setNoteText("");
      toast.success("Note added successfully");
    } catch (err) {
      toast.error("Failed to add note");
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (!lead) return <div className="text-center py-5">Lead not found</div>;

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center page-title-box">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)", boxShadow: "0 4px 14px rgba(37,99,235,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Feather.User size={22} color="#fff" />
              </div>
              <div>
                <h4 className="mb-0" style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>{lead.name}</h4>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 1 }}>Lead Detail Hub</div>
              </div>
            </div>
            <Link to="/crm/kanban" className="btn btn-light shadow-sm">
              <Feather.ArrowLeft size={16} className="me-1" /> Back to Pipeline
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Lead Information</h5>
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Email</small>
                  <div className="fw-medium">{lead.email || "N/A"}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Phone</small>
                  <div className="fw-medium">{lead.phone || "N/A"}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Stage</small>
                  <span className="badge bg-primary">{lead.pipelineStage || "LEAD"}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Source</small>
                  <div className="fw-medium">{lead.leadSource?.sourceName || "Manual"}</div>
                </div>
                <div>
                  <small className="text-muted d-block mb-1">Created At</small>
                  <div className="fw-medium">{new Date(lead.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Activity Timeline</h5>
                
                <div className="mb-4">
                  <div className="input-group shadow-sm">
                    <input 
                      type="text" 
                      className="form-control border-0 bg-light" 
                      placeholder="Add a note or log an activity..." 
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <button className="btn btn-primary px-4" onClick={addNote}>Post Note</button>
                  </div>
                </div>

                <div className="timeline">
                  {activities.length === 0 ? (
                    <p className="text-muted text-center py-4">No activities logged yet.</p>
                  ) : (
                    activities.map(act => (
                      <div className="d-flex mb-4" key={act._id}>
                        <div className="me-3">
                          <div className="bg-soft-primary text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                            {act.activityType === "NOTE" ? <Feather.Edit2 size={18} /> : 
                             act.activityType === "CALL" ? <Feather.PhoneCall size={18} /> :
                             act.activityType === "EMAIL" ? <Feather.Mail size={18} /> : <Feather.Activity size={18} />}
                          </div>
                        </div>
                        <div className="flex-grow-1 pb-3 border-bottom">
                          <div className="d-flex justify-content-between">
                            <h6 className="mb-1 fw-bold">{act.activityType} logged</h6>
                            <small className="text-muted">{new Date(act.createdAt).toLocaleString()}</small>
                          </div>
                          <p className="mb-0 text-muted">{act.notes}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailHub;
