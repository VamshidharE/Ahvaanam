import { getAdminDb } from "@/lib/db";

export interface DemoShowcaseItem {
  slug: string;
  templateId: string;
  name: string;
  description: string;
  category: string;
  is_published: boolean;
  updated_at?: string;
}

export const OFFICIAL_DEMO_DEFINITIONS: Record<string, Omit<DemoShowcaseItem, "is_published">> = {
  "pelli-pandiri": {
    slug: "pelli-pandiri",
    templateId: "pelli-pandiri",
    name: "Pelli Pandiri",
    description: "A grand traditional Telugu wedding invitation with temple entrance arch, sunset sky, 3D butterfly companion, auspicious toranam, and parchment scroll celebration sections.",
    category: "wedding",
  },
  "gopuram": {
    slug: "gopuram",
    templateId: "gopuram",
    name: "Gopuram",
    description: "A majestic Dravidian temple gopuram invitation featuring a towering entrance, rising couple reveal, sunset skies, authentic sacred ambiance, and continuous parchment celebration sections.",
    category: "wedding",
  },
  "rose-mandap": {
    slug: "rose-mandap",
    templateId: "rose-mandap",
    name: "Rose Mandap",
    description: "Royal mandap architecture, hanging brass bells, couple artwork, falling petals, and live wedding procession animation.",
    category: "wedding",
  },
  "lotus-mandap": {
    slug: "lotus-mandap",
    templateId: "lotus-mandapam",
    name: "Lotus Mandap",
    description: "A cinematic South Indian wedding invitation inspired by traditional temple architecture, lotus ponds and golden sunset scenery.",
    category: "wedding",
  },
};

export const SUPPORTED_DEMO_SLUGS = Object.keys(OFFICIAL_DEMO_DEFINITIONS);

// In-memory fallback state (persists across warm requests when DB table is not yet migrated)
const memoryState: Record<string, boolean> = {
  "pelli-pandiri": true,
  "gopuram": true,
  "rose-mandap": true,
  "lotus-mandap": true,
};

/**
 * Retrieves a single demo showcase configuration by its public slug.
 * Returns null if the slug is unknown or unsupported.
 */
export async function getDemoShowcase(slug: string): Promise<DemoShowcaseItem | null> {
  const normalizedSlug = (slug || "").toLowerCase().trim();
  const definition = OFFICIAL_DEMO_DEFINITIONS[normalizedSlug];
  if (!definition) {
    return null;
  }

  let isPublished = memoryState[normalizedSlug] ?? true;
  let updatedAt: string | undefined = undefined;

  try {
    const db = getAdminDb();
    if (db) {
      const { data, error } = await db
        .from("demo_showcases")
        .select("is_published, updated_at")
        .eq("slug", normalizedSlug)
        .maybeSingle();

      if (!error && data) {
        isPublished = Boolean(data.is_published);
        updatedAt = data.updated_at;
        memoryState[normalizedSlug] = isPublished;
      }
    }
  } catch (err) {
    // Graceful fallback to in-memory state
  }

  return {
    ...definition,
    is_published: isPublished,
    updated_at: updatedAt,
  };
}

/**
 * Retrieves all 4 official demo showcases with their publication status.
 */
export async function getAllDemoShowcases(): Promise<DemoShowcaseItem[]> {
  const results: Record<string, DemoShowcaseItem> = {};

  // Initialize with standard definitions
  for (const slug of SUPPORTED_DEMO_SLUGS) {
    const def = OFFICIAL_DEMO_DEFINITIONS[slug];
    results[slug] = {
      ...def,
      is_published: memoryState[slug] ?? true,
    };
  }

  try {
    const db = getAdminDb();
    if (db) {
      const { data, error } = await db
        .from("demo_showcases")
        .select("slug, is_published, updated_at");

      if (!error && Array.isArray(data)) {
        for (const row of data) {
          if (results[row.slug]) {
            const isPub = Boolean(row.is_published);
            results[row.slug].is_published = isPub;
            results[row.slug].updated_at = row.updated_at;
            memoryState[row.slug] = isPub;
          }
        }
      }
    }
  } catch (err) {
    // Fall back to memoryState
  }

  return SUPPORTED_DEMO_SLUGS.map((slug) => results[slug]);
}

/**
 * Updates the publication status of a demo showcase item.
 * Strictly used by authorized admin endpoints.
 */
export async function updateDemoShowcaseStatus(
  slug: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
  const normalizedSlug = (slug || "").toLowerCase().trim();
  const definition = OFFICIAL_DEMO_DEFINITIONS[normalizedSlug];
  if (!definition) {
    return { success: false, error: `Invalid demo slug: "${slug}"` };
  }

  memoryState[normalizedSlug] = isPublished;

  try {
    const db = getAdminDb();
    if (db) {
      const { error } = await db
        .from("demo_showcases")
        .upsert(
          {
            slug: normalizedSlug,
            template_id: definition.templateId,
            name: definition.name,
            description: definition.description,
            is_published: isPublished,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "slug" }
        );

      if (error) {
        console.warn("[DemoService] DB upsert warning (falling back to memory):", error.message);
      }
    }
    return { success: true };
  } catch (err: any) {
    console.error("[DemoService] Update error:", err);
    return { success: true }; // memoryState was still updated
  }
}
