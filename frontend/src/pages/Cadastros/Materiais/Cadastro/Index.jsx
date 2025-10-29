import {
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Box,
  TextField,
  Container,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";

import { FiInfo, FiPackage, FiFileText, FiCheck } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CustomSnackbar from "../../../../components/SnackBar/SnackBar";
import { useNavigate } from "react-router-dom";

export default function CadastroMaterial({ onSubmit }) {
  const navigate = useNavigate();
  const [rowsCCusto, setRowsCCusto] = useState([]);
  const [rowsUND, setRowsUND] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isConsumivel, setIsConsumivel] = useState(false);

  const descricaoRef = useRef();
  const unidRef = useRef();
  const centrocustoRef = useRef();
  const statusRef = useRef();
  const obsRef = useRef();
  const marcaRef = useRef();
  const modeloRef = useRef();
  const eanRef = useRef();
  const subGrupoRef = useRef();
  const respMaterialRef = useRef();
  const patrimonioRef = useRef();

  const API_URL_CCUSTO = import.meta.env.VITE_API_URL + "/centrocusto";
  const API_URL_UND = import.meta.env.VITE_API_URL + "/unidades";

  useEffect(() => {
    const fetchCCusto = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_URL_CCUSTO, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = response.data;
        const dataWithId = result.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setRowsCCusto(dataWithId);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Falha ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUND = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_URL_UND, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = response.data;
        const dataWithId = result.map((item, index) => ({
          ...item,
          id: item.id ?? `temp-id-${index}`,
        }));
        setRowsUND(dataWithId);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Falha ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchCCusto();
    fetchUND();
  }, [API_URL_CCUSTO, API_URL_UND]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const renderInput = (
    label,
    ref,
    multiline = false,
    select = false,
    options = []
  ) => {
    return (
      <Box py={1}>
        {select ? (
          <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select
              label={label}
              defaultValue=""
              inputRef={ref}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
            >
              <MenuItem value="">
                <em>Selecionar</em>
              </MenuItem>
              {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            size="small"
            label={label}
            inputRef={ref}
            multiline={multiline}
            rows={multiline ? 3 : 1}
          />
        )}
      </Box>
    );
  };

  const Section = ({ title, icon, children }) => (
    <Box mb={2}>
      <Box
        bgcolor="#f5f5f5"
        px={2}
        py={1}
        display="flex"
        alignItems="center"
        borderRadius={1}
      >
        {icon}
        <Typography variant="subtitle1" fontWeight="bold" ml={1}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box p={2}>{children}</Box>
    </Box>
  );

  const handleSubmit = async () => {
    const formData = {
      descricao: descricaoRef.current?.value || "",
      unid: unidRef.current?.value || "",
      centrocusto: centrocustoRef.current?.value || "",
      status: statusRef.current?.value || "",
      obs: obsRef.current?.value || "",
      marca: marcaRef.current?.value || "",
      modelo: modeloRef.current?.value || "",
      ean: eanRef.current?.value || "",
      sub_grupo: subGrupoRef.current?.value || "",
      resp_material: respMaterialRef.current?.value || "",
      patrimonio: patrimonioRef.current?.value || "",
      consumivel: isConsumivel,
    };

    console.log(formData);

    // Validação simples (opcional)
    if (
      !formData.descricao ||
      !formData.unid ||
      !formData.centrocusto ||
      !formData.status
    ) {
      showSnackbar("Preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/materiais`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      console.log("Formulário enviado:", response.data);
      showSnackbar("Solicitação enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      showSnackbar("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ width: "100%" }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <FiInfo size={24} />
            <Typography variant="h5" fontWeight="bold" ml={1}>
              Cadastro de Material
            </Typography>
          </Box>

          <Box sx={{ borderRadius: 1 }}>
            <Section title="Informações Básicas" icon={<FiFileText />}>
              <Grid>
                {renderInput(
                  "Descrição",
                  descricaoRef,
                  false,
                  false
                )}
              </Grid>
              <Grid>
                <FormControl fullWidth>
                  <Grid container spacing={2}>
                    <Grid item sx={{ flexGrow: 1 }}>
                      {renderInput(
                        "Unidade",
                        unidRef,
                        false,
                        true,
                        rowsUND.map((item) => ({
                          label: item.descricao,
                          value: item.descricao,
                        }))
                      )}
                    </Grid>
                    <Grid item sx={{ flexGrow: 1 }}>
                      {renderInput("Status", statusRef, false, true, [
                        { label: "Ativo", value: 1 },
                        { label: "Inativo", value: 0 },
                      ])}
                    </Grid>
                    <Grid item sx={{ alignSelf: "center" }}>
                      <Box sx={{ width: "100%" }}>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="É um item de consumo?"
                          sx={{ whiteSpace: "nowrap" }} // evita quebra de linha
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid>{renderInput("Observação", obsRef, true)}</Grid>
            </Section>
          </Box>

          <Box sx={{ borderRadius: 1 }}>
            <Section title="Detalhes do Material" icon={<FiPackage />}>
              <Grid>
                <Grid container spacing={2}>
                  <Grid item sx={{ flexGrow: 1 }}>
                    {renderInput("Marca", marcaRef)}
                    {renderInput("Modelo", modeloRef)}
                  </Grid>
                  <Grid item sx={{ flexGrow: 1 }}>
                    {renderInput("EAN", eanRef)}
                    {renderInput("Subgrupo", subGrupoRef)}
                  </Grid>
                  <Grid item sx={{ flexGrow: 1 }}>
                    {renderInput("Responsável", respMaterialRef)}
                    {renderInput("Patrimônio", patrimonioRef)}
                  </Grid>
                </Grid>
                <Grid>
                  {renderInput(
                    "Centro de Custo",
                    centrocustoRef,
                    false,
                    true,
                    rowsCCusto.map((item) => ({
                      label: item.descricao,
                      value: item.id,
                    }))
                  )}
                </Grid>
              </Grid>
            </Section>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              component="a"
              onClick={() => navigate("../")}
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Cadastrar
            </Button>
          </Box>
        </Paper>
      </Box>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
}
