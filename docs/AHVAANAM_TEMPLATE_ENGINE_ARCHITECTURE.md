# Ahvaanam Invitation Template Engine — Architecture Blueprint

> **Document Version:** 1.0.0  
> **Status:** Approved Foundation Blueprint  
> **Target System:** Ahvaanam Digital Invitation Platform  

---

## 1. Current Architecture Findings

An exhaustive code audit of the Ahvaanam codebase reveals a fractured, two-tier rendering architecture:

1. **The Isolated Template (`rose-mandap`):**
   * Stored under `components/templates/rose-mandap/`.
   * Has a complete, independent component hierarchy: dedicated hero elements ([FallingPetals](file:///c:/Users/Admin/Ahvaanam/components/templates/rose-mandap/hero/FallingPetals.tsx), [FloatingLights](file:///c:/Users/Admin/Ahvaanam/components/templates/rose-mandap/hero/FloatingLights.tsx), [WeddingScene](file:///c:/Users/Admin/Ahvaanam/components/templates/rose-mandap/hero/WeddingScene.tsx)), 11 dedicated section components, and custom CSS ([rose-mandap.css](file:///c:/Users/Admin/Ahvaanam/components/templates/rose-mandap/styles/rose-mandap.css)).
   * Receives direct routing in [app/invites/[id]/InviteClient.tsx](file:///c:/Users/Admin/Ahvaanam/app/invites/[id]/InviteClient.tsx#L76-L78).

2. **The Homogenized Shared Base Template (All other 12 themes):**
   * Themes such as `royal-temple`, `floral-garden`, `palace-luxury`, `south-indian`, `lotus-serenity`, `marigold`, `peacock`, `heritage`, `moonlight`, `grand-mandap`, `azure-serenity`, and `wedding-premium` are routed into a single monolithic component: [components/templates/shared/BaseWeddingTemplate.tsx](file:///c:/Users/Admin/Ahvaanam/components/templates/shared/BaseWeddingTemplate.tsx).
   * Theme differences are reduced strictly to color and font token values resolved from [lib/theme/registry.ts](file:///c:/Users/Admin/Ahvaanam/lib/theme/registry.ts).
   * All templates are forced into an identical single-column stack of `<SectionCard>` wrappers.

---

## 2. Problems with Current Architecture

| Problem | Root Cause in Existing Code | Consequence |
| :--- | :--- | :--- |
| **Showcase JPG used as live background** | `lib/theme/registry.ts` sets `backgroundImage: "/images/themes/<theme>.jpg"` | Catalog thumbnail screenshots are stretched with 30% opacity across live invitations behind a generic card stack. |
| **Loss of distinct layout identities** | `app/invites/[id]/InviteClient.tsx` routes all non-Rose themes into `BaseWeddingTemplate.tsx` | All 12 templates share the exact same DOM structure, card wrappers, and layout hierarchy regardless of cultural theme. |
| **Loss of template-specific animations** | Animations in `BaseWeddingTemplate.tsx` are hardcoded to a single `y: 25 -> 0` fade | Gate-fold doors, velvet curtain openings, swaying lamps, torans, and temple bells defined in metadata never execute. |
| **Monolithic coupling** | Visual layout, data adapter, audio controls, and opening envelope are merged into one 650-line file | Adding or editing a single template requires modifying the shared renderer, risking regressions across all other themes. |
| **Fragmented theme metadata** | 5 distinct registries define theme properties: `lib/theme/registry.ts`, `lib/templates/registry.ts`, `lib/template-manifests/registry.ts`, `data/themes/themes.ts`, `components/data/themes.ts` | High risk of configuration drift, broken paths, and desynchronized metadata across editor and runtime. |

---

## 3. New Architecture Principles

1. **Total Template Autonomy:**
   * Every template is a self-contained, first-class implementation. A template has 100% control over its DOM structure, layout, typography, decorative layer positioning, responsive breakpoints, animations, and CSS.
2. **Strict Inversion of Control:**
   * The platform never dictates how a template renders its sections. The platform passes structured data into the template; the template decides how to visually present it.
3. **No Monolithic Shared Templates:**
   * `BaseWeddingTemplate.tsx` will be eliminated. No shared component will ever wrap all templates in a predefined visual layout.
4. **Primitives vs. Sections Separation:**
   * Shared code is restricted to **atomic design primitives** (e.g., `<Button>`, `<CountdownTimer>`, `<GalleryLightbox>`, `<AudioPlayer>`).
   * Templates compose these primitives into **template-specific sections** (e.g., `<RoyalTempleHero>`, `<FloralGardenGallery>`).
5. **Clean Asset Decoupling:**
   * Marketplace preview images (`thumbnail`, `showcase`) are strictly separated from live render assets (`backgroundLayer`, `decorations`, `audio`).

---

## 4. Invitation Data Boundary

The platform stores invitation configuration as JSON in the database (`invitations.config`). Templates must consume data through a strongly typed, read-only contract.

### Data Contract (`InvitationData`)
```typescript
export interface InvitationData {
  id: string;
  category: "wedding" | "engagement" | "birthday" | "housewarming" | "babyshower" | "halfsaree" | "retirement" | "corporate";
  themeId: string;
  themeVersion?: string;
  
  // Couple / Host Details
  couple: {
    primarySide: "groom" | "bride";
    groom: {
      name: string;
      surname?: string;
      parents?: string;
      bio?: string;
      image?: string;
      familyTitle?: string;
    };
    bride: {
      name: string;
      surname?: string;
      parents?: string;
      bio?: string;
      image?: string;
      familyTitle?: string;
    };
  };

  // Ceremonial Introduction
  introduction: {
    mantra?: string;
    eyebrow?: string;
    message?: string;
    familyTitle?: string;
    subText?: string;
  };

  // Schedule & Key Ceremonies
  wedding: {
    date: string;
    time: string;
    venue: string;
    city: string;
    countdownTarget: string;
    mapsLink?: string;
    mapsEmbedUrl?: string;
  };

  // Optional Secondary Venue (Reception)
  reception?: {
    enabled: boolean;
    title: string;
    venue: string;
    city: string;
    date: string;
    time: string;
    mapsLink?: string;
  };

  // Multi-day Event Ceremonies
  events: Array<{
    id: string;
    enabled: boolean;
    title: string;
    date: string;
    time: string;
    venue: string;
    description?: string;
    icon?: string;
    image?: string;
  }>;

  // Family Lineage & Greetings
  family: {
    title: string;
    groomFamilyTitle?: string;
    brideFamilyTitle?: string;
    groomParents?: string;
    brideParents?: string;
    groomPortrait?: string;
    bridePortrait?: string;
    groomFamily: Array<{ relation?: string; name: string }>;
    brideFamily: Array<{ relation?: string; name: string }>;
  };

  // Story & Timeline
  story: {
    enabled: boolean;
    title: string;
    text: string;
    couplePhoto?: string;
    timeline?: Array<{ title: string; date: string; description: string; image?: string }>;
  };

  // Gallery Photos
  gallery: {
    enabled: boolean;
    title: string;
    images: Array<{ src: string; alt?: string; caption?: string }>;
    layoutType?: "masonry" | "carousel" | "grid";
  };

  // RSVP Configuration
  rsvp: {
    enabled: boolean;
    title: string;
    message?: string;
    deadline?: string;
    whatsappNumber?: string;
    whatsappLabel?: string;
    contacts: Array<{ type: string; label: string; value: string }>;
  };

  // Audio & Soundtrack
  music: {
    enabled: boolean;
    themeMusic?: string;
    processionMusic?: string;
    autoplay?: boolean;
  };

  // Section Ordering & Enabled States
  sectionOrder: string[];
  sections: {
    showAnnouncement: boolean;
    showEvents: boolean;
    showProcession: boolean;
    showFamily: boolean;
    showGallery: boolean;
    showVenue: boolean;
    showCountdown: boolean;
    showRSVP: boolean;
    showFooter: boolean;
  };

  // Footer & Credits
  footer: {
    quote?: string;
    designer?: string;
    service?: string;
    location?: string;
    contact?: string;
  };
}
```

---

## 5. New Template Contract

Every template in Ahvaanam implements the `TemplateDefinition` interface:

```typescript
import React from "react";
import { InvitationData } from "./data-contract";

export interface TemplateAssets {
  /** Marketplace catalog thumbnail */
  thumbnail: string;
  /** High-resolution preview image for theme selector modal */
  preview: string;
  /** Background textures / SVG layers (never catalog thumbnails) */
  backgrounds?: {
    main?: string;
    overlay?: string;
    texture?: string;
  };
  /** Audio defaults */
  defaultMusic?: string;
  /** Custom decorative icons, frames, arches */
  decorations?: Record<string, string>;
}

export interface TemplateCapabilities {
  supportsProcessionVideo: boolean;
  supportsMusic: boolean;
  supportsGallery: boolean;
  supportsCountdown: boolean;
  supportsStoryTimeline: boolean;
  supportsFamilyTree: boolean;
  supportsCustomGanesha: boolean;
  supportsInteractiveEnvelope: boolean;
}

export interface TemplateRenderProps {
  data: InvitationData;
  clientId?: string;
  isPreview?: boolean;
  isEmbedded?: boolean;
}

export interface TemplateDefinition {
  /** Unique immutable identifier, e.g. 'rose-mandap', 'royal-temple' */
  id: string;
  /** Human-readable template display name */
  name: string;
  /** Category, e.g. 'wedding', 'birthday' */
  category: "wedding" | "engagement" | "birthday" | "housewarming" | "babyshower" | "halfsaree" | "retirement" | "corporate";
  /** Semantic versioning */
  version: string;
  /** Template description for user catalog */
  description: string;
  /** Cultural/Visual tags */
  tags: string[];
  /** Default capabilities */
  capabilities: TemplateCapabilities;
  /** Asset mapping */
  assets: TemplateAssets;
  /** Default typography and theme tokens */
  tokens: {
    fonts: {
      heading: string;
      body: string;
      accent?: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      mutedText: string;
      border: string;
    };
  };
  /** Default data factory for newly created invitations */
  getDefaultData: () => Partial<InvitationData>;
  /** The React component entry point */
  Component: React.ComponentType<TemplateRenderProps>;
}
```

---

## 6. Registry Design

The registry acts as a lightweight lookup table mapping `templateId` (and optional version) to its `TemplateDefinition`.

```
                        ┌───────────────────────────────┐
                        │       Template Engine         │
                        │       resolveTemplate()       │
                        └───────────────┬───────────────┘
                                        │
                         Lookup by ID:  │  "royal-temple"
                                        ▼
                        ┌───────────────────────────────┐
                        │      TEMPLATE_REGISTRY        │
                        ├───────────────────────────────┤
                        │  "rose-mandap"   ──► Def      │
                        │  "royal-temple"  ──► Def      │
                        │  "floral-garden" ──► Def      │
                        │  "palace-luxury" ──► Def      │
                        │  "south-indian"  ──► Def      │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │   RoyalTempleTemplate.tsx     │
                        │   (Dedicated JSX + Layout)    │
                        └───────────────────────────────┘
```

### Registry API (`template-engine/registry.ts`)
```typescript
import { TemplateDefinition } from "./types";

const REGISTRY: Map<string, TemplateDefinition> = new Map();

export function registerTemplate(definition: TemplateDefinition): void {
  if (REGISTRY.has(definition.id)) {
    console.warn(`Template with id "${definition.id}" is already registered. Overwriting.`);
  }
  REGISTRY.set(definition.id, definition);
}

export function getTemplate(id: string): TemplateDefinition | undefined {
  return REGISTRY.get(id);
}

export function getAllTemplates(): TemplateDefinition[] {
  return Array.from(REGISTRY.values());
}

export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return getAllTemplates().filter((t) => t.category === category);
}
```

---

## 7. Shared Design System (Primitives vs. Sections)

To prevent code duplication without compromising template autonomy, the system divides UI elements into **Primitives** and **Sections**:

```
                              SHARED DESIGN SYSTEM
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
     SHARED PRIMITIVES                                    TEMPLATE SECTIONS
  (Pure, Headless / Reusable)                          (Custom Composition)
  • <AudioPlayer>                                      • <RoseMandapHero>
  • <CountdownTimer>                                   • <RoyalTempleHero>
  • <LightboxGallery>                                  • <FloralGardenStory>
  • <RsvpForm>                                         • <PalaceLuxuryEvents>
  • <MapButton>                                        • <SouthIndianVenue>
  • <SocialShare>                                      • <GrandMandapEnvelope>
```

### 1. Shared Primitives (Reusable, Theme-agnostic):
* **`AudioPlayer`**: Manages HTML5 audio, play/pause state, floating toggle button, and browser autoplay policies.
* **`CountdownTimer`**: Pure countdown logic, calculating days/hours/minutes/seconds with customizable render props.
* **`RsvpForm`**: Standardized RSVP form connected to `/api/invitation/[id]/rsvp`.
* **`MapLink` / `MapEmbed`**: Standardized Google Maps redirection and iframe embedding.
* **`LightboxModal`**: Image expansion and swipe gestures for gallery photos.
* **`ScrollProgress`**: Viewport scroll percentage indicator.

### 2. Template Sections (Unique to each template):
* **Template Hero**: Rose Mandap uses hanging bells and mandap arch; Royal Temple uses stone temple pillars and oil diyas; Floral Garden uses a watercolor floral frame.
* **Template Events**: South Indian uses banana leaf cards; Palace Luxury uses gold foil borders; Moonlight uses translucent dark glassmorphism.

---

## 8. Animation System

The animation system couples a shared Framer Motion utility library with template-specific keyframe definitions:

### 1. Shared Animation Utilities (`design-system/animation/`):
* `useScrollReveal()`: Viewport intersection hook respecting `prefers-reduced-motion`.
* `fadeUpVariants`, `zoomInVariants`, `staggerContainerVariants`: Standardized Framer Motion transition curves.
* `ParallaxLayer`: Smooth scroll-offset calculation for background depth layers.

### 2. Template-Specific Animation Suites:
* **Rose Mandap**: Falling rose petals (`requestAnimationFrame` canvas), swaying brass bells (`CSS keyframes`), wedding procession video reveal.
* **Royal Temple**: Gate-fold opening doors, flickering diya oil lamps, golden light rays.
* **Floral Garden**: Unfolding envelope wax seal, blooming flower animations.
* **Palace Luxury**: Velvet curtain pull-back, shimmering golden dust shower.

---

## 9. Asset System

To permanently prevent catalog showcase images from leaking into invitation backgrounds, assets are categorized into strict directories:

```
public/
├── showcase/                      <── STRICTLY for marketplace & selection cards
│   ├── thumbnails/
│   │   ├── rose-mandap.jpg
│   │   ├── royal-temple.jpg
│   │   └── floral-garden.jpg
│   └── previews/
│       ├── rose-mandap-large.jpg
│       └── royal-temple-large.jpg
│
└── templates/                     <── STRICTLY for live invitation rendering
    ├── rose-mandap/
    │   ├── background.png         <── Clean high-res seamless texture
    │   ├── arch.png
    │   ├── bells/
    │   └── audio/
    ├── royal-temple/
    │   ├── stone-bg.png
    │   ├── pillars-left.png
    │   ├── pillars-right.png
    │   └── diya.png
    └── floral-garden/
        ├── paper-texture.png
        ├── botanical-border.png
        └── petals.png
```

* **Rule:** A file located in `public/showcase/` must **never** be imported or referenced by a live template component.

---

## 10. Responsive System

Mobile is the primary consumption surface for digital invitations (representing >85% of traffic). The template engine mandates mobile-first responsive architecture:

1. **Fluid Typography (`clamp`):**
   * Heading sizes scale smoothly between 320px and 1200px viewports without abrupt breakpoint shifts:
     ```css
     font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
     ```
2. **Aspect-Ratio Defensive Layering:**
   * Decorative hero elements (pillars, arches, torans) use `position: absolute` with percentage bounds and `max-height: 100vh` to prevent overlapping text on short screens.
3. **Touch-Optimized Interaction Targets:**
   * RSVP buttons, audio toggles, and gallery cards have minimum hit dimensions of 48px × 48px.
4. **Performance Guardrails on Mobile:**
   * Canvas particle counts (e.g., petals, dust) automatically reduce by 60% on mobile devices to maintain 60 FPS scrolling.

---

## 11. Versioning System

Published invitations must remain visually stable even when a template is updated.

1. **Explicit Version Declaration:**
   Every `TemplateDefinition` declares a `version` string (e.g., `1.0.0`).
2. **Invitation Version Stamping:**
   When an invitation is saved or published, its database record stores both `themeId` and `themeVersion`:
   ```json
   {
     "themeId": "royal-temple",
     "themeVersion": "1.0.0"
   }
   ```
3. **Compatibility Guarantee:**
   If non-breaking design updates are released (e.g., `1.1.0`), invitations pinned to `1.0.0` continue rendering accurately through semantic version matching or versioned component exports.

---

## 12. Editor Integration Contract

The Admin Editor ([app/admin/[id]/ClientEditor.tsx](file:///c:/Users/Admin/Ahvaanam/app/admin/[id]/ClientEditor.tsx)) must remain decoupled from the visual template components.

```
┌────────────────────────────────────────────────────────┐
│                   Admin Client Editor                  │
│  • Modifies InvitationData state in memory             │
│  • Edits text, dates, photos, venue links              │
│  • Saves configuration to Supabase via POST API        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼ Updates InvitationData
┌────────────────────────────────────────────────────────┐
│               InvitationDataContext                    │
│  • Emits live state to preview container               │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼ Feeds Clean Data
┌────────────────────────────────────────────────────────┐
│                  Template Component                    │
│  • Reads InvitationData via props                      │
│  • Renders full visual output                          │
└────────────────────────────────────────────────────────┘
```

* **Editor responsibility:** Modifying data fields and saving to the database.
* **Template responsibility:** Rendering data fields according to the template's visual identity.

---

## 13. Runtime Rendering Flow

When a guest opens an invitation URL:

```
1. Guest visits /invites/[id]
         │
         ▼
2. app/invites/[id]/page.tsx fetches invitation metadata (title, OG tags)
         │
         ▼
3. app/invites/[id]/InviteClient.tsx initializes InvitationDataProvider
         │
         ▼
4. InvitationDataProvider loads JSON payload from /api/invitation/[id]
         │
         ▼
5. TemplateEngine matches themeId:
   const definition = getTemplate(invitationData.themeId) || getTemplate("rose-mandap");
         │
         ▼
6. Render Template Component:
   <definition.Component data={invitationData} clientId={id} />
         │
         ▼
7. Template renders dedicated HTML/CSS/Animations in DOM
```

---

## 14. Rose Mandap Integration Plan

Rose Mandap is the production reference implementation and must be preserved with zero visual regression:

1. **Wrap in `TemplateDefinition`:**
   Create [templates/rose-mandap/index.ts](file:///c:/Users/Admin/Ahvaanam/components/templates/rose-mandap/) exporting the `roseMandapDefinition` conforming to the new template contract.
2. **Preserve Component Tree:**
   Keep all existing subcomponents (`FallingPetals`, `FloatingLights`, `HangingDecorations`, `WeddingScene`, `Procession`, `rose-mandap.css`) exactly as they are.
3. **Register:**
   Register `roseMandapDefinition` in the new `template-engine/registry.ts`.
4. **Result:**
   Rose Mandap runs through the exact same registry and template engine interface as all upcoming templates without any special hardcoded `if (themeId === "rose-mandap")` router branches.

---

## 15. Recommended Folder Structure

```
c:\Users\Admin\Ahvaanam\
├── lib/
│   └── template-engine/              <── The core template engine
│       ├── types.ts                  <── TemplateDefinition & InvitationData interfaces
│       ├── registry.ts               <── Central template registration & lookup
│       ├── adapter.ts                <── Normalizes raw DB JSON into InvitationData
│       └── index.ts
│
├── components/
│   ├── design-system/                <── Shared atomic primitives
│   │   ├── audio/
│   │   │   └── AudioPlayer.tsx
│   │   ├── countdown/
│   │   │   └── CountdownTimer.tsx
│   │   ├── gallery/
│   │   │   └── LightboxGallery.tsx
│   │   ├── rsvp/
│   │   │   └── RsvpModal.tsx
│   │   ├── maps/
│   │   │   └── MapButton.tsx
│   │   └── animation/
│   │       ├── ParallaxLayer.tsx
│   │       └── transitions.ts
│   │
│   └── templates/                    <── Autonomous template implementations
│       ├── rose-mandap/              <── Reference implementation (Preserved)
│       │   ├── index.ts              <── TemplateDefinition export
│       │   ├── RoseMandapTemplate.tsx
│       │   ├── hero/
│       │   ├── sections/
│       │   └── styles/rose-mandap.css
│       │
│       ├── royal-temple/             <── New autonomous template
│       │   ├── index.ts
│       │   ├── RoyalTempleTemplate.tsx
│       │   ├── hero/
│       │   ├── sections/
│       │   └── styles/royal-temple.css
│       │
│       ├── floral-garden/            <── New autonomous template
│       │   ├── index.ts
│       │   ├── FloralGardenTemplate.tsx
│       │   ├── hero/
│       │   ├── sections/
│       │   └── styles/floral-garden.css
│       │
│       └── palace-luxury/            <── New autonomous template
│           ├── index.ts
│           ├── PalaceLuxuryTemplate.tsx
│           ├── hero/
│           ├── sections/
│           └── styles/palace-luxury.css
│
└── public/
    ├── showcase/                     <── Thumbnails & previews for catalog/editor
    │   ├── thumbnails/
    │   └── previews/
    └── templates/                    <── High-res assets for live invitation rendering
        ├── rose-mandap/
        ├── royal-temple/
        ├── floral-garden/
        └── palace-luxury/
```

---

## 16. Phased Migration Strategy

```
Phase 1: Foundation (Current Step)
  └── Establish contracts, registry, and shared design system primitives.

Phase 2: Conform Rose Mandap
  └── Wrap Rose Mandap in TemplateDefinition and register in new registry.
  └── Update InviteClient.tsx to use registry.getTemplate() with Rose Mandap fallback.

Phase 3: Rebuild Flagship Templates Individually
  └── Implement Royal Temple (temple pillars, diya lighting, traditional arches).
  └── Implement Floral Garden (pastel watercolor, botanical frames, wax seal opening).
  └── Implement Palace Luxury (palace gates, velvet curtain unfold, gold foil borders).
  └── Implement South Indian (banana leaves, marigold torans, samayi lamps).

Phase 4: Deprecate Legacy Artifacts
  └── Remove BaseWeddingTemplate.tsx and legacy theme token registry.
```

---

## 17. Files to Keep

* `components/templates/rose-mandap/**` (Reference working template)
* `app/admin/**` (Admin portal & editor suite)
* `app/api/**` (Backend API routes: invitation CRUD, RSVP, analytics, upload, pay, publish)
* `components/rsvp/**` (RSVP submission forms and database handlers)
* `components/context/InvitationDataContext.tsx` (Core invitation data provider)
* `lib/db.ts` & `utils/supabase/**` (Database connection and Supabase clients)
* `lib/analytics/**` (Engagement tracker)
* `lib/auth/**` (Authentication and admin role checking)

---

## 18. Files to Replace (Refactor)

* `app/invites/[id]/InviteClient.tsx` (Replace hardcoded `rose-mandap` / `BaseWeddingTemplate` branch with clean `getTemplate(id)` lookup).
* `lib/templates/registry.ts` (Refactor to source metadata directly from `getAllTemplates()` in the template engine).

---

## 19. Files to Eventually Delete

* `components/templates/shared/BaseWeddingTemplate.tsx` (The generic card stack that broke templates).
* `components/templates/shared/adapter.ts` (Legacy base wedding adapter).
* `lib/theme/registry.ts` (The token registry that assigned showcase JPGs as backgrounds).
* `components/theme/ThemeProvider.tsx` (Legacy CSS variable injector).

---

## 20. Platform Systems That Must Remain Untouched

The following core modules are decoupled from the template rendering engine and must not be modified:
1. **Authentication & Session Management** (`lib/auth/`, `utils/supabase/`)
2. **Database Schemas & Persistence** (`lib/db.ts`, `prisma/`, `supabase_setup.sql`)
3. **Invitation CRUD APIs** (`app/api/invitation/**`)
4. **Guest RSVP Submission Pipeline** (`app/api/invitation/[id]/rsvp/**`)
5. **Engagement Analytics & Tracking** (`lib/analytics/**`, `app/api/invitation/[id]/analytics/**`)
6. **Payment & Razorpay Gateway** (`app/api/invitation/[id]/pay/**`)
7. **Custom Domain & Publishing Handlers** (`app/api/invitation/[id]/publish/**`)
8. **WhatsApp Messaging & OpenGraph Previews** (`app/api/invitation/[id]/opengraph-image.tsx`)

---

## 21. New-Template Creation Workflow

When a developer creates a new invitation template (e.g., `azure-serenity`):

1. **Step 1: Create Template Directory**
   * Create `components/templates/azure-serenity/`.
2. **Step 2: Place Live Assets**
   * Add background textures and SVG overlays to `public/templates/azure-serenity/`.
   * Add thumbnail image to `public/showcase/thumbnails/azure-serenity.jpg`.
3. **Step 3: Build Template Layout & Sections**
   * Create `AzureSerenityTemplate.tsx` composing shared primitives (`<AudioPlayer>`, `<CountdownTimer>`) and template-specific sections (`<AzureHero>`, `<AzureEvents>`).
   * Create `styles/azure-serenity.css` for custom keyframes and styling.
4. **Step 4: Export `TemplateDefinition`**
   * In `components/templates/azure-serenity/index.ts`, define `id: "azure-serenity"`, metadata, capabilities, and bind `Component: AzureSerenityTemplate`.
5. **Step 5: Register in Template Engine**
   * Add one line in `lib/template-engine/registry.ts`:
     ```typescript
     import { azureSerenityDefinition } from "@/components/templates/azure-serenity";
     registerTemplate(azureSerenityDefinition);
     ```
6. **Immediate Availability:**
   * The template automatically appears in the theme picker, admin editor, and renders on guest links `/invites/[id]` without modifying router code.

---

## 22. Risks and Safeguards

| Risk | Impact | Safeguard |
| :--- | :--- | :--- |
| **Missing or invalid template ID in database** | Visual glitch or confusing mismatch | Safe fallback card (`TemplateNotFoundFallback`) renders; platform **never** silently substitutes an unrelated template like Rose Mandap. |
| **Missing optional data fields (e.g. bio, surname)** | Layout shift or `undefined` text | Shared adapter normalizes all data with defensive defaults before passing to template props. |
| **Heavy mobile assets causing lag** | Poor guest experience on low-end phones | Next.js `<Image>` optimization with WebP, lazy loading below-the-fold assets, and reducing particle counts. |
| **Audio autoplay blocked by browser policy** | Missing background music | Interactive opening overlay requires a tap ("Open Invitation"), satisfying browser user-interaction policies for audio playback. |

---

## 23. Phase 1 Implementation Status

* **Template Engine Core (`lib/template-engine/`):** Complete (`types.ts`, `registry.ts`, `adapter.ts`, `index.ts`).
* **TemplateDefinition Contract:** Complete (`TemplateDefinition`, `TemplateRenderProps`, `TemplateAssets`, `TemplateCapabilities`).
* **Registry System:** Complete (Static immutable map with `getTemplate`, `getAllTemplates`, `getTemplatesByCategory`, `registerTemplate`).
* **Data Normalization Adapter:** Complete (`normalizeInvitationData` produces clean, typed `InvitationData` with defensive fallbacks).
* **Rose Mandap Integration:** Complete ([components/templates/rose-mandap/index.ts](file:///c:/Users/Admin/Ahvaanam/components/templates/rose-mandap/index.ts) exports `roseMandapDefinition` with zero visual/functional modifications to `RoseMandapTemplate.tsx`, its CSS, or assets).
* **InviteClient Runtime Resolution:** Complete ([app/invites/[id]/InviteClient.tsx](file:///c:/Users/Admin/Ahvaanam/app/invites/[id]/InviteClient.tsx) dynamically resolves `getTemplate(activeTheme)` with safe `TemplateNotFoundFallback` and no hardcoded theme branches or direct references to `BaseWeddingTemplate`).
* **Admin / Catalog Compatibility:** Preserved (Existing catalog registries in `lib/templates/` remain operational for theme selection without breaking admin workflows).
* **Build Status:** Verified (Next.js 16 Turbo build passed with zero errors across all 27 routes).
* **Legacy Dependencies Remaining (Isolated):** `BaseWeddingTemplate.tsx`, `lib/theme/registry.ts`, `components/templates/shared/adapter.ts`, `components/theme/ThemeProvider.tsx` (disconnected from `/invites/[id]` runtime path; pending deletion in Phase 4).
* **Known Issues:** None. Ready for Phase 2 / initial new visual template implementation (e.g. `royal-temple`).

