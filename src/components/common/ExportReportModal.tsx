import React from 'react';
import { useGardenStore } from '../../store/gardenStore';
import { calculateGardenStatistics, printGardenPlan, downloadCanvasImage } from '../../utils/exportUtils';
import { getPlantById } from '../../utils/collisionDetector';
import { 
  Download, 
  Printer, 
  FileText, 
  Check, 
  X, 
  PieChart, 
  Sprout, 
  AlertTriangle 
} from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose }) => {
  const { garden } = useGardenStore();

  if (!isOpen) return null;

  const stats = calculateGardenStatistics(garden);

  // Group plants for nursery shopping list
  const plantCounts = new Map<string, number>();
  garden.items.filter(i => i.type === 'plant').forEach(i => {
    plantCounts.set(i.itemId, (plantCounts.get(i.itemId) || 0) + 1);
  });

  const plantList: { name: string; category: string; matureCanopy: number; count: number }[] = [];
  plantCounts.forEach((count, id) => {
    const plant = getPlantById(id);
    if (plant) {
      plantList.push({
        name: plant.name,
        category: plant.category,
        matureCanopy: plant.matureCanopy,
        count,
      });
    }
  });

  const handleDownloadPNG = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      downloadCanvasImage(canvas, `${garden.name.toLowerCase().replace(/\s+/g, '-')}-plan.png`);
    } else {
      alert('Could not locate canvas element. Please ensure 2D view is visible.');
    }
  };

  const handlePrint = () => {
    printGardenPlan(garden, stats);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Landscape Plan & Export
              </h3>
              <p className="text-xs text-slate-500">
                Comprehensive design summary, bill of materials, and export options
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Total Land Area
              </span>
              <span className="text-lg font-bold text-emerald-950">{stats.totalArea} m²</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {garden.length}m × {garden.width}m
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Total Plants
              </span>
              <span className="text-lg font-bold text-emerald-950">{stats.totalPlants}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {plantList.length} unique varieties
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Canopy Coverage
              </span>
              <span className="text-lg font-bold text-emerald-950">
                {stats.estimatedOccupiedArea} m²
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ~{Math.round((stats.estimatedOccupiedArea / stats.totalArea) * 100)}% of land
              </span>
            </div>
          </div>

          {/* Spacing Alert Warning Banner if present */}
          {stats.spacingWarningsCount > 0 && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>{stats.spacingWarningsCount} spacing alerts detected.</strong> Some plants may experience canopy overlap at maturity.
              </span>
            </div>
          )}

          {/* Category Breakdown Table */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-emerald-700" />
              <span>Plant & Hardscape Breakdown</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(stats.categoryCounts).map(([cat, count]) => (
                <div
                  key={cat}
                  className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5"
                >
                  <span className="text-slate-600 font-medium">{cat}:</span>
                  <span className="font-bold text-emerald-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plant Nursery Shopping List */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Nursery Shopping Schedule ({plantList.length} species)</span>
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                  <tr>
                    <th className="p-2.5">Qty</th>
                    <th className="p-2.5">Botanical Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Spread</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plantList.map(item => (
                    <tr key={item.name} className="hover:bg-slate-50/60">
                      <td className="p-2.5 font-bold text-emerald-900">{item.count}×</td>
                      <td className="p-2.5 font-semibold text-slate-800">{item.name}</td>
                      <td className="p-2.5 text-slate-500">{item.category}</td>
                      <td className="p-2.5 text-slate-600 font-mono">{item.matureCanopy}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPNG}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Download 2D Image</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Plan Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
