export interface ThemeTokens {
  id: string;
  name: string;
  backgroundImage: string;
  openingEffect: "gate-fold" | "envelope-unfold" | "scroll-roll" | "fade-reveal";
  colors: {
    background: string;
    text: string;
    accent: string;
    border: string;
    secondaryText: string;
    cardBg: string;
  };
  typography: {
    fontHeading: string;
    fontBody: string;
  };
  radius: {
    card: string;
    button: string;
  };
  shadows: {
    card: string;
    button: string;
  };
  gradients: {
    backdrop: string;
  };
  glass: {
    background: string;
    blur: string;
  };
}

const THEMES: Record<string, ThemeTokens> = {
  "royal-temple": {
    id: "royal-temple",
    name: "Royal Temple",
    backgroundImage: "/images/themes/royal-temple.jpg",
    openingEffect: "gate-fold",
    colors: {
      background: "#3A080A",
      text: "#FFF7E6",
      accent: "#E6A817",
      border: "rgba(230, 168, 23, 0.4)",
      secondaryText: "rgba(255, 247, 230, 0.8)",
      cardBg: "rgba(42, 4, 6, 0.85)", // Rich dark crimson paper/card
    },
    typography: {
      fontHeading: "var(--font-cinzel), Cinzel, serif",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "16px",
      button: "8px",
    },
    shadows: {
      card: "0 10px 30px rgba(0,0,0,0.65)",
      button: "0 4px 14px rgba(230, 168, 23, 0.4)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(84, 13, 18, 0.1) 0%, rgba(42, 4, 6, 0.5) 100%)",
    },
    glass: {
      background: "rgba(230, 168, 23, 0.05)",
      blur: "6px",
    },
  },
  "floral-garden": {
    id: "floral-garden",
    name: "Floral Garland",
    backgroundImage: "/images/themes/floral-garden.jpg",
    openingEffect: "envelope-unfold",
    colors: {
      background: "#FAF6F0",
      text: "#802030", // Forest green headers replaced with elegant crimson
      accent: "#D68C7A",
      border: "rgba(214, 140, 122, 0.3)",
      secondaryText: "rgba(47, 74, 62, 0.85)",
      cardBg: "rgba(255, 253, 248, 0.95)", // Elegant textured white paper card
    },
    typography: {
      fontHeading: "var(--great), Great Vibes, cursive",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "28px",
      button: "20px",
    },
    shadows: {
      card: "0 10px 30px rgba(47, 74, 62, 0.06)",
      button: "0 4px 14px rgba(214, 140, 122, 0.3)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(252, 250, 247, 0.05) 0%, rgba(250, 246, 240, 0.2) 100%)",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.8)",
      blur: "12px",
    },
  },
  "south-indian": {
    id: "south-indian",
    name: "Traditional South Indian",
    backgroundImage: "/images/themes/south-indian.jpg",
    openingEffect: "scroll-roll",
    colors: {
      background: "#5C061F",
      text: "#FFFDF2",
      accent: "#F2BB16",
      border: "rgba(92, 130, 78, 0.3)",
      secondaryText: "rgba(61, 3, 19, 0.85)", // Dark text for readability on card
      cardBg: "rgba(255, 253, 242, 0.98)", // Solid warm card paper
    },
    typography: {
      fontHeading: "var(--font-cinzel), Cinzel, serif",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "12px",
      button: "6px",
    },
    shadows: {
      card: "0 15px 35px rgba(0,0,0,0.5)",
      button: "0 4px 14px rgba(242, 187, 22, 0.4)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(122, 10, 44, 0.1) 0%, rgba(61, 3, 19, 0.3) 100%)",
    },
    glass: {
      background: "rgba(242, 187, 22, 0.08)",
      blur: "8px",
    },
  },
  "lotus-serenity": {
    id: "lotus-serenity",
    name: "Lotus & Pastel",
    backgroundImage: "/images/themes/lotus-serenity.jpg",
    openingEffect: "envelope-unfold",
    colors: {
      background: "#F5FAFA",
      text: "#D96C75",
      accent: "#D96C75",
      border: "rgba(217, 108, 117, 0.25)",
      secondaryText: "rgba(30, 59, 59, 0.8)",
      cardBg: "rgba(255, 255, 255, 0.92)", // Solid lotus paper card
    },
    typography: {
      fontHeading: "var(--great), Great Vibes, cursive",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "24px",
      button: "12px",
    },
    shadows: {
      card: "0 10px 30px rgba(30, 59, 59, 0.06)",
      button: "0 4px 14px rgba(217, 108, 117, 0.3)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(237, 247, 247, 0.05) 0%, rgba(227, 239, 239, 0.2) 100%)",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.85)",
      blur: "10px",
    },
  },
  "grand-mandap": {
    id: "grand-mandap",
    name: "Muhurtham Curtain",
    backgroundImage: "/images/themes/grand-mandap.jpg",
    openingEffect: "gate-fold",
    colors: {
      background: "#1C0526",
      text: "#FCE8FF",
      accent: "#D49E17",
      border: "rgba(212, 158, 23, 0.4)",
      secondaryText: "rgba(252, 232, 255, 0.8)",
      cardBg: "rgba(28, 5, 38, 0.85)", // Deep royal purple card
    },
    typography: {
      fontHeading: "var(--font-cinzel), Cinzel, serif",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "20px",
      button: "10px",
    },
    shadows: {
      card: "0 20px 40px rgba(0,0,0,0.6)",
      button: "0 4px 14px rgba(212, 158, 23, 0.4)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(44, 12, 56, 0.1) 0%, rgba(16, 2, 23, 0.4) 100%)",
    },
    glass: {
      background: "rgba(212, 158, 23, 0.05)",
      blur: "10px",
    },
  },
  "heritage": {
    id: "heritage",
    name: "Jasmine & Greens",
    backgroundImage: "/images/themes/heritage.jpg",
    openingEffect: "fade-reveal",
    colors: {
      background: "#211512",
      text: "#211512", // Dark sepia text on card
      accent: "#5C824E",
      border: "rgba(92, 130, 78, 0.35)",
      secondaryText: "rgba(33, 21, 18, 0.85)",
      cardBg: "rgba(255, 255, 255, 0.98)", // Plain white textured paper
    },
    typography: {
      fontHeading: "var(--font-cinzel), Cinzel, serif",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "16px",
      button: "8px",
    },
    shadows: {
      card: "0 15px 35px rgba(0,0,0,0.7)",
      button: "0 4px 12px rgba(92, 130, 78, 0.4)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(48, 32, 27, 0.05) 0%, rgba(22, 13, 11, 0.3) 100%)",
    },
    glass: {
      background: "rgba(92, 130, 78, 0.05)",
      blur: "8px",
    },
  },
  "palace-luxury": {
    id: "palace-luxury",
    name: "Rose Garden",
    backgroundImage: "/images/themes/palace-luxury.jpg",
    openingEffect: "envelope-unfold",
    colors: {
      background: "#FFF2F5",
      text: "#4D1F2B",
      accent: "#C25D74",
      border: "rgba(194, 93, 116, 0.25)",
      secondaryText: "rgba(77, 31, 43, 0.85)",
      cardBg: "rgba(255, 255, 255, 0.95)", // Elegant pink-tinted paper card
    },
    typography: {
      fontHeading: "var(--font-cinzel), Cinzel, serif",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "24px",
      button: "12px",
    },
    shadows: {
      card: "0 10px 30px rgba(77, 31, 43, 0.06)",
      button: "0 4px 14px rgba(194, 93, 116, 0.3)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(255, 242, 245, 0.05) 0%, rgba(250, 222, 228, 0.2) 100%)",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.85)",
      blur: "10px",
    },
  },
  "peacock": {
    id: "peacock",
    name: "Peacock & Royal",
    backgroundImage: "/images/themes/peacock.jpg",
    openingEffect: "gate-fold",
    colors: {
      background: "#051D24",
      text: "#E0F2FE",
      accent: "#E2AD19",
      border: "rgba(226, 173, 25, 0.45)",
      secondaryText: "rgba(224, 242, 254, 0.85)",
      cardBg: "rgba(5, 29, 36, 0.85)", // Peacock deep royal card
    },
    typography: {
      fontHeading: "var(--font-cinzel), Cinzel, serif",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "22px",
      button: "10px",
    },
    shadows: {
      card: "0 15px 35px rgba(0,0,0,0.6)",
      button: "0 4px 14px rgba(226, 173, 25, 0.4)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(10, 46, 56, 0.05) 0%, rgba(3, 20, 26, 0.35) 100%)",
    },
    glass: {
      background: "rgba(226, 173, 25, 0.05)",
      blur: "12px",
    },
  },
  "marigold": {
    id: "marigold",
    name: "Marigold Celebration",
    backgroundImage: "/images/themes/marigold.jpg",
    openingEffect: "scroll-roll",
    colors: {
      background: "#FFFDF2",
      text: "#5C3E0E",
      accent: "#E27D16",
      border: "rgba(226, 125, 22, 0.25)",
      secondaryText: "rgba(92, 62, 14, 0.85)",
      cardBg: "rgba(255, 255, 255, 0.98)", // Bright clean marigold card
    },
    typography: {
      fontHeading: "var(--font-cinzel), Cinzel, serif",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "18px",
      button: "8px",
    },
    shadows: {
      card: "0 10px 30px rgba(92, 62, 14, 0.06)",
      button: "0 4px 14px rgba(226, 125, 22, 0.35)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(255, 253, 242, 0.05) 0%, rgba(250, 242, 222, 0.2) 100%)",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.9)",
      blur: "10px",
    },
  },
  "moonlight": {
    id: "moonlight",
    name: "Lotus Pond",
    backgroundImage: "/images/themes/moonlight.jpg",
    openingEffect: "fade-reveal",
    colors: {
      background: "#080B10",
      text: "#ECEFF4",
      accent: "#6BCEFF",
      border: "rgba(107, 206, 255, 0.2)",
      secondaryText: "rgba(236, 239, 244, 0.85)",
      cardBg: "rgba(8, 11, 16, 0.82)", // Transparent water lake overlay
    },
    typography: {
      fontHeading: "var(--font-cinzel), Cinzel, serif",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "24px",
      button: "12px",
    },
    shadows: {
      card: "0 20px 40px rgba(0,0,0,0.8)",
      button: "0 4px 14px rgba(107, 206, 255, 0.4)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(15, 19, 26, 0.05) 0%, rgba(3, 4, 6, 0.35) 100%)",
    },
    glass: {
      background: "rgba(107, 206, 255, 0.04)",
      blur: "15px",
    },
  },
  "azure-serenity": {
    id: "azure-serenity",
    name: "Azure Serenity",
    backgroundImage: "/images/themes/azure-serenity.jpg",
    openingEffect: "fade-reveal",
    colors: {
      background: "#EBF3FB",
      text: "#0F4C81",
      accent: "#3A8ED9",
      border: "rgba(58, 142, 217, 0.25)",
      secondaryText: "rgba(15, 63, 122, 0.75)",
      cardBg: "rgba(255, 255, 255, 0.72)",
    },
    typography: {
      fontHeading: "var(--font-cinzel), Cinzel, serif",
      fontBody: "var(--font-inter), Inter, sans-serif",
    },
    radius: {
      card: "24px",
      button: "12px",
    },
    shadows: {
      card: "0 10px 30px rgba(15, 63, 122, 0.08)",
      button: "0 4px 14px rgba(58, 142, 217, 0.3)",
    },
    gradients: {
      backdrop: "linear-gradient(to bottom, rgba(217, 232, 245, 0.15) 0%, rgba(255, 255, 255, 0.5) 100%)",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.65)",
      blur: "12px",
    },
  },
  "rose-mandap": {
    id: "rose-mandap",
    name: "Rose Mandap",
    backgroundImage: "/images/themes/rose-mandap.jpg",
    openingEffect: "envelope-unfold",
    colors: {
      background: "#fbf5e9",
      text: "#63451f",
      accent: "#b8872f",
      border: "rgba(184, 135, 47, 0.35)",
      secondaryText: "#8f641f",
      cardBg: "rgba(255, 250, 241, 0.85)",
    },
    typography: {
      fontHeading: "'Cormorant Garamond', Georgia, serif",
      fontBody: "'Cormorant Garamond', Georgia, serif",
    },
    radius: {
      card: "28px",
      button: "14px",
    },
    shadows: {
      card: "0 10px 30px rgba(99, 69, 31, 0.08)",
      button: "0 4px 14px rgba(184, 135, 47, 0.3)",
    },
    gradients: {
      backdrop: "radial-gradient(ellipse at 50% 8%, rgba(255, 244, 214, 0.34) 0%, rgba(255, 244, 214, 0) 38%)",
    },
    glass: {
      background: "rgba(255, 250, 241, 0.8)",
      blur: "10px",
    },
  },
};

export function getTheme(id: string): ThemeTokens {
  return THEMES[id] || THEMES["royal-temple"];
}

export function listThemes(): ThemeTokens[] {
  return Object.values(THEMES);
}
