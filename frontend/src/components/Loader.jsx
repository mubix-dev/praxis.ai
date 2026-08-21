import React from "react";

function Loader() {
  return (
    <svg viewBox="0 0 64 84" className="w-24 h-auto">
      <defs>
        <linearGradient id="ld-glow" x1="-10" y1="6" x2="10" y2="-4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6d5efc" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="ld-rim" x1="-19" y1="17" x2="19" y2="-15" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      <g transform="translate(32 34) scale(1.15)">
        {/* gentle hover */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2.2; 0 0" dur="2.4s" repeatCount="indefinite" />

          <line x1="0" y1="-15" x2="0" y2="-21" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="0" cy="-23.5" r="2.8" fill="#22d3ee">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <rect x="-19" y="-15" width="38" height="32" rx="12" fill="#171c28" stroke="url(#ld-rim)" strokeWidth="1.6" />

          {/* eyes blink every few seconds */}
          <rect x="-11" y="-6" width="7" height="10" rx="3.5" fill="url(#ld-glow)">
            <animate attributeName="height" values="10;10;1.6;10;10" keyTimes="0;0.44;0.5;0.56;1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="-6;-6;-1.8;-6;-6" keyTimes="0;0.44;0.5;0.56;1" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="4" y="-6" width="7" height="10" rx="3.5" fill="url(#ld-glow)">
            <animate attributeName="height" values="10;10;1.6;10;10" keyTimes="0;0.44;0.5;0.56;1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="-6;-6;-1.8;-6;-6" keyTimes="0;0.44;0.5;0.56;1" dur="4s" repeatCount="indefinite" />
          </rect>

          <path d="M-4 10 Q0 13 4 10" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        </g>
      </g>

      {/* thinking dots */}
      <circle cx="24" cy="74" r="2.5" fill="#6d5efc">
        <animate attributeName="cy" values="74;68;74" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="74" r="2.5" fill="#22d3ee">
        <animate attributeName="cy" values="74;68;74" dur="1.2s" begin="0.15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" begin="0.15s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="74" r="2.5" fill="#ec4899">
        <animate attributeName="cy" values="74;68;74" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default Loader;
