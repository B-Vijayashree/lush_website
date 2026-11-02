import React from 'react';
import { useGardenStore } from '../../store/gardenStore';
import { PlantDefinition } from '../../types/garden';
import { 
  Sun, 
  Droplets, 
  Thermometer, 
  Sparkles, 
  RotateCw, 
  Copy, 
  Trash2, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Maximize2
} from 'lucide-react';

interface PropertiesPanelProps {
  onOpenPlantInfo: (plant: PlantDefinition) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ onOpenPlantInfo }) => {
  const {
    garden,
    selectedItem,
    selectedPlantDef,
    selectedElementDef,
    updateItemPosition,
    updateItemRotation,
    duplicateItem,
    deleteItem,
    selectItem,
    collisionResult,
  } = useGardenStore();

  if (!selectedItem) {
    // Default Garden Info Panel
    const totalPlants = garden.items.filter(i => i.type === 'plant').length;
    const totalElements = garden.items.filter(i => i.type === 'element').length;

    return (
      <div className="w-full h-full bg-white flex flex-col p-4 overflow-y-auto">
        <div className="mb-4 pb-3 border-b border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
            Garden Overview
          </span>
          <h3 className="text-base font-bold text-slate-800 mt-1.5">{garden.name}</h3>
          <p className="text-xs text-slate-500">
            {garden.length}m × {garden.width}m ({(garden.length * garden.width).toFixed(1)} m²)
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div className="text-xs font-semibold text-slate-600 mb-2">Inventory</div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-lg font-bold text-emerald-900">{totalPlants}</span>
                <span className="block text-[10px] text-slate-500 uppercase font-medium">Plants</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-lg font-bold text-emerald-900">{totalElements}</span>
                <span className="block text-[10px] text-slate-500 uppercase font-medium">Elements</span>
              </div>
            </div>
          </div>

          {/* Collision / Spacing Summary */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
              <span>Spacing Health</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  collisionResult.warnings.length === 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {collisionResult.warnings.length === 0 ? 'All Safe' : `${collisionResult.warnings.length} Alerts`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {collisionResult.warnings.length === 0
                ? 'All plants have adequate room for mature root spread and sun exposure.'
                : 'Some plants are placed close together and may crowd each other as they mature.'}
            </p>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-900">
            <span className="font-semibold block mb-1">💡 Quick Tip</span>
            Select any plant or element on the garden canvas to inspect its mature spread, adjust position, or rotate.
          </div>
        </div>
      </div>
    );
  }

  const isPlant = selectedItem.type === 'plant';
  const status = collisionResult.itemStatusMap.get(selectedItem.instanceId) || 'safe';
  const neighborInfo = collisionResult.nearestNeighborDistance.get(selectedItem.instanceId);

  // Relevant warnings for this item
  const itemWarnings = collisionResult.warnings.filter(
    w => w.item1InstanceId === selectedItem.instanceId || w.item2InstanceId === selectedItem.instanceId
  );

  return (
    <div className="w-full h-full bg-white flex flex-col p-4 overflow-y-auto">
      {/* Top Header with Close */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
          {isPlant ? selectedPlantDef?.category : selectedElementDef?.category}
        </span>
        <button
          onClick={() => selectItem(null)}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition"
        >
          Deselect
        </button>
      </div>

      {/* Item Title & Names */}
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-800">
          {isPlant ? selectedPlantDef?.name : selectedElementDef?.name}
        </h3>
        {isPlant && (
          <p className="text-xs italic text-slate-500 font-serif">
            {selectedPlantDef?.scientificName}
          </p>
        )}
      </div>

      {/* Spacing / Collision Alert Box */}
      {isPlant && (
        <div
          className={`p-3 rounded-2xl mb-3 border text-xs leading-relaxed ${
            status === 'critical'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : status === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {status === 'critical' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : status === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>
              {status === 'critical'
                ? 'Severe Future Crowding'
                : status === 'warning'
                ? 'Close Spacing Warning'
                : 'Optimal Planting Distance'}
            </span>
          </div>

          {itemWarnings.length > 0 ? (
            <div className="space-y-1 mt-1 text-[11px]">
              {itemWarnings.map(w => (
                <p key={w.id} className="opacity-90">
                  {w.message}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-[11px] opacity-90">
              Safe spacing from adjacent plants. Canopy and root zones have ample space.
            </p>
          )}

          {neighborInfo && (
            <div className="mt-2 pt-2 border-t border-current/10 flex justify-between text-[10px] font-semibold">
              <span>Nearest: {neighborInfo.neighborName}</span>
              <span>{neighborInfo.distance}m away</span>
            </div>
          )}
        </div>
      )}

      {/* Coordinates & Rotation Controls */}
      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-3 space-y-2.5">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>Position & Orientation</span>
        </div>

        {/* X and Y Inputs */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
              X (East/West)
            </label>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
              <input
                type="number"
                step="0.1"
                min="0"
                max={garden.length}
                value={selectedItem.x}
                onChange={(e) => updateItemPosition(selectedItem.instanceId, parseFloat(e.target.value) || 0, selectedItem.y)}
                className="w-full text-xs font-mono font-semibold text-slate-700 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">m</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
              Y (North/South)
            </label>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
              <input
                type="number"
                step="0.1"
                min="0"
                max={garden.width}
                value={selectedItem.y}
                onChange={(e) => updateItemPosition(selectedItem.instanceId, selectedItem.x, parseFloat(e.target.value) || 0)}
                className="w-full text-xs font-mono font-semibold text-slate-700 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">m</span>
            </div>
          </div>
        </div>

        {/* Rotation Slider */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
            <span>Rotation Angle</span>
            <span className="font-mono text-emerald-800">{selectedItem.rotation}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={selectedItem.rotation}
            onChange={(e) => updateItemRotation(selectedItem.instanceId, parseInt(e.target.value, 10))}
            className="w-full accent-emerald-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Size Comparison (Current vs Mature) */}
      {isPlant && selectedPlantDef && (
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-3 space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Growth Space Calculation</span>
          </div>

          {/* Height Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Height</span>
              <span className="font-semibold text-slate-700">
                {selectedPlantDef.currentHeight}m &rarr; {selectedPlantDef.matureHeight}m
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-400 h-full"
                style={{ width: `${Math.min(100, (selectedPlantDef.currentHeight / selectedPlantDef.matureHeight) * 100)}%` }}
                title="Current Height"
              />
              <div className="bg-emerald-700/40 h-full flex-1" title="Mature Potential" />
            </div>
          </div>

          {/* Canopy Width Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Canopy Spread</span>
              <span className="font-semibold text-slate-700">
                {selectedPlantDef.currentWidth}m &rarr; {selectedPlantDef.matureCanopy}m
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${Math.min(100, (selectedPlantDef.currentWidth / selectedPlantDef.matureCanopy) * 100)}%` }}
                title="Current Width"
              />
              <div className="bg-emerald-800/40 h-full flex-1" title="Mature Canopy" />
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-200 flex justify-between">
            <span>Recommended Spacing:</span>
            <span className="font-bold text-emerald-900">{selectedPlantDef.recommendedSpacing}m</span>
          </div>
        </div>
      )}

      {/* Biological Metrics */}
      {isPlant && selectedPlantDef && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="text-[9px] uppercase text-slate-400 block">Sunlight</span>
              <span className="font-semibold text-slate-700 truncate block">{selectedPlantDef.sunlight}</span>
            </div>
          </div>

          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
            <div>
              <span className="text-[9px] uppercase text-slate-400 block">Water</span>
              <span className="font-semibold text-slate-700 truncate block">{selectedPlantDef.waterRequirement}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto pt-3 border-t border-slate-100 space-y-2">
        {isPlant && selectedPlantDef && (
          <button
            onClick={() => onOpenPlantInfo(selectedPlantDef)}
            className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Botanical Encyclopedia Profile</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => duplicateItem(selectedItem.instanceId)}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={() => deleteItem(selectedItem.instanceId)}
            className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
