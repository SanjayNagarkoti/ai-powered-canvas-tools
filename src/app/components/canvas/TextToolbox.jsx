"use client";
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup, 
  Paper, 
  Tooltip,
  IconButton,
  alpha,
} from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    border: 'none',
    borderRadius: '12px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    color: theme.palette.text.secondary,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-selected': {
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
      color: theme.palette.primary.main,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
      '&:hover': {
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.3)} 0%, ${alpha(theme.palette.secondary.main, 0.3)} 100%)`,
      },
    },
  },
}));

const TextToolbox = ({ color, setColor, fontSize, setFontSize, alignment, setAlignment, fontStyle, setFontStyle }) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: 100 });

  const fontSizes = ['S', 'M', 'L', 'XL'];
  const fontSizeValues = [16, 24, 32, 48];
  
  const fontStyles = [
    { style: 'Arial', displayName: 'Modern' },
    { style: 'Times New Roman', displayName: 'Classic' },
    { style: 'Comic Sans MS', displayName: 'Creative' },
    { style: 'Courier New', displayName: 'Code' },
  ];

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{
        top: 90,
        left: 0,
        right: window.innerWidth - 320,
        bottom: window.innerHeight - 400,
      }}
      initial={{ x: position.x, y: position.y }}
      style={{
        position: 'fixed',
        zIndex: 1200,
      }}
      onDragEnd={(_, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '300px',
          p: 3,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 100% 0%, ${alpha('#4ECDC4', 0.15)} 0%, transparent 25%),
              radial-gradient(circle at 0% 100%, ${alpha('#FF6B6B', 0.15)} 0%, transparent 25%)
            `,
            pointerEvents: 'none',
          },
        }}
      >
        {/* Drag Handle */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 3,
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            }
          }}
        >
          <DragIndicatorIcon 
            sx={{ 
              color: 'text.secondary',
              cursor: 'grab',
              '&:active': {
                cursor: 'grabbing',
              }
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Text Properties
          </Typography>
        </Box>

        {/* Rest of your existing content */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 500 }}>
            Font Size
          </Typography>
          <StyledToggleButtonGroup
            value={fontSize}
            exclusive
            onChange={(e, newSize) => newSize && setFontSize(newSize)}
            fullWidth
            size="large"
          >
            {fontSizes.map((size, index) => (
              <ToggleButton 
                key={size} 
                value={fontSizeValues[index]}
                sx={{ fontSize: '0.9rem' }}
              >
                {size}
              </ToggleButton>
            ))}
          </StyledToggleButtonGroup>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 500 }}>
            Font Style
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
            {fontStyles.map(({ style, displayName }) => (
              <Tooltip key={style} title={style} placement="top" arrow>
                <Paper
                  onClick={() => setFontStyle(style)}
                  elevation={0}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontFamily: style,
                    fontSize: '0.9rem',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: fontStyle === style 
                      ? 'primary.main'
                      : 'transparent',
                    background: fontStyle === style
                      ? `linear-gradient(135deg, ${alpha('#4ECDC4', 0.2)} 0%, ${alpha('#FF6B6B', 0.2)} 100%)`
                      : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      background: `linear-gradient(135deg, ${alpha('#4ECDC4', 0.1)} 0%, ${alpha('#FF6B6B', 0.1)} 100%)`,
                    },
                  }}
                >
                  {displayName}
                </Paper>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 500 }}>
            Text Alignment
          </Typography>
          <StyledToggleButtonGroup
            value={alignment}
            exclusive
            onChange={(e, newAlignment) => newAlignment && setAlignment(newAlignment)}
            fullWidth
            size="large"
          >
            <ToggleButton value="left">
              <Tooltip title="Left Align" arrow>
                <FormatAlignLeftIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="center">
              <Tooltip title="Center Align" arrow>
                <FormatAlignCenterIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="right">
              <Tooltip title="Right Align" arrow>
                <FormatAlignRightIcon />
              </Tooltip>
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default TextToolbox;