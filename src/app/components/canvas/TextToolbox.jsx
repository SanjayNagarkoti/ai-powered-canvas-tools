import React from 'react';
import { Box, IconButton, Typography, ToggleButton, ToggleButtonGroup, Paper, Tooltip } from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

const TextToolbox = ({ color, setColor, fontSize, setFontSize, alignment, setAlignment, fontStyle, setFontStyle }) => {
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  const fontSizes = ['S', 'M', 'L', 'XL'];
  const fontStyles = [
    { style: 'Comic Sans MS', preview: 'Aa', displayName: 'Comic Sans' },
    { style: 'Arial', preview: 'Aa', displayName: 'Arial' },
    { style: 'Times New Roman', preview: 'Aa', displayName: 'Times New Roman' },
    { style: 'Verdana', preview: 'Aa', displayName: 'Verdana' },
    { style: 'Courier New', preview: 'Aa', displayName: 'Courier' }
  ];

  return (
    <Paper
      elevation={3}
      className="text-toolbox"
      sx={{
        position: 'fixed',
        right: '20px',
        top: '80px',
        width: '200px',
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: theme => theme.palette.mode === 'dark' ? '#333' : '#fff',
        transition: 'all 0.3s ease',
        zIndex: 1000,
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>Colors</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
        {colors.map((c) => (
          <IconButton
            key={c}
            onClick={() => setColor(c)}
            sx={{
              bgcolor: c,
              width: 20,
              height: 20,
              border: color === c ? '2px solid #000' : 'none',
              minWidth: 'auto',
              p: 0
            }}
          />
        ))}
      </Box>

      <Typography variant="body2" sx={{ mb: 1 }}>Font Size</Typography>
      <ToggleButtonGroup
        value={fontSize}
        exclusive
        onChange={(e, newSize) => newSize && setFontSize(newSize)}
        sx={{ 
          mb: 1,
          display: 'flex',
          '& .MuiToggleButton-root': {
            flex: 1,
            p: 0.5
          }
        }}
      >
        {fontSizes.map((size, index) => (
          <ToggleButton key={size} value={index * 10 + 10}>
            {size}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Typography variant="body2" sx={{ mb: 1 }}>Font Style</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {fontStyles.map(({ style, preview, displayName }) => (
          <Tooltip 
            key={style} 
            title={displayName}
            placement="left"
            arrow
          >
            <Box
              onClick={() => setFontStyle(style)}
              sx={{
                p: 1,
                border: fontStyle === style ? '2px solid #1976d2' : '1px solid #ccc',
                borderRadius: 1,
                cursor: 'pointer',
                fontFamily: style,
                fontSize: '24px',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              {preview}
            </Box>
          </Tooltip>
        ))}
      </Box>

      <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Alignment</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <IconButton onClick={() => setAlignment('left')} color={alignment === 'left' ? 'primary' : 'default'}>
          <FormatAlignLeftIcon />
        </IconButton>
        <IconButton onClick={() => setAlignment('center')} color={alignment === 'center' ? 'primary' : 'default'}>
          <FormatAlignCenterIcon />
        </IconButton>
        <IconButton onClick={() => setAlignment('right')} color={alignment === 'right' ? 'primary' : 'default'}>
          <FormatAlignRightIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default TextToolbox;