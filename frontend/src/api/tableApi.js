import apiClient from "./apiClient";

export const getTables = async (franchiseId) => {
  const query = franchiseId ? `?franchiseId=${franchiseId}` : "";
  const response = await apiClient.get(`/tables${query}`);
  return response.data;
};

export const createTable = async (data) => {
  const response = await apiClient.post("/tables", data);
  return response.data;
};

export const updateTable = async (id, data) => {
  const response = await apiClient.put(`/tables/${id}`, data);
  return response.data;
};

export const deleteTable = async (id) => {
  const response = await apiClient.delete(`/tables/${id}`);
  return response.data;
};
