import React, { useState, useMemo } from 'react';
import { PLANTS_DATA, PLANT_CATEGORIES } from '../../data/plantsData';
import { PlantDefinition } from '../../types/garden';
import { PlantDetailModal } from '../common/PlantDetailModal';
import { useGardenStore } from '../../store/gardenStore';
import { 
  Search, 
  Sun, 
  Droplets, 
  Sprout, 
  SlidersHorizontal, 
  Info, 
  Plus, 
  X, 
  Check 
} from 'lucide-react';

interface PlantLibraryCatalogProps {
  onGoToPlanner: () => void;
}

export const PlantLibraryCatalog: React.FC<PlantLibraryCatalogProps> = ({ onGoToPlanner }) => {
  const { addItem, garden } = useGardenStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Plants');
  const [selectedSunlight, setSelectedSunlight] = useState<string>('All');
  const [selectedWater, setSelectedWater] = useState<string>('All');
  const [inspectPlant, setInspectPlant] = useState<PlantDefinition | null>(null);
  const [addedPlantId, setAddedPlantId] = useState<string | null>(null);

  const filteredPlants = useMemo(() => {
    return PLANTS_DATA.filter(plant => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        plant.name.toLowerCase().includes(query) ||
        plant.scientificName.toLowerCase().includes(query) ||
        plant.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All Plants' || plant.category === selectedCategory;
      const matchesSunlight =
        selectedSunlight === 'All' || plant.sunlight === selectedSunlight;
      const matchesWater =
        selectedWater === 'All' || plant.waterRequirement === selectedWater;

      return matchesSearch && matchesCategory && matchesSunlight && matchesWater;
    });
  }, [searchQuery, selectedCategory, selectedSunlight, selectedWater]);

  const handleQuickAdd = (plant: PlantDefinition) => {
    const defaultX = Math.min(garden.length - 1, Math.max(1, garden.length / 2 + (Math.random() - 0.5) * 2));
    const defaultY = Math.min(garden.width - 1, Math.max(1, garden.width / 2 + (Math.random() - 0.5) * 2));
    addItem('plant', plant.id, defaultX, defaultY);
    setAddedPlantId(plant.id);
    setTimeout(() => setAddedPlantId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-6 sm:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Botanical Encyclopedia
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Plant Library</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Discover detailed profiles, sunlight needs, mature spread parameters, and growth habits for over {PLANTS_DATA.length} species.
          </p>
        </div>

        <button
          onClick={onGoToPlanner}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-soft transition self-start sm:self-auto"
        >
          Open Garden Planner
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search botanical name, common name, fruit or tree type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sunlight Dropdown */}
          <div>
            <select
              value={selectedSunlight}
              onChange={(e) => setSelectedSunlight(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Sunlight Types</option>
              <option value="Full Sun">Full Sun (6+ hrs)</option>
              <option value="Partial Shade">Partial Shade</option>
              <option value="Full Shade">Full Shade</option>
            </select>
          </div>

          {/* Water Dropdown */}
          <div>
            <select
              value={selectedWater}
              onChange={(e) => setSelectedWater(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Water Levels</option>
              <option value="Low">Low (Drought Tolerant)</option>
              <option value="Medium">Medium</option>
              <option value="High">High (Water/Moist)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
          {PLANT_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botanical Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredPlants.map(plant => {
          const isAdded = addedPlantId === plant.id;
          return (
            <div
              key={plant.id}
              className="group bg-white rounded-3xl p-4 border border-slate-200 hover:border-emerald-600/30 hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {plant.category}
                  </span>
                  <button
                    onClick={() => setInspectPlant(plant)}
                    className="text-slate-400 hover:text-emerald-800 p-1 hover:bg-emerald-50 rounded-lg transition"
                    title="View Encyclopedia Info"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Botanical Artwork Preview */}
                <div className="w-full h-32 rounded-2xl mb-3 flex items-center justify-center bg-gradient-to-b from-emerald-50 to-emerald-100/40 border border-emerald-900/5 group-hover:scale-[1.02] transition-transform">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: plant.foliageColor || '#2d6a4f',
                      border: `4px solid ${plant.flowerColor || plant.colorTheme || '#52b788'}`,
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: plant.flowerColor || '#ffffff', opacity: 0.9 }}
                    />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-900 transition-colors line-clamp-1">
                  {plant.name}
                </h3>
                <p className="text-xs italic text-slate-500 font-serif line-clamp-1">
                  {plant.scientificName}
                </p>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {plant.description}
                </p>
              </div>

              {/* Specs & Quick Add */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{plant.sunlight}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{plant.waterRequirement}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Mature Canopy:</span>
                  <span className="font-bold text-emerald-900">{plant.matureCanopy}m spread</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setInspectPlant(plant)}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => handleQuickAdd(plant)}
                    className="py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isAdded ? 'Added!' : 'Add to Plan'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {inspectPlant && (
        <PlantDetailModal
          plant={inspectPlant}
          isOpen={true}
          onClose={() => setInspectPlant(null)}
        />
      )}
    </div>
  );
};
