import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { PresentationProvider } from "./context/PresentationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PresentationProvider>
      <App />
    </PresentationProvider>
  </BrowserRouter>
);
