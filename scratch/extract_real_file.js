const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
let foundCount = 0;

for (const file of files) {
  if (file.startsWith('composition_pure_match_') && file.endsWith('.txt')) {
    const filePath = path.join('scratch', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Core requirements of the CompositionRenderer code
    const hasExport = content.includes('export default function CompositionRenderer');
    const hasRegistry = content.includes('SECTION_COMPONENTS');
    const hasResolve = content.includes('resolveBindingValue');
    
    if (hasExport && hasRegistry && hasResolve) {
      // Exclude logs/command-outputs
      const isLogFile = content.includes('Preview of match') || 
                         content.includes('Found match') || 
                         content.includes('run_command') || 
                         content.includes('CommandLine') ||
                         content.includes('task-') ||
                         content.includes('step_index') ||
                         content.includes('\"tool_calls\"');
                         
      if (!isLogFile) {
        foundCount++;
        console.log(`[${foundCount}] Found possible REAL code file candidate: ${file} (size: ${content.length})`);
        
        let startIdx = content.indexOf('"use client";');
        if (startIdx === -1) startIdx = content.indexOf('use client');
        if (startIdx !== -1) {
          let code = content.substring(startIdx);
          
          // Try to clean up
          const endMarkers = ['","Description"', '",\n      "Description"', '", "Description"', '","description"'];
          for (const marker of endMarkers) {
            const markerIdx = code.indexOf(marker);
            if (markerIdx !== -1) {
              code = code.substring(0, markerIdx);
            }
          }
          
          // Unescape backslashes and quotes
          let parsed = code
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
            
          const lastBrace = parsed.lastIndexOf('}');
          if (lastBrace !== -1) {
            parsed = parsed.substring(0, lastBrace + 1);
          }
          
          console.log("  Parsed Code length:", parsed.length);
          console.log("  Code Ends with: ", parsed.substring(parsed.length - 100));
          
          // Save it!
          fs.writeFileSync(`scratch/real_renderer_candidate_${foundCount}.tsx`, parsed);
        }
      }
    }
  }
}
console.log('Search complete.');
