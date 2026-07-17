const fs = require('fs');
const path = require('path');

const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations\\011e974d-4561-41c5-89e8-12ee65991b97.db';

function loadBinary(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const buf = fs.readFileSync(filePath);
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
  return content;
}

const content = loadBinary(dbPath);
const keyword = 'export default function SouthIndianTraditionalLayout';

let idx = 0;
let found = false;
while ((idx = content.indexOf(keyword, idx)) !== -1) {
  const surrounding = content.substring(Math.max(0, idx - 1500), idx + 8000);
  const isOriginal = !surrounding.includes('LegacyOrchestrator') && surrounding.includes('use client');
  if (isOriginal) {
    console.log(`Found original South Indian traditional layout at index ${idx}!`);
    const outDir = 'scratch/restored/011e974d-4561-41c5-89e8-12ee65991b97';
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outDir, 'south-indian_Layout.txt'), surrounding);
    found = true;
    break;
  }
  idx += keyword.length;
}
if (!found) {
  console.log('South Indian traditional layout not found using this name. Let us search for "south-indian" in general.');
  let idx2 = 0;
  while ((idx2 = content.indexOf('components/templates/south-indian/Layout', idx2)) !== -1) {
    console.log(`Found reference at ${idx2}: ${content.substring(idx2 - 100, idx2 + 100)}`);
    idx2 += 40;
  }
}
