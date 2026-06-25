import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResidencyStore } from '../../hooks/useResidencyStore';

export default function SneakerWall() {
  const triggerHover = useResidencyStore((state) => state.triggerHover);
  const clearHover = useResidencyStore((state) => state.clearHover);
  const hoveredItem = useResidencyStore((state) => state.hoveredItem);
  const dayNightMode = useResidencyStore((state) => state.dayNightMode);

  const shoeRefs = useRef([]);
  shoeRefs.current = [];

  const addShoeRef = (el) => {
    if (el && !shoeRefs.current.includes(el)) {
      shoeRefs.current.push(el);
    }
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Subtly hover the sneakers on shelves (slow float animation like in games)
    shoeRefs.current.forEach((shoe, idx) => {
      if (shoe) {
        shoe.position.y = Math.sin(time * 2 + idx * 1.5) * 0.03 + (0.35 + Math.floor(idx / 3) * 0.55);
        shoe.rotation.y = time * 0.3 + idx;
      }
    });
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    triggerHover(
      'sneakers',
      "Yeah, sneakers have been a big part of my aesthetic. The wall shows off pairs I've curated or trade. Hover over custom drops.",
      '/audio/sneaker_intro.mp3'
    );
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    clearHover();
  };

  const isSelected = hoveredItem === 'sneakers';

  // Procedural sneaker meshes (simplified bounding shapes that look like custom kicks)
  const sneakerData = [
    { color: '#d15a3c', xOffset: -0.4 }, // Terracotta
    { color: '#1a1a1a', xOffset: 0.4 },  // Stealth Black
    { color: '#ffb366', xOffset: 0 },    // Ochre Gold
    { color: '#ffffff', xOffset: -0.4 }, // Clean White
    { color: '#5d5d8a', xOffset: 0.4 },  // Indigo Blue
    { color: '#ff5233', xOffset: 0 }     // Fire Red
  ];

  return (
    <group
      position={[4.8, 0, 0.8]}
      rotation={[0, -Math.PI / 2, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 1. Shelving backboard / frame */}
      <mesh castShadow receiveShadow position={[0, 1.0, 0]}>
        <boxGeometry args={[1.5, 2.0, 0.15]} />
        <meshStandardMaterial 
          color={dayNightMode === 'night' ? '#181818' : '#e5e1d8'} 
          roughness={0.8}
        />
      </mesh>

      {/* Horizontal Shelves */}
      {[0.3, 0.85, 1.4].map((y, idx) => (
        <mesh key={idx} castShadow position={[0, y, 0.18]}>
          <boxGeometry args={[1.4, 0.03, 0.4]} />
          <meshStandardMaterial 
            color={isSelected ? '#d15a3c' : '#222222'} 
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>
      ))}

      {/* 2. Interactive Floating Sneakers */}
      {sneakerData.map((shoe, idx) => (
        <group 
          key={idx} 
          ref={addShoeRef} 
          position={[shoe.xOffset, 0.35 + Math.floor(idx / 3) * 0.55, 0.25]}
        >
          {/* Main shoe body box */}
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.1, 0.12]} />
            <meshStandardMaterial color={shoe.color} roughness={0.4} />
          </mesh>
          {/* Shoe sole */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.28, 0.02, 0.13]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          {/* Shoe ankle collar */}
          <mesh position={[-0.05, 0.08, 0]}>
            <boxGeometry args={[0.13, 0.09, 0.11]} />
            <meshStandardMaterial color={shoe.color} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
