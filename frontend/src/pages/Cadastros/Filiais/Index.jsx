import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  Typography,
} from "@mui/material";
import { FiFile, FiFilter, FiPlus } from "react-icons/fi";
import { useState } from "react";
import ExportExcel from "../../../components/Button/ExportExcel/ExportExcel";
import useFiliais from "../../../hooks/useFiliais";
import DataGrid from "../../../components/DataGrid/DataGrid";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(10); // valor padrão desejado
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { filiais, loading: loadingFiliais, error } = useFiliais();
  const handleNew = () => {
    navigate("./Cadastro");
  };

  const handleDelete = (row) => {};

  const handleView = (row) => {
    navigate(`./Visualizar/${row.idtbfilial}`);
  };

  const API_URL = import.meta.env.VITE_API_URL + "/filiais";
  console.log(API_URL);

  return (
    <>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h2">
              Gerenciar Filiais
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <ExportExcel />
              <Button
                variant="contained"
                onClick={handleNew}
                startIcon={<FiPlus />}
              >
                Adicionar
              </Button>
            </Box>
          </Box>
          <DataGrid
            data={filiais || []}
            loading={loadingFiliais}
            error={error}
            hiddenIndexes={[4, 5, 6, 7, 8, 11, 12, 14, 15]}
            initialPageSize={10}
          />
        </CardContent>
      </Card>
    </>
  );
}

export default Index;
