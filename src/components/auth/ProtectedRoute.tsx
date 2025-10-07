import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem("token")); // or your auth check

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  // If children are passed, render them; otherwise render nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
