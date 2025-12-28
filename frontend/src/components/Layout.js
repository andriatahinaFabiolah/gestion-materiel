import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory,
  Logout,
  CheckCircle,
  Apartment,
  MeetingRoom
} from "@mui/icons-material";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const isActive = (path) => location.pathname === path;

  const activeStyle = {
    backgroundColor: "#3949AB",
    padding: "10px",
    borderRadius: "8px"
  };

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setOpenLogoutDialog(false);
    navigate("/login");
  };

  return (
    <Box display="flex" bgcolor="#f4f6f9" minHeight="100vh">

      {/* SIDEBAR */}
      <Box
        width="260px"
        bgcolor="#1A237E"
        color="white"
        p={3}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" mb={4}>
            SGMI – MT
          </Typography>

          {/* DASHBOARD */}
          <SidebarItem
            icon={<DashboardIcon />}
            label="Tableau de Bord"
            active={isActive("/")}
            onClick={() => navigate("/")}
            activeStyle={activeStyle}
          />

          {/* MATERIELS */}
          <SidebarItem
            icon={<Inventory />}
            label="Matériels"
            active={isActive("/materiels")}
            onClick={() => navigate("/materiels")}
            activeStyle={activeStyle}
          />

          {/* AFFECTATIONS */}
          <SidebarItem
            icon={<CheckCircle />}
            label="Affectations"
            active={isActive("/affectations")}
            onClick={() => navigate("/affectations")}
            activeStyle={activeStyle}
          />

          {/* DIRECTIONS */}
          <SidebarItem
            icon={<Apartment />}
            label="Directions"
            active={isActive("/direction")}
            onClick={() => navigate("/direction")}
            activeStyle={activeStyle}
          />

          {/* PORTES */}
          <SidebarItem
            icon={<MeetingRoom />}
            label="Portes"
            active={isActive("/portes")}
            onClick={() => navigate("/portes")}
            activeStyle={activeStyle}
          />
        </Box>

        {/* LOGOUT */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
          onClick={handleLogout}
        >
          <Logout />
          <Typography>Déconnexion</Typography>
        </Box>
      </Box>

      {/* CONTENU */}
      <Box flexGrow={1} p={4}>
        <Outlet />
      </Box>

      {/* CONFIRMATION LOGOUT */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment vous déconnecter ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Annuler</Button>
          <Button color="error" variant="contained" onClick={confirmLogout}>
            Se déconnecter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* Composant Sidebar réutilisable */
function SidebarItem({ icon, label, onClick, active, activeStyle }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      mb={3}
      sx={{ cursor: "pointer" }}
      onClick={onClick}
      style={active ? activeStyle : {}}
    >
      {icon}
      <Typography>{label}</Typography>
    </Box>
  );
}
