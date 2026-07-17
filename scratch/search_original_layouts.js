const fs = require('fs');
const path = require('path');

const convDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations';
const dbFiles = fs.readdirSync(convDir).filter(f => f.endsWith('.db'));

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

const templates = [
  'royal-temple',
  'floral-garden',
  'south-indian',
  'palace-luxury',
  'lotus-serenity',
  'marigold',
  'peacock',
  'heritage',
  'moonlight',
  'grand-mandap'
];

for (const dbFile of dbFiles) {
  const dbPath = path.join(convDir, dbFile);
  console.log(`Scanning database: ${dbFile}...`);
  const content = loadBinary(dbPath);
  
  for (const temp of templates) {
    const keyword = `export default function ${temp.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Layout`;
    let idx = 0;
    while ((idx = content.indexOf(keyword, idx)) !== -1) {
      const surrounding = content.substring(Math.max(0, idx - 1500), idx + 8000);
      const isOriginal = !surrounding.includes('LegacyOrchestrator') && surrounding.includes('use client');
      if (isOriginal) {
        console.log(`  -> Found ORIGINAL layout for ${temp} in database ${dbFile} at index ${idx}!`);
        const outDir = path.join('scratch', 'restored', dbFile.replace('.db', ''));
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }
        const outPath = path.join(outDir, `${temp}_Layout.txt`);
        fs.writeFileSync(outPath, surrounding);
        console.log(`     Saved candidate code to ${outPath}`);
        break;
      }
      idx += keyword.length;
    }
  }
}
console.log('All databases scanned.');
