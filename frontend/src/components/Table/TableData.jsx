import { useState, useEffect, useMemo } from "react";
import {
  Box,
  IconButton,
  Pagination,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import { FiCheck, FiEdit, FiEye, FiTrash, FiX } from "react-icons/fi";

function TableData({
  data = [],
  loading = false,
  error = null,
  hiddenIndexes = [],
  initialPageSize = 10,
  onSelectionChange,
  onChoose,
  handleRowClick = () => null,
}) {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRows, setSelectedRows] = useState([]);
  const [inputValues, setInputValues] = useState({});

  // Derived values
  const hasSelection = !!onSelectionChange;

  // Generate columns from data
  const columns = useMemo(() => {
    if (data.length === 0) return [];

    // Base columns from data keys
    let visibleColumns = Object.keys(data[0])
      .filter((key) => key !== "id")
      .map((key) => ({
        field: key,
        headerName: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .trim(),
        width: key.length > 15 ? 200 : 150,
      }))
      .filter((_, index) => !hiddenIndexes.includes(index));

    // Add selection column if needed
    if (hasSelection) {
      visibleColumns.unshift({
        field: "selection",
        headerName: "",
        width: 50,
      });
    }

    return visibleColumns;
  }, [data, hiddenIndexes, hasSelection]);

  // Filter data based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }, [searchTerm, data]);

  // Paginate data
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  // Selection helpers
  const isRowSelected = (row) =>
    selectedRows.some((selectedRow) => selectedRow.id === row.id);
  const isAllSelected =
    filteredRows.length > 0 && selectedRows.length === filteredRows.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < filteredRows.length;

  // Handlers
  const handleRowSelect = (row, isSelected) => {
    let newSelectedRows;
    const currentValue = inputValues[row.id] || 1;

    if (isSelected) {
      const rowWithValue = { ...row, quantidade: currentValue };
      newSelectedRows = [...selectedRows, rowWithValue];
    } else {
      newSelectedRows = selectedRows.filter(
        (selectedRow) => selectedRow.id !== row.id
      );
      const newInputValues = { ...inputValues };
      delete newInputValues[row.id];
      setInputValues(newInputValues);
    }

    setSelectedRows(newSelectedRows);
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    }
  };

  const handleSelectAll = (isSelected) => {
    let newSelectedRows;
    if (isSelected) {
      newSelectedRows = filteredRows.map((row) => ({
        ...row,
        quantidade: inputValues[row.id] || 1,
      }));
      const newInputValues = { ...inputValues };
      filteredRows.forEach((row) => {
        if (!newInputValues[row.id]) {
          newInputValues[row.id] = 1;
        }
      });
      setInputValues(newInputValues);
    } else {
      newSelectedRows = [];
      setInputValues({});
    }
    setSelectedRows(newSelectedRows);
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    }
  };

  const handleInputChange = (row, value) => {
    const numericValue = parseInt(value) || 1;
    const newInputValues = { ...inputValues, [row.id]: numericValue };
    setInputValues(newInputValues);

    if (isRowSelected(row)) {
      const newSelectedRows = selectedRows.map((selectedRow) =>
        selectedRow.id === row.id
          ? { ...selectedRow, quantidade: numericValue }
          : selectedRow
      );
      setSelectedRows(newSelectedRows);
      if (onSelectionChange) {
        onSelectionChange(newSelectedRows);
      }
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPage(1);
  };

  // Error state
  if (error) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6" gutterBottom>
          Erro ao carregar dados
        </Typography>
        <Typography color="error" variant="body2">
          {error.message || "Ocorreu um erro ao carregar os dados"}
        </Typography>
      </Box>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Main render
  return (
    <Box sx={{ padding: 3 }}>
      {/* Search field */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "end" }}>
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        {/* Pagination controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Linhas por página:</Typography>
            <Select
              size="small"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {[5, 10, 25, 50].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Mostrando {Math.min((page - 1) * pageSize + 1, filteredRows.length)}{" "}
            - {Math.min(page * pageSize, filteredRows.length)} de{" "}
            {filteredRows.length} registros
          </Typography>
        </Box>

        {/* Main table */}
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table
            sx={{ minWidth: 650, tableLayout: "auto" }}
            size="small"
            aria-label="tabela de dados"
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {column.field === "selection" ? (
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        size="small"
                      />
                    ) : (
                      column.headerName
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
                  >
                    Nenhum dado para exibir
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row, index) => (
                  <TableRow
                    onPress ={() => handleRowClick(row)}
                    key={row.id || index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {column.field === "selection" ? (
                          <Checkbox
                            checked={isRowSelected(row)}
                            onChange={(e) =>
                              handleRowSelect(row, e.target.checked)
                            }
                            size="small"
                          />
                        ) : column.field === "quantity" ? (
                          <TextField
                            type="number"
                            size="small"
                            value={inputValues[row.id] || ""}
                            onChange={(e) =>
                              handleInputChange(row, e.target.value)
                            }
                            placeholder="1"
                            inputProps={{
                              min: 1,
                              style: { textAlign: "center" },
                            }}
                            sx={{
                              width: 80,
                              "& .MuiOutlinedInput-root": {
                                height: 32,
                              },
                            }}
                            disabled={!isRowSelected(row)}
                          />
                        ) : column.field === "onChoose" ? (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleOpenChoose(row, 1)}
                            >
                              <FiCheck />
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleOpenChoose(row, 0)}
                            >
                              <FiX />
                            </Button>
                          </Box>
                        ) : (
                          <Typography variant="body2">
                            {row[column.field] ?? "-"}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Bottom pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredRows.length / pageSize)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </Box>
  );
}

export default TableData;
