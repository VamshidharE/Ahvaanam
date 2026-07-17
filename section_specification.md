# Production-Grade Section Specification — Ahvaanam

A composition-first architecture where the user-facing invitation website is built from semantic, reusable building blocks called **Sections**. 

Templates are compositions of Sections. Categories are groups of Sections. Themes are style overlays for Sections.

---

## 1. What is a Section?

A **Section** is the smallest independent semantic module of layout and functional content. It represents a single, complete block of the vertical invitation timeline (e.g. Hero, Countdown, Venue Map, Timeline, RSVP).

```
┌─────────────────────────────────────────────────────────────┐
│                          SECTION                            │
├─────────────────────────────────────────────────────────────┤
│  * Schema Manifest (ID, fields, styling presets, controls)  │
│  * Internal Composition (Atomic grids, spacers, text)       │
│  * Bound Content (Reads from abstract variables)            │
│  * Slots (Accepts nested helper widgets)                    │
└─────────────────────────────────────────────────────────────┘
```

### Responsibilities
* **DOM Construction**: It translates layout instructions into structural HTML nodes using standard primitives.
* **Property Exposure**: It declares its editable parameters (e.g. text options, toggles) to the platform via a schema.
* **Local Layout Integrity**: It maintains visual balance and padding constraints on both mobile and desktop screens.

### What it Owns
* **Layout Primitives**: The internal node structure, spacers, and alignments.
* **Local States**: Non-persistent interactivity (e.g. toggling accordion items, opening lightboxes).
* **Slots Placement**: Dynamic insertion points for secondary widgets or plugins.

### What it must NEVER Own
* **Database Transactions**: No direct read/write operations to database adapters.
* **Hardcoded Styling Valuations**: No fixed hex codes or absolute font sizes (must use design token keys).
* **Routing or Session Logic**: No navigation controls or authentication state variables.
* **Category Context**: No hardcoded references to weddings or birthdays; values must remain abstract.

---

## 2. The Section Registry & Autodiscovery

The platform manages components through a master **Section Registry**. This decoupling allows creators to register custom blocks without modifying the central page routing code.

### Folder-Based Architecture
Every section is an isolated package located inside `components/sections/<section-id>`:
```
components/sections/hero/
├── manifest.json              # Schema settings and capabilities
└── index.tsx                  # Base layout component renderer
```

### The Registry Contract (`manifest.json`)
The manifest declares structural settings to the editor and renderer:
```json
{
  "id": "hero",
  "name": "Welcome Hero",
  "category": "common",
  "variants": ["classic", "luxury", "minimal"],
  "properties": [
    {
      "key": "showScrollIndicator",
      "label": "Scroll Indicator",
      "type": "boolean",
      "default": true
    }
  ]
}
```

### Discovery Pipeline
During build time, a script runs compile check parsing all `manifest.json` files, writing a single static catalog to [lib/registry/sections.json](file:///c:/Users/Admin/Ahvaanam/lib/registry/sections.json). The platform uses this JSON index to load and map options dynamically.

---

## 3. Section Variants & Inheritance

A Section defines *structure*; a **Variant** defines *aesthetic presets*. 

```
                                  BASE STRUCTURE
                                    (Section)
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
           Classic Variant        Luxury Variant        Minimal Variant
           (Ornate borders)      (Gilded gradients)     (Clean flat shapes)
```

* **Inheritance**: Variants inherit all properties, layout structures, and bindings defined in the base section.
* **Styling Overrides**: The variant configuration modifies CSS token presets. For example, the `Hero` section base structure stays the same, but the `luxury` variant injects font pairings (`Cinzel`) and borders (`double-gold`), while the `minimal` variant loads clean sans-serif layouts.
* **Override Order**:
  ```
  User Custom Override > Theme Override > Variant Preset Override > Base Default
  ```

---

## 4. Section JSON Specification

A section node instance saved in the invitation configuration document is represented by this JSON structure:

```json
{
  "id": "sec_hero_midnight",
  "type": "hero",
  "variant": "luxury",
  "bindings": {
    "title": "hero.title",
    "subtitle": "hero.subtitle",
    "backdropImage": "hero.heroImage",
    "salutation": "hero.subText"
  },
  "properties": {
    "showScrollIndicator": true,
    "overlayOpacity": 0.45,
    "contentAlign": "center",
    "minHeight": "85vh"
  },
  "themeTokens": {
    "background": "--theme-color-backdrop",
    "accent": "--theme-color-accent-gold",
    "fontHeading": "--theme-font-serif-header"
  },
  "motionHooks": {
    "reveal": "fade-in-up",
    "revealSpeed": 1.2,
    "parallaxStrength": 0.35
  },
  "visibility": {
    "enabled": true,
    "hideOn": ["tablet"]
  },
  "pluginSlots": {
    "quickAction": "plugin_calendar_add"
  }
}
```

---

## 5. Section Lifecycle

```
[Registry Setup] ──► [Editor Dynamic Build] ──► [Preview Live Sync] ──► [Save Config] ──► [Guest Render]
```

1. **Autodiscovery**: During build compiling, the system indexes the section manifest.
2. **Editor Load**: When editing an invitation, the Editor loads the section config JSON. It parses properties schemas and renders control panels dynamically.
3. **Workspace Preview**: User adjustments send configuration updates via `postMessage` to the preview iframe. The local renderer updates only that section.
4. **Data Save**: The final composition tree of section nodes is stored in the database config.
5. **Guest Resolution**: A guest opening the link downloads the composition. The Rendering Engine resolves layout nodes and dynamically imports variant code-split bundles.

---

## 6. Data-Driven Editor Integration

The Editor dashboard contains **zero hardcoded forms**. Sidebar settings, color pickers, and text inputs are generated dynamically from the section manifest properties.

```
                  ┌────────────────────────────────────────┐
                  │          Active Section Schema         │
                  └───────────────────┬────────────────────┘
                                      │
                   Inspect Property Types (text, color, bool)
                                      │
                  ┌───────────────────▼────────────────────┐
                  │      Dynamic Controls Generator        │
                  ├────────────────────────────────────────┤
                  │  * color -> Render Canvas Picker       │
                  │  * boolean -> Render iOS Toggle Switch  │
                  │  * text -> Render Text Field Inputs    │
                  └────────────────────────────────────────┘
```

* **Color Pickers**: Generated dynamically for any property declared with `"type": "color"`.
* **Typography Settings**: Mapped to options matching registered font families.
* **Layout Adjustments**: Toggles change structural properties (e.g. `minHeight`, `padding`) by altering local CSS variables.

---

## 7. Section Composition & Nesting

To maintain layout stability on mobile devices, we enforce strict nesting rules:

1. **High-Level Sections (Vertical Containers)**:
   * Vertical layout sections (Hero, FAQ, Timeline) **cannot** be nested inside each other.
2. **Designated Slots**:
   * Sections can contain **Slots** (placeholder layouts).
3. **Nested Atoms**:
   * Atoms (like Buttons, Badges, Countdown clocks) can be inserted into section Slots dynamically.

```
[Section: Hero (Grid Layout)]
  ├── Slot: Banner Media (Accepts background image or video)
  ├── Slot: Details
  │     ├── Atom: Title Text
  │     └── Atom: Subtitle Text
  └── Slot: CTA Actions
        └── Atom: RSVP Button (Plugin Slot)
```

---

## 8. Cross-Category Reusability

Sections bind to **abstract variable mappings** instead of specific name fields. This allows the same layout section to be shared across categories:

* A **Hero Section** binds to a general variable `"title"`.
* The category configuration resolves this variable path dynamically based on the event:

```
┌─────────────────┬─────────────────────────────────┬─────────────────────────────────┐
│ Category        │ Variable Resolution             │ Output Visual Rendering         │
├─────────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ Wedding         │ "title" => "groom" & "bride"    │ "Karthik & Anusha"              │
│ Birthday        │ "title" => "celebrant.name"     │ "Rohan's 30th Birthday"         │
│ Corporate       │ "title" => "company" + "event"  │ "Tech Summit 2026"              │
└─────────────────┴─────────────────────────────────┴─────────────────────────────────┘
```

The underlying React structure of the Hero section is identical; only the data binding changes.

---

## 9. Performance & Loading Optimization

* **Dynamic Code Splitting**: Primitives and variant styles are loaded lazily. If an invitation only uses 4 sections, the browser loads files for those 4 sections, avoiding downloading unused components.
* **Incremental Hydration**: Structural elements are rendered as static HTML (Server Components). Interactive elements (such as maps, RSVPs, or music players) are hydrated dynamically on client mount.
* **CSS-Native Transitions**: Animations rely on GPU-bound CSS transitions (`opacity`, `transform`) to keep scrolling smooth on mobile devices.

---

## 10. Future Compatibility Extensions

### 🤖 AI Invitation Generator
* The AI engine does not generate raw HTML. It outputs a composition JSON containing section IDs, variants, and copy bindings. The rendering engine parses the JSON and loads the layout instantly.

### 🏪 Template Marketplace
* Independent creators can bundle variant CSS styling and custom SVG assets into a section folder. Since sections are sandboxed by manifests, they can be uploaded and rendered securely.

### 🔄 State History (Undo / Redo / Live Sync)
* Since the entire page state is represented by a clean list of section configurations, Undo/Redo is simply a client-side array push/pop operation, making it ready for real-time multiplayer editing (Notion style).
