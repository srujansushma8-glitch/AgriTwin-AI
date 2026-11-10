"use client";

import React from "react";

interface FarmIllustrationProps {
  className?: string;
}

export function FarmIllustration({ className = "" }: FarmIllustrationProps) {
  return (
    <div className={`relative w-full max-w-sm pointer-events-none select-none opacity-85 ${className}`}>
      <svg
        viewBox="0 0 420 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[#173D27]"
      >
        {/* Sky / Birds */}
        <path
          d="M340 35 Q344 30 348 35 Q352 30 356 35"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M360 42 Q363 38 366 42 Q369 38 372 42"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Distant Trees on Horizon */}
        <path
          d="M20 120 C30 115, 45 116, 55 120 C65 114, 80 115, 90 120 C100 112, 115 113, 125 120"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.35"
        />
        <path
          d="M30 115 Q35 105 40 115 M42 116 Q48 102 54 116 M75 115 Q80 106 85 115"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Vintage Windmill (Right of Farmhouse) */}
        <g opacity="0.75" transform="translate(195, 45)">
          {/* Tower Base */}
          <path d="M12 75 L18 25 L32 25 L38 75 Z" stroke="currentColor" strokeWidth="1.4" fill="#F8F3E9" />
          {/* Horizontal cross-beams */}
          <line x1="15" y1="40" x2="35" y2="40" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
          <line x1="13" y1="58" x2="37" y2="58" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
          {/* Diagonal lattice */}
          <line x1="15" y1="40" x2="37" y2="58" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          <line x1="35" y1="40" x2="13" y2="58" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          {/* Cap / Rotor Hub */}
          <circle cx="25" cy="23" r="3" fill="currentColor" />
          {/* Windmill 4 Blades */}
          <line x1="25" y1="23" x2="25" y2="-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="25" y1="23" x2="25" y2="54" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="25" y1="23" x2="-6" y2="23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="25" y1="23" x2="56" y2="23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          {/* Blade vanes */}
          <rect x="26" y="-6" width="6" height="25" stroke="currentColor" strokeWidth="0.7" fill="#F8F3E9" opacity="0.7" />
          <rect x="18" y="27" width="6" height="25" stroke="currentColor" strokeWidth="0.7" fill="#F8F3E9" opacity="0.7" />
          <rect x="-4" y="17" width="25" height="5" stroke="currentColor" strokeWidth="0.7" fill="#F8F3E9" opacity="0.7" />
          <rect x="29" y="24" width="25" height="5" stroke="currentColor" strokeWidth="0.7" fill="#F8F3E9" opacity="0.7" />
        </g>

        {/* Farmhouse & Barn Complex */}
        <g opacity="0.85" transform="translate(45, 65)">
          {/* Silo */}
          <path d="M125 55 L125 18 C125 10, 137 10, 137 18 L137 55 Z" stroke="currentColor" strokeWidth="1.4" fill="#F8F3E9" />
          <path d="M125 18 Q131 8 137 18" stroke="currentColor" strokeWidth="1.2" />

          {/* Main Farmhouse Body */}
          <rect x="25" y="22" width="75" height="33" stroke="currentColor" strokeWidth="1.5" fill="#F8F3E9" />
          {/* Pitched Roof */}
          <path d="M20 22 L62 2 L105 22 Z" stroke="currentColor" strokeWidth="1.5" fill="#F8F3E9" />
          {/* Chimney */}
          <path d="M85 12 L85 2 L93 2 L93 16" stroke="currentColor" strokeWidth="1.2" fill="#F8F3E9" />
          {/* Windows & Door */}
          <rect x="35" y="28" width="10" height="12" stroke="currentColor" strokeWidth="1" />
          <line x1="40" y1="28" x2="40" y2="40" stroke="currentColor" strokeWidth="0.7" />
          <line x1="35" y1="34" x2="45" y2="34" stroke="currentColor" strokeWidth="0.7" />

          <rect x="58" y="32" width="10" height="23" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="66" cy="44" r="0.8" fill="currentColor" />

          <rect x="78" y="28" width="10" height="12" stroke="currentColor" strokeWidth="1" />
          <line x1="83" y1="28" x2="83" y2="40" stroke="currentColor" strokeWidth="0.7" />
          <line x1="78" y1="34" x2="88" y2="34" stroke="currentColor" strokeWidth="0.7" />

          {/* Attic window */}
          <circle cx="62.5" cy="13" r="3.5" stroke="currentColor" strokeWidth="0.9" />

          {/* Side Lean-to Shed */}
          <path d="M100 32 L120 38 L120 55 L100 55 Z" stroke="currentColor" strokeWidth="1.3" fill="#F8F3E9" />
          <rect x="105" y="40" width="8" height="15" stroke="currentColor" strokeWidth="0.9" />

          {/* Wooden Picket Fence */}
          <path d="M0 52 L25 52 M5 48 L5 55 M12 48 L12 55 M19 48 L19 55" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Contoured Agricultural Field Furrows Flowing Forward */}
        <g opacity="0.6">
          <path
            d="M5 125 C80 120, 200 122, 410 126"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M0 135 C70 130, 190 132, 415 138"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M0 146 C60 142, 180 144, 420 152"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M0 158 C50 155, 170 158, 420 167"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M0 171 C50 169, 160 172, 420 180"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>

        {/* Small Crop Stubble / Plants on Furrows */}
        <g opacity="0.4" stroke="currentColor" strokeWidth="0.9">
          <path d="M40 142 L42 138 M80 140 L83 135 M120 141 L122 137 M160 142 L164 138 M210 143 L213 138 M260 145 L263 140" />
          <path d="M30 154 L32 150 M70 152 L73 147 M110 153 L113 149 M150 155 L154 150 M200 157 L203 151 M250 159 L253 153" />
        </g>
      </svg>
    </div>
  );
}

