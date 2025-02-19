"use client";
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Tooltip,
  Container,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { analyzeCanvas } from '../../services/geminiService';
import { motion } from 'framer-motion';

const InputAndResult = ({ canvasData, onResultGenerated, onResultUpdate }) => {
  const theme = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!canvasData) {
      setError('Please draw something first');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    // Enhance the prompt to get better structured responses
    const enhancedPrompt = `Analyze this drawing based on the user's prompt. Keep your response clean and properly formatted like this:

    **Main Analysis:**
    Provide a clear and direct answer to the user's question. Format mathematical expressions properly.
    - If using equations, write them clearly
    - Use proper spacing and formatting
    - Make sure all expressions are complete
    - Make sure the response is complete sentences
    - Make sure the response is grammatically correct
    - Make sure the response is easy to understand

    **Conclusion:**
    A brief, clear summary of the analysis with:
    - The final answer in **bold**
    - All mathematical expressions properly closed
    - Make sure the response is complete sentences
    - Make sure the response is grammatically correct
    - Make sure the response is easy to understand

    Keep everything properly formatted and easy to read.

    User's prompt: ${prompt}`;

    setIsLoading(true);
    setError('');
    try {
      const currentCanvasData = canvasData;
      const response = await analyzeCanvas(currentCanvasData, enhancedPrompt);
      onResultUpdate?.(response);
      onResultGenerated?.();
    } catch (err) {
      setError('Error analyzing drawing. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="div"
      sx={{
        position: 'fixed',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: { xs: '16px', md: '24px' },
        background: 'none',
        pointerEvents: 'none',
        width: 'auto',
        maxWidth: '90vw',
      }}
    >
      <Box
        sx={{ 
          pointerEvents: 'auto',
          width: 'fit-content',
          minWidth: { xs: '90vw', sm: '500px', md: '600px' },
          maxWidth: { xs: '90vw', sm: '600px', md: '680px' },
        }}
      >
        <Paper
          elevation={0}
          component={motion.div}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '2px solid',
            borderColor: 'rgba(78, 205, 196, 0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            width: '100%',
            transform: 'translateZ(0)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            willChange: 'transform',
            '&:hover': {
              transform: 'translateY(-4px) translateZ(0)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              padding: '2px',
              background: 'linear-gradient(45deg, #FF6B6B20, #4ECDC420)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            },
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(78, 205, 196, 0.3)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(78, 205, 196, 0.5)',
              },
            },
            maxHeight: 'auto',
            overflowY: 'visible',
          }}
        >
          <Box sx={{ mb: 0 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              mb: 2
            }}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -1,
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    borderRadius: '8px',
                    animation: 'rotate 4s linear infinite',
                    '@keyframes rotate': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  },
                }}
              >
                <AutoAwesomeIcon 
                  sx={{ 
                    fontSize: '20px',
                    color: '#fff',
                    background: '#000',
                    p: 0.8,
                    borderRadius: '6px',
                    position: 'relative',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.8 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.8 },
                    },
                  }} 
                />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ask AI About Your Drawing
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center'
            }}>
              <TextField
                fullWidth
                placeholder="Type your question here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                error={!!error}
                helperText={error}
                variant="outlined"
                size="medium"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover, &.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.1)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4ECDC4',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={isLoading}
                endIcon={!isLoading && <SendRoundedIcon />}
                sx={{
                  height: '48px',
                  px: 3,
                  borderRadius: '12px',
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  textTransform: 'none',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5555, #45B7D1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transform: 'translateX(-100%)',
                  },
                  '&:hover::after': {
                    transform: 'translateX(100%)',
                    transition: 'transform 0.6s ease',
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Ask AI'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default InputAndResult;