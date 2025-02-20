"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import InputAndResult from './InputAndResult';
import ResultSection from './ResultSection';

// Dynamic import for Canvas component to avoid SSR issues
const Canvas = dynamic(() => import('./Canvas'), {
  ssr: false
});

const CanvasAssistance = () => {
  const theme = useTheme();
  const [canvasData, setCanvasData] = useState(null);
  const [result, setResult] = useState('');
  const resultRef = useRef(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const handleDrawingChange = (dataUrl) => {
    setCanvasData(dataUrl);
  };

  const handleResultGenerated = () => {
    // Wait for result to be rendered
    setTimeout(() => {
      if (resultRef.current) {
        const yOffset = -100; // Adjust this value to control scroll position
        const element = resultRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });

        // Add a second scroll attempt to ensure it reaches the target
        setTimeout(() => {
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }, 100);
      }
    }, 100);
  };

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isPageLoaded ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          background: `linear-gradient(135deg, 
            ${alpha('#F0F4FF', 0.97)} 0%, 
            ${alpha('#F5EFFF', 0.97)} 50%,
            ${alpha('#FFF0F0', 0.97)} 100%)`,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '-50%',
            background: `radial-gradient(circle at center, 
              ${alpha('#4ECDC4', 0.03)} 0%,
              transparent 70%)`,
            opacity: 0.8,
            animation: 'pulse 15s ease-in-out infinite',
          },
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2)' },
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
        }}
      >
        {/* Main Content Wrapper */}
        <Box sx={{ flex: 1, mb: { xs: '100px', md: '120px' } }}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Container maxWidth="lg">
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center', 
                  gap: { xs: 3, sm: 4 },
                  mb: { xs: 4, md: 5 },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -3,
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      borderRadius: '28px',
                      opacity: 0.5,
                      filter: 'blur(12px)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: -4,
                      background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                      opacity: 0.5,
                      filter: 'blur(8px)',
                    }
                  }}
                >
                  <Image
                    src="/Sketchify-removebg2.png"
                    alt="Sketchify Logo"
                    width={300}
                    height={300}
                    style={{
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1)) drop-shadow(0 0 12px rgba(255,255,255,0.4))',
                      position: 'relative',
                    }}
                  />
                </Box>
                <Box sx={{ maxWidth: '900px' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 400,
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    AI Canvas Assistant
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      mb: 2,
                      lineHeight: 1.4,
                    }}
                  >
                    Transform your sketches into insights with AI-powered analysis
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: alpha(theme.palette.text.secondary, 0.8),
                      maxWidth: '500px',
                      lineHeight: 1.6,
                    }}
                  >
                    Unleash your creativity on our digital canvas and let our AI assistant analyze your drawings. 
                    Get detailed interpretations, creative insights, and explore the meaning behind your artwork in real-time.
                  </Typography>
                </Box>
              </Box>
            </Container>
          </Box>

          {/* Canvas Section */}
          <Container maxWidth="lg" sx={{ mb: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: '24px',
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  border: '2px solid',
                  borderColor: 'rgba(78, 205, 196, 0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(45deg, rgba(78, 205, 196, 0.05), rgba(255, 107, 107, 0.05))',
                    opacity: 0.5,
                  }
                }}
              >
                <Canvas onDrawingChange={handleDrawingChange} />
              </Paper>
            </motion.div>
          </Container>

          {/* Result Section */}
          <Container maxWidth="lg" sx={{ mb: { xs: '180px', md: '200px' } }}>
            <ResultSection result={result} resultRef={resultRef} />
          </Container>
        </Box>

        {/* Footer Section */}
        <Box
          component="footer"
          sx={{
            width: '100%',
            py: 3,
            borderTop: '1px solid',
            borderColor: 'rgba(78, 205, 196, 0.2)',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            position: 'absolute',
            bottom: 0,
            left: 0,
            zIndex: 10,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2 
              }}>
                <Image
                  src="/Sketchify.png"
                  alt="Sketchify Logo"
                  width={40}
                  height={40}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))',
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 500,
                  }}
                >
                  Powered by AI Technology
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                }}
              >
                © {new Date().getFullYear()} Sketchify. All rights reserved.
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                alignItems: 'center' 
              }}>
                <Typography
                  variant="body2"
                  component="a"
                  href="#"
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#4ECDC4',
                    },
                  }}
                >
                  Privacy Policy
                </Typography>
                <Typography
                  variant="body2"
                  component="a"
                  href="#"
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#4ECDC4',
                    },
                  }}
                >
                  Terms of Service
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Input Box */}
        <InputAndResult 
          canvasData={canvasData}
          onResultGenerated={handleResultGenerated}
          onResultUpdate={setResult}
        />

        {/* Add back the animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              component={motion.div}
              animate={{
                x: ['0%', '100%', '0%'],
                y: ['0%', '100%', '0%'],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 2,
              }}
              sx={{
                position: 'absolute',
                width: '40vmax',
                height: '40vmax',
                background: `radial-gradient(circle, ${
                  i % 2 === 0 
                    ? alpha('#4ECDC4', 0.03) 
                    : alpha('#FF6B6B', 0.03)
                } 0%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(30px)',
                opacity: 0.5,
                transform: `translate(${Math.random() * 100}%, ${Math.random() * 100}%)`,
              }}
            />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default CanvasAssistance;