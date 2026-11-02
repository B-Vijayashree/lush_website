import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { CameraPreset } from '../../types/garden';

interface CameraControls3DProps {
  preset: CameraPreset;
  gardenLength: number;
  gardenWidth: number;
}

export const CameraControls3D: React.FC<CameraControls3DProps> = ({
  preset,
  gardenLength,
  gardenWidth,
}) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();

  const maxDim = Math.max(gardenLength, gardenWidth);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    // Center target is the center of the garden (0, 0, 0)
    controls.target.set(0, 0.5, 0);

    let targetPos = new THREE.Vector3();

    switch (preset) {
      case 'top':
        // Top-down view
        targetPos.set(0, maxDim * 1.5, 0.01);
        break;
      case 'front':
        // Front street/entrance view
        targetPos.set(0, maxDim * 0.4, maxDim * 1.2);
        break;
      case 'side':
        // Side profile view
        targetPos.set(maxDim * 1.2, maxDim * 0.4, 0);
        break;
      case 'birds_eye':
        // High angle dramatic bird's eye
        targetPos.set(maxDim * 1.0, maxDim * 1.2, maxDim * 1.0);
        break;
      case 'orbit':
      default:
        // Default 45° perspective
        targetPos.set(maxDim * 0.9, maxDim * 0.7, maxDim * 0.9);
        break;
    }

    camera.position.copy(targetPos);
    controls.update();
  }, [preset, maxDim, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.05} // Do not go below ground
      minDistance={2}
      maxDistance={maxDim * 3.5}
    />
  );
};
