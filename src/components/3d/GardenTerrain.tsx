import React from 'react';
import * as THREE from 'three';
import { useGardenStore } from '../../store/gardenStore';

interface GardenTerrainProps {
  length: number;
  width: number;
}

export const GardenTerrain: React.FC<GardenTerrainProps> = ({ length, width }) => {
  const { environmentLighting, placementModeItem, setPlacementModeItem, addItem, selectItem } = useGardenStore();

  // Lighting parameters based on selected time of day
  const isNight = environmentLighting === 'night';
  const isGolden = environmentLighting === 'golden_hour';

  const sunColor = isNight ? '#3b82f6' : isGolden ? '#ffaa5e' : '#ffffff';
  const sunIntensity = isNight ? 0.3 : isGolden ? 1.4 : 1.8;
  const sunPos: [number, number, number] = isNight
    ? [-10, 15, -10]
    : isGolden
    ? [20, 8, 15]
    : [15, 25, 18];

  const ambientColor = isNight ? '#1e293b' : isGolden ? '#fcd34d' : '#f0fdf4';
  const ambientIntensity = isNight ? 0.4 : isGolden ? 0.7 : 0.8;

  return (
    <group>
      {/* Dynamic Lighting */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      <directionalLight
        position={sunPos}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-length * 0.8}
        shadow-camera-right={length * 0.8}
        shadow-camera-top={width * 0.8}
        shadow-camera-bottom={-width * 0.8}
        shadow-bias={-0.0005}
      />

      {/* Secondary Soft Fill Light */}
      <directionalLight
        position={[-sunPos[0], 10, -sunPos[2]]}
        intensity={0.3}
        color="#c7d2fe"
      />

      {/* Main Garden Lawn Surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={(e) => {
          if (placementModeItem) {
            e.stopPropagation();
            const gx = e.point.x + length / 2;
            const gy = e.point.z + width / 2;
            const clampedX = Math.max(0.4, Math.min(length - 0.4, Number(gx.toFixed(2))));
            const clampedY = Math.max(0.4, Math.min(width - 0.4, Number(gy.toFixed(2))));
            const newInstanceId = addItem(placementModeItem.type, placementModeItem.id, clampedX, clampedY);
            selectItem(newInstanceId);
            setPlacementModeItem(null);
          }
        }}
      >
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial
          color={isNight ? '#134e4a' : isGolden ? '#4ade80' : '#22c55e'}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Garden Perimeter Raised Border / Curb */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <ringGeometry
          args={[
            Math.min(length, width) * 0.49,
            Math.min(length, width) * 0.5,
            4,
            1,
            Math.PI / 4,
          ]}
        />
        <meshStandardMaterial color="#1b4332" />
      </mesh>

      {/* Outer Yard / Landscape Surrounding Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[length * 2.5, width * 2.5]} />
        <meshStandardMaterial
          color={isNight ? '#0f172a' : '#dcfce7'}
          roughness={0.95}
        />
      </mesh>

      {/* Boundary Perimeter Fence / Wooden Posts */}
      <GardenBoundaryFence length={length} width={width} />
    </group>
  );
};

const GardenBoundaryFence: React.FC<{ length: number; width: number }> = ({ length, width }) => {
  const postSpacing = 2.0;
  const postRadius = 0.04;
  const postHeight = 1.0;

  const posts: [number, number][] = [];

  // Top & Bottom fence lines
  for (let x = -length / 2; x <= length / 2; x += postSpacing) {
    posts.push([x, -width / 2]);
    posts.push([x, width / 2]);
  }
  // Left & Right fence lines
  for (let z = -width / 2 + postSpacing; z < width / 2; z += postSpacing) {
    posts.push([-length / 2, z]);
    posts.push([length / 2, z]);
  }

  return (
    <group>
      {posts.map(([px, pz], idx) => (
        <mesh key={idx} position={[px, postHeight / 2, pz]} castShadow receiveShadow>
          <cylinderGeometry args={[postRadius, postRadius, postHeight, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      ))}
      {/* Top rails */}
      <mesh position={[0, postHeight * 0.85, -width / 2]} castShadow>
        <boxGeometry args={[length, 0.04, 0.04]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      <mesh position={[0, postHeight * 0.85, width / 2]} castShadow>
        <boxGeometry args={[length, 0.04, 0.04]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      <mesh position={[-length / 2, postHeight * 0.85, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[width, 0.04, 0.04]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      <mesh position={[length / 2, postHeight * 0.85, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[width, 0.04, 0.04]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
    </group>
  );
};
