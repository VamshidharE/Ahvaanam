"use client";

import React from "react";
import { getTheme } from "@/lib/theme/registry";

interface ThemeProviderProps {
  themeId: string;
}

export default function ThemeProvider({ themeId }: ThemeProviderProps) {
  const theme = getTheme(themeId);

  const cssContent = `
    :root {
      --theme-bg: ${theme.colors.background};
      --theme-text: ${theme.colors.text};
      --theme-accent: ${theme.colors.accent};
      --theme-border: ${theme.colors.border};
      --theme-secondary-text: ${theme.colors.secondaryText};
      --theme-card-bg: ${theme.colors.cardBg};
      --theme-bg-image: url('${theme.backgroundImage}');
      
      --theme-font-heading: ${theme.typography.fontHeading};
      --theme-font-body: ${theme.typography.fontBody};
      
      --theme-radius-card: ${theme.radius.card};
      --theme-radius-button: ${theme.radius.button};
      
      --theme-shadow-card: ${theme.shadows.card};
      --theme-shadow-button: ${theme.shadows.button};
      
      --theme-gradient-backdrop: ${theme.gradients.backdrop};
      
      --theme-glass-bg: ${theme.glass.background};
      --theme-glass-blur: ${theme.glass.blur};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: cssContent }} />;
}
