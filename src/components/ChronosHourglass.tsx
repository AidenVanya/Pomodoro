import React from 'react';
import type { TimerMode, TimerStatus } from '../types/pomodoro';

interface ChronosHourglassProps {
  remainingRatio: number; // 1 = full, 0 = drained
  status: TimerStatus;
  mode: TimerMode;
  className?: string;
  size?: number;
}

export const ChronosHourglass: React.FC<ChronosHourglassProps> = ({
  remainingRatio,
  status,
  mode,
  className = '',
  size = 180,
}) => {
  const isRunning = status === 'RUNNING';

  // Sand colors depending on mode
  const sandColors = {
    FOCUS: {
      light: '#fef08a',
      mid: '#f59e0b',
      deep: '#b45309',
      glow: 'rgba(245, 158, 11, 0.5)',
    },
    SHORT_BREAK: {
      light: '#6ee7b7',
      mid: '#10b981',
      deep: '#047857',
      glow: 'rgba(16, 185, 129, 0.5)',
    },
    LONG_BREAK: {
      light: '#7dd3fc',
      mid: '#0ea5e9',
      deep: '#0369a1',
      glow: 'rgba(14, 165, 233, 0.5)',
    },
  }[mode];

  // Jewel colors for frame architectural gems
  const jewelColors = {
    FOCUS: { base: '#059669', light: '#6ee7b7', stroke: '#fbbf24' },
    SHORT_BREAK: { base: '#059669', light: '#6ee7b7', stroke: '#34d399' },
    LONG_BREAK: { base: '#0284c7', light: '#7dd3fc', stroke: '#38bdf8' },
  }[mode];

  // Upper sand level calculation (clamped between 0 and 1)
  const topFraction = Math.max(0, Math.min(1, remainingRatio));
  const bottomFraction = 1 - topFraction;

  // Geometry for SVG Hourglass (viewBox: 0 0 160 220)
  // Waist is at y = 110, x = 80, width = 12
  // Top chamber bounds: y from 35 to 110
  // Bottom chamber bounds: y from 110 to 185
  // Top sand top y: starts at y=45 when full, down to y=108 when empty
  const topSandY = 45 + (1 - topFraction) * 60;
  // Bottom sand height: starts at y=180 when empty, up to y=118 when full
  const bottomSandY = 180 - bottomFraction * 58;

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: (size * 220) / 160 }}
    >
      <svg
        viewBox="0 0 160 220"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
        aria-hidden="true"
      >
        <defs>
          {/* Gold Frame Gradient */}
          <linearGradient id="frameGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Sand Gradient */}
          <linearGradient id="sandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={sandColors.light} />
            <stop offset="50%" stopColor={sandColors.mid} />
            <stop offset="100%" stopColor={sandColors.deep} />
          </linearGradient>

          {/* Glass Highlights */}
          <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="70%" stopColor="rgba(16,185,129,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
          </linearGradient>

          {/* Clip path for Glass interior: Two interconnected bulbs */}
          <clipPath id="glassInnerClip">
            <path
              d="M 38 42
                 C 38 75, 70 98, 75 110
                 C 70 122, 38 145, 38 178
                 L 122 178
                 C 122 145, 90 122, 85 110
                 C 90 98, 122 75, 122 42
                 Z"
            />
          </clipPath>

          <filter id="sandGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Backlight Glow */}
        <ellipse
          cx="80"
          cy="110"
          rx="45"
          ry="65"
          fill={sandColors.glow}
          filter="blur(16px)"
          opacity={isRunning ? '0.7' : '0.35'}
        />

        {/* ======================================================== */}
        {/* HOURGLASS GLASS CONTAINER INTERIOR (SAND CONTENT)        */}
        {/* ======================================================== */}
        <g clipPath="url(#glassInnerClip)">
          {/* Background of the glass interior (Dark obsidian void) */}
          <rect x="30" y="35" width="100" height="150" fill="#070a0e" fillOpacity="0.85" />

          {/* Upper Chamber Sand (Drains as time passes) */}
          {topFraction > 0.01 && (
            <path
              d={`M 36 ${topSandY}
                  Q 80 ${topSandY + 6}, 124 ${topSandY}
                  L 124 105
                  C 95 105, 84 109, 83 110
                  L 77 110
                  C 76 109, 65 105, 36 105
                  Z`}
              fill="url(#sandGrad)"
              filter="url(#sandGlow)"
            />
          )}

          {/* Continuous Sand Stream through the waist neck */}
          {isRunning && topFraction > 0.005 && bottomFraction > 0.005 && (
            <line
              x1="80"
              y1="108"
              x2="80"
              y2="175"
              stroke={sandColors.light}
              strokeWidth="2.5"
              strokeDasharray="4 2"
              className="animate-sand-drip"
              filter="url(#sandGlow)"
            />
          )}

          {/* Bottom Chamber Sand (Fills and forms a pyramid) */}
          {bottomFraction > 0.01 && (
            <path
              d={`M 38 180
                  L 122 180
                  L 122 ${bottomSandY + 12}
                  Q 80 ${bottomSandY - 6}, 38 ${bottomSandY + 12}
                  Z`}
              fill="url(#sandGrad)"
              filter="url(#sandGlow)"
            />
          )}

          {/* Falling sand sparkle dust particles while running */}
          {isRunning && topFraction > 0.02 && (
            <g className="animate-time-particle">
              <circle cx="78" cy="125" r="1" fill="#fff" opacity="0.9" />
              <circle cx="82" cy="140" r="1.2" fill="#fef08a" opacity="0.8" />
              <circle cx="79" cy="155" r="0.8" fill="#fff" opacity="0.7" />
            </g>
          )}

          {/* Glass Highlight Overlay & Reflections */}
          <path
            d="M 38 42
               C 38 75, 70 98, 75 110
               C 70 122, 38 145, 38 178
               L 122 178
               C 122 145, 90 122, 85 110
               C 90 98, 122 75, 122 42
               Z"
            fill="url(#glassShine)"
          />

          {/* Left Glass Specular Edge Light */}
          <path
            d="M 44 48
               C 44 75, 68 95, 74 106
               M 74 114
               C 68 125, 44 145, 44 172"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Glass Outer Wall Outline */}
        <path
          d="M 38 42
             C 38 75, 70 98, 75 110
             C 70 122, 38 145, 38 178
             L 122 178
             C 122 145, 90 122, 85 110
             C 90 98, 122 75, 122 42
             Z"
          fill="none"
          stroke="url(#frameGold)"
          strokeWidth="2.5"
          strokeOpacity="0.8"
        />

        {/* ======================================================== */}
        {/* ORNATE GOLDEN TITAN ARCHITECTURE / PILLARS & PEDESTALS   */}
        {/* ======================================================== */}

        {/* Left Ornate Side Pillar with Rhombus Gem */}
        <rect x="22" y="32" width="8" height="156" rx="3" fill="url(#frameGold)" stroke="#78350f" strokeWidth="1" />
        <polygon points="26,102 32,110 26,118 20,110" fill={jewelColors.base} stroke={jewelColors.stroke} strokeWidth="1" />
        <polygon points="26,105 29,110 26,115 23,110" fill={jewelColors.light} />

        {/* Right Ornate Side Pillar with Rhombus Gem */}
        <rect x="130" y="32" width="8" height="156" rx="3" fill="url(#frameGold)" stroke="#78350f" strokeWidth="1" />
        <polygon points="134,102 140,110 134,118 128,110" fill={jewelColors.base} stroke={jewelColors.stroke} strokeWidth="1" />
        <polygon points="134,105 137,110 134,115 131,110" fill={jewelColors.light} />

        {/* Top Pedestal Base with Scythe Arch & Mode Jewel (Image 3) */}
        <g>
          {/* Top Plinth */}
          <rect x="14" y="20" width="132" height="10" rx="3" fill="url(#frameGold)" stroke="#78350f" strokeWidth="1.5" />
          <rect x="22" y="30" width="116" height="8" rx="2" fill="#090d14" stroke="url(#frameGold)" strokeWidth="1.5" />
          {/* Curved Chronos Scythe Blade over the top (Image 3) */}
          <path
            d="M 28 20 C 50 6, 110 6, 134 16 C 105 11, 55 12, 28 20 Z"
            fill="url(#frameGold)"
            stroke="#78350f"
            strokeWidth="1.2"
          />
          {/* Center Top Jewel */}
          <polygon points="80,12 87,21 80,30 73,21" fill={jewelColors.base} stroke={jewelColors.stroke} strokeWidth="1.2" />
          <polygon points="80,15 84,21 80,27 76,21" fill={jewelColors.light} />
        </g>

        {/* Bottom Pedestal Base with Mode Jewel */}
        <g>
          <rect x="22" y="182" width="116" height="8" rx="2" fill="#090d14" stroke="url(#frameGold)" strokeWidth="1.5" />
          <rect x="14" y="190" width="132" height="10" rx="3" fill="url(#frameGold)" stroke="#78350f" strokeWidth="1.5" />
          {/* Center Bottom Jewel */}
          <polygon points="80,182 87,191 80,200 73,191" fill={jewelColors.base} stroke={jewelColors.stroke} strokeWidth="1.2" />
          <polygon points="80,185 84,191 80,197 76,191" fill={jewelColors.light} />
          {/* Central Bottom Foot Sigil */}
          <path d="M 80 208 L 86 200 L 74 200 Z" fill="url(#frameGold)" stroke="#78350f" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};
