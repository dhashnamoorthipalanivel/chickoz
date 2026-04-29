import api from "./apiClient";

export const getLeadSources = () => api.get("/leadSources");

export const getLeadSourceById = (id) => api.get(`/leadSources/${id}`);

export const createLeadSource = (data) => api.post("/leadSources", data);

export const updateLeadSource = (id, data) => api.put(`/leadSources/${id}`, data);

export const deleteLeadSource = (id) => api.delete(`/leadSources/${id}`);
