import { Navigate } from "react-router-dom";

function isTokenExpired(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch {
    return true;
  }
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
