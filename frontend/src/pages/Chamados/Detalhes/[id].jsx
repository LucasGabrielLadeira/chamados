import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  FormControl,
  FormLabel,
  Select,
  TextareaAutosize,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DetalhesChamados() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState(null);

  useEffect(() => {
    const fetchChamado = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/chamados/${id}`
        );
        console.log("Detalhes do chamado:", response.data);
        setChamado(response.data);
      } catch (error) {
        console.error("Erro ao buscar chamado:", error);
      }
    };

    fetchChamado();
  }, [id]);

  if (!chamado) {
    return (
      <Box
        width={"100%"}
        height={"100%"}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="row" gap={2} padding={2}>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        justifyContent="space-between"
        gap={2}
      >
        <Box display="flex" flexDirection="row" gap={1} alignItems="center">
          <Typography color="#000">Chamados</Typography>
          <FontAwesomeIcon
            icon={faChevronRight}
            fontSize={12}
            style={{ color: "#000" }}
          />
          <Typography color="#000">Chamado #{id}</Typography>
        </Box>

        <Card
          sx={{ p: 2 }}
          display={"flex"}
          flexDirection="row"
          alignItems="center"
          gap={2}
        >
          <Box
            display={"flex"}
            flexDirection="row"
            gap={1}
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Typography variant="h6" fontWeight={"Bold"}>
              Chamado #{id}: {chamado.titulo}
            </Typography>
            <Box display="flex" flexDirection="row" gap={2} ml={4}>
              <Typography>{chamado.status_id}</Typography>
              <Typography>{chamado.prioridade}</Typography>
            </Box>
          </Box>
          <Typography>
            Aberto por {chamado.usuario_matricula} em{" "}
            {new Date(chamado.data_abertura).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Card>

        <Card sx={{ p: 2, flexGrow: 1 }}>
          <Typography fontWeight={"Bold"}>Detalhes do Chamado</Typography>
          <Box mt={2} display="flex" flexDirection="row" gap={2}>
            <Box display={"flex"} flexGrow={1} flexDirection={"column"} gap={2}>
              <Box>
                <Typography>Usuário</Typography>
                <Typography>{chamado.usuario_matricula}</Typography>
              </Box>
              <Box>
                <Typography>Data de Abertura</Typography>
                <Typography>
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
            <Box display={"flex"} flexGrow={1} flexDirection={"column"} gap={2}>
              <Box>
                <Typography>Centro de Custo</Typography>
                <Typography>{chamado.tipo_problema}</Typography>
              </Box>
              <Box>
                <Typography>Tipo de Problema</Typography>
                <Typography>{chamado.tipo_problema}</Typography>
              </Box>
            </Box>
          </Box>
          <Box mt={2}>
            <Typography>Descrição</Typography>
            <Typography>{chamado.descricao}</Typography>
          </Box>
        </Card>
      </Box>

      <Card
        sx={{
          p: 2,
          minWidth: "400px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6">Ações</Typography>
        <FormControl fullWidth margin="normal" size="small">
          <FormLabel>Alterar Status</FormLabel>
          <Select>
            <MenuItem value="aberto">Aberto</MenuItem>
            <MenuItem value="em_andamento">Em Andamento</MenuItem>
            <MenuItem value="fechado">Fechado</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" size="small">
          <FormLabel>Alterar Categoria</FormLabel>
          <Select>
            <MenuItem value="hardware">Hardware</MenuItem>
            <MenuItem value="software">Software</MenuItem>
            <MenuItem value="rede">Rede</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" size="small">
          <FormLabel>Alterar Técnico Atribuído</FormLabel>
          <Select>
            <MenuItem value="usuario1">Usuário 1</MenuItem>
            <MenuItem value="usuario2">Usuário 2</MenuItem>
            <MenuItem value="usuario3">Usuário 3</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" size="small">
          <FormLabel>Alterar Prioridade</FormLabel>
          <Select>
            <MenuItem value="baixa">Baixa</MenuItem>
            <MenuItem value="media">Média</MenuItem>
            <MenuItem value="alta">Alta</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" size="small">
          <FormLabel>Adicionar Nota</FormLabel>
          <TextareaAutosize
            minRows={4}
            maxRows={4}
            placeholder="Escreva uma nota..."
            style={{ width: "100%" }}
          />
        </FormControl>
      </Card>
    </Box>
  );
}
