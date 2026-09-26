"use client";

import React, { useMemo } from "react";

export function JasminePetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.8 + 3) % 96}%`,
      delay: `${(i * 0.75) % 8}s`,
      duration: `${9 + (i % 6) * 1.8}s`,
      size: 14 + (i % 5) * 5,
      rotate: (i * 45) % 360,
      opacity: 0.55 + (i % 4) * 0.12,
    }));
  }, []);

  return (
    <div className="ep-jasmine-canvas" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="ep-jasmine-petal"
          style={{
            left: p.left,
            animation: `epPetalFall ${p.duration} linear infinite`,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        >
          {/* Jasmine 5-petal white flower SVG */}
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 40 40"
            fill="none"
            style={{ transform: `rotate(${p.rotate}deg)` }}
          >
            <defs>
              <radialGradient id={`petalGrad-${p.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="70%" stopColor="#FAF0D7" />
                <stop offset="100%" stopColor="#EADBBD" />
              </radialGradient>
            </defs>
            {/* 5 Petals */}
            <path d="M 20,20 C 17,10 17,2 20,2 C 23,2 23,10 20,20 Z" fill={`url(#petalGrad-${p.id})`} />
            <path d="M 20,20 C 29,14 36,17 37,20 C 37,23 29,23 20,20 Z" fill={`url(#petalGrad-${p.id})`} />
            <path d="M 20,20 C 27,28 30,35 28,37 C 25,38 23,30 20,20 Z" fill={`url(#petalGrad-${p.id})`} />
            <path d="M 20,20 C 13,29 7,34 5,32 C 3,29 11,24 20,20 Z" fill={`url(#petalGrad-${p.id})`} />
            <path d="M 20,20 C 11,15 4,18 3,15 C 3,12 11,14 20,20 Z" fill={`url(#petalGrad-${p.id})`} />
            {/* Center Yellow Pollen */}
            <circle cx="20" cy="20" r="3" fill="#DFB759" opacity="0.9" />
          </svg>
        </div>
      ))}
    </div>
  );
}
export default JasminePetals;
