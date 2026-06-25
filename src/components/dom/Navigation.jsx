'use client';

import React from 'react';
import { useResidencyStore } from '../../hooks/useResidencyStore';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { activeRoom, setRoom, dayNightMode, toggleDayNight } = useResidencyStore();

  const getZoneLabel = () => {
    switch (activeRoom) {
      case 'exterior': return 'Exterior';
      case 'living-room': return 'Living Room';
      case 'dj-corner': return 'DJ Booth';
      case 'sneaker-wall': return 'Sneaker Room';
      case 'clothing-rack': return '8th Street Rack';
      case 'magazine-rack': return 'Photography Stand';
      default: return 'Residency';
    }
  };

  const renderBackButton = () => {
    if (activeRoom === 'exterior') {
      return (
        <button 
          className={`${styles.pill} ${styles.pillBtn}`}
          onClick={() => setRoom('living-room')}
        >
          Enter Residency
        </button>
      );
    }
    
    if (activeRoom === 'living-room') {
      return (
        <button 
          className={`${styles.pill} ${styles.pillBtn}`}
          onClick={() => setRoom('exterior')}
        >
          Step Outside
        </button>
      );
    }

    return (
      <button 
        className={`${styles.pill} ${styles.pillBtn}`}
        onClick={() => setRoom('living-room')}
      >
        ← Back to Room
      </button>
    );
  };

  return (
    <nav className={styles.nav}>
      {/* Brand Label */}
      <div className={styles.brand}>
        <span className={styles.title}>The Residency</span>
        <span className={styles.subtitle}>on 8th Street</span>
      </div>

      {/* Ambient HUD Controls */}
      <div className={styles.controls}>
        {/* Active Zone Label */}
        <div className={styles.pill}>
          <span className={styles.zoneDot}></span>
          <span className={styles.zoneIndicator}>{getZoneLabel()}</span>
        </div>

        {/* Day/Night Toggle Light Switch Overlay */}
        <button 
          className={`${styles.pill} ${styles.pillBtn}`}
          onClick={toggleDayNight}
        >
          {dayNightMode === 'day' ? '☼ Day Mode' : '☾ Night Mode'}
        </button>

        {/* Dynamic Context Navigation Button */}
        {renderBackButton()}
      </div>
    </nav>
  );
}
