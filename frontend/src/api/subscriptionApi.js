import api from "./apiClient";

export const getSubscriptions          = ()                     => api.get("/subscriptions");
export const getMySubscription         = ()                     => api.get("/subscriptions/my");
export const getSubscriptionByFranchise = (franchiseId)         => api.get(`/subscriptions/${franchiseId}`);
export const enableSubscription        = (franchiseId, data)    => api.post(`/subscriptions/${franchiseId}/enable`, data);
export const extendSubscription        = (franchiseId, data)    => api.put(`/subscriptions/${franchiseId}/extend`, data);
export const suspendSubscription       = (franchiseId)          => api.put(`/subscriptions/${franchiseId}/suspend`);
