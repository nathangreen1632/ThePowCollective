// Client/src/components/maps/UsaMap.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsaMap(): React.ReactElement {
  const navigate = useNavigate();

  function handleColoradoClick() {
    navigate('/states/co');
  }

  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox="0 0 960 600"
        role="text"
        aria-label="Map of the United States. Colorado is selectable."
        className="max-w-full drop-shadow"
      >
        {/* Rough US silhouette background */}
        <path
          d="M40 180 L120 120 L220 110 L320 90 L420 100 L520 120 L640 160 L740 180 L860 220 L900 260 L880 340 L820 380 L740 420 L640 440 L520 460 L420 450 L320 430 L220 400 L140 360 L80 320 Z"
          fill="var(--pow-surface)"
          stroke="var(--pow-border)"
          strokeWidth="2"
        />

        {/* Colorado rectangle, positioned roughly central-west */}
        <rect
          x="340"
          y="250"
          width="140"
          height="90"
          rx="4"
          ry="4"
          fill="var(--pow-accent-soft)"
          stroke="var(--pow-accent)"
          strokeWidth="3"
          className="cursor-pointer transition-[fill] hover:fill-[var(--pow-accent)]"
          onClick={handleColoradoClick}
        />

        <text
          x="410"
          y="305"
          textAnchor="middle"
          fontSize="18"
          fill="var(--pow-accent-strong, #ffffff)"
          pointerEvents="none"
        >
          CO
        </text>
      </svg>
    </div>
  );
}
