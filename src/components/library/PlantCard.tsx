import React from 'react';
import { PlantDefinition } from '../../types/garden';
import { Sun, Droplets, Info, Plus, Move } from 'lucide-react';

interface PlantCardProps {
  plant: PlantDefinition;
  onSelectInfo: (plant: PlantDefinition) => void;
  onQuickAdd: (plant: PlantDefinition) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onSelectInfo,
  onQuickAdd,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'plant', id: plant.id })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group relative bg-white rounded-2xl p-3 border border-emerald-900/10 hover:border-emerald-600/30 hover:shadow-soft transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col justify-between"
    >
      {/* Top Header: Category & Info button */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
          {plant.category}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectInfo(plant);
          }}
          className="text-slate-400 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded-lg transition"
          title="View Botanical Encyclopedia Details"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visual Botanical Icon / Color Theme representation */}
      <div className="relative w-full h-24 rounded-xl mb-2.5 overflow-hidden flex items-center justify-center bg-gradient-to-b from-emerald-50/70 to-emerald-100/40 border border-emerald-900/5 group-hover:scale-[1.02] transition-transform">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
          style={{
            backgroundColor: plant.foliageColor || '#2d6a4f',
            border: `3px solid ${plant.flowerColor || plant.colorTheme || '#52b788'}`,
          }}
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: plant.flowerColor || '#ffffff', opacity: 0.85 }}
          />
        </div>

        {/* Drag Hint on Hover */}
        <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
          <Move className="w-3.5 h-3.5" />
          <span>Drag into garden</span>
        </div>
      </div>

      {/* Plant Name & Scientific Name */}
      <div className="mb-2">
        <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 line-clamp-1 transition-colors">
          {plant.name}
        </h4>
        <p className="text-[11px] italic text-slate-500 line-clamp-1 font-serif">
          {plant.scientificName}
        </p>
      </div>

      {/* Key Metrics: Sunlight & Water */}
      <div className="grid grid-cols-2 gap-1 mb-2.5 py-1.5 px-2 bg-slate-50 rounded-xl text-[10px] font-medium text-slate-600">
        <div className="flex items-center gap-1">
          <Sun className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="truncate">{plant.sunlight}</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-sky-500 shrink-0" />
          <span className="truncate">{plant.waterRequirement}</span>
        </div>
      </div>

      {/* Mature Spread & Height Specifications */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3 px-1">
        <div>
          <span className="text-slate-400 block text-[9px] uppercase">Mature Spread</span>
          <span className="font-semibold text-emerald-950">{plant.matureCanopy}m canopy</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block text-[9px] uppercase">Mature Height</span>
          <span className="font-semibold text-emerald-950">{plant.matureHeight}m</span>
        </div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => onQuickAdd(plant)}
        className="w-full py-1.5 px-3 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add to Design</span>
      </button>
    </div>
  );
};
