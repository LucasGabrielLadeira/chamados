import routes from "~react-pages";
import Layout from "./components/layout";
import ProtectedRoute from "./pages/Auth/ProtectedRoutes";
import { ModalProvider } from "./context/ModalContext";
import { Navigate, useLocation, useRoutes } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const element = useRoutes(routes);

  if (location.pathname === "/") {
    return <Navigate to="/Chamados/Listagem" replace />;
  }

  const isPublicRoute =
    location.pathname.startsWith("/auth") || location.pathname === "/login";

  const protectedElement = <ProtectedRoute>{element}</ProtectedRoute>;

  return isPublicRoute ? (
    element
  ) : (
    <ModalProvider>
      <Layout>{protectedElement}</Layout>
    </ModalProvider>
  );
}
