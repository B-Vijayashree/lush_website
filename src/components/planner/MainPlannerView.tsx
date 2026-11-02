import React, { useState } from 'react';
import { useGardenStore } from '../../store/gardenStore';
import { PlannerHeader } from './PlannerHeader';
import { PlantLibrarySidebar } from '../library/PlantLibrarySidebar';
import { ElementLibrarySidebar } from '../library/ElementLibrarySidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { GardenCanvas2D } from '../2d/GardenCanvas2D';
import { GardenScene3D } from '../3d/GardenScene3D';
import { CollisionAlertsModal } from './CollisionAlertsModal';
import { PlantDetailModal } from '../common/PlantDetailModal';
import { CreateGardenModal } from '../common/CreateGardenModal';
import { ExportReportModal } from '../common/ExportReportModal';
import { ShareModal } from '../common/ShareModal';
import { PlantDefinition } from '../../types/garden';
import { Sprout, Compass, CheckCircle, X, Sliders, Info } from 'lucide-react';

export const MainPlannerView: React.FC = () => {
  const {
    viewMode,
    activeSidebarTab,
    setActiveSidebarTab,
    isLibraryOpen,
    setIsLibraryOpen,
    isPropertiesOpen,
    setIsPropertiesOpen,
    selectedItem,
    selectItem,
  } = useGardenStore();

  const [inspectPlant, setInspectPlant] = useState<PlantDefinition | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showAlertsModal, setShowAlertsModal] = useState<boolean>(false);
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);

  const handleSaveNotification = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f9f6] overflow-hidden">
      {/* Top Header Navigation & Tools */}
      <PlannerHeader
        onOpenCreateGarden={() => setShowCreateModal(true)}
        onOpenExportReport={() => setShowExportModal(true)}
        onOpenShare={() => setShowShareModal(true)}
        onOpenAlertsList={() => setShowAlertsModal(true)}
        onSaveSuccess={handleSaveNotification}
      />

      {/* Main Full-Screen Workspace Body */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        {/* Full-Screen Canvas Area (2D, 3D, or Split) */}
        <main className="absolute inset-0 w-full h-full overflow-hidden bg-[#e5e7eb]">
          {viewMode === '2d' && <GardenCanvas2D />}

          {viewMode === '3d' && <GardenScene3D />}

          {viewMode === 'split' && (
            <div className="w-full h-full flex divide-x divide-slate-300">
              <div className="w-1/2 h-full relative">
                <GardenCanvas2D />
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
                  2D Planning Canvas
                </div>
              </div>
              <div className="w-1/2 h-full relative">
                <GardenScene3D />
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
                  3D Real-Time Reality
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Floating Top-Left Trigger Button (When library is closed) */}
        {!isLibraryOpen && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-900/95 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-elevated backdrop-blur-md transition-all border border-emerald-500/40 hover:scale-105 active:scale-95 group"
              title="Open Plant & Element Library"
            >
              <Sprout className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>+ Add Plants & Elements</span>
            </button>
          </div>
        )}

        {/* Floating Top-Right Trigger Button (When properties panel is closed) */}
        {!isPropertiesOpen && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setIsPropertiesOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 hover:bg-white text-slate-700 rounded-2xl text-xs font-bold shadow-soft backdrop-blur-md transition-all border border-slate-200/80 hover:shadow-elevated"
              title="Open Properties Panel"
            >
              <Info className="w-4 h-4 text-emerald-700" />
              <span>{selectedItem ? 'Item Properties' : 'Garden Info'}</span>
            </button>
          </div>
        )}

        {/* Floating Plant & Element Library Slide-Over Panel */}
        {isLibraryOpen && (
          <div className="absolute top-3 left-3 bottom-3 w-96 max-w-[92vw] z-40 bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-fade-in">
            {/* Header with Tabs & Close */}
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex gap-1 flex-1 mr-2">
                <button
                  onClick={() => setActiveSidebarTab('plants')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    activeSidebarTab === 'plants'
                      ? 'bg-white text-emerald-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Plants</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('elements')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    activeSidebarTab === 'elements'
                      ? 'bg-white text-emerald-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-slate-700" />
                  <span>Hardscape</span>
                </button>
              </div>
              <button
                onClick={() => setIsLibraryOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
                title="Close Library Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content with Drag & Touch-to-Place */}
            <div className="flex-1 overflow-hidden">
              {activeSidebarTab === 'plants' ? (
                <PlantLibrarySidebar onOpenPlantInfo={(plant) => setInspectPlant(plant)} />
              ) : (
                <ElementLibrarySidebar />
              )}
            </div>
          </div>
        )}

        {/* Floating Properties Slide-Over Panel */}
        {isPropertiesOpen && (
          <div className="absolute top-3 right-3 bottom-3 w-84 max-w-[90vw] z-30 bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-fade-in">
            {/* Properties Header */}
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <span className="text-xs font-bold text-slate-700">
                {selectedItem ? 'Selected Properties' : 'Garden Overview'}
              </span>
              <button
                onClick={() => setIsPropertiesOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
                title="Close Properties Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <PropertiesPanel onOpenPlantInfo={(plant) => setInspectPlant(plant)} />
            </div>
          </div>
        )}
      </div>

      {/* Save Toast Notification */}
      {showSaveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-900 text-white px-5 py-2.5 rounded-2xl shadow-elevated text-xs font-semibold animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Garden design saved successfully to My Gardens!</span>
        </div>
      )}

      {/* Dialog Modals */}
      <CreateGardenModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {inspectPlant && (
        <PlantDetailModal
          plant={inspectPlant}
          isOpen={true}
          onClose={() => setInspectPlant(null)}
        />
      )}

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      <CollisionAlertsModal
        isOpen={showAlertsModal}
        onClose={() => setShowAlertsModal(false)}
      />
    </div>
  );
};
