import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
