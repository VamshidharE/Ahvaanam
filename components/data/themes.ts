export interface ThemeMetadata {
  id: string;
  name: string;
  tagline: string;
  description: string;
  colorHex: string; // Representing key color for preview cards
}

export const themes: ThemeMetadata[] = [
  {
    id: "royal-temple",
    name: "Royal Temple",
    tagline: "Maroon & Antique Gold",
    description: "Inspired by temple architecture, brass hanging bells, glowing oil diyas, and warm stone carvings.",
    colorHex: "#58111A",
  },
  {
    id: "floral-garden",
    name: "Floral Garden",
    tagline: "Pastel Pink & Jasmine",
    description: "Dreamy rose gardens, soft jasmine blooms, glassmorphic cards, and delicate falling rose petals.",
    colorHex: "#FFF3F5",
  },
  {
    id: "south-indian",
    name: "South Indian Traditional",
    tagline: "Banana Leaf & Brass Lamp",
    description: "Cultural motifs featuring banana leaf backdrops, sacred Kolam patterns, brass samayis, and mango leaf torans.",
    colorHex: "#1B4D22",
  },
  {
    id: "palace-luxury",
    name: "Palace Luxury",
    tagline: "Velvet Red & Gold Foil",
    description: "Grand palace entrance, opening velvet curtains, shimmering chandeliers, and golden dust showers.",
    colorHex: "#C59B27",
  },
  {
    id: "lotus-serenity",
    name: "Lotus Serenity",
    tagline: "Lotus Pond & Peach Sunrise",
    description: "Calming morning ambiance featuring lotus ponds, floating petals, flying birds, and gentle ripples.",
    colorHex: "#FFD2D7",
  },
  {
    id: "marigold",
    name: "Marigold Celebration",
    tagline: "Festive Orange & Saffron",
    description: "Joyous celebration with dense orange and yellow marigold garlands, light sparklers, and celebratory confetti.",
    colorHex: "#FF8800",
  },
  {
    id: "peacock",
    name: "Peacock Royal",
    tagline: "Teal Blue & Emerald Green",
    description: "Opulent peacock motifs, glowing feathers, gemstone teal gradients, and sapphire sparkles.",
    colorHex: "#004B49",
  },
  {
    id: "heritage",
    name: "Heritage Haveli",
    tagline: "Sandstone & Jharokha",
    description: "Traditional Rajasthani haveli arches, sand textures, Jharokha screens, and warm rays of sunlight.",
    colorHex: "#D87D56",
  },
  {
    id: "moonlight",
    name: "Moonlight Wedding",
    tagline: "Midnight Blue & Stars",
    description: "Mystical starry night skies, glowing crescent moon, floating lanterns, and twinkling fireflies.",
    colorHex: "#0A0915",
  },
  {
    id: "grand-mandap",
    name: "Grand Mandap",
    tagline: "Sacred Fire & Canopy",
    description: "Royal mandap stage with thick flower canopies, brass ornaments, sacred fire, and smoke rises.",
    colorHex: "#8B0000",
  },
];
