const fs = require('fs');

const logPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\d2c79442-9bab-465c-a40a-56c20332cbe2\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  for (const line of lines) {
    const obj = JSON.parse(line);
    if (obj.step_index === 385) {
      console.log(JSON.stringify(obj, null, 2));
    }
  }
} catch (err) {
  console.error(err);
}
