import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDurationMs = 1800,
}) => {
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar increment
    const intervalTime = 25;
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
    }, minDurationMs + 600);

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
      }, 300);
    }
  };

  if (isDone) return null;

  return (
    <div
      onClick={handleSkip}
      role="banner"
      aria-label="Chronos Splash Screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05080c] select-none cursor-pointer transition-opacity duration-600 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Starry & Ethereal Void Glow */}
      <div
        className="absolute inset-0 bg-radial-[at_50%_48%] from-emerald-950/25 via-amber-950/15 to-black pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating Stardust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute top-[20%] left-[18%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-time-particle" />
        <div className="absolute top-[32%] right-[20%] w-2 h-2 bg-emerald-400 rounded-full animate-time-particle" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-[25%] left-[22%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-time-particle" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-[30%] right-[25%] w-2 h-2 bg-emerald-300 rounded-full animate-time-particle" style={{ animationDelay: '0.6s' }} />
      </div>

      {/* Main Clean Centerpiece (Only Title + Loading Bar) */}
      <div className="relative flex flex-col items-center justify-center z-10 px-6 text-center max-w-sm sm:max-w-md">
        {/* Glowing Mythical Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-chronos-deco font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-emerald-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.55)] leading-none mb-2">
          CHRONOS
        </h1>

        <p className="text-xs sm:text-sm font-chronos tracking-[0.35em] text-amber-300/80 uppercase font-semibold mb-8">
          Titan of Time • Zamanın Efendisi
        </p>

        {/* Elegant Golden Progress Bar */}
        <div className="w-60 sm:w-72 h-1.5 bg-black/80 rounded-full overflow-hidden border border-amber-500/40 p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-3.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        {/* Progress Status Text */}
        <p className="text-xs font-chronos text-amber-300/70 tracking-wider">
          {progress < 40
            ? 'Zaman Çarkları Kuruluyor...'
            : progress < 85
            ? 'Zamanın Kumları Akıyor...'
            : 'Mühür Açılıyor...'}
        </p>

        <span className="text-[10px] font-chronos text-amber-500/40 mt-5 tracking-widest opacity-60">
          (Geçmek için dokunun)
        </span>
      </div>
    </div>
  );
};
