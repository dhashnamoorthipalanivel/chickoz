import axios from "axios";
import { isTokenExpired, handleAutoLogout } from "../utils/sessionManager";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach Bearer token to every request & validate session expiry
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (isTokenExpired(token)) {
      handleAutoLogout();
      return Promise.reject(new Error("Session expired"));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 Unauthorized responses from backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      handleAutoLogout();
    }
    return Promise.reject(error);
  }
);

export default api;
