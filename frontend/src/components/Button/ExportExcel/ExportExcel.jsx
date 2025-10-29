import { Button } from "@mui/material";
import { FiFile } from "react-icons/fi";
import CustomSnackbar from "../../SnackBar/SnackBar";

function ExportExcel() {
    const exportExcel = () => {
        const originalTable = document.getElementById('table');
        if (!originalTable) {
            CustomSnackbar("Tabela não encontrada!");
            return;
        }

        // Clona a tabela para não alterar a original
        const clonedTable = originalTable.cloneNode(true);

        // Remove a última célula de cada linha (thead e tbody)
        const rows = clonedTable.querySelectorAll('tr');
        rows.forEach(row => {
            const lastCell = row.lastElementChild;
            if (lastCell) {
                row.removeChild(lastCell);
            }
        });

        const tableHTML = clonedTable.outerHTML.replace(/ /g, '%20');

        const fileName = 'Relatorio.xls';
        const dataType = 'application/vnd.ms-excel';

        const link = document.createElement('a');
        link.href = `data:${dataType}, ${tableHTML}`;
        link.download = fileName;
        link.click();
    };



    return (
        <Button variant="contained" color="success" onClick={() => exportExcel("table")} startIcon={<FiFile />} size="small">Gerar Excel</Button>

    )
}


export default ExportExcel;