import api from "./apiClient";

export const getPaymentModes = () => api.get("/paymentModes");

export const getPaymentModeById = (id) => api.get(`/paymentModes/${id}`);

export const createPaymentMode = (data) => api.post("/paymentModes", data);

export const updatePaymentMode = (id, data) => api.put(`/paymentModes/${id}`, data);

export const deletePaymentMode = (id) => api.delete(`/paymentModes/${id}`);
