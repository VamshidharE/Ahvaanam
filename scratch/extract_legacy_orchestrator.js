const fs = require('fs');
const path = require('path');

const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations\\d2c79442-9bab-465c-a40a-56c20332cbe2.db';
const walPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations\\d2c79442-9bab-465c-a40a-56c20332cbe2.db-wal';

function scanFile(filePath, searchStr, fileLabel) {
  if (!fs.existsSync(filePath)) return;
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

  let idx = 0;
  let matches = 0;
  while ((idx = content.toLowerCase().indexOf(searchStr.toLowerCase(), idx)) !== -1) {
    const surrounding = content.substring(Math.max(0, idx - 1000), idx + 2000);
    const isOurScript = surrounding.includes('extract_legacy_orchestrator') || 
                        surrounding.includes('extract_from_db');
                        
    if (!isOurScript) {
      matches++;
      let startIdx = content.lastIndexOf('use client', idx);
      if (startIdx === -1 || startIdx < idx - 1000) {
        startIdx = idx - 200;
      }
      
      const slice = content.substring(startIdx, startIdx + 15000); // Grab large slice for complete file
      const outName = `scratch/extracted_${fileLabel}_match_${matches}_${path.basename(filePath)}.txt`;
      fs.writeFileSync(outName, slice);
      console.log(`Saved match ${matches} of ${fileLabel} to ${outName}`);
    }
    idx += searchStr.length;
  }
}

scanFile(dbPath, 'LegacyOrchestrator', 'legacy_orchestrator_general');
scanFile(walPath, 'LegacyOrchestrator', 'legacy_orchestrator_general');

console.log('Extraction complete.');
