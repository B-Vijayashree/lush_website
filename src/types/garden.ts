export type Unit = 'm' | 'ft';

export type SunlightRequirement = 'Full Sun' | 'Partial Shade' | 'Full Shade';
export type WaterRequirement = 'Low' | 'Medium' | 'High';
export type MaintenanceLevel = 'Low' | 'Medium' | 'High';
export type GrowthRate = 'Slow' | 'Moderate' | 'Fast';

export type PlantCategory = 
  | 'Trees'
  | 'Flower Plants'
  | 'Shrubs'
  | 'Vegetables'
  | 'Fruits'
  | 'Herbs'
  | 'Grass'
  | 'Water Plants'
  | 'Palms'
  | 'Ground Cover';

export type ElementCategory = 
  | 'Pathways'
  | 'Water'
  | 'Decoration'
  | 'Grass'
  | 'Structures';

export interface PlantDefinition {
  id: string;
  name: string;
  scientificName: string;
  category: PlantCategory;
  subCategory?: string;
  description: string;
  currentHeight: number; // in meters
  currentWidth: number; // in meters (canopy)
  matureHeight: number; // in meters
  matureWidth: number; // in meters
  matureCanopy: number; // in meters
  rootSpread: string; // e.g. "4 - 6 m"
  recommendedSpacing: number; // in meters
  sunlight: SunlightRequirement;
  waterRequirement: WaterRequirement;
  climate: string; // e.g. "Tropical / Subtropical"
  temperature: string; // e.g. "20°C - 35°C"
  soil: string; // e.g. "Well-drained loam, rich organic"
  growthRate: GrowthRate;
  maintenance: MaintenanceLevel;
  floweringSeason?: string;
  fruitingSeason?: string;
  careInstructions: string;
  colorTheme: string; // Hex color for 2D representation & accents
  foliageColor?: string;
  flowerColor?: string;
  trunkColor?: string;
  model3DType: 
    | 'tree_standard' 
    | 'tree_conifer' 
    | 'tree_spreading' 
    | 'palm' 
    | 'flower_bush' 
    | 'flower_tall' 
    | 'shrub_dense' 
    | 'shrub_colored' 
    | 'veggie_stake' 
    | 'veggie_ground' 
    | 'herb_mound' 
    | 'grass_clump' 
    | 'water_lily';
  imagePlaceholderColor?: string;
}

export interface ElementDefinition {
  id: string;
  name: string;
  category: ElementCategory;
  description: string;
  width: number; // in meters
  length: number; // in meters
  height: number; // in meters
  material: string;
  model3DType: 
    | 'path_stepping_stone'
    | 'path_brick'
    | 'path_gravel'
    | 'path_wood_deck'
    | 'water_pond'
    | 'water_fountain'
    | 'decor_bench'
    | 'decor_solar_light'
    | 'decor_pot'
    | 'decor_rock'
    | 'struct_fence'
    | 'struct_pergola';
  colorTheme: string;
}

export interface PlacedItem {
  instanceId: string;
  type: 'plant' | 'element';
  itemId: string; // references PlantDefinition.id or ElementDefinition.id
  x: number; // meters from left (0 to garden.length)
  y: number; // meters from top (0 to garden.width)
  rotation: number; // in degrees (0 - 360)
  scaleMultiplier?: number;
}

export type CollisionSeverity = 'safe' | 'warning' | 'critical';

export interface CollisionWarning {
  id: string;
  item1InstanceId: string;
  item1Name: string;
  item2InstanceId: string;
  item2Name: string;
  distance: number;
  recommendedDistance: number;
  matureCanopyOverlap: number;
  severity: 'warning' | 'critical';
  message: string;
}

export interface GardenDesign {
  id: string;
  name: string;
  length: number; // in meters
  width: number; // in meters
  unit: Unit;
  items: PlacedItem[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export type CameraPreset = 'orbit' | 'top' | 'front' | 'side' | 'birds_eye';
export type EnvironmentLighting = 'day' | 'golden_hour' | 'night';

export type ActiveTab = 'home' | 'planner' | 'library' | 'my-gardens';

export interface GardenStatistics {
  totalArea: number;
  totalPlants: number;
  totalElements: number;
  categoryCounts: Record<string, number>;
  estimatedOccupiedArea: number;
  spacingWarningsCount: number;
  waterSummary: { low: number; medium: number; high: number };
  sunlightSummary: { fullSun: number; partialShade: number; fullShade: number };
}
