import { useState } from "react";
import {
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    IconButton
} from "@mui/material";
import { FormControl } from "@mui/material";
import { FiTrash } from "react-icons/fi";
import axios from "axios";

export default function Home() {
    const [solicitacoes, setSolicitacoes] = useState([
        { produto: "", quantidade: "", descricao: "" }
    ]);

    const handleChange = (index, field, value) => {
        const novasSolicitacoes = [...solicitacoes];
        novasSolicitacoes[index][field] = value;
        setSolicitacoes(novasSolicitacoes);
    };

    const adicionarSolicitacao = () => {
        setSolicitacoes([...solicitacoes, { produto: "", quantidade: "", descricao: "" }]);
    };

    const removerSolicitacao = (index) => {
        const novasSolicitacoes = solicitacoes.filter((_, i) => i !== index);
        setSolicitacoes(novasSolicitacoes);
    };


    const listProducts = async () => {
        try {
            return listProducts = await axios.get("http://localhost:8000/listar_produtos");
        } catch (error) {
            alert("Erro ao listar produtos. Recarregue a página")
        }
    }

    const enviarSolicitacoes = async () => {
        try {
            // const response = await axios.post("http://localhost:8000/sol_compra", {
            //     solicitacoes: solicitacoes
            // });

            const response = solicitacoes
            console.log("Resposta da API:", response.data);
            alert("Solicitações enviadas com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar solicitações:", error);
            alert("Erro ao enviar solicitações. Tente novamente.");
        }
    };


    return (
        <div >
            <Typography variant="h4" gutterBottom>
                Solicitar Compras
            </Typography>

            {solicitacoes.map((solicitacao, index) => (

                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth required>
                                <InputLabel id={`produto-label-${index}`}>Produto</InputLabel>
                                <Select
                                    labelId={`produto-label-${index}`}
                                    value={solicitacao.produto || "placeholder"}
                                    onChange={(e) => handleChange(index, "produto", e.target.value)}
                                    label="Produto"
                                >
                                    <MenuItem value="placeholder">-- Selecione o Produto --</MenuItem>
                                    <MenuItem value="item1">Teste de item 1</MenuItem>
                                    <MenuItem value="item2">Teste de item 2</MenuItem>
                                    <MenuItem value="item3">Teste de item 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Quantidade"
                                type="number"
                                value={solicitacao.quantidade}
                                onChange={(e) => handleChange(index, "quantidade", e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                            <IconButton
                                color="error"
                                onClick={() => removerSolicitacao(index)}
                                disabled={solicitacoes.length === 1}
                            >
                                <FiTrash />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Descrição"
                            type="text"
                            value={solicitacao.descricao}
                            onChange={(e) => handleChange(index, "descricao", e.target.value)}
                            required
                        />
                    </Grid>
                </CardContent>

            ))}

            <Button
                variant="outlined"
                color="primary"
                onClick={adicionarSolicitacao}
                style={{ marginRight: "10px" }}
            >
                + Adicionar Produto
            </Button>

            <Button variant="contained" color="success" onClick={enviarSolicitacoes}>
                Enviar Solicitação
            </Button>
        </div>
    );
}
