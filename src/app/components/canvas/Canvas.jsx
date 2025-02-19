"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, RegularPolygon } from 'react-konva';
import { 
  Box, 
  Paper, 
  ToggleButton, 
  ToggleButtonGroup, 
  Tooltip, 
  IconButton, 
  Slider, 
  Typography, 
  Divider,
  Switch,
  Select,
  MenuItem,
  Popover,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import BackspaceIcon from '@mui/icons-material/Backspace';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import PanToolIcon from '@mui/icons-material/PanTool';
import TimelineIcon from '@mui/icons-material/Timeline';
import { styled } from '@mui/material/styles';
import { SketchPicker } from 'react-color';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { motion, AnimatePresence } from 'framer-motion';
import AIAnalysisPanel from './AIAnalysisPanel';
// Update import paths in src/app/components/canvas/Canvas.jsx
import TextToolbox from './TextToolbox';
import { analyzeCanvas } from '../../services/geminiService';
// Load a handwriting font
const handwritingFont = 'Comic Sans MS, cursive';

const TOOLS = {
  SELECT: 'select',
  PEN: 'pen',
  ERASER: 'eraser',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  TRIANGLE: 'triangle',
  LINE: 'line',
  TEXT: 'text',
};

const toolbarStyles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: theme => theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
    borderBottom: theme => `1px solid ${theme.palette.divider}`,
    gap: 2,
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
  },
  toolGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: '0 8px',
  },
  divider: {
    height: 32,
    margin: '0 12px',
  },
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    padding: '8px',
    border: 'none',
    borderRadius: '8px',
    margin: '0 2px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'translateY(-1px)',
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const ColorButton = styled(IconButton)(({ color }) => ({
  width: 32,
  height: 32,
  padding: 0,
  border: '2px solid #fff',
  borderRadius: '50%',
  backgroundColor: color,
  '&:hover': {
    backgroundColor: color,
    opacity: 0.8,
  },
}));

const getControlPoints = (points, tension = 0.3) => {
  const controlPoints = [];
  for (let i = 0; i < points.length - 2; i += 2) {
    const p0 = i > 0 ? { x: points[i - 2], y: points[i - 1] } : { x: points[i], y: points[i + 1] };
    const p1 = { x: points[i], y: points[i + 1] };
    const p2 = { x: points[i + 2], y: points[i + 3] };
    const p3 = i < points.length - 4 ? { x: points[i + 4], y: points[i + 5] } : p2;

    const d1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
    const d2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const d3 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));

    const cp1x = p1.x + (tension * d2 * (p2.x - p0.x)) / (d1 + d2);
    const cp1y = p1.y + (tension * d2 * (p2.y - p0.y)) / (d1 + d2);
    const cp2x = p2.x - (tension * d2 * (p3.x - p1.x)) / (d2 + d3);
    const cp2y = p2.y - (tension * d2 * (p3.y - p1.y)) / (d2 + d3);

    controlPoints.push(cp1x, cp1y, cp2x, cp2y);
  }
  return controlPoints;
};

const calculateSpeed = (points, index) => {
  if (index < 2) return 0;
  const dx = points[index] - points[index - 2];
  const dy = points[index + 1] - points[index - 1];
  return Math.sqrt(dx * dx + dy * dy);
};

const Canvas = () => {
  const [tool, setTool] = useState(TOOLS.PEN);
  const [lines, setLines] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [texts, setTexts] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [eraserSize, setEraserSize] = useState(20);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const stageRef = useRef(null);
  const textInputRef = useRef(null);
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState('');
  const [editingTextId, setEditingTextId] = useState(null);
  const [fontSize, setFontSize] = useState(20);
  const [alignment, setAlignment] = useState('left');
  const [fontStyle, setFontStyle] = useState('Comic Sans MS');
  const [selectedText, setSelectedText] = useState(null);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [lastDrawTime, setLastDrawTime] = useState(0);
  const [pointsBuffer, setPointsBuffer] = useState([]);
  const requestRef = useRef();
  const speedBuffer = useRef([]);

  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#0000FF', // Blue
    '#008000', // Green
    '#FFA500', // Orange
  ];

  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128;
  };

  useEffect(() => {
    const handleKeyboard = (e) => {
      // Tool shortcuts
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'v': setTool(TOOLS.SELECT); break;
          case 'p': setTool(TOOLS.PEN); break;
          case 'e': setTool(TOOLS.ERASER); break;
          case 'c': setTool(TOOLS.CIRCLE); break;
          case 'r': setTool(TOOLS.RECTANGLE); break;
          case 't': setTool(TOOLS.TRIANGLE); break;
          case 'l': setTool(TOOLS.LINE); break;
          case 'x': setTool(TOOLS.TEXT); break;
        }
      }

      // Control key combinations
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case '+':
          case '=':
            e.preventDefault();
            setScale(scale * 1.2);
            break;
          case '-':
            e.preventDefault();
            setScale(scale / 1.2);
            break;
        }
      }

      // Alt key combinations
      if (e.altKey) {
        switch(e.key.toLowerCase()) {
          case 'c':
            e.preventDefault();
            setShowColorPicker(!showColorPicker);
            break;
          case 'Delete':
            e.preventDefault();
            handleClearCanvas();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [scale, showColorPicker, historyStep]);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCursor = () => {
    switch(tool) {
      case TOOLS.PEN:
        const size = brushSize;
        const cursor = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle 
              cx="${size/2}" 
              cy="${size/2}" 
              r="${(size/2) - 1}" 
              fill="${color}"
              stroke="white"
              stroke-width="1"
            />
          </svg>
        `;
        const encoded = encodeURIComponent(cursor);
        return `url('data:image/svg+xml;utf8,${encoded}') ${size/2} ${size/2}, auto`;
      case TOOLS.ERASER:
        const eraserCursor = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${eraserSize}" height="${eraserSize}" viewBox="0 0 ${eraserSize} ${eraserSize}">
            <rect width="${eraserSize-2}" height="${eraserSize-2}" x="1" y="1" fill="white" stroke="black"/>
          </svg>
        `;
        const encodedEraser = encodeURIComponent(eraserCursor);
        return `url('data:image/svg+xml;utf8,${encodedEraser}') ${eraserSize/2} ${eraserSize/2}, auto`;
      case TOOLS.SELECT:
        return 'pointer';
      case TOOLS.TEXT:
        return 'text';
      default:
        return 'crosshair';
    }
  };

  const getPointerPosition = () => {
    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();
    return {
      x: (pointerPosition.x - stage.x()) / stage.scaleX(),
      y: (pointerPosition.y - stage.y()) / stage.scaleY()
    };
  };

  const handleMouseDown = (e) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = getPointerPosition();

    // Check if clicking on the toolbox
    if (e.evt && e.evt.target.closest('.text-toolbox')) {
      return;
    }

    // If text input is visible and clicking outside, finish editing
    if (textInputVisible && e.target === stage) {
      finishTextEditing();
      return;
    }

    if (tool === TOOLS.SELECT) {
      // If clicking on text while in select mode, allow editing
      const clickedText = e.target.getType?.() === 'Text' ? e.target : null;
      if (clickedText) {
        const text = texts.find(t => t.id === clickedText.attrs.id);
        if (text) {
          setSelectedText(text);
          setSelectedTextId(text.id);
          setTextInputPosition({ x: text.x, y: text.y });
          setCurrentText(text.text);
          setTextInputVisible(true);
          setEditingTextId(text.id);
          setFontSize(text.fontSize);
          setFontStyle(text.fontFamily);
          setAlignment(text.align);
          setColor(text.fill);
          if (textInputRef.current) {
            textInputRef.current.focus();
          }
        }
      } else {
        setSelectedText(null);
        setSelectedTextId(null);
      }
    } else if (tool !== TOOLS.TEXT) {
    setIsDrawing(true);
      if (tool === TOOLS.PEN) {
        // Reset points buffer for new stroke
        setPointsBuffer([pos.x, pos.y]);
        const newLine = {
          tool,
          points: [pos.x, pos.y],
          color: color,
          strokeWidth: brushSize / stage.scaleX(),
        };
        setLines([...lines, newLine]);
      } else if (tool === TOOLS.ERASER) {
        const newLine = {
          tool,
          points: [pos.x, pos.y],
          color: '#ffffff',
          strokeWidth: eraserSize / stage.scaleX(),
        };
        setLines([...lines, newLine]);
      } else {
        const newShape = {
          type: tool,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          color: color,
          strokeWidth: brushSize / stage.scaleX(),
        };
        setShapes([...shapes, newShape]);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = stageRef.current;
    if (!stage) return;

    const pos = getPointerPosition();
    
    if (tool === TOOLS.PEN) {
      // Add point to current stroke's buffer
      const newPoints = [...pointsBuffer, pos.x, pos.y];
      setPointsBuffer(newPoints);
      
      // Calculate speed
      const speed = calculateSpeed(newPoints, newPoints.length - 2);
      speedBuffer.current.push(speed);
      
      if (speedBuffer.current.length > 5) {
        speedBuffer.current.shift();
      }

      const avgSpeed = speedBuffer.current.reduce((a, b) => a + b, 0) / speedBuffer.current.length;
      
      const maxSpeed = 10;
      const minWidth = brushSize * 0.5;
      const maxWidth = brushSize;
      const dynamicWidth = Math.max(
        minWidth,
        maxWidth - (avgSpeed / maxSpeed) * (maxWidth - minWidth)
      );

      // Update current line
      const lastLine = lines[lines.length - 1];
      const newLine = {
        ...lastLine,
        points: newPoints,
        strokeWidth: dynamicWidth,
      };

      lines.splice(lines.length - 1, 1, newLine);
      setLines(lines.concat());

      requestRef.current = requestAnimationFrame(() => {
        setLastDrawTime(Date.now());
      });
    } else if (tool === TOOLS.ERASER) {
      // Regular eraser behavior
      const lastLine = lines[lines.length - 1];
      const newPoints = lastLine.points.concat([pos.x, pos.y]);
      lastLine.points = newPoints;
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    } else if (tool !== TOOLS.SELECT && tool !== TOOLS.TEXT) {
      const lastShape = shapes[shapes.length - 1];
      lastShape.width = pos.x - lastShape.x;
      lastShape.height = pos.y - lastShape.y;
      shapes.splice(shapes.length - 1, 1, lastShape);
      setShapes(shapes.concat());
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setPointsBuffer([]); // Clear points buffer when stroke ends
    speedBuffer.current = []; // Clear speed buffer
    saveToHistory();
  };

  const saveToHistory = () => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({
      lines: [...lines],
      shapes: [...shapes],
      texts: [...texts],
    });
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      const prevState = history[newStep];
      setLines(prevState.lines);
      setShapes(prevState.shapes);
      setTexts(prevState.texts);
      setHistoryStep(newStep);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      const nextState = history[newStep];
      setLines(nextState.lines);
      setShapes(nextState.shapes);
      setTexts(nextState.texts);
      setHistoryStep(newStep);
    }
  };

  const handleClearCanvas = () => {
    setLines([]);
    setShapes([]);
    setTexts([]);
    saveToHistory();
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setPosition(newPos);
  };

  const handleTextSubmit = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishTextEditing();
    } else if (e.key === 'Escape') {
      cancelTextEditing();
    } else if (e.key === 'Delete' && selectedText) {
      deleteSelectedText();
    }
  };

  const cancelTextEditing = () => {
    setTextInputVisible(false);
    setEditingTextId(null);
    setSelectedText(null);
  };

  const deleteSelectedText = () => {
    const textToDelete = selectedText || texts.find(t => t.id === selectedTextId);
    if (textToDelete) {
      setTexts(texts.filter(t => t.id !== textToDelete.id));
      setSelectedText(null);
      setSelectedTextId(null);
      setTextInputVisible(false);
      setEditingTextId(null);
      saveToHistory();
    }
  };

  const finishTextEditing = () => {
    if (currentText.trim() !== '') {
      const newText = {
        id: editingTextId || Date.now(),
        x: textInputPosition.x,
        y: textInputPosition.y,
        text: currentText,
        fontSize: fontSize,
        draggable: true,
        fill: color,
        fontFamily: fontStyle,
        align: alignment,
      };

      if (editingTextId) {
        setTexts(texts.map(text => text.id === editingTextId ? newText : text));
      } else {
        setTexts([...texts, newText]);
      }
      saveToHistory();
    }
    setTextInputVisible(false);
    setEditingTextId(null);
    if (!editingTextId) {
      setSelectedText(null);
      setSelectedTextId(null);
    }
  };

  const handleTextDoubleClick = (text) => {
    if (tool === TOOLS.TEXT || tool === TOOLS.SELECT) {
      setTextInputPosition({ x: text.x, y: text.y });
      setCurrentText(text.text);
      setTextInputVisible(true);
      setEditingTextId(text.id);
      setFontSize(text.fontSize);
      setFontStyle(text.fontFamily);
      setAlignment(text.align);
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    // Handle text deletion with Delete or Backspace keys
    if ((e.key === 'Delete' || e.key === 'Backspace') && !textInputVisible) {
      if (selectedText || selectedTextId) {
        e.preventDefault(); // Prevent default backspace navigation
        deleteSelectedText();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedText, selectedTextId, texts]);

  const handleAnalyzeCanvas = async (prompt) => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      const stage = stageRef.current;
      
      // Create a temporary canvas with white background
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      
      // Set canvas size
      tempCanvas.width = stage.width();
      tempCanvas.height = stage.height();
      
      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Get the main canvas element from Konva stage
      const mainCanvas = stage.findOne('Layer').getCanvas()._canvas;
      
      if (darkMode) {
        // If in dark mode, create an intermediate canvas to invert colors
        const intermediateCanvas = document.createElement('canvas');
        const intermediateCtx = intermediateCanvas.getContext('2d');
        intermediateCanvas.width = mainCanvas.width;
        intermediateCanvas.height = mainCanvas.height;
        
        // Draw the original content
        intermediateCtx.drawImage(mainCanvas, 0, 0);
        
        // Get the image data
        const imageData = intermediateCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
        const data = imageData.data;
        
        // Invert colors for dark mode content
        for (let i = 0; i < data.length; i += 4) {
          // Invert only non-transparent pixels
          if (data[i + 3] > 0) {
            data[i] = 255 - data[i];     // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
          }
        }
        
        // Put the inverted image data back
        intermediateCtx.putImageData(imageData, 0, 0);
        
        // Draw the inverted content onto the final canvas
        ctx.drawImage(intermediateCanvas, 0, 0);
      } else {
        // In light mode, draw directly
        ctx.drawImage(mainCanvas, 0, 0);
      }
      
      // Convert to data URL
      const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
      
      console.log('Generated canvas data URL:', dataUrl.substring(0, 100) + '...');
      
      // Send to Gemini API
      const response = await analyzeCanvas(dataUrl, prompt);
      setAiResponse(response);
    } catch (error) {
      setAnalysisError('Failed to analyze the canvas. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleColorPickerClick = (event) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        bgcolor: darkMode ? '#2E2E2E' : '#fafafa',
      }}
    >
      <Box sx={toolbarStyles.toolbar}>
        <motion.div layout>
          <StyledToggleButtonGroup
            value={tool}
            exclusive
            onChange={(e, newTool) => newTool && setTool(newTool)}
            aria-label="drawing tools"
          >
            <ToggleButton value={TOOLS.SELECT}>
              <Tooltip title="Select Tool (V)" arrow placement="bottom">
                <PanToolIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.PEN}>
              <Tooltip title="Pen Tool (P)" arrow placement="bottom">
                <CreateIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.ERASER}>
              <Tooltip title="Eraser Tool (E)" arrow placement="bottom">
                <BackspaceIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.CIRCLE}>
              <Tooltip title="Circle Tool (C)" arrow placement="bottom">
                <RadioButtonUncheckedIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.RECTANGLE}>
              <Tooltip title="Rectangle Tool (R)" arrow placement="bottom">
                <CropSquareIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.TRIANGLE}>
              <Tooltip title="Triangle Tool (T)" arrow placement="bottom">
                <ChangeHistoryIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.LINE}>
              <Tooltip title="Line Tool (L)" arrow placement="bottom">
                <TimelineIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.TEXT}>
              <Tooltip title="Text Tool (X)" arrow placement="bottom">
                <TextFieldsIcon />
              </Tooltip>
            </ToggleButton>
          </StyledToggleButtonGroup>
        </motion.div>

        <Divider orientation="vertical" sx={toolbarStyles.divider} />

        <motion.div layout style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
            {colors.map((c) => (
              <Tooltip key={c} title={`Quick Color`} arrow placement="bottom">
                <IconButton
                  onClick={() => setColor(c)}
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: c,
                    border: color === c ? '2px solid #1976d2' : '1px solid #ccc',
                    padding: 0,
                    minWidth: 0,
                    '&:hover': {
                      backgroundColor: c,
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              </Tooltip>
            ))}
          </Box>

          <Divider orientation="vertical" flexItem sx={{ height: 24 }} />

          <Tooltip title="Advanced Color Picker (Alt+C)" arrow placement="bottom">
            <IconButton 
              onClick={handleColorPickerClick}
              sx={{
                backgroundColor: color,
                width: 32,
                height: 32,
                border: '2px solid white',
                boxShadow: 1,
                '&:hover': {
                  backgroundColor: color,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ColorLensIcon sx={{ color: isLightColor(color) ? '#000' : '#fff' }} />
            </IconButton>
          </Tooltip>
          
          <Popover
            open={Boolean(colorPickerAnchor)}
            anchorEl={colorPickerAnchor}
            onClose={handleColorPickerClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box sx={{ p: 2 }}>
              <SketchPicker
                color={color}
                onChange={(newColor) => {
                  setColor(newColor.hex);
                }}
                disableAlpha
              />
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {colors.map((c) => (
                  <IconButton
                    key={c}
                    onClick={() => {
                      setColor(c);
                      handleColorPickerClose();
                    }}
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: c,
                      border: color === c ? '2px solid #000' : '1px solid #ccc',
                      '&:hover': {
                        backgroundColor: c,
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Popover>
          
          <Box sx={{ width: 100 }}>
            <Slider
              value={tool === TOOLS.ERASER ? eraserSize : brushSize}
              onChange={(e, newValue) => {
                tool === TOOLS.ERASER ? setEraserSize(newValue) : setBrushSize(newValue)
              }}
              min={1}
              max={50}
              sx={{
                '& .MuiSlider-thumb': {
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                  },
                },
              }}
            />
          </Box>
        </motion.div>

        <motion.div layout style={{ display: 'flex', gap: '4px' }}>
          <Tooltip title="Undo (Ctrl+Z)" arrow placement="bottom">
            <span>
              <IconButton 
              onClick={handleUndo}
                disabled={historyStep === 0}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:not(:disabled):hover': {
                    transform: 'translateX(-2px)',
                  },
                }}
              >
                <UndoIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo (Ctrl+Shift+Z)" arrow placement="bottom">
            <span>
              <IconButton 
              onClick={handleRedo}
                disabled={historyStep === history.length - 1}
                size="small"
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </motion.div>

        <Tooltip title="Clear Canvas (Alt+Delete)" arrow placement="bottom">
          <IconButton 
            onClick={handleClearCanvas}
            size="small"
            sx={{ 
              color: 'error.main',
              '&:hover': { 
                backgroundColor: 'error.light',
                color: 'error.dark'
              }
            }}
          >
            <DeleteSweepIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Zoom In (Ctrl++)" arrow placement="bottom">
            <IconButton onClick={() => setScale(scale * 1.2)} size="small">
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out (Ctrl+-)" arrow placement="bottom">
            <IconButton onClick={() => setScale(scale / 1.2)} size="small">
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Dark Mode</Typography>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="default"
          />
        </Box>
      </Box>

      <AnimatePresence>
        {(tool === TOOLS.TEXT || textInputVisible || selectedText) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <TextToolbox
              color={color}
              setColor={setColor}
              fontSize={fontSize}
              setFontSize={setFontSize}
              alignment={alignment}
              setAlignment={setAlignment}
              fontStyle={fontStyle}
              setFontStyle={setFontStyle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Box 
        sx={{ 
          flex: 1,
          position: 'relative',
          backgroundColor: darkMode ? '#2E2E2E' : '#ffffff',
          overflow: 'hidden',
          transition: 'background-color 0.3s ease',
          '&:focus': {
            outline: 'none',
          },
        }}
        tabIndex={0}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height - 80} 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDblClick={(e) => {
            // Handle double click for text tool
            if (tool === TOOLS.TEXT) {
              const pos = getPointerPosition();
              setTextInputPosition(pos);
              setTextInputVisible(true);
              setCurrentText('');
              setEditingTextId(null);
              setSelectedText(null);
              if (textInputRef.current) {
                textInputRef.current.focus();
              }
            }
          }}
          style={{ 
            cursor: getCursor()
          }}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable={tool === TOOLS.SELECT}
        >
          <Layer>
            {shapes.map((shape, i) => {
              const shapeProps = {
                key: i,
                x: shape.x,
                y: shape.y,
                stroke: shape.color,
                strokeWidth: shape.strokeWidth,
                fill: 'transparent',
                draggable: tool === TOOLS.SELECT,
              };

              if (shape.type === TOOLS.LINE) {
                return (
                  <Line
                    {...shapeProps}
                    points={[0, 0, shape.width, shape.height]}
                    lineCap="round"
                  />
                );
              } else if (shape.type === TOOLS.RECTANGLE) {
                return (
                  <Rect
                    {...shapeProps}
                    width={shape.width}
                    height={shape.height}
                  />
                );
              } else if (shape.type === TOOLS.CIRCLE) {
                return (
                  <Circle
                    {...shapeProps}
                    radius={Math.abs(shape.width) / 2}
                  />
                );
              } else if (shape.type === TOOLS.TRIANGLE) {
                return (
                  <RegularPolygon
                    {...shapeProps}
                    sides={3}
                    radius={Math.abs(shape.width) / 2}
                  />
                );
              }
              return null;
            })}

            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                lineCap="round"
                lineJoin="round"
                tension={0.3}
                bezier={true}
                globalCompositeOperation={
                  line.tool === TOOLS.ERASER ? 'destination-out' : 'source-over'
                }
                perfectDrawEnabled={false}
                listening={false}
              />
            ))}

            {texts.map((text, i) => (
              <React.Fragment key={i}>
                <Text
                  id={text.id}
                  x={text.x}
                  y={text.y}
                  text={text.text}
                  fontSize={text.fontSize}
                  fill={text.fill}
                  fontFamily={text.fontFamily}
                  align={text.align}
                  draggable={tool === TOOLS.SELECT}
                  onClick={(e) => {
                    if (tool === TOOLS.SELECT) {
                      setSelectedText(text);
                      setSelectedTextId(text.id);
                      e.evt.cancelBubble = true;
                    }
                  }}
                  onDblClick={(e) => {
                    if (tool === TOOLS.SELECT) {
                      handleTextDoubleClick(text);
                      e.evt.cancelBubble = true;
                    }
                  }}
                  onDragEnd={(e) => {
                    const newTexts = texts.slice();
                    newTexts[i] = {
                      ...newTexts[i],
                      x: e.target.x(),
                      y: e.target.y(),
                    };
                    setTexts(newTexts);
                    saveToHistory();
                  }}
                  stroke={selectedText?.id === text.id || selectedTextId === text.id ? '#1976d2' : undefined}
                  strokeWidth={selectedText?.id === text.id || selectedTextId === text.id ? 1 : undefined}
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>

        {textInputVisible && (
          <textarea
            ref={textInputRef}
            value={currentText}
            onChange={(e) => {
              setCurrentText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={handleTextSubmit}
            style={{
              position: 'absolute',
              top: textInputPosition.y,
              left: textInputPosition.x,
              fontSize: `${fontSize}px`,
              fontFamily: fontStyle,
              textAlign: alignment,
              border: '2px solid #1976d2',
              borderRadius: '4px',
              padding: '4px',
              zIndex: 1000,
              backgroundColor: darkMode ? '#333' : '#fff',
              color: color,
              resize: 'none',
              overflow: 'hidden',
              minWidth: '100px',
              minHeight: '30px',
              outline: 'none',
            }}
            autoFocus
          />
        )}
      </Box>

      <AIAnalysisPanel
        onAnalyze={handleAnalyzeCanvas}
        isLoading={isAnalyzing}
        error={analysisError}
        aiResponse={aiResponse}
      />
    </Box>
  );
};

export default Canvas;