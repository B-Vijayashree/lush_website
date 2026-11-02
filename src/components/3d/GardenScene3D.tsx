import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGardenStore } from '../../store/gardenStore';
import { GardenTerrain } from './GardenTerrain';
import { Plant3DModel } from './Plant3DModel';
import { Element3DModel } from './Element3DModel';
import { CameraControls3D } from './CameraControls3D';
import { CameraPreset, EnvironmentLighting } from '../../types/garden';
import { getPlantById, getElementById } from '../../utils/collisionDetector';
import { 
  Compass, 
  Sun, 
  Sunset, 
  Moon, 
  Rotate3d, 
  ArrowUp, 
  Eye, 
  Layers 
} from 'lucide-react';

export const GardenScene3D: React.FC = () => {
  const {
    garden,
    selectedInstanceId,
    cameraPreset,
    setCameraPreset,
    environmentLighting,
    setEnvironmentLighting,
    collisionResult,
    selectItem,
    placementModeItem,
    setPlacementModeItem,
  } = useGardenStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (placementModeItem) {
          setPlacementModeItem(null);
        } else if (selectedInstanceId) {
          selectItem(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [placementModeItem, selectedInstanceId, setPlacementModeItem, selectItem]);

  const handleBackgroundClick = () => {
    if (!placementModeItem) {
      selectItem(null);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-100 via-emerald-50 to-[#dcfce7] overflow-hidden select-none">
      {/* Click-to-Place Mode Top Notification Banner in 3D */}
      {placementModeItem && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-emerald-950/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl shadow-elevated text-xs font-semibold border border-emerald-400/50 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {placementModeItem.type === 'plant'
              ? `Placing: ${getPlantById(placementModeItem.id)?.name || 'Plant'} — Touch or click anywhere on the lawn to plant!`
              : `Placing: ${getElementById(placementModeItem.id)?.name || 'Element'} — Touch or click anywhere on the lawn to place!`}
          </span>
          <button
            onClick={() => setPlacementModeItem(null)}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[11px] font-bold transition ml-2"
          >
            Cancel (Esc)
          </button>
        </div>
      )}
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [garden.length * 0.9, garden.width * 0.7, garden.length * 0.9], fov: 45 }}
        onPointerDown={handleBackgroundClick}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GardenTerrain length={garden.length} width={garden.width} />

          {/* Render All Garden Items in 3D */}
          {garden.items.map(item => {
            const isSelected = item.instanceId === selectedInstanceId;
            const status = collisionResult.itemStatusMap.get(item.instanceId) || 'safe';

            if (item.type === 'plant') {
              return (
                <Plant3DModel
                  key={item.instanceId}
                  item={item}
                  isSelected={isSelected}
                  status={status}
                  gardenLength={garden.length}
                  gardenWidth={garden.width}
                />
              );
            } else {
              return (
                <Element3DModel
                  key={item.instanceId}
                  item={item}
                  isSelected={isSelected}
                  gardenLength={garden.length}
                  gardenWidth={garden.width}
                />
              );
            }
          })}

          <CameraControls3D
            preset={cameraPreset}
            gardenLength={garden.length}
            gardenWidth={garden.width}
          />
        </Suspense>
      </Canvas>

      {/* Floating 3D Camera Controls Bar (Top Center) */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-soft border border-emerald-900/10">
        <span className="text-[11px] font-semibold text-emerald-900/60 uppercase tracking-wider px-2 border-r border-slate-200">
          Camera
        </span>
        <button
          onClick={() => setCameraPreset('orbit')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
            cameraPreset === 'orbit'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50'
          }`}
          title="360° Free Orbit View"
        >
          <Rotate3d className="w-3.5 h-3.5" />
          360° Orbit
        </button>

        <button
          onClick={() => setCameraPreset('top')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
            cameraPreset === 'top'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50'
          }`}
          title="Top Down Plan View"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          Top View
        </button>

        <button
          onClick={() => setCameraPreset('front')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
            cameraPreset === 'front'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50'
          }`}
          title="Front Street/Entrance View"
        >
          <Eye className="w-3.5 h-3.5" />
          Front View
        </button>

        <button
          onClick={() => setCameraPreset('side')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
            cameraPreset === 'side'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50'
          }`}
          title="Side Profile View"
        >
          <Layers className="w-3.5 h-3.5" />
          Side View
        </button>

        <button
          onClick={() => setCameraPreset('birds_eye')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
            cameraPreset === 'birds_eye'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50'
          }`}
          title="Dramatic Bird's Eye Perspective"
        >
          <Compass className="w-3.5 h-3.5" />
          Bird's Eye
        </button>
      </div>

      {/* Time of Day Lighting Toggle (Bottom Left) */}
      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-soft border border-emerald-900/10">
        <button
          onClick={() => setEnvironmentLighting('day')}
          className={`p-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
            environmentLighting === 'day'
              ? 'bg-amber-100 text-amber-900 font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Daytime Sun"
        >
          <Sun className="w-4 h-4 text-amber-500" />
          Day
        </button>
        <button
          onClick={() => setEnvironmentLighting('golden_hour')}
          className={`p-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
            environmentLighting === 'golden_hour'
              ? 'bg-orange-100 text-orange-900 font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Golden Hour Sunset"
        >
          <Sunset className="w-4 h-4 text-orange-500" />
          Sunset
        </button>
        <button
          onClick={() => setEnvironmentLighting('night')}
          className={`p-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
            environmentLighting === 'night'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Moonlight & Solar Lights"
        >
          <Moon className="w-4 h-4 text-indigo-400" />
          Night
        </button>
      </div>

      {/* 3D Navigation Hint Pill (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-20 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-soft border border-emerald-900/10 text-xs text-slate-600 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Drag to rotate 360° • Scroll to zoom • Right-click to pan</span>
      </div>
    </div>
  );
};
