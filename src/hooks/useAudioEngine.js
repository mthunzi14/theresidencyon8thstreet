import { useEffect, useRef, useState } from 'react';
import { useResidencyStore } from './useResidencyStore';

// Web Audio API context singleton
let audioCtx = null;
let mixSource = null;
let mixGainNode = null;
let filterNode = null;
let pannerNode = null;
let analyserNode = null;

let voiceSource = null;
let voiceGainNode = null;

export function useAudioEngine() {
  const { 
    musicPlaying, 
    activeMix, 
    dayNightMode, 
    activeRoom,
    ducking,
    setDucking,
    voiceClipPlaying,
    currentVoiceSrc,
    setVoiceClipPlaying 
  } = useResidencyStore();

  const [frequencyData, setFrequencyData] = useState(new Uint8Array(0));
  const audioElRef = useRef(null);
  const voiceElRef = useRef(null);
  const rafRef = useRef(null);

  // Initialize Web Audio API client-side
  const initAudio = () => {
    if (audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioCtx = new AudioContext();

    // Create background audio element
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.loop = true;
    audioElRef.current = audio;

    // Create voice snippet audio element
    const voiceAudio = new Audio();
    voiceAudio.crossOrigin = 'anonymous';
    voiceElRef.current = voiceAudio;

    // Configure nodes
    mixGainNode = audioCtx.createGain();
    voiceGainNode = audioCtx.createGain();
    
    // Create Low-pass filter (for moving away from DJ corner)
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 22000; // start open

    // Create 3D Spatial Panner
    pannerNode = audioCtx.createPanner();
    pannerNode.panningModel = 'HRTF';
    pannerNode.distanceModel = 'inverse';
    pannerNode.refDistance = 1;
    pannerNode.maxDistance = 10000;
    pannerNode.rollOffFactor = 1;

    // Create visualizer analyzer
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 64;

    // Route background mix: 
    // AudioElement -> MediaElementSource -> Filter -> Panner -> Analyser -> Gain -> Destination
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(filterNode);
    filterNode.connect(pannerNode);
    pannerNode.connect(analyserNode);
    analyserNode.connect(mixGainNode);
    mixGainNode.connect(audioCtx.destination);

    // Route voice clips:
    // VoiceElement -> MediaElementSource -> VoiceGain -> Destination
    const voiceMediaSource = audioCtx.createMediaElementSource(voiceAudio);
    voiceMediaSource.connect(voiceGainNode);
    voiceGainNode.connect(audioCtx.destination);

    // Track voice completion to reset state
    voiceAudio.onended = () => {
      setVoiceClipPlaying(false);
    };

    // Set volumes
    mixGainNode.gain.setValueAtTime(0.7, audioCtx.currentTime);
    voiceGainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);

    // Start visualizer extraction loop
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateAnalyser = () => {
      if (analyserNode && musicPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
        setFrequencyData(new Uint8Array(dataArray));
      }
      rafRef.current = requestAnimationFrame(updateAnalyser);
    };
    updateAnalyser();
  };

  // Synchronize mix source file and playing state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (musicPlaying) {
      if (!audioCtx) {
        initAudio();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (audioElRef.current && audioElRef.current.src !== activeMix.src) {
        // Fallback for placeholder mix loading
        audioElRef.current.src = activeMix.src;
      }

      audioElRef.current?.play().catch(e => console.log('Audio autoplay blocked until interaction:', e));
    } else {
      audioElRef.current?.pause();
    }
  }, [musicPlaying, activeMix]);

  // Synchronize voice clips
  useEffect(() => {
    if (!audioCtx || !voiceElRef.current) return;

    if (voiceClipPlaying && currentVoiceSrc) {
      // Duck background music
      setDucking(true);
      mixGainNode.gain.setTargetAtTime(0.15, audioCtx.currentTime, 0.2); // Duck to 15% quickly

      voiceElRef.current.src = currentVoiceSrc;
      voiceElRef.current.play().catch(e => console.log('Voice snippet blocked:', e));
    } else {
      // Swell background music back to normal
      setDucking(false);
      mixGainNode?.gain.setTargetAtTime(0.7, audioCtx?.currentTime || 0, 0.4); // Fade back to 70%
      voiceElRef.current.pause();
    }
  }, [voiceClipPlaying, currentVoiceSrc]);

  // Synchronize low-pass filter based on active room position
  useEffect(() => {
    if (!audioCtx || !filterNode) return;

    const time = audioCtx.currentTime;
    if (activeRoom === 'dj-corner') {
      // Open filter fully (full sound)
      filterNode.frequency.setTargetAtTime(22000, time, 0.5);
    } else if (activeRoom === 'exterior') {
      // Muffle significantly (outside the house)
      filterNode.frequency.setTargetAtTime(350, time, 0.8);
    } else {
      // Slightly muffle (other interior rooms)
      filterNode.frequency.setTargetAtTime(1200, time, 0.6);
    }
  }, [activeRoom]);

  // Function to dynamically update 3D panner values from Canvas camera positions
  const updateSpatialListener = (position, rotation) => {
    if (!audioCtx || !pannerNode) return;

    const time = audioCtx.currentTime;
    
    // Set deck position (fixed at e.g. -5, 0, -5 in the room)
    pannerNode.positionX.setTargetAtTime(-5, time, 0.1);
    pannerNode.positionY.setTargetAtTime(1, time, 0.1);
    pannerNode.positionZ.setTargetAtTime(-5, time, 0.1);

    // Update listener position (the camera)
    const listener = audioCtx.listener;
    if (listener.positionX) {
      listener.positionX.setTargetAtTime(position.x, time, 0.1);
      listener.positionY.setTargetAtTime(position.y, time, 0.1);
      listener.positionZ.setTargetAtTime(position.z, time, 0.1);
    }
  };

  // Clean up RAF loop on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    frequencyData,
    initAudio,
    updateSpatialListener,
    audioContext: audioCtx
  };
}
