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
            if (tc.name === 'run_command') {
              const cmd = tc.args.CommandLine;
              if (cmd.includes('git') || cmd.includes('reset') || cmd.includes('checkout') || cmd.includes('restore') || cmd.includes('clean')) {
                console.log(`Folder: ${folder}, Step: ${obj.step_index}, Command: ${cmd}`);
              }
            }
          }
        }
      } catch (e) {}
    }
  } catch (err) {
    console.error(`Error reading logs for ${folder}:`, err.message);
  }
}
console.log('Command search complete.');
