import {
    Box,
    Button,
    Drawer,
    Typography,
    Divider,
    Card,
    CardContent,
    IconButton,
    TextField
} from "@mui/material";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useState } from "react";

function DetailsDrawer({
    open,
    onClose,
    onConfirm,
    dados = [],
    title,
    subtitle,
    confirmButtonText = "Confirmar",
    cancelButtonText = "Voltar",
    quantityField = "quantidade",
    visibleFields = [],
    onUpdateItem,       
    onRemoveItem,       
}) {
    const [justificativa, setJustificativa] = useState("");

    const totalItens = dados.reduce((total, item) => total + Number(item[quantityField] || 1), 0);

    const handleQuantityChange = (item, change) => {
        const current = Number(item[quantityField] || 1);
        const updated = Math.max(1, current + change);
        onUpdateItem({ ...item, [quantityField]: updated });
    };

    const handleConfirm = () => {
        onConfirm(justificativa);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 500 },
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
        >
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                {/* Cabeçalho */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>{title}</Typography>
                    <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Resumo */}
                <Card sx={{ mb: 3, bgcolor: "#f5f5f5" }}>
                    <CardContent>
                        <Typography variant="subtitle2" gutterBottom>Resumo</Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography><strong>Total de itens:</strong> {dados.length}</Typography>
                            <Typography><strong>Quantidade total:</strong> {totalItens}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Justificativa */}
                <TextField
                    label="Justificativa"
                    multiline
                    minRows={3}
                    value={justificativa}
                    onChange={(e) => setJustificativa(e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                />

                {/* Lista de Itens */}
                {dados.length > 0 ? (
                    <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
                        {dados.map((item, idx) => (
                            <Card
                                key={item.id || idx}
                                sx={{
                                    mb: 2,
                                    border: "1px solid #e0e0e0",
                                    "&:hover": { bgcolor: "#fafafa" },
                                }}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <IconButton onClick={() => onRemoveItem(item)} color="error" size="small">
                                            <FiTrash2 />
                                        </IconButton>

                                        <Box sx={{ flex: 1, px: 2 }}>
                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                                    gap: 1,
                                                }}
                                            >
                                                {visibleFields.map(({ key, label }) =>
                                                    item[key] !== null && item[key] !== "" ? (
                                                        <Typography key={key} variant="body2">
                                                            <strong>{label}:</strong> {String(item[key])}
                                                        </Typography>
                                                    ) : null
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Controles de Quantidade */}
                                        <Box
                                            sx={{
                                                bgcolor: "primary.main",
                                                color: "white",
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                sx={{ color: "white" }}
                                                onClick={() => handleQuantityChange(item, -1)}
                                            >
                                                <FiMinus />
                                            </IconButton>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {item[quantityField] || 1}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                sx={{ color: "white" }}
                                                onClick={() => handleQuantityChange(item, 1)}
                                            >
                                                <FiPlus />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 4,
                            bgcolor: "#f5f5f5",
                            borderRadius: 2,
                            border: "2px dashed #ccc",
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            Nenhum item disponível
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Ações */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 4,
                    pt: 2,
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <Button variant="outlined" onClick={onClose}>
                    {cancelButtonText}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirm}
                    disabled={dados.length === 0 || justificativa.trim() === ""}
                >
                    {confirmButtonText}
                </Button>
            </Box>
        </Drawer>
    );
}

export default DetailsDrawer;
