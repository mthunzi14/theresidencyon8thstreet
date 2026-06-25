'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useResidencyStore } from '../hooks/useResidencyStore';
import { useAudioEngine } from '../hooks/useAudioEngine';
import Room from '../components/canvas/Room';
import CameraController from '../components/canvas/CameraController';
import Navigation from '../components/dom/Navigation';
import ConversationalUI from '../components/dom/ConversationalUI';
import MobileCarousel from '../components/dom/MobileCarousel';
import styles from './page.module.css';

export default function Home() {
  const { activeRoom, setRoom, setMusicPlaying } = useResidencyStore();
  const { frequencyData, initAudio, updateSpatialListener } = useAudioEngine();

  const handleEnterResidency = () => {
    // Initialize Web Audio API in response to user interaction
    initAudio();
    // Transition camera into the living room
    setRoom('living-room');
    // Start playing the DJ mix
    setMusicPlaying(true);
  };

  const isExterior = activeRoom === 'exterior';

  return (
    <div className={styles.container}>
      {/* 1. Immersive 3D WebGL Canvas */}
      <div className={styles.canvasContainer}>
        <Canvas
          shadows
          camera={{ position: [0, 2.5, 15], fov: 45 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <Room frequencyData={frequencyData} />
            <CameraController updateSpatialListener={updateSpatialListener} />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. Brand HUD Overlay Navigation */}
      <Navigation />

      {/* 3. Typewriter Conversational Dialogue Card */}
      <ConversationalUI />

      {/* 4. Swipeable Carousel for Responsive Mobile Views */}
      <MobileCarousel />

      {/* 5. Autoplay Bypass Welcome Portal (Exterior Landing Screen) */}
      {isExterior && (
        <div className={styles.portalOverlay}>
          <div className={styles.portalContent}>
            <h1 className={styles.title}>The Residency</h1>
            <p className={styles.subtitle}>ON 8TH STREET</p>
            <div className={styles.divider}></div>
            <button 
              className={styles.enterBtn}
              onClick={handleEnterResidency}
            >
              Enter The Residency
            </button>
            <p className={styles.footerNote}>
              *Experience contains audio and interactive 3D elements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
