import React from "react";

export function RoyalCornerOrnament({
  position = "tl",
  className = "",
}: {
  position?: "tl" | "tr" | "bl" | "br";
  className?: string;
}) {
  const transform = {
    tl: "",
    tr: "scale(-1, 1) translate(-64, 0)",
    bl: "scale(1, -1) translate(0, -64)",
    br: "scale(-1, -1) translate(-64, -64)",
  }[position];

  return (
    <svg viewBox="0 0 64 64" className={`w-10 h-10 ${className}`} fill="none">
      <g transform={transform}>
        <path
          d="M 2,62 L 2,14 C 2,7 7,2 14,2 L 62,2"
          stroke="#DFB759"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 8,62 L 8,18 C 8,12 12,8 18,8 L 62,8"
          stroke="#DFB759"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.75"
        />
        <circle cx="16" cy="16" r="3.5" fill="#DFB759" />
        <circle cx="2" cy="2" r="2" fill="#FFF2C6" />
      </g>
    </svg>
  );
}

/**
 * Top Arch Ornament for Hero & Section Headers
 */
export function PlaqueArchFrame({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      {/* Decorative SVG Arched Border Frame */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 480 340"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="goldPlaqueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFB759" />
            <stop offset="25%" stopColor="#FDEAB2" />
            <stop offset="50%" stopColor="#C59D3F" />
            <stop offset="80%" stopColor="#D6AD63" />
            <stop offset="100%" stopColor="#9C7723" />
          </linearGradient>
          <filter id="plaqueGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#B88A3B" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Multi-Foil Scallop Outline */}
        <path
          d="M 40,16 
             C 90,8 140,8 190,14 
             C 210,6 230,2 240,0 
             C 250,2 270,6 290,14 
             C 340,8 390,8 440,16 
             C 468,28 476,56 476,88 
             L 476,252 
             C 476,284 468,312 440,324 
             C 390,332 340,332 290,326 
             C 270,334 250,338 240,340 
             C 230,338 210,334 190,326 
             C 140,332 90,332 40,324 
             C 12,312 4,284 4,252 
             L 4,88 
             C 4,56 12,28 40,16 Z"
          fill="#FFF6E9"
          stroke="url(#goldPlaqueGrad)"
          strokeWidth="2.5"
          filter="url(#plaqueGlow)"
        />

        {/* Inner Fine Accent Border */}
        <path
          d="M 46,24 
             C 94,17 142,17 190,22 
             C 210,15 228,11 240,10 
             C 252,11 270,15 290,22 
             C 338,17 386,17 434,24 
             C 458,34 466,60 466,90 
             L 466,250 
             C 466,280 458,306 434,316 
             C 386,323 338,323 290,318 
             C 270,325 252,329 240,330 
             C 228,329 210,325 190,318 
             C 142,323 94,323 46,316 
             C 22,306 14,280 14,250 
             L 14,90 
             C 14,60 22,34 46,24 Z"
          stroke="url(#goldPlaqueGrad)"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.8"
        />

        {/* Corner Arabesques */}
        <circle cx="28" cy="40" r="3" fill="url(#goldPlaqueGrad)" />
        <circle cx="452" cy="40" r="3" fill="url(#goldPlaqueGrad)" />
        <circle cx="28" cy="300" r="3" fill="url(#goldPlaqueGrad)" />
        <circle cx="452" cy="300" r="3" fill="url(#goldPlaqueGrad)" />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Ornate Multi-foil Portrait Arch Frame
 */
export function CouplePortraitArchFrame({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Arch Shaped Container with Shadow */}
      <div className="relative w-32 h-44 xs:w-36 xs:h-48 sm:w-52 sm:h-68 rounded-t-[3.5rem] sm:rounded-t-[5rem] rounded-b-xl sm:rounded-b-2xl overflow-hidden border-2 border-[#D6AD63] shadow-[0_8px_24px_rgba(120,29,54,0.16)] bg-[#FFF6E9]">
        {/* Double Inner Border Accent */}
        <div className="absolute inset-1.5 rounded-t-[3.2rem] sm:rounded-t-[4.7rem] rounded-b-lg sm:rounded-b-xl border border-[#D6AD63]/60 pointer-events-none z-10" />

        {/* Outer Filigree Top Arch Overlay */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-[#D6AD63]/25 to-transparent pointer-events-none z-10" />

        {/* Portrait Image */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Base Lotus & Rose Accent Wreath */}
      <div className="relative -mt-5 z-20 pointer-events-none flex justify-center w-full">
        <svg viewBox="0 0 200 48" className="w-36 sm:w-44 h-10 sm:h-12" fill="none">
          <defs>
            <linearGradient id="lotusGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFB759" />
              <stop offset="50%" stopColor="#C59D3F" />
              <stop offset="100%" stopColor="#9C7723" />
            </linearGradient>
            <linearGradient id="rosePinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F48FB1" />
              <stop offset="50%" stopColor="#E91E63" />
              <stop offset="100%" stopColor="#AD1457" />
            </linearGradient>
          </defs>
          {/* Leaves */}
          <path d="M 60,32 C 40,24 20,28 10,26 C 24,34 44,38 60,32 Z" fill="#4E7037" opacity="0.8" />
          <path d="M 140,32 C 160,24 180,28 190,26 C 176,34 156,38 140,32 Z" fill="#4E7037" opacity="0.8" />
          {/* Side Lotus Flowers */}
          <path d="M 40,24 C 34,16 38,10 44,14 C 50,10 54,16 48,24 Z" fill="url(#rosePinkGrad)" />
          <path d="M 160,24 C 154,16 158,10 164,14 C 170,10 174,16 168,24 Z" fill="url(#rosePinkGrad)" />
          {/* Center Lotus Flower */}
          <path d="M 100,6 C 92,16 90,24 100,32 C 110,24 108,16 100,6 Z" fill="url(#rosePinkGrad)" />
          <path d="M 94,14 C 84,20 86,28 98,32 C 92,26 90,20 94,14 Z" fill="url(#rosePinkGrad)" opacity="0.9" />
          <path d="M 106,14 C 116,20 114,28 102,32 C 108,26 110,20 106,14 Z" fill="url(#rosePinkGrad)" opacity="0.9" />
          {/* Gold Center Seed Pod */}
          <circle cx="100" cy="24" r="3.5" fill="url(#lotusGoldGrad)" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Organic Burgundy Section Waves
 */
export function StoryWaveTop({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className={`w-full h-12 sm:h-20 ${className}`}
      fill="none"
    >
      <path
        d="M 0,96 C 320,12 560,84 880,20 C 1120,-24 1320,54 1440,30 L 1440,96 L 0,96 Z"
        fill="#781D36"
      />
    </svg>
  );
}

export function StoryWaveBottom({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className={`w-full h-12 sm:h-20 ${className}`}
      fill="none"
    >
      <path
        d="M 0,0 L 1440,0 L 1440,40 C 1280,94 1040,16 720,70 C 440,116 180,34 0,80 Z"
        fill="#781D36"
      />
    </svg>
  );
}

/**
 * Ornamental Butterfly / Flourish
 */
export function ButterflyFlourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={`w-10 h-7 ${className}`} fill="none">
      <defs>
        <linearGradient id="bfGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDEAB2" />
          <stop offset="50%" stopColor="#DFB759" />
          <stop offset="100%" stopColor="#9C7723" />
        </linearGradient>
      </defs>
      {/* Left Wings */}
      <path d="M 30,20 C 24,10 10,6 4,14 C -2,22 12,28 28,22 Z" fill="url(#bfGold)" opacity="0.9" />
      <path d="M 30,22 C 22,24 16,34 22,38 C 28,40 30,30 30,22 Z" fill="url(#bfGold)" opacity="0.75" />
      {/* Right Wings */}
      <path d="M 30,20 C 36,10 50,6 56,14 C 62,22 48,28 32,22 Z" fill="url(#bfGold)" opacity="0.9" />
      <path d="M 30,22 C 38,24 44,34 38,38 C 32,40 30,30 30,22 Z" fill="url(#bfGold)" opacity="0.75" />
      {/* Body */}
      <ellipse cx="30" cy="22" rx="2" ry="7" fill="url(#bfGold)" />
      {/* Antennae */}
      <path d="M 30,15 Q 26,10 24,8" stroke="url(#bfGold)" strokeWidth="1" strokeLinecap="round" />
      <path d="M 30,15 Q 34,10 36,8" stroke="url(#bfGold)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Ornamental Section Divider with Lotus & Gold Filigree
 */
export function RoyalDivider({
  className = "",
  goldVariant = "standard",
}: {
  className?: string;
  goldVariant?: "standard" | "emerald" | "light" | "burgundy";
}) {
  const stroke = goldVariant === "light" ? "#F5E096" : "#DFB759";
  return (
    <div className={`flex items-center justify-center my-4 w-full max-w-md mx-auto ${className}`}>
      <svg viewBox="0 0 360 28" className="w-full h-6" fill="none">
        <defs>
          <linearGradient id="divGradRedesign" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stroke} stopOpacity="0" />
            <stop offset="35%" stopColor={stroke} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFF3CE" stopOpacity="1" />
            <stop offset="65%" stopColor={stroke} stopOpacity="0.8" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Left line with scroll */}
        <line x1="20" y1="14" x2="155" y2="14" stroke="url(#divGradRedesign)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="150" cy="14" r="2" fill={stroke} />

        {/* Center Lotus Medallion */}
        <g transform="translate(180, 14)">
          <circle cx="0" cy="0" r="7" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="0" cy="0" r="3.5" fill={stroke} />
          <path d="M 0,-10 C 2,-7 2,-3 0,-3 C -2,-3 -2,-7 0,-10 Z" fill={stroke} />
          <path d="M 0,10 C 2,7 2,3 0,3 C -2,3 -2,7 0,10 Z" fill={stroke} />
          <path d="M -10,0 C -7,2 -3,2 -3,0 C -3,-2 -7,-2 -10,0 Z" fill={stroke} />
          <path d="M 10,0 C 7,2 3,2 3,0 C 3,-2 7,-2 10,0 Z" fill={stroke} />
        </g>

        {/* Right line with scroll */}
        <circle cx="210" cy="14" r="2" fill={stroke} />
        <line x1="205" y1="14" x2="340" y2="14" stroke="url(#divGradRedesign)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * Hanging Temple Bells with Brass Chains
 */
export function HangingTempleBell({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const widthClass = size === "lg" ? "w-16" : size === "sm" ? "w-8" : "w-12";
  return (
    <div className={`ep-bell-sway ${widthClass} ${className}`}>
      <svg viewBox="0 0 60 180" className="w-full h-auto" fill="none">
        <defs>
          <linearGradient id="chainGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DFB759" />
            <stop offset="50%" stopColor="#FDEAB2" />
            <stop offset="100%" stopColor="#9C7723" />
          </linearGradient>
          <linearGradient id="bellGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2C6" />
            <stop offset="35%" stopColor="#DFB759" />
            <stop offset="70%" stopColor="#B88A3B" />
            <stop offset="100%" stopColor="#755513" />
          </linearGradient>
        </defs>

        {/* Chain links */}
        {[0, 15, 30, 45, 60, 75, 90, 105].map((y, i) => (
          <ellipse
            key={i}
            cx="30"
            cy={y + 8}
            rx="3"
            ry="7"
            fill="none"
            stroke="url(#chainGold)"
            strokeWidth="1.8"
          />
        ))}

        {/* Bell Body */}
        <g transform="translate(0, 120)">
          {/* Bell Top Cap & Ring */}
          <circle cx="30" cy="4" r="5" fill="none" stroke="url(#chainGold)" strokeWidth="2" />
          <path d="M 22,10 L 38,10 L 35,16 L 25,16 Z" fill="url(#bellGoldGrad)" />

          {/* Bell Flared Body */}
          <path
            d="M 24,16 
               C 22,24 16,36 12,44 
               C 10,48 14,52 30,52 
               C 46,52 50,48 48,44 
               C 44,36 38,24 36,16 Z"
            fill="url(#bellGoldGrad)"
            stroke="#DFB759"
            strokeWidth="1"
          />

          {/* Lower Bell Rim Flange */}
          <ellipse cx="30" cy="51" rx="20" ry="4" fill="url(#bellGoldGrad)" stroke="#DFB759" strokeWidth="1.2" />

          {/* Bell Clapper */}
          <circle cx="30" cy="58" r="4.5" fill="url(#bellGoldGrad)" stroke="#9C7723" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Event Illustration Icons
 */
export function HaldiBowlIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`w-14 h-14 ${className}`} fill="none">
      <defs>
        <linearGradient id="brassBowl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2C6" />
          <stop offset="50%" stopColor="#DFB759" />
          <stop offset="100%" stopColor="#9C7723" />
        </linearGradient>
        <radialGradient id="haldiPaste" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="60%" stopColor="#FBC02D" />
          <stop offset="100%" stopColor="#F57F17" />
        </radialGradient>
      </defs>
      {/* Marigold Petals around Bowl */}
      <circle cx="24" cy="46" r="6" fill="#FF9800" />
      <circle cx="56" cy="46" r="6" fill="#FF9800" />
      <circle cx="18" cy="56" r="7" fill="#F57C00" />
      <circle cx="62" cy="56" r="7" fill="#F57C00" />
      {/* Bowl Body */}
      <path
        d="M 18,42 C 20,62 60,62 62,42 Z"
        fill="url(#brassBowl)"
        stroke="#B88A3B"
        strokeWidth="1.5"
      />
      {/* Bowl Rim */}
      <ellipse cx="40" cy="42" rx="22" ry="5.5" fill="url(#brassBowl)" stroke="#DFB759" strokeWidth="1.2" />
      {/* Turmeric Mound */}
      <path
        d="M 24,42 C 28,30 52,30 56,42 Z"
        fill="url(#haldiPaste)"
      />
      {/* Fresh Marigold Flower on Top */}
      <g transform="translate(40, 32)">
        <circle cx="0" cy="0" r="4.5" fill="#E65100" />
        <circle cx="0" cy="0" r="3" fill="#FFD54F" />
      </g>
    </svg>
  );
}

export function DholakIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`w-14 h-14 ${className}`} fill="none">
      <defs>
        <linearGradient id="dholakWood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A15C38" />
          <stop offset="50%" stopColor="#6D371A" />
          <stop offset="100%" stopColor="#4A220E" />
        </linearGradient>
        <linearGradient id="dholakRope" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDEAB2" />
          <stop offset="100%" stopColor="#DFB759" />
        </linearGradient>
      </defs>
      {/* Musical Sparkles */}
      <path d="M 64,18 Q 68,14 72,18 Q 68,22 64,18 Z" fill="#DFB759" />
      <path d="M 16,22 Q 20,18 24,22 Q 20,26 16,22 Z" fill="#DFB759" />
      {/* Dholak Barrel */}
      <g transform="rotate(-15 40 46)">
        <ellipse cx="40" cy="46" rx="26" ry="17" fill="url(#dholakWood)" stroke="#DFB759" strokeWidth="1.2" />
        {/* Left Head */}
        <ellipse cx="16" cy="46" rx="4" ry="14" fill="#FAF5EB" stroke="#DFB759" strokeWidth="1.5" />
        <ellipse cx="16" cy="46" rx="2" ry="7" fill="#3E2723" />
        {/* Right Head */}
        <ellipse cx="64" cy="46" rx="4" ry="14" fill="#FAF5EB" stroke="#DFB759" strokeWidth="1.5" />
        <ellipse cx="64" cy="46" rx="2.5" ry="8" fill="#3E2723" />
        {/* Tuning Zig-zag Ropes */}
        <path
          d="M 20,34 L 32,56 L 44,34 L 54,56 L 62,38 M 20,58 L 32,36 L 44,58 L 54,36 L 62,54"
          stroke="url(#dholakRope)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        {/* Brass Rings */}
        <circle cx="32" cy="46" r="2.5" fill="#DFB759" />
        <circle cx="48" cy="46" r="2.5" fill="#DFB759" />
      </g>
    </svg>
  );
}

export function KalashIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`w-14 h-14 ${className}`} fill="none">
      <defs>
        <linearGradient id="kalashGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2C6" />
          <stop offset="40%" stopColor="#DFB759" />
          <stop offset="80%" stopColor="#B88A3B" />
          <stop offset="100%" stopColor="#755513" />
        </linearGradient>
      </defs>
      {/* Mango Leaves */}
      <path d="M 40,24 C 30,12 24,14 26,26 Z" fill="#43A047" stroke="#2E7D32" strokeWidth="0.8" />
      <path d="M 40,24 C 50,12 56,14 54,26 Z" fill="#43A047" stroke="#2E7D32" strokeWidth="0.8" />
      <path d="M 40,24 C 34,8 46,8 40,2 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="0.8" />
      {/* Sacred Coconut */}
      <ellipse cx="40" cy="22" rx="10" ry="12" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
      {/* Tilak on Coconut */}
      <path d="M 37,20 L 43,20 M 37,22 L 43,22 M 40,17 L 40,25" stroke="#E53935" strokeWidth="1.2" strokeLinecap="round" />
      {/* Kalash Pot Body */}
      <path
        d="M 30,30 L 50,30 L 48,34 C 56,38 60,46 58,56 C 56,64 48,68 40,68 C 32,68 24,64 22,56 C 20,46 24,38 32,34 Z"
        fill="url(#kalashGold)"
        stroke="#DFB759"
        strokeWidth="1.5"
      />
      {/* Base Pedestal */}
      <path d="M 32,68 L 48,68 L 50,72 L 30,72 Z" fill="url(#kalashGold)" />
      {/* Red Swastika / Sacred Mark */}
      <path
        d="M 36,46 L 44,46 M 40,42 L 40,50 M 44,46 L 44,43 M 40,50 L 37,50 M 36,46 L 36,49 M 40,42 L 43,42"
        stroke="#C62828"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function CelebrationFlutesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`w-14 h-14 ${className}`} fill="none">
      <defs>
        <linearGradient id="fluteGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2C6" />
          <stop offset="50%" stopColor="#DFB759" />
          <stop offset="100%" stopColor="#B88A3B" />
        </linearGradient>
      </defs>
      {/* Sparkling Stars */}
      <path d="M 40,12 L 42,16 L 46,18 L 42,20 L 40,24 L 38,20 L 34,18 L 38,16 Z" fill="#DFB759" />
      <circle cx="32" cy="14" r="1.5" fill="#DFB759" />
      <circle cx="48" cy="14" r="1.5" fill="#DFB759" />
      {/* Left Glass */}
      <g transform="rotate(-12 34 46)">
        <path d="M 28,26 L 38,26 L 36,46 C 35,52 31,52 30,46 Z" fill="url(#fluteGold)" opacity="0.3" stroke="url(#fluteGold)" strokeWidth="1.2" />
        <line x1="33" y1="50" x2="33" y2="68" stroke="url(#fluteGold)" strokeWidth="1.5" />
        <ellipse cx="33" cy="68" rx="8" ry="2" fill="url(#fluteGold)" />
      </g>
      {/* Right Glass */}
      <g transform="rotate(12 46 46)">
        <path d="M 42,26 L 52,26 L 50,46 C 49,52 45,52 44,46 Z" fill="url(#fluteGold)" opacity="0.3" stroke="url(#fluteGold)" strokeWidth="1.2" />
        <line x1="47" y1="50" x2="47" y2="68" stroke="url(#fluteGold)" strokeWidth="1.5" />
        <ellipse cx="47" cy="68" rx="8" ry="2" fill="url(#fluteGold)" />
      </g>
    </svg>
  );
}

/**
 * Royal Elephant Vector (for Footer & Borders)
 */
export function RoyalElephantVector({
  direction = "left",
  className = "",
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  const flip = direction === "right" ? "scale(-1, 1)" : "";
  return (
    <svg viewBox="0 0 140 100" className={`w-28 h-20 ${className}`} fill="none" style={{ transform: flip }}>
      <defs>
        <linearGradient id="eleGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2C6" />
          <stop offset="40%" stopColor="#DFB759" />
          <stop offset="80%" stopColor="#C59D3F" />
          <stop offset="100%" stopColor="#8C6820" />
        </linearGradient>
      </defs>
      {/* Elephant Silhouette Linework in Antique Gold */}
      <path
        d="M 120,44 
           C 126,38 128,26 118,20 
           C 106,12 86,14 74,20 
           C 66,24 60,34 56,42 
           C 52,48 42,50 36,46 
           C 30,42 28,34 26,24 
           C 24,18 20,18 18,22 
           C 16,30 20,46 26,56 
           C 30,62 38,64 44,62 
           L 46,84 L 56,84 L 58,68 
           L 70,68 L 72,84 L 82,84 L 84,66 
           L 96,66 L 98,84 L 108,84 L 110,64 
           C 118,62 122,54 120,44 Z"
        stroke="url(#eleGold)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#eleGold)"
        fillOpacity="0.08"
      />
      {/* Tusk */}
      <path d="M 38,52 C 32,56 26,54 22,46" stroke="#FFF9C4" strokeWidth="2.5" strokeLinecap="round" />
      {/* Trunk curled flower */}
      <circle cx="18" cy="20" r="3" fill="url(#eleGold)" />
      {/* Large Royal Ear */}
      <path
        d="M 68,26 C 60,30 58,46 68,54 C 76,48 76,34 68,26 Z"
        stroke="url(#eleGold)"
        strokeWidth="1.8"
        fill="none"
      />
      {/* Decorative Royal Blanket / Jhool on back */}
      <path
        d="M 74,34 L 106,34 L 102,56 L 78,56 Z"
        stroke="url(#eleGold)"
        strokeWidth="1.5"
        fill="#781D36"
      />
      <circle cx="90" cy="45" r="5" stroke="url(#eleGold)" strokeWidth="1" fill="none" />
      {/* Hanging Bells on Blanket */}
      <circle cx="80" cy="59" r="2" fill="url(#eleGold)" />
      <circle cx="90" cy="59" r="2" fill="url(#eleGold)" />
      <circle cx="100" cy="59" r="2" fill="url(#eleGold)" />
      {/* Eye */}
      <circle cx="50" cy="34" r="1.5" fill="url(#eleGold)" />
    </svg>
  );
}

/**
 * Vedic Ganesha Emblem
 */
export function VedicGaneshaCrest({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_2px_8px_rgba(214,173,99,0.3)]" fill="none">
        <defs>
          <linearGradient id="ganeshaGold2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4D0" />
            <stop offset="50%" stopColor="#DFB759" />
            <stop offset="100%" stopColor="#8C6820" />
          </linearGradient>
        </defs>
        {/* Auspicious Tilak & Crown */}
        <path d="M 50,8 L 54,20 L 50,23 L 46,20 Z" fill="url(#ganeshaGold2)" />
        <circle cx="50" cy="16" r="1.5" fill="#781D36" />

        {/* Minimal Stylized Ganesha */}
        <path
          d="M 40,24 C 28,24 24,36 32,48 C 36,54 44,58 48,60 C 50,68 47,76 42,80 C 37,84 32,82 30,78"
          stroke="url(#ganeshaGold2)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 46,24 C 62,22 72,32 68,46 C 65,58 56,66 52,72 C 50,78 52,84 56,86 C 60,88 64,84 66,78"
          stroke="url(#ganeshaGold2)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="41" cy="80" r="3" fill="url(#ganeshaGold2)" />
        <path d="M 62,34 C 74,34 78,44 72,50" stroke="url(#ganeshaGold2)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 38,34 C 26,34 22,44 28,50" stroke="url(#ganeshaGold2)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

/**
 * Ornate Golden Hero Crest with Lotus Motif & Filigree
 */
export function HeroWeddingCrest({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 44" className={`w-24 h-8 ${className}`} fill="none">
      <defs>
        <linearGradient id="crestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2C6" />
          <stop offset="40%" stopColor="#DFB759" />
          <stop offset="80%" stopColor="#C59D3F" />
          <stop offset="100%" stopColor="#9C7723" />
        </linearGradient>
      </defs>
      {/* Center Lotus Blossom */}
      <path
        d="M 70,8 C 73,14 78,18 76,24 C 74,30 66,30 64,24 C 62,18 67,14 70,8 Z"
        fill="url(#crestGoldGrad)"
      />
      <path
        d="M 70,12 C 75,17 82,19 80,24 C 78,28 73,27 71,23 Z"
        fill="url(#crestGoldGrad)"
        opacity="0.9"
      />
      <path
        d="M 70,12 C 65,17 58,19 60,24 C 62,28 67,27 69,23 Z"
        fill="url(#crestGoldGrad)"
        opacity="0.9"
      />
      <circle cx="70" cy="5" r="2.2" fill="url(#crestGoldGrad)" />

      {/* Left Filigree Scroll */}
      <path
        d="M 60,24 C 50,22 36,24 26,18 C 18,14 16,21 21,24 C 30,29 44,26 56,26"
        stroke="url(#crestGoldGrad)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="18" cy="18" r="1.8" fill="url(#crestGoldGrad)" />

      {/* Right Filigree Scroll */}
      <path
        d="M 80,24 C 90,22 104,24 114,18 C 122,14 124,21 119,24 C 110,29 96,26 84,26"
        stroke="url(#crestGoldGrad)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="122" cy="18" r="1.8" fill="url(#crestGoldGrad)" />
    </svg>
  );
}

/* =========================================================
   TRADITIONAL SOUTH INDIAN HAND-DRAWN ORNAMENTS
   Fine Burgundy Linework with Antique Gold & Dusty Rose Accents
   ========================================================= */

export function TraditionalHangingLotus({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/templates/emerald-palace/ornaments/hanging-lotus.png"
      alt="Traditional Hanging Lotus Line Drawing"
      className={`pointer-events-none select-none object-contain ${className}`}
      style={style}
    />
  );
}

export function TraditionalJasmineCreeper({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/templates/emerald-palace/ornaments/jasmine-creeper.png"
      alt="Traditional Jasmine Creeper Motif"
      className={`pointer-events-none select-none object-contain ${className}`}
      style={style}
    />
  );
}

export function TraditionalSikkuKolam({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <picture className="contents">
      <source srcSet="/templates/emerald-palace/ornaments/kolam-sikku-brahma.webp" type="image/webp" />
      <img
        src="/templates/emerald-palace/ornaments/kolam-sikku-brahma.png"
        alt="Sacred Sikku Kolam Pattern"
        className={`pointer-events-none select-none object-contain ${className}`}
        style={style}
        loading="lazy"
      />
    </picture>
  );
}

export function TraditionalPulliKolam({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <picture className="contents">
      <source srcSet="/templates/emerald-palace/ornaments/kolam-pulli-lotus.webp" type="image/webp" />
      <img
        src="/templates/emerald-palace/ornaments/kolam-pulli-lotus.png"
        alt="Sacred Pulli Kolam Geometric Line Art"
        className={`pointer-events-none select-none object-contain ${className}`}
        style={style}
        loading="lazy"
      />
    </picture>
  );
}

export function TraditionalPaisleyMango({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/templates/emerald-palace/ornaments/paisley-mango.png"
      alt="Traditional South Indian Mango Motif"
      className={`pointer-events-none select-none object-contain ${className}`}
      style={style}
    />
  );
}

export function TraditionalFloralCluster({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/templates/emerald-palace/ornaments/floral-cluster.png"
      alt="Traditional Blooming Lotus Cluster"
      className={`pointer-events-none select-none object-contain ${className}`}
      style={style}
    />
  );
}

export function TraditionalHangingLeaves({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/templates/emerald-palace/ornaments/hanging-leaves.png"
      alt="Festoon Mango Leaves and Thoranam"
      className={`pointer-events-none select-none object-contain ${className}`}
      style={style}
    />
  );
}

export function TraditionalCornerKolam({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <picture className="contents">
      <source srcSet="/templates/emerald-palace/ornaments/kolam-corner-ornament.webp" type="image/webp" />
      <img
        src="/templates/emerald-palace/ornaments/kolam-corner-ornament.png"
        alt="Traditional Corner Kolam Linework"
        className={`pointer-events-none select-none object-contain ${className}`}
        style={style}
        loading="lazy"
      />
    </picture>
  );
}

export function TraditionalBotanicalVine({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/templates/emerald-palace/ornaments/botanical-vine.png"
      alt="Traditional Hand-Drawn Botanical Vine"
      className={`pointer-events-none select-none object-contain ${className}`}
      style={style}
    />
  );
}

export function TraditionalAuspiciousMotif({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/templates/emerald-palace/ornaments/auspicious-motif.png"
      alt="Sacred Deepam & Kalash Auspicious Motif"
      className={`pointer-events-none select-none object-contain ${className}`}
      style={style}
    />
  );
}

