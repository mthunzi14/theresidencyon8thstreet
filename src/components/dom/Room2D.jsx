'use client';

import React from 'react';
import { useResidencyStore } from '../../hooks/useResidencyStore';
import styles from './Room2D.module.css';

export default function Room2D() {
  const { 
    hoveredItem, 
    triggerHover, 
    clearHover, 
    toggleDayNight,
    activeRoom,
    setRoom
  } = useResidencyStore();

  const handlePointerOver = (itemId, text, voiceSrc) => {
    // Show cursor indicator
    document.body.style.cursor = 'pointer';
    triggerHover(itemId, text, voiceSrc);
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    clearHover();
  };

  const isDimmed = hoveredItem !== null;

  return (
    <div className={styles.viewport}>
      {/* 2D Room layout container with 1:1 aspect ratio mapping */}
      <div className={`${styles.roomContainer} ${isDimmed ? styles.roomDimmed : ''}`}>
        
        {/* Dimming overlay when a hotspot is focused */}
        <div className={styles.dimOverlay}></div>

        {/* 1. Interactive Wall Light Switch (Toggles Day/Night) */}
        <div 
          className={styles.lightSwitch}
          onClick={toggleDayNight}
          title="Toggle Lights"
        >
          <div className={styles.switchIndicator}></div>
        </div>

        {/* 2. DJ Booth Hotspot & Cutout */}
        <div 
          className={`${styles.hotspot} ${styles.djDeck} ${hoveredItem === 'dj_deck' ? styles.hotspotActive : ''}`}
          onPointerOver={() => handlePointerOver(
            'dj_deck',
            "This is the SVR booth. I'm usually spinning vinyl here. This mix playing is SVR Mix 010. Skip, pause, or let the record spin.",
            '/audio/dj_intro.mp3'
          )}
          onPointerOut={handlePointerOut}
          onClick={() => setRoom('dj-corner')}
        >
          <div className={styles.pulseDot}></div>
          <img 
            src="/images/dj_deck.png" 
            alt="DJ Deck Cutout" 
            className={styles.cutout}
          />
        </div>

        {/* 3. Sneaker Wall Hotspot & Cutout */}
        <div 
          className={`${styles.hotspot} ${styles.sneakers} ${hoveredItem === 'sneakers' ? styles.hotspotActive : ''}`}
          onPointerOver={() => handlePointerOver(
            'sneakers',
            "Yeah, sneakers have been a big part of my aesthetic. The wall shows off pairs I've curated or trade. Hover over custom drops.",
            '/audio/sneaker_intro.mp3'
          )}
          onPointerOut={handlePointerOut}
          onClick={() => setRoom('sneaker-wall')}
        >
          <div className={styles.pulseDot}></div>
          <img 
            src="/images/sneakers.png" 
            alt="Sneakers Cutout" 
            className={styles.cutout}
          />
        </div>

        {/* 4. Clothing Rack Hotspot & Cutout */}
        <div 
          className={`${styles.hotspot} ${styles.clothingRack} ${hoveredItem === 'clothing' ? styles.hotspotActive : ''}`}
          onPointerOver={() => handlePointerOver(
            'clothing',
            "Welcome to 8th Street. This is my clothing line. Premium street fits, heavy cottons, dropped shoulders. Flip through the collection.",
            '/audio/clothing_intro.mp3'
          )}
          onPointerOut={handlePointerOut}
          onClick={() => setRoom('clothing-rack')}
        >
          <div className={styles.pulseDot}></div>
          <img 
            src="/images/clothing_rack.png" 
            alt="Clothing Rack Cutout" 
            className={styles.cutout}
          />
        </div>

        {/* 5. Photography / Open Book Hotspot & Cutout */}
        <div 
          className={`${styles.hotspot} ${styles.photography} ${hoveredItem === 'photography' ? styles.hotspotActive : ''}`}
          onPointerOver={() => handlePointerOver(
            'photography',
            "My visual archive. The book rack contains editorial spreads, street layouts, and portraits I've captured. Flip through the pages.",
            '/audio/photo_intro.mp3'
          )}
          onPointerOut={handlePointerOut}
          onClick={() => setRoom('magazine-rack')}
        >
          <div className={styles.pulseDot}></div>
          <img 
            src="/images/photography_book.png" 
            alt="Photography Book Cutout" 
            className={styles.cutout}
          />
        </div>

      </div>
    </div>
  );
}
