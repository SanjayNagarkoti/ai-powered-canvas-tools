import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SummarizeIcon from '@mui/icons-material/Summarize';

const ResultSection = ({ result, resultRef }) => {
  if (!result) return null;

  const formatResult = (text) => {
    try {
      const sections = text.split(/\*\*(.*?)\*\*/).filter(Boolean);
      const formattedSections = {};
      
      for (let i = 0; i < sections.length; i += 2) {
        const title = sections[i].trim();
        let content = sections[i + 1]?.trim() || '';
        
        // Clean up HTML tags and format content
        content = content
          // Remove HTML tags
          .replace(/<[^>]*>/g, '')
          // Clean up mathematical expressions
          .replace(/\\sqrt/g, '√')
          .replace(/a\^2/g, 'a²')
          .replace(/b\^2/g, 'b²')
          .replace(/c\^2/g, 'c²')
          // Format numbers and equations
          .replace(/(\d+)\s*\+\s*(\d+)\s*=\s*(\d+)/g, '$1 + $2 = $3')
          .replace(/(\d+)√(\d+)/g, '$1√$2')
          // Clean up spaces and formatting
          .replace(/\s+/g, ' ')
          .trim();

        // Format steps into bullet points
        if (content.includes('=')) {
          content = content.split('.').map(step => step.trim())
            .filter(step => step)
            .map(step => `• ${step}`)
            .join('\n');
        }

        // Format final answer in conclusion
        if (title === 'Conclusion:') {
          content = content.replace(/(\d+√\d+|\d+\.?\d*)/, '**$1**');
        }

        formattedSections[title] = content;
      }

      return formattedSections;
    } catch (error) {
      return { 'Analysis': text };
    }
  };

  const formattedResult = formatResult(result);

  const renderSection = (title, content) => (
    <Box key={title} sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#2A2A2A',
          mb: 2,
          fontSize: '1.3rem',
        }}
      >
        {title}
      </Typography>
      {content.split('\n').map((paragraph, idx) => (
        <Typography
          key={idx}
          variant="body1"
          sx={{
            lineHeight: 2,
            color: 'rgba(0,0,0,0.8)',
            fontSize: '1.1rem',
            mb: paragraph.startsWith('•') ? 1 : 2,
            pl: paragraph.startsWith('•') ? 2 : 0,
            position: 'relative',
            ...(paragraph.startsWith('•') && {
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#4ECDC4',
              }
            }),
            '& strong': {
              color: '#4ECDC4',
              fontWeight: 700,
              fontSize: '1.2rem',
              px: 0.5,
            }
          }}
        >
          {paragraph.startsWith('•') ? paragraph.substring(2) : paragraph}
        </Typography>
      ))}
    </Box>
  );

  return (
    <Box
      ref={resultRef}
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      }}
      sx={{
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        mt: 4,
        scrollMarginTop: '20vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Paper
        elevation={0}
        component={motion.div}
        initial={{ rotateX: -10 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        sx={{
          p: 4,
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '2px solid',
          borderColor: 'rgba(78, 205, 196, 0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 1,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px) translateZ(0)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          mb: 3,
        }}>
          <AutoAwesomeIcon 
            sx={{ 
              color: '#4ECDC4',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.6 },
              },
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontSize: '1.2rem',
              color: '#4ECDC4',
            }}
          >
            AI Analysis Result
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {Object.entries(formattedResult).map(([title, content], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1 + 0.3,
              ease: "easeOut"
            }}
          >
            {renderSection(title, content)}
          </motion.div>
        ))}
      </Paper>
    </Box>
  );
};

export default ResultSection; 