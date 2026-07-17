const fs = require('fs');
const path = require('path');

const templatesDir = 'components/templates';
if (!fs.existsSync(templatesDir)) {
  console.log('Templates directory not found.');
  process.exit(1);
}

const templates = fs.readdirSync(templatesDir);

for (const temp of templates) {
  const layoutPath = path.join(templatesDir, temp, 'Layout.tsx');
  if (fs.existsSync(layoutPath)) {
    console.log(`Processing: ${layoutPath}`);
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    // Parse properties of LegacyOrchestrator from return statement
    const orchMatch = content.match(/<LegacyOrchestrator[\s\S]*?\/>/);
    if (orchMatch) {
      const orchestratorElement = orchMatch[0];
      const particlesName = `${temp.replace(/-/g, '')}Particles`;
      
      const cleanContent = `"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const ${particlesName} = () => null;

export default function ${temp.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Layout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    ${orchestratorElement}
  );
}
`;
      fs.writeFileSync(layoutPath, cleanContent);
      console.log(`  -> Cleaned and rewritten layout for ${temp}!`);
    } else {
      console.log(`  -> No LegacyOrchestrator element found in ${temp}. Skipping.`);
    }
  }
}
console.log('Done cleaning templates.');
