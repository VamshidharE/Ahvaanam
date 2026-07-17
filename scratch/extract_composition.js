const fs = require('fs');

const logPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\011e974d-4561-41c5-89e8-12ee65991b97\\.system_generated\\logs\\transcript_full.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  console.log(`Read ${lines.length} lines.`);

  let matchCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      const obj = JSON.parse(line);
      const hasWord = JSON.stringify(obj).includes('CompositionRenderer');
      if (hasWord) {
        matchCount++;
        console.log(`Match ${matchCount}: step_index=${obj.step_index}, source=${obj.source}, type=${obj.type}`);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            console.log(`  Tool: ${tc.name}`);
            if (tc.args) {
              console.log(`    TargetFile: ${tc.args.TargetFile}`);
              let code = tc.args.CodeContent || tc.args.ReplacementContent;
              if (code) {
                console.log(`    Code length: ${code.length}`);
                fs.writeFileSync(`scratch/composition_restored_step_${obj.step_index}.txt`, code);
              }
            }
          }
        }
        if (obj.content) {
          console.log(`  Content Preview: ${obj.content.substring(0, 150).replace(/\n/g, ' ')}...`);
        }
      }
    } catch (e) {}
  }
  console.log(`Done. Found ${matchCount} matches.`);
} catch (err) {
  console.error('Error:', err);
}
