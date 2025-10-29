import {
  Typography,
  Grid,
  Paper,
  Divider,
  Box,
  TextField,
  Container,
  FormControl,
  Button,
} from "@mui/material";

import { FiInfo, FiPackage, FiFileText } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomSnackbar from "../../../../components/SnackBar/SnackBar";

export default function VisualizarMaterialPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;

  const [data, setData] = useState({});
  const [unidades, setUnidades] = useState([]);
  const [centrosCusto, setCentrosCusto] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [materialRes, undRes, ccRes] = await Promise.all([
        axios.get(`${API_BASE}/materiais/${id}`, { headers }),
        axios.get(`${API_BASE}/unidades`, { headers }),
        axios.get(`${API_BASE}/centrocusto`, { headers }),
      ]);

      setData(materialRes.data);
      setUnidades(undRes.data || []);
      setCentrosCusto(ccRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const renderInput = (
    label,
    field,
    multiline = false,
    select = false,
    options = [],
    valueLabelOnly = false
  ) => (
    <Box py={1}>
      <TextField
        label={label}
        value={String(data[field] ?? "")}
        onChange={(e) =>
          isEditing && setData((prev) => ({ ...prev, [field]: e.target.value }))
        }
        fullWidth
        size="small"
        multiline={multiline}
        select={select}
        rows={multiline ? 3 : 1}
        SelectProps={{ native: true }}
        disabled={!isEditing}
      >
        {select && (
          <>
            <option value=""></option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </>
        )}
      </TextField>
    </Box>
  );

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
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`${API_BASE}/materiais/${id}`, data, { headers });

      setIsEditing(false);
      showSnackbar("Registro atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar registro:", err);
      alert("Erro ao atualizar registro.");
    }
  };

  return (
    <Box>
      <Box>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <FiInfo size={24} />
            <Typography variant="h5" fontWeight="bold" ml={1}>
              Visualização do Material
            </Typography>
          </Box>

          <Section title="Informações Básicas" icon={<FiFileText />}>
            <Grid item xs={12}>
              {renderInput("Descrição", "descricao")}
            </Grid>
            <Grid>
              <FormControl fullWidth>
                <Grid
                  container
                  spacing={2}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Grid item sx={{ flexGrow: 1 }}>
                    {renderInput(
                      "Unidade",
                      "unid",
                      false,
                      true,
                      unidades.map((item) => item.descricao),
                      true
                    )}
                  </Grid>
                  <Grid item sx={{ flexGrow: 1 }}>
                    {renderInput("Status", "status", false, true, [
                      { label: "Ativo", value: "1" },
                      { label: "Inativo", value: "0" },
                    ])}
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {renderInput("Observação", "obs", true)}
            </Grid>
          </Section>

          <Section title="Detalhes do Material" icon={<FiPackage />}>
            <Grid
              container
              spacing={2}
              sx={{ justifyContent: "space-between" }}
            >
              <Grid item sx={{ flexGrow: 1 }}>
                {renderInput("Marca", "marca")}
                {renderInput("Modelo", "modelo")}
              </Grid>

              <Grid item sx={{ flexGrow: 1 }}>
                {renderInput("EAN", "ean")}
                {renderInput("Subgrupo", "sub_grupo")}
              </Grid>

              <Grid item sx={{ flexGrow: 1 }}>
                {renderInput("Qtd. Estoque", "saldo")}
                {renderInput("Patrimônio", "patrimonio")}
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ flexGrow: 1 }}>
              {renderInput(
                "Centro de Custo",
                "centrocusto",
                false,
                true,
                centrosCusto.map((item) => ({
                  value: item.idccusto,
                  label: item.descricao,
                }))
              )}
            </Grid>
          </Section>

          <Box display="flex" justifyContent="flex-end" mt={3} sx={{ gap: 2 }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    fetchAll();
                  }}
                >
                  Cancelar
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                  Enviar
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/Cadastros/Materiais")}
                >
                  Voltar
                </Button>
                <Button variant="contained" onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              </>
            )}
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
