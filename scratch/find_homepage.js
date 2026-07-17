const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain';

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes('compositionrenderer') && !fullPath.includes('find_homepage.js') && !fullPath.includes('search_composition_code.js')) {
          console.log(`FOUND in file: ${fullPath} (size: ${content.length})`);
          // Print matching line
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes('compositionrenderer')) {
              console.log(`  Line ${i+1}: ${lines[i].substring(0, 150).trim()}`);
            }
          }
        }
      } catch (e) {}
    }
  }
}

try {
  searchDir(brainDir);
} catch (err) {
  console.error('Error:', err);
}
console.log('Done.');
