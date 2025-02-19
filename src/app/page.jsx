"use client";
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container,
  Typography, 
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Stack,
  Chip,
  IconButton,
  TextField,
  Fab,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CreateIcon from '@mui/icons-material/Create';
import CodeIcon from '@mui/icons-material/Code';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FunctionsIcon from '@mui/icons-material/Functions';
import BrushIcon from '@mui/icons-material/Brush';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Image from 'next/image';
import Link from 'next/link';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'demo', label: 'How It Works' },
  { id: 'future-tools', label: 'Coming Soon' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
];

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const SpinningLogo = motion.create(Image);

const features = [
  {
    title: "Draw & Analyze",
    description: "Draw anything on Sketchify and let AI analyze it instantly",
    icon: <CreateIcon sx={{ fontSize: 40 }} />,
    color: "#FF6B6B"
  },
  {
    title: "Smart Recognition",
    description: "Advanced AI recognizes shapes, text, and complex drawings",
    icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
    color: "#4ECDC4"
  },
  {
    title: "Real-time Feedback",
    description: "Get instant AI feedback on your drawings and sketches",
    icon: <BrushIcon sx={{ fontSize: 40 }} />,
    color: "#45B7D1"
  }
];

const demoSteps = [
  {
    title: "1. Start Drawing",
    description: "Use our intuitive canvas tools to draw or write anything",
    image: "/demo-draw.gif" // Add your demo GIFs
  },
  {
    title: "2. Add Context",
    description: "Type your question or prompt for the AI assistant",
    image: "/demo-prompt.gif"
  },
  {
    title: "3. Get AI Analysis",
    description: "Receive instant AI-powered analysis and suggestions",
    image: "/demo-result.gif"
  }
];

const futureTools = [
  {
    title: 'Canvas to Image',
    description: 'Transform your sketches into high-quality images using AI',
    icon: <AutoFixHighIcon sx={{ fontSize: 40 }} />,
    image: '/canvas-to-image.png',
    color: '#FF6B6B',
    comingSoon: true
  },
  {
    title: 'Canvas to Code',
    description: 'Convert hand-drawn wireframes into actual code',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    image: '/canvas-to-code.png',
    color: '#4ECDC4',
    comingSoon: true
  },
  {
    title: 'Canvas to Flowchart',
    description: 'Automatically generate flowcharts from your sketches',
    icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
    image: '/canvas-to-flowchart.png',
    color: '#45B7D1',
    comingSoon: true
  },
  {
    title: 'Math Solver',
    description: 'Solve handwritten mathematical expressions instantly',
    icon: <FunctionsIcon sx={{ fontSize: 40 }} />,
    image: '/math-solver.png',
    color: '#9B59B6',
    comingSoon: true
  }
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const sectionVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1
    }
  }
};

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('home');

  // Updated scrollToSection function
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    
    if (sectionId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: elementPosition - navbarHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  // Add scroll event listener to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'demo', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100; // Add offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 100 && bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? `linear-gradient(135deg, 
            ${alpha('#0A1929', 0.97)} 0%, 
            ${alpha('#1A2027', 0.97)} 100%)`
        : `linear-gradient(135deg, 
            ${alpha('#F8FAFF', 0.97)} 0%, 
            ${alpha('#EEF2FF', 0.97)} 100%)`,
      position: 'relative',
      pt: '80px',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, ${alpha('#4ECDC4', 0.15)} 0%, transparent 25%),
          radial-gradient(circle at 80% 80%, ${alpha('#FF6B6B', 0.15)} 0%, transparent 25%),
          radial-gradient(circle at 50% 50%, ${alpha('#9B59B6', 0.1)} 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l7.9-7.9h-.83zm5.657 0L19.514 8.485 20.93 9.9l8.485-8.485h-1.415zM32.372 0L26.9 5.485 28.314 6.9 34.8 0h-2.428zm5.657 0l-6.9 6.9 1.415 1.415L40.03 0h-2z' fill='currentColor' fill-opacity='0.03'/%3E%3C/svg%3E")
        `,
        opacity: 1,
        pointerEvents: 'none',
        zIndex: 0,
      }
    }}>
      {/* Navigation Bar */}
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, rgba(10,25,41,0.95) 0%, rgba(26,32,39,0.95) 100%)'
            : 'linear-gradient(90deg, #4ECDC4 0%, #FF6B6B 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          height: '80px',
        }}
      >
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between',
            minHeight: '80px !important',
            px: 2,
          }}
        >
          <AnimatePresence>
            <Box 
              sx={{ 
                position: 'relative',
                height: '80px',
                width: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onClick={() => scrollToSection('home')}
            >
              <SpinningLogo
                src="/Sketchify-removebg2.png"
                alt="Sketchify Logo"
                width={300}
                height={300}
                initial={{ 
                  opacity: 0,
                  scale: 0.5,
                  rotate: -180
                }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                style={{
                  objectFit: 'contain',
                  filter: `
                    drop-shadow(0 0 12px rgba(255,255,255,0.4))
                    drop-shadow(0 0 8px rgba(0,0,0,0.3))
                    drop-shadow(0 4px 12px rgba(78,205,196,0.5))
                  `,
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ 
                  scale: 0.9,
                  rotate: -5
                }}
              />
            </Box>
          </AnimatePresence>
          
          <Box sx={{ display: 'flex', gap: 3, ml: 'auto' }}>
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 500,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: activeSection === item.id ? '100%' : '0%',
                    height: '2px',
                    background: '#FFFFFF',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover::after': {
                    width: '100%',
                  },
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                {item.label}
                {item.id === 'future-tools' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#FF6B6B',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                )}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Sections */}
      <Container maxWidth="xl">
        {/* Hero Section */}
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          id="home"
        >
          <Box 
            id="home" 
            sx={{ 
              minHeight: 'calc(100vh - 80px)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Grid 
              container 
              spacing={4} 
              sx={{ 
                minHeight: 'calc(100vh - 80px)',
                alignItems: 'center',
                py: 8
              }}
            >
              <Grid item xs={12} md={6}>
                <MotionBox
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      mb: 2,
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2
                    }}
                  >
                    Transform Your Sketches with AI Magic
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4,
                      color: 'text.secondary',
                      fontWeight: 400,
                      lineHeight: 1.6
                    }}
                  >
                    Experience the future of digital drawing with our intelligent canvas. 
                    Draw, analyze, and enhance your work in real-time.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push('/ai-canvas')}
                      sx={{
                        borderRadius: '12px',
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Try Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderRadius: '12px',
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                </MotionBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '500px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      background: theme.palette.mode === 'dark' 
                        ? alpha('#1A2027', 0.8)
                        : alpha('#ffffff', 0.8),
                    }}
                  >
                    <Image
                      src="/canvas-preview.png"
                      alt="AI Canvas Preview"
                      layout="fill"
                      objectFit="cover"
                      priority
                      style={{
                        transform: 'scale(1.02)',
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <Box 
            id="features" 
            sx={{ 
              pt: '80px',
              minHeight: '100vh',
              scrollMarginTop: '80px',
            }}
          >
            <Container maxWidth="lg">
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
                Powerful Features
              </Typography>
              <Typography 
                variant="h5" 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 8 }}
              >
                Get started with these powerful features
              </Typography>

              <Grid container spacing={4}>
                {features.map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <MotionCard
                        sx={{
                          height: '100%',
                          borderRadius: '20px',
                          background: alpha(theme.palette.background.paper, 0.8),
                          backdropFilter: 'blur(10px)',
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: alpha(feature.color, 0.2),
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            background: alpha(feature.color, 0.1),
                            color: feature.color,
                          }}>
                            {feature.icon}
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </CardContent>
                      </MotionCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </motion.div>

        {/* Demo Section */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <Box 
            id="demo" 
            sx={{ 
              pt: '80px',
              minHeight: '100vh',
              scrollMarginTop: '80px',
              background: alpha(theme.palette.background.paper, 0.5),
            }}
          >
            <Container maxWidth="lg">
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
                How It Works
              </Typography>
              <Typography 
                variant="h5" 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 8 }}
              >
                Get started in three simple steps
              </Typography>

              <Grid container spacing={6} alignItems="stretch">
                {demoSteps.map((step, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 }}
                      style={{ height: '100%' }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                          },
                        }}
                      >
                        <Box sx={{ position: 'relative', paddingTop: '66.67%' }}>
                          <Image
                            src={step.image}
                            alt={step.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 4 }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 600, 
                              mb: 2,
                              color: theme.palette.mode === 'dark' ? '#fff' : '#333',
                            }}
                          >
                            {step.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {step.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </motion.div>

        {/* Future Tools Section */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <Box 
            id="future-tools" 
            sx={{ 
              pt: '80px',
              minHeight: '100vh',
              scrollMarginTop: '80px',
            }}
          >
            <Container maxWidth="lg">
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
                Coming Soon
              </Typography>
              <Typography 
                variant="h5" 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 8 }}
              >
                Exciting new features on the horizon
              </Typography>

              <Grid container spacing={4}>
                {futureTools.map((tool, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'hidden',
                          background: alpha(theme.palette.background.paper, 0.8),
                          backdropFilter: 'blur(10px)',
                          borderRadius: '20px',
                          border: '1px solid',
                          borderColor: alpha(tool.color, 0.2),
                          transition: 'all 0.3s ease',
                          minHeight: '380px',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 12px 25px ${alpha(tool.color, 0.2)}`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={tool.image}
                            alt={tool.title}
                            layout="fill"
                            objectFit="cover"
                            style={{
                              transform: 'scale(1.02)',
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: `linear-gradient(to bottom, transparent 0%, ${alpha(tool.color, 0.2)} 100%)`,
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16,
                              width: 50,
                              height: 50,
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: alpha(theme.palette.background.paper, 0.9),
                              backdropFilter: 'blur(8px)',
                              color: tool.color,
                              boxShadow: `0 4px 12px ${alpha(tool.color, 0.3)}`,
                              zIndex: 2,
                            }}
                          >
                            {tool.icon}
                          </Box>
                        </Box>

                        <CardContent 
                          sx={{ 
                            p: 3,
                            flexGrow: 1, 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                  {tool.title}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              flexGrow: 1,
                            }}
                          >
                  {tool.description}
                          </Typography>
                          
                          <Chip
                            label="Coming Soon"
                            sx={{
                              alignSelf: 'flex-start',
                              background: alpha(tool.color, 0.1),
                              color: tool.color,
                              fontWeight: 600,
                              borderRadius: '8px',
                              px: 2,
                            }}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <Box 
            id="about" 
            sx={{ 
              pt: '80px',
              minHeight: '100vh',
              scrollMarginTop: '80px',
            }}
          >
            <Container maxWidth="lg">
              <Typography 
                variant="h2" 
                align="center" 
                sx={{ 
                  mb: 8,
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                About Sketchify
              </Typography>
              <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={6}>
                  <MotionBox
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                      Empowering Creativity with AI
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.8 }}>
                      Sketchify is a revolutionary platform that combines the power of artificial intelligence 
                      with digital drawing capabilities. Our mission is to enhance the creative process by 
                      providing intelligent analysis and assistance for your drawings and sketches.
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                      Whether you're a student, professional, or hobbyist, Sketchify helps you explore, 
                      analyze, and improve your work with cutting-edge AI technology. Experience the future 
                      of digital creativity today.
                    </Typography>
                  </MotionBox>
                </Grid>
                <Grid item xs={12} md={6}>
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    sx={{
                      position: 'relative',
                      height: 400,
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Image
                      src="/about-image.png"
                      alt="Sketchify Technology"
                      layout="fill"
                      objectFit="cover"
                    />
                  </MotionBox>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <Box 
            id="contact" 
            sx={{ 
              pt: '80px',
              minHeight: '100vh',
              scrollMarginTop: '80px',
              mb: 8,
              background: theme.palette.mode === 'dark' 
                ? `linear-gradient(135deg, ${alpha('#0A1929', 0.9)} 0%, ${alpha('#1A2027', 0.9)} 100%)`
                : `linear-gradient(135deg, ${alpha('#F8FAFF', 0.9)} 0%, ${alpha('#EEF2FF', 0.9)} 100%)`,
            }}
          >
            <Container maxWidth="md">
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
                  Get in Touch
                </Typography>
                <Typography 
                  variant="h5" 
                  align="center" 
                  color="text.secondary" 
                  sx={{ mb: 8 }}
                >
                  Have questions? We'd love to hear from you.
                </Typography>

                <Card
                  sx={{
                    p: 4,
                    borderRadius: '20px',
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                >
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        sx={{ mb: 3 }}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        sx={{ mb: 3 }}
                      />
                      <TextField
                        fullWidth
                        label="Subject"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={7}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          mt: 2,
                          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #FF5555, #45B7D1)',
                          },
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </motion.div>
            </Container>
          </Box>
        </motion.div>
      </Container>

      {/* Scroll to Top Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Fab 
          color="primary" 
          aria-label="scroll to top"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          }}
          onClick={() => scrollToSection('home')}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </motion.div>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          position: 'relative',
          py: 6,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(to top, ${alpha('#0A1929', 0.97)} 0%, ${alpha('#1A2027', 0.97)} 100%)`
            : `linear-gradient(to top, ${alpha('#F8FAFF', 0.97)} 0%, ${alpha('#EEF2FF', 0.97)} 100%)`,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Image
                    src="/Sketchify.png"
                    alt="Sketchify Logo"
                    width={120}
                    height={120}
                    style={{
                      filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))',
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Transform your sketches into reality with AI-powered tools. Draw, analyze, and create with Sketchify.
                </Typography>
                <Stack direction="row" spacing={2}>
                  {[
                    { icon: <FacebookIcon />, label: 'Facebook', href: '#' },
                    { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
                    { icon: <GitHubIcon />, label: 'GitHub', href: '#' },
                    { icon: <LinkedInIcon />, label: 'LinkedIn', href: '#' },
                  ].map((social, index) => (
                    <IconButton
                      key={index}
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: theme.palette.mode === 'dark' ? 'white' : 'black',
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.1),
                          transform: 'translateY(-3px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Quick Links
                  </Typography>
                  <Stack spacing={1}>
                    {['Home', 'Features', 'How It Works', 'Coming Soon'].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Resources
                  </Typography>
                  <Stack spacing={1}>
                    {['Documentation', 'Tutorials', 'Blog', 'Support'].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Legal
                  </Typography>
                  <Stack spacing={1}>
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box
            sx={{
              pt: 4,
              mt: 4,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Sketchify. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}