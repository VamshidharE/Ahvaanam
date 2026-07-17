const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
for (const file of files) {
  if (file.startsWith('page_chunk_')) {
    const filePath = path.join('scratch', file);
    const content = fs.readFileSync(filePath, 'utf8');
    const firstFewLines = content.split('\n').slice(0, 15).join('\n');
    const pathMatch = firstFewLines.match(/File Path:\s*`file:\/\/\/(.*)`/);
    console.log(`File: ${file}`);
    console.log(`  Path Match: ${pathMatch ? pathMatch[1] : 'NONE'}`);
  }
}
