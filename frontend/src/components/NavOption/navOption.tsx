import "./navOption.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { Divider, Paper, Tooltip } from "@mui/material";
import { useNavigate, useNavigation } from "react-router-dom";
type NavOptionProps = {
  icon: any;
  text: any;
  menuToggled: any;
  route: string;
  submenus?: Array<{
    Title: string;
    Route: string;
    Access_Level?: number;
  }>;
  access_level?: number;
};
export default function NavOption({
  icon,
  text,
  menuToggled,
  route,
  submenus,
  access_level
}: NavOptionProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const nivel_acesso = parseInt(localStorage.getItem("access_level") || "0");
  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [text]);

  if (access_level && nivel_acesso < access_level) {
    return null;
  }

  return (

    <div
      className="menu-option-container"
      onMouseEnter={() => {
        setOpen(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
      }}
    >
      <div
        onClick={() => navigate(route)}
        className={`menu-option ${menuToggled ? "toggled" : ""}`}
      >
        <FontAwesomeIcon className="menu-option-icon" icon={icon} />
        {/* Texto com tooltip se estiver truncado */}
        <Tooltip title={isTruncated ? text : ""} arrow placement="top">
          <p ref={textRef} className="menu-option-text">
            {text}
          </p>
        </Tooltip>
        {submenus && submenus.length > 0 && !menuToggled && (
          <FontAwesomeIcon icon={open ? faCaretDown : faCaretRight} />
        )}
      </div>
      {submenus && open && (
        <Paper
          className={`${menuToggled ? "submenu-container-toggled" : "submenu-container "
            }`}
          elevation={3}
        >
          {menuToggled && (
            <>
              <div className="submenu-title">
                <p>{text}</p>
              </div>
              <Divider />
            </>
          )}
          {submenus.map((submenu, index) => (
            submenu.Access_Level && nivel_acesso < submenu.Access_Level ? null : (
              <div
                key={index}
                className="submenu-item"
                onClick={() => {
                  navigate(submenu.Route);
                  setOpen(false);
                }}
              >
                {submenu.Title}
              </div>
            )
          ))}
        </Paper>
      )}
    </div>
  );
}
