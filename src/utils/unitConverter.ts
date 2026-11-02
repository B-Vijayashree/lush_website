import { Unit } from '../types/garden';

export const METERS_TO_FEET = 3.28084;
export const FEET_TO_METERS = 0.3048;
export const SQM_TO_SQFT = 10.7639;

export function metersToFeet(meters: number): number {
  return meters * METERS_TO_FEET;
}

export function feetToMeters(feet: number): number {
  return feet * FEET_TO_METERS;
}

export function formatDistance(meters: number, unit: Unit): string {
  if (unit === 'ft') {
    const feet = metersToFeet(meters);
    return `${feet.toFixed(1)} ft`;
  }
  return `${meters.toFixed(1)} m`;
}

export function formatArea(lengthMeters: number, widthMeters: number, unit: Unit): string {
  const sqMeters = lengthMeters * widthMeters;
  if (unit === 'ft') {
    const sqFeet = sqMeters * SQM_TO_SQFT;
    return `${Math.round(sqFeet).toLocaleString()} sq ft`;
  }
  return `${Math.round(sqMeters).toLocaleString()} m²`;
}

export function calculateArea(lengthMeters: number, widthMeters: number, unit: Unit): {
  sqMeters: number;
  sqFeet: number;
  displayStr: string;
} {
  const sqMeters = lengthMeters * widthMeters;
  const sqFeet = sqMeters * SQM_TO_SQFT;
  return {
    sqMeters: Number(sqMeters.toFixed(1)),
    sqFeet: Math.round(sqFeet),
    displayStr: unit === 'ft' ? `${Math.round(sqFeet).toLocaleString()} ft²` : `${sqMeters.toFixed(1)} m²`
  };
}
