import api from "./apiClient";

export const getTaxes = () => api.get("/taxes");

export const getTaxById = (id) => api.get(`/taxes/${id}`);

export const createTax = (data) => api.post("/taxes", data);

export const updateTax = (id, data) => api.put(`/taxes/${id}`, data);

export const deleteTax = (id) => api.delete(`/taxes/${id}`);
