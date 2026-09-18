import api from "./apiClient";

export const getIntegrations = () => api.get("/integrations");
export const configureIntegration = (data) => api.post("/integrations/configure", data);
