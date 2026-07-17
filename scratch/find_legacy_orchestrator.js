const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
let bestMatch = null;
let bestMatchFile = '';

for (const file of files) {
  if (file.startsWith('extracted_legacy_orchestrator_general_match_') && file.endsWith('.txt')) {
    const filePath = path.join('scratch', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('export default function LegacyOrchestrator') && content.includes('switch (sectionId)')) {
      // Find use client
      let startIdx = content.indexOf('"use client";');
      if (startIdx === -1) startIdx = content.indexOf('use client');
      if (startIdx === -1) continue;
      
      let code = content.substring(startIdx);
      
      // Clean trailing fields
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
        
      const lastBrace = parsed.lastIndexOf('}');
      if (lastBrace !== -1) {
        parsed = parsed.substring(0, lastBrace + 1);
      }
      
      // Check if it has database junk
      const isJunk = parsed.includes('command(') || 
                     parsed.includes('sqlite') || 
                     parsed.includes('SQLite') ||
                     parsed.includes('write_file') || 
                     parsed.includes('get-childitem') ||
                     parsed.includes('.db') ||
                     parsed.includes('trajectory_id') ||
                     parsed.includes('sessionID');
                     
      if (!isJunk && parsed.includes('export default function LegacyOrchestrator') && parsed.trim().endsWith('}')) {
        // Must contain all sections in switch-case to be complete
        const isComplete = parsed.includes('case "hero":') && 
                           parsed.includes('case "couple":') && 
                           parsed.includes('case "countdown":') && 
                           parsed.includes('case "events":') && 
                           parsed.includes('case "story":') && 
                           parsed.includes('case "gallery":') && 
                           parsed.includes('case "venue":') && 
                           parsed.includes('case "families":') && 
                           parsed.includes('case "rsvp":') && 
                           parsed.includes('case "faq":') && 
                           parsed.includes('case "dressCode":') && 
                           parsed.includes('case "footer":');
                           
        if (isComplete && parsed.length > 3000) {
          console.log(`FOUND PERFECT CLEAN MATCH: ${file} (length: ${parsed.length})`);
          bestMatch = parsed;
          bestMatchFile = file;
          break;
        }
      }
    }
  }
}

if (bestMatch) {
  fs.writeFileSync('components/shared/LegacyOrchestrator.tsx', bestMatch);
  console.log(`Successfully restored clean LegacyOrchestrator.tsx from ${bestMatchFile}!`);
} else {
  console.log('No perfect clean match found, searching for best candidate with minimal junk...');
  let candidates = [];
  for (const file of files) {
    if (file.startsWith('extracted_legacy_orchestrator_general_match_') && file.endsWith('.txt')) {
      const filePath = path.join('scratch', file);
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('export default function LegacyOrchestrator')) {
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
        
        // Count sections it has
        const sectionsCount = (parsed.match(/case "[a-zA-Z]+":/g) || []).length;
        const hasJunk = parsed.includes('command(') || parsed.includes('SQLite') || parsed.includes('trajectory_id');
        
        if (sectionsCount >= 10 && !hasJunk) {
          candidates.push({ file, length: parsed.length, sectionsCount, code: parsed });
        }
      }
    }
  }
  
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.length - a.length);
    const best = candidates[0];
    fs.writeFileSync('components/shared/LegacyOrchestrator.tsx', best.code);
    console.log(`Successfully restored best clean match from ${best.file} (length: ${best.length}, sections: ${best.sectionsCount})`);
  } else {
    console.log('Failed to find any clean LegacyOrchestrator candidate.');
  }
}
