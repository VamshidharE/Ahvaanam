import React from "react";

export function RoyalJharokhaArch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="goldGradArch" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB759" />
          <stop offset="35%" stopColor="#FDEAB2" />
          <stop offset="70%" stopColor="#C59D3F" />
          <stop offset="100%" stopColor="#8C6820" />
        </linearGradient>
        <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C59D3F" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Main Arch Polyfoil Outline */}
      <path
        d="M 0,240 L 0,60 Q 60,60 120,40 Q 180,20 250,50 Q 320,80 400,10 Q 480,80 550,50 Q 620,20 680,40 Q 740,60 800,60 L 800,240 Z"
        fill="url(#goldGradArch)"
        opacity="0.08"
      />
      
      {/* Arch Decorative Border Curves */}
      <path
        d="M 20,240 L 20,80 C 100,80 160,30 240,60 C 310,85 360,35 400,16 C 440,35 490,85 560,60 C 640,30 700,80 780,80 L 780,240"
        stroke="url(#goldGradArch)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        filter="url(#goldGlow)"
      />

      {/* Inner Scallop Tracery */}
      <path
        d="M 50,240 L 50,95 C 110,95 170,50 240,75 C 300,98 350,55 400,32 C 450,55 500,98 560,75 C 630,50 690,95 750,95 L 750,240"
        stroke="url(#goldGradArch)"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* Top Finial / Kalash Motif at Center Top */}
      <g transform="translate(400, 16)">
        <circle cx="0" cy="-6" r="4" fill="url(#goldGradArch)" />
        <path d="M -8,2 Q 0,-6 8,2 Q 0,10 -8,2 Z" fill="url(#goldGradArch)" />
        <circle cx="0" cy="14" r="2.5" fill="url(#goldGradArch)" />
      </g>

      {/* Left & Right Bracket Ornaments */}
      <circle cx="120" cy="52" r="3" fill="url(#goldGradArch)" />
      <circle cx="240" cy="62" r="3.5" fill="url(#goldGradArch)" />
      <circle cx="560" cy="62" r="3.5" fill="url(#goldGradArch)" />
      <circle cx="680" cy="52" r="3" fill="url(#goldGradArch)" />
    </svg>
  );
}

export function WaxSealCrest({ monogram = "D & M", className = "" }: { monogram?: string; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 160" className="w-28 h-28 drop-shadow-[0_8px_20px_rgba(139,30,47,0.5)]">
        <defs>
          <radialGradient id="waxGrad" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#C43D4E" />
            <stop offset="50%" stopColor="#8B1E2F" />
            <stop offset="85%" stopColor="#5A0F1D" />
            <stop offset="100%" stopColor="#35060F" />
          </radialGradient>
          <linearGradient id="goldEmboss" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2C6" />
            <stop offset="45%" stopColor="#DFB759" />
            <stop offset="80%" stopColor="#9C7723" />
            <stop offset="100%" stopColor="#5E450E" />
          </linearGradient>
          <filter id="waxShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Organic Wax Rim with subtle natural irregular lobes */}
        <path
          d="M 80,12 C 105,10 125,22 138,42 C 152,65 149,95 137,118 C 124,142 98,152 74,148 C 48,144 26,132 17,108 C 8,82 15,54 32,32 C 48,12 62,14 80,12 Z"
          fill="url(#waxGrad)"
          filter="url(#waxShadow)"
        />

        {/* Inner Stamped Ring */}
        <circle cx="80" cy="80" r="54" fill="none" stroke="url(#goldEmboss)" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 2" />
        <circle cx="80" cy="80" r="50" fill="none" stroke="url(#goldEmboss)" strokeWidth="2.2" opacity="0.9" />

        {/* Sacred Sunburst Rays in Stamp */}
        <g stroke="url(#goldEmboss)" strokeWidth="1" opacity="0.4" strokeLinecap="round">
          {[...Array(16)].map((_, i) => (
            <line
              key={i}
              x1={80 + Math.cos((i * Math.PI) / 8) * 44}
              y1={80 + Math.sin((i * Math.PI) / 8) * 44}
              x2={80 + Math.cos((i * Math.PI) / 8) * 48}
              y2={80 + Math.sin((i * Math.PI) / 8) * 48}
            />
          ))}
        </g>

        {/* Crown Top Ornament */}
        <path
          d="M 72,46 L 75,52 L 80,44 L 85,52 L 88,46 L 87,55 L 73,55 Z"
          fill="url(#goldEmboss)"
        />

        {/* Central Monogram Text */}
        <text
          x="80"
          y="87"
          textAnchor="middle"
          fill="url(#goldEmboss)"
          fontSize="17"
          fontFamily="'Cinzel', 'Great Vibes', serif"
          fontWeight="700"
          letterSpacing="1.5"
          filter="drop-shadow(0 1px 2px rgba(0,0,0,0.6))"
        >
          {monogram}
        </text>

        {/* Bottom Flourish */}
        <path
          d="M 68,102 Q 80,98 92,102 Q 80,108 68,102 Z"
          fill="url(#goldEmboss)"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

export function RoyalDivider({ className = "", goldVariant = "standard" }: { className?: string; goldVariant?: "standard" | "emerald" | "light" }) {
  const stroke = goldVariant === "light" ? "#F5E096" : "#DFB759";
  return (
    <div className={`flex items-center justify-center my-6 w-full max-w-lg mx-auto ${className}`}>
      <svg viewBox="0 0 400 32" className="w-full h-8" fill="none">
        <defs>
          <linearGradient id="divGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stroke} stopOpacity="0" />
            <stop offset="35%" stopColor={stroke} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFF3CE" stopOpacity="1" />
            <stop offset="65%" stopColor={stroke} stopOpacity="0.8" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Horizontal Line Left */}
        <line x1="20" y1="16" x2="175" y2="16" stroke="url(#divGrad)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="170" cy="16" r="2" fill={stroke} />

        {/* Center Royal Medallion */}
        <g transform="translate(200, 16)">
          <circle cx="0" cy="0" r="8" fill="none" stroke={stroke} strokeWidth="1.2" />
          <circle cx="0" cy="0" r="4" fill={stroke} />
          {/* Petals */}
          <path d="M 0,-12 C 3,-8 3,-4 0,-4 C -3,-4 -3,-8 0,-12 Z" fill={stroke} />
          <path d="M 0,12 C 3,8 3,4 0,4 C -3,4 -3,8 0,12 Z" fill={stroke} />
          <path d="M -12,0 C -8,3 -4,3 -4,0 C -4,-3 -8,-3 -12,0 Z" fill={stroke} />
          <path d="M 12,0 C 8,3 4,3 4,0 C 4,-3 8,-3 12,0 Z" fill={stroke} />
        </g>

        {/* Horizontal Line Right */}
        <circle cx="230" cy="16" r="2" fill={stroke} />
        <line x1="225" y1="16" x2="380" y2="16" stroke="url(#divGrad)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function RoyalCornerOrnament({ position = "tl", className = "" }: { position?: "tl" | "tr" | "bl" | "br"; className?: string }) {
  const transform = {
    tl: "",
    tr: "scale(-1, 1) translate(-64, 0)",
    bl: "scale(1, -1) translate(0, -64)",
    br: "scale(-1, -1) translate(-64, -64)",
  }[position];

  return (
    <svg viewBox="0 0 64 64" className={`w-12 h-12 ${className}`} fill="none">
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
        <path d="M 16,6 Q 24,16 6,16 Q 16,24 16,6 Z" fill="#C59D3F" opacity="0.8" />
        <circle cx="2" cy="2" r="2" fill="#FFF2C6" />
      </g>
    </svg>
  );
}

export function RoyalDiyaLamp({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 80 60" className="w-14 h-11" fill="none">
        <defs>
          <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7D6" />
            <stop offset="40%" stopColor="#FFAE19" />
            <stop offset="85%" stopColor="#E64A19" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E64A19" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E096" />
            <stop offset="50%" stopColor="#C59D3F" />
            <stop offset="100%" stopColor="#7A5611" />
          </linearGradient>
        </defs>

        {/* Diya Base Urli / Brass Cup */}
        <path
          d="M 16,36 C 24,52 56,52 64,36 C 68,36 72,34 70,30 C 64,30 58,34 40,34 C 22,34 16,30 10,30 C 8,34 12,36 16,36 Z"
          fill="url(#brassGrad)"
          stroke="#DFB759"
          strokeWidth="1"
        />
        {/* Diya Pedestal Stand */}
        <path d="M 34,50 L 30,56 L 50,56 L 46,50 Z" fill="url(#brassGrad)" />

        {/* Animated Flame Pulse */}
        <g className="animate-flame-flicker origin-bottom" style={{ transformOrigin: "40px 30px" }}>
          <circle cx="40" cy="18" r="14" fill="url(#flameGlow)" opacity="0.6" />
          <path
            d="M 40,6 C 35,16 33,22 36,28 C 38,32 42,32 44,28 C 47,22 45,16 40,6 Z"
            fill="#FFF59D"
            filter="drop-shadow(0 0 4px #FF9800)"
          />
          <path
            d="M 40,12 C 37,18 36,22 38,26 C 39,28 41,28 42,26 C 44,22 43,18 40,12 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
}

export function VedicGaneshaCrest({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-[0_4px_12px_rgba(223,183,89,0.35)]" fill="none">
        <defs>
          <linearGradient id="ganeshaGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4D0" />
            <stop offset="50%" stopColor="#DFB759" />
            <stop offset="100%" stopColor="#8C6820" />
          </linearGradient>
        </defs>
        {/* Auspicious Tilak & Crown */}
        <path
          d="M 50,8 L 54,20 L 50,23 L 46,20 Z"
          fill="url(#ganeshaGold)"
        />
        <circle cx="50" cy="16" r="1.5" fill="#8B1E2F" />

        {/* Stylized Minimal Ganesha Outline */}
        <path
          d="M 40,24 C 28,24 24,36 32,48 C 36,54 44,58 48,60 C 50,68 47,76 42,80 C 37,84 32,82 30,78"
          stroke="url(#ganeshaGold)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 46,24 C 62,22 72,32 68,46 C 65,58 56,66 52,72 C 50,78 52,84 56,86 C 60,88 64,84 66,78"
          stroke="url(#ganeshaGold)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Modak in trunk */}
        <circle cx="41" cy="80" r="3.5" fill="url(#ganeshaGold)" />
        {/* Right tusk / blessing ear */}
        <path
          d="M 62,34 C 74,34 78,44 72,50"
          stroke="url(#ganeshaGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left ear */}
        <path
          d="M 38,34 C 26,34 22,44 28,50"
          stroke="url(#ganeshaGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
