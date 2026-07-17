const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain';
const folders = fs.readdirSync(brainDir);

for (const folder of folders) {
  const folderPath = path.join(brainDir, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;
  
  const logPath = path.join(folderPath, '.system_generated', 'logs', 'transcript.jsonl');
  if (!fs.existsSync(logPath)) continue;
  
  try {
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim());
    console.log(`Checking folder ${folder}: ${lines.length} lines`);
    
    let matchCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      try {
        const obj = JSON.parse(line);
        // Look for view_file tool output or file content mentioning components/home/Hero or components/home/Navbar
        const hasHome = obj.content && (obj.content.includes('components/home/Hero') || obj.content.includes('components/home/Navbar') || obj.content.includes('components/home/EventCategories'));
        if (hasHome) {
          matchCount++;
          console.log(`  [${matchCount}] Found matching step ${obj.step_index} in folder ${folder}`);
          fs.writeFileSync(`scratch/restored_page_${folder}_step_${obj.step_index}.txt`, obj.content);
        }
      } catch (e) {}
    }
  } catch (err) {
    console.error(`Error reading logs for ${folder}:`, err.message);
  }
}
console.log('Search complete.');
