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
  FormControlLabel
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import PanToolIcon from '@mui/icons-material/PanTool';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import { styled } from '@mui/material/styles';

const TOOLS = {
  SELECT: 'select',
  PEN: 'pen',
  ERASER: 'eraser',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  TRIANGLE: 'triangle',
  TEXT: 'text',
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    padding: '8px',
    border: 'none',
    borderRadius: '4px',
    margin: '0 4px',
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

const DrawingCanvas = () => {
  const [tool, setTool] = useState(TOOLS.PEN);
  const [lines, setLines] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('transparent');
  const [brushSize, setBrushSize] = useState(3);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [isFilled, setIsFilled] = useState(false);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const stageRef = useRef(null);
  const toolbarRef = useRef(null);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
      }
      
      // Tool shortcuts
      switch(e.key) {
        case 'v': setTool(TOOLS.SELECT); break;
        case 'p': setTool(TOOLS.PEN); break;
        case 'e': setTool(TOOLS.ERASER); break;
        case 'c': setTool(TOOLS.CIRCLE); break;
        case 'r': setTool(TOOLS.RECTANGLE); break;
        case 't': setTool(TOOLS.TRIANGLE); break;
        case 'x': setTool(TOOLS.TEXT); break;
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [historyStep]);

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
        return 'crosshair';
      case TOOLS.ERASER:
        return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="background: white; border-radius: 50%;"><circle cx="10" cy="10" r="8" fill="white" stroke="black" stroke-width="2"/></svg>') 10 10, auto`;
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
    setIsDrawing(true);

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      const newLine = {
        tool,
        points: [pos.x, pos.y],
        color: tool === TOOLS.ERASER ? '#ffffff' : color,
        strokeWidth: brushSize / stage.scaleX(),
      };
      setLines([...lines, newLine]);
    } else if (tool !== TOOLS.SELECT) {
      const newShape = {
        type: tool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color,
        strokeWidth: brushSize / stage.scaleX(),
      };
      setShapes([...shapes, newShape]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = stageRef.current;
    if (!stage) return;

    const pos = getPointerPosition();

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      const lastLine = lines[lines.length - 1];
      const newPoints = lastLine.points.concat([pos.x, pos.y]);
      lastLine.points = newPoints;
      lines.splice(lines.length - 1, 1, lastLine);
      setLines([...lines]);
    } else if (tool !== TOOLS.SELECT) {
      const lastShape = shapes[shapes.length - 1];
      const newWidth = pos.x - lastShape.x;
      const newHeight = pos.y - lastShape.y;
      shapes.splice(shapes.length - 1, 1, {
        ...lastShape,
        width: newWidth,
        height: newHeight,
      });
      setShapes([...shapes]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    saveToHistory();
  };

  const saveToHistory = () => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({ lines: [...lines], shapes: [...shapes] });
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      const previousState = history[newStep];
      setLines(previousState.lines);
      setShapes(previousState.shapes);
      setHistoryStep(newStep);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      const nextState = history[newStep];
      setLines(nextState.lines);
      setShapes(nextState.shapes);
      setHistoryStep(newStep);
    }
  };

  const handleClear = () => {
    setLines([]);
    setShapes([]);
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

  return (
    <Box 
      sx={{ 
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: '#fafafa',
      }}
    >
      {/* Toolbar Container */}
      <Box 
        sx={{ 
          width: '100%',
          height: '80px', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Paper
          ref={toolbarRef}
          elevation={2}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 1.5,
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            '& > *': {
              flexShrink: 0
            }
          }}
        >
          <StyledToggleButtonGroup
            value={tool}
            exclusive
            onChange={(e, newTool) => newTool && setTool(newTool)}
            aria-label="drawing tools"
            size="small"
          >
            <ToggleButton value={TOOLS.SELECT}>
              <Tooltip title="Select (V)">
                <PanToolIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.PEN}>
              <Tooltip title="Pen (P)">
                <CreateIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.ERASER}>
              <Tooltip title="Eraser (E)">
                <DeleteIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.CIRCLE}>
              <Tooltip title="Circle (C)">
                <RadioButtonUncheckedIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.RECTANGLE}>
              <Tooltip title="Rectangle (R)">
                <CropSquareIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.TRIANGLE}>
              <Tooltip title="Triangle (T)">
                <ChangeHistoryIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={TOOLS.TEXT}>
              <Tooltip title="Text (X)">
                <TextFieldsIcon />
              </Tooltip>
            </ToggleButton>
          </StyledToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'auto' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              Color:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {colors.map((c) => (
                <ColorButton
                  key={c}
                  color={c}
                  onClick={() => setColor(c)}
                  sx={{
                    width: 24,
                    height: 24,
                    boxShadow: color === c ? '0 0 0 2px #000' : 'none',
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            width: '200px',
            flexShrink: 1,
          }}>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              {brushSize}px
            </Typography>
            <Slider
              value={brushSize}
              onChange={(e, newValue) => setBrushSize(newValue)}
              min={1}
              max={50}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Undo (Ctrl+Z)">
              <span>
                <IconButton 
                  onClick={handleUndo} 
                  disabled={historyStep === 0}
                  size="small"
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Shift+Z)">
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
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Zoom In">
              <IconButton onClick={() => setScale(scale * 1.2)} size="small">
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton onClick={() => setScale(scale / 1.2)} size="small">
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={isFilled}
                onChange={(e) => setIsFilled(e.target.checked)}
                size="small"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FormatColorFillIcon fontSize="small" />
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>Fill</Typography>
              </Box>
            }
            sx={{ margin: 0 }}
          />
        </Paper>
      </Box>

      {/* Canvas Container */}
      <Box 
        sx={{ 
          flex: 1,
          position: 'relative',
          backgroundColor: '#ffffff',
          overflow: 'hidden'
        }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height - 80} 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
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
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === TOOLS.ERASER ? 'destination-out' : 'source-over'
                }
              />
            ))}
            {shapes.map((shape, i) => {
              const shapeProps = {
                key: i,
                x: shape.x,
                y: shape.y,
                stroke: shape.color,
                strokeWidth: shape.strokeWidth,
                fill: isFilled ? shape.color : 'transparent',
                draggable: tool === TOOLS.SELECT,
              };

              if (shape.type === TOOLS.RECTANGLE) {
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
          </Layer>
        </Stage>
      </Box>
    </Box>
  );
};

export default DrawingCanvas;