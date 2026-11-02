import { GardenDesign, GardenStatistics, PlacedItem } from '../types/garden';
import { getPlantById, getElementById, detectCollisions } from './collisionDetector';

export function calculateGardenStatistics(garden: GardenDesign): GardenStatistics {
  const totalArea = garden.length * garden.width;
  let totalPlants = 0;
  let totalElements = 0;
  const categoryCounts: Record<string, number> = {};
  let estimatedOccupiedArea = 0;

  let lowWater = 0;
  let mediumWater = 0;
  let highWater = 0;

  let fullSun = 0;
  let partialShade = 0;
  let fullShade = 0;

  garden.items.forEach(item => {
    if (item.type === 'plant') {
      totalPlants++;
      const plant = getPlantById(item.itemId);
      if (plant) {
        categoryCounts[plant.category] = (categoryCounts[plant.category] || 0) + 1;
        // Approximate canopy area pi * (canopy/2)^2
        const radius = (plant.matureCanopy || plant.matureWidth) / 2;
        estimatedOccupiedArea += Math.PI * radius * radius;

        if (plant.waterRequirement === 'Low') lowWater++;
        else if (plant.waterRequirement === 'Medium') mediumWater++;
        else if (plant.waterRequirement === 'High') highWater++;

        if (plant.sunlight === 'Full Sun') fullSun++;
        else if (plant.sunlight === 'Partial Shade') partialShade++;
        else if (plant.sunlight === 'Full Shade') fullShade++;
      }
    } else {
      totalElements++;
      const el = getElementById(item.itemId);
      if (el) {
        categoryCounts[el.category] = (categoryCounts[el.category] || 0) + 1;
        estimatedOccupiedArea += (el.width * el.length);
      }
    }
  });

  const collisionResult = detectCollisions(garden.items, garden.length, garden.width);

  return {
    totalArea: Number(totalArea.toFixed(1)),
    totalPlants,
    totalElements,
    categoryCounts,
    estimatedOccupiedArea: Number(Math.min(totalArea, estimatedOccupiedArea).toFixed(1)),
    spacingWarningsCount: collisionResult.warnings.length,
    waterSummary: { low: lowWater, medium: mediumWater, high: highWater },
    sunlightSummary: { fullSun, partialShade, fullShade },
  };
}

export function downloadCanvasImage(canvas: HTMLCanvasElement, filename = 'lush-garden-plan.png') {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to export canvas image', err);
  }
}

export function printGardenPlan(garden: GardenDesign, stats: GardenStatistics) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const plantsList: { name: string; category: string; matureCanopy: number; matureHeight: number; count: number }[] = [];
  const plantCounts = new Map<string, number>();

  garden.items.filter(i => i.type === 'plant').forEach(i => {
    plantCounts.set(i.itemId, (plantCounts.get(i.itemId) || 0) + 1);
  });

  plantCounts.forEach((count, id) => {
    const plant = getPlantById(id);
    if (plant) {
      plantsList.push({
        name: plant.name,
        category: plant.category,
        matureCanopy: plant.matureCanopy,
        matureHeight: plant.matureHeight,
        count,
      });
    }
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>LUSH Garden Plan - ${garden.name}</title>
        <style>
          body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
          .header { border-bottom: 3px solid #2d6a4f; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          h1 { color: #1b4332; margin: 0 0 6px 0; font-size: 28px; }
          .subtitle { color: #52b788; font-weight: 600; font-size: 16px; }
          .grid-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }
          .stat-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: 700; color: #1b4332; }
          .stat-label { font-size: 12px; text-transform: uppercase; color: #40916c; letter-spacing: 0.5px; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #2d6a4f; color: white; text-align: left; padding: 10px 14px; font-size: 13px; }
          td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          tr:nth-child(even) { background: #f8fafc; }
          .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 14px; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${garden.name}</h1>
            <div class="subtitle">LUSH – Smart Landscape Garden Plan</div>
          </div>
          <div style="text-align: right; font-size: 13px; color: #64748b;">
            <div>Dimensions: <strong>${garden.length}m × ${garden.width}m (${(garden.length * garden.width).toFixed(1)} m²)</strong></div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="grid-stats">
          <div class="stat-card">
            <div class="stat-value">${stats.totalArea} m²</div>
            <div class="stat-label">Total Land Area</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.totalPlants}</div>
            <div class="stat-label">Total Plants Placed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.estimatedOccupiedArea} m²</div>
            <div class="stat-label">Mature Canopy Area</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: ${stats.spacingWarningsCount > 0 ? '#d97706' : '#15803d'}">${stats.spacingWarningsCount}</div>
            <div class="stat-label">Spacing Alerts</div>
          </div>
        </div>

        <h3 style="color: #1b4332; margin-top: 24px;">Planting Schedule & Nursery Bill of Materials</h3>
        <table>
          <thead>
            <tr>
              <th>Qty</th>
              <th>Plant Name</th>
              <th>Category</th>
              <th>Mature Spread</th>
              <th>Mature Height</th>
            </tr>
          </thead>
          <tbody>
            ${plantsList.map(p => `
              <tr>
                <td><strong>${p.count}×</strong></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td>${p.matureCanopy} m</td>
                <td>${p.matureHeight} m</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <div>Generated by LUSH Smart Landscape Garden Planner</div>
          <div>Sustainable & Water-Wise Landscape Architecture</div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
