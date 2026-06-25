import React from 'react';
import { useResidencyStore } from '../../hooks/useResidencyStore';

export default function MagazineRack() {
  const triggerHover = useResidencyStore((state) => state.triggerHover);
  const clearHover = useResidencyStore((state) => state.clearHover);
  const hoveredItem = useResidencyStore((state) => state.hoveredItem);
  const dayNightMode = useResidencyStore((state) => state.dayNightMode);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    triggerHover(
      'photography',
      "My visual archive. The book rack contains editorial spreads, street layouts, and portraits I've captured. Flip through the pages.",
      '/audio/photo_intro.mp3'
    );
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    clearHover();
  };

  const isSelected = hoveredItem === 'photography';

  return (
    <group
      position={[3.0, 0, -3.2]}
      rotation={[0, -Math.PI / 4, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 1. Procedural Book Rack Stand */}
      {/* Base leg left */}
      <mesh castShadow position={[-0.4, 0.4, 0]}>
        <boxGeometry args={[0.04, 0.8, 0.04]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.7} />
      </mesh>
      {/* Base leg right */}
      <mesh castShadow position={[0.4, 0.4, 0]}>
        <boxGeometry args={[0.04, 0.8, 0.04]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.7} />
      </mesh>
      {/* Shelving backboard angled */}
      <mesh castShadow position={[0, 0.85, 0]} rotation={[Math.PI / 10, 0, 0]}>
        <boxGeometry args={[0.9, 0.6, 0.03]} />
        <meshStandardMaterial 
          color={dayNightMode === 'night' ? '#1c1c1c' : '#eae5dc'} 
          roughness={0.9} 
        />
      </mesh>

      {/* 2. Interactive Magazine / Book pages */}
      <group position={[0, 0.9, 0.05]} rotation={[Math.PI / 10, 0, 0]}>
        {/* Closed/Angled magazine representation */}
        <mesh castShadow position={[-0.18, 0, 0]}>
          <boxGeometry args={[0.3, 0.4, 0.04]} />
          <meshStandardMaterial 
            color={isSelected ? '#d15a3c' : '#222222'} 
            roughness={0.5} 
          />
          {/* Cover highlight */}
          <mesh position={[0, 0, 0.021]}>
            <planeGeometry args={[0.26, 0.36]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
        </mesh>

        <mesh castShadow position={[0.18, -0.05, 0.01]} rotation={[0, 0, -Math.PI / 36]}>
          <boxGeometry args={[0.28, 0.38, 0.03]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          {/* Cover image highlight */}
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[0.24, 0.34]} />
            <meshStandardMaterial color="#f7f5f0" roughness={0.9} />
          </mesh>
        </mesh>
      </group>
    </group>
  );
}
