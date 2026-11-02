import { GardenDesign } from '../types/garden';
import { SAMPLE_GARDENS } from '../data/sampleGardens';

const STORAGE_KEY_SAVED_GARDENS = 'lush_saved_gardens';
const STORAGE_KEY_ACTIVE_GARDEN = 'lush_active_garden';

export function getSavedGardens(): GardenDesign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_GARDENS);
    if (!raw) {
      // Initialize with sample gardens on first launch
      localStorage.setItem(STORAGE_KEY_SAVED_GARDENS, JSON.stringify(SAMPLE_GARDENS));
      return SAMPLE_GARDENS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_GARDENS;
  } catch (err) {
    console.error('Error loading saved gardens from localStorage', err);
    return SAMPLE_GARDENS;
  }
}

export function saveGarden(garden: GardenDesign): void {
  try {
    const gardens = getSavedGardens();
    const existingIndex = gardens.findIndex(g => g.id === garden.id);
    const updatedGarden = {
      ...garden,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      gardens[existingIndex] = updatedGarden;
    } else {
      gardens.unshift(updatedGarden);
    }

    localStorage.setItem(STORAGE_KEY_SAVED_GARDENS, JSON.stringify(gardens));
    localStorage.setItem(STORAGE_KEY_ACTIVE_GARDEN, JSON.stringify(updatedGarden));
  } catch (err) {
    console.error('Error saving garden to localStorage', err);
  }
}

export function deleteGarden(id: string): GardenDesign[] {
  try {
    const gardens = getSavedGardens().filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEY_SAVED_GARDENS, JSON.stringify(gardens));
    return gardens;
  } catch (err) {
    console.error('Error deleting garden from localStorage', err);
    return [];
  }
}

export function duplicateGarden(garden: GardenDesign): GardenDesign {
  const newId = `garden-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const copy: GardenDesign = {
    ...garden,
    id: newId,
    name: `${garden.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: garden.items.map(item => ({
      ...item,
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    })),
  };
  saveGarden(copy);
  return copy;
}

export function getActiveGarden(): GardenDesign {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_GARDEN);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.length && parsed.width) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read active garden from localStorage, using sample');
  }
  return SAMPLE_GARDENS[0];
}
