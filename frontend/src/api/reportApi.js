import api from "./apiClient";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
const qs   = (p) => { const s = new URLSearchParams(); Object.entries(p).forEach(([k,v]) => { if (v !== undefined && v !== null && v !== "") s.append(k, v); }); return s.toString() ? `?${s}` : ""; };

export const getEnquiryReportApi      = (p = {}) => api.get(`/reports/admin/enquiries${qs(p)}`,   auth());
export const getLeadReportApi         = (p = {}) => api.get(`/reports/admin/leads${qs(p)}`,        auth());
export const getFranchiseReportApi    = (p = {}) => api.get(`/reports/admin/franchises${qs(p)}`,   auth());
export const getMasalaReportApi       = (p = {}) => api.get(`/reports/admin/masala${qs(p)}`,        auth());

export const getOrderReportApi        = (p = {}) => api.get(`/reports/franchise/orders${qs(p)}`,   auth());
export const getSalesReportApi        = (p = {}) => api.get(`/reports/franchise/sales${qs(p)}`,    auth());
export const getFranchiseMasalaApi    = (p = {}) => api.get(`/reports/franchise/masala${qs(p)}`,   auth());
export const getItemReportApi         = (p = {}) => api.get(`/reports/franchise/items${qs(p)}`,    auth());
export const getReportFranchisesApi   = ()        => api.get("/reports/franchises-list",            auth());
