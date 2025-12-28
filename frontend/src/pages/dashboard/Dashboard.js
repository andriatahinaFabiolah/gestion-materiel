import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory,
  Logout,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate(); 

  const [loading, setLoading] = useState(true);
  const [materiels, setMateriels] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    affectes: 0,
  });

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const loadData = async () => {
      try {
        const resMat = await axios.get(`${API_URL}/materiels`);
        const mats = resMat.data;

        const resAff = await axios.get(`${API_URL}/affectations`);
        const aff = resAff.data;

        const updatedList = mats.map((m) => {
          const isAffected = aff.some((a) => a.idmat == m.idmat);
          return {
            id: m.idmat,
            nom: m.nomMat + " (" + m.marque + ")",
            etat: isAffected ? "Affecté" : "Disponible",
          };
        });

        const total = updatedList.length;
        const disponibles = updatedList.filter((m) => m.etat === "Disponible").length;
        const affectes = updatedList.filter((m) => m.etat === "Affecté").length;

        setMateriels(updatedList);
        setStats({ total, disponibles, affectes });

        setLoading(false);
      } catch (error) {
        console.error("❌ Erreur :", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const chartData = {
    labels: ["Disponibles", "Affectés"],
    datasets: [
      {
        data: [stats.disponibles, stats.affectes],
        backgroundColor: ["#4CAF50", "#1976D2"],
      },
    ],
  };

  if (loading) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <Box display="flex" bgcolor="#f4f6f9" minHeight="100vh">

      {/* CONTENU */}
      <Box flexGrow={1} p={4}>

        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight="bold">Tableau de Bord</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography fontWeight="bold">Admin – Ministère</Typography>
            <Avatar sx={{ bgcolor: "#1976D2" }}>A</Avatar>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* STATISTIQUES */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, background:"linear-gradient(135deg,#3949AB,#1A237E)", color:"white"}}>
              <Typography>Total Matériels</Typography>
              <Typography variant="h3">{stats.total}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
              <Typography>Disponibles</Typography>
              <Typography variant="h3" color="green">{stats.disponibles}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
              <Typography>Affectés</Typography>
              <Typography variant="h3" color="#1976D2">{stats.affectes}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* GRAPH + LISTE */}
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
              <Typography fontWeight="bold" mb={2}>Répartition des Matériels</Typography>
              <Doughnut data={chartData} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" mb={2}>Dernières Affectations</Typography>

              {materiels.map((m) => (
                <Paper key={m.id} sx={{ p: 2, mb: 1.5, display:"flex", justifyContent:"space-between", borderRadius:3 }}>
                  <Typography>{m.nom}</Typography>

                  <Chip
                    label={m.etat}
                    color={m.etat === "Disponible" ? "success" : "primary"}
                    icon={m.etat === "Disponible" ? <CheckCircle /> : <Warning />}
                  />
                </Paper>
              ))}
            </Paper>
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default Dashboard;
