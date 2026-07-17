const fs = require('fs');

const matchPath = 'scratch/extracted_legacy_orchestrator_general_match_827_d2c79442-9bab-465c-a40a-56c20332cbe2.db.txt';
if (!fs.existsSync(matchPath)) {
  console.log(`Match file not found: ${matchPath}`);
  process.exit(1);
}

let content = fs.readFileSync(matchPath, 'utf8');

// Find start
let startIdx = content.indexOf('"use client";');
if (startIdx === -1) startIdx = content.indexOf('use client');
if (startIdx === -1) startIdx = 0;

content = content.substring(startIdx);

// Unescape first
let parsed = content
  .replace(/\\n/g, '\n')
  .replace(/\\"/g, '"')
  .replace(/\\\\/g, '\\');

// Find component declaration start
const funcDeclaration = 'export default function LegacyOrchestrator';
const declIdx = parsed.indexOf(funcDeclaration);
if (declIdx === -1) {
  console.log('Could not find component declaration.');
  process.exit(1);
}

// Find the function parameters closing parenthesis first
const closingParamIdx = parsed.indexOf(')', declIdx + funcDeclaration.length);
if (closingParamIdx === -1) {
  console.log('Could not find closing parenthesis.');
  process.exit(1);
}

// Find first opening brace after function parameters closing parenthesis (i.e. function body start)
const firstBraceIdx = parsed.indexOf('{', closingParamIdx);
if (firstBraceIdx === -1) {
  console.log('Could not find function body start brace.');
  process.exit(1);
}

// Track braces starting from function body start
let braceCount = 1;
let inString = null; // Can be '"', "'", or "`"
let isEscaped = false;
let endIdx = -1;

for (let i = firstBraceIdx + 1; i < parsed.length; i++) {
  const char = parsed[i];
  
  if (isEscaped) {
    isEscaped = false;
    continue;
  }
  
  if (char === '\\') {
    isEscaped = true;
    continue;
  }
  
  if (inString) {
    if (char === inString) {
      inString = null;
    }
    continue;
  }
  
  if (char === '"' || char === "'" || char === "`") {
    inString = char;
    continue;
  }
  
  if (char === '{') {
    braceCount++;
  } else if (char === '}') {
    braceCount--;
    if (braceCount === 0) {
      endIdx = i;
      break;
    }
  }
}

if (endIdx !== -1) {
  const finalCode = parsed.substring(0, endIdx + 1);
  fs.writeFileSync('components/shared/LegacyOrchestrator.tsx', finalCode);
  console.log(`Successfully extracted perfect LegacyOrchestrator.tsx (length: ${finalCode.length})!`);
} else {
  console.log('Failed to find matching closing brace.');
}
