import api from "./apiClient";

export const getMaterials    = ()         => api.get("/materials");
export const getMaterialById = (id)       => api.get(`/materials/${id}`);
export const createMaterial  = (data)     => api.post("/materials", data);
export const updateMaterial  = (id, data) => api.put(`/materials/${id}`, data);
export const deleteMaterial  = (id)       => api.delete(`/materials/${id}`);
