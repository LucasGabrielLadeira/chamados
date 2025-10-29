import { Box, Button, Card, CardContent, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { FiFile, FiFilter, FiPlus } from "react-icons/fi";
import { useState } from "react";
import ExportExcel from "../../../components/Button/ExportExcel/ExportExcel";
import FilterButton from "../../../components/Button/FilterButton/FilterButton";
import TableData from "../../../components/table/TableData";


function Index() {
    const [rowsPerPage, setRowsPerPage] = useState(10); 
    const handleEdit = (row) => {

    };

    const handleDelete = (row) => {
        console.log("Excluir item:", row);
    };

    const handleView = (row) => {
    };

    

    const API_URL = "/dados.json";

    return (
        <>
            <Card >
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h5" component="h2">Gerenciar Usuário</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <ExportExcel />
                            <FilterButton />
                            <Button variant="contained" startIcon={<FiPlus />} size="small">Adicionar</Button>
                        </Box>
                    </Box>

                    <TableData
                        url={API_URL}
                        rowsPerPage={rowsPerPage}
                        editButton={handleEdit}
                        deleteButton={handleDelete}
                        viewButton={handleView}
                    />
                </CardContent>

            </Card>
        </>
    );
}

export default Index;