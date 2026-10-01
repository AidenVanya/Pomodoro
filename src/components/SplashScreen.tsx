import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDurationMs = 2000,
}) => {
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar increment
    const intervalTime = 30;
    const step = 100 / (minDurationMs / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Fade out after minDurationMs
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDurationMs);

    // Complete transition after fade animation finishes
    const completeTimer = setTimeout(() => {
      setIsDone(true);
      if (onFinish) onFinish();
    }, minDurationMs + 700);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [minDurationMs, onFinish]);

  // Allow clicking anywhere to skip
  const handleSkip = () => {
    if (!isFading) {
      setIsFading(true);
      setTimeout(() => {
        setIsDone(true);
        if (onFinish) onFinish();
      }, 400);
    }
  };

  if (isDone) return null;

  return (
    <div
      onClick={handleSkip}
      role="banner"
      aria-label="Chronos Splash Screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05080c] select-none cursor-pointer transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Starry & Ethereal Void Glow */}
      <div
        className="absolute inset-0 bg-radial-[at_50%_45%] from-emerald-950/30 via-amber-950/20 to-black pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating Stardust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[18%] left-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-time-particle" />
        <div className="absolute top-[30%] right-[18%] w-2 h-2 bg-emerald-400 rounded-full animate-time-particle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[22%] left-[25%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-time-particle" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-[28%] right-[22%] w-2 h-2 bg-emerald-300 rounded-full animate-time-particle" style={{ animationDelay: '0.8s' }} />
      </div>

      {/* Main Logo Container */}
      <div className="relative flex flex-col items-center justify-center z-10 px-4 text-center max-w-sm sm:max-w-md">
        {/* Outer Rotating Astrolabe Aura around the logo */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Pulsing ambient backlight */}
          <div
            className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-tr from-emerald-500/30 via-amber-500/25 to-teal-400/20 blur-2xl animate-pulse-glow"
            aria-hidden="true"
          />

          {/* Rotating decorative mechanical border ring */}
          <div className="absolute -inset-3 sm:-inset-4 rounded-full border border-amber-500/30 border-dashed animate-spin-cw pointer-events-none" />
          <div className="absolute -inset-6 sm:-inset-7 rounded-full border border-emerald-500/20 border-dotted animate-spin-ccw pointer-events-none" />

          {/* Logo Card Frame */}
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl sm:rounded-4xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_40px_rgba(16,185,129,0.35),0_0_80px_rgba(245,158,11,0.25)] bg-[#070b10] p-1.5 sm:p-2 backdrop-blur-xl group">
            <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative">
              <img
                src="/chronos-logo.jpg"
                alt="Chronos, Titan of Time"
                className="w-full h-full object-cover object-center transform transition-transform duration-1000 scale-105"
                loading="eager"
              />
              {/* Glass sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-chronos-deco font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-emerald-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] leading-none mb-1.5">
          CHRONOS
        </h1>

        <p className="text-xs sm:text-sm font-chronos tracking-[0.3em] text-amber-300/80 uppercase font-semibold mb-6">
          Titan of Time • Zamanın Efendisi
        </p>

        {/* Golden Progress Bar */}
        <div className="w-48 sm:w-60 h-1 bg-black/60 rounded-full overflow-hidden border border-amber-500/30 p-[1px] mb-3">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        {/* Status text */}
        <p className="text-[11px] font-chronos text-amber-400/60 tracking-wider">
          {progress < 40
            ? 'Zaman Çarkları Kuruluyor...'
            : progress < 85
            ? 'Zamanın Kumları Akıyor...'
            : 'Mühür Açılıyor...'}
        </p>

        <span className="text-[10px] font-chronos text-amber-500/40 mt-4 tracking-widest opacity-60">
          (Geçmek için dokunun)
        </span>
      </div>
    </div>
  );
};
