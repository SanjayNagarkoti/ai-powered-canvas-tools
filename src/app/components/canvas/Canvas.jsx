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
import {
  // Drawing tools
  GestureOutlined as PenIcon,
  PanToolAlt as SelectIcon,
  AutoFixHigh as EraserIcon,
  
  // Shape tools
  CircleOutlined as CircleIcon,
  SquareOutlined as RectangleIcon,
  ChangeHistory as TriangleIcon,
  ShowChart as LineIcon,
  TextFields as TextIcon,
  
  // Color tools
  Palette as ColorPickerIcon,
  
  // History tools
  Undo as UndoIcon,
  Redo as RedoIcon,
  
  // Utility tools
  DeleteSweepOutlined as ClearIcon,
  ZoomInOutlined as ZoomInIcon,
  ZoomOutOutlined as ZoomOutIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { SketchPicker } from 'react-color';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { motion, AnimatePresence } from 'framer-motion';
import TextToolbox from './TextToolbox';
import { alpha } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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

const DRAW_THROTTLE = 16; // ~60fps
const MIN_POINTS_FOR_CURVE = 3;
const SMOOTHING_FACTOR = 0.2;
const PRESSURE_SENSITIVITY = 0.5;

const Canvas = ({ onDrawingChange }) => {
  const theme = useTheme();

  const toolbarStyles = {
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1100,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      gap: 1,
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(120deg, rgba(78, 205, 196, 0.05), rgba(255, 107, 107, 0.05))',
        pointerEvents: 'none',
      }
    },
    toolGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      padding: '4px 6px',
      background: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '10px',
      position: 'relative',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.8)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }
    },
    toolButton: {
      borderRadius: '8px',
      padding: '10px',
      minWidth: '40px',
      height: '40px',
      color: '#666',
      '& .MuiSvgIcon-root': {
        fontSize: '1.5rem',
      },
      transition: 'all 0.2s ease',
      '&:hover': {
        background: `linear-gradient(135deg, ${alpha('#4ECDC4', 0.1)}, ${alpha('#FF6B6B', 0.1)})`,
        transform: 'translateY(-1px)',
        color: '#000',
      },
      '&.Mui-disabled': {
        color: '#ccc',
      }
    },
    colorButton: {
      width: '36px',
      height: '36px',
      padding: 0,
      minWidth: 0,
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      border: '2px solid transparent',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      }
    }
  };

  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButton-root': {
      border: 'none',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '40px',
      height: '40px',
      color: '#666',
      transition: 'all 0.2s ease',
      '& .MuiSvgIcon-root': {
        fontSize: '1.5rem',
        transition: 'all 0.2s ease',
      },
      '&:hover': {
        background: `linear-gradient(135deg, ${alpha('#4ECDC4', 0.1)}, ${alpha('#FF6B6B', 0.1)})`,
        transform: 'translateY(-1px)',
        '& .MuiSvgIcon-root': {
          transform: 'scale(1.1)',
          color: '#000',
        }
      },
      '&.Mui-selected': {
        background: `linear-gradient(135deg, ${alpha('#4ECDC4', 0.2)}, ${alpha('#FF6B6B', 0.2)})`,
        color: '#000',
        '& .MuiSvgIcon-root': {
          transform: 'scale(1.1)',
        },
        '&:hover': {
          background: `linear-gradient(135deg, ${alpha('#4ECDC4', 0.3)}, ${alpha('#FF6B6B', 0.3)})`,
        }
      }
    }
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
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const lastDrawTime = useRef(0);
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

    const now = Date.now();
    if (now - lastDrawTime.current < DRAW_THROTTLE) return;
    lastDrawTime.current = now;

    const pos = getPointerPosition();
    
    if (tool === TOOLS.PEN) {
      const newPoints = [...pointsBuffer, pos.x, pos.y];
      setPointsBuffer(newPoints);
      
      // Calculate speed for smoothness but not for width
      const speed = calculateSpeed(newPoints, newPoints.length - 2);
      speedBuffer.current.push(speed);
      
      if (speedBuffer.current.length > 5) {
        speedBuffer.current.shift();
      }

      // Remove dynamic width calculation and use exact brush size
      const strokeWidth = brushSize / stage.scaleX(); // Adjust for zoom level only

      // Update current line with smooth curve
      const lastLine = lines[lines.length - 1];
      const newLine = {
        ...lastLine,
        points: newPoints,
        strokeWidth: strokeWidth, // Use exact size
        tension: SMOOTHING_FACTOR,
        bezier: true,
        lineCap: 'round',
        lineJoin: 'round',
      };

      // Optimize rendering by updating only the active line
      lines.splice(lines.length - 1, 1, newLine);
      setLines([...lines]);

      // Request next frame for smooth animation
      requestAnimationFrame(() => {
        const layer = stage.findOne('Layer');
        if (layer) {
          const lineNode = layer.findOne(`#line-${lines.length - 1}`);
          if (lineNode) {
            lineNode.draw();
          }
        }
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
    if (onDrawingChange) {
      const dataUrl = captureCanvasData();
      onDrawingChange(dataUrl);
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    setPointsBuffer([]); // Clear points buffer when stroke ends
    speedBuffer.current = []; // Clear speed buffer
    saveToHistory();
    if (onDrawingChange) {
      const dataUrl = captureCanvasData();
      onDrawingChange(dataUrl);
    }
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
    // Only handle zooming if Ctrl key is pressed
    if (e.evt.ctrlKey || e.evt.metaKey) {  // metaKey for Mac support
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
    }
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

  const handleColorPickerClick = (event) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  const captureCanvasData = () => {
    const stage = stageRef.current;
    if (!stage) return;

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
    
    ctx.drawImage(mainCanvas, 0, 0);
    
    return tempCanvas.toDataURL('image/png', 1.0);
  };

  const setupCanvas = (canvas) => {
    const ctx = canvas.getContext('2d', { alpha: false });
    const scale = window.devicePixelRatio;
    
    // Set actual size in memory
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    
    // Scale context to ensure correct drawing
    ctx.scale(scale, scale);
    
    // Set display size
    canvas.style.width = canvas.offsetWidth + 'px';
    canvas.style.height = canvas.offsetHeight + 'px';
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    return ctx;
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        bgcolor: '#ffffff',
        position: 'relative',
        overflow: 'visible', // Keep this to allow popups to overflow
      }}
    >
      <Box sx={toolbarStyles.toolbar}>
        {/* Main Tools Group (Drawing + Shapes) */}
        <Box sx={{ display: 'flex', gap: 0.5, flex: 3 }}>
          {/* Drawing Tools */}
          <Box sx={toolbarStyles.toolGroup}>
            <StyledToggleButtonGroup
              value={tool}
              exclusive
              onChange={(e, newTool) => newTool && setTool(newTool)}
              size="small"
            >
              <ToggleButton value={TOOLS.SELECT}>
                <Tooltip title="Select (V)" arrow>
                  <SelectIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value={TOOLS.PEN}>
                <Tooltip title="Pen (P)" arrow>
                  <PenIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value={TOOLS.ERASER}>
                <Tooltip title="Eraser (E)" arrow>
                  <EraserIcon />
                </Tooltip>
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Box>

          {/* Shape Tools */}
          <Box sx={toolbarStyles.toolGroup}>
            <StyledToggleButtonGroup
              value={tool}
              exclusive
              onChange={(e, newTool) => newTool && setTool(newTool)}
              size="small"
            >
              <ToggleButton value={TOOLS.CIRCLE}>
                <Tooltip title="Circle (C)" arrow>
                  <CircleIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value={TOOLS.RECTANGLE}>
                <Tooltip title="Rectangle (R)" arrow>
                  <RectangleIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value={TOOLS.TRIANGLE}>
                <Tooltip title="Triangle (T)" arrow>
                  <TriangleIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value={TOOLS.LINE}>
                <Tooltip title="Line (L)" arrow>
                  <LineIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value={TOOLS.TEXT}>
                <Tooltip title="Text (X)" arrow>
                  <TextIcon />
                </Tooltip>
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Box>
        </Box>

        {/* Color and Stroke Tools Group */}
        <Box sx={{ 
          display: 'flex', 
          gap: 0.5, 
          flex: 2,
          justifyContent: 'center',
          alignItems: 'center',
          mx: 1
        }}>
          {/* Colors */}
          <Box sx={{
            ...toolbarStyles.toolGroup,
            px: 1,
            minWidth: 'auto'
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {colors.map((c) => (
                <Tooltip key={c} title="Quick Color" arrow>
                  <IconButton
                    onClick={() => setColor(c)}
                    sx={{
                      ...toolbarStyles.colorButton,
                      width: '32px', // Slightly reduced
                      height: '32px',
                      backgroundColor: c,
                      border: color === c ? `2px solid ${alpha('#4ECDC4', 0.8)}` : '2px solid transparent',
                    }}
                  />
                </Tooltip>
              ))}
              <Tooltip title="Color Picker (Alt+C)" arrow>
                <IconButton 
                  onClick={handleColorPickerClick} 
                  sx={{
                    ...toolbarStyles.toolButton,
                    width: '32px',
                    height: '32px',
                  }}
                >
                  <ColorPickerIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Stroke Size Slider */}
          <Box sx={{
            ...toolbarStyles.toolGroup,
            px: 2,
            minWidth: '150px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Tooltip title={`${tool === TOOLS.ERASER ? 'Eraser' : 'Stroke'} Size`} arrow>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%',
                gap: 1 
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    minWidth: '24px',
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  {tool === TOOLS.ERASER ? eraserSize : brushSize}
                </Typography>
                <Slider
                  value={tool === TOOLS.ERASER ? eraserSize : brushSize}
                  onChange={(e, newValue) => {
                    tool === TOOLS.ERASER ? setEraserSize(newValue) : setBrushSize(newValue)
                  }}
                  min={1}
                  max={50}
                  size="small"
                  sx={{
                    width: '100%',
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                      '&::before': {
                        boxShadow: 'none',
                      },
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      border: 'none',
                      height: 4,
                    },
                    '& .MuiSlider-rail': {
                      background: alpha(theme.palette.text.primary, 0.1),
                      height: 4,
                    },
                  }}
                />
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {/* Utility Tools Group */}
        <Box sx={{ display: 'flex', gap: 0.5, flex: 3, justifyContent: 'flex-end' }}>
          {/* History Tools */}
          <Box sx={toolbarStyles.toolGroup}>
            <Tooltip title="Undo (Ctrl+Z)" arrow>
              <span>
                <IconButton onClick={handleUndo} disabled={historyStep === 0} sx={toolbarStyles.toolButton}>
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Y)" arrow>
              <span>
                <IconButton onClick={handleRedo} disabled={historyStep === history.length - 1} sx={toolbarStyles.toolButton}>
                  <RedoIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {/* Canvas Tools */}
          <Box sx={toolbarStyles.toolGroup}>
            <Tooltip title="Clear Canvas (Alt+Delete)" arrow>
              <IconButton onClick={handleClearCanvas} sx={toolbarStyles.toolButton}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom In (Ctrl++)" arrow>
              <IconButton onClick={() => setScale(scale * 1.2)} sx={toolbarStyles.toolButton}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out (Ctrl+-)" arrow>
              <IconButton onClick={() => setScale(scale / 1.2)} sx={toolbarStyles.toolButton}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
          </Box>
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
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          borderRadius: '12px',
          m: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.1)',
          zIndex: 1,
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
          onTouchEnd={handleTouchEnd}
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
            cursor: getCursor(),
            borderRadius: '12px',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'background-color 0.3s ease',
          }}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable={tool === TOOLS.SELECT}
          onWheel={handleWheel}
          onContextMenu={e => e.evt.preventDefault()}
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
                key={`line-${i}`}
                id={`line-${i}`}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                lineCap="round"
                lineJoin="round"
                tension={line.tension || SMOOTHING_FACTOR}
                bezier={true}
                globalCompositeOperation={
                  line.tool === TOOLS.ERASER ? 'destination-out' : 'source-over'
                }
                perfectDrawEnabled={false}
                listening={false}
                shadowColor={line.color}
                shadowBlur={2}
                shadowOpacity={0.1}
                shadowEnabled={tool !== TOOLS.ERASER}
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
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              color: color,
              resize: 'none',
              overflow: 'hidden',
              minWidth: '100px',
              minHeight: '30px',
              outline: 'none',
              backdropFilter: 'blur(4px)',
            }}
            autoFocus
          />
        )}
      </Box>

      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={handleColorPickerClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPopover-paper': {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            p: 2,
          }
        }}
      >
        <SketchPicker
          color={color}
          onChange={(newColor) => setColor(newColor.hex)}
          disableAlpha
        />
      </Popover>
    </Box>
  );
};

export default Canvas;