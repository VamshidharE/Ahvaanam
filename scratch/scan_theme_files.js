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

console.log('Searching for getTheme...');
let idx = 0;
const keyword = 'export function getTheme';
while ((idx = mergedContent.indexOf(keyword, idx)) !== -1) {
  const surrounding = mergedContent.substring(Math.max(0, idx - 1000), idx + 3000);
  if (!surrounding.includes('scan_theme_files') && !surrounding.includes('extract_theme_files')) {
    console.log(`--- getTheme Match at ${idx} ---`);
    console.log(surrounding.substring(0, 1500));
  }
  idx += keyword.length;
}

console.log('Searching for ThemeProvider file content...');
let idx2 = 0;
const providerKeyword = 'export default function ThemeProvider';
while ((idx2 = mergedContent.indexOf(providerKeyword, idx2)) !== -1) {
  const surrounding = mergedContent.substring(Math.max(0, idx2 - 500), idx2 + 2500);
  if (!surrounding.includes('scan_theme_files') && !surrounding.includes('extract_theme_files')) {
    console.log(`--- ThemeProvider Match at ${idx2} ---`);
    console.log(surrounding.substring(0, 1500));
  }
  idx2 += providerKeyword.length;
}
