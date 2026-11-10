"use client";

import React from "react";

interface AgriculturalDroneProps {
  className?: string;
}

export function AgriculturalDrone({ className = "" }: AgriculturalDroneProps) {
  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      <div className="relative animate-drone">
        <svg
          viewBox="0 0 320 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)]"
        >
          {/* Rotor Blur Discs (Left & Right) */}
          <ellipse cx="65" cy="50" rx="42" ry="7" fill="white" fillOpacity="0.45" stroke="#4B6354" strokeWidth="0.8" />
          <ellipse cx="145" cy="40" rx="35" ry="6" fill="white" fillOpacity="0.4" stroke="#4B6354" strokeWidth="0.8" />
          <ellipse cx="255" cy="50" rx="42" ry="7" fill="white" fillOpacity="0.45" stroke="#4B6354" strokeWidth="0.8" />
          <ellipse cx="180" cy="40" rx="35" ry="6" fill="white" fillOpacity="0.4" stroke="#4B6354" strokeWidth="0.8" />

          {/* Rotor Motor Hubs */}
          <circle cx="65" cy="50" r="5" fill="#1C1C1C" stroke="#173D27" strokeWidth="1.5" />
          <circle cx="145" cy="40" r="4.5" fill="#1C1C1C" stroke="#173D27" strokeWidth="1.5" />
          <circle cx="180" cy="40" r="4.5" fill="#1C1C1C" stroke="#173D27" strokeWidth="1.5" />
          <circle cx="255" cy="50" r="5" fill="#1C1C1C" stroke="#173D27" strokeWidth="1.5" />

          {/* Carbon Fiber Arms */}
          <path d="M65 50 L160 70 M255 50 L160 70" stroke="#2B2B2B" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M145 40 L160 70 M180 40 L160 70" stroke="#2B2B2B" strokeWidth="3.5" strokeLinecap="round" />

          {/* Center Main Fuselage / Avionics Pod */}
          <path
            d="M130 65 C130 58, 190 58, 190 65 L195 90 C195 98, 125 98, 125 90 Z"
            fill="#1E2320"
            stroke="#173D27"
            strokeWidth="2"
          />
          {/* Top GPS Dome */}
          <ellipse cx="160" cy="62" rx="14" ry="5" fill="#31D17C" opacity="0.9" />

          {/* Chemical / Fertilizer Spray Tank (White/Translucent) */}
          <rect x="135" y="80" width="50" height="22" rx="10" fill="#E8F5E9" fillOpacity="0.85" stroke="#173D27" strokeWidth="1.5" />
          <rect x="142" y="85" width="36" height="4" rx="2" fill="#31D17C" opacity="0.75" />

          {/* Gimbal Camera & Multispectral Sensor Array */}
          <circle cx="160" cy="107" r="7.5" fill="#0A0A0A" stroke="#31D17C" strokeWidth="1.5" />
          <circle cx="160" cy="107" r="3.5" fill="#38BDF8" opacity="0.9" />

          {/* Landing Gear Skids */}
          <path d="M130 92 L120 120 M190 92 L200 120" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
          <path d="M105 120 L135 120 M185 120 L215 120" stroke="#2E2E2E" strokeWidth="3.5" strokeLinecap="round" />

          {/* Spray Boom Nozzles */}
          <path d="M90 108 L230 108" stroke="#173D27" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left Spray Nozzle */}
          <circle cx="105" cy="110" r="2.5" fill="#31D17C" />
          {/* Center Left Nozzle */}
          <circle cx="140" cy="110" r="2.5" fill="#31D17C" />
          {/* Center Right Nozzle */}
          <circle cx="180" cy="110" r="2.5" fill="#31D17C" />
          {/* Right Nozzle */}
          <circle cx="215" cy="110" r="2.5" fill="#31D17C" />

          {/* Delicate Fine Mist Spray Cones */}
          <g className="animate-spray">
            <polygon points="105,112 70,175 140,175" fill="url(#sprayGradient)" opacity="0.4" />
            <polygon points="140,112 110,180 170,180" fill="url(#sprayGradient)" opacity="0.45" />
            <polygon points="180,112 150,180 210,180" fill="url(#sprayGradient)" opacity="0.45" />
            <polygon points="215,112 180,175 250,175" fill="url(#sprayGradient)" opacity="0.4" />
          </g>

          <defs>
            <linearGradient id="sprayGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#C7E9D4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

