import api from "./apiClient";

export const getMasalaItems = () => api.get("/masalaItems");

export const getMasalaItemById = (id) => api.get(`/masalaItems/${id}`);

export const createMasalaItem = (data) => api.post("/masalaItems", data);

export const updateMasalaItem = (id, data) => api.put(`/masalaItems/${id}`, data);

export const deleteMasalaItem = (id) => api.delete(`/masalaItems/${id}`);
