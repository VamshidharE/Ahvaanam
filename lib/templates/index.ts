import { TEMPLATE_REGISTRY } from "./registry";
import { TemplateMetadata } from "./types";

/**
 * Returns all registered template metadata objects.
 */
export function getTemplates(): TemplateMetadata[] {
  return TEMPLATE_REGISTRY;
}

/**
 * Returns registered templates matching a specific category.
 */
export function getTemplatesByCategory(category: string): TemplateMetadata[] {
  return TEMPLATE_REGISTRY.filter((t) => t.category === category && t.enabled !== false);
}

/**
 * Returns a template by its unique ID with graceful fallback for aliases and legacy identifiers.
 */
export function getTemplate(id: string): TemplateMetadata | undefined {
  if (!id) return undefined;
  const directMatch = TEMPLATE_REGISTRY.find((t) => t.id === id);
  if (directMatch) return directMatch;

  // Fallback for lotus-mandap variants / aliases
  if (id === "emerald-palace" || id === "lotus_mandap" || id === "sacred_courtyard") {
    return TEMPLATE_REGISTRY.find((t) => t.id === "lotus-mandapam") || TEMPLATE_REGISTRY.find((t) => t.id === "lotus-mandap");
  }

  // Graceful fallback for any previously created invitations using legacy themes
  return TEMPLATE_REGISTRY.find((t) => t.id === "royal-temple");
}

/**
 * Returns true if a template with the given ID exists in the registry.
 */
export function templateExists(id: string): boolean {
  return TEMPLATE_REGISTRY.some((t) => t.id === id);
}
