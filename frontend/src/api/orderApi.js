import api from "./apiClient";

const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const getMyOrdersApi       = ()       => api.get("/orders/my",          auth());
export const getAllOrdersApi       = ()       => api.get("/orders",             auth());
export const getOrderByIdApi      = (id)     => api.get(`/orders/${id}`,       auth());
export const createOrderApi       = (data)   => api.post("/orders", data,      auth());
export const updateOrderStatusApi = (id, d)  => api.patch(`/orders/${id}/status`, d, auth());
