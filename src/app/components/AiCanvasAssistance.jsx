"use client";
import React from 'react';
import { 
  Box, 
  Container, 
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import DrawingCanvas from './DrawingCanvas';
import InputAndResult from './InputAndResult';

const AiCanvasAssistance = () => {
  const theme = useTheme();
  const [canvasData, setCanvasData] = React.useState(null);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, 
              ${alpha('#0A1929', 0.97)} 0%, 
              ${alpha('#1A2027', 0.97)} 100%)`
          : `linear-gradient(135deg, 
              ${alpha('#F8FAFF', 0.97)} 0%, 
              ${alpha('#EEF2FF', 0.97)} 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, ${alpha('#4ECDC4', 0.15)} 0%, transparent 25%),
            radial-gradient(circle at 80% 80%, ${alpha('#FF6B6B', 0.15)} 0%, transparent 25%),
            radial-gradient(circle at 50% 50%, ${alpha('#9B59B6', 0.1)} 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              align="center"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AI Canvas Assistant
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              sx={{ mb: 8 }}
            >
              Draw anything and let AI analyze it for you
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ width: '100%' }}
          >
            <Box
              sx={{
                background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                p: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <DrawingCanvas onDrawingChange={setCanvasData} />
              <InputAndResult canvasData={canvasData} />
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default AiCanvasAssistance; 