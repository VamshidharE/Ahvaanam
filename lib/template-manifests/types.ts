/**
 * Defines the capabilities and settings of a template.
 * Serves as the blueprint for both editor rendering and theme behavior.
 */
export interface TemplateManifest {
  /** Unique identifier of the manifest itself (typically `manifest_<templateId>`) */
  id: string;
  /** Matches the corresponding Template ID in the registry (e.g., 'royal-temple') */
  templateId: string;
  /** Category of the invitation (e.g., 'wedding', 'birthday', etc.) */
  category: string;
  /** Configuration for rendering the editor panels, fields, and groups dynamically */
  editor: EditorConfiguration;
  /** List of features and capabilities supported by the visual layout of this template */
  features: TemplateFeatures;
  /** Default configuration values that will be used when this template is first initialized */
  defaults: Record<string, any>;
  /** SemVer description of this manifest revision (e.g., '1.0.0') */
  version: string;
  /** Detailed description of the layout goals and target aesthetics */
  description: string;
}

/**
 * Configuration for defining the template editing interface structure.
 * Allows the admin editor to dynamically build navigation tabs and Accordions.
 */
export interface EditorConfiguration {
  /** The specific page sections editable within this template */
  sections: TemplateSection[];
  /** Custom navigation groupings (sidebar tabs) mapped to specific sections */
  navigation: TemplateNavigationItem[];
  /** Section IDs that should be expanded by default when entering the editor */
  defaultExpanded: string[];
  /** Order in which sections are rendered if no customized order is specified */
  displayOrder: string[];
}

/**
 * Definition of an editable invitation layout section.
 */
export interface TemplateSection {
  /** Unique identifier for the section (e.g., 'hero', 'rsvp') */
  id: string;
  /** Human-readable title of the section displayed in the customizer editor panels */
  title: string;
  /** Icon name (e.g., Sliders, Heart, MapPin) used to render the editor tab/button */
  icon: string;
  /** Sorting weight for rendering this section relative to others */
  order: number;
  /** True if the section is enabled on page load by default */
  enabled: boolean;
  /** Nested config properties that can be directly customized inside this section (e.g., ['hero.welcomeMessage', 'hero.title']) */
  editableFields: string[];
  /** Explanatory tooltip or helper caption shown to the editor */
  description?: string;
}

/**
 * Navigation sidebar item representing a tab or panel group in the editor.
 */
export interface TemplateNavigationItem {
  /** ID of the tab (e.g., 'general', 'basics', 'events') */
  id: string;
  /** Display label for the navigation tab */
  label: string;
  /** Lucide-react icon identifier */
  icon: string;
  /** List of section IDs to display under this navigation item */
  sections: string[];
}

/**
 * Capabilities flags describing what the frontend template layout can render.
 * Enables/disables corresponding customization controls.
 */
export interface TemplateFeatures {
  /** Displays photo/video moments (usually mapped to a 'gallery' section) */
  supportsGallery: boolean;
  /** Displays a countdown clock linking to the primary event timestamp */
  supportsCountdown: boolean;
  /** Handles background sound file playing and toggling */
  supportsMusic: boolean;
  /** Displays YouTube/Vimeo/custom video embed player */
  supportsVideo: boolean;
  /** Integrates interactive maps (e.g. Google Maps iframe/embed link) */
  supportsMaps: boolean;
  /** Enables RSVP status collections, questionnaires, or counters */
  supportsRSVP: boolean;
  /** Integrates cash registries or third-party gift lists */
  supportsGiftRegistry: boolean;
  /** Dynamically generates digital check-in check-out QRCodes */
  supportsQRCode: boolean;
  /** Renders visual vertical timelines (e.g., relationship timeline, milestones) */
  supportsTimeline: boolean;
  /** Handles detailed schedules of sub-events and activities */
  supportsSchedule: boolean;
  /** Displays grids or cards dedicated to family members or sponsors */
  supportsFamily: boolean;
  /** Renders long-form narrative texts (e.g., 'our story', 'how we met') */
  supportsStory: boolean;
  /** Renders special grids for commercial partners, corporate sponsors, or organizers */
  supportsSponsors: boolean;
  /** Renders reservation systems, ticket tiers, or check-ins */
  supportsRegistration: boolean;
  /** Includes brand icons, watermarks, or corporate badges in template headers/footers */
  supportsBranding: boolean;
  /** Allows custom style overrides via input textareas (future feature) */
  supportsCustomCSS: boolean;
  /** Tracks visitor actions and clicks for dashboard charts (future feature) */
  supportsAnalytics: boolean;
}
