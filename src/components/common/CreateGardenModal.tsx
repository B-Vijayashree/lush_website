import React, { useState, useEffect } from 'react';
import { useGardenStore } from '../../store/gardenStore';
import { Unit } from '../../types/garden';
import { calculateArea, metersToFeet, feetToMeters } from '../../utils/unitConverter';
import { Ruler, Sparkles, X, Check } from 'lucide-react';

interface CreateGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGardenModal: React.FC<CreateGardenModalProps> = ({ isOpen, onClose }) => {
  const { garden, setGarden, updateGardenMeta } = useGardenStore();

  const [name, setName] = useState<string>(garden.name);
  const [unit, setUnit] = useState<Unit>(garden.unit);
  const [length, setLength] = useState<number>(garden.length);
  const [width, setWidth] = useState<number>(garden.width);
  const [clearItems, setClearItems] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setName(garden.name);
      setUnit(garden.unit);
      setLength(garden.length);
      setWidth(garden.width);
      setClearItems(false);
    }
  }, [isOpen, garden]);

  if (!isOpen) return null;

  // Real-time area calculation
  const areaInfo = calculateArea(length, width, unit);

  // Preset sizes (in meters)
  const presets = [
    { name: 'Small Garden', length: 6, width: 4, desc: 'Cozy patio or courtyard' },
    { name: 'Medium Garden', length: 10, width: 8, desc: 'Typical suburban backyard' },
    { name: 'Large Garden', length: 20, width: 15, desc: 'Spacious villa or homestead' },
  ];

  const handleApplyPreset = (pLength: number, pWidth: number) => {
    setLength(pLength);
    setWidth(pWidth);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (clearItems) {
      setGarden({
        id: `garden-${Date.now()}`,
        name: name.trim() || 'My Garden',
        length: Math.max(3, Number(length)),
        width: Math.max(3, Number(width)),
        unit,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      updateGardenMeta(
        name.trim() || 'My Garden',
        Math.max(3, Number(length)),
        Math.max(3, Number(width)),
        unit
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Create Your Garden</h3>
              <p className="text-xs text-slate-500">Choose land size and scale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="p-5 space-y-4">
          {/* Garden Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Garden / Land Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Backyard Sanctuary"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>

          {/* Unit Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Measurement Unit
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUnit('m')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  unit === 'm'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Meters (m / m²)
              </button>
              <button
                type="button"
                onClick={() => setUnit('ft')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  unit === 'ft'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Feet (ft / ft²)
              </button>
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Preset Dimension Templates
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map(p => {
                const isCurrent = length === p.length && width === p.width;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p.length, p.width)}
                    className={`p-2 rounded-xl text-left border transition ${
                      isCurrent
                        ? 'border-emerald-800 bg-emerald-50/80'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[11px] font-bold block text-slate-800">{p.name}</span>
                    <span className="text-[10px] font-mono text-emerald-800 block">
                      {p.length}m × {p.width}m
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Length ({unit})
              </label>
              <input
                type="number"
                min="3"
                max="100"
                step="0.5"
                required
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 3)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Width ({unit})
              </label>
              <input
                type="number"
                min="3"
                max="100"
                step="0.5"
                required
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 3)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>
          </div>

          {/* Real-time Calculated Total Area Box */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                Calculated Total Area
              </span>
              <span className="text-xl font-extrabold text-emerald-950 font-mono">
                {areaInfo.displayStr}
              </span>
            </div>
            <div className="text-right text-[11px] text-emerald-700">
              <div>{length}m × {width}m</div>
              <div>{(length * width * 10.7639).toFixed(0)} ft²</div>
            </div>
          </div>

          {/* Reset items checkbox option */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              checked={clearItems}
              onChange={(e) => setClearItems(e.target.checked)}
              className="accent-emerald-700 rounded"
            />
            <span>Start with an empty canvas (clear existing plants)</span>
          </label>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              Create Garden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
