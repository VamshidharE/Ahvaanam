const fs = require('fs');
const path = require('path');

const scratchDir = 'scratch';
const files = fs.readdirSync(scratchDir);

let bestMatch = null;
let bestMatchFile = '';

for (const file of files) {
  if (file.startsWith('composition_renderer_db_match_') && file.endsWith('.txt')) {
    const filePath = path.join(scratchDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const hasComponentExport = content.includes('export default function CompositionRenderer');
    const hasSectionRegistry = content.includes('SECTION_COMPONENTS');
    const hasResolve = content.includes('resolveBindingValue');
    
    if (hasComponentExport && hasSectionRegistry && hasResolve) {
      console.log(`Potential CompositionRenderer match in file: ${file}`);
      
      // Clean up string
      let cleaned = content;
      let startIdx = cleaned.indexOf('"use client";');
      if (startIdx === -1) startIdx = cleaned.indexOf('use client');
      if (startIdx !== -1) {
        cleaned = cleaned.substring(startIdx);
      }
      
      // Look for the end of the JSON string or description marker
      const endMarkers = ['","Description"', '",\n      "Description"', '", "Description"', '","description"'];
      for (const marker of endMarkers) {
        const markerIdx = cleaned.indexOf(marker);
        if (markerIdx !== -1) {
          cleaned = cleaned.substring(0, markerIdx);
        }
      }
      
      // Unescape characters
      let parsed = cleaned
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
        
      // Trim to the last closing brace of the component
      const lastBrace = parsed.lastIndexOf('}');
      if (lastBrace !== -1) {
        parsed = parsed.substring(0, lastBrace + 1);
      }
      
      if (parsed.includes('export default function CompositionRenderer') && parsed.trim().endsWith('}')) {
        console.log(`  -> FOUND EXCELLENT COMPLETE CODE in ${file} (length: ${parsed.length})`);
        bestMatch = parsed;
        bestMatchFile = file;
        break;
      }
    }
  }
}

if (bestMatch) {
  const destPath = 'components/composition/CompositionRenderer.tsx';
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, bestMatch);
  console.log(`Successfully restored perfect CompositionRenderer.tsx!`);
} else {
  console.log('No perfect match found.');
}
