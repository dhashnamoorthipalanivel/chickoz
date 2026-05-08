import api from "./apiClient";

// GET ALL
export const getEnquiries = () => api.get("/enquiry");

// GET ONE
export const getEnquiryById = (id) => api.get(`/enquiry/${id}`);

// CREATE
export const createEnquiry = (data) => api.post("/enquiry", data);

// UPDATE
export const updateEnquiry = (id, data) => api.put(`/enquiry/${id}`, data);

// DELETE
export const deleteEnquiry = (id) => api.delete(`/enquiry/${id}`);

// 🔥 CONVERT TO LEAD
export const convertToLead = (id) => api.post(`/enquiry/convert/${id}`);

export const getNextReferenceId = () => api.get("/enquiry/next-id");