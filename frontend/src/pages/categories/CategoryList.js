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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function CategoryList() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [nomcat, setNomcat] = useState("");

  // 🔔 Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Modification
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState({
    idcat: null,
    nomcat: "",
  });

  // Suppression
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Charger données
  const loadData = () => {
    API.get("/categories")
      .then(res => setCategories(res.data))
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Erreur de chargement",
          severity: "error",
        });
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Ajouter
  const addCategory = () => {
    if (!nomcat.trim()) {
      setSnackbar({
        open: true,
        message: "Le nom de la catégorie est obligatoire",
        severity: "warning",
      });
      return;
    }

    API.post("/categories", { nomcat })
      .then(() => {
        setNomcat("");
        loadData();
        setSnackbar({
          open: true,
          message: "Catégorie ajoutée avec succès",
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Erreur lors de l'ajout",
          severity: "error",
        });
      });
  };

  // Ouvrir dialog modification
  const openEdit = cat => {
    setEditCategory(cat);
    setEditOpen(true);
  };

  // Sauvegarder modification
  const saveEdit = () => {
    API.put(`/categories/${editCategory.idcat}`, {
      nomcat: editCategory.nomcat,
    })
      .then(() => {
        setEditOpen(false);
        loadData();
        setSnackbar({
          open: true,
          message: "Catégorie modifiée avec succès",
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Erreur lors de la modification",
          severity: "error",
        });
      });
  };

  // Ouvrir dialog suppression
  const openDelete = cat => {
    setCategoryToDelete(cat);
    setDeleteOpen(true);
  };

  // Confirmer suppression
  const confirmDelete = () => {
    API.delete(`/categories/${categoryToDelete.idcat}`)
      .then(() => {
        setDeleteOpen(false);
        loadData();
        setSnackbar({
          open: true,
          message: "Catégorie supprimée",
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Impossible de supprimer (catégorie utilisée)",
          severity: "error",
        });
      });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestion des catégories
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/materiels")}
        >
          Retour aux matériels
        </Button>
      </Stack>

      {/* Ajout */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Nom de la catégorie"
            value={nomcat}
            onChange={e => setNomcat(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addCategory}
          >
            Ajouter
          </Button>
        </Stack>
      </Paper>

      {/* Tableau */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Nom</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  Aucune catégorie enregistrée
                </TableCell>
              </TableRow>
            ) : (
              categories.map(c => (
                <TableRow key={c.idcat} hover>
                  <TableCell>{c.nomcat}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => openEdit(c)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => openDelete(c)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog modification */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Modifier catégorie</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom de la catégorie"
            value={editCategory.nomcat}
            onChange={e =>
              setEditCategory({ ...editCategory, nomcat: e.target.value })
            }
            fullWidth
            sx={{ mt: 1 }}
          />
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
            Voulez-vous vraiment supprimer la catégorie :
          </Typography>
          <Typography fontWeight="bold" color="error">
            {categoryToDelete?.nomcat}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
          >
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

export default CategoryList;
