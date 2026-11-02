import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGardenStore } from '../../store/gardenStore';
import { getPlantById, getElementById } from '../../utils/collisionDetector';
import { formatDistance } from '../../utils/unitConverter';
import { ZoomIn, ZoomOut, Maximize2, Move, RotateCw, Trash2, Copy, AlertTriangle } from 'lucide-react';

export const GardenCanvas2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    garden,
    selectedInstanceId,
    hoveredInstanceId,
    showGrid,
    showSpacingRings,
    showMeasurements,
    dragItem,
    setDragItem,
    placementModeItem,
    setPlacementModeItem,
    addItem,
    updateItemPosition,
    updateItemRotation,
    selectItem,
    setHoveredItem,
    duplicateItem,
    deleteItem,
    collisionResult,
  } = useGardenStore();

  // Viewport transforms (Zoom & Pan)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interaction modes: 'idle' | 'moving_item' | 'rotating_item'
  const [interactionMode, setInteractionMode] = useState<'idle' | 'moving_item' | 'rotating_item'>('idle');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mousePosGarden, setMousePosGarden] = useState<{ x: number; y: number } | null>(null);

  // Meter to Pixel scale
  // Base scale: fit garden comfortably inside container
  const [basePpm, setBasePpm] = useState<number>(50); // pixels per meter

  // Update base PPM based on container size
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const margin = 100;
      const scaleX = (clientWidth - margin) / garden.length;
      const scaleY = (clientHeight - margin) / garden.width;
      const calculatedPpm = Math.min(scaleX, scaleY, 75);
      setBasePpm(Math.max(25, calculatedPpm));
      setPan({
        x: (clientWidth - garden.length * calculatedPpm) / 2,
        y: (clientHeight - garden.width * calculatedPpm) / 2,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [garden.length, garden.width]);

  const ppm = basePpm * zoom;

  // Convert Garden (meters) to Canvas (pixels)
  const gardenToCanvas = useCallback((gx: number, gy: number) => {
    return {
      x: pan.x + gx * ppm,
      y: pan.y + gy * ppm,
    };
  }, [pan, ppm]);

  // Convert Canvas (pixels) to Garden (meters)
  const canvasToGarden = useCallback((cx: number, cy: number) => {
    return {
      x: (cx - pan.x) / ppm,
      y: (cy - pan.y) / ppm,
    };
  }, [pan, ppm]);

  // Draw 2D canvas scene
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Background outside garden
    ctx.fillStyle = '#f1f5f2';
    ctx.fillRect(0, 0, width, height);

    // Garden Lawn boundary
    const gardenCanvasOrigin = gardenToCanvas(0, 0);
    const gardenWidthPx = garden.length * ppm;
    const gardenHeightPx = garden.width * ppm;

    // Garden Drop Shadow
    ctx.shadowColor = 'rgba(27, 67, 50, 0.12)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;

    // Garden boundary fill (Lawn green)
    ctx.fillStyle = '#eaf5ed';
    ctx.fillRect(gardenCanvasOrigin.x, gardenCanvasOrigin.y, gardenWidthPx, gardenHeightPx);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Subtle grass texture lines or garden perimeter border
    ctx.strokeStyle = '#1b4332';
    ctx.lineWidth = 3;
    ctx.strokeRect(gardenCanvasOrigin.x, gardenCanvasOrigin.y, gardenWidthPx, gardenHeightPx);

    // Fence / Border decorative wood posts
    ctx.strokeStyle = '#2d6a4f';
    ctx.lineWidth = 1;

    // Grid lines & measurements
    if (showGrid) {
      ctx.strokeStyle = 'rgba(45, 106, 79, 0.1)';
      ctx.lineWidth = 1;

      // 1-meter grid
      for (let x = 0; x <= garden.length; x += 1) {
        const p1 = gardenToCanvas(x, 0);
        const p2 = gardenToCanvas(x, garden.width);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      for (let y = 0; y <= garden.width; y += 1) {
        const p1 = gardenToCanvas(0, y);
        const p2 = gardenToCanvas(garden.length, y);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // 5-meter accents
      ctx.strokeStyle = 'rgba(45, 106, 79, 0.25)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x <= garden.length; x += 5) {
        const p1 = gardenToCanvas(x, 0);
        const p2 = gardenToCanvas(x, garden.width);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      for (let y = 0; y <= garden.width; y += 5) {
        const p1 = gardenToCanvas(0, y);
        const p2 = gardenToCanvas(garden.length, y);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    // Ruler labels along garden top & left
    if (showMeasurements) {
      ctx.fillStyle = '#2d6a4f';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      for (let x = 0; x <= garden.length; x += (garden.length > 15 ? 2 : 1)) {
        const pos = gardenToCanvas(x, 0);
        ctx.fillText(`${x}m`, pos.x, pos.y - 6);
      }

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let y = 0; y <= garden.width; y += (garden.width > 15 ? 2 : 1)) {
        const pos = gardenToCanvas(0, y);
        ctx.fillText(`${y}m`, pos.x - 8, pos.y);
      }
    }

    // 1. Draw Hardscape Elements first (under plants)
    garden.items.filter(item => item.type === 'element').forEach(item => {
      const elDef = getElementById(item.itemId);
      if (!elDef) return;

      const pos = gardenToCanvas(item.x, item.y);
      const isSelected = item.instanceId === selectedInstanceId;
      const isHovered = item.instanceId === hoveredInstanceId;

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate((item.rotation * Math.PI) / 180);

      const wPx = elDef.width * ppm;
      const lPx = elDef.length * ppm;

      // Render based on element model type
      if (elDef.model3DType === 'path_stepping_stone') {
        // Natural curved stepping stones
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        const stonesCount = 3;
        const stepSpacing = lPx / (stonesCount + 0.5);
        for (let s = 0; s < stonesCount; s++) {
          const sy = -lPx / 2 + (s + 0.8) * stepSpacing;
          const sx = (s % 2 === 0 ? -1 : 1) * (wPx * 0.15);
          ctx.beginPath();
          ctx.ellipse(sx, sy, wPx * 0.4, wPx * 0.3, (s * 0.3), 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      } else if (elDef.model3DType === 'path_wood_deck') {
        // Wooden deck with planks
        ctx.fillStyle = '#b08968';
        ctx.fillRect(-wPx / 2, -lPx / 2, wPx, lPx);
        ctx.strokeStyle = '#7f5539';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-wPx / 2, -lPx / 2, wPx, lPx);
        // Planks lines
        const plankGap = 12;
        ctx.strokeStyle = 'rgba(100, 60, 30, 0.4)';
        for (let py = -lPx / 2 + plankGap; py < lPx / 2; py += plankGap) {
          ctx.beginPath();
          ctx.moveTo(-wPx / 2, py);
          ctx.lineTo(wPx / 2, py);
          ctx.stroke();
        }
      } else if (elDef.model3DType === 'water_pond') {
        // Natural curved pond
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(0, 0, wPx / 2, lPx / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        // Inner ripple
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, wPx * 0.35, lPx * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // General elements (bench, light, fountain, etc.)
        ctx.fillStyle = elDef.colorTheme || '#a8dadc';
        ctx.fillRect(-wPx / 2, -lPx / 2, wPx, lPx);
        ctx.strokeStyle = '#457b9d';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-wPx / 2, -lPx / 2, wPx, lPx);
      }

      // Selection indicator
      if (isSelected || isHovered) {
        ctx.strokeStyle = isSelected ? '#2563eb' : '#60a5fa';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-wPx / 2 - 4, -lPx / 2 - 4, wPx + 8, lPx + 8);
        ctx.setLineDash([]);
      }

      ctx.restore();
    });

    // 2. Draw Spacing & Mature Canopy Rings (if enabled)
    if (showSpacingRings) {
      garden.items.filter(i => i.type === 'plant').forEach(item => {
        const plantDef = getPlantById(item.itemId);
        if (!plantDef) return;

        const pos = gardenToCanvas(item.x, item.y);
        const status = collisionResult.itemStatusMap.get(item.instanceId) || 'safe';

        const matureRadiusPx = ((plantDef.matureCanopy || plantDef.matureWidth) / 2) * ppm;
        const recommendedRadiusPx = (plantDef.recommendedSpacing / 2) * ppm;

        // Color coding: Safe (Green), Warning (Yellow), Critical (Red)
        let ringColor = 'rgba(34, 197, 94, 0.35)'; // green
        let haloFill = 'rgba(34, 197, 94, 0.05)';
        if (status === 'warning') {
          ringColor = 'rgba(245, 158, 11, 0.7)'; // amber
          haloFill = 'rgba(245, 158, 11, 0.08)';
        } else if (status === 'critical') {
          ringColor = 'rgba(239, 68, 68, 0.85)'; // red
          haloFill = 'rgba(239, 68, 68, 0.12)';
        }

        // Mature canopy spread (dotted)
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, matureRadiusPx, 0, Math.PI * 2);
        ctx.fillStyle = haloFill;
        ctx.fill();
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = status === 'critical' ? 2 : 1.2;
        ctx.setLineDash(status === 'critical' ? [3, 3] : [6, 4]);
        ctx.stroke();

        // Recommended spacing boundary (fine solid line)
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, recommendedRadiusPx, 0, Math.PI * 2);
        ctx.strokeStyle = status === 'critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(45, 106, 79, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.restore();
      });
    }

    // 3. Draw Plants
    garden.items.filter(item => item.type === 'plant').forEach(item => {
      const plantDef = getPlantById(item.itemId);
      if (!plantDef) return;

      const pos = gardenToCanvas(item.x, item.y);
      const isSelected = item.instanceId === selectedInstanceId;
      const isHovered = item.instanceId === hoveredInstanceId;
      const status = collisionResult.itemStatusMap.get(item.instanceId) || 'safe';

      // Visual canopy radius (current size vs scaled mature)
      const currentRadiusPx = Math.max(12, ((plantDef.currentWidth || 0.6) / 2) * ppm);
      const matureRadiusPx = Math.max(14, ((plantDef.matureCanopy || plantDef.matureWidth) / 2) * ppm);
      // Blend 2D icon to give a realistic impression
      const displayRadiusPx = Math.min(matureRadiusPx, Math.max(currentRadiusPx, matureRadiusPx * 0.65));

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate((item.rotation * Math.PI) / 180);

      // Plant Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;

      // Realistic Botanical Canopy: Multi-layered lobes
      if (plantDef.category === 'Trees' || plantDef.category === 'Palms') {
        if (plantDef.category === 'Palms') {
          // Palm fronds radiating
          ctx.shadowColor = 'transparent';
          const fronds = 8;
          ctx.strokeStyle = plantDef.foliageColor || '#2d6a4f';
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          for (let f = 0; f < fronds; f++) {
            const angle = (f * Math.PI * 2) / fronds;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(
              Math.cos(angle + 0.2) * displayRadiusPx * 0.7,
              Math.sin(angle + 0.2) * displayRadiusPx * 0.7,
              Math.cos(angle) * displayRadiusPx,
              Math.sin(angle) * displayRadiusPx
            );
            ctx.stroke();
          }
          // Center palm crown
          ctx.fillStyle = '#1b4332';
          ctx.beginPath();
          ctx.arc(0, 0, displayRadiusPx * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Broadleaf / Spreading Tree (Layered organic lobes)
          const lobes = 7;
          ctx.fillStyle = plantDef.foliageColor || '#2d6a4f';
          ctx.beginPath();
          for (let i = 0; i < lobes; i++) {
            const angle = (i * Math.PI * 2) / lobes;
            const r = displayRadiusPx * (0.85 + (i % 2 === 0 ? 0.15 : -0.05));
            const lx = Math.cos(angle) * r;
            const ly = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(lx, ly);
            else ctx.lineTo(lx, ly);
          }
          ctx.closePath();
          ctx.fill();

          // Inner foliage highlight layer
          ctx.fillStyle = plantDef.colorTheme || '#52b788';
          ctx.beginPath();
          ctx.arc(0, 0, displayRadiusPx * 0.55, 0, Math.PI * 2);
          ctx.fill();

          // Trunk core
          ctx.fillStyle = plantDef.trunkColor || '#4a3728';
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(3, displayRadiusPx * 0.18), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (plantDef.category === 'Flower Plants') {
        // Flower bush with radiating petals / blossom accent
        ctx.fillStyle = plantDef.foliageColor || '#2d6a4f';
        ctx.beginPath();
        ctx.arc(0, 0, displayRadiusPx, 0, Math.PI * 2);
        ctx.fill();

        // Blossoms
        const petals = 5;
        ctx.fillStyle = plantDef.flowerColor || '#e63946';
        for (let p = 0; p < petals; p++) {
          const pAngle = (p * Math.PI * 2) / petals;
          const px = Math.cos(pAngle) * (displayRadiusPx * 0.55);
          const py = Math.sin(pAngle) * (displayRadiusPx * 0.55);
          ctx.beginPath();
          ctx.arc(px, py, displayRadiusPx * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
        // Blossom center
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, displayRadiusPx * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else if (plantDef.category === 'Vegetables') {
        // Vegetable garden mound with produce indicator
        ctx.fillStyle = '#386641';
        ctx.beginPath();
        ctx.arc(0, 0, displayRadiusPx, 0, Math.PI * 2);
        ctx.fill();
        // Vegetable color accent
        ctx.fillStyle = plantDef.colorTheme || '#e63946';
        ctx.beginPath();
        ctx.arc(0, 0, displayRadiusPx * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Shrubs, Herbs, Grass, Water plants
        ctx.fillStyle = plantDef.foliageColor || '#2d6a4f';
        ctx.beginPath();
        ctx.arc(0, 0, displayRadiusPx, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = plantDef.colorTheme || '#52b788';
        ctx.beginPath();
        ctx.arc(0, 0, displayRadiusPx * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowColor = 'transparent';

      // Forward direction pointer (rotation indicator)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -displayRadiusPx * 0.85);
      ctx.stroke();

      // Selection ring & Rotation Handle
      if (isSelected) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, displayRadiusPx + 4, 0, Math.PI * 2);
        ctx.stroke();

        // Rotation control stem & knob
        ctx.beginPath();
        ctx.moveTo(0, -(displayRadiusPx + 4));
        ctx.lineTo(0, -(displayRadiusPx + 20));
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(0, -(displayRadiusPx + 20), 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -(displayRadiusPx + 20), 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (isHovered) {
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, displayRadiusPx + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Collision warning icon above plant if warning/critical
      if (status !== 'safe') {
        ctx.fillStyle = status === 'critical' ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(displayRadiusPx * 0.6, -displayRadiusPx * 0.6, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', displayRadiusPx * 0.6, -displayRadiusPx * 0.6);
      }

      ctx.restore();

      // Plant label (if selected or hovered)
      if (isSelected || isHovered) {
        ctx.fillStyle = '#1e293b';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(plantDef.name, pos.x, pos.y + displayRadiusPx + 8);

        // Coordinates display
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`X: ${item.x.toFixed(1)}m, Y: ${item.y.toFixed(1)}m`, pos.x, pos.y + displayRadiusPx + 22);
      }
    });

    // 4. Distance Lines between selected plant and closest neighbors
    if (selectedInstanceId) {
      const selected = garden.items.find(i => i.instanceId === selectedInstanceId);
      if (selected && selected.type === 'plant') {
        const selPos = gardenToCanvas(selected.x, selected.y);

        // Draw line to other plants within 8 meters
        garden.items
          .filter(i => i.instanceId !== selected.instanceId && i.type === 'plant')
          .forEach(other => {
            const dist = Math.sqrt(Math.pow(selected.x - other.x, 2) + Math.pow(selected.y - other.y, 2));
            if (dist <= 8.0) {
              const otherPos = gardenToCanvas(other.x, other.y);
              ctx.strokeStyle = 'rgba(75, 85, 99, 0.4)';
              ctx.lineWidth = 1;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(selPos.x, selPos.y);
              ctx.lineTo(otherPos.x, otherPos.y);
              ctx.stroke();
              ctx.setLineDash([]);

              // Distance badge on midpoint
              const midX = (selPos.x + otherPos.x) / 2;
              const midY = (selPos.y + otherPos.y) / 2;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.fillRect(midX - 22, midY - 9, 44, 18);
              ctx.strokeStyle = '#cbd5e1';
              ctx.lineWidth = 1;
              ctx.strokeRect(midX - 22, midY - 9, 44, 18);

              ctx.fillStyle = '#0f172a';
              ctx.font = 'bold 9px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(`${dist.toFixed(1)} m`, midX, midY);
            }
          });
      }
    }

    // 5. Ghost Cursor Preview in Click-to-Place Mode
    if (placementModeItem && mousePosGarden) {
      const isClampedX = Math.max(0.4, Math.min(garden.length - 0.4, mousePosGarden.x));
      const isClampedY = Math.max(0.4, Math.min(garden.width - 0.4, mousePosGarden.y));
      const ghostPos = gardenToCanvas(isClampedX, isClampedY);
      const isPlant = placementModeItem.type === 'plant';
      const plantDef = isPlant ? getPlantById(placementModeItem.id) : null;
      const elDef = !isPlant ? getElementById(placementModeItem.id) : null;

      ctx.save();
      ctx.translate(ghostPos.x, ghostPos.y);

      if (isPlant && plantDef) {
        const matureRadiusPx = ((plantDef.matureCanopy || plantDef.matureWidth) / 2) * ppm;
        const currentRadiusPx = Math.max(14, ((plantDef.currentWidth || 0.6) / 2) * ppm);

        // Mature spread halo
        ctx.beginPath();
        ctx.arc(0, 0, matureRadiusPx, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();

        // Canopy
        ctx.beginPath();
        ctx.arc(0, 0, currentRadiusPx, 0, Math.PI * 2);
        ctx.fillStyle = plantDef.foliageColor ? `${plantDef.foliageColor}bb` : 'rgba(45, 106, 79, 0.7)';
        ctx.fill();

        // Label
        ctx.fillStyle = '#1b4332';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Touch / Click to Plant: ${plantDef.name}`, 0, matureRadiusPx + 18);
      } else if (elDef) {
        const wPx = elDef.width * ppm;
        const lPx = elDef.length * ppm;
        ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
        ctx.fillRect(-wPx / 2, -lPx / 2, wPx, lPx);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-wPx / 2, -lPx / 2, wPx, lPx);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Touch / Click to Place: ${elDef.name}`, 0, lPx / 2 + 18);
      }
      ctx.restore();
    }

    ctx.restore();
  }, [
    garden,
    selectedInstanceId,
    hoveredInstanceId,
    showGrid,
    showSpacingRings,
    showMeasurements,
    placementModeItem,
    mousePosGarden,
    ppm,
    gardenToCanvas,
    collisionResult,
  ]);

  // Keep canvas rendered
  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
      drawScene();
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [drawScene]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth * dpr;
      canvasRef.current.height = clientHeight * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse / Touch Event Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const gardenCoords = canvasToGarden(cx, cy);

    // 1. Click-to-Place Mode: Touching/clicking anywhere immediately plants at that spot!
    if (placementModeItem) {
      const clampedX = Math.max(0.4, Math.min(garden.length - 0.4, Number(gardenCoords.x.toFixed(2))));
      const clampedY = Math.max(0.4, Math.min(garden.width - 0.4, Number(gardenCoords.y.toFixed(2))));
      const newInstanceId = addItem(placementModeItem.type, placementModeItem.id, clampedX, clampedY);
      selectItem(newInstanceId);
      setPlacementModeItem(null);
      setInteractionMode('moving_item');
      setActiveItemId(newInstanceId);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    // Check if middle button or Space is held for panning
    if (e.button === 1 || e.altKey || e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    // Check if clicking rotation handle on selected item
    if (selectedInstanceId) {
      const selected = garden.items.find(i => i.instanceId === selectedInstanceId);
      if (selected) {
        const plantDef = selected.type === 'plant' ? getPlantById(selected.itemId) : null;
        const radius = plantDef ? ((plantDef.matureCanopy || plantDef.matureWidth) / 2) : 1;
        const displayRadius = Math.max(14 / ppm, radius * 0.65);
        const handleDist = displayRadius + 20 / ppm;

        const rad = (selected.rotation * Math.PI) / 180;
        const handleGx = selected.x + Math.sin(rad) * handleDist;
        const handleGy = selected.y - Math.cos(rad) * handleDist;

        const distToHandle = Math.sqrt(Math.pow(gardenCoords.x - handleGx, 2) + Math.pow(gardenCoords.y - handleGy, 2));
        if (distToHandle <= 16 / ppm) {
          setInteractionMode('rotating_item');
          setActiveItemId(selected.instanceId);
          return;
        }
      }
    }

    // Check hit on placed items (top-most first)
    const reversedItems = [...garden.items].reverse();
    const hitItem = reversedItems.find(item => {
      if (item.type === 'plant') {
        const def = getPlantById(item.itemId);
        const radius = def ? Math.max(0.4, (def.matureCanopy || def.matureWidth) / 2 * 0.7) : 0.5;
        const dist = Math.sqrt(Math.pow(gardenCoords.x - item.x, 2) + Math.pow(gardenCoords.y - item.y, 2));
        return dist <= radius;
      } else {
        const def = getElementById(item.itemId);
        const hw = (def?.width || 1) / 2;
        const hl = (def?.length || 1) / 2;
        return (
          gardenCoords.x >= item.x - hw &&
          gardenCoords.x <= item.x + hw &&
          gardenCoords.y >= item.y - hl &&
          gardenCoords.y <= item.y + hl
        );
      }
    });

    if (hitItem) {
      selectItem(hitItem.instanceId);
      setInteractionMode('moving_item');
      setActiveItemId(hitItem.instanceId);
      setDragOffset({
        x: gardenCoords.x - hitItem.x,
        y: gardenCoords.y - hitItem.y,
      });
    } else {
      // Clicked on empty canvas space -> deselect or start panning
      selectItem(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const gardenCoords = canvasToGarden(cx, cy);

    setMousePosGarden({
      x: Number(gardenCoords.x.toFixed(2)),
      y: Number(gardenCoords.y.toFixed(2)),
    });

    // Panning
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    // Moving selected item
    if (interactionMode === 'moving_item' && activeItemId) {
      const newX = gardenCoords.x - dragOffset.x;
      const newY = gardenCoords.y - dragOffset.y;
      updateItemPosition(activeItemId, newX, newY);
      return;
    }

    // Rotating selected item
    if (interactionMode === 'rotating_item' && activeItemId) {
      const item = garden.items.find(i => i.instanceId === activeItemId);
      if (item) {
        const dx = gardenCoords.x - item.x;
        const dy = gardenCoords.y - item.y;
        // 0 deg is North (dy < 0)
        let angleDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;
        if (angleDeg < 0) angleDeg += 360;
        updateItemRotation(activeItemId, Math.round(angleDeg));
      }
      return;
    }

    // Hover detection
    const reversedItems = [...garden.items].reverse();
    const hovered = reversedItems.find(item => {
      const dist = Math.sqrt(Math.pow(gardenCoords.x - item.x, 2) + Math.pow(gardenCoords.y - item.y, 2));
      return dist <= 0.8;
    });
    setHoveredItem(hovered?.instanceId || null);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setInteractionMode('idle');
    setActiveItemId(null);
  };

  // Touch Handlers for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = touch.clientX - rect.left;
      const cy = touch.clientY - rect.top;
      const gardenCoords = canvasToGarden(cx, cy);

      // 1. Click-to-Place Mode with Touch
      if (placementModeItem) {
        const clampedX = Math.max(0.4, Math.min(garden.length - 0.4, Number(gardenCoords.x.toFixed(2))));
        const clampedY = Math.max(0.4, Math.min(garden.width - 0.4, Number(gardenCoords.y.toFixed(2))));
        const newInstanceId = addItem(placementModeItem.type, placementModeItem.id, clampedX, clampedY);
        selectItem(newInstanceId);
        setPlacementModeItem(null);
        setInteractionMode('moving_item');
        setActiveItemId(newInstanceId);
        setDragOffset({ x: 0, y: 0 });
        return;
      }

      // Check hit on placed items
      const reversedItems = [...garden.items].reverse();
      const hitItem = reversedItems.find(item => {
        if (item.type === 'plant') {
          const def = getPlantById(item.itemId);
          const radius = def ? Math.max(0.4, (def.matureCanopy || def.matureWidth) / 2 * 0.7) : 0.5;
          const dist = Math.sqrt(Math.pow(gardenCoords.x - item.x, 2) + Math.pow(gardenCoords.y - item.y, 2));
          return dist <= radius;
        } else {
          const def = getElementById(item.itemId);
          const hw = (def?.width || 1) / 2;
          const hl = (def?.length || 1) / 2;
          return (
            gardenCoords.x >= item.x - hw &&
            gardenCoords.x <= item.x + hw &&
            gardenCoords.y >= item.y - hl &&
            gardenCoords.y <= item.y + hl
          );
        }
      });

      if (hitItem) {
        selectItem(hitItem.instanceId);
        setInteractionMode('moving_item');
        setActiveItemId(hitItem.instanceId);
        setDragOffset({
          x: gardenCoords.x - hitItem.x,
          y: gardenCoords.y - hitItem.y,
        });
      } else {
        selectItem(null);
        setIsPanning(true);
        setPanStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = touch.clientX - rect.left;
      const cy = touch.clientY - rect.top;
      const gardenCoords = canvasToGarden(cx, cy);

      setMousePosGarden({
        x: Number(gardenCoords.x.toFixed(2)),
        y: Number(gardenCoords.y.toFixed(2)),
      });

      if (isPanning) {
        setPan({
          x: touch.clientX - panStart.x,
          y: touch.clientY - panStart.y,
        });
      } else if (interactionMode === 'moving_item' && activeItemId) {
        const newX = gardenCoords.x - dragOffset.x;
        const newY = gardenCoords.y - dragOffset.y;
        updateItemPosition(activeItemId, newX, newY);
      }
    }
  };

  // Keyboard shortcut listener (Escape to cancel placement or deselect)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlacementModeItem(null);
        selectItem(null);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedInstanceId) {
          deleteItem(selectedInstanceId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInstanceId, setPlacementModeItem, selectItem, deleteItem]);

  // Zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prev => Math.min(3.0, Math.max(0.3, Number((prev * delta).toFixed(2)))));
  };

  // HTML5 Drag & Drop from Library Sidebar
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const gardenCoords = canvasToGarden(cx, cy);

    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (rawData) {
        const data = JSON.parse(rawData);
        if (data && data.id && data.type) {
          const clampedX = Math.max(0.5, Math.min(garden.length - 0.5, gardenCoords.x));
          const clampedY = Math.max(0.5, Math.min(garden.width - 0.5, gardenCoords.y));
          addItem(data.type, data.id, clampedX, clampedY);
        }
      }
    } catch (err) {
      console.error('Error dropping item on canvas', err);
    }
  };

  // Quick Zoom buttons
  const zoomIn = () => setZoom(z => Math.min(3.0, Number((z + 0.15).toFixed(2))));
  const zoomOut = () => setZoom(z => Math.max(0.3, Number((z - 0.15).toFixed(2))));
  const resetZoom = () => {
    setZoom(1);
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setPan({
      x: (clientWidth - garden.length * basePpm) / 2,
      y: (clientHeight - garden.width * basePpm) / 2,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#f1f5f2] select-none"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />

      {/* Click-to-Place Mode Top Notification Banner */}
      {placementModeItem && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-emerald-950/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl shadow-elevated text-xs font-semibold border border-emerald-400/50 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {placementModeItem.type === 'plant'
              ? `Placing: ${getPlantById(placementModeItem.id)?.name || 'Plant'} — Touch or click anywhere to plant!`
              : `Placing: ${getElementById(placementModeItem.id)?.name || 'Element'} — Touch or click anywhere to place!`}
          </span>
          <button
            onClick={() => setPlacementModeItem(null)}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[11px] font-bold transition ml-2"
          >
            Cancel (Esc)
          </button>
        </div>
      )}

      {/* Floating Canvas Controls (Bottom-Left) */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-soft border border-emerald-900/10">
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="p-1.5 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-slate-600 min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="p-1.5 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-200 mx-1" />
        <button
          onClick={resetZoom}
          title="Reset View"
          className="p-1.5 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Real-world Mouse Coordinates Badge (Bottom-Right) */}
      <div className="absolute bottom-5 right-5 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-soft border border-emerald-900/10 text-xs font-medium text-slate-600 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Garden:</span>
          <span className="font-semibold text-emerald-900">{garden.length}m × {garden.width}m</span>
        </div>
        {mousePosGarden && (
          <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
            <span className="text-slate-400">Cursor:</span>
            <span className="font-mono text-emerald-800">
              X: {mousePosGarden.x}m, Y: {mousePosGarden.y}m
            </span>
          </div>
        )}
      </div>

      {/* Context Action Overlay for Selected Item */}
      {selectedInstanceId && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-elevated border border-emerald-700/15">
          <div className="text-xs font-semibold text-emerald-950 pr-2 border-r border-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Selected
          </div>
          <button
            onClick={() => {
              const item = garden.items.find(i => i.instanceId === selectedInstanceId);
              if (item) updateItemRotation(selectedInstanceId, (item.rotation + 45) % 360);
            }}
            title="Rotate 45°"
            className="flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded-lg transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Rotate
          </button>
          <button
            onClick={() => duplicateItem(selectedInstanceId)}
            title="Duplicate"
            className="flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded-lg transition"
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicate
          </button>
          <button
            onClick={() => deleteItem(selectedInstanceId)}
            title="Delete"
            className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
