import React from 'react';
import { useResidencyStore } from '../../hooks/useResidencyStore';
import Lights from './Lights';
import DJSetup from './DJSetup';
import SneakerWall from './SneakerWall';
import ClothingRack from './ClothingRack';
import MagazineRack from './MagazineRack';

export default function Room({ frequencyData }) {
  const dayNightMode = useResidencyStore((state) => state.dayNightMode);
  const toggleDayNight = useResidencyStore((state) => state.toggleDayNight);

  const handleSwitchOver = () => {
    document.body.style.cursor = 'pointer';
  };

  const handleSwitchOut = () => {
    document.body.style.cursor = 'default';
  };

  const isNight = dayNightMode === 'night';

  return (
    <group>
      {/* 1. Environmental Lights Cycle */}
      <Lights />

      {/* 2. Room Structure */}
      {/* Floor */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[10, 0.1, 10]} />
        <meshStandardMaterial 
          color={isNight ? '#0d0d0d' : '#ece7dd'} 
          roughness={0.6} 
          metalness={0.1}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3.05, 0]}>
        <boxGeometry args={[10, 0.1, 10]} />
        <meshStandardMaterial color={isNight ? '#080808' : '#faf8f5'} roughness={0.9} />
      </mesh>

      {/* Back Wall */}
      <mesh receiveShadow position={[0, 1.5, -5]}>
        <boxGeometry args={[10, 3, 0.1]} />
        <meshStandardMaterial color={isNight ? '#121212' : '#f5f2eb'} roughness={0.8} />
      </mesh>

      {/* Left Wall */}
      <mesh receiveShadow position={[-5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 3, 0.1]} />
        <meshStandardMaterial color={isNight ? '#101010' : '#f5f2eb'} roughness={0.8} />
      </mesh>

      {/* Right Wall */}
      <mesh receiveShadow position={[5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[10, 3, 0.1]} />
        <meshStandardMaterial color={isNight ? '#101010' : '#f5f2eb'} roughness={0.8} />
      </mesh>

      {/* 3. Wall Hung Photography Art Canvas */}
      <group position={[0, 1.6, -4.9]}>
        {/* Frame border */}
        <mesh castShadow>
          <boxGeometry args={[2.0, 1.3, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Picture Canvas */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.8, 1.1]} />
          <meshStandardMaterial 
            color={isNight ? '#1b1a1c' : '#ffffff'} 
            roughness={0.9} 
          />
        </mesh>
      </group>

      {/* 4. Interactive Light Switch (Mounted on the back wall near DJ) */}
      <group 
        position={[-2.8, 1.3, -4.92]}
        onClick={(e) => {
          e.stopPropagation();
          toggleDayNight();
        }}
        onPointerOver={handleSwitchOver}
        onPointerOut={handleSwitchOut}
      >
        {/* Switch Plate */}
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.22, 0.03]} />
          <meshStandardMaterial color={isNight ? '#222222' : '#ffffff'} roughness={0.4} />
        </mesh>
        {/* Switch Toggle Pin */}
        <mesh position={[0, isNight ? -0.04 : 0.04, 0.02]} rotation={[isNight ? -0.2 : 0.2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
          <meshStandardMaterial color={isNight ? '#ff5233' : '#cccccc'} emissive={isNight ? '#ff5233' : '#000000'} emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 5. In-Room Interactive Modules */}
      <DJSetup frequencyData={frequencyData} />
      <SneakerWall />
      <ClothingRack />
      <MagazineRack />
    </group>
  );
}
