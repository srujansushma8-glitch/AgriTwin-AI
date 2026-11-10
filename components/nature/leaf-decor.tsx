"use client";

import React from "react";

interface LeafDecorProps {
  variant?: "branch" | "single" | "pair" | "small";
  className?: string;
  color?: string;
}

export function LeafDecor({
  variant = "single",
  className = "",
  color = "#2E7D32"
}: LeafDecorProps) {
  if (variant === "branch") {
    return (
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none select-none ${className}`}
      >
        {/* Main stem */}
        <path
          d="M85 110 C70 85, 45 45, 15 10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Leaf 1 (Top Left) */}
        <path
          d="M15 10 C10 15, 8 30, 20 32 C30 33, 25 15, 15 10 Z"
          fill={color}
          opacity="0.85"
        />
        <path d="M15 10 Q20 22 20 32" stroke="#A3E635" strokeWidth="0.8" opacity="0.6" />

        {/* Leaf 2 (Right top) */}
        <path
          d="M32 30 C45 28, 55 35, 50 48 C42 56, 32 40, 32 30 Z"
          fill={color}
          opacity="0.9"
        />
        <path d="M32 30 Q42 40 50 48" stroke="#A3E635" strokeWidth="0.8" opacity="0.6" />

        {/* Leaf 3 (Left middle) */}
        <path
          d="M48 55 C35 55, 20 68, 25 80 C32 88, 48 72, 48 55 Z"
          fill={color}
          opacity="0.85"
        />
        <path d="M48 55 Q35 70 25 80" stroke="#A3E635" strokeWidth="0.8" opacity="0.6" />

        {/* Leaf 4 (Right middle) */}
        <path
          d="M62 75 C78 72, 90 82, 85 95 C75 102, 60 88, 62 75 Z"
          fill={color}
          opacity="0.9"
        />
        <path d="M62 75 Q75 88 85 95" stroke="#A3E635" strokeWidth="0.8" opacity="0.6" />
      </svg>
    );
  }

  if (variant === "pair") {
    return (
      <svg
        viewBox="0 0 60 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none select-none ${className}`}
      >
        <path
          d="M30 45 C28 35, 25 25, 10 15 C8 28, 18 40, 30 45 Z"
          fill={color}
          opacity="0.85"
        />
        <path
          d="M30 45 C35 32, 42 20, 52 12 C52 26, 42 38, 30 45 Z"
          fill="#34D399"
          opacity="0.9"
        />
        <path d="M30 45 Q38 30 52 12" stroke="#E8F5E9" strokeWidth="0.7" opacity="0.5" />
      </svg>
    );
  }

  // Single Leaf
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      <path
        d="M8 32 C12 20, 20 10, 35 5 C35 20, 25 30, 8 32 Z"
        fill={color}
        opacity="0.85"
      />
      {/* Central leaf vein */}
      <path
        d="M8 32 C18 24, 25 16, 35 5"
        stroke="#A3E635"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

