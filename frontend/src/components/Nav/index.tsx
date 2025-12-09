"use client";
import "./nav.css";
import React, { useState } from "react";
import NavOption from "../navOption/navOption";
import {
  faFileInvoiceDollar,
  faUser,
  faGear,
  faEnvelope,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Route, useNavigate } from "react-router-dom";
import {
  Paper,
  MenuList,
  MenuItem,
  Box,
  Button,
  Stack,
  ClickAwayListener,
  Typography,
  Divider,
} from "@mui/material";

type NavProps = {
  menuToggled: boolean;
  className?: string;
};

export default function Nav({ menuToggled, className = "" }: NavProps) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name");

  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  let displayName = "User";

  if (userName) {
    const parts = userName.trim().split(" ");
    const first = capitalize(parts[0]);
    const last = capitalize(parts[parts.length - 1]);
    displayName = `${first} ${last}`;
  }

  const rotas = [
    {
      Title: "Dashboard",
      Icon: faGauge,
      Route: "./Chamados/Dashboard",
    },
    {
      Title: "Chamados",
      Icon: faEnvelope,
      Route: "./Chamados/Listagem",
    },
    {
      Title: "Configurações",
      Icon: faGear,
      submenus: [
        {
          Title: "Status",
          Route: "./Chamados/Configuracoes/Status",
        },
        { Title: "Usuários do Suporte", Route: "./Chamados/Configuracoes/Usuarios" }
      ],
    },
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth"); //
  };

  const open = Boolean(anchorEl);

  return (
    <aside className={`menu-area ${menuToggled ? "toggled-menu" : ""}`}>
      <nav className={`menu-nav ${className}`}>
        {rotas.map((rota, index) => (
          <NavOption
            key={index}
            menuToggled={menuToggled}
            icon={rota.Icon}
            text={rota.Title}
            {...(rota.Route ? { route: rota.Route } : {})}
            {...(rota.submenus ? { submenus: rota.submenus } : {})}
          />
        ))}
      </nav>

      <Stack sx={{ position: "relative", marginTop: 2 }}>
        {open && (
          <ClickAwayListener onClickAway={handleClose}>
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                bottom: "100%",
                left: 0,
                mt: 1,
                width: "100%",
                minWidth: 200,
                zIndex: 1300,
              }}
            >
              <MenuList>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleLogout();
                  }}
                >
                  Sair
                </MenuItem>
                {menuToggled && (
                  <>
                    <Divider />
                    <Typography
                      sx={{
                        paddingLeft: 2,
                        paddingTop: 0.4,
                        paddingBottom: 0.4,
                      }}
                    >
                      {displayName}
                    </Typography>
                  </>
                )}
              </MenuList>
            </Paper>
          </ClickAwayListener>
        )}
        <Box className="ProfileButton">
          <Button
            onClick={handleClick}
            startIcon={<FontAwesomeIcon icon={faUser} />}
            sx={{
              textTransform: "none",
              color: "#000",
              justifyContent: menuToggled ? "center" : "flex-start",
            }}
          >
            {menuToggled ? " " : displayName}
          </Button>
        </Box>
      </Stack>
    </aside>
  );
}
