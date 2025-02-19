"use client";
import React from 'react';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      {children}
    </Box>
  );
};

export default Layout; 