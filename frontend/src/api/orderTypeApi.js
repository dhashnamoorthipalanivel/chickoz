import api from "./apiClient";

export const getOrderTypes = () => api.get("/orderTypes");

export const getOrderTypeById = (id) => api.get(`/orderTypes/${id}`);

export const createOrderType = (data) => api.post("/orderTypes", data);

export const updateOrderType = (id, data) => api.put(`/orderTypes/${id}`, data);

export const deleteOrderType = (id) => api.delete(`/orderTypes/${id}`);
