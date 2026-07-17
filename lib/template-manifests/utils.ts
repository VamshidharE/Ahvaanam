import { getManifest } from "./index";
import { TemplateManifest } from "./types";

/**
 * Merges user-provided custom settings with the defaults declared in the template manifest blueprint.
 * Ensures missing fields fall back to safe default presets.
 *
 * @param templateId The unique template string (e.g. 'royal-temple').
 * @param config User-supplied dynamic configuration details.
 * @returns Fully populated config records falling back to layout defaults.
 */
export function mergeManifestDefaults(templateId: string, config: Record<string, any>): Record<string, any> {
  const manifest = getManifest(templateId);
  if (!manifest) return config;

  return {
    ...manifest.defaults.config,
    ...config
  };
}

/**
 * Validates a TemplateManifest structure to ensure all required fields, editor navigation routes,
 * and default properties have been populated.
 *
 * @param manifest The target manifest object.
 * @returns Boolean representing validation success.
 */
export function validateManifest(manifest: any): manifest is TemplateManifest {
  if (!manifest || typeof manifest !== "object") return false;

  const hasRequiredRootFields =
    typeof manifest.id === "string" &&
    typeof manifest.templateId === "string" &&
    typeof manifest.category === "string" &&
    typeof manifest.version === "string" &&
    typeof manifest.description === "string" &&
    manifest.editor &&
    manifest.features &&
    manifest.defaults;

  if (!hasRequiredRootFields) return false;

  const hasRequiredEditorFields =
    Array.isArray(manifest.editor.sections) &&
    Array.isArray(manifest.editor.navigation) &&
    Array.isArray(manifest.editor.defaultExpanded) &&
    Array.isArray(manifest.editor.displayOrder);

  return hasRequiredEditorFields;
}
