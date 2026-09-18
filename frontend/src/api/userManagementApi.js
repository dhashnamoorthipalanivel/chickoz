import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchUsers = async (franchiseId = '', search = '', page = 1) => {
  const res = await axios.get(`${API_URL}/user-management/users?franchiseId=${franchiseId}&search=${search}&page=${page}`, getHeaders());
  return res.data;
};

export const createUser = async (data) => {
  const res = await axios.post(`${API_URL}/user-management/users`, data, getHeaders());
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`${API_URL}/user-management/users/${id}`, data, getHeaders());
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_URL}/user-management/users/${id}`, getHeaders());
  return res.data;
};

export const fetchRoles = async (franchiseId = '') => {
  const res = await axios.get(`${API_URL}/user-management/roles?franchiseId=${franchiseId}`, getHeaders());
  return res.data;
};

export const fetchRoleById = async (id) => {
  const res = await axios.get(`${API_URL}/user-management/roles/${id}`, getHeaders());
  return res.data;
};

export const createRole = async (data) => {
  const res = await axios.post(`${API_URL}/user-management/roles`, data, getHeaders());
  return res.data;
};

export const updateRole = async (id, data) => {
  const res = await axios.put(`${API_URL}/user-management/roles/${id}`, data, getHeaders());
  return res.data;
};

export const deleteRole = async (id) => {
  const res = await axios.delete(`${API_URL}/user-management/roles/${id}`, getHeaders());
  return res.data;
};

export const fetchRoleAssignments = async (franchiseId = '') => {
  const res = await axios.get(`${API_URL}/user-management/role-assignments?franchiseId=${franchiseId}`, getHeaders());
  return res.data;
};

export const createRoleAssignment = async (data) => {
  const res = await axios.post(`${API_URL}/user-management/role-assignments`, data, getHeaders());
  return res.data;
};

export const deleteRoleAssignment = async (id) => {
  const res = await axios.delete(`${API_URL}/user-management/role-assignments/${id}`, getHeaders());
  return res.data;
};
