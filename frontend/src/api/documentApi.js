import api from "./apiClient";

export const getDocuments = () => api.get("/documents");

export const getDocumentById = (id) => api.get(`/documents/${id}`);

export const createDocument = (data) => api.post("/documents", data);

export const updateDocument = (id, data) => api.put(`/documents/${id}`, data);

export const deleteDocument = (id) => api.delete(`/documents/${id}`);
