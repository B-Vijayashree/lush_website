import React, { useState } from 'react';
import { ELEMENTS_DATA } from '../../data/elementsData';
import { ElementDefinition, ElementCategory } from '../../types/garden';
import { useGardenStore } from '../../store/gardenStore';
import { Plus, Move, Compass, Waves, Footprints, Armchair, Fence } from 'lucide-react';

export const ElementLibrarySidebar: React.FC = () => {
  const { setPlacementModeItem, setIsLibraryOpen } = useGardenStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: { name: string; label: string; icon: any }[] = [
    { name: 'All', label: 'All Items', icon: Compass },
    { name: 'Pathways', label: 'Pathways', icon: Footprints },
    { name: 'Water', label: 'Water', icon: Waves },
    { name: 'Decoration', label: 'Decor', icon: Armchair },
    { name: 'Structures', label: 'Structures', icon: Fence },
  ];

  const filteredElements = ELEMENTS_DATA.filter(el => {
    if (selectedCategory === 'All') return true;
    return el.category === selectedCategory;
  });

  const handleQuickAdd = (el: ElementDefinition) => {
    setPlacementModeItem({ type: 'element', id: el.id });
    setIsLibraryOpen(false);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, el: ElementDefinition) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'element', id: el.id })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Category Pills */}
      <div className="p-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Elements */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 gap-2.5">
        {filteredElements.map(el => (
          <div
            key={el.id}
            draggable
            onDragStart={(e) => handleDragStart(e, el)}
            className="group relative bg-white rounded-2xl p-3 border border-slate-200 hover:border-emerald-600/30 hover:shadow-soft transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {el.category}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {el.width}m × {el.length}m
              </span>
            </div>

            <div className="relative w-full h-20 rounded-xl mb-2 overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200/60 border border-slate-200">
              <div
                className="w-12 h-10 rounded-lg shadow-sm flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: el.colorTheme || '#64748b' }}
              >
                {el.category[0]}
              </div>

              <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                <Move className="w-3.5 h-3.5" />
                <span>Drag to garden</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{el.name}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 mb-2">{el.description}</p>
            </div>

            <button
              onClick={() => handleQuickAdd(el)}
              className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Element</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
