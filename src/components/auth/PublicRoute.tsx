import { Navigate } from "react-router-dom";
import React from "react";

interface PublicRouteProps {
  children: React.ReactElement;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}
