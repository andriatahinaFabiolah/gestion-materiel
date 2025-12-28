import React, { useState } from "react";
import { TextField, Button, Stack, Snackbar, Alert } from "@mui/material";
import AuthLayout from "../../components/AuthLayout";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { nom, prenom, email, password });

      setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setError("");
      setOpen(true);

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      setSuccess("");
      setOpen(true);
    }
  };

  return (
    <AuthLayout title="Inscription">

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} 
      >
        {success ? (
          <Alert onClose={handleClose} severity="success" variant="filled">
            {success}
          </Alert>
        ) : error ? (
          <Alert onClose={handleClose} severity="error" variant="filled">
            {error}
          </Alert>
        ) : null}
      </Snackbar>

      <Stack spacing={2} mt={2}>
        <TextField label="Nom" value={nom} onChange={e => setNom(e.target.value)} fullWidth />
        <TextField label="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} fullWidth />
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
        <TextField label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />

        <Button variant="contained" onClick={handleRegister} fullWidth>
          S'inscrire
        </Button>

        <Button variant="text" onClick={() => navigate("/login")} fullWidth>
          Déjà un compte ? Se connecter
        </Button>
      </Stack>
    </AuthLayout>
  );
}
