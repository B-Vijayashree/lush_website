import React from 'react';
import { useGardenStore, ViewMode } from '../../store/gardenStore';
import { 
  Undo2, 
  Redo2, 
  Grid3X3, 
  CircleDashed, 
  Ruler, 
  Save, 
  Download, 
  Share2, 
  PlusCircle, 
  AlertTriangle,
  Layers,
  Box,
  Columns2,
  Sprout
} from 'lucide-react';

interface PlannerHeaderProps {
  onOpenCreateGarden: () => void;
  onOpenExportReport: () => void;
  onOpenShare: () => void;
  onOpenAlertsList: () => void;
  onSaveSuccess: () => void;
}

export const PlannerHeader: React.FC<PlannerHeaderProps> = ({
  onOpenCreateGarden,
  onOpenExportReport,
  onOpenShare,
  onOpenAlertsList,
  onSaveSuccess,
}) => {
  const {
    garden,
    viewMode,
    setViewMode,
    showGrid,
    showSpacingRings,
    showMeasurements,
    toggleGrid,
    toggleSpacingRings,
    toggleMeasurements,
    undo,
    redo,
    canUndo,
    canRedo,
    collisionResult,
    isLibraryOpen,
    setIsLibraryOpen,
  } = useGardenStore();

  const totalArea = (garden.length * garden.width).toFixed(1);
  const warningsCount = collisionResult.warnings.length;

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shrink-0">
      {/* Left: Garden Title & Quick Dimensions Pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCreateGarden}
          className="group flex items-center gap-2 text-left hover:bg-slate-50 p-1.5 rounded-xl transition"
          title="Click to edit garden dimensions or name"
        >
          <div>
            <h2 className="text-sm font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
              {garden.name}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <span className="font-mono text-emerald-900 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                {garden.length}m × {garden.width}m
              </span>
              <span>•</span>
              <span>{totalArea} m²</span>
            </div>
          </div>
        </button>

        {/* Prominent "+ Add Plants & Elements" Button */}
        <button
          onClick={() => setIsLibraryOpen(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
            isLibraryOpen
              ? 'bg-emerald-800 text-white shadow-soft'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
          }`}
          title="Open plant & hardscape library"
        >
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ Add Plants & Elements</span>
        </button>

        {/* Spacing Alert Warning Pill */}
        {warningsCount > 0 && (
          <button
            onClick={onOpenAlertsList}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold transition animate-pulse"
            title="View Spacing & Future Collision Alerts"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{warningsCount} Spacing Alert{warningsCount > 1 ? 's' : ''}</span>
          </button>
        )}
      </div>

      {/* Center: View Switcher (2D / 3D / Split) */}
      <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => setViewMode('2d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            viewMode === '2d'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D Plan</span>
        </button>

        <button
          onClick={() => setViewMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            viewMode === '3d'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Reality</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            viewMode === 'split'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span>Split View</span>
        </button>
      </div>

      {/* Right: Tools, Undo/Redo, Save & Export */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-xl border border-slate-200">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-900 hover:bg-slate-200/70 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-900 hover:bg-slate-200/70 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Canvas Display Toggles (Available in 2D or Split) */}
        {viewMode !== '3d' && (
          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={toggleGrid}
              title="Toggle Grid (G)"
              className={`p-1.5 rounded-lg transition ${
                showGrid ? 'bg-emerald-100/80 text-emerald-900' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleSpacingRings}
              title="Toggle Spacing & Mature Canopy Rings"
              className={`p-1.5 rounded-lg transition ${
                showSpacingRings ? 'bg-emerald-100/80 text-emerald-900' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <CircleDashed className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleMeasurements}
              title="Toggle Dimension Rulers"
              className={`p-1.5 rounded-lg transition ${
                showMeasurements ? 'bg-emerald-100/80 text-emerald-900' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="w-[1px] h-5 bg-slate-200" />

        {/* Save Button */}
        <button
          onClick={onSaveSuccess}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 rounded-xl text-xs font-semibold transition"
          title="Save Garden Design to My Gardens"
        >
          <Save className="w-3.5 h-3.5 text-emerald-700" />
          <span>Save</span>
        </button>

        {/* Export / Report Button */}
        <button
          onClick={onOpenExportReport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          title="Export 2D Image or Print Garden Report"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShare}
          className="p-1.5 text-slate-600 hover:text-emerald-900 hover:bg-slate-100 rounded-xl transition"
          title="Share Design Link"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* New Garden Button */}
        <button
          onClick={onOpenCreateGarden}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Garden</span>
        </button>
      </div>
    </header>
  );
};
