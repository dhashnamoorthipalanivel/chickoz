// import axios from "axios";
import api from './apiClient'

// Login user
export const loginUser = async (data) => {
    const res =  await api.post(`/auth/login`,data);
    return res.data
}

//  Logout user
export const logoutUser = async (token) => {
    
  const response = await api.post(
    `/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};