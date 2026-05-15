import api from "./apiClient";

// GET ALL
export const getFranchises = () => api.get("/franchises");

// GET SINGLE
export const getFranchiseById = (id) => api.get(`/franchises/${id}`);

// UPDATE
export const updateFranchise = (id, data) => api.put(`/franchises/${id}`, data);

export const sendFranchiseInvitation = (id) => api.post(`/franchises/send-invitation/${id}`);
