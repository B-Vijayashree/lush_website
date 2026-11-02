import React, { useState, useMemo } from 'react';
import { PLANTS_DATA, PLANT_CATEGORIES } from '../../data/plantsData';
import { PlantDefinition } from '../../types/garden';
import { PlantCard } from './PlantCard';
import { useGardenStore } from '../../store/gardenStore';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface PlantLibrarySidebarProps {
  onOpenPlantInfo: (plant: PlantDefinition) => void;
}

export const PlantLibrarySidebar: React.FC<PlantLibrarySidebarProps> = ({ onOpenPlantInfo }) => {
  const { setPlacementModeItem, setIsLibraryOpen } = useGardenStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Plants');
  const [selectedSunlight, setSelectedSunlight] = useState<string>('All');
  const [selectedWater, setSelectedWater] = useState<string>('All');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filteredPlants = useMemo(() => {
    return PLANTS_DATA.filter(plant => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        plant.name.toLowerCase().includes(query) ||
        plant.scientificName.toLowerCase().includes(query) ||
        plant.category.toLowerCase().includes(query) ||
        (plant.subCategory && plant.subCategory.toLowerCase().includes(query));

      // Category match
      const matchesCategory =
        selectedCategory === 'All Plants' || plant.category === selectedCategory;

      // Sunlight match
      const matchesSunlight =
        selectedSunlight === 'All' || plant.sunlight === selectedSunlight;

      // Water match
      const matchesWater =
        selectedWater === 'All' || plant.waterRequirement === selectedWater;

      return matchesSearch && matchesCategory && matchesSunlight && matchesWater;
    });
  }, [searchQuery, selectedCategory, selectedSunlight, selectedWater]);

  const handleQuickAdd = (plant: PlantDefinition) => {
    // Activate placement mode so user can touch/click anywhere on full-screen canvas!
    setPlacementModeItem({ type: 'plant', id: plant.id });
    setIsLibraryOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Search & Filter Header */}
      <div className="p-3 border-b border-slate-100 space-y-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search mango, rose, shade trees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Toggle Bar */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-slate-500">
            {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''} available
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition ${
              showFilters || selectedSunlight !== 'All' || selectedWater !== 'All'
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Filters</span>
          </button>
        </div>

        {/* Expandable Advanced Filters */}
        {showFilters && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Sunlight
              </label>
              <select
                value={selectedSunlight}
                onChange={(e) => setSelectedSunlight(e.target.value)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
              >
                <option value="All">Any Sunlight</option>
                <option value="Full Sun">Full Sun</option>
                <option value="Partial Shade">Partial Shade</option>
                <option value="Full Shade">Full Shade</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Water Needs
              </label>
              <select
                value={selectedWater}
                onChange={(e) => setSelectedWater(e.target.value)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
              >
                <option value="All">Any Water</option>
                <option value="Low">Low (Drought Hardy)</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Moist/Water)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="p-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {PLANT_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-sm font-semibold'
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

      {/* Plant Cards Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 gap-3">
        {filteredPlants.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm font-medium">No plants match your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Plants');
                setSelectedSunlight('All');
                setSelectedWater('All');
              }}
              className="mt-2 text-xs text-emerald-700 font-semibold underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredPlants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onSelectInfo={onOpenPlantInfo}
              onQuickAdd={handleQuickAdd}
            />
          ))
        )}
      </div>
    </div>
  );
};
