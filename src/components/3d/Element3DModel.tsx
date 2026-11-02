import React from 'react';
import * as THREE from 'three';
import { PlacedItem, ElementDefinition } from '../../types/garden';
import { getElementById } from '../../utils/collisionDetector';
import { useGardenStore } from '../../store/gardenStore';

interface Element3DModelProps {
  item: PlacedItem;
  isSelected: boolean;
  gardenLength: number;
  gardenWidth: number;
}

export const Element3DModel: React.FC<Element3DModelProps> = ({
  item,
  isSelected,
  gardenLength,
  gardenWidth,
}) => {
  const { selectItem, setHoveredItem } = useGardenStore();
  const elDef: ElementDefinition | undefined = getElementById(item.itemId);
  if (!elDef) return null;

  const posX = item.x - gardenLength / 2;
  const posZ = item.y - gardenWidth / 2;
  const rotY = (item.rotation * Math.PI) / 180;

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectItem(item.instanceId);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHoveredItem(item.instanceId);
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
    setHoveredItem(null);
  };

  const w = elDef.width;
  const l = elDef.length;
  const h = elDef.height || 0.1;

  return (
    <group
      position={[posX, 0, posZ]}
      rotation={[0, -rotY, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Selection bounding box outline */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[w + 0.2, l + 0.2]} />
          <meshBasicMaterial color="#3b82f6" wireframe />
        </mesh>
      )}

      {renderElementMesh(elDef.model3DType, { w, l, h, color: elDef.colorTheme })}
    </group>
  );
};

function renderElementMesh(
  type: string,
  props: { w: number; l: number; h: number; color: string }
) {
  const { w, l, h, color } = props;

  switch (type) {
    case 'path_wood_deck': {
      // Elevated cedar patio deck with planks
      const planksCount = 10;
      const plankLen = l / planksCount;
      return (
        <group position={[0, h / 2, 0]}>
          {/* Deck Foundation */}
          <mesh castShadow receiveShadow position={[0, -0.04, 0]}>
            <boxGeometry args={[w, h - 0.04, l]} />
            <meshStandardMaterial color="#5c3d2e" roughness={0.9} />
          </mesh>
          {/* Individual Planks */}
          {Array.from({ length: planksCount }).map((_, idx) => (
            <mesh
              key={idx}
              position={[0, h / 2 - 0.02, -l / 2 + (idx + 0.5) * plankLen]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[w, 0.03, plankLen * 0.9]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#b08968' : '#a07855'} roughness={0.7} />
            </mesh>
          ))}
        </group>
      );
    }

    case 'path_stepping_stone': {
      // Natural slate stone pavers
      const count = 3;
      const stepDist = l / (count + 0.5);
      return (
        <group position={[0, 0.02, 0]}>
          {Array.from({ length: count }).map((_, idx) => {
            const z = -l / 2 + (idx + 0.75) * stepDist;
            const x = (idx % 2 === 0 ? -0.12 : 0.12) * w;
            return (
              <mesh key={idx} position={[x, 0.015, z]} rotation={[0, idx * 0.6, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[w * 0.35, w * 0.38, 0.04, 8]} />
                <meshStandardMaterial color="#64748b" roughness={0.85} />
              </mesh>
            );
          })}
        </group>
      );
    }

    case 'water_pond': {
      // Natural landscape pond with water surface & stone border
      return (
        <group position={[0, 0.02, 0]}>
          {/* Stone border perimeter */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[Math.min(w, l) * 0.46, Math.min(w, l) * 0.55, 32]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          {/* Shimmering Water Basin */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <circleGeometry args={[Math.min(w, l) * 0.48, 32]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={0.88}
            />
          </mesh>
        </group>
      );
    }

    case 'water_fountain': {
      // Tiered stone fountain
      return (
        <group position={[0, 0, 0]}>
          {/* Base basin */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[w * 0.5, w * 0.55, 0.3, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.8} />
          </mesh>
          {/* Water pool */}
          <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[w * 0.45, 16]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.9} />
          </mesh>
          {/* Central pedestal */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.7, 8]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.8} />
          </mesh>
          {/* Top bowl */}
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[w * 0.25, 0.08, 0.15, 12]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.8} />
          </mesh>
        </group>
      );
    }

    case 'decor_bench': {
      // Cedar garden bench
      return (
        <group position={[0, 0, 0]}>
          {/* Legs */}
          <mesh position={[-w * 0.4, 0.22, 0]} castShadow>
            <boxGeometry args={[0.06, 0.44, l * 0.7]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          <mesh position={[w * 0.4, 0.22, 0]} castShadow>
            <boxGeometry args={[0.06, 0.44, l * 0.7]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          {/* Wooden seat slats */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.04, l * 0.75]} />
            <meshStandardMaterial color="#7f5539" roughness={0.7} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.7, -l * 0.32]} rotation={[0.1, 0, 0]} castShadow>
            <boxGeometry args={[w, 0.35, 0.04]} />
            <meshStandardMaterial color="#7f5539" roughness={0.7} />
          </mesh>
        </group>
      );
    }

    case 'decor_solar_light': {
      // Bollard solar light with soft warm glow
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, h * 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, h, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Glowing LED Cap */}
          <mesh position={[0, h, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      );
    }

    case 'decor_rock': {
      // Natural weathered granite boulder
      return (
        <group position={[0, h * 0.4, 0]}>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[Math.min(w, l) * 0.5, 1]} />
            <meshStandardMaterial color="#64748b" roughness={0.95} />
          </mesh>
        </group>
      );
    }

    case 'decor_pot': {
      // Terracotta planters
      return (
        <group position={[0, h * 0.4, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[w * 0.35, w * 0.22, h * 0.8, 12]} />
            <meshStandardMaterial color="#c2410c" roughness={0.8} />
          </mesh>
          {/* Green shrub inside pot */}
          <mesh position={[0, h * 0.55, 0]} castShadow>
            <sphereGeometry args={[w * 0.3, 8, 8]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.7} />
          </mesh>
        </group>
      );
    }

    case 'struct_pergola': {
      // Open timber arbor / pergola
      const postH = 2.3;
      return (
        <group position={[0, 0, 0]}>
          {/* 4 Corner Posts */}
          {[
            [-w / 2 + 0.1, -l / 2 + 0.1],
            [w / 2 - 0.1, -l / 2 + 0.1],
            [-w / 2 + 0.1, l / 2 - 0.1],
            [w / 2 - 0.1, l / 2 - 0.1],
          ].map(([px, pz], i) => (
            <mesh key={i} position={[px, postH / 2, pz]} castShadow>
              <boxGeometry args={[0.12, postH, 0.12]} />
              <meshStandardMaterial color="#7f5539" roughness={0.8} />
            </mesh>
          ))}
          {/* Top Crossbeams */}
          <mesh position={[0, postH, 0]} castShadow>
            <boxGeometry args={[w + 0.3, 0.1, l + 0.3]} />
            <meshStandardMaterial color="#8d6e63" roughness={0.8} />
          </mesh>
        </group>
      );
    }

    default: {
      return (
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, l]} />
          <meshStandardMaterial color={color || '#94a3b8'} roughness={0.8} />
        </mesh>
      );
    }
  }
}
