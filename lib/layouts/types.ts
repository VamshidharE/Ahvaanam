export interface LayoutStyles {
  display?: "flex" | "grid";
  flexDirection?: "column" | "row";
  columnsDesktop?: number;
  alignItems?: "center" | "flex-start" | "flex-end";
  paddingMobile?: string;
  paddingDesktop?: string;
  gap?: string;
  minHeight?: string;
}

export interface LayoutDefinition {
  id: string;
  name: string;
  baseId?: string; // parent layout ID to inherit from
  sectionType: string; // targets hero, countdown, events, etc.
  styles: LayoutStyles;
}
