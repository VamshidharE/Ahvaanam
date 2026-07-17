"use client";

import React from "react";
import { getLayout } from "@/lib/layouts/registry";

interface LayoutWrapperProps {
  layoutId?: string;
  defaultLayoutId: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function LayoutWrapper({ layoutId, defaultLayoutId, children, className, style }: LayoutWrapperProps) {
  const activeId = layoutId || defaultLayoutId;
  const layout = getLayout(activeId);

  if (!layout) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const { styles } = layout;

  const layoutVars = {
    "--layout-display": styles.display || "flex",
    "--layout-flex-direction": styles.flexDirection || "column",
    "--layout-align-items": styles.alignItems || "center",
    "--layout-gap": styles.gap || "1.5rem",
    "--layout-min-height": styles.minHeight || "auto",
    
    // Spacing override styles
    "--layout-padding-mobile": styles.paddingMobile || "2rem 1rem",
    "--layout-padding-desktop": styles.paddingDesktop || "4rem 2rem",
    
    // Grid columns layout
    "--layout-columns-desktop": String(styles.columnsDesktop || 1)
  } as React.CSSProperties;

  return (
    <div 
      className={`layout-engine-container ${className || ""}`}
      style={{
        ...layoutVars,
        ...style
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .layout-engine-container {
          display: var(--layout-display);
          flex-direction: var(--layout-flex-direction);
          align-items: var(--layout-align-items);
          gap: var(--layout-gap);
          min-height: var(--layout-min-height);
          padding: var(--layout-padding-mobile);
          width: 100%;
        }
        @media (min-width: 768px) {
          .layout-engine-container {
            padding: var(--layout-padding-desktop);
          }
        }
        @media (min-width: 1024px) {
          .layout-engine-container[style*="--layout-display: grid"] {
            display: grid !important;
            grid-template-columns: repeat(var(--layout-columns-desktop), minmax(0, 1fr)) !important;
          }
        }
      `}} />
      {children}
    </div>
  );
}
