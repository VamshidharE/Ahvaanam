const fs = require('fs');

const chunks = [
  'scratch/page_chunk_lines_1_to_100_step_2408.txt',
  'scratch/page_chunk_lines_100_to_155_step_2410.txt',
  'scratch/page_chunk_lines_155_to_195_step_2399.txt',
  'scratch/page_chunk_lines_195_to_397_step_2412.txt'
];

const linesMap = new Map();

function parseChunk(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rawLines = content.split('\n');
  
  let started = false;
  for (const line of rawLines) {
    if (line.includes('The following code has been modified to include a line number')) {
      started = true;
      continue;
    }
    if (line.includes('The above content does NOT show')) {
      started = false;
      continue;
    }
    if (!started) continue;
    
    const match = line.match(/^\s*(\d+):\s?(.*)$/);
    if (match) {
      const lineNum = parseInt(match[1], 10);
      const codeContent = match[2];
      linesMap.set(lineNum, codeContent);
    }
  }
}

try {
  for (const chunk of chunks) {
    parseChunk(chunk);
  }
  
  console.log(`Gathered ${linesMap.size} unique lines.`);
  
  const maxLine = Math.max(...linesMap.keys());
  console.log(`Max line number found: ${maxLine}`);
  
  const reassembledLines = [];
  let missingCount = 0;
  for (let i = 1; i <= maxLine; i++) {
    if (linesMap.has(i)) {
      reassembledLines.push(linesMap.get(i));
    } else {
      console.log(`MISSING line: ${i}`);
      missingCount++;
    }
  }
  
  if (missingCount === 0) {
    const finalCode = reassembledLines.join('\n');
    fs.writeFileSync('scratch/reassembled_homepage.tsx', finalCode);
    console.log('Successfully reassembled app/page.tsx!');
  } else {
    console.log(`Failed: ${missingCount} lines are missing.`);
  }
} catch (err) {
  console.error('Error reassembling:', err);
}
