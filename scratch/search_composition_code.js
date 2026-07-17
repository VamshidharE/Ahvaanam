const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain';
const folders = fs.readdirSync(brainDir);

for (const folder of folders) {
  const folderPath = path.join(brainDir, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;
  
  const logPath = path.join(folderPath, '.system_generated', 'logs', 'transcript_full.jsonl');
  if (!fs.existsSync(logPath)) continue;
  
  try {
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim());
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.args && tc.args.TargetFile && tc.args.TargetFile.toLowerCase().includes('floral-garden/layout.tsx')) {
              console.log(`Folder: ${folder}, Step: ${obj.step_index}, Tool: ${tc.name}`);
              let code = tc.args.CodeContent || tc.args.ReplacementContent;
              if (tc.name === 'multi_replace_file_content') {
                code = JSON.stringify(tc.args.ReplacementChunks);
              }
              console.log(`  Code length: ${code ? code.length : 0}`);
            }
          }
        }
      } catch (e) {}
    }
  } catch (err) {
    console.error(`Error in folder ${folder}:`, err.message);
  }
}
console.log('Search complete.');
