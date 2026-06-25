import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResidencyStore } from '../../hooks/useResidencyStore';

export default function DJSetup({ frequencyData }) {
  const triggerHover = useResidencyStore((state) => state.triggerHover);
  const clearHover = useResidencyStore((state) => state.clearHover);
  const hoveredItem = useResidencyStore((state) => state.hoveredItem);
  const dayNightMode = useResidencyStore((state) => state.dayNightMode);
  
  const djCornerRef = useRef();
  const vinylLeftRef = useRef();
  const vinylRightRef = useRef();
  const screenMaterialRef = useRef();
  const glowLightRef = useRef();

  useFrame((state, delta) => {
    // 1. Audio Reactivity Calculations
    let bassGlow = 0;
    let midGlow = 0;

    if (frequencyData && frequencyData.length > 0) {
      // Bass frequencies (index 1 to 4)
      bassGlow = (frequencyData[1] || 0) / 255;
      // Mid frequencies (index 8 to 12)
      midGlow = (frequencyData[10] || 0) / 255;
    }

    // Spin vinyl discs (quicker spin when bass kicks)
    const spinSpeed = delta * (1.5 + bassGlow * 4);
    if (vinylLeftRef.current) vinylLeftRef.current.rotation.y += spinSpeed;
    if (vinylRightRef.current) vinylRightRef.current.rotation.y += spinSpeed;

    // Pulse deck screen glow
    if (screenMaterialRef.current) {
      const targetEmissive = new THREE.Color(
        dayNightMode === 'night' 
          ? `rgb(${Math.floor(255 * bassGlow)}, 80, 50)` 
          : `rgb(80, ${Math.floor(100 + midGlow * 155)}, 200)`
      );
      screenMaterialRef.current.emissive.lerp(targetEmissive, delta * 10);
      screenMaterialRef.current.emissiveIntensity = 0.5 + bassGlow * 3;
    }

    // Pulse deck local spot/glow light
    if (glowLightRef.current) {
      glowLightRef.current.intensity = THREE.MathUtils.lerp(
        glowLightRef.current.intensity,
        dayNightMode === 'night' ? 1.0 + bassGlow * 2.5 : 0.2 + bassGlow * 0.5,
        delta * 12
      );
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    
    // Trigger Shaun's greeting text & local audio clip
    triggerHover(
      'dj_deck',
      "This is the SVR booth. I'm usually spinning vinyl here. This mix playing is SVR Mix 010. Skip, pause, or let the record spin.",
      '/audio/dj_intro.mp3'
    );
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    clearHover();
  };

  const isSelected = hoveredItem === 'dj_deck';

  return (
    <group 
      ref={djCornerRef} 
      position={[-5, 0, -5]} 
      rotation={[0, Math.PI / 4, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 1. Procedural DJ Booth Table Desk */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2.5, 1.0, 0.9]} />
        <meshStandardMaterial 
          color={dayNightMode === 'night' ? '#121212' : '#d8d4cd'} 
          roughness={0.7} 
          metalness={0.1}
        />
      </mesh>

      {/* Desk top surface highlight */}
      <mesh castShadow position={[0, 1.01, 0]}>
        <boxGeometry args={[2.52, 0.02, 0.92]} />
        <meshStandardMaterial 
          color={isSelected ? '#d15a3c' : '#222222'} 
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Audio-reactive Turntable Decks (Left & Right) */}
      <group position={[-0.7, 1.05, 0]}>
        {/* Base */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.05, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        {/* Platter (Left Vinyl) */}
        <mesh ref={vinylLeftRef} castShadow position={[0, 0.035, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.01, 32]} />
          <meshStandardMaterial color="#080808" roughness={0.1} metalness={0.9} />
          {/* Vinyl label */}
          <mesh position={[0, 0.006, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.001, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
        </mesh>
      </group>

      <group position={[0.7, 1.05, 0]}>
        {/* Base */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.05, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        {/* Platter (Right Vinyl) */}
        <mesh ref={vinylRightRef} castShadow position={[0, 0.035, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.01, 32]} />
          <meshStandardMaterial color="#080808" roughness={0.1} metalness={0.9} />
          {/* Vinyl label */}
          <mesh position={[0, 0.006, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.001, 16]} />
            <meshStandardMaterial color="#ff5233" roughness={0.9} />
          </mesh>
        </mesh>
      </group>

      {/* 3. Center Mixer with Reactive Neon Screen */}
      <group position={[0, 1.05, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.06, 0.58]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.4} />
        </mesh>
        {/* Screen Mesh */}
        <mesh castShadow position={[0, 0.031, 0.1]}>
          <boxGeometry args={[0.3, 0.005, 0.15]} />
          <meshStandardMaterial 
            ref={screenMaterialRef}
            color="#000000" 
            emissive="#d15a3c"
            emissiveIntensity={0.5}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Local deck glow light */}
      <pointLight 
        ref={glowLightRef} 
        position={[0, 1.5, 0]} 
        color={dayNightMode === 'night' ? '#ff3b11' : '#ffb833'} 
        distance={4} 
        intensity={0.4} 
      />
    </group>
  );
}
