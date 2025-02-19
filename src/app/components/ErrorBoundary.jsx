"use client";
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ErrorBoundary = ({ error, reset }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Something went wrong!
      </Typography>
      <Button variant="contained" onClick={reset}>
        Try again
      </Button>
    </Box>
  );
};

export default ErrorBoundary; 