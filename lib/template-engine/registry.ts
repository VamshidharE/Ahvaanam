import { TemplateDefinition } from "./types";
import { roseMandapDefinition } from "@/components/templates/rose-mandap";
import { royalTempleDefinition } from "@/components/templates/royal-temple";
import { emeraldPalaceDefinition } from "@/components/templates/emerald-palace";

/**
 * Internal static registry mapping templateId -> TemplateDefinition.
 */
const TEMPLATE_REGISTRY: Map<string, TemplateDefinition> = new Map();

// Register the production templates
TEMPLATE_REGISTRY.set(roseMandapDefinition.id, roseMandapDefinition);
TEMPLATE_REGISTRY.set(royalTempleDefinition.id, royalTempleDefinition);
TEMPLATE_REGISTRY.set(emeraldPalaceDefinition.id, emeraldPalaceDefinition);

/**
 * Registers a new template definition in the engine.
 */
export function registerTemplate(definition: TemplateDefinition): void {
  if (TEMPLATE_REGISTRY.has(definition.id)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[TemplateEngine] Template "${definition.id}" is already registered. Overwriting with new definition.`);
    }
  }
  TEMPLATE_REGISTRY.set(definition.id, definition);
}

/**
 * Retrieves a template definition by its ID.
 * Returns undefined if no template is found matching the ID.
 */
export function getTemplate(id: string): TemplateDefinition | undefined {
  if (!id) return undefined;
  return TEMPLATE_REGISTRY.get(id);
}

/**
 * Returns all currently registered template definitions.
 */
export function getAllTemplates(): TemplateDefinition[] {
  return Array.from(TEMPLATE_REGISTRY.values());
}

/**
 * Returns all templates for a specific category (e.g. "wedding").
 */
export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  const cat = (category || "").toLowerCase();
  return getAllTemplates().filter((t) => t.category.toLowerCase() === cat);
}

/**
 * Checks whether a template ID exists in the registry.
 */
export function hasTemplate(id: string): boolean {
  if (!id) return false;
  return TEMPLATE_REGISTRY.has(id);
}
