const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
let candidates = [];

for (const file of files) {
  if (file.startsWith('composition_pure_match_') && file.endsWith('.txt')) {
    const filePath = path.join('scratch', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('export default function CompositionRenderer') && content.includes('SECTION_COMPONENTS')) {
      // Find where "use client" starts
      let startIdx = content.indexOf('"use client";');
      if (startIdx === -1) startIdx = content.indexOf('use client');
      if (startIdx === -1) continue;
      
      let cleanCode = content.substring(startIdx);
      
      // Clean JSON fields if any
      const endMarkers = ['","Description"', '",\n      "Description"', '", "Description"', '","description"'];
      for (const marker of endMarkers) {
        const markerIdx = cleanCode.indexOf(marker);
        if (markerIdx !== -1) {
          cleanCode = cleanCode.substring(0, markerIdx);
        }
      }
      
      let parsed = cleanCode
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
        
      candidates.push({
        file,
        length: parsed.length,
        codePreviewEnd: parsed.substring(parsed.length - 150),
        code: parsed
      });
    }
  }
}

// Sort by length descending
candidates.sort((a, b) => b.length - a.length);

for (let i = 0; i < candidates.length; i++) {
  const cand = candidates[i];
  console.log(`[Candidate ${i+1}] File: ${cand.file}, Length: ${cand.length}`);
  console.log(`  Ends with: ${cand.codePreviewEnd.replace(/\n/g, ' ')}`);
  console.log("-----------------------------------------");
  
  // Save as TSX
  fs.writeFileSync(`scratch/composition_candidate_${i+1}.tsx`, cand.code);
}
console.log('Done.');
