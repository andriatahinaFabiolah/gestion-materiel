import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

// MUI
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Stack,
  MenuItem,
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function PorteList() {
  const [portes, setPortes] = useState([]);
  const [directions, setDirections] = useState([]);
  const navigate = useNavigate();

  // Ajout
  const [numero, setNumero] = useState("");
  const [iddir, setIddir] = useState("");

  // Modification
  const [editOpen, setEditOpen] = useState(false);
  const [editPorte, setEditPorte] = useState({
    idport: null,
    numero: "",
    iddir: "",
  });

  // Suppression
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [porteToDelete, setPorteToDelete] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Charger données
  const loadData = () => {
    Promise.all([
      API.get("/portes"),
      API.get("/directions"),
    ])
      .then(([portesRes, dirRes]) => {
        setPortes(portesRes.data);
        setDirections(dirRes.data);
      })
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Erreur de chargement",
          severity: "error",
        })
      );
  };

  useEffect(() => {
    loadData();
  }, []);

  // Ajouter
  const addPorte = () => {
    if (!numero.trim() || !iddir) {
      setSnackbar({
        open: true,
        message: "Tous les champs sont obligatoires",
        severity: "warning",
      });
      return;
    }

    API.post("/portes", { numero, iddir })
      .then(() => {
        setNumero("");
        setIddir("");
        loadData();
        setSnackbar({
          open: true,
          message: "Porte ajoutée avec succès",
          severity: "success",
        });
      })
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Erreur lors de l'ajout",
          severity: "error",
        })
      );
  };

  // Modifier
  const saveEdit = () => {
    API.put(`/portes/${editPorte.idport}`, {
      numero: editPorte.numero,
      iddir: editPorte.iddir,
    })
      .then(() => {
        setEditOpen(false);
        loadData();
        setSnackbar({
          open: true,
          message: "Porte modifiée avec succès",
          severity: "success",
        });
      })
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Erreur lors de la modification",
          severity: "error",
        })
      );
  };

  // Supprimer
  const confirmDelete = () => {
    API.delete(`/portes/${porteToDelete.idport}`)
      .then(() => {
        setDeleteOpen(false);
        loadData();
        setSnackbar({
          open: true,
          message: "Porte supprimée",
          severity: "success",
        });
      })
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Impossible de supprimer (porte utilisée)",
          severity: "error",
        })
      );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestion des portes (bureaux)
      </Typography>
       
        {/* Navigation */}
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/direction")}
        >
          Directions
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/affectations")}
        >
          Affectations
        </Button>
      </Stack>

      {/* Ajout */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Numéro de porte"
            value={numero}
            onChange={e => setNumero(e.target.value)}
            fullWidth
          />

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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addPorte}
          >
            Ajouter
          </Button>
        </Stack>
      </Paper>

      {/* Tableau */}
      <Table component={Paper} elevation={3}>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell><b>Numéro</b></TableCell>
            <TableCell><b>Direction</b></TableCell>
            <TableCell align="center"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {portes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                Aucune porte enregistrée
              </TableCell>
            </TableRow>
          ) : (
            portes.map(p => (
              <TableRow key={p.idport} hover>
                <TableCell>{p.numero}</TableCell>
                <TableCell>{p.nomdir}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditPorte(p);
                      setEditOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setPorteToDelete(p);
                      setDeleteOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog modification */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Modifier la porte</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Numéro de porte"
              value={editPorte.numero}
              onChange={e =>
                setEditPorte({ ...editPorte, numero: e.target.value })
              }
              fullWidth
            />
            <TextField
              select
              label="Direction"
              value={editPorte.iddir}
              onChange={e =>
                setEditPorte({ ...editPorte, iddir: e.target.value })
              }
              fullWidth
            >
              {directions.map(d => (
                <MenuItem key={d.iddir} value={d.iddir}>
                  {d.nomdir}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={saveEdit}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog suppression */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Supprimer la porte :
          </Typography>
          <Typography fontWeight="bold" color="error">
            {porteToDelete?.numero}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Annuler</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default PorteList;
