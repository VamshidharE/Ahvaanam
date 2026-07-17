const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
for (const file of files) {
  if (file.startsWith('composition_candidate_') && file.endsWith('.tsx')) {
    const content = fs.readFileSync(path.join('scratch', file), 'utf8');
    console.log(`File: ${file}, Size: ${content.length}`);
    console.log(`  Start: ${content.substring(0, 300).replace(/\n/g, ' ')}`);
    console.log("------------------------------------------------");
  }
}
