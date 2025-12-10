import React, { useState } from "react";
import Header from "../Header";
import Content from "../Content";
import Logo from "../Logo";
import Nav from "../Nav";
import { usePresentation } from "../../context/PresentationContext";
import "./layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuToggled, setMenuToggled] = useState(false);
  const { presentationMode } = usePresentation();

  return (
    <div className={`app ${presentationMode ? "presentation" : ""}`}>

      {/* TOPO (Logo + Header) */}
      {!presentationMode && (
        <div className={`top-grid ${menuToggled ? "menu-toggled" : ""}`}>
          <Logo menuToggled={menuToggled} />
          <Header setMenuToggled={setMenuToggled} />
        </div>
      )}

      {/* CORPO */}
      <div
        className={`main-grid 
          ${menuToggled ? "menu-toggled" : ""} 
          ${presentationMode ? "presentation-grid" : ""}
        `}
      >
        {!presentationMode && <Nav menuToggled={menuToggled} />}
        <Content>{children}</Content>
      </div>

    </div>
  );
}
