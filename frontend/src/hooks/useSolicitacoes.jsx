import { useState } from "react";
import axios from "axios";

export default function useSolicitacoes() {
  const [dataSolicitacao, setDataSolicitacao] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpdateItem = (updatedItem) => {
    setDataSolicitacao((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const updateItemField = (id, field, value) => {
    setDataSolicitacao((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (itemToRemove) => {
    setDataSolicitacao((prev) =>
      prev.filter((item) => item.id !== itemToRemove.id)
    );
  };

  const enviarSolicitacoes = async (justificativa, onSuccess, onError) => {
    setLoading(true);
    try {
      const centroCusto = localStorage.getItem("centro_custo") || "";
      const siglaCentroCusto = centroCusto.substring(0, 3).toUpperCase();
      const codCompra = `SOL-${siglaCentroCusto}-${Date.now()}`;

      for (const item of dataSolicitacao) {
        const payload = {
          cod_material: item["Cod. Material"],
          solicitante: localStorage.getItem("matricula"),
          quantidade: item.quantidade,
          cod_compra: codCompra,
          justificativa_solicitante: justificativa,
        };

        await axios.post(import.meta.env.VITE_API_URL + "/solcompra", payload, {
          headers: { Authorization: localStorage.getItem("token") },
        });
      }

      setDataSolicitacao([]);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao enviar solicitações:", error);
      onError?.();
    } finally {
      setLoading(false);
    }
  };

  return {
    dataSolicitacao,
    setDataSolicitacao,
    handleUpdateItem,
    handleRemoveItem,
    enviarSolicitacoes,
    updateItemField,
    loading,
  };
}
