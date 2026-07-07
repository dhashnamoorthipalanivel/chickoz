import React from "react";
import AdminDashboard     from "./AdminDashboard";
import FranchiseDashboard from "./FranchiseDashboard";

const Dashboard = () => {
  const user    = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = ["admin", "super_admin"].includes(user.role);
  // /dashboard → Admin Dashboard for admins, Franchise Dashboard for franchise users
  return isAdmin ? <AdminDashboard /> : <FranchiseDashboard />;
};

export default Dashboard;
