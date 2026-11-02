import { PlacedItem, CollisionWarning, PlantDefinition, ElementDefinition } from '../types/garden';
import { PLANTS_DATA } from '../data/plantsData';
import { ELEMENTS_DATA } from '../data/elementsData';

const plantMap = new Map<string, PlantDefinition>();
PLANTS_DATA.forEach(p => plantMap.set(p.id, p));

const elementMap = new Map<string, ElementDefinition>();
ELEMENTS_DATA.forEach(e => elementMap.set(e.id, e));

export function getPlantById(id: string): PlantDefinition | undefined {
  return plantMap.get(id);
}

export function getElementById(id: string): ElementDefinition | undefined {
  return elementMap.get(id);
}

export interface CollisionCheckResult {
  warnings: CollisionWarning[];
  itemStatusMap: Map<string, 'safe' | 'warning' | 'critical'>;
  nearestNeighborDistance: Map<string, { distance: number; neighborId: string; neighborName: string }>;
}

/**
 * Calculates collision and spacing conflicts considering both current sizes
 * and future MATURE canopy spread.
 */
export function detectCollisions(
  items: PlacedItem[],
  gardenLength: number,
  gardenWidth: number
): CollisionCheckResult {
  const warnings: CollisionWarning[] = [];
  const itemStatusMap = new Map<string, 'safe' | 'warning' | 'critical'>();
  const nearestNeighborDistance = new Map<string, { distance: number; neighborId: string; neighborName: string }>();

  // Default all items to safe
  items.forEach(item => {
    itemStatusMap.set(item.instanceId, 'safe');
  });

  // Only plants participate in biological canopy spacing checks
  const plantItems = items.filter(item => item.type === 'plant');

  for (let i = 0; i < plantItems.length; i++) {
    const itemA = plantItems[i];
    const defA = getPlantById(itemA.itemId);
    if (!defA) continue;

    let minDistance = Infinity;
    let closestNeighborId = '';
    let closestNeighborName = '';

    for (let j = i + 1; j < plantItems.length; j++) {
      const itemB = plantItems[j];
      const defB = getPlantById(itemB.itemId);
      if (!defB) continue;

      const dx = itemA.x - itemB.x;
      const dy = itemA.y - itemB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Track closest neighbor for each item
      if (distance < minDistance) {
        minDistance = distance;
        closestNeighborId = itemB.instanceId;
        closestNeighborName = defB.name;
      }

      // Check against mature canopy spread and recommended planting distance
      const matureRadiusA = (defA.matureCanopy || defA.matureWidth) / 2;
      const matureRadiusB = (defB.matureCanopy || defB.matureWidth) / 2;
      const matureCanopyCombined = matureRadiusA + matureRadiusB;
      const recommendedSpacing = Math.max(
        defA.recommendedSpacing,
        defB.recommendedSpacing,
        (defA.recommendedSpacing + defB.recommendedSpacing) / 2
      );

      // CRITICAL: Overlap of mature canopies
      if (distance < matureCanopyCombined) {
        const overlap = Number((matureCanopyCombined - distance).toFixed(2));
        warnings.push({
          id: `crit-${itemA.instanceId}-${itemB.instanceId}`,
          item1InstanceId: itemA.instanceId,
          item1Name: defA.name,
          item2InstanceId: itemB.instanceId,
          item2Name: defB.name,
          distance: Number(distance.toFixed(2)),
          recommendedDistance: Number(recommendedSpacing.toFixed(1)),
          matureCanopyOverlap: overlap,
          severity: 'critical',
          message: `Critical canopy crowding: ${defA.name} (mature canopy ${defA.matureCanopy}m) and ${defB.name} (mature canopy ${defB.matureCanopy}m) are only ${distance.toFixed(1)}m apart. Canopies will severely overlap by ~${overlap}m.`,
        });

        itemStatusMap.set(itemA.instanceId, 'critical');
        itemStatusMap.set(itemB.instanceId, 'critical');
      } 
      // WARNING: Closer than recommended healthy spacing (root / light competition)
      else if (distance < recommendedSpacing) {
        const currentSeverityA = itemStatusMap.get(itemA.instanceId);
        const currentSeverityB = itemStatusMap.get(itemB.instanceId);

        if (currentSeverityA !== 'critical') {
          itemStatusMap.set(itemA.instanceId, 'warning');
        }
        if (currentSeverityB !== 'critical') {
          itemStatusMap.set(itemB.instanceId, 'warning');
        }

        warnings.push({
          id: `warn-${itemA.instanceId}-${itemB.instanceId}`,
          item1InstanceId: itemA.instanceId,
          item1Name: defA.name,
          item2InstanceId: itemB.instanceId,
          item2Name: defB.name,
          distance: Number(distance.toFixed(2)),
          recommendedDistance: Number(recommendedSpacing.toFixed(1)),
          matureCanopyOverlap: 0,
          severity: 'warning',
          message: `Close spacing: ${defA.name} and ${defB.name} are ${distance.toFixed(1)}m apart (recommended: ${recommendedSpacing.toFixed(1)}m). May compete for root space and sunlight as they mature.`,
        });
      }
    }

    if (minDistance < Infinity) {
      nearestNeighborDistance.set(itemA.instanceId, {
        distance: Number(minDistance.toFixed(2)),
        neighborId: closestNeighborId,
        neighborName: closestNeighborName,
      });
    }

    // Boundary proximity check
    const matureRadius = (defA.matureCanopy || defA.matureWidth) / 2;
    const distToLeft = itemA.x;
    const distToRight = gardenLength - itemA.x;
    const distToTop = itemA.y;
    const distToBottom = gardenWidth - itemA.y;
    const minBoundaryDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

    if (minBoundaryDist < matureRadius * 0.4 && defA.matureHeight > 4.0) {
      warnings.push({
        id: `bound-${itemA.instanceId}`,
        item1InstanceId: itemA.instanceId,
        item1Name: defA.name,
        item2InstanceId: 'boundary',
        item2Name: 'Garden Boundary',
        distance: Number(minBoundaryDist.toFixed(2)),
        recommendedDistance: Number((matureRadius * 0.8).toFixed(1)),
        matureCanopyOverlap: Number((matureRadius * 0.4 - minBoundaryDist).toFixed(2)),
        severity: 'warning',
        message: `${defA.name} is placed very close (${minBoundaryDist.toFixed(1)}m) to the garden boundary. Its mature canopy (${defA.matureCanopy}m) may overhang adjacent properties or fences.`,
      });
      if (itemStatusMap.get(itemA.instanceId) !== 'critical') {
        itemStatusMap.set(itemA.instanceId, 'warning');
      }
    }
  }

  return {
    warnings,
    itemStatusMap,
    nearestNeighborDistance,
  };
}
