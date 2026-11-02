import { ElementDefinition } from '../types/garden';

export const ELEMENTS_DATA: ElementDefinition[] = [
  // ==========================================
  // PATHWAYS
  // ==========================================
  {
    id: 'stepping-stones',
    name: 'Natural Stepping Stones',
    category: 'Pathways',
    description: 'Organic slate stone pavers spaced gracefully through lawn or groundcover.',
    width: 0.8,
    length: 1.8,
    height: 0.05,
    material: 'Natural Slate / Bluestone',
    model3DType: 'path_stepping_stone',
    colorTheme: '#7f8c8d',
  },
  {
    id: 'stone-walkway',
    name: 'Curved Stone Pavers',
    category: 'Pathways',
    description: 'Smooth flagstone walkway connecting patio areas with flower beds.',
    width: 1.2,
    length: 3.0,
    height: 0.04,
    material: 'Cut Flagstone',
    model3DType: 'path_gravel',
    colorTheme: '#95a5a6',
  },
  {
    id: 'wood-patio-deck',
    name: 'Teak Patio Deck',
    category: 'Pathways',
    description: 'Elevated warm wooden timber deck for outdoor loungers and dining.',
    width: 3.5,
    length: 2.8,
    height: 0.15,
    material: 'Weathered Teak Planks',
    model3DType: 'path_wood_deck',
    colorTheme: '#b08968',
  },
  {
    id: 'brick-pathway',
    name: 'Herringbone Brick Path',
    category: 'Pathways',
    description: 'Traditional red-brick pathway providing classic cottage charm.',
    width: 1.0,
    length: 2.5,
    height: 0.06,
    material: 'Kiln Fired Clay Brick',
    model3DType: 'path_brick',
    colorTheme: '#b23a22',
  },

  // ==========================================
  // WATER FEATURES
  // ==========================================
  {
    id: 'natural-pond',
    name: 'Landscape Garden Pond',
    category: 'Water',
    description: 'Serene biological water garden lined with smooth river stones and water lilies.',
    width: 2.6,
    length: 2.6,
    height: 0.4,
    material: 'Natural Stone & EPDM Liner',
    model3DType: 'water_pond',
    colorTheme: '#2a9d8f',
  },
  {
    id: 'garden-fountain',
    name: 'Tiered Stone Fountain',
    category: 'Water',
    description: 'Gentle bubbling water feature casting soothing auditory ambiance throughout the garden.',
    width: 1.2,
    length: 1.2,
    height: 1.4,
    material: 'Cast Limestone',
    model3DType: 'water_fountain',
    colorTheme: '#6c757d',
  },

  // ==========================================
  // DECORATION
  // ==========================================
  {
    id: 'garden-bench',
    name: 'Cedar Garden Bench',
    category: 'Decoration',
    description: 'Solid timber park bench tucked under tree canopy for quiet contemplation.',
    width: 1.5,
    length: 0.7,
    height: 0.85,
    material: 'Western Red Cedar',
    model3DType: 'decor_bench',
    colorTheme: '#7f5539',
  },
  {
    id: 'solar-path-light',
    name: 'Warm Solar Path Light',
    category: 'Decoration',
    description: 'Sleek matte-black bollard light casting soft warm amber illumination along walkway.',
    width: 0.3,
    length: 0.3,
    height: 0.6,
    material: 'Anodized Aluminum & LED',
    model3DType: 'decor_solar_light',
    colorTheme: '#f39c12',
  },
  {
    id: 'terracotta-pots',
    name: 'Trio of Terracotta Pots',
    category: 'Decoration',
    description: 'Handcrafted rustic clay planters arranged with flowering specimen plants.',
    width: 0.8,
    length: 0.8,
    height: 0.7,
    material: 'Tuscan Terracotta',
    model3DType: 'decor_pot',
    colorTheme: '#dd6b20',
  },
  {
    id: 'landscape-boulder',
    name: 'Granite Landscape Boulder',
    category: 'Decoration',
    description: 'Rugged natural weathered stone accent adding geological weight and zen character.',
    width: 1.2,
    length: 0.9,
    height: 0.7,
    material: 'Weathered Granite',
    model3DType: 'decor_rock',
    colorTheme: '#5c677d',
  },

  // ==========================================
  // STRUCTURES
  // ==========================================
  {
    id: 'garden-pergola',
    name: 'Timber Garden Pergola',
    category: 'Structures',
    description: 'Open-beam architectural wooden arbor for climbing roses and wisteria.',
    width: 3.0,
    length: 2.5,
    height: 2.4,
    material: 'Heavy Timber Cedar',
    model3DType: 'struct_pergola',
    colorTheme: '#8c502b',
  },
  {
    id: 'wood-slat-fence',
    name: 'Horizontal Cedar Fence',
    category: 'Structures',
    description: 'Modern horizontal slat privacy screen defining outdoor living boundaries.',
    width: 2.5,
    length: 0.2,
    height: 1.8,
    material: 'Cedar Slat Panels',
    model3DType: 'struct_fence',
    colorTheme: '#9c6644',
  }
];
