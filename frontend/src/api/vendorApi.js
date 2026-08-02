import api from "./apiClient";

export const createVendor = (data) => {
  const token = localStorage.getItem("token");
  return api.post("/vendors/create", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllVendors = () => {
  const token = localStorage.getItem("token");
  return api.get("/vendors/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSingleVendor = (id) => {
  const token = localStorage.getItem("token");
  return api.get(`/vendors/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateVendor = (id, data) => {
  const token = localStorage.getItem("token");
  return api.put(`/vendors/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteVendor = (id) => {
  const token = localStorage.getItem("token");
  return api.delete(`/vendors/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
