import api from "./apiClient";

const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const getAdminDashboardApi     = ()    => api.get("/dashboard/admin",              auth());
export const getFranchiseDashboardApi = (fid) => api.get(`/dashboard/franchise${fid ? `?franchiseId=${fid}` : ""}`, auth());
export const getDashboardFranchisesApi = ()   => api.get("/dashboard/franchises-list",    auth());
