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
  Divider,
  Grid,
} from "@mui/material";
import CustomSnackbar from "../../../components/SnackBar/SnackBar";
import FileUploadBox from "../../../components/FileUploadBox/FileUploadBox";
import styles from "./NovoChamado.module.css";
import { useEffect, useState } from "react";
import api from "../../Auth/axios";
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
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [telefone, setTelefone] = useState(
    localStorage.getItem("telefone") || ""
  );
  const [listaCategoria, setListaCategoria] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/chamados/usuarios/telefoneemail`
      );
      const userData = response.data;
      setEmail(userData.email || "");
      setTelefone(userData.telefone || "");
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [categoriasRes] = await Promise.all([
          api.get(`${import.meta.env.VITE_API_URL}/chamados/categorias`),
        ]);

        setListaCategoria(categoriasRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados do chamado:", error);
      }
    };

    fetchDados();
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

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
    formData.append("email", localStorage.getItem("email") || "");
    formData.append("telefone", localStorage.getItem("telefone") || "");
    if (arquivo) formData.append("arquivo", arquivo);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/chamados`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSnackbarMessage("Chamado criado com sucesso!");
      setSnackbarOpen(true);
      const id = response.data.id;
      // Redirecionar após sucesso
      window.location.href = `/Chamados/Detalhes/${id}`;
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
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.secondary"
              gutterBottom
            >
              Informações do Usuário
            </Typography>
            <Divider />
          </Box>

          <Grid container spacing={2} marginTop={1}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth disabled>
                <FormLabel>Matrícula</FormLabel>
                <TextField
                  value={localStorage.getItem("matricula") || ""}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <FormControl fullWidth disabled>
                <FormLabel>Nome</FormLabel>
                <TextField
                  value={localStorage.getItem("name") || ""}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Email</FormLabel>
                <TextField
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Telefone</FormLabel>
                <TextField
                  onChange={(e) => setTelefone(e.target.value)}
                  value={telefone || ""}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className={styles["novo-chamado__form"]}
        >
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.secondary"
              gutterBottom
            >
              Detalhes do Chamado
            </Typography>
            <Divider />
          </Box>
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
            >
              <MenuItem value="">Selecione</MenuItem>

              {listaCategoria.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.descricao}
                </MenuItem>
              ))}
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
