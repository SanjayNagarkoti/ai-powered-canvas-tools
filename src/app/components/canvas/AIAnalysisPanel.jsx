"use client";
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';

const AIAnalysisPanel = ({ onAnalyze, isLoading, error, aiResponse }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim()) {
      onAnalyze(prompt);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '300px',
        p: 2,
        borderRadius: '12px',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Ask AI about your drawing"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          multiline
          rows={2}
          sx={{ mb: 1 }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Analyze'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {aiResponse && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {aiResponse}
        </Typography>
      )}
    </Paper>
  );
};

export default AIAnalysisPanel; 