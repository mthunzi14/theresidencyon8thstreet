'use client';

import React, { useRef, useEffect } from 'react';
import { useResidencyStore } from '../../hooks/useResidencyStore';
import styles from './MobileCarousel.module.css';

const MOBILE_ROOMS = [
  { id: 'living-room', title: 'Living Room', desc: "Shaun's home hub. Explore items from DJ sets to sneakers.", triggerText: "Welcome to my crib. Click around to see the different rooms." },
  { id: 'dj-corner', title: 'DJ Booth', desc: "SVR mixes playing. Listen to vinyl and live sets.", triggerText: "This is the SVR booth. I'm usually spinning vinyl here. This mix playing is SVR Mix 010. Skip, pause, or let the record spin." },
  { id: 'sneaker-wall', title: 'Sneaker Room', desc: "Curated collection of custom models and sneakers.", triggerText: "Yeah, sneakers have been a big part of my aesthetic. The wall shows off pairs I've curated or trade. Hover over custom drops." },
  { id: 'clothing-rack', title: '8th Street Rack', desc: "Shaun's clothing line, premium street garments.", triggerText: "Welcome to 8th Street. This is my clothing line. Premium street fits, heavy cottons, dropped shoulders. Flip through the collection." },
  { id: 'magazine-rack', title: 'Photography Stand', desc: "Lookbook visual portfolio and photo archive.", triggerText: "My visual archive. The book rack contains editorial spreads, street layouts, and portraits I've captured. Flip through the pages." }
];

export default function MobileCarousel() {
  const { activeRoom, setRoom, triggerHover, hoveredItem } = useResidencyStore();
  const containerRef = useRef(null);

  // Sync horizontal scrolling when activeRoom changes from other interactions
  useEffect(() => {
    if (!containerRef.current) return;
    const activeIdx = MOBILE_ROOMS.findIndex(r => r.id === activeRoom);
    if (activeIdx !== -1) {
      const child = containerRef.current.children[activeIdx];
      if (child) {
        containerRef.current.scrollTo({
          left: child.offsetLeft - 32,
          behavior: 'smooth'
        });
      }
    }
  }, [activeRoom]);

  // Handle manual card selection (clicks/swipes)
  const handleCardSelect = (roomId, triggerText) => {
    setRoom(roomId);
    
    // Simulate hover/focus text trigger on mobile select
    triggerHover(
      roomId === 'dj-corner' ? 'dj_deck' : 
      roomId === 'sneaker-wall' ? 'sneakers' : 
      roomId === 'clothing-rack' ? 'clothing' : 
      roomId === 'magazine-rack' ? 'photography' : null,
      triggerText
    );
  };

  // Hide carousel if we are on the exterior page
  if (activeRoom === 'exterior') return null;

  return (
    <div className={styles.carousel}>
      {/* Horizontal Swipe Card Container */}
      <div ref={containerRef} className={styles.track}>
        {MOBILE_ROOMS.map((room) => {
          const isActive = activeRoom === room.id;
          return (
            <div
              key={room.id}
              className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
              onClick={() => handleCardSelect(room.id, room.triggerText)}
            >
              <span className={styles.cardTitle}>{room.title}</span>
              <p className={styles.cardDesc}>{room.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Slide Indicators / Dots */}
      <div className={styles.indicators}>
        {MOBILE_ROOMS.map((room) => {
          const isActive = activeRoom === room.id;
          return (
            <div
              key={room.id}
              className={`${styles.dot} ${isActive ? styles.dotActive : ''}`}
              onClick={() => handleCardSelect(room.id, room.triggerText)}
            />
          );
        })}
      </div>
    </div>
  );
}
