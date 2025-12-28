import React, { useState } from "react";
import { TextField, Button, Stack, Alert, Snackbar } from "@mui/material";
import AuthLayout from "../../components/AuthLayout";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token); 
      setSuccess(true); 
      setError("");

      // Rediriger après 1,5s
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
      setSuccess(false);
    }
  };

  return (
    <AuthLayout title="Connexion">
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={handleLogin} fullWidth>
          Se connecter
        </Button>

        <Button
          variant="text"
          onClick={() => navigate("/register")}
          fullWidth
        >
          Pas encore de compte ? S'inscrire
        </Button>

        {/* Snackbar succès */}
        <Snackbar
          open={success}
          autoHideDuration={1500}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success" variant="filled">
            Connexion réussie ! Redirection en cours...
          </Alert>
        </Snackbar>
      </Stack>
    </AuthLayout>
  );
}
