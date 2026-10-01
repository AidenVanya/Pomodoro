import React from 'react';
import type { TimerMode, TimerStatus } from '../types/pomodoro';

interface ClockworkGearsProps {
  status: TimerStatus;
  mode: TimerMode;
  remainingRatio: number; // 1 -> 0
  className?: string;
}

export const ClockworkGears: React.FC<ClockworkGearsProps> = ({
  status,
  mode,
  remainingRatio,
  className = '',
}) => {
  const isRunning = status === 'RUNNING';
  const isPaused = status === 'PAUSED';

  // Roman numerals on the Chronos Astrolabe dial (as in the boss arena floor)
  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  const pointerColor = {
    FOCUS: '#fbbf24',
    SHORT_BREAK: '#34d399',
    LONG_BREAK: '#38bdf8',
  }[mode];

  // Helper to generate teeth for gear path
  const generateGearPath = (cx: number, cy: number, rOuter: number, rInner: number, teeth: number) => {
    let d = '';
    const angleStep = (2 * Math.PI) / teeth;
    const quarterStep = angleStep / 4;

    for (let i = 0; i < teeth; i++) {
      const a = i * angleStep;
      // Points for one gear tooth
      const x1 = cx + rInner * Math.cos(a - quarterStep);
      const y1 = cy + rInner * Math.sin(a - quarterStep);

      const x2 = cx + rOuter * Math.cos(a - quarterStep * 0.5);
      const y2 = cy + rOuter * Math.sin(a - quarterStep * 0.5);

      const x3 = cx + rOuter * Math.cos(a + quarterStep * 0.5);
      const y3 = cy + rOuter * Math.sin(a + quarterStep * 0.5);

      const x4 = cx + rInner * Math.cos(a + quarterStep);
      const y4 = cy + rInner * Math.sin(a + quarterStep);

      if (i === 0) {
        d += `M ${x1} ${y1} `;
      } else {
        d += `L ${x1} ${y1} `;
      }
      d += `L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} `;
    }
    d += 'Z';
    return d;
  };

  return (
    <div className={`relative pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Ancient Gold Gradient */}
          <linearGradient id="chronosGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Deep Bronze Gradient */}
          <linearGradient id="chronosBronze" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="40%" stopColor="#92400e" />
            <stop offset="80%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1e1b18" />
          </linearGradient>

          {/* Spectral Jade / Witchfire Accent */}
          <linearGradient id="chronosJade" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>

          {/* Mechanical bevel & glow filters */}
          <filter id="gearShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.7" />
          </filter>

          <filter id="titanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* INTERLOCKING SATELLITE GEAR 1: Top-Left Bronze Cogwheel  */}
        {/* ======================================================== */}
        <g
          className={`origin-[75px_75px] ${isRunning ? 'animate-spin-ccw' : isPaused ? 'paused' : 'opacity-80'}`}
          style={{ transformOrigin: '75px 75px' }}
        >
          {/* Shadow & Teeth */}
          <path
            d={generateGearPath(75, 75, 72, 60, 16)}
            fill="url(#chronosBronze)"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            filter="url(#gearShadow)"
          />
          {/* Inner ring */}
          <circle cx="75" cy="75" r="44" fill="#090d14" stroke="#d97706" strokeWidth="2" strokeDasharray="3 4" />
          {/* Cutout spokes */}
          <line x1="75" y1="35" x2="75" y2="115" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.6" />
          <line x1="35" y1="75" x2="115" y2="75" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.6" />
          <line x1="47" y1="47" x2="103" y2="103" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.6" />
          <line x1="47" y1="103" x2="103" y2="47" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.6" />
          {/* Center Axle Nut */}
          <circle cx="75" cy="75" r="14" fill="url(#chronosGold)" stroke="#78350f" strokeWidth="2" />
          <circle cx="75" cy="75" r="5" fill="#18181b" />
        </g>

        {/* ======================================================== */}
        {/* INTERLOCKING SATELLITE GEAR 2: Bottom-Right Gold Cogwheel*/}
        {/* ======================================================== */}
        <g
          className={`origin-[425px_415px] ${isRunning ? 'animate-spin-ccw-fast' : isPaused ? 'paused' : 'opacity-80'}`}
          style={{ transformOrigin: '425px 415px' }}
        >
          {/* Teeth */}
          <path
            d={generateGearPath(425, 415, 62, 52, 14)}
            fill="url(#chronosBronze)"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            filter="url(#gearShadow)"
          />
          <circle cx="425" cy="415" r="36" fill="#090d14" stroke="#d97706" strokeWidth="2" />
          {/* Triangular spoke cutouts */}
          <circle cx="425" cy="415" r="24" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="425" y1="385" x2="425" y2="445" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.6" />
          <line x1="395" y1="415" x2="455" y2="415" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.6" />
          {/* Center Hub */}
          <circle cx="425" cy="415" r="12" fill="url(#chronosGold)" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="425" cy="415" r="4" fill="#090d14" />
        </g>

        {/* ======================================================== */}
        {/* MAIN ASTROLABE GEAR: The Great Wheel of Chronos (Center) */}
        {/* ======================================================== */}
        <g
          className={`origin-[250px_250px] ${isRunning ? 'animate-spin-cw' : isPaused ? 'paused' : 'opacity-90'}`}
          style={{ transformOrigin: '250px 250px' }}
        >
          {/* Great Outer Spiky Gear Teeth (Hades II Clockwork Cathedral Style) */}
          <path
            d={generateGearPath(250, 250, 246, 226, 36)}
            fill="url(#chronosBronze)"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeOpacity="0.7"
            filter="url(#gearShadow)"
          />

          {/* Outer Astrolabe Gold Ring */}
          <circle
            cx="250"
            cy="250"
            r="225"
            fill="none"
            stroke="url(#chronosGold)"
            strokeWidth="3.5"
          />

          {/* Greek Key / Celestial Meander Dashed Accent Ring */}
          <circle
            cx="250"
            cy="250"
            r="215"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="6 4 2 4"
            strokeOpacity="0.6"
          />

          {/* Twelve Roman Numeral Hour Roundels (Boss Arena Dial) */}
          {romanNumerals.map((numeral, index) => {
            const angle = (index * 30 - 90) * (Math.PI / 180);
            const rMark = 195;
            const x = 250 + rMark * Math.cos(angle);
            const y = 250 + rMark * Math.sin(angle);

            return (
              <g key={numeral} className="select-none">
                {/* Cartouche circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="14"
                  fill="#0c1017"
                  stroke="url(#chronosGold)"
                  strokeWidth="1.5"
                  filter="url(#gearShadow)"
                />
                {/* Roman Numeral text */}
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill="#fef08a"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="'Cinzel', serif"
                  className="tracking-tight"
                >
                  {numeral}
                </text>
              </g>
            );
          })}

          {/* Inner Inscribed Astrolabe Track Ring */}
          <circle
            cx="250"
            cy="250"
            r="174"
            fill="none"
            stroke="url(#chronosGold)"
            strokeWidth="2.5"
            strokeOpacity="0.8"
          />

          {/* Radial Rays / Spoke Dividers (Every 30 degrees) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = i * 30 * (Math.PI / 180);
            const x1 = 250 + 174 * Math.cos(a);
            const y1 = 250 + 174 * Math.sin(a);
            const x2 = 250 + 152 * Math.cos(a);
            const y2 = 250 + 152 * Math.sin(a);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
            );
          })}

          {/* Star & Diamond Inscriptions along internal circle */}
          <circle
            cx="250"
            cy="250"
            r="152"
            fill="none"
            stroke="#d97706"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeOpacity="0.5"
          />
        </g>

        {/* Center Static Astrolabe Bezel & Sunburst Ring */}
        <circle
          cx="250"
          cy="250"
          r="142"
          fill="none"
          stroke="url(#chronosGold)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Subtle Tartarus / Chronos Core Shadow */}
        <circle
          cx="250"
          cy="250"
          r="138"
          fill="#06090e"
          fillOpacity="0.25"
        />

        {/* Elapsed Time Scythe / Pointer Arrow Hand (Fixed to progressAngle) */}
        {isRunning && (
          <g
            style={{
              transform: `rotate(${(1 - remainingRatio) * 360}deg)`,
              transformOrigin: '250px 250px',
              transition: 'transform 0.4s ease',
            }}
          >
            {/* Scythe / Sun needle tip */}
            <path
              d="M 250 102 L 254 125 L 250 120 L 246 125 Z"
              fill="url(#chronosGold)"
              stroke={pointerColor}
              strokeWidth="0.8"
              filter="url(#titanGlow)"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
