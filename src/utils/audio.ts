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
      case 'chronos-bell': {
        // Deep ancient Titan bronze clock tower bell / temple strike
        const baseFreq = 164.81; // E3
        const partials = [
          { f: 82.4, g: 0.8, d: 4.8 }, // Sub-bass hum
          { f: baseFreq, g: 0.9, d: 4.5 }, // Strike note
          { f: baseFreq * 1.5, g: 0.6, d: 4.0 }, // Fifth
          { f: baseFreq * 2.0, g: 0.45, d: 3.5 }, // Octave
          { f: baseFreq * 2.76, g: 0.35, d: 3.0 }, // Minor third upper bell harmonic
          { f: baseFreq * 4.15, g: 0.2, d: 2.2 }, // Shimmer
          { f: baseFreq * 5.4, g: 0.12, d: 1.6 }, // High metallic overtone
        ];

        partials.forEach(({ f, g, d }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(g * 0.8, now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + d);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + d);
        });
        break;
      }

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
// High Quality Real Ambient Audio Player (Seamless Loop & Robust Switching)
// ----------------------------------------------------
// High Quality Real Ambient Audio Player (Seamless Loop & Robust Switching)
// ----------------------------------------------------
const AUDIO_SOURCES: Record<Exclude<AmbientSoundType, 'none' | 'clockwork'>, string> = {
  rain: '/sounds/rain.mp3',
  cafe: '/sounds/cafe.mp3',
  'white-noise': '/sounds/stream.mp3',
};

const audioInstances: Partial<Record<Exclude<AmbientSoundType, 'none' | 'clockwork'>, HTMLAudioElement>> = {};
const fadeTimers: Partial<Record<string, number>> = {};

let currentPlayingType: AmbientSoundType = 'none';
let clockworkTimer: number | null = null;
let clockworkStep = 0;
let clockworkVolume = 0.4;

function tickClockwork(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const isTick = clockworkStep % 2 === 0;
    clockworkStep++;

    // Crisp mechanical tooth escapement click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isTick ? 1200 : 880, now);
    osc.frequency.exponentialRampToValueAtTime(isTick ? 320 : 240, now + 0.025);

    gain.gain.setValueAtTime(clockworkVolume * 0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);

    // Warm metallic gear resonance
    const ping = ctx.createOscillator();
    const pingGain = ctx.createGain();
    ping.type = 'sine';
    ping.frequency.setValueAtTime(isTick ? 2200 : 1760, now);
    pingGain.gain.setValueAtTime(clockworkVolume * 0.03, now);
    pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    ping.connect(pingGain);
    pingGain.connect(ctx.destination);
    ping.start(now);
    ping.stop(now + 0.06);
  } catch {
    // ignore
  }
}

function startClockworkAudio(vol: number): void {
  stopClockworkAudio();
  clockworkVolume = vol;
  tickClockwork();
  clockworkTimer = window.setInterval(tickClockwork, 1000);
}

function stopClockworkAudio(): void {
  if (clockworkTimer !== null) {
    clearInterval(clockworkTimer);
    clockworkTimer = null;
  }
}

function clearAudioFade(key: string): void {
  const timer = fadeTimers[key];
  if (timer !== undefined) {
    clearInterval(timer);
    delete fadeTimers[key];
  }
}

function stopAndResetAudio(key: string, audio: HTMLAudioElement): void {
  clearAudioFade(key);
  try {
    audio.pause();
  } catch {
    // ignore
  }
  audio.currentTime = 0;
  audio.volume = 0;
}

/**
 * Immediately stop and pause all ambient audio instances except an optional target.
 * Guarantees that no two ambient sounds can ever overlap or play at the same time.
 */
function stopAllAmbientAudiosExcept(keepType?: AmbientSoundType): void {
  if (keepType !== 'clockwork') {
    stopClockworkAudio();
  }
  (Object.keys(AUDIO_SOURCES) as Exclude<AmbientSoundType, 'none' | 'clockwork'>[]).forEach((type) => {
    if (type !== keepType) {
      clearAudioFade(type);
      const audio = audioInstances[type];
      if (audio) {
        stopAndResetAudio(type, audio);
      }
    }
  });
}

function fadeAudioVolume(
  key: string,
  audio: HTMLAudioElement,
  startVol: number,
  targetVol: number,
  durationMs: number,
  onComplete?: () => void
): void {
  clearAudioFade(key);
  if (durationMs <= 0) {
    audio.volume = Math.max(0, Math.min(1, targetVol));
    if (onComplete) onComplete();
    return;
  }

  const startTime = performance.now();
  const timer = window.setInterval(() => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(1, elapsed / durationMs);
    const newVol = startVol + (targetVol - startVol) * progress;
    audio.volume = Math.max(0, Math.min(1, newVol));

    if (progress >= 1) {
      clearAudioFade(key);
      if (onComplete) onComplete();
    }
  }, 20);

  fadeTimers[key] = timer;
}

/**
 * Starts or transitions ambient sound with zero overlapping bugs.
 */
export function startAmbientSound(type: AmbientSoundType, volumePercent: number): void {
  const targetVolume = Math.max(0, Math.min(1, volumePercent / 100));

  if (type === 'none') {
    stopAmbientSound();
    return;
  }

  if (type === 'clockwork') {
    currentPlayingType = 'clockwork';
    stopAllAmbientAudiosExcept('clockwork');
    startClockworkAudio(targetVolume);
    return;
  } else {
    stopClockworkAudio();
  }

  // If already playing this exact sound, just update volume smoothly
  if (currentPlayingType === type) {
    const audio = audioInstances[type as Exclude<AmbientSoundType, 'none' | 'clockwork'>];
    if (audio) {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
      fadeAudioVolume(type, audio, audio.volume, targetVolume, 100);
      return;
    }
  }

  // 1. Immediately update active playing type to prevent async race conditions
  currentPlayingType = type;

  // 2. STOP and reset all other audio instances immediately - guarantees NO overlapping sounds
  stopAllAmbientAudiosExcept(type);

  const src = AUDIO_SOURCES[type as Exclude<AmbientSoundType, 'none' | 'clockwork'>];
  if (!src) return;

  // 3. Retrieve or initialize the audio instance
  let audio = audioInstances[type as Exclude<AmbientSoundType, 'none' | 'clockwork'>];
  if (!audio) {
    audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audioInstances[type as Exclude<AmbientSoundType, 'none' | 'clockwork'>] = audio;
  }

  // Prepare audio for smooth fade-in
  audio.volume = 0;
  audio.currentTime = 0;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // If the user has switched away or stopped sound before playPromise resolved, stop immediately
        if (currentPlayingType !== type) {
          stopAndResetAudio(type, audio);
          return;
        }

        // Smoothly fade in to target volume over 250ms
        fadeAudioVolume(type, audio, 0, targetVolume, 250);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Ambient audio play error:', err);
        }
      });
  }
}

export function setAmbientVolume(volumePercent: number): void {
  const targetVolume = Math.max(0, Math.min(1, volumePercent / 100));
  if (currentPlayingType === 'clockwork') {
    clockworkVolume = targetVolume;
    return;
  }
  if (currentPlayingType !== 'none') {
    const audio = audioInstances[currentPlayingType as Exclude<AmbientSoundType, 'none' | 'clockwork'>];
    if (audio) {
      fadeAudioVolume(currentPlayingType, audio, audio.volume, targetVolume, 60);
    }
  }
}

export function stopAmbientSound(): void {
  const prevType = currentPlayingType;
  currentPlayingType = 'none';

  stopClockworkAudio();

  // Immediately stop all other audios
  stopAllAmbientAudiosExcept(prevType !== 'none' ? prevType : undefined);

  if (prevType !== 'none' && prevType !== 'clockwork') {
    const audio = audioInstances[prevType];
    if (audio && !audio.paused && audio.volume > 0.01) {
      fadeAudioVolume(prevType, audio, audio.volume, 0, 150, () => {
        stopAndResetAudio(prevType, audio);
      });
    } else if (audio) {
      stopAndResetAudio(prevType, audio);
    }
  }
}

// ----------------------------------------------------
// Intro / Splash Screen Cinematic Music
// ----------------------------------------------------
let introAudioInstance: HTMLAudioElement | null = null;
let introFadeTimer: number | null = null;

export function playIntroMusic(volumePercent: number = 75): Promise<void> {
  if (introFadeTimer !== null) {
    clearInterval(introFadeTimer);
    introFadeTimer = null;
  }
  if (!introAudioInstance) {
    introAudioInstance = new Audio('/sounds/chronos-intro.mp3');
    introAudioInstance.preload = 'auto';
  }
  introAudioInstance.volume = Math.max(0, Math.min(1, volumePercent / 100));
  introAudioInstance.currentTime = 0;
  return introAudioInstance.play();
}

export function stopIntroMusic(fadeDurationMs: number = 600): void {
  if (!introAudioInstance) return;
  const audio = introAudioInstance;
  if (audio.paused) return;

  if (introFadeTimer !== null) {
    clearInterval(introFadeTimer);
  }

  const startVol = audio.volume;
  const steps = 12;
  const stepTime = Math.max(20, fadeDurationMs / steps);
  let curStep = 0;

  introFadeTimer = window.setInterval(() => {
    curStep++;
    const nextVol = Math.max(0, startVol * (1 - curStep / steps));
    audio.volume = nextVol;
    if (curStep >= steps || nextVol <= 0.01) {
      if (introFadeTimer !== null) {
        clearInterval(introFadeTimer);
        introFadeTimer = null;
      }
      audio.pause();
      audio.currentTime = 0;
    }
  }, stepTime);
}

export function isIntroMusicPlaying(): boolean {
  return !!introAudioInstance && !introAudioInstance.paused;
}
