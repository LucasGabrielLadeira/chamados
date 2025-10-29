import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return isAuthenticated ? children : <Navigate to="./auth/" />;
}

export default ProtectedRoute;