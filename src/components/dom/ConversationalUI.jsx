'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResidencyStore } from '../../hooks/useResidencyStore';
import styles from './ConversationalUI.module.css';

export default function ConversationalUI() {
  const { hoveredItem, conversationalText, setRoom, musicPlaying, setMusicPlaying } = useResidencyStore();
  const [typedText, setTypedText] = useState('');

  // Typewriter effect
  useEffect(() => {
    if (!conversationalText) {
      setTypedText('');
      return;
    }

    setTypedText('');
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + conversationalText.charAt(index));
      index++;
      if (index >= conversationalText.length) {
        clearInterval(interval);
      }
    }, 15); // Fast typewriter speed

    return () => clearInterval(interval);
  }, [conversationalText]);

  if (!hoveredItem) return null;

  // Custom UI Buttons depending on focused item
  const renderActions = () => {
    switch (hoveredItem) {
      case 'dj_deck':
        return (
          <>
            <button 
              className={`${styles.btn} ${styles.primaryBtn}`}
              onClick={() => setMusicPlaying(!musicPlaying)}
            >
              {musicPlaying ? 'Pause Mix' : 'Play SVR Mix'}
            </button>
            <button 
              className={`${styles.btn} ${styles.secondaryBtn}`}
              onClick={() => setRoom('dj-corner')}
            >
              Step Closer
            </button>
          </>
        );
      case 'sneakers':
        return (
          <>
            <button 
              className={`${styles.btn} ${styles.primaryBtn}`}
              onClick={() => setRoom('sneaker-wall')}
            >
              View Wall
            </button>
            <button className={`${styles.btn} ${styles.secondaryBtn}`}>
              Check Inventory
            </button>
          </>
        );
      case 'clothing':
        return (
          <>
            <button 
              className={`${styles.btn} ${styles.primaryBtn}`}
              onClick={() => setRoom('clothing-rack')}
            >
              Inspect Rack
            </button>
            <button className={`${styles.btn} ${styles.secondaryBtn}`}>
              Shop 8th Street
            </button>
          </>
        );
      case 'photography':
        return (
          <>
            <button 
              className={`${styles.btn} ${styles.primaryBtn}`}
              onClick={() => setRoom('magazine-rack')}
            >
              Open Book
            </button>
            <button className={`${styles.btn} ${styles.secondaryBtn}`}>
              View Wall Art
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        {/* Header - Speaker Info */}
        <div className={styles.header}>
          <div className={styles.avatar}>S</div>
          <div className={styles.nameInfo}>
            <span className={styles.speakerName}>Shaun</span>
            <span className={styles.speakerTitle}>Resident SVR / 8th Street</span>
          </div>
        </div>

        {/* Body - Interactive dialogue */}
        <div className={styles.body}>
          <p className={styles.text}>{typedText}</p>
        </div>

        {/* Footer - Dynamic navigation CTAs */}
        <div className={styles.footer}>
          {renderActions()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
