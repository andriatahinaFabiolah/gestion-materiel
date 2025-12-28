import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

// MUI
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

function AffectationList() {
  const [affectations, setAffectations] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Dialog désaffectation
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAffectation, setSelectedAffectation] = useState(null);

  // Charger les affectations
  const loadAffectations = () => {
    API.get("/affectations")
      .then((res) => setAffectations(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadAffectations();
  }, []);

  // Ouvrir le dialog
  const openDesaffectationDialog = (affectation) => {
    setSelectedAffectation(affectation);
    setOpenDialog(true);
  };

  // Confirmer la désaffectation
  const confirmDesaffecter = () => {
    if (!selectedAffectation) return;

    API.put(`/affectations/desaffecter/${selectedAffectation.idaff}`)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Matériel désaffecté avec succès",
          severity: "success",
        });
        loadAffectations();
        setOpenDialog(false);
      })
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Erreur lors de la désaffectation",
          severity: "error",
        })
      );
  };

  return (
    <Box p={3}>
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestion des affectations</Typography>

        <Stack direction="row" spacing={2}>
          <Button component={Link} to="/materiels" variant="outlined">
            Matériels
          </Button>

          <Button component={Link} to="/portes" variant="outlined">
            Portes
          </Button>

          <Button component={Link} to="/affectations/add" variant="contained">
            Nouvelle affectation
          </Button>
        </Stack>
      </Box>

      {/* Tableau */}
      <Paper elevation={4} sx={{ p: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Matériel</b></TableCell>
              <TableCell><b>Marque</b></TableCell>
              <TableCell><b>Direction</b></TableCell>
              <TableCell><b>Porte / Bureau</b></TableCell>
              <TableCell align="center"><b>État</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {affectations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucune affectation enregistrée
                </TableCell>
              </TableRow>
            ) : (
              affectations.map((a) => (
                <TableRow key={a.idaff} hover>
                  <TableCell>
                    {new Date(a.dateAff).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell>{a.nomMat}</TableCell>
                  <TableCell>{a.marque}</TableCell>
                  <TableCell>{a.nomdir}</TableCell>

                  <TableCell>
                    Bureau / Porte <b>{a.porte}</b>
                  </TableCell>

                  <TableCell align="center">
                    <Chip label="Affecté" color="success" size="small" variant="outlined" />
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      color="error"
                      size="small"
                      variant="outlined"
                      onClick={() => openDesaffectationDialog(a)}
                    >
                      Désaffecter
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog Désaffectation */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmer la désaffectation</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment désaffecter le matériel <b>{selectedAffectation?.nomMat}</b>  
            affecté au <b>bureau / porte {selectedAffectation?.porte}</b> ?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button color="error" variant="contained" onClick={confirmDesaffecter}>
            Désaffecter
          </Button>
        </DialogActions>
      </Dialog>

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

export default AffectationList;
