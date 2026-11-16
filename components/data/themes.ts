export interface ThemeMetadata {
  id: string;
  name: string;
  tagline: string;
  description: string;
  colorHex: string; // Representing key color for preview cards
}

export const themes: ThemeMetadata[] = [
  {
    id: "rose-mandap",
    name: "Rose Mandap",
    tagline: "Imperial Red & Golden Procession",
    description: "Royal mandap architecture, hanging brass bells, couple artwork, falling petals, and live wedding procession animation.",
    colorHex: "#8B1E2D",
  },
  {
    id: "pelli-pandiri",
    name: "Pelli Pandiri",
    tagline: "Sunset Toranam & 3D Butterfly",
    description: "A grand traditional Telugu wedding invitation with temple entrance arch, sunset sky, 3D butterfly companion, and toranam.",
    colorHex: "#B85D19",
  },
  {
    id: "gopuram",
    name: "Gopuram",
    tagline: "Dravidian Temple & Sacred Gopuram",
    description: "A majestic Dravidian temple gopuram invitation featuring towering gopuram entrance, rising couple reveal, and sacred Vedic ambiance.",
    colorHex: "#8C4820",
  },
  {
    id: "lotus-mandap",
    name: "Lotus Mandap",
    tagline: "Lotus Pond & Temple Sunset",
    description: "A cinematic South Indian wedding invitation inspired by traditional temple architecture, lotus ponds and golden sunset scenery.",
    colorHex: "#5B2333",
  },
  {
    id: "lotus-mandapam",
    name: "Lotus Mandapam",
    tagline: "Lotus Pond & Temple Sunset",
    description: "A cinematic South Indian wedding invitation inspired by traditional temple architecture, lotus ponds and golden sunset scenery.",
    colorHex: "#5B2333",
  },
  {
    id: "sacred-courtyard",
    name: "The Sacred Courtyard",
    tagline: "Ivory Courtyard & Traditional Kolam",
    description: "A cinematic South Indian wedding invitation inspired by traditional temple architecture, lotus ponds and golden sunset scenery.",
    colorHex: "#4A1E29",
  },
  {
    id: "royal-temple",
    name: "Royal Temple Layout",
    tagline: "Maroon & Antique Gold",
    description: "Inspired by temple architecture, brass hanging bells, glowing oil diyas, and warm stone carvings.",
    colorHex: "#58111A",
  },
];
