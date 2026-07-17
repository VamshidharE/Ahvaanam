const fs = require('fs');

const logPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\d2c79442-9bab-465c-a40a-56c20332cbe2\\.system_generated\\logs\\transcript_full.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  console.log(`Searching step_index in transcript_full.jsonl (${lines.length} lines)`);
  
  for (const line of lines) {
    const obj = JSON.parse(line);
    if (obj.step_index === 385 || obj.step_index === 387 || obj.step_index === 363 || obj.step_index === 367) {
      console.log(`Found step_index=${obj.step_index} in transcript_full.jsonl! (tool calls: ${obj.tool_calls ? obj.tool_calls.map(tc => tc.name).join(', ') : 'none'})`);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          console.log(`  Args:`, JSON.stringify(tc.args, null, 2));
        }
      }
    }
  }
} catch (err) {
  console.error(err);
}
