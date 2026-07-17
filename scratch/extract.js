const fs = require('fs');

const logPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\d2c79442-9bab-465c-a40a-56c20332cbe2\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  console.log(`Read ${lines.length} lines from log.`);

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      // Search for any step where app/page.tsx content was viewed or loaded
      if (obj.content && (obj.content.includes('globals.css') || obj.content.includes('BuilderShowcase') || obj.content.includes('EventCategories'))) {
        console.log(`Found step ${obj.step_index} with matching keywords.`);
        fs.writeFileSync('scratch/restored_page.txt', obj.content);
        console.log('Saved matching content to scratch/restored_page.txt');
        break;
      }
    } catch (e) {
      // ignore
    }
  }
} catch (err) {
  console.error('Error reading log:', err);
}
