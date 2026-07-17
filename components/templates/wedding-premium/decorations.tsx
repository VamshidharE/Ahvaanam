import React from "react";

// 1. Ornate Gold Mandala Logo
export const MandalaLogo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 80 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    className={`mx-auto select-none ${className}`}
  >
    <circle cx="50" cy="50" r="45" stroke="#E6A817" strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="50" cy="50" r="38" stroke="#E6A817" strokeWidth="1" />
    <path 
      d="M50 8c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 76c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zM8 50c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm76 0c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" 
      fill="#E6A817" 
    />
    {[...Array(8)].map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x = 50 + 26 * Math.cos(angle);
      const y = 50 + 26 * Math.sin(angle);
      return <circle key={i} cx={x} cy={y} r="2.5" fill="#E6A817" />;
    })}
    <path 
      d="M50 35c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm0 25c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" 
      fill="#E6A817" 
    />
  </svg>
);

// 2. Ganesha deity header symbol
export const GaneshaSymbol: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 90 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="#E6A817" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`mx-auto select-none ${className}`}
  >
    {/* Ears */}
    <path d="M35 35c-5-5-15-2-15 10 0 10 10 12 15 12" />
    <path d="M65 35c5-5 15-2 15 10 0 10-10 12-15 12" />
    {/* Crown / Mukut */}
    <path d="M42 22l8-14 8 14h-16z" fill="#E6A817" opacity="0.15" />
    <path d="M42 22c0-5 3-7 8-7s8 2 8 7" />
    <line x1="50" y1="8" x2="50" y2="15" strokeWidth="2" />
    {/* Head and forehead mark */}
    <path d="M40 35c5-3 15-3 20 0" />
    <path d="M50 25v8M47 28h6" strokeWidth="2" />
    {/* Trunk */}
    <path d="M48 35c2 12-3 22 2 28s12-1 12-10c0-6-4-8-7-8" />
    {/* Modak (sweet) in trunk hand */}
    <circle cx="58" cy="48" r="3" fill="#E6A817" />
    {/* Eyes */}
    <circle cx="43" cy="38" r="1" fill="#E6A817" />
    <circle cx="57" cy="38" r="1" fill="#E6A817" />
  </svg>
);

// 3. Ornate Gold Foil Divider
export const GoldDivider: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center justify-center gap-4 select-none my-6 ${className}`}>
    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#E6A817]" />
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" 
        fill="#E6A817" 
      />
    </svg>
    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#E6A817]" />
  </div>
);

// 4. Swaying Hanging Gold Lamp / Diya
export const HangingLamp: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "", style = {} }) => (
  <svg 
    width="32" 
    height="100" 
    viewBox="0 0 32 100" 
    fill="none" 
    className={`select-none ${className}`}
    style={style}
  >
    {/* Chain */}
    <line x1="16" y1="0" x2="16" y2="70" stroke="#E6A817" strokeWidth="1.5" strokeDasharray="3 3" />
    
    {/* Lamp Body */}
    <path d="M16 70c-6 0-10 4-10 9h20c0-5-4-9-10-9z" fill="#E6A817" />
    <path d="M6 79c0 4 4.5 7 10 7s10-3 10-7H6z" fill="#C59B27" />
    
    {/* Flame */}
    <path 
      d="M16 62c-2 3-2 5 0 8s2-5 0-8z" 
      fill="#FF8800" 
      className="animate-pulse"
      style={{ transformOrigin: "center bottom" }}
    />
    
    {/* Bottom Hanging Bell */}
    <path d="M15 86h2v6h-2z" fill="#E6A817" />
    <circle cx="16" cy="94" r="2.5" fill="#E6A817" />
  </svg>
);
