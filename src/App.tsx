import React, { useState } from 'react';
import { GardenStoreProvider, useGardenStore } from './store/gardenStore';
import { Navbar } from './components/common/Navbar';
import { LandingHero } from './components/home/LandingHero';
import { MainPlannerView } from './components/planner/MainPlannerView';
import { PlantLibraryCatalog } from './components/library/PlantLibraryCatalog';
import { MyGardensView } from './components/my-gardens/MyGardensView';
import { CreateGardenModal } from './components/common/CreateGardenModal';
import { ActiveTab } from './types/garden';
import { SAMPLE_GARDENS } from './data/sampleGardens';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const { setGarden } = useGardenStore();

  const handleOpenSample = (gardenId: string) => {
    const sample = SAMPLE_GARDENS.find(g => g.id === gardenId) || SAMPLE_GARDENS[0];
    setGarden(sample);
    setActiveTab('planner');
  };

  const handleStartDesigning = () => {
    setActiveTab('planner');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9f6] text-slate-800 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onStartDesigning={handleStartDesigning}
      />

      {/* Main Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'home' && (
          <LandingHero
            onStartDesigning={handleStartDesigning}
            onExplorePlants={() => setActiveTab('library')}
            onOpenSample={handleOpenSample}
          />
        )}

        {activeTab === 'planner' && <MainPlannerView />}

        {activeTab === 'library' && (
          <PlantLibraryCatalog onGoToPlanner={() => setActiveTab('planner')} />
        )}

        {activeTab === 'my-gardens' && (
          <MyGardensView
            onOpenGarden={() => setActiveTab('planner')}
            onNewGarden={() => setShowCreateModal(true)}
          />
        )}
      </div>

      <CreateGardenModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setActiveTab('planner');
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GardenStoreProvider>
      <AppContent />
    </GardenStoreProvider>
  );
};

export default App;
