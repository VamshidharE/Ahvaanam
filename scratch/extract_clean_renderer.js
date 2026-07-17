const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
let bestMatch = null;
let bestMatchFile = '';

for (const file of files) {
  if (file.startsWith('composition_pure_match_') && file.endsWith('.txt')) {
    const filePath = path.join('scratch', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // It must contain these three core things to be CompositionRenderer.tsx
    const hasExport = content.includes('export default function CompositionRenderer');
    const hasRegistry = content.includes('SECTION_COMPONENTS');
    const hasResolve = content.includes('resolveBindingValue');
    
    if (hasExport && hasRegistry && hasResolve) {
      console.log(`Checking candidate: ${file} (size: ${content.length})`);
      
      // Let's find "use client" as the starting point of the file
      let startIdx = content.indexOf('"use client";');
      if (startIdx === -1) startIdx = content.indexOf('use client');
      if (startIdx === -1) continue;
      
      let cleanCode = content.substring(startIdx);
      
      // Remove trailing SQLite/JSON metadata if any
      const endMarkers = ['","Description"', '",\n      "Description"', '", "Description"', '","description"'];
      for (const marker of endMarkers) {
        const markerIdx = cleanCode.indexOf(marker);
        if (markerIdx !== -1) {
          cleanCode = cleanCode.substring(0, markerIdx);
        }
      }
      
      // Unescape double-escaped JSON string characters
      let parsed = cleanCode
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
        
      // Ensure it ends cleanly at the last closing brace of the component
      const lastBrace = parsed.lastIndexOf('}');
      if (lastBrace !== -1) {
        parsed = parsed.substring(0, lastBrace + 1);
      }
      
      // Check if this parsed code looks complete and has no truncated comments
      if (parsed.includes('export default function CompositionRenderer') && parsed.trim().endsWith('}') && !parsed.includes('truncated')) {
        console.log(`  -> FOUND EXCELLENT COMPLETE CODE in ${file} (length: ${parsed.length})`);
        // Let's verify if there is any binary garbage (like control characters or multiple consecutive spaces representing SQLite pages)
        const hasBinaryGarbage = parsed.includes('SQLite') || parsed.includes('Page') || parsed.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/);
        if (!hasBinaryGarbage) {
          bestMatch = parsed;
          bestMatchFile = file;
          break;
        } else {
          console.log(`  -> File ${file} contains binary garbage, skipping.`);
        }
      }
    }
  }
}

if (bestMatch) {
  const destPath = 'components/composition/CompositionRenderer.tsx';
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, bestMatch);
  console.log(`Successfully restored perfect, complete CompositionRenderer.tsx from ${bestMatchFile}!`);
} else {
  console.log('No perfect match found. Let\'s try a looser check.');
  // Looser check: take the match that has the longest cleaned content with no binary garbage
  let longestCode = '';
  let longestFile = '';
  for (const file of files) {
    if (file.startsWith('composition_pure_match_') && file.endsWith('.txt')) {
      const filePath = path.join(scratchDir = 'scratch', file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('export default function CompositionRenderer')) {
        let cleaned = content;
        let startIdx = cleaned.indexOf('"use client";');
        if (startIdx === -1) startIdx = cleaned.indexOf('use client');
        if (startIdx !== -1) cleaned = cleaned.substring(startIdx);
        
        const endMarkers = ['","Description"', '",\n      "Description"', '", "Description"', '","description"'];
        for (const marker of endMarkers) {
          const markerIdx = cleaned.indexOf(marker);
          if (markerIdx !== -1) cleaned = cleaned.substring(0, markerIdx);
        }
        
        let parsed = cleaned
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
          
        const lastBrace = parsed.lastIndexOf('}');
        if (lastBrace !== -1) parsed = parsed.substring(0, lastBrace + 1);
        
        const hasGarbage = parsed.includes('SQLite') || parsed.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/);
        if (!hasGarbage && parsed.length > longestCode.length) {
          longestCode = parsed;
          longestFile = file;
        }
      }
    }
  }
  if (longestCode) {
    const destPath = 'components/composition/CompositionRenderer.tsx';
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, longestCode);
    console.log(`Successfully restored longest clean match of CompositionRenderer.tsx from ${longestFile}!`);
  } else {
    console.log('Failed to restore CompositionRenderer.tsx from SQLite database.');
  }
}
