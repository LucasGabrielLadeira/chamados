import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";
import { Box, CircularProgress, Typography, Card } from "@mui/material";
import styles from "./Dashboard.module.css";
export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/dashboard`).then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) {
    return (
      <Box className={styles["dashboard_loading"]}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Título */}
      <Box>
        <Typography>Dashboard</Typography>
        <Typography>Visão geral dos chamados e atividades</Typography>
      </Box>

      {/* Linha superior – SLAs + urgências */}
      <Box>
        <CardSLA
          titulo="SLA Atendimento"
          valor={data.sla_atendimento}
          meta={data.sla_meta_atendimento}
          cor="#22c55e"
        />

        <CardSLA
          titulo="SLA Resolução"
          valor={data.sla_resolucao}
          meta={data.sla_meta_resolucao}
          cor="#facc15"
        />

        <CardUrgencias urgencias={data.urgencias} />
      </Box>

      {/* Resumo */}
      <Card>
        <Typography>Resumo dos Chamados</Typography>

        <Box>
          <CardNumero titulo="Atribuídos a mim" valor={data.resumo.atribuido} />
          <CardNumero titulo="Pendentes" valor={data.resumo.pendentes} />
          <CardNumero titulo="Concluídos" valor={data.resumo.concluidos} />
        </Box>
      </Card>

      {/* Carga de Trabalho */}
      <Card>
        <Typography>Carga de Trabalho</Typography>

        <Box>
          <Typography>Chamados por Técnico</Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.carga_trabalho}>
              <XAxis dataKey="tecnico" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  );
}

/* COMPONENTES */

function CardSLA({ titulo, valor, meta, cor }) {
  const grafico = [{ name: titulo, value: valor, fill: cor }];

  return (
    <Card>
      <Typography>{titulo}</Typography>

      <Box>
        <Box>
          <ResponsiveContainer>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={grafico}
              startAngle={90}
              endAngle={450}
            >
              <RadialBar
                minAngle={15}
                clockWise
                background
                dataKey="value"
                cornerRadius={20}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <Typography>{valor}%</Typography>
          <Typography>Meta: {meta}%</Typography>
          <Typography>Desempenho dentro do prazo.</Typography>
        </Box>
      </Box>
    </Card>
  );
}

function CardUrgencias({ urgencias }) {
  return (
    <Card>
      <Typography>Chamados por Urgência</Typography>

      <Box>
        <LinhaUrgencia cor="text-red-500" nome="Alta" valor={urgencias.alta} />
        <LinhaUrgencia
          cor="text-yellow-500"
          nome="Média"
          valor={urgencias.media}
        />
        <LinhaUrgencia
          cor="text-green-600"
          nome="Baixa"
          valor={urgencias.baixa}
        />
      </Box>
    </Card>
  );
}

function LinhaUrgencia({ nome, valor, cor }) {
  return (
    <Card>
      <Typography>{nome}</Typography>
      <Typography>{valor}</Typography>
    </Card>
  );
}

function CardNumero({ titulo, valor }) {
  return (
    <Card>
      <Typography>{titulo}</Typography>
      <Typography>{valor}</Typography>
    </Card>
  );
}
