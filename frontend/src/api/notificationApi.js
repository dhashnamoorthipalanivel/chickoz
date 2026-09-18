import api from "./apiClient";

const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const getNotificationsApi  = ()       => api.get("/notifications", auth());
export const sendNotificationApi = (data)   => api.post("/notifications/send", data, auth());
export const markAsReadApi         = (id)     => api.patch(`/notifications/${id}/read`, {}, auth());
export const markAllAsReadApi      = ()       => api.patch("/notifications/mark-all-read", {}, auth());
