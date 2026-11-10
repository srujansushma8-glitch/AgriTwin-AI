"use client";

import React from "react";

interface WaveDividerProps {
  fillColor?: string;
  position?: "top" | "bottom";
  className?: string;
}

export function WaveDivider({
  fillColor = "#F8F3E9",
  position = "bottom",
  className = ""
}: WaveDividerProps) {
  if (position === "top") {
    return (
      <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 md:h-28 block"
        >
          {/* Smooth organic wave curving downward from top */}
          <path
            d="M0 0 C 320 70, 720 120, 1080 75 C 1260 50, 1380 20, 1440 0 L 1440 120 L 0 120 Z"
            fill={fillColor}
          />
        </svg>
      </div>
    );
  }

  // Bottom wave transitioning into the cream background
  return (
    <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-16 sm:h-24 md:h-32 block"
      >
        {/* Soft, graceful natural wave matching the reference image */}
        <path
          d="M 0,40 C 240,110 520,120 780,50 C 960,0 1220,15 1440,55 L 1440,140 L 0,140 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

