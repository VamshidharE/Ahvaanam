const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
let candidates = [];

for (const file of files) {
  if (file.startsWith('extracted_legacy_orchestrator_general_match_') && file.endsWith('.txt')) {
    const filePath = path.join('scratch', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('export default function LegacyOrchestrator')) {
      let startIdx = content.indexOf('"use client";');
      if (startIdx === -1) startIdx = content.indexOf('use client');
      if (startIdx === -1) continue;
      
      let code = content.substring(startIdx);
      
      const endMarkers = ['","Description"', '",\n      "Description"', '", "Description"', '","description"'];
      for (const marker of endMarkers) {
        const markerIdx = code.indexOf(marker);
        if (markerIdx !== -1) {
          code = code.substring(0, markerIdx);
        }
      }
      
      let parsed = code
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
        
      // Check if it contains the exact string 'className' uninterrupted
      const hasClassName = parsed.includes('className=') || parsed.includes('className =');
      const hasBackToHub = parsed.includes('onBackToHub');
      const hasUtilityButtons = parsed.includes('Floating utility buttons');
      
      if (hasClassName && hasBackToHub && hasUtilityButtons) {
        // Let's check for database garbage in the middle
        // We can search for non-ascii characters or SQLite structural markers
        const hasGarbage = parsed.includes('command(') || 
                           parsed.includes('SQLite') || 
                           parsed.includes('trajectory_id') ||
                           parsed.includes('sessionID') ||
                           parsed.match(/[^\x00-\x7F]/); // check for non-ASCII bytes
                           
        if (!hasGarbage) {
          // Count closing braces to see if it's complete
          // The last brace should close the export default function
          const lastBrace = parsed.lastIndexOf('}');
          if (lastBrace !== -1) {
            const finalCode = parsed.substring(0, lastBrace + 1);
            if (finalCode.trim().endsWith('}')) {
              candidates.push({
                file,
                length: finalCode.length,
                code: finalCode
              });
            }
          }
        }
      }
    }
  }
}

console.log(`Found ${candidates.length} pristine candidates.`);
if (candidates.length > 0) {
  // Sort by length to get the most complete version
  candidates.sort((a, b) => b.length - a.length);
  const best = candidates[0];
  fs.writeFileSync('components/shared/LegacyOrchestrator.tsx', best.code);
  console.log(`Successfully restored pristine LegacyOrchestrator.tsx from ${best.file} (length: ${best.length})!`);
} else {
  console.log('No pristine candidate found.');
}
