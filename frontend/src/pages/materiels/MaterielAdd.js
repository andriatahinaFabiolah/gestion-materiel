import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

// MUI
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function MaterielAdd() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomMat: "",
    marque: "",
    etat: "neuf",
    idcat: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    API.get("/categories").then(res => setCategories(res.data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    API.post("/materiels", form)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Matériel ajouté avec succès",
          severity: "success",
        });

        setTimeout(() => navigate("/materiels"), 1500);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Erreur lors de l'ajout",
          severity: "error",
        });
      });
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper elevation={4} sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" gutterBottom>
          Ajouter un matériel
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nom du matériel"
              name="nomMat"
              value={form.nomMat}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Marque"
              name="marque"
              value={form.marque}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              select
              label="État"
              name="etat"
              value={form.etat}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="neuf">Neuf</MenuItem>
              <MenuItem value="occasion">Occasion</MenuItem>
              <MenuItem value="en réparation">En réparation</MenuItem>
              <MenuItem value="en maintenance">En maintenance</MenuItem>
            </TextField>

            <TextField
              select
              label="Catégorie"
              name="idcat"
              value={form.idcat}
              onChange={handleChange}
              required
              fullWidth
            >
              {categories.map(c => (
                <MenuItem key={c.idcat} value={c.idcat}>
                  {c.nomcat}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/materiels")}
              >
                Retour
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Enregistrer
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* 🔔 Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MaterielAdd;
