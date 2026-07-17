import { LayoutDefinition } from "./types";

const LAYOUTS: Record<string, LayoutDefinition> = {
  // --- HERO LAYOUTS ---
  "hero-base": {
    id: "hero-base",
    name: "Hero Base",
    sectionType: "hero",
    styles: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingMobile: "3rem 1.5rem",
      paddingDesktop: "6rem 4rem",
      gap: "1.5rem",
      minHeight: "80vh",
    },
  },
  "hero-center": {
    id: "hero-center",
    name: "Hero Center",
    baseId: "hero-base",
    sectionType: "hero",
    styles: {
      alignItems: "center",
      minHeight: "85vh",
    },
  },
  "hero-split": {
    id: "hero-split",
    name: "Hero Split",
    baseId: "hero-base",
    sectionType: "hero",
    styles: {
      display: "grid",
      columnsDesktop: 2,
      flexDirection: "row", // fallbacks mobile
      alignItems: "center",
      gap: "3rem",
    },
  },
  "hero-fullscreen": {
    id: "hero-fullscreen",
    name: "Hero Fullscreen",
    baseId: "hero-base",
    sectionType: "hero",
    styles: {
      minHeight: "100vh",
      paddingMobile: "4rem 2rem",
      paddingDesktop: "8rem 6rem",
    },
  },

  // --- STORY LAYOUTS ---
  "story-stack": {
    id: "story-stack",
    name: "Story Stack",
    sectionType: "story",
    styles: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2rem",
      paddingMobile: "4rem 1.5rem",
      paddingDesktop: "6rem 3rem",
    },
  },

  // --- EVENTS TIMELINE LAYOUTS ---
  "timeline-vertical": {
    id: "timeline-vertical",
    name: "Timeline Vertical",
    sectionType: "events",
    styles: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2.5rem",
      paddingMobile: "4rem 1.5rem",
      paddingDesktop: "6rem 3rem",
    },
  },

  // --- GALLERY LAYOUTS ---
  "gallery-grid": {
    id: "gallery-grid",
    name: "Gallery Grid",
    sectionType: "gallery",
    styles: {
      display: "grid",
      columnsDesktop: 3,
      gap: "1.5rem",
      paddingMobile: "4rem 1.5rem",
      paddingDesktop: "6rem 3rem",
    },
  },
  "gallery-masonry": {
    id: "gallery-masonry",
    name: "Gallery Masonry",
    sectionType: "gallery",
    styles: {
      display: "grid",
      columnsDesktop: 4,
      gap: "1rem",
      paddingMobile: "3rem 1rem",
      paddingDesktop: "5rem 2rem",
    },
  },

  // --- VENUE MAPS LAYOUTS ---
  "venue-card": {
    id: "venue-card",
    name: "Venue Card Layout",
    sectionType: "venue",
    styles: {
      display: "grid",
      columnsDesktop: 2,
      gap: "2rem",
      alignItems: "center",
      paddingMobile: "4rem 1.5rem",
      paddingDesktop: "6rem 3rem",
    },
  },

  // --- FOOTER LAYOUTS ---
  "footer-simple": {
    id: "footer-simple",
    name: "Footer Simple",
    sectionType: "footer",
    styles: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      paddingMobile: "2rem 1rem",
      paddingDesktop: "3rem 1.5rem",
    },
  },
};

export function getLayout(id: string): LayoutDefinition | null {
  const layout = LAYOUTS[id];
  if (!layout) return null;

  // Implement Layout inheritance resolving:
  if (layout.baseId) {
    const base = getLayout(layout.baseId);
    if (base) {
      return {
        ...base,
        ...layout,
        styles: {
          ...base.styles,
          ...layout.styles,
        },
      };
    }
  }
  return layout;
}

export function listLayoutsForSection(sectionType: string): LayoutDefinition[] {
  return Object.values(LAYOUTS).filter((l) => l.sectionType === sectionType);
}
