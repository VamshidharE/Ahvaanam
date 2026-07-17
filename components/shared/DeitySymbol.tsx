"use client";

import React, { useState } from "react";

interface DeitySymbolProps {
  type?: "god" | "symbol";
  selectedGod?: string;
  selectedSymbol?: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function DeitySymbol({
  type = "symbol",
  selectedGod = "ganesha",
  selectedSymbol = "om",
  size = 60,
  color = "#C59B27",
  className = ""
}: DeitySymbolProps) {
  const [imgError, setImgError] = useState(false);
  const iconSize = `${size}px`;
  
  // Custom color bindings for vectors
  const customColorStyle = { color: color, fill: color };
  const baseClasses = `transition-all flex items-center justify-center select-none ${className}`;

  // 1. RENDER GOD IMAGES (WITH GRACEFUL SVG SILHOUETTE FALLBACK)
  if (type === "god") {
    const godKey = selectedGod.toLowerCase();
    
    // If image hasn't loaded or fails, fall back to our premium golden vector silhouettes
    if (imgError) {
      return renderVectorGod(godKey, iconSize, baseClasses, customColorStyle);
    }

    return (
      <div className={baseClasses} style={{ width: iconSize, height: iconSize }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/deities/${godKey}.png`}
          alt={selectedGod}
          width={size}
          height={size}
          onError={() => setImgError(true)}
          className="object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.45)] hover:scale-105 transition-transform duration-300"
          style={{ width: iconSize, height: iconSize }}
        />
      </div>
    );
  }

  // 2. RENDER TRADITIONAL SYMBOLS
  return renderVectorSymbol(selectedSymbol.toLowerCase(), iconSize, baseClasses, customColorStyle);
}

// --- RENDER VEHICLES & SYMBOLS (OM, SWASTIK, SHREE, KALASH, NANDI) ---
function renderVectorSymbol(symbolKey: string, sizeStr: string, baseClasses: string, colorStyle: React.CSSProperties) {
  const vectorStyle = "drop-shadow-[0_0_6px_rgba(197,155,39,0.4)]";

  switch (symbolKey) {
    case "om":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={colorStyle}>
          <path d="M52 14 C48 14, 46 17, 46 20 C46 24, 50 27, 55 25 C58 24, 61 25, 62 28 C63 31, 60 34, 56 34 L50 34 C46 34, 43 38, 43 42 C43 46, 46 49, 50 49 L58 49 C63 49, 66 53, 64 58 C62 62, 57 64, 52 62 C48 60, 45 61, 43 65 C41 69, 43 74, 47 76 C56 80, 68 76, 72 66 C75 58, 72 49, 65 44 C70 41, 71 33, 67 26 C63 19, 58 14, 52 14 Z" />
          <path d="M43 45 C38 41, 31 41, 26 45 C22 49, 22 55, 26 59 C31 63, 38 63, 43 59 C47 55, 47 49, 43 45 Z M34 54 C32 54, 30 52, 30 50 C30 48, 32 46, 34 46 C36 46, 38 48, 38 50 C38 52, 36 54, 34 54 Z" />
          <path d="M60 22 C64 22, 67 25, 67 29 C67 33, 64 36, 60 36 C56 36, 53 33, 53 29 C53 25, 56 22, 60 22 Z" />
          <path d="M52 35 C52 38, 54 40, 57 40 C60 40, 62 38, 62 35 C62 32, 60 30, 57 30 C54 30, 52 32, 52 35 Z" />
        </svg>
      );
    case "swastik":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={colorStyle}>
          <path d="M50 15 L50 85 M15 50 L85 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <path d="M50 15 L80 15 M50 85 L20 85 M15 50 L15 20 M85 50 L85 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="32" cy="32" r="4.5" />
          <circle cx="68" cy="32" r="4.5" />
          <circle cx="32" cy="68" r="4.5" />
          <circle cx="68" cy="68" r="4.5" />
        </svg>
      );
    case "shree":
    case "shree symbol":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={colorStyle}>
          <path d="M28 25 L72 25 M32 25 L32 75 M46 25 L46 50 C46 50, 52 50, 56 46 C60 42, 60 36, 56 32 C52 28, 44 28, 40 32 M46 45 C46 45, 52 55, 60 70 M58 25 C64 16, 72 25, 64 35" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M68 45 C73 45, 73 55, 68 55 Z" />
          <circle cx="70" cy="32" r="4.5" />
        </svg>
      );
    case "kalash":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={colorStyle}>
          <path d="M35 48 C30 50, 26 57, 26 65 C26 77, 37 85, 50 85 C63 85, 74 77, 74 65 C74 57, 70 50, 65 48 Z" />
          <path d="M32 42 L68 42 C70 42, 71 45, 69 47 L65 52 L35 52 L31 47 C29 45, 30 42, 32 42 Z" />
          <path d="M32 42 L22 28 C21 27, 23 25, 25 26 L38 35 Z" />
          <path d="M68 42 L78 28 C79 27, 77 25, 75 26 L62 35 Z" />
          <path d="M44 42 L50 20 L56 42 Z" />
          <path d="M38 35 C38 25, 50 12, 50 12 C50 12, 62 25, 62 35 Z" />
        </svg>
      );
    case "nandi":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={colorStyle}>
          {/* Detailed Nandi vector profile silhouette */}
          <path d="M15 65 C15 50, 32 40, 48 40 C52 40, 56 42, 60 45 C64 42, 72 38, 76 34 C80 30, 84 25, 84 15 C84 15, 86 28, 80 38 C75 46, 68 50, 62 53 L62 82 C62 82, 50 82, 50 82 L50 56 C46 56, 32 58, 28 62 Z" />
          <path d="M36 28 L22 15 L28 22 Z" />
          <path d="M52 28 L66 15 L60 22 Z" />
          {/* Bell around neck */}
          <circle cx="56" cy="62" r="5" />
          <path d="M56 50 L56 57" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
}

// --- RENDER GOD FALLBACK VECTORS ---
function renderVectorGod(godKey: string, sizeStr: string, baseClasses: string, colorStyle: React.CSSProperties) {
  const vectorStyle = "drop-shadow-[0_0_8px_rgba(212,175,55,0.55)]";
  
  // Custom golden fallback colors for silhouettes
  const goldColorStyle = { color: "#C59B27", fill: "#C59B27" };

  switch (godKey) {
    case "ganesha":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={goldColorStyle}>
          <path d="M50 10 C46 10, 42 13, 40 18 C38 23, 40 28, 43 31 C39 31, 35 34, 33 39 C31 44, 32 50, 36 54 C33 55, 30 58, 28 62 C26 67, 27 73, 31 77 C35 81, 41 82, 46 80 C50 78, 52 73, 52 68 C52 64, 49 61, 45 61 C41 61, 38 64, 38 68 C38 71, 39 73, 41 74 C39 74, 36 73, 34 71 C32 68, 32 64, 34 61 C36 58, 39 56, 42 56 C45 56, 47 58, 48 60 C50 64, 52 67, 55 69 C59 71, 63 71, 67 69 C71 67, 73 63, 73 59 C73 53, 67 49, 61 49 C57 49, 53 51, 50 53 C49 48, 52 43, 56 41 C59 40, 62 41, 64 43 C66 45, 69 45, 71 43 C73 41, 73 38, 71 36 C67 32, 61 31, 55 33 C53 28, 55 23, 58 19 C60 14, 58 10, 50 10 Z" />
          <circle cx="50" cy="30" r="5" />
        </svg>
      );
    case "venkateswara":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={goldColorStyle}>
          <path d="M40 15 L60 15 L57 35 L43 35 Z" />
          <path d="M35 32 L65 32 L62 45 L38 45 Z" />
          <path d="M47 35 L53 35 L51 55 L49 55 Z" />
          <path d="M44 32 L46 32 L48 48 L44 48 Z" />
          <path d="M56 32 L54 32 L52 48 L56 48 Z" />
          <path d="M22 30 C20 30, 18 35, 20 40 C22 45, 27 45, 29 40 Z" />
          <path d="M78 30 C80 30, 82 35, 80 40 C78 45, 73 45, 71 40 Z" />
        </svg>
      );
    case "lakshmi":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={goldColorStyle}>
          {/* Sitting Lakshmi silhouette on Lotus */}
          <path d="M50 15 C45 15, 42 22, 42 28 C42 34, 46 38, 50 38 C54 38, 58 34, 58 28 C58 22, 55 15, 50 15 Z" />
          <path d="M36 45 C32 45, 30 52, 32 60 C34 68, 42 70, 50 70 C58 70, 66 68, 68 60 C70 52, 68 45, 64 45 Z" />
          {/* Lotus base */}
          <path d="M25 70 C35 78, 65 78, 75 70 C70 66, 30 66, 25 70 Z" />
          <path d="M20 45 C15 45, 12 52, 15 60 C18 68, 25 70, 20 45 Z" />
          <path d="M80 45 C85 45, 88 52, 85 60 C82 68, 75 70, 80 45 Z" />
        </svg>
      );
    case "shiva":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={goldColorStyle}>
          {/* Meditating Shiva with crescent moon & trident background */}
          <path d="M50 15 C44 15, 40 20, 40 28 C40 35, 44 40, 50 40 C56 40, 60 35, 60 28 C60 20, 56 15, 50 15 Z" />
          <path d="M30 65 C30 50, 40 45, 50 45 C60 45, 70 50, 70 65 L65 75 L35 75 Z" />
          {/* Trident outline */}
          <path d="M22 25 L25 25 L25 80 L22 80 Z" opacity="0.4" />
          <path d="M20 25 C20 35, 28 35, 28 25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        </svg>
      );
    case "krishna":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={goldColorStyle}>
          {/* Flute playing Krishna silhouette */}
          <path d="M50 15 C44 15, 42 20, 42 28 C42 35, 46 40, 50 40 C54 40, 58 35, 58 28 C58 20, 54 15, 50 15 Z" />
          {/* Flute */}
          <path d="M25 45 L75 42 L75 45 L25 48 Z" />
          <path d="M44 40 C42 45, 40 60, 42 75 C45 78, 55 78, 58 75 C60 60, 58 45, 56 40 Z" />
        </svg>
      );
    case "murugan":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={goldColorStyle}>
          {/* Lord Murugan with Spear (Vel) */}
          <path d="M50 15 C44 15, 42 20, 42 28 C42 35, 46 40, 50 40 C54 40, 58 35, 58 28 C58 20, 54 15, 50 15 Z" />
          <path d="M40 40 C36 45, 34 60, 36 78 C38 82, 62 82, 64 78 C66 60, 64 45, 60 40 Z" />
          {/* Vel (Spear) */}
          <path d="M72 15 L78 28 L74 30 L72 15 Z" />
          <path d="M74 30 L74 85 L72 85 L72 30 Z" />
        </svg>
      );
    case "durga":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={goldColorStyle}>
          {/* Goddess Durga sitting on Lion */}
          <path d="M50 15 C44 15, 42 20, 42 28 C42 35, 46 40, 50 40 C54 40, 58 35, 58 28 C58 20, 54 15, 50 15 Z" />
          <path d="M36 40 C32 45, 30 60, 32 75 C34 78, 66 78, 68 75 C70 60, 68 40, 64 40 Z" />
          {/* Multiple arms representations */}
          <path d="M30 35 C20 35, 15 42, 20 48 M70 35 C80 35, 85 42, 80 48" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M28 28 C15 28, 10 35, 18 42 M72 28 C85 28, 90 35, 82 42" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    case "hanuman":
      return (
        <svg width={sizeStr} height={sizeStr} viewBox="0 0 100 100" className={`${baseClasses} ${vectorStyle}`} style={goldColorStyle}>
          {/* Lord Hanuman kneeling silhouette with Gada (Mace) */}
          <path d="M50 15 C44 15, 42 20, 42 28 C42 35, 46 40, 50 40 C54 40, 58 35, 58 28 C58 20, 54 15, 50 15 Z" />
          <path d="M36 40 C32 45, 30 60, 34 78 L66 78 C70 60, 68 45, 64 40 Z" />
          {/* Gada (Mace) */}
          <path d="M24 35 C20 35, 18 42, 24 48 Z" />
          <path d="M22 48 L22 80 L20 80 L20 48 Z" />
        </svg>
      );
    default:
      return null;
  }
}
