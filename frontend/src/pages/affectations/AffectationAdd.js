import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import API from "../../services/api";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

function AffectationAdd() {
  const navigate = useNavigate(); 

  const [materiels, setMateriels] = useState([]);
  const [directions, setDirections] = useState([]);
  const [portes, setPortes] = useState([]);

  const [idmat, setIdmat] = useState("");
  const [iddir, setIddir] = useState("");
  const [idport, setIdport] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    API.get("/materiels/disponibles").then(res => {
  console.log("DATA :", res.data);
  setMateriels(res.data);
});

    API.get("/directions").then(res => setDirections(res.data));
  }, []);

  // charger portes selon direction
  useEffect(() => {
    if (iddir) {
      API.get(`/portes/direction/${iddir}`).then(res => setPortes(res.data));
    }
  }, [iddir]);

  const affecter = () => {
    if (!idmat || !idport) {
      setSnackbar({
        open: true,
        message: "Tous les champs sont obligatoires",
        severity: "warning",
      });
      return;
    }

    API.post("/affectations", { idmat, idport })
      .then(() => {
        setSnackbar({
          open: true,
          message: "Matériel affecté avec succès",
          severity: "success",
        });

        // 🔹 Redirection après 1 seconde
        setTimeout(() => {
          navigate("/affectations");
        }, 1000);
      })
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Erreur lors de l'affectation",
          severity: "error",
        })
      );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Affecter un matériel
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            select
            label="Matériel"
            value={idmat}
            onChange={e => setIdmat(e.target.value)}
            fullWidth
          >
            {materiels.map(m => (
              <MenuItem key={m.idmat} value={m.idmat}>
                {m.nomMat} - {m.marque}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Direction"
            value={iddir}
            onChange={e => setIddir(e.target.value)}
            fullWidth
          >
            {directions.map(d => (
              <MenuItem key={d.iddir} value={d.iddir}>
                {d.nomdir}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Porte"
            value={idport}
            onChange={e => setIdport(e.target.value)}
            fullWidth
            disabled={!iddir}
          >
            {portes.map(p => (
              <MenuItem key={p.idport} value={p.idport}>
                Porte {p.numero}
              </MenuItem>
            ))}
          </TextField>

          {/* Boutons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              component={Link}
              to="/affectations"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
            >
              Retour
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={affecter}
            >
              Affecter
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AffectationAdd;
