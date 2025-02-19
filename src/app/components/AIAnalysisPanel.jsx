import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const AIAnalysisPanel = ({ onAnalyze, isLoading, error, aiResponse }) => {
  const [prompt, setPrompt] = useState('');

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '300px',
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: theme => theme.palette.mode === 'dark' ? '#333' : '#fff',
        transition: 'all 0.3s ease',
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        AI Analysis
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        placeholder="Describe what you'd like the AI to analyze..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => onAnalyze(prompt)}
        disabled={isLoading || !prompt.trim()}
        startIcon={isLoading ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
        sx={{ mb: 2 }}
      >
        {isLoading ? 'Analyzing...' : 'Analyze with AI'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {aiResponse && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            AI Response:
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
            {aiResponse}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AIAnalysisPanel; 