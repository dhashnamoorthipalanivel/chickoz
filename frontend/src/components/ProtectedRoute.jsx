import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 < Date.now() : false;
  } catch (e) {
    return true;
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // ❌ NO LOGIN OR EXPIRED SESSION
  if (!user || !token || isTokenExpired(token)) {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Session expired. Please log in again.");
    }
    return <Navigate to="/auth-login" replace />;
  }

  // ❌ ROLE BLOCKED
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ ACCESS
  return children;
};

export default ProtectedRoute;