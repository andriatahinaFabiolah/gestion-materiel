import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function AuthLayout({ children, title }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f4f6f9"
    >
      <Paper elevation={6} sx={{ p: 5, borderRadius: 3, width: 400 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          {title} - SGMI MT
        </Typography>
        {children}
      </Paper>
    </Box>
  );
}
