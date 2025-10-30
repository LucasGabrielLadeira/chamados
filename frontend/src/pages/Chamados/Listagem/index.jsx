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
  const [chamadosOriginais, setChamadosOriginais] = useState([]); // 🔹 Armazena todos
  const [chamados, setChamados] = useState([]); // 🔹 Armazena os filtrados
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [prioridadeFilter, setPrioridadeFilter] = useState([]);
  const [atribuidoFilter, setAtribuidoFilter] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [prioridadeOptions, setPrioridadeOptions] = useState([]);
  const [atribuidoOptions, setAtribuidoOptions] = useState([]);
  const statusMap = statusOptions.reduce((acc, s) => {
    acc[String(s).toLowerCase()] = s;
    return acc;
  }, {});
  // --- Função para normalizar os dados
  function normalizarChamado(obj) {
    const camposDesejados = [
      "Código",
      "Título",
      "Descrição",
      "Tipo do Problema",
      "Status",
      "Técnico Atribuído",
      "Prioridade",
      "Data Abertura",
      "Requisitante",
    ];

    const filtrado = {};
    for (const key of camposDesejados) {
      if (obj.hasOwnProperty(key)) {
        const label = key
          .split("_")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ");
        filtrado[label] = obj[key];
      }
    }
    return filtrado;
  }

  // --- Filtragem dinâmica
  function filtrarChamados(chamado) {
    let atendeFiltro = true;

    if (searchValue) {
      const termoBusca = searchValue.toLowerCase();
      atendeFiltro =
        chamado["Título"]?.toLowerCase().includes(termoBusca) ||
        chamado["Descrição"]?.toLowerCase().includes(termoBusca) ||
        chamado["Requisitante"]?.toLowerCase().includes(termoBusca) ||
        chamado["Código"]?.toString().includes(termoBusca);
    }

    if (statusFilter.length > 0) {
      atendeFiltro =
        atendeFiltro &&
        statusFilter.includes(String(chamado["Status"])?.toLowerCase());
    }

    if (prioridadeFilter.length > 0) {
      atendeFiltro =
        atendeFiltro &&
        prioridadeFilter.includes(String(chamado["Prioridade"])?.toLowerCase());
    }

    if (atribuidoFilter.length > 0) {
      atendeFiltro =
        atendeFiltro &&
        atribuidoFilter.includes(
          String(chamado["Técnico Atribuído"])?.toLowerCase()
        );
    }

    return atendeFiltro;
  }

  // --- Busca inicial
  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/chamados/abertos`
        );

        const normalizados = response.data.map(normalizarChamado);
        setChamadosOriginais(normalizados);

        // 🔹 Extrair valores únicos de cada coluna
        const uniqueStatuses = [
          ...new Set(
            normalizados
              .map((c) => c["Status"])
              .filter((v) => v != null && String(v).trim() !== "")
          ),
        ];

        const uniquePrioridades = [
          ...new Set(
            normalizados
              .map((c) => c["Prioridade"])
              .filter((v) => v != null && String(v).trim() !== "")
          ),
        ];

        const uniqueAtribuidos = [
          ...new Set(
            normalizados
              .map((c) => c["Técnico Atribuído"])
              .filter((v) => v != null && String(v).trim() !== "")
          ),
        ];

        setStatusOptions(uniqueStatuses);
        setPrioridadeOptions(uniquePrioridades);
        setAtribuidoOptions(uniqueAtribuidos);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
      }
    };

    fetchChamados();
  }, []);
  // --- Atualiza os chamados filtrados sempre que filtros mudam
  useEffect(() => {
    const filtrados = chamadosOriginais.filter(filtrarChamados);
    setChamados(filtrados);
  }, [
    searchValue,
    statusFilter,
    prioridadeFilter,
    atribuidoFilter,
    chamadosOriginais,
  ]);
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
            navigate("/Chamados/NovoChamado");
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Pesquisar Chamados"
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
                multiple
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                renderValue={(selected) =>
                  selected.length === 0
                    ? "Selecione"
                    : selected.map((s) => statusMap[s]).join(", ")
                }
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={String(status).toLowerCase()}>
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
                multiple
                value={prioridadeFilter}
                onChange={(e) => setPrioridadeFilter(e.target.value)}
                label="Prioridade"
                renderValue={(selected) =>
                  selected.length === 0
                    ? "Selecione"
                    : selected.map((s) => statusMap[s]).join(", ")
                }
              >
                {prioridadeOptions.map((prioridade) => (
                  <MenuItem
                    key={prioridade}
                    value={String(prioridade).toLowerCase()}
                  >
                    {prioridade}
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
                multiple
                value={atribuidoFilter}
                onChange={(e) => setAtribuidoFilter(e.target.value)}
                label="Atribuído a"
                renderValue={(selected) =>
                  selected.length === 0
                    ? "Selecione"
                    : selected.map((s) => statusMap[s]).join(", ")
                }
              >
                {atribuidoOptions.map((user) => (
                  <MenuItem key={user} value={String(user).toLowerCase()}>
                    {user}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <DataGridData
          data={chamados || []}
          loading={false}
          error={false}
          initialPageSize={10}
          onRowClick={(row) => {
            navigate(`/Chamados/Detalhes/${row.row["Código"]}`);
          }}
        />
      </Card>
    </>
  );
}
