import React from 'react';
import { useResidencyStore } from '../../hooks/useResidencyStore';

export default function ClothingRack() {
  const triggerHover = useResidencyStore((state) => state.triggerHover);
  const clearHover = useResidencyStore((state) => state.clearHover);
  const hoveredItem = useResidencyStore((state) => state.hoveredItem);
  const dayNightMode = useResidencyStore((state) => state.dayNightMode);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    triggerHover(
      'clothing',
      "Welcome to 8th Street. This is my clothing line. Premium street fits, heavy cottons, dropped shoulders. Flip through the collection.",
      '/audio/clothing_intro.mp3'
    );
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    clearHover();
  };

  const isSelected = hoveredItem === 'clothing';

  // Procedural hanging t-shirts/hoodies
  const garmentColors = ['#1a1a1a', '#f5f2eb', '#2c2927', '#d15a3c', '#44445c'];

  return (
    <group
      position={[-4.8, 0, 2.2]}
      rotation={[0, Math.PI / 2, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 1. Metal rack structure */}
      {/* Left post */}
      <mesh castShadow position={[-0.8, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right post */}
      <mesh castShadow position={[0.8, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Top horizontal hanger bar */}
      <mesh castShadow position={[0, 1.58, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 1.64, 8]} />
        <meshStandardMaterial 
          color={isSelected ? '#d15a3c' : '#333333'} 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      {/* Bottom base support */}
      <mesh castShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[1.7, 0.04, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* 2. Hanging Garments */}
      {garmentColors.map((color, idx) => {
        const xPos = -0.5 + idx * 0.25;
        return (
          <group key={idx} position={[xPos, 1.48, 0]}>
            {/* Hanger neck wire */}
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />
              <meshStandardMaterial color="#555" metalness={0.9} />
            </mesh>
            {/* Hanger shoulders */}
            <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 12]}>
              <boxGeometry args={[0.3, 0.01, 0.02]} />
              <meshStandardMaterial color="#555" roughness={0.8} />
            </mesh>
            {/* Hanging Shirt Mesh */}
            <mesh castShadow position={[0, -0.4, 0]}>
              <boxGeometry args={[0.32, 0.72, 0.14]} />
              <meshStandardMaterial 
                color={color} 
                roughness={0.85} 
                metalness={0.05} 
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
