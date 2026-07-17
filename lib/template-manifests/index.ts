import { TEMPLATE_MANIFEST_REGISTRY } from "./registry";
import { TemplateManifest, TemplateSection, TemplateFeatures } from "./types";

/**
 * Retrieves the complete configuration manifest associated with a specific template layout.
 *
 * @param templateId The unique layout string identifier (e.g., 'royal-temple').
 * @returns The TemplateManifest object if registered, or undefined.
 */
export function getManifest(templateId: string): TemplateManifest | undefined {
  return TEMPLATE_MANIFEST_REGISTRY.find((m) => m.templateId === templateId);
}

/**
 * Asserts whether a manifest config file has been registered for the requested template identifier.
 *
 * @param templateId The layout identifier (e.g., 'royal-temple').
 * @returns True if a matching manifest exists in the registry.
 */
export function manifestExists(templateId: string): boolean {
  return TEMPLATE_MANIFEST_REGISTRY.some((m) => m.templateId === templateId);
}

/**
 * Queries the list of layout panels and section groups supported by the template.
 *
 * @param templateId The layout identifier (e.g., 'royal-temple').
 * @returns List of TemplateSection configurations, or empty array if not registered.
 */
export function getTemplateSections(templateId: string): TemplateSection[] {
  const manifest = getManifest(templateId);
  return manifest?.editor.sections || [];
}

/**
 * Retrieves capability flag checks mapping which modules (e.g., countdown, RSVP) are active.
 *
 * @param templateId The layout identifier (e.g., 'royal-temple').
 * @returns Feature flags representing layout rendering capabilities.
 */
export function getTemplateFeatures(templateId: string): TemplateFeatures | undefined {
  const manifest = getManifest(templateId);
  return manifest?.features;
}
