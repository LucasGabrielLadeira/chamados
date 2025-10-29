import { useRoutes, useLocation } from "react-router-dom";
import routes from "~react-pages";
import Layout from "./components/layout";
import ProtectedRoute from "./pages/Auth/ProtectedRoutes";
import { ModalProvider } from "./context/ModalContext";

export default function App() {
  const location = useLocation();
  const element = useRoutes(routes);

  const isPublicRoute = location.pathname.startsWith("/auth") || location.pathname === "/login";

  const protectedElement = (
    <ProtectedRoute >
      {element}
    </ProtectedRoute >
  );

  return isPublicRoute
    ? element
    : <ModalProvider><Layout>{protectedElement}</Layout></ModalProvider>;
}
