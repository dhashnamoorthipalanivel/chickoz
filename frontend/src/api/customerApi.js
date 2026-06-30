import api from "./apiClient";

// CREATE CUSTOMER
export const createCustomerApi = async (payload) => {
  const response = await api.post("/customers/create", payload);
  return response.data;
};

// GET CUSTOMER BY MOBILE
export const getCustomerByMobileApi = async (mobile, franchiseId) => {
  const response = await api.get(`/customers/mobile/${mobile}/${franchiseId}`);
  return response.data;
};

export const getFranchiseCustomersApi = async (franchiseId) => {
  const response = await api.get(`/customers/franchise/${franchiseId}`);
  return response.data;
};
