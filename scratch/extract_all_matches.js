const fs = require('fs');
const path = require('path');

const conversationsDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations';
const files = fs.readdirSync(conversationsDir);

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  if (!filePath.endsWith('.db') && !filePath.endsWith('.db-wal')) return;
  console.log(`Scanning ${filePath} (${fs.statSync(filePath).size} bytes)...`);
  const buf = fs.readFileSync(filePath);
  
  // Convert buffer to string replacing nulls with spaces
  let content = '';
  for (let i = 0; i < buf.length; i++) {
    const charCode = buf[i];
    if (charCode === 0) {
      content += ' ';
    } else if (charCode >= 32 && charCode <= 126) {
      content += String.fromCharCode(charCode);
    } else if (charCode === 10 || charCode === 13 || charCode === 9) {
      content += String.fromCharCode(charCode);
    } else {
      content += ' ';
    }
  }

  const searchStr = 'SECTION_COMPONENTS';
  let idx = 0;
  let matches = 0;
  const baseName = path.basename(filePath);
  
  while ((idx = content.indexOf(searchStr, idx)) !== -1) {
    const surrounding = content.substring(Math.max(0, idx - 1000), idx + 2000);
    const isOurScript = surrounding.includes('extract_from_db') || 
                        surrounding.includes('extract_exact_renderer') || 
                        surrounding.includes('search_composition_code') ||
                        surrounding.includes('search_all_logs') ||
                        surrounding.includes('find_homepage') ||
                        surrounding.includes('extract_all_matches') ||
                        surrounding.includes('find_full_composition');
                        
    if (!isOurScript) {
      matches++;
      console.log(`  [MATCH ${matches}] Found at index ${idx}`);
      let startIdx = content.lastIndexOf('use client', idx);
      if (startIdx === -1 || startIdx < idx - 1000) {
        startIdx = idx - 100;
      }
      
      const slice = content.substring(startIdx, startIdx + 6000);
      const outName = `scratch/composition_pure_match_${matches}_${baseName}.txt`;
      fs.writeFileSync(outName, slice);
      console.log(`    Saved to ${outName}`);
    }
    idx += searchStr.length;
  }
}

for (const file of files) {
  scanFile(path.join(conversationsDir, file));
}
console.log('All databases scanned.');
