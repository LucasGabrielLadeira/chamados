import {
  CardContent,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import styles from "./ListagemChamados.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import DataGridData from "../../../components/DataGrid/DataGrid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ListagemChamados() {
  const navigate = useNavigate();
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [opcoesStatus, setOpcoesStatus] = useState([]);
  const [opcoesPrioridade, setOpcoesPrioridade] = useState([]);
  const [opcoesAtribuido, setOpcoesAtribuido] = useState([]);

  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState([]);
  const [filtroPrioridade, setFiltroPrioridade] = useState([]);
  const [filtroAtribuido, setFiltroAtribuido] = useState([]);

  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);

  function normalizarChamado(obj) {
    const camposDesejados = [
      "Código",
      "Título",
      "Descrição",
      "Status",
      "Substatus",
      "Técnico Atribuído",
      "Data Abertura",
      "Requisitante",
    ];

    const filtrado = {};

    for (const key of camposDesejados) {
      if (obj.hasOwnProperty(key)) {
        // Converter "tecnico_matricula" -> "Tecnico Matricula"
        const label = key
          .split("_")
          .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
          .join(" ");

        filtrado[label] = obj[key];
      }
    }
    return filtrado;
  }

  useEffect(() => {
    const fetchChamados = async () => {
      setCarregando(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/chamados/abertos`
        );

        // 🔹 Normalizar todos os chamados recebidos
        const chamadosNormalizados = response.data.map((chamado) =>
          normalizarChamado(chamado)
        );

        // Extrair valores únicos
        setChamados(chamadosNormalizados);
        const status = [
          ...new Set(chamadosNormalizados.map((c) => c["Status"])),
        ];
        const prioridade = [
          ...new Set(chamadosNormalizados.map((c) => c["Substatus"])),
        ];
        const atribuido = [
          ...new Set(chamadosNormalizados.map((c) => c["Técnico Atribuído"])),
        ];

        // Atualizar estados
        setOpcoesStatus(status.filter(Boolean));
        setOpcoesPrioridade(prioridade.filter(Boolean));
        setOpcoesAtribuido(atribuido.filter(Boolean));
        setChamadosFiltrados(chamadosNormalizados);
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
        setSnackbarMessage(
          error.response?.data?.message || "Erro ao buscar os chamados."
        );
        setSnackbarOpen(true);
        setCarregando(false);
      }
    };

    fetchChamados();
  }, []);
  
  useEffect(() => {
    let filtrados = [...chamados];

    // 🔍 Filtro por texto
    if (filtroBusca.trim() !== "") {
      const termo = filtroBusca.toLowerCase();
      filtrados = filtrados.filter((c) =>
        Object.values(c).some((v) => String(v).toLowerCase().includes(termo))
      );
    }

    // 🟦 Filtro por status (Status)
    if (filtroStatus.length > 0) {
      filtrados = filtrados.filter((c) => filtroStatus.includes(c["Status"]));
    }

    // 🟧 Filtro por prioridade/substatus
    if (filtroPrioridade.length > 0) {
      filtrados = filtrados.filter((c) =>
        filtroPrioridade.includes(c["Substatus"])
      );
    }

    // 🟩 Filtro por técnico atribuído
    if (filtroAtribuido.length > 0) {
      filtrados = filtrados.filter((c) =>
        filtroAtribuido.includes(c["Técnico Atribuído"])
      );
    }

    setChamadosFiltrados(filtrados);
  }, [filtroBusca, filtroStatus, filtroPrioridade, filtroAtribuido, chamados]);

  return (
    <>
      <Box
        className={styles["page-title-container"]}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Typography className={styles["page-title"]}>Meus Chamados</Typography>
        <Button
          className={styles["page-button"]}
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => {
            navigate("/Chamados/Novo");
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          <Typography>Novo Chamado</Typography>
        </Button>
      </Box>

      <Card className={styles["search-card-container"]}>
        <CardContent>
          <Box className={styles["search-card__filters"]}>
            <TextField
              placeholder="Pesquisar Chamados"
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              variant="outlined"
              fullWidth
              margin="none"
              size="small"
              className={styles["search-card__input"]}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faSearch} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              variant="outlined"
              size="small"
              className={styles["search-card__select"]}
            >
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                multiple
                defaultValue={[]}
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                renderValue={(selected) =>
                  selected.length === 0 ? "Selecione" : selected.join(", ")
                }
              >
                {opcoesStatus.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              size="small"
              className={styles["search-card__select"]}
            >
              <InputLabel id="prioridade-label">Prioridade</InputLabel>
              <Select
                labelId="prioridade-label"
                label="Prioridade"
                multiple
                defaultValue={[]}
                value={filtroPrioridade}
                onChange={(e) => setFiltroPrioridade(e.target.value)}
                renderValue={(selected) =>
                  selected.length === 0 ? "Selecione" : selected.join(", ")
                }
              >
                {opcoesPrioridade.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              size="small"
              className={styles["search-card__select"]}
            >
              <InputLabel id="atribuido-label">Atribuído a</InputLabel>
              <Select
                labelId="atribuido-label"
                label="Atribuído a"
                multiple
                defaultValue={[]}
                value={filtroAtribuido}
                onChange={(e) => setFiltroAtribuido(e.target.value)}
                renderValue={(selected) =>
                  selected.length === 0 ? "Selecione" : selected.join(", ")
                }
              >
                {opcoesAtribuido.map((tec) => (
                  <MenuItem key={tec} value={tec}>
                    {tec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <DataGridData
          data={chamadosFiltrados || []}
          loading={carregando}
          error={false}
          initialPageSize={10}
          onRowClick={(row) => {
            navigate(`/Chamados/Detalhes/${row.row.Código}`);
          }}
        />
      </Card>
    </>
  );
}
