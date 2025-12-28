import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function DirectionList() {
  const [directions, setDirections] = useState([]);
  const [nomdir, setNomdir] = useState("");

  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [editDirection, setEditDirection] = useState({ iddir: null, nomdir: "" });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dirToDelete, setDirToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const loadData = () => {
    API.get("/directions").then(res => setDirections(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addDirection = () => {
    if (!nomdir.trim()) return;
    API.post("/directions", { nomdir }).then(() => {
      setNomdir("");
      loadData();
      setSnackbar({ open: true, message: "Direction ajoutée", severity: "success" });
    });
  };

  const saveEdit = () => {
    API.put(`/directions/${editDirection.iddir}`, { nomdir: editDirection.nomdir })
      .then(() => {
        setEditOpen(false);
        loadData();
        setSnackbar({ open: true, message: "Direction modifiée", severity: "success" });
      });
  };

  const confirmDelete = () => {
    API.delete(`/directions/${dirToDelete.iddir}`)
      .then(() => {
        setDeleteOpen(false);
        loadData();
        setSnackbar({ open: true, message: "Direction supprimée", severity: "success" });
      });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestion des directions
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button
         variant="outlined"
         onClick={() => navigate("/portes")}
        >
         ⬅ Retour vers Portes
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Nom de la direction"
            value={nomdir}
            onChange={e => setNomdir(e.target.value)}
            fullWidth
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={addDirection}>
            Ajouter
          </Button>
        </Stack>
      </Paper>

      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell><b>Direction</b></TableCell>
            <TableCell align="center"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {directions.map(d => (
            <TableRow key={d.iddir}>
              <TableCell>{d.nomdir}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => { setEditDirection(d); setEditOpen(true); }}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => { setDirToDelete(d); setDeleteOpen(true); }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog modification */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Modifier la direction</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom de la direction"
            value={editDirection.nomdir}
            onChange={e =>
            setEditDirection({ ...editDirection, nomdir: e.target.value })
            }
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>
            Annuler
          </Button>
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
            Voulez-vous vraiment supprimer la direction :
          </Typography>
          <Typography fontWeight="bold" color="error">
            {dirToDelete?.nomdir}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

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

export default DirectionList;
