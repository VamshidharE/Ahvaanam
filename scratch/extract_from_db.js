const fs = require('fs');
const path = require('path');

const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations\\d2c79442-9bab-465c-a40a-56c20332cbe2.db';
const walPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations\\d2c79442-9bab-465c-a40a-56c20332cbe2.db-wal';

function extractFromBinary(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  console.log(`Scanning ${filePath} (${fs.statSync(filePath).size} bytes)`);
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
  while ((idx = content.indexOf(searchStr, idx)) !== -1) {
    matches++;
    console.log(`[${matches}] Found match at index ${idx}`);
    // Find the start of the file: look backward for "use client"
    let startIdx = content.lastIndexOf('"use client"', idx);
    if (startIdx === -1) {
      startIdx = content.lastIndexOf('use client', idx);
    }
    if (startIdx === -1) startIdx = idx - 100;
    
    const slice = content.substring(startIdx, startIdx + 6000);
    console.log(`  Preview of match [${matches}]:`);
    console.log(slice.substring(0, 500));
    console.log("------------------------");
    
    // Save to scratch
    fs.writeFileSync(`scratch/composition_renderer_db_match_${matches}_${path.basename(filePath)}.txt`, slice);
    idx += searchStr.length;
  }
}

try {
  extractFromBinary(dbPath);
  extractFromBinary(walPath);
} catch (err) {
  console.error(err);
}
