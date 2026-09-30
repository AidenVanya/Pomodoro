import type { AmbientSoundType, SoundTheme } from '../types/pomodoro';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a subtle, satisfying sensory transition tone when switching modes or ambient sounds.
 */
export function playSwitchSound(type: 'ambient' | 'mode' = 'ambient'): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'mode') {
      // Gentle warm chime glide (D5 -> A5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Soft acoustic water droplet / organic click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    }
  } catch (err) {
    console.warn('Switch sound error:', err);
  }
}

/**
 * Plays a synthesized alert tone using the Web Audio API without any external dependencies.
 */
export function playAlertSound(theme: SoundTheme, volumePercent: number = 70): void {
  try {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    const volume = Math.max(0, Math.min(1, volumePercent / 100));
    masterGain.gain.setValueAtTime(volume * 0.7, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (theme) {
      case 'zen-bell': {
        // Japanese Temple Gong / Zen Bell harmonic simulation
        const frequencies = [440, 882, 1324, 1768];
        const gains = [0.6, 0.25, 0.15, 0.08];

        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(gains[idx], now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 3.2);
        });
        break;
      }

      case 'singing-bowl': {
        // Tibetan Singing Bowl with soothing beating frequencies
        const baseFreq = 396;
        const partials = [
          { f: baseFreq, g: 0.5, d: 4.0 },
          { f: baseFreq * 1.503, g: 0.3, d: 3.5 },
          { f: baseFreq * 2.75, g: 0.15, d: 2.5 },
        ];

        partials.forEach(({ f, g, d }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(3.2, now);
          lfoGain.gain.setValueAtTime(1.5, now);
          lfo.connect(osc.frequency);
          lfo.start(now);
          lfo.stop(now + d);

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(g, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + d);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + d);
        });
        break;
      }

      case 'digital': {
        // Friendly modern two-tone chime
        const notes = [
          { freq: 659.25, start: 0, duration: 0.2 },
          { freq: 880.0, start: 0.18, duration: 0.6 },
        ];

        notes.forEach(({ freq, start, duration }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + start);

          gain.gain.setValueAtTime(0.4, now + start);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now + start);
          osc.stop(now + start + duration);
        });
        break;
      }

      case 'marimba': {
        // Warm organic marimba strike
        const notes = [
          { freq: 523.25, time: 0 },
          { freq: 659.25, time: 0.15 },
          { freq: 783.99, time: 0.3 },
          { freq: 1046.5, time: 0.45 },
        ];

        notes.forEach(({ freq, time }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * 1.5, now + time);
          osc.frequency.exponentialRampToValueAtTime(freq, now + time + 0.05);

          gain.gain.setValueAtTime(0.5, now + time);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + time + 0.8);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now + time);
          osc.stop(now + time + 0.8);
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Audio playback not supported or blocked by browser autoplay:', err);
  }
}

// ----------------------------------------------------
// High Quality Real Ambient Audio Player (Seamless Loop & Crossfade)
// ----------------------------------------------------
const AUDIO_SOURCES: Record<Exclude<AmbientSoundType, 'none'>, string> = {
  rain: '/sounds/rain.mp3',
  cafe: '/sounds/cafe.mp3',
  'white-noise': '/sounds/stream.mp3',
};

const audioInstances: Partial<Record<Exclude<AmbientSoundType, 'none'>, HTMLAudioElement>> = {};

let currentPlayingType: AmbientSoundType = 'none';
let currentAudio: HTMLAudioElement | null = null;
let fadeTimer: number | null = null;

function clearFadeTimer(): void {
  if (fadeTimer !== null) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
}

function fadeVolume(
  audio: HTMLAudioElement,
  startVol: number,
  targetVol: number,
  durationMs: number,
  onComplete?: () => void
): void {
  clearFadeTimer();
  const startTime = performance.now();

  fadeTimer = window.setInterval(() => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(1, elapsed / durationMs);
    const newVol = startVol + (targetVol - startVol) * progress;
    audio.volume = Math.max(0, Math.min(1, newVol));

    if (progress >= 1) {
      clearFadeTimer();
      if (onComplete) onComplete();
    }
  }, 20);
}

/**
 * Starts or transitions ambient sound with an organic crossfade (fade-in / fade-out).
 */
export function startAmbientSound(type: AmbientSoundType, volumePercent: number): void {
  const targetVolume = Math.max(0, Math.min(1, volumePercent / 100));

  // If already playing this exact sound, just update volume smoothly
  if (currentPlayingType === type && currentAudio) {
    fadeVolume(currentAudio, currentAudio.volume, targetVolume, 150);
    return;
  }

  // Smoothly fade out currently playing ambient audio
  if (currentAudio) {
    const prevAudio = currentAudio;
    fadeVolume(prevAudio, prevAudio.volume, 0, 300, () => {
      prevAudio.pause();
      prevAudio.currentTime = 0;
    });
    currentAudio = null;
    currentPlayingType = 'none';
  }

  if (type === 'none') {
    return;
  }

  const src = AUDIO_SOURCES[type];
  if (!src) return;

  // Retrieve or initialize audio element
  let audio = audioInstances[type];
  if (!audio) {
    audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audioInstances[type] = audio;
  }

  currentAudio = audio;
  currentPlayingType = type;

  audio.volume = 0;
  audio.currentTime = 0;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        fadeVolume(audio, 0, targetVolume, 400);
      })
      .catch((err) => {
        console.warn('Ambient audio autoplay restricted or failed:', err);
      });
  }
}

export function setAmbientVolume(volumePercent: number): void {
  const targetVolume = Math.max(0, Math.min(1, volumePercent / 100));
  if (currentAudio) {
    fadeVolume(currentAudio, currentAudio.volume, targetVolume, 100);
  }
}

export function stopAmbientSound(): void {
  if (currentAudio) {
    const audio = currentAudio;
    fadeVolume(audio, audio.volume, 0, 250, () => {
      audio.pause();
      audio.currentTime = 0;
    });
    currentAudio = null;
  }
  currentPlayingType = 'none';
}
