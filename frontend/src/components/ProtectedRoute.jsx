import React from "react";

import {
  Navigate,
} from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // ❌ NO LOGIN
  if (!user) {

    return (
      <Navigate to="/auth-login" />
    );
  }

  // ❌ ROLE BLOCKED
  if (
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <Navigate to="/" />
    );
  }

  // ✅ ACCESS
  return children;
};

export default ProtectedRoute;