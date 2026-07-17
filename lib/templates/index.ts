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
 * Returns a template by its unique ID.
 */
export function getTemplate(id: string): TemplateMetadata | undefined {
  return TEMPLATE_REGISTRY.find((t) => t.id === id);
}

/**
 * Returns true if a template with the given ID exists in the registry.
 */
export function templateExists(id: string): boolean {
  return TEMPLATE_REGISTRY.some((t) => t.id === id);
}
