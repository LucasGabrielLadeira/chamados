import React, { useEffect, useState } from "react";
import api from "../../Auth/axios";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
  Label,
  PolarAngleAxis,
  CartesianGrid,
  LabelList,
  Cell
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, Typography, Card } from "@mui/material";
import styles from "./Dashboard.module.css";
import {
  faHourglass,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
import { usePresentation } from "../../../context/PresentationContext";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const { presentationMode, enterPresentation, exitPresentation } =
    usePresentation();

  useEffect(() => {
    api
      .get(`${import.meta.env.VITE_API_URL}/chamados/dashboard/resumo`)
      .then((res) => {
        console.log(res.data);
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <p className={styles["dashboard_title"]}>Dashboard</p>
          <Typography className={styles["dashboard_subtitle"]}>
            Visão geral dos chamados e atividades
          </Typography>
        </Box>
        <button
          onClick={presentationMode ? exitPresentation : enterPresentation}
          className={styles["dashboard_presentation_button"]}
        >
          <FontAwesomeIcon icon={presentationMode ? faCompress : faExpand} />
          {presentationMode ? "Sair da apresentação" : "Modo apresentação"}
        </button>
      </Box>

      {/* Linha superior – SLAs + urgências */}
      <Box className={styles["dashboard_topline"]}>
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
      <Box className={styles["dashboard_summary"]}>
        <p className={styles["dashboard_summary_title"]}>Resumo dos Chamados</p>

        <Box className={styles["dashboard_summary_cards"]}>
          <CardNumero titulo="Atribuídos a mim" valor={data.resumo.atribuido} />
          <CardNumero titulo="Pendentes" valor={data.resumo.pendentes} />
          <CardNumero titulo="Concluídos" valor={data.resumo.concluidos} />
        </Box>
      </Box>

      {/* Carga de Trabalho */}
      <Box className={styles["dashboard_cargaTrabalho"]}>
        <p className={styles["dashboard_cargaTrabalho_title"]}>
          Carga de Trabalho
        </p>

        <Card className={styles["dashboard_cargaTrabalho_card"]}>
          <Typography className={styles["dashboard_cargaTrabalho_cardtitle"]}>
            Chamados por Técnico
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.cargaTrabalho}
              margin={{ top: 30, right: 20, left: 20, bottom: 20 }}
              barCategoryGap={40}
              barGap={8}
            >
              <CartesianGrid vertical={false} horizontal={false} />

              <YAxis hide />
              <XAxis
                dataKey="tecnico"
                axisLine={false}
                tickLine={false}
                interval={0}
              />

              <Bar dataKey="quantidade" barSize={40} radius={[6, 6, 0, 0]}>
                {data.cargaTrabalho.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={item.is_me ? "#34d399" : "#60a5fa"}
                    // verde para você, azul para os demais
                  />
                ))}

                <LabelList
                  dataKey="quantidade"
                  position="top"
                  fill="#374151"
                  fontSize={13}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </Box>
  );
}

/* COMPONENTES */

function CardSLA({ titulo, valor, meta, cor }) {
  const grafico = [{ name: titulo, value: valor, fill: cor }];

  return (
    <Card className={styles["dashboard_cardSla"]}>
      <Typography className={styles["dashboard_cardSla_title"]}>
        <FontAwesomeIcon icon={faHourglass} />
        {titulo}
      </Typography>

      <Box className={styles["dashboard_cardSla_content"]}>
        <Box width={140} height={140}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={grafico}
              innerRadius="70%"
              outerRadius="100%"
              startAngle={90}
              endAngle={450}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={20}
                clockWise
                fill="#3b82f6"
              >
                <Label
                  value={`${valor}%`}
                  position="center"
                  fill="#111827"
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                />
              </RadialBar>
            </RadialBarChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <Typography sx={{ fontWeight: "600" }}>Meta: {meta}%</Typography>

          {valor >= meta ? (
            <Typography color="success.main">
              Desempenho dentro do prazo.
            </Typography>
          ) : (
            <Typography color="error.main">
              Desempenho abaixo do esperado.
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
}

function CardUrgencias({ urgencias }) {
  return (
    <Card className={styles["dashboard_cardUrgencias"]}>
      <Typography sx={{ fontWeight: "bold" }}>Chamados por Urgência</Typography>

      <Box>
        {Object.entries(urgencias).map(([nome, item]) => (
          <LinhaUrgencia
            key={nome}
            nome={nome}
            valor={item.quantidade}
            cor={item.cor}
          />
        ))}
      </Box>
    </Card>
  );
}

function LinhaUrgencia({ nome, valor, cor }) {
  return (
    <Box className={styles["dashboard_linhaUrgencia"]}>
      <Typography color={cor}>{nome}</Typography>
      <Typography>{valor}</Typography>
    </Box>
  );
}

function CardNumero({ titulo, valor }) {
  return (
    <Card className={styles["dashboard_cardNumero"]}>
      <p className={styles["dashboard_cardNumero_title"]}>{titulo}</p>
      <p className={styles["dashboard_cardNumero_summary"]}>{valor}</p>
    </Card>
  );
}
