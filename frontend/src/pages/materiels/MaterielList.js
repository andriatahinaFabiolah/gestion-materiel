import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

// MUI
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  Chip,
  TablePagination,
  Tooltip,
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

function MaterielList() {
  const [materiels, setMateriels] = useState([]);
  const [search, setSearch] = useState("");
  const [etatFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Dialog suppression
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [materielToDelete, setMaterielToDelete] = useState(null);

  // Charger matériels
  const loadData = () => {
    API.get("/materiels")
      .then(res => setMateriels(res.data))
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Erreur de chargement des matériels",
          severity: "error",
        });
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Suppression
  const openDelete = materiel => {
    setMaterielToDelete(materiel);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    API.delete(`/materiels/${materielToDelete.idmat}`)
      .then(() => {
        setDeleteOpen(false);
        loadData();
        setSnackbar({
          open: true,
          message: "Matériel supprimé avec succès",
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Impossible de supprimer le matériel",
          severity: "error",
        });
      });
  };

  // État matériel
  const getEtatChip = etat => {
    switch (etat) {
      case "Neuf":
        return <Chip label="Neuf" color="success" size="small" />;
      case "Maintenance":
        return <Chip label="Maintenance" color="warning" size="small" />;
      case "Hors service":
        return <Chip label="Hors service" color="error" size="small" />;
      default:
        return <Chip label={etat} size="small" />;
    }
  };

  // Statut Affectation
  const getStatutChip = isAffecte => {
    return isAffecte ? (
      <Chip label="Affecté" color="error" size="small" />
    ) : (
      <Chip label="Disponible" color="success" size="small" />
    );
  };

  // Filtrage
  const filteredMateriels = materiels
    .filter(m =>
      m.nomMat.toLowerCase().includes(search.toLowerCase())
    )
    .filter(m => (etatFilter ? m.etat === etatFilter : true));

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestion des matériels
      </Typography>

      {/* Actions */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/materiels/add")}
        >
          Ajouter un matériel
        </Button>

        <Button
          variant="outlined"
          startIcon={<CategoryIcon />}
          onClick={() => navigate("/categories")}
        >
          Catégories
        </Button>

        <Button
          variant="outlined"
          startIcon={<AssignmentTurnedInIcon />}
          onClick={() => navigate("/affectations")}
        >
          Affectations
        </Button>
      </Stack>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Rechercher par nom"
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth
          />
        </Stack>
      </Paper>

      {/* Tableau */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Nom</b></TableCell>
              <TableCell><b>Marque</b></TableCell>
              <TableCell><b>État</b></TableCell>
              <TableCell><b>Statut</b></TableCell>
              <TableCell><b>Catégorie</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredMateriels
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(m => (
                <TableRow key={m.idmat} hover>
                  <TableCell>{m.nomMat}</TableCell>
                  <TableCell>{m.marque}</TableCell>
                  <TableCell>{getEtatChip(m.etat)}</TableCell>
                  <TableCell>{getStatutChip(m.isAffecte)}</TableCell>
                  <TableCell>{m.nomcat}</TableCell>

                  <TableCell align="center">
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(`/materiels/edit/${m.idmat}`)
                      }
                    >
                      <EditIcon />
                    </Button>

                    <Tooltip title={
                      m.isAffecte
                        ? "Impossible de supprimer : matériel affecté"
                        : "Supprimer"
                    }>
                      <span>
                        <Button
                          size="small"
                          color="error"
                          disabled={m.isAffecte}
                          onClick={() => openDelete(m)}
                        >
                          <DeleteIcon />
                        </Button>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredMateriels.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Dialog suppression */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <Typography>Supprimer le matériel :</Typography>
          <Typography color="error" fontWeight="bold">
            {materielToDelete?.nomMat}
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
        onClose={() =>
          setSnackbar({ ...snackbar, open: false })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MaterielList;
