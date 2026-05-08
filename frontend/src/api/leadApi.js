import api from "./apiClient";

// ✅ GET ALL LEADS
export const getLeads = () => api.get("/lead");

// ✅ GET SINGLE LEAD
export const getLeadById = (id) => api.get(`/lead/${id}`);

// ✅ UPDATE LEAD
export const updateLead = (id, data) => api.put(`/lead/${id}`, data);
