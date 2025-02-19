"use client";
import React from 'react';
import { Box } from '@mui/material';
import { Canvas } from '../components';

const CanvasPage = () => {
  return (
    <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Canvas />
    </Box>
  );
};

export default CanvasPage; 