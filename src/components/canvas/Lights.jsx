import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResidencyStore } from '../../hooks/useResidencyStore';

export default function Lights() {
  const dayNightMode = useResidencyStore((state) => state.dayNightMode);
  
  const ambientLightRef = useRef();
  const dirLightRef = useRef();
  const neonLightRef = useRef();

  useFrame((state, delta) => {
    const isNight = dayNightMode === 'night';

    // Target light intensities and colors
    const targetAmbientInt = isNight ? 0.05 : 0.6;
    const targetAmbientColor = isNight ? '#0b0b1e' : '#fcf9f2';
    
    const targetDirInt = isNight ? 0.1 : 1.2;
    const targetDirColor = isNight ? '#5d5d8a' : '#fff5e0';

    const targetNeonInt = isNight ? 3.0 : 0.0;

    // Smoothly interpolate values to hit 340Hz target frames cleanly without jerks
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        targetAmbientInt,
        delta * 3
      );
      ambientLightRef.current.color.lerp(new THREE.Color(targetAmbientColor), delta * 3);
    }

    if (dirLightRef.current) {
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetDirInt,
        delta * 3
      );
      dirLightRef.current.color.lerp(new THREE.Color(targetDirColor), delta * 3);
    }

    if (neonLightRef.current) {
      neonLightRef.current.intensity = THREE.MathUtils.lerp(
        neonLightRef.current.intensity,
        targetNeonInt,
        delta * 3
      );
    }
  });

  return (
    <>
      {/* Ambient environment base light */}
      <ambientLight ref={ambientLightRef} intensity={0.6} color="#fcf9f2" />

      {/* Main direction sun/moon light */}
      <directionalLight
        ref={dirLightRef}
        position={[10, 15, 8]}
        intensity={1.2}
        color="#fff5e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Spot neon glow light centered on the DJ decks */}
      <spotLight
        ref={neonLightRef}
        position={[-5, 4, -5]}
        angle={0.6}
        penumbra={0.8}
        intensity={0}
        color="#ff3300"
        castShadow
      />
      
      {/* Warm accent floor lamps (static interior soft glows) */}
      <pointLight position={[5, 1.5, 4]} intensity={0.4} color="#ffb366" />
      <pointLight position={[-4, 1.2, 5]} intensity={0.3} color="#ffa366" />
    </>
  );
}
