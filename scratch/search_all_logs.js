const fs = require('fs');
const path = require('path');

const geminiDir = 'C:\\Users\\Admin\\.gemini\\antigravity';

function searchDir(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    return;
  }
  for (const file of files) {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (e) {
      continue;
    }
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else {
      // Skip very large files that are not logs or source files
      if (stat.size > 15 * 1024 * 1024) continue;
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('CompositionRenderer') && !fullPath.includes('find_homepage.js') && !fullPath.includes('search_composition_code.js') && !fullPath.includes('search_all_logs.js')) {
          console.log(`FOUND in file: ${fullPath} (size: ${content.length})`);
          if (content.includes('SECTION_COMPONENTS') && content.includes('resolveBindingValue')) {
            console.log(`  - Looks like untruncated code!`);
            fs.writeFileSync(`scratch/untruncated_composition_renderer_${path.basename(fullPath)}.txt`, content);
          }
        }
      } catch (e) {}
    }
  }
}

try {
  searchDir(geminiDir);
} catch (err) {
  console.error('Error:', err);
}
console.log('Done.');
