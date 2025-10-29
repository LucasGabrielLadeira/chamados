import React, { useState } from "react";
import { Box, Typography, Link } from "@mui/material";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FileUploadBox() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    setFileName(file.name);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
  };

  return (
    <Box>
      <Typography variant="subtitle1" color="#757575">
        Anexe um arquivo (Opcional)
      </Typography>

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed #c4c4c4",
          borderRadius: 2,
          textAlign: "center",
          p: 4,
          backgroundColor: isDragging ? "#f9fafb" : "transparent",
          transition: "background-color 0.2s",
          cursor: "pointer",
          color: "#6b7280",
        }}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <FontAwesomeIcon icon={faCloudArrowUp} size="5x" color="#9ca3af"/>
        <Typography>
          <Link
            component="button"
            underline="hover"
            sx={{ fontWeight: 500, color: "#2563eb" }}
          >
            Envie um arquivo
          </Link>{" "}
          ou arraste e solte
        </Typography>
        <Typography variant="body2" color="text.secondary">
          PNG, JPG, GIF até 10MB
        </Typography>
        <input
          id="fileInput"
          type="file"
          accept=".png,.jpg,.jpeg,.gif"
          hidden
          onChange={handleFileSelect}
        />
      </Box>

      {fileName && (
        <Typography mt={1} variant="body2" color="text.secondary">
          Arquivo selecionado: <strong>{fileName}</strong>
        </Typography>
      )}
    </Box>
  );
}
