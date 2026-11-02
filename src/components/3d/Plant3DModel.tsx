import React, { useRef } from 'react';
import * as THREE from 'three';
import { PlacedItem, PlantDefinition } from '../../types/garden';
import { getPlantById } from '../../utils/collisionDetector';
import { useGardenStore } from '../../store/gardenStore';

interface Plant3DModelProps {
  item: PlacedItem;
  isSelected: boolean;
  status: 'safe' | 'warning' | 'critical';
  gardenLength: number;
  gardenWidth: number;
}

export const Plant3DModel: React.FC<Plant3DModelProps> = ({
  item,
  isSelected,
  status,
  gardenLength,
  gardenWidth,
}) => {
  const { selectItem, setHoveredItem } = useGardenStore();
  const groupRef = useRef<THREE.Group | null>(null);

  const plantDef: PlantDefinition | undefined = getPlantById(item.itemId);
  if (!plantDef) return null;

  // Convert Garden coords (0 to length, 0 to width) to 3D Scene coords centered at (0, 0, 0)
  // X: x - length / 2
  // Z: y - width / 2
  const posX = item.x - gardenLength / 2;
  const posZ = item.y - gardenWidth / 2;
  const rotY = (item.rotation * Math.PI) / 180;

  // Scale based on mature vs current
  // In 3D we present realistic mature dimensions so the user can accurately visualize the future garden
  const matureHeight = Math.max(0.3, plantDef.matureHeight || 2);
  const canopyWidth = Math.max(0.4, plantDef.matureCanopy || plantDef.matureWidth || 1.5);
  const canopyRadius = canopyWidth / 2;

  const foliageColor = plantDef.foliageColor || '#2d6a4f';
  const trunkColor = plantDef.trunkColor || '#5c4033';
  const flowerColor = plantDef.flowerColor || '#e63946';

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

  return (
    <group
      ref={groupRef}
      position={[posX, 0, posZ]}
      rotation={[0, -rotY, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Selection / Collision Ring on the ground */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[canopyRadius * 0.9, canopyRadius * 1.05, 32]} />
          <meshBasicMaterial
            color={status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#3b82f6'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Render 3D Model according to plant category / model3DType */}
      {renderBotanicalModel(plantDef.model3DType, {
        height: matureHeight,
        canopyRadius,
        foliageColor,
        trunkColor,
        flowerColor,
        accentColor: plantDef.colorTheme,
      })}
    </group>
  );
};

function renderBotanicalModel(
  type: string,
  props: {
    height: number;
    canopyRadius: number;
    foliageColor: string;
    trunkColor: string;
    flowerColor: string;
    accentColor: string;
  }
) {
  const { height, canopyRadius, foliageColor, trunkColor, flowerColor, accentColor } = props;

  switch (type) {
    case 'tree_spreading': {
      // Spreading shade tree (e.g. Mango, Neem, Banyan, Gulmohar)
      const trunkH = height * 0.45;
      const trunkR = Math.max(0.12, canopyRadius * 0.08);
      return (
        <group>
          {/* Main Trunk */}
          <mesh position={[0, trunkH / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[trunkR * 0.8, trunkR * 1.2, trunkH, 10]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} />
          </mesh>
          {/* Main Branches */}
          <mesh position={[trunkR * 0.6, trunkH * 0.8, 0]} rotation={[0, 0, -0.4]} castShadow>
            <cylinderGeometry args={[trunkR * 0.5, trunkR * 0.7, trunkH * 0.6, 8]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} />
          </mesh>
          <mesh position={[-trunkR * 0.6, trunkH * 0.75, 0]} rotation={[0, 0, 0.45]} castShadow>
            <cylinderGeometry args={[trunkR * 0.5, trunkR * 0.7, trunkH * 0.6, 8]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} />
          </mesh>
          {/* Layered Foliage Clusters */}
          <mesh position={[0, trunkH + canopyRadius * 0.45, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[canopyRadius * 0.65, 1]} />
            <meshStandardMaterial color={foliageColor} roughness={0.75} />
          </mesh>
          <mesh position={[canopyRadius * 0.4, trunkH + canopyRadius * 0.3, canopyRadius * 0.3]} castShadow>
            <dodecahedronGeometry args={[canopyRadius * 0.48, 1]} />
            <meshStandardMaterial color={accentColor || foliageColor} roughness={0.75} />
          </mesh>
          <mesh position={[-canopyRadius * 0.4, trunkH + canopyRadius * 0.35, -canopyRadius * 0.25]} castShadow>
            <dodecahedronGeometry args={[canopyRadius * 0.5, 1]} />
            <meshStandardMaterial color={foliageColor} roughness={0.75} />
          </mesh>
          <mesh position={[0, trunkH + canopyRadius * 0.8, 0]} castShadow>
            <dodecahedronGeometry args={[canopyRadius * 0.4, 1]} />
            <meshStandardMaterial color={foliageColor} roughness={0.75} />
          </mesh>
        </group>
      );
    }

    case 'tree_standard': {
      // Standard fruit / ornamental tree (e.g. Guava, Lemon, Japanese Maple)
      const trunkH = height * 0.48;
      const trunkR = Math.max(0.08, canopyRadius * 0.07);
      return (
        <group>
          <mesh position={[0, trunkH / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[trunkR * 0.8, trunkR * 1.1, trunkH, 8]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} />
          </mesh>
          <mesh position={[0, trunkH + canopyRadius * 0.5, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[canopyRadius * 0.65, 2]} />
            <meshStandardMaterial color={foliageColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, trunkH + canopyRadius * 0.95, 0]} castShadow>
            <dodecahedronGeometry args={[canopyRadius * 0.42, 1]} />
            <meshStandardMaterial color={accentColor || foliageColor} roughness={0.7} />
          </mesh>
        </group>
      );
    }

    case 'tree_conifer': {
      // Columnar or Conifer tree (e.g. False Ashoka, Bamboo)
      const trunkH = height * 0.2;
      const foliageH = height * 0.8;
      return (
        <group>
          <mesh position={[0, trunkH / 2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, trunkH, 8]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} />
          </mesh>
          {/* Tiered Foliage Cones */}
          <mesh position={[0, trunkH + foliageH * 0.3, 0]} castShadow receiveShadow>
            <coneGeometry args={[canopyRadius * 0.85, foliageH * 0.55, 9]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, trunkH + foliageH * 0.6, 0]} castShadow>
            <coneGeometry args={[canopyRadius * 0.65, foliageH * 0.5, 9]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, trunkH + foliageH * 0.85, 0]} castShadow>
            <coneGeometry args={[canopyRadius * 0.45, foliageH * 0.4, 9]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} />
          </mesh>
        </group>
      );
    }

    case 'palm': {
      // Tropical Palm (e.g. Coconut, Areca, Date Palm)
      const trunkH = height * 0.75;
      const trunkR = Math.max(0.1, canopyRadius * 0.08);
      const fronds = 10;
      return (
        <group>
          {/* Segmented Ringed Trunk */}
          <mesh position={[0, trunkH / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[trunkR * 0.75, trunkR * 1.15, trunkH, 8]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} />
          </mesh>
          {/* Palm Fronds radiating around crown */}
          {Array.from({ length: fronds }).map((_, idx) => {
            const angle = (idx * Math.PI * 2) / fronds;
            const frondLen = canopyRadius * 1.1;
            return (
              <group key={idx} position={[0, trunkH, 0]} rotation={[0, angle, 0]}>
                <mesh
                  position={[frondLen * 0.45, -frondLen * 0.2, 0]}
                  rotation={[0, 0, -0.65]}
                  castShadow
                >
                  <boxGeometry args={[frondLen, 0.02, 0.25]} />
                  <meshStandardMaterial color={foliageColor} roughness={0.65} />
                </mesh>
              </group>
            );
          })}
        </group>
      );
    }

    case 'flower_bush': {
      // Flowering bush (e.g. Rose, Hibiscus, Marigold, Periwinkle)
      const bushR = Math.max(0.25, canopyRadius);
      const bushH = height;
      return (
        <group>
          <mesh position={[0, bushH * 0.45, 0]} castShadow receiveShadow>
            <sphereGeometry args={[bushR, 8, 8]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} />
          </mesh>
          {/* Flower blossoms */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 6;
            const fx = Math.cos(angle) * (bushR * 0.85);
            const fz = Math.sin(angle) * (bushR * 0.85);
            const fy = bushH * 0.45 + (i % 2 === 0 ? 0.15 : -0.1) * bushR;
            return (
              <mesh key={i} position={[fx, fy, fz]} castShadow>
                <sphereGeometry args={[bushR * 0.25, 6, 6]} />
                <meshStandardMaterial color={flowerColor} roughness={0.5} />
              </mesh>
            );
          })}
        </group>
      );
    }

    case 'flower_tall': {
      // Tall flowers (e.g. Sunflower, Tulip)
      return (
        <group>
          {/* Stem */}
          <mesh position={[0, height * 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.03, height, 6]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.7} />
          </mesh>
          {/* Large Flower Head */}
          <mesh position={[0, height, 0]} rotation={[0.4, 0, 0]} castShadow>
            <cylinderGeometry args={[canopyRadius * 0.45, canopyRadius * 0.45, 0.05, 12]} />
            <meshStandardMaterial color={flowerColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, height + 0.02, 0.02]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[canopyRadius * 0.2, canopyRadius * 0.2, 0.06, 12]} />
            <meshStandardMaterial color="#3e2723" roughness={0.9} />
          </mesh>
        </group>
      );
    }

    case 'shrub_dense':
    case 'shrub_colored': {
      // Boxwood, Croton, Gardenia, Hosta
      const shrubR = Math.max(0.25, canopyRadius);
      return (
        <group>
          <mesh position={[0, height * 0.5, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[shrubR, 1]} />
            <meshStandardMaterial color={foliageColor} roughness={0.75} />
          </mesh>
        </group>
      );
    }

    case 'veggie_stake': {
      // Tomato / Chilli stake
      return (
        <group>
          {/* Stake */}
          <mesh position={[0, height * 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.025, height * 1.1, 6]} />
            <meshStandardMaterial color="#8d6e63" roughness={0.9} />
          </mesh>
          {/* Vine leaves */}
          <mesh position={[0, height * 0.45, 0]} castShadow receiveShadow>
            <coneGeometry args={[canopyRadius * 0.85, height * 0.75, 7]} />
            <meshStandardMaterial color={foliageColor} roughness={0.7} />
          </mesh>
          {/* Red Tomatoes */}
          <mesh position={[canopyRadius * 0.4, height * 0.35, 0]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color={flowerColor} roughness={0.4} />
          </mesh>
          <mesh position={[-canopyRadius * 0.35, height * 0.5, canopyRadius * 0.2]} castShadow>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color={flowerColor} roughness={0.4} />
          </mesh>
        </group>
      );
    }

    case 'veggie_ground': {
      // Pumpkin vine
      return (
        <group>
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[canopyRadius, canopyRadius * 1.1, 0.15, 8]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} />
          </mesh>
          {/* Pumpkin fruits */}
          <mesh position={[canopyRadius * 0.3, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.22, 10, 8]} />
            <meshStandardMaterial color={accentColor || '#f77f00'} roughness={0.6} />
          </mesh>
        </group>
      );
    }

    case 'water_lily': {
      // Floating water lily pads & blossom
      return (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[canopyRadius * 0.6, 16]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={flowerColor} roughness={0.3} />
          </mesh>
        </group>
      );
    }

    case 'grass_clump':
    case 'herb_mound':
    default: {
      // Grass clump or low herb mound
      return (
        <group>
          <mesh position={[0, height * 0.4, 0]} castShadow receiveShadow>
            <sphereGeometry args={[canopyRadius, 7, 6]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} />
          </mesh>
        </group>
      );
    }
  }
}
