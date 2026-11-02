import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GardenDesign, PlacedItem, CameraPreset, Unit, EnvironmentLighting } from '../types/garden';
import { getActiveGarden, saveGarden } from '../utils/storage';
import { detectCollisions, getPlantById, getElementById } from '../utils/collisionDetector';

export type ViewMode = '2d' | '3d' | 'split';
export type { EnvironmentLighting };

interface GardenStoreContextType {
  garden: GardenDesign;
  selectedInstanceId: string | null;
  hoveredInstanceId: string | null;
  viewMode: ViewMode;
  cameraPreset: CameraPreset;
  environmentLighting: EnvironmentLighting;
  showGrid: boolean;
  showSpacingRings: boolean;
  showMeasurements: boolean;
  activeSidebarTab: 'plants' | 'elements';
  
  // Dragging / Click-to-Place Mode
  dragItem: { type: 'plant' | 'element'; id: string } | null;
  setDragItem: (item: { type: 'plant' | 'element'; id: string } | null) => void;
  placementModeItem: { type: 'plant' | 'element'; id: string } | null;
  setPlacementModeItem: (item: { type: 'plant' | 'element'; id: string } | null) => void;

  // Panel Toggles for Full-Screen Canvas
  isLibraryOpen: boolean;
  setIsLibraryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPropertiesOpen: boolean;
  setIsPropertiesOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Actions
  setGarden: (garden: GardenDesign) => void;
  updateGardenMeta: (name: string, length: number, width: number, unit: Unit) => void;
  addItem: (type: 'plant' | 'element', itemId: string, x: number, y: number, rotation?: number) => string;
  updateItemPosition: (instanceId: string, x: number, y: number) => void;
  updateItemRotation: (instanceId: string, rotation: number) => void;
  duplicateItem: (instanceId: string) => void;
  deleteItem: (instanceId: string) => void;
  selectItem: (instanceId: string | null) => void;
  setHoveredItem: (instanceId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setEnvironmentLighting: (lighting: EnvironmentLighting) => void;
  toggleGrid: () => void;
  toggleSpacingRings: () => void;
  toggleMeasurements: () => void;
  setActiveSidebarTab: (tab: 'plants' | 'elements') => void;
  
  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Computed
  selectedItem: PlacedItem | null;
  selectedPlantDef: ReturnType<typeof getPlantById>;
  selectedElementDef: ReturnType<typeof getElementById>;
  collisionResult: ReturnType<typeof detectCollisions>;
}

const GardenStoreContext = createContext<GardenStoreContextType | null>(null);

export const GardenStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [garden, setGardenState] = useState<GardenDesign>(() => getActiveGarden());
  
  // History for Undo/Redo
  const [history, setHistory] = useState<PlacedItem[][]>([garden.items]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [hoveredInstanceId, setHoveredInstanceId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('2d');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('orbit');
  const [environmentLighting, setEnvironmentLighting] = useState<EnvironmentLighting>('day');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showSpacingRings, setShowSpacingRings] = useState<boolean>(true);
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'plants' | 'elements'>('plants');
  const [dragItem, setDragItem] = useState<{ type: 'plant' | 'element'; id: string } | null>(null);
  const [placementModeItem, setPlacementModeItem] = useState<{ type: 'plant' | 'element'; id: string } | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState<boolean>(false);

  const selectItem = useCallback((id: string | null) => {
    setSelectedInstanceId(id);
    if (id) {
      setIsPropertiesOpen(true);
    }
  }, []);

  // Push new state to history stack
  const pushHistory = useCallback((newItems: PlacedItem[]) => {
    setHistory(prev => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, newItems];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Sync garden changes to localStorage
  const setGarden = useCallback((newGarden: GardenDesign) => {
    setGardenState(newGarden);
    setHistory([newGarden.items]);
    setHistoryIndex(0);
    setSelectedInstanceId(null);
    saveGarden(newGarden);
  }, []);

  const updateGardenMeta = useCallback((name: string, length: number, width: number, unit: Unit) => {
    setGardenState(prev => {
      const updated: GardenDesign = {
        ...prev,
        name,
        length,
        width,
        unit,
        updatedAt: new Date().toISOString(),
      };
      saveGarden(updated);
      return updated;
    });
  }, []);

  const addItem = useCallback((
    type: 'plant' | 'element',
    itemId: string,
    x: number,
    y: number,
    rotation: number = 0
  ) => {
    const instanceId = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: PlacedItem = {
      instanceId,
      type,
      itemId,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      rotation: Math.round(rotation),
    };

    setGardenState(prev => {
      const newItems = [...prev.items, newItem];
      pushHistory(newItems);
      const updated = { ...prev, items: newItems, updatedAt: new Date().toISOString() };
      saveGarden(updated);
      return updated;
    });

    setSelectedInstanceId(instanceId);
    return instanceId;
  }, [pushHistory]);

  const updateItemPosition = useCallback((instanceId: string, x: number, y: number) => {
    setGardenState(prev => {
      const newItems = prev.items.map(item => {
        if (item.instanceId === instanceId) {
          return {
            ...item,
            x: Math.max(0.1, Math.min(prev.length - 0.1, Number(x.toFixed(2)))),
            y: Math.max(0.1, Math.min(prev.width - 0.1, Number(y.toFixed(2)))),
          };
        }
        return item;
      });
      const updated = { ...prev, items: newItems, updatedAt: new Date().toISOString() };
      saveGarden(updated);
      return updated;
    });
  }, []);

  const updateItemRotation = useCallback((instanceId: string, rotation: number) => {
    setGardenState(prev => {
      const newItems = prev.items.map(item => {
        if (item.instanceId === instanceId) {
          return { ...item, rotation: (Math.round(rotation) % 360 + 360) % 360 };
        }
        return item;
      });
      const updated = { ...prev, items: newItems, updatedAt: new Date().toISOString() };
      saveGarden(updated);
      return updated;
    });
  }, []);

  const duplicateItem = useCallback((instanceId: string) => {
    const itemToDup = garden.items.find(i => i.instanceId === instanceId);
    if (!itemToDup) return;

    const newX = Math.min(garden.length - 0.5, itemToDup.x + 0.8);
    const newY = Math.min(garden.width - 0.5, itemToDup.y + 0.8);
    addItem(itemToDup.type, itemToDup.itemId, newX, newY, itemToDup.rotation);
  }, [garden.items, garden.length, garden.width, addItem]);

  const deleteItem = useCallback((instanceId: string) => {
    setGardenState(prev => {
      const newItems = prev.items.filter(item => item.instanceId !== instanceId);
      pushHistory(newItems);
      const updated = { ...prev, items: newItems, updatedAt: new Date().toISOString() };
      saveGarden(updated);
      return updated;
    });
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(null);
    }
  }, [selectedInstanceId, pushHistory]);

  // Undo / Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const prevItems = history[nextIndex];
      setHistoryIndex(nextIndex);
      setGardenState(prev => {
        const updated = { ...prev, items: prevItems, updatedAt: new Date().toISOString() };
        saveGarden(updated);
        return updated;
      });
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextItems = history[nextIndex];
      setHistoryIndex(nextIndex);
      setGardenState(prev => {
        const updated = { ...prev, items: nextItems, updatedAt: new Date().toISOString() };
        saveGarden(updated);
        return updated;
      });
    }
  }, [historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const toggleGrid = useCallback(() => setShowGrid(v => !v), []);
  const toggleSpacingRings = useCallback(() => setShowSpacingRings(v => !v), []);
  const toggleMeasurements = useCallback(() => setShowMeasurements(v => !v), []);

  const selectedItem = useMemo(() => {
    return garden.items.find(i => i.instanceId === selectedInstanceId) || null;
  }, [garden.items, selectedInstanceId]);

  const selectedPlantDef = useMemo(() => {
    if (selectedItem?.type === 'plant') {
      return getPlantById(selectedItem.itemId);
    }
    return undefined;
  }, [selectedItem]);

  const selectedElementDef = useMemo(() => {
    if (selectedItem?.type === 'element') {
      return getElementById(selectedItem.itemId);
    }
    return undefined;
  }, [selectedItem]);

  const collisionResult = useMemo(() => {
    return detectCollisions(garden.items, garden.length, garden.width);
  }, [garden.items, garden.length, garden.width]);

  return (
    <GardenStoreContext.Provider
      value={{
        garden,
        selectedInstanceId,
        hoveredInstanceId,
        viewMode,
        cameraPreset,
        environmentLighting,
        showGrid,
        showSpacingRings,
        showMeasurements,
        activeSidebarTab,
        dragItem,
        setDragItem,
        placementModeItem,
        setPlacementModeItem,
        isLibraryOpen,
        setIsLibraryOpen,
        isPropertiesOpen,
        setIsPropertiesOpen,
        setGarden,
        updateGardenMeta,
        addItem,
        updateItemPosition,
        updateItemRotation,
        duplicateItem,
        deleteItem,
        selectItem,
        setHoveredItem: setHoveredInstanceId,
        setViewMode,
        setCameraPreset,
        setEnvironmentLighting,
        toggleGrid,
        toggleSpacingRings,
        toggleMeasurements,
        setActiveSidebarTab,
        undo,
        redo,
        canUndo,
        canRedo,
        selectedItem,
        selectedPlantDef,
        selectedElementDef,
        collisionResult,
      }}
    >
      {children}
    </GardenStoreContext.Provider>
  );
};

export const useGardenStore = () => {
  const context = useContext(GardenStoreContext);
  if (!context) {
    throw new Error('useGardenStore must be used within a GardenStoreProvider');
  }
  return context;
};
