const fs = require('fs');
const path = require('path');

const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations\\d2c79442-9bab-465c-a40a-56c20332cbe2.db';
const walPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations\\d2c79442-9bab-465c-a40a-56c20332cbe2.db-wal';

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

const dbContent = loadBinary(dbPath);
const walContent = loadBinary(walPath);
const mergedContent = dbContent + '\n' + walContent;

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

for (const temp of templates) {
  console.log(`Searching for template: ${temp}...`);
  let idx = 0;
  const keyword = `components/templates/${temp}/Layout.tsx`;
  while ((idx = mergedContent.indexOf(keyword, idx)) !== -1) {
    const surrounding = mergedContent.substring(Math.max(0, idx - 1000), idx + 10000);
    if (!surrounding.includes('scan_template_layouts') && surrounding.includes('CodeContent')) {
      console.log(`--- MATCH FOR ${temp} AT ${idx} ---`);
      // Find where CodeContent starts and print a slice of the code
      const codeStart = surrounding.indexOf('CodeContent', 500);
      if (codeStart !== -1) {
        console.log(surrounding.substring(codeStart, codeStart + 2000));
      } else {
        console.log(surrounding.substring(500, 2500));
      }
      break; // Just need the first valid write match
    }
    idx += keyword.length;
  }
}
