import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Parses JWT token safely (supports base64url padding)
 */
export const parseJwt = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    let base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    try {
      let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      return JSON.parse(atob(base64));
    } catch (_) {
      return null;
    }
  }
};

/**
 * Checks whether the JWT session token is expired
 */
export const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 <= Date.now();
};

/**
 * Gets remaining time in milliseconds until token expires
 */
export const getRemainingSessionTime = (token) => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now());
};

/**
 * Performs immediate logout and cleanup for expired sessions
 */
export const handleAutoLogout = (navigate, message = "Session expired. Please log in again.") => {
  const token = localStorage.getItem("token");
  if (token || localStorage.getItem("user")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.error(message);
  }
  if (navigate) {
    navigate("/auth-login", { replace: true });
  } else if (window.location.pathname !== "/auth-login") {
    window.location.href = "/auth-login";
  }
};

/**
 * Custom React Hook: Automatically logs out the user the exact moment their login session expires
 */
export const useAutoLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || location.pathname === "/auth-login") return;

    if (isTokenExpired(token)) {
      handleAutoLogout(navigate);
      return;
    }

    const remainingMs = getRemainingSessionTime(token);
    let timerId = null;

    if (remainingMs > 0) {
      timerId = setTimeout(() => {
        handleAutoLogout(navigate);
      }, remainingMs);
    }

    const intervalId = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (!currentToken || isTokenExpired(currentToken)) {
        handleAutoLogout(navigate);
      }
    }, 5000);

    return () => {
      if (timerId) clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [location.pathname, navigate]);
};
