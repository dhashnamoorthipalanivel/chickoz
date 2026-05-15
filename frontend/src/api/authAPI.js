// import axios from "axios";
import api from "./apiClient";

// Login user
export const loginUser = async (data) => {
  const res = await api.post(`/auth/login`, data);
  return res.data;
};

//  Logout user
export const logoutUser = async (token) => {
  const response = await api.post(
    `/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const getMe = async () => {
  const token = localStorage.getItem("token");

  return api.get(
    "/auth/me",

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// SEND CHANGE PASSWORD OTP
export const sendChangePasswordOtpApi = async (data) => {

    const token = localStorage.getItem("token");

    const res = await api.post("/auth/send-change-password-otp",
        data,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;
  };

export const verifyChangePasswordOtpApi = async (data) => {

    const token = localStorage.getItem("token");

    const res = await api.post(
        "/auth/verify-change-password-otp",
        data,

        {
          headers: {
            Authorization:`Bearer ${token}`,
          },
        }
      );

    return res.data;
  };