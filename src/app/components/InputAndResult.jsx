"use client";
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { analyzeCanvas } from '../services/geminiService';

const InputAndResult = ({ canvasData }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!canvasData) {
      setError('Please draw something first');
      return;
    }
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await analyzeCanvas(canvasData, prompt);
      setResult(response);
    } catch (err) {
      setError('Error analyzing drawing. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={isLoading}
          sx={{
            minWidth: '120px',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5555, #45B7D1)',
            }
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Analyze'}
        </Button>
      </Box>

      {result && (
        <Card 
          sx={{ 
            mt: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Analysis Result
            </Typography>
            <Typography variant="body1">
              {result}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default InputAndResult; 