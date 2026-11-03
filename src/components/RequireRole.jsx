import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store";

const RequireRole = ({ roles = ["admin"], redirectTo = "/home", children }) => {
  const { user } = useAuthStore();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to={redirectTo} replace={true} />;
  }

  return children ? children : <Outlet />;
};

export default RequireRole;

