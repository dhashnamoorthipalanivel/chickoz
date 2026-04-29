import api from "./apiClient";

export const getPackages = () => api.get("/packages");

export const getPackageById = (id) => api.get(`/packages/${id}`);

export const createPackage = (data) => api.post("/packages", data);

export const updatePackage = (id, data) => api.put(`/packages/${id}`, data);

export const deletePackage = (id) => api.delete(`/packages/${id}`);
