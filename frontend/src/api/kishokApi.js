import api from "./apiClient";

// ✅ GET ALL
export const getKishoks = () => api.get("/kishok");

// ✅ GET SINGLE
export const getKishokById = (id) => api.get(`/kishok/${id}`);

// ✅ UPDATE
export const updateKishok = (id, data) => api.put(`/kishok/${id}`, data);
