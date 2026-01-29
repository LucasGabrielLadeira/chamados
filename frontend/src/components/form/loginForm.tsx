import React, { useState } from "react";
import "./loginForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import {
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Snackbar,
  Slide,
} from "@mui/material";

interface LoginFormProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  credentials: { matricula: string; senha: string };
  validated: boolean;
  setValidated: (validated: boolean) => void;
}

export default function LoginForm({
  validated,
  credentials,
  setValidated,
  handleChange,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleError = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidated(true);

    if (!credentials.matricula || !credentials.senha) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          usuario: credentials.matricula,
          password: credentials.senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login bem-sucedido:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.nome);
        localStorage.setItem("centro_custo", data.centroDeCusto);
        localStorage.setItem("matricula", credentials.matricula);
        localStorage.setItem("nivel_acesso", data.chamado);
        window.location.href = "../Chamados/Dashboard";
      } else {
        console.error("Erro no login:", data.message || data);
        handleError(data.message || "Erro ao realizar login.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      handleError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      className="login-form"
      onSubmit={handleSubmit}
    >
      <div className="fields-container">
        <TextField
          name="matricula"
          placeholder="Matrícula"
          value={credentials.matricula}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          error={validated && !credentials.matricula}
          helperText={
            validated && !credentials.matricula
              ? "Informe a sua matrícula."
              : ""
          }
          className="field-matricula"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faUser} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          type={showPassword ? "text" : "password"}
          name="senha"
          placeholder="Senha"
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          error={validated && !credentials.senha}
          helperText={
            validated && !credentials.senha ? "Informe a sua senha." : ""
          }
          className="field-senha"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faLock} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <a href="#" className="forgotPassword">
          <p>Esqueceu sua senha?</p>
        </a>
      </div>

      <div className="buttons-container">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
        >
          Entrar
        </Button>
        <span style={{ marginTop: 30 }}>
          Não tem uma conta?{" "}
          <span style={{ color: "#2C8AED" }}>Cadastre-se</span>
        </span>
        {/*         <Button
          variant="contained"
          fullWidth
          type="button"
          sx={{
            mt: 2,
            backgroundColor: "#f5f5f5",
            color: "#1976d2",
            border: "1px solid #1976d2",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Cadastre-se
        </Button> */}
      </div>

      <Snackbar
        open={snackbarOpen}
        onClose={handleClose}
        message={snackbarMessage}
        autoHideDuration={3000}
        TransitionComponent={Slide}
      />
    </Box>
  );
}
