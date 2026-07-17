import { CategoryDefinition, FieldDefinition } from "./types";
import { CATEGORY_MAP, ALL_CATEGORIES } from "./index";

/**
 * Retrieves the category definition for a given category ID.
 * 
 * @param id The unique identifier of the invitation category (e.g. "wedding").
 * @returns The CategoryDefinition if found, otherwise undefined.
 */
export function getCategory(id: string): CategoryDefinition | undefined {
  return CATEGORY_MAP[id];
}

/**
 * Retrieves the field definitions for a given category ID.
 * Returns an empty array if the category is not found.
 * 
 * @param id The unique identifier of the invitation category.
 * @returns An array of FieldDefinition objects belonging to the category.
 */
export function getCategoryFields(id: string): FieldDefinition[] {
  const category = getCategory(id);
  return category ? category.fields : [];
}

/**
 * Retrieves the unique group names (e.g. "basics", "event_details")
 * used within a given category's field definitions, preserving order of appearance.
 * Returns an empty array if the category is not found.
 * 
 * @param id The unique identifier of the invitation category.
 * @returns An array of unique group names used in the category's fields.
 */
export function getCategoryGroups(id: string): string[] {
  const fields = getCategoryFields(id);
  const groups: string[] = [];
  for (const field of fields) {
    if (!groups.includes(field.group)) {
      groups.push(field.group);
    }
  }
  return groups;
}

/**
 * Retrieves an array of all available category names mapped to their IDs.
 * Useful for building dropdowns, navigation lists, or wizard category selection.
 * 
 * @returns An array of objects containing the id and name of each category.
 */
export function getCategoryNames(): { id: string; name: string }[] {
  return ALL_CATEGORIES.map(category => ({
    id: category.id,
    name: category.name,
  }));
}

/**
 * Checks whether a category with the specified ID is supported by the system.
 * 
 * @param id The category identifier to check.
 * @returns True if the category exists, false otherwise.
 */
export function categoryExists(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(CATEGORY_MAP, id);
}
