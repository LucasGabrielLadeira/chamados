import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  FormControl,
  FormLabel,
  Select,
  CircularProgress,
  MenuItem,
  TextareaAutosize,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faPlus,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import api from "../../Auth/axios";
import styles from "./DetalhesChamados.module.css";
export default function DetalhesChamados() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chamado, setChamado] = useState(null);
  const [statusAtual, setStatusAtual] = useState("");
  const [prioridadeAtual, setPrioridadeAtual] = useState("");
  const [tecnicoAtual, setTecnicoAtual] = useState("");
  const [categoriaAtual, setCategoriaAtual] = useState("");
  const [listaStatus, setListaStatus] = useState([]);
  const [listaPrioridade, setListaPrioridade] = useState([]);
  const [listaTecnico, setListaTecnico] = useState([]);
  const [listaCategoria, setListaCategoria] = useState([]);
  const [nota, setNota] = useState("");
  const [visivelCliente, setVisivelCliente] = useState(false);

  const fetchChamado = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/chamados/${id}`
      );
      console.log(response.data);
      setChamado(response.data);

      setStatusAtual(response.data.status.id ?? "");
      setPrioridadeAtual(response.data.prioridade.id ?? "");
      setTecnicoAtual(response.data.tecnico_atribuido?.matricula ?? "");
      setCategoriaAtual(response.data.tipo_problema?.id ?? "");
    } catch (error) {
      console.error("Erro ao buscar chamado:", error);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/chamados/status`
        );
        setListaStatus(response.data);
      } catch (error) {
        console.error("Erro ao buscar status:", error);
      }
    };

    const fetchPrioridade = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/chamados/prioridades`
        );
        setListaPrioridade(response.data);
      } catch (error) {
        console.error("Erro ao buscar prioridades:", error);
      }
    };

    const fetchTecnico = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/chamados/tecnicos/disponiveis`
        );
        setListaTecnico(response.data);
      } catch (error) {
        console.error("Erro ao buscar técnicos:", error);
      }
    };
    const fetchCategoria = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/chamados/categorias`
        );
        setListaCategoria(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchStatus();
    fetchPrioridade();
    fetchTecnico();
    fetchCategoria();
  }, []);

  useEffect(() => {
    fetchChamado();
  }, [id]);

  const salvar = async () => {
    // Lógica para salvar as alterações do chamado
    await api.patch(`${import.meta.env.VITE_API_URL}/chamados/${id}`, {
      status_id: statusAtual,
      prioridade_id: prioridadeAtual,
      tecnico_matricula: tecnicoAtual || null,
      tipo_problema: categoriaAtual || null,
    });
    fetchChamado();
  };

  const addNote = async () => {
    // Lógica para salvar as alterações do chamado
    if (nota.trim() != " ") {
      await api.post(`${import.meta.env.VITE_API_URL}/chamados/${id}/notas`, {
        descricao: nota,
        visivel_cliente: visivelCliente,
      });
      fetchChamado();
    }
  };

  const finalizar = async () => {
    // Lógica para salvar as alterações do chamado
    await api.patch(`${import.meta.env.VITE_API_URL}/chamados/${id}`, {
      status_id: 3,
    });
    fetchChamado();
  };

  if (!chamado) {
    return (
      <Box className={styles["detalhes__loading"]}>
        <CircularProgress />
      </Box>
    );
  }
  function getTextColor(bgColor) {
    // Remove o "#" se tiver
    const color = bgColor.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Calcula a luminância percebida
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.7 ? "#000" : "#fff"; // claro -> preto, escuro -> branco
  }

  return (
    <Box className={styles["detalhes"]}>
      <Box className={styles["detalhes__main"]}>
        <Box className={styles["detalhes__breadcrumb"]}>
          <Box className={styles["detalhes__breadcrumb-gray"]}>
            <Typography
              className={styles["detalhes__breadcrumb-link"]}
              onClick={() => navigate("/Chamados/Listagem")}
            >
              Chamados
            </Typography>
            <FontAwesomeIcon icon={faChevronRight} fontSize={12} />
          </Box>
          <Typography color="#000">Chamado #{id}</Typography>
        </Box>

        <Card className={styles["detalhes__header"]}>
          <Box className={styles["detalhes__header-info"]}>
            <Typography variant="h6" fontWeight={"Bold"}>
              Chamado #{id}: {chamado.titulo}
            </Typography>
            <Box className={styles["detalhes__header-meta"]}>
              <Typography
                bgcolor={chamado.status.cor}
                color={getTextColor(chamado.status.cor)}
                px={1}
                borderRadius={1}
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
              >
                {chamado.status.descricao}
              </Typography>

              {chamado.prioridade.descricao != "-" && (
                <Typography
                  bgcolor={chamado.prioridade.cor}
                  color={getTextColor(chamado.prioridade.cor)}
                  px={1}
                  borderRadius={1}
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                >
                  Prioridade - {chamado.prioridade.descricao}
                </Typography>
              )}
            </Box>
          </Box>
          <Typography className={styles["detalhes__header-info__subtitle"]}>
            Aberto por{" "}
            {(() => {
              const nome = chamado.requisitante?.nome?.trim() || "";
              const partes = nome.split(" ").filter(Boolean);
              if (partes.length === 0) return "";
              const primeiro = partes[0];
              const ultimo = partes.length > 1 ? partes[partes.length - 1] : "";
              const formatar = (n) =>
                n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
              return `${formatar(primeiro)}${
                ultimo ? " " + formatar(ultimo) : ""
              }`;
            })()}{" "}
            em{" "}
            {new Date(chamado.data_abertura).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Card>

        <Card className={styles["detalhes__card"]}>
          <Typography className={styles["detalhes__title"]}>
            Detalhes do Chamado
          </Typography>
          <Box className={styles["detalhes__info"]}>
            <Box className={styles["detalhes__info-column"]}>
              <Box>
                <Typography className={styles["detalhes__info-title"]}>
                  Usuário
                </Typography>
                <Typography className={styles["detalhes__info-text"]}>
                  {chamado.requisitante?.nome} (
                  {chamado.requisitante?.matricula})
                </Typography>
              </Box>
              <Box>
                <Typography className={styles["detalhes__info-title"]}>
                  Data de Abertura
                </Typography>
                <Typography className={styles["detalhes__info-text"]}>
                  {new Date(chamado.data_abertura).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>
            <Box className={styles["detalhes__info-column"]}>
              <Box>
                <Typography className={styles["detalhes__info-title"]}>
                  Centro de Custo
                </Typography>
                <Typography className={styles["detalhes__info-text"]}>
                  {chamado.requisitante?.centro_custo}
                </Typography>
              </Box>
              <Box>
                <Typography className={styles["detalhes__info-title"]}>
                  Tipo de Problema
                </Typography>
                <Typography className={styles["detalhes__info-text"]}>
                  {chamado.tipo_problema.descricao || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            className={styles["detalhes__descricao"]}
            display={"flex"}
            flexDirection="column"
            gap={2}
            width={"100%"}
          >
            <Box>
              <Typography className={styles["detalhes__info-title-bold"]}>
                Descrição
              </Typography>
              <Typography>{chamado.descricao}</Typography>
            </Box>
            {chamado.anexo && (
              <Box width={"100%"}>
                <Typography className={styles["detalhes__info-title-bold"]}>
                  Anexo
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  target="_blank"
                  href={chamado.anexo ?? null}
                  disabled={!chamado.anexo}
                >
                  {(
                    <Box display="flex" alignItems="center" gap={1}>
                      <FontAwesomeIcon icon={faPaperclip} />
                      <p>Visualizar Anexo</p>
                    </Box>
                  ) ?? "Nenhum anexo"}
                </Button>
              </Box>
            )}
          </Box>
        </Card>

        <Card className={styles["detalhes__card"]}>
          <Typography className={styles["detalhes__title"]}>
            Notas e Atividades
          </Typography>
          <Box className={styles["detalhes__notas"]}>
            {chamado.notas && chamado.notas.length > 0 ? (
              chamado.notas.map((nota) => (
                <Card key={nota.id} className={styles["detalhes__nota"]}>
                  <Typography>
                    {new Date(nota.data_criacao).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    - {nota.usuario_matricula}
                  </Typography>
                  <Typography>{nota.conteudo}</Typography>
                </Card>
              ))
            ) : (
              <Typography>Nenhuma nota ou atividade.</Typography>
            )}
          </Box>
        </Card>
      </Box>

      <Box className={styles["detalhes__sidebar"]}>
        <Card className={styles["detalhes__acoes"]}>
          <Typography className={styles["detalhes__acoes-title"]} variant="h6">
            Ações
          </Typography>
          <FormControl fullWidth margin="normal" size="small">
            <FormLabel>Alterar Categoria</FormLabel>
            <Select
              value={categoriaAtual}
              onChange={(e) => setCategoriaAtual(e.target.value)}
              disabled={statusAtual === 3}
            >
              {listaCategoria.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.descricao}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" size="small">
            <FormLabel>Técnico Atribuído</FormLabel>
            <Select
              value={String(tecnicoAtual)}
              onChange={(e) => setTecnicoAtual(e.target.value)}
              disabled={statusAtual === 3}
            >
              {listaTecnico.map((tec) => (
                <MenuItem key={tec.matricula} value={tec.matricula}>
                  {tec.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" size="small">
            <FormLabel>Prioridade</FormLabel>
            <Select
              value={prioridadeAtual}
              onChange={(e) => setPrioridadeAtual(e.target.value)}
              disabled={statusAtual === 3}
            >
              {listaPrioridade.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.descricao}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={salvar}
            color="primary"
            sx={{ mt: 2 }}
          >
            Salvar
          </Button>
          <Button
            variant="contained"
            onClick={finalizar}
            color="primary"
            sx={{ mt: 2 }}
          >
            Encerrar Chamado
          </Button>
        </Card>

        <Card className={styles["detalhes__nota-card"]}>
          <Typography
            variant="h6"
            className={styles["detalhes__nota-card-title"]}
          >
            Adicionar Nota
          </Typography>

          <FormControl fullWidth margin="normal" size="small">
            <TextareaAutosize
              minRows={4}
              maxRows={4}
              placeholder="Escreva uma nota..."
              className={styles["detalhes__textarea"]}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={visivelCliente}
                  onChange={(e) => setVisivelCliente(e.target.checked)}
                />
              }
              label="Visível para o usuário"
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={addNote}
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            sx={{ mt: 2 }}
          >
            Adicionar Nota
          </Button>
        </Card>
      </Box>
    </Box>
  );
}
