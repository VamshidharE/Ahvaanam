/**
 * Represents the definition of an input field within an invitation category.
 * Used for dynamically generating form fields and validating values.
 */
export interface FieldDefinition {
  /** The unique key identifying the field path in the configuration JSON (e.g. "couple.groom.name"). */
  key: string;
  
  /** The human-readable label displayed in the user interface. */
  label: string;
  
  /** The placeholder hint text for form inputs. */
  placeholder: string;
  
  /** The input element control type. */
  type: "text" | "number" | "date" | "time" | "textarea";
  
  /** Whether the field is mandatory for creating/publishing the invitation. */
  required: boolean;
  
  /** Logical section grouping for input layout (e.g. "basics", "event_details"). */
  group: "basics" | "event_details" | "hosts" | "additional";
  
  /** Optional helpful tooltip or subtext describing the field's purpose. */
  description?: string;
}

/**
 * Defines a specific category of digital invitation (e.g. Wedding, Birthday).
 * Dictates metadata rules, layout features, and custom wizard inputs.
 */
export interface CategoryDefinition {
  /** Unique category identifier matching the route database key (e.g. "wedding"). */
  id: string;
  
  /** Capitalized localized display name. */
  name: string;
  
  /** The icon name representing this category. */
  icon: string;
  
  /** Description of what this category covers. */
  description: string;
  
  /** Tells if this category features a couple (Groom & Bride) or a singular honoree/host. */
  supportsCouple: boolean;
  
  /** Collection of specific fields required to generate this invitation category. */
  fields: FieldDefinition[];
  
  /** The default template folder or grouping name this category falls under. */
  templateCategory: string;
}
