const fs = require('fs');
const path = require('path');

const logPath = 'scratch/untruncated_composition_renderer_transcript_full.jsonl.txt';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  console.log(`Read ${lines.length} lines.`);

  let matchCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          const isWrite = tc.name === 'write_to_file' || tc.name === 'replace_file_content';
          if (isWrite && tc.args && tc.args.TargetFile) {
            let targetFile = tc.args.TargetFile;
            if (targetFile.startsWith('"') && targetFile.endsWith('"')) {
              targetFile = JSON.parse(targetFile);
            }
            
            let code = tc.args.CodeContent || tc.args.ReplacementContent || '';
            if (code.startsWith('"') && code.endsWith('"')) {
              code = JSON.parse(code);
            }
            
            // Check if it's CompositionRenderer
            if (targetFile.includes('CompositionRenderer.tsx') && !code.includes('truncated')) {
              matchCount++;
              console.log(`[${matchCount}] Found UNTRUNCATED CompositionRenderer in step ${obj.step_index}`);
              const resolvedPath = 'components/composition/CompositionRenderer.tsx';
              // Make sure dir exists
              fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
              fs.writeFileSync(resolvedPath, code);
              console.log(`  -> Successfully restored complete CompositionRenderer.tsx!`);
            }
            
            // Also check for rsvp, countdown, etc. that might have been truncated
            const fileBase = path.basename(targetFile);
            if (targetFile.includes('components/sections') && !code.includes('truncated')) {
              const relPath = path.join('components/sections', path.dirname(targetFile).split('sections')[1] || '', fileBase);
              fs.mkdirSync(path.dirname(relPath), { recursive: true });
              fs.writeFileSync(relPath, code);
              console.log(`  -> Successfully restored complete section file: ${relPath}`);
            }
          }
        }
      }
    } catch (e) {}
  }
} catch (err) {
  console.error('Error:', err);
}
