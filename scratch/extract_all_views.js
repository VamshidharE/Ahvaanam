const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\011e974d-4561-41c5-89e8-12ee65991b97\\.system_generated\\logs\\transcript_full.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  console.log(`Read ${lines.length} lines.`);

  let chunkCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      const obj = JSON.parse(line);
      
      // Check if it's the view_file tool output for app/page.tsx
      const isViewFileOutput = obj.type === 'VIEW_FILE' && obj.content && obj.content.includes('app/page.tsx');
      
      if (isViewFileOutput) {
        chunkCount++;
        // Extract startLine and endLine from content or find them
        const matchLinesRange = obj.content.match(/Showing lines (\d+) to (\d+)/);
        const rangeStr = matchLinesRange ? `lines_${matchLinesRange[1]}_to_${matchLinesRange[2]}` : `chunk_${chunkCount}`;
        
        const outPath = `scratch/page_chunk_${rangeStr}_step_${obj.step_index}.txt`;
        fs.writeFileSync(outPath, obj.content);
        console.log(`Saved viewed chunk ${rangeStr} (step ${obj.step_index}) to ${outPath}`);
      }
    } catch (e) {}
  }
  console.log(`Done. Found ${chunkCount} viewed chunks.`);
} catch (err) {
  console.error('Error:', err);
}
