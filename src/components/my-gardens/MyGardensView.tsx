import React, { useState, useEffect } from 'react';
import { GardenDesign } from '../../types/garden';
import { getSavedGardens, deleteGarden, duplicateGarden, saveGarden } from '../../utils/storage';
import { useGardenStore } from '../../store/gardenStore';
import { 
  FolderHeart, 
  Plus, 
  Calendar, 
  Trash2, 
  Copy, 
  ArrowRight, 
  Maximize2, 
  Sparkles 
} from 'lucide-react';

interface MyGardensViewProps {
  onOpenGarden: () => void;
  onNewGarden: () => void;
}

export const MyGardensView: React.FC<MyGardensViewProps> = ({ onOpenGarden, onNewGarden }) => {
  const { setGarden, garden: activeGarden } = useGardenStore();
  const [gardens, setGardens] = useState<GardenDesign[]>([]);

  useEffect(() => {
    setGardens(getSavedGardens());
  }, []);

  const handleSelect = (g: GardenDesign) => {
    setGarden(g);
    onOpenGarden();
  };

  const handleDuplicate = (g: GardenDesign, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = duplicateGarden(g);
    setGardens(getSavedGardens());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this garden design?')) {
      const updated = deleteGarden(id);
      setGardens(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-6 sm:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Saved Landscapes
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Gardens</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your saved layouts, duplicate variations, and explore preset landscape templates.
          </p>
        </div>

        <button
          onClick={onNewGarden}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-soft transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Garden</span>
        </button>
      </div>

      {/* Gardens Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gardens.map(g => {
          const isActive = g.id === activeGarden.id;
          const totalArea = (g.length * g.width).toFixed(1);
          const plantsCount = g.items.filter(i => i.type === 'plant').length;
          const elementsCount = g.items.filter(i => i.type === 'element').length;

          return (
            <div
              key={g.id}
              onClick={() => handleSelect(g)}
              className={`group relative bg-white rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-elevated ${
                isActive
                  ? 'border-emerald-700 ring-2 ring-emerald-700/20 shadow-soft'
                  : 'border-slate-200 hover:border-emerald-600/40'
              }`}
            >
              {/* Top Details */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    {g.length}m × {g.width}m • {totalArea} m²
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Active Design
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  {g.name}
                </h3>

                {g.notes && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {g.notes}
                  </p>
                )}
              </div>

              {/* Middle Stats Box */}
              <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-base font-bold text-emerald-900">{plantsCount}</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Plants Placed</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-base font-bold text-slate-800">{elementsCount}</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Hardscapes</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDuplicate(g, e)}
                    title="Duplicate design"
                    className="p-2 text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(g.id, e)}
                    title="Delete design"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
