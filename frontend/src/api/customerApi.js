import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/customers",
});

// CREATE CUSTOMER
export const createCustomerApi = async (payload) => {
  const response = await API.post("/create", payload);

  return response.data;
};

// GET CUSTOMER BY MOBILE
export const getCustomerByMobileApi = async (mobile, franchiseId) => {
  const response = await API.get(`/mobile/${mobile}/${franchiseId}`);

  return response.data;
};

export const getFranchiseCustomersApi = async (franchiseId) => {
  const response = await API.get(`/franchise/${franchiseId}`);

  return response.data;
};
