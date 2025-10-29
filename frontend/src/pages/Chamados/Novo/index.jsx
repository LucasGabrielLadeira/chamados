import {
  Card,
  FormControl,
  FormLabel,
  TextareaAutosize,
  TextField,
  Typography,
  Box,
  Select,
  Button,
  MenuItem,
} from "@mui/material";
import CustomSnackbar from "../../../components/SnackBar/SnackBar";
import FileUploadBox from "../../../components/FileUploadBox/FileUploadBox";
import styles from "./NovoChamado.module.css";
import { use, useState } from "react";
import axios from "axios";
export default function NovoChamado() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoProblema, setTipoProblema] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [tituloError, setTituloError] = useState(false);
  const [descricaoError, setDescricaoError] = useState(false);
  const [tipoProblemaError, setTipoProblemaError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    // Reset erros
    setTituloError(false);
    setDescricaoError(false);
    setTipoProblemaError(false);

    if (!titulo) {
      setTituloError(true);
      hasError = true;
    }
    if (!descricao) {
      setDescricaoError(true);
      hasError = true;
    }
    if (!tipoProblema) {
      setTipoProblemaError(true);
      hasError = true;
    }

    if (hasError) {
      setSnackbarMessage("Por favor, preencha todos os campos obrigatórios.");
      setSnackbarOpen(true);
      return;
    }

    // Continuar com envio do form
    const matricula = localStorage.getItem("matricula");
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("tipo_problema", tipoProblema);
    formData.append("usuario_matricula", matricula);
    if (arquivo) formData.append("arquivo", arquivo);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chamados`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSnackbarMessage("Chamado criado com sucesso!");
      setSnackbarOpen(true);
      const id = response.data.id;
      // Redirecionar após sucesso
      window.location.href = `/Chamados/DetalhesChamados/${id}`;
    } catch (error) {
      console.error("Erro ao criar o chamado:", error);
      setSnackbarMessage(
        error.response?.data?.message || "Erro de conexão com o servidor."
      );
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Card className={styles["novo-chamado__card"]}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Abrir um Novo Chamado
        </Typography>

        <Typography className={styles["novo-chamado__subtitle"]}>
          Por favor, preencha o formulário abaixo para abrir um novo chamado
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className={styles["novo-chamado__form"]}
        >
          {/* Título */}
          <FormControl fullWidth margin="normal" error={tituloError}>
            <FormLabel>Título</FormLabel>
            <TextField
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título do chamado"
              fullWidth
              variant="outlined"
              autoFocus={tituloError} // foca automaticamente se tiver erro
            />
          </FormControl>

          <FormControl fullWidth margin="normal" error={descricaoError}>
            <FormLabel>Descrição</FormLabel>
            <TextareaAutosize
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              minRows={6}
              placeholder="Descreva o problema ou solicitação..."
              className={styles["novo-chamado__textarea"]}
              style={{ borderColor: descricaoError ? "red" : undefined }}
              autoFocus={descricaoError}
            />
          </FormControl>

          <FormControl
            fullWidth
            className={styles["novo-chamado__select-item"]}
            error={tipoProblemaError}
          >
            <FormLabel>Tipo do Problema</FormLabel>
            <Select
              value={tipoProblema}
              onChange={(e) => setTipoProblema(e.target.value)}
              displayEmpty
              autoFocus={tipoProblemaError}
            >
              <MenuItem value="">Selecione</MenuItem>
              <MenuItem value="Hardware">Hardware</MenuItem>
              <MenuItem value="Software">Software</MenuItem>
              <MenuItem value="Redes">Redes</MenuItem>
              <MenuItem value="Impressora">Impressora</MenuItem>
              <MenuItem value="Sistema">Sistema</MenuItem>
            </Select>
          </FormControl>

          {/* Upload de arquivo */}
          <FileUploadBox onFileSelect={setArquivo} />
        </Box>

        {/* Botão de envio */}
        <Box className={styles["novo-chamado__button-box"]}>
          <Button
            onClick={handleSubmit}
            className={styles["novo-chamado__button-enviar"]}
            type="submit"
            variant="contained"
            size="large"
          >
            Abrir Chamado
          </Button>
        </Box>
      </Card>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        vertical="top"
        horizontal="right"
      />
    </>
  );
}
