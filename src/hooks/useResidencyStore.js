import { create } from 'zustand';

export const useResidencyStore = create((set, get) => ({
  // Active Room/View State
  // 'exterior' | 'living-room' | 'dj-corner' | 'sneaker-wall' | 'clothing-rack' | 'magazine-rack'
  activeRoom: 'exterior', 
  
  // Theme/Time-of-day State
  dayNightMode: 'day', // 'day' | 'night'

  // Ambient/Interaction Sound States
  musicPlaying: false,
  activeMix: {
    id: 'svr-010',
    title: 'SVR Mix 010',
    src: '/audio/svr_mix_010_placeholder.mp3' // Path to custom mix
  },
  ducking: false,
  voiceClipPlaying: false,
  currentVoiceSrc: null,

  // Hover/Interaction States
  hoveredItem: null, // 'dj_deck' | 'sneakers' | 'clothing' | 'photography' | null
  conversationalText: null,

  // Conversation/Hover State Machine mapping for anti-annoyance cooldown
  interactionHistory: {
    dj_deck: { hoverCount: 0, voicePlayed: false, lastHoveredTimestamp: 0 },
    sneakers: { hoverCount: 0, voicePlayed: false, lastHoveredTimestamp: 0 },
    clothing: { hoverCount: 0, voicePlayed: false, lastHoveredTimestamp: 0 },
    photography: { hoverCount: 0, voicePlayed: false, lastHoveredTimestamp: 0 }
  },

  // Actions
  setRoom: (room) => set({ activeRoom: room }),
  
  setDayNightMode: (mode) => {
    set({ dayNightMode: mode });
    if (typeof document !== 'undefined') {
      if (mode === 'night') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  },

  toggleDayNight: () => {
    const nextMode = get().dayNightMode === 'day' ? 'night' : 'day';
    get().setDayNightMode(nextMode);
  },

  setMusicPlaying: (playing) => set({ musicPlaying: playing }),
  setActiveMix: (mix) => set({ activeMix: mix, musicPlaying: true }),
  setDucking: (ducking) => set({ ducking }),
  setVoiceClipPlaying: (playing) => set({ voiceClipPlaying: playing }),

  // Custom hover trigger incorporating the cooldown state machine
  triggerHover: (itemId, text, voiceSrc) => {
    const history = get().interactionHistory;
    const itemHistory = history[itemId] || { hoverCount: 0, voicePlayed: false, lastHoveredTimestamp: 0 };
    const now = Date.now();
    
    // Cooldown check (5 minutes = 300,000 ms)
    const cooldownPeriod = 5 * 60 * 1000;
    const withinCooldown = now - itemHistory.lastHoveredTimestamp < cooldownPeriod;

    let shouldPlayVoice = false;
    let nextText = text;

    // Logic: 
    // - If it's the very first time hovering in this cooldown period, play voice.
    // - If we hover again shortly after, skip audio but show a dynamic silent text bubble (tooltip).
    // - Every 4th hover, trigger a short easter-egg audio clip as a fun interaction.
    if (!itemHistory.voicePlayed || !withinCooldown) {
      shouldPlayVoice = true;
    } else if (itemHistory.hoverCount % 4 === 3) {
      shouldPlayVoice = true;
      nextText = `Still looking, huh? ${text}`;
    }

    // Update history entry
    const updatedHistory = {
      ...history,
      [itemId]: {
        hoverCount: itemHistory.hoverCount + 1,
        voicePlayed: true,
        lastHoveredTimestamp: now
      }
    };

    set({
      hoveredItem: itemId,
      conversationalText: nextText,
      interactionHistory: updatedHistory,
      ...(shouldPlayVoice && voiceSrc ? { currentVoiceSrc: voiceSrc, voiceClipPlaying: true } : {})
    });
  },

  clearHover: () => set({ hoveredItem: null, conversationalText: null, currentVoiceSrc: null, voiceClipPlaying: false }),

  // Resets the cooldown logic for all objects (e.g., when transitioning rooms)
  resetCooldowns: () => {
    const history = get().interactionHistory;
    const resetHistory = {};
    Object.keys(history).forEach(key => {
      resetHistory[key] = {
        ...history[key],
        voicePlayed: false
      };
    });
    set({ interactionHistory: resetHistory });
  }
}));
