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

          {/* Deep Obsidian Altar Radial Gradient */}
          <radialGradient id="altarRadialGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0b121b" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#060910" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#020407" stopOpacity="0.98" />
          </radialGradient>

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
        {/* 1. OUTER ROTATING GEAR COGWHEEL: The Great Wheel Teeth   */}
        {/* Constantly spins clockwise to honor the Titan of Time    */}
        {/* ======================================================== */}
        <g
          className="origin-[250px_250px] animate-spin-cw"
          style={{ transformOrigin: '250px 250px' }}
        >
          {/* Great Outer Spiky Gear Teeth (Hades II Cathedral Clockwork) */}
          <path
            d={generateGearPath(250, 250, 246, 226, 36)}
            fill="url(#chronosBronze)"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeOpacity="0.7"
            filter="url(#gearShadow)"
          />
          {/* Outer accent line */}
          <circle
            cx="250"
            cy="250"
            r="228"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        </g>

        {/* ======================================================== */}
        {/* 2. INNER CONCENTRIC ASTROLABE GEAR: Mechanical Depth     */}
        {/* Centered co-axially behind the altar, turns smoothly      */}
        {/* ======================================================== */}
        <g
          className="origin-[250px_250px] animate-spin-ccw"
          style={{ transformOrigin: '250px 250px' }}
        >
          {/* Inner mechanical spoke cog */}
          <path
            d={generateGearPath(250, 250, 168, 150, 24)}
            fill="url(#chronosBronze)"
            fillOpacity="0.6"
            stroke="#fbbf24"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
          {/* Mechanical spokes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = i * 45 * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={250 + 150 * Math.cos(a)}
                y1={250 + 150 * Math.sin(a)}
                x2={250 + 138 * Math.cos(a)}
                y2={250 + 138 * Math.sin(a)}
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
            );
          })}
          {/* Inscribed celestial ring */}
          <circle
            cx="250"
            cy="250"
            r="150"
            fill="none"
            stroke="#d97706"
            strokeWidth="1"
            strokeDasharray="4 6"
            strokeOpacity="0.6"
          />
        </g>

        {/* ======================================================== */}
        {/* 3. ROMAN NUMERAL DIAL: 12 Toothed Gear Plates            */}
        {/* Each Roman numeral sits on a golden mini-gear wheel      */}
        {/* ======================================================== */}
        <g>
          {/* Outer Astrolabe Gold Ring */}
          <circle
            cx="250"
            cy="250"
            r="225"
            fill="none"
            stroke="url(#chronosGold)"
            strokeWidth="3.5"
          />

          {/* Greek Key / Celestial Meander Accent Ring */}
          <circle
            cx="250"
            cy="250"
            r="215"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeDasharray="6 4 2 4"
            strokeOpacity="0.6"
          />

          {/* Inner Inscribed Astrolabe Track Ring */}
          <circle
            cx="250"
            cy="250"
            r="174"
            fill="none"
            stroke="url(#chronosGold)"
            strokeWidth="2"
            strokeOpacity="0.75"
          />

          {/* Twelve Roman Numeral Hour Gear Plates */}
          {romanNumerals.map((numeral, index) => {
            const angle = (index * 30 - 90) * (Math.PI / 180);
            const rMark = 195;
            const x = 250 + rMark * Math.cos(angle);
            const y = 250 + rMark * Math.sin(angle);

            return (
              <g key={numeral} className="select-none">
                {/* Toothed gear cog plate behind each numeral */}
                <path
                  d={generateGearPath(x, y, 15, 12, 8)}
                  fill="url(#chronosGold)"
                  stroke="#78350f"
                  strokeWidth="1"
                  filter="url(#gearShadow)"
                />
                {/* Inner cartouche face */}
                <circle
                  cx={x}
                  cy={y}
                  r="11.5"
                  fill="#0c1017"
                  stroke="#fbbf24"
                  strokeWidth="0.8"
                />
                {/* Roman Numeral text */}
                <text
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                  fill="#fef08a"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="'Cinzel', serif"
                  className="tracking-tight"
                >
                  {numeral}
                </text>
              </g>
            );
          })}

          {/* Radial hour marker lines between 174 and 168 */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = i * 30 * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={250 + 174 * Math.cos(a)}
                y1={250 + 174 * Math.sin(a)}
                x2={250 + 168 * Math.cos(a)}
                y2={250 + 168 * Math.sin(a)}
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
            );
          })}
        </g>

        {/* ======================================================== */}
        {/* 4. CENTRAL OBSIDIAN ALTAR: Stage for Monolithic Relic    */}
        {/* ======================================================== */}
        <g>
          {/* Main Obsidian Sanctuary Disc */}
          <circle
            cx="250"
            cy="250"
            r="140"
            fill="url(#altarRadialGrad)"
            stroke="url(#chronosGold)"
            strokeWidth="1.8"
            strokeOpacity="0.75"
            filter="url(#gearShadow)"
          />
          {/* Inner Celestial Hairline Ring */}
          <circle
            cx="250"
            cy="250"
            r="132"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="0.8"
            strokeDasharray="3 5"
            strokeOpacity="0.45"
          />
          {/* Four Cardinal Star Studs (12, 3, 6, 9 o'clock) */}
          <polygon points="250,116 252,118 250,120 248,118" fill="#fef08a" opacity="0.8" />
          <polygon points="250,380 252,382 250,384 248,382" fill="#fef08a" opacity="0.8" />
          <polygon points="116,250 118,248 120,250 118,252" fill="#fef08a" opacity="0.8" />
          <polygon points="380,250 382,248 384,250 382,252" fill="#fef08a" opacity="0.8" />
        </g>

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
