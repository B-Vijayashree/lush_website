import React from 'react';
import { PlantDefinition } from '../../types/garden';
import { useGardenStore } from '../../store/gardenStore';
import { 
  Sun, 
  Droplets, 
  Thermometer, 
  Sprout, 
  Maximize2, 
  Calendar, 
  Compass, 
  HeartHandshake, 
  X, 
  Plus 
} from 'lucide-react';

interface PlantDetailModalProps {
  plant: PlantDefinition;
  isOpen: boolean;
  onClose: () => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({ plant, isOpen, onClose }) => {
  const { addItem, garden } = useGardenStore();

  if (!isOpen) return null;

  const handleAddToDesign = () => {
    const defaultX = Math.min(garden.length - 1, Math.max(1, garden.length / 2 + (Math.random() - 0.5) * 2));
    const defaultY = Math.min(garden.width - 1, Math.max(1, garden.width / 2 + (Math.random() - 0.5) * 2));
    addItem('plant', plant.id, defaultX, defaultY);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full text-emerald-100">
                {plant.category}
              </span>
              {plant.subCategory && (
                <span className="text-[10px] font-medium bg-emerald-700/40 px-2 py-0.5 rounded-full text-emerald-200">
                  {plant.subCategory}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold">{plant.name}</h2>
            <p className="text-xs italic text-emerald-200 font-serif mt-0.5">
              {plant.scientificName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Plant Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {plant.description}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                <Sun className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Sunlight</span>
              </div>
              <span className="text-xs font-bold text-slate-800">{plant.sunlight}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-sky-500 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Water</span>
              </div>
              <span className="text-xs font-bold text-slate-800">{plant.waterRequirement}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                <Sprout className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Growth</span>
              </div>
              <span className="text-xs font-bold text-slate-800">{plant.growthRate}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-indigo-500 mb-1">
                <Thermometer className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold text-slate-400">Temp</span>
              </div>
              <span className="text-xs font-bold text-slate-800 truncate block">{plant.temperature}</span>
            </div>
          </div>

          {/* Mature Size & Spacing Specifications */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-3">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-emerald-700" />
              <span>Dimensional & Spacing Criteria</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Mature Height</span>
                <span className="font-bold text-slate-800">{plant.matureHeight} m</span>
                <span className="text-[10px] text-slate-400 block">(Nursery: {plant.currentHeight}m)</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Mature Canopy Width</span>
                <span className="font-bold text-slate-800">{plant.matureCanopy} m diameter</span>
                <span className="text-[10px] text-slate-400 block">(Nursery: {plant.currentWidth}m)</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Recommended Distance</span>
                <span className="font-bold text-emerald-800">{plant.recommendedSpacing} m</span>
                <span className="text-[10px] text-slate-400 block">Center-to-center</span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/60 text-xs text-slate-600">
              <span className="font-semibold text-emerald-950">Root System:</span> {plant.rootSpread}
            </div>
          </div>

          {/* Environmental & Soil Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-700 block mb-1">Climate Suitability</span>
              <p className="text-slate-600">{plant.climate}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-700 block mb-1">Ideal Soil Type</span>
              <p className="text-slate-600">{plant.soil}</p>
            </div>
          </div>

          {/* Flowering & Fruiting Calendar */}
          {(plant.floweringSeason || plant.fruitingSeason) && (
            <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start gap-2.5 text-xs">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 block">Seasonal Schedule</span>
                {plant.floweringSeason && (
                  <p className="text-slate-700">🌸 <strong>Flowering:</strong> {plant.floweringSeason}</p>
                )}
                {plant.fruitingSeason && (
                  <p className="text-slate-700">🍎 <strong>Fruiting:</strong> {plant.fruitingSeason}</p>
                )}
              </div>
            </div>
          )}

          {/* Care & Maintenance Instructions */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
            <span className="font-bold text-slate-800 block flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-700" />
              Care & Maintenance Guide
            </span>
            <p className="text-slate-600 leading-relaxed">
              {plant.careInstructions}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Close
          </button>

          <button
            onClick={handleAddToDesign}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Garden Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
