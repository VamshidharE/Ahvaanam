const fs = require('fs');
const path = require('path');

const scratchDir = 'scratch';
const files = fs.readdirSync(scratchDir);

let bestMatch = null;
let bestMatchFile = '';

for (const file of files) {
  if (file.startsWith('composition_renderer_db_match_') && file.endsWith('.txt')) {
    const filePath = path.join(scratchDir, file);
    const content = fs.readFileSync(filePath, 'utf8').trim();
    
    // Look for a substring starting with "use client" and containing export default function CompositionRenderer
    // In JSON form: "\"use client\";\n"
    let startIdx = content.indexOf('"use client";');
    if (startIdx === -1) {
      startIdx = content.indexOf('use client');
    }
    if (startIdx === -1) continue;
    
    // Try to find if this contains the full component
    const hasComponentExport = content.includes('export default function CompositionRenderer');
    const hasResolveBinding = content.includes('resolveBindingValue');
    const hasSectionComponents = content.includes('SECTION_COMPONENTS');
    
    if (hasComponentExport && hasResolveBinding && hasSectionComponents) {
      // Let's try to extract the JSON-escaped string
      // It starts with "use client" and should end around the end of the file.
      // Let's find the closing quote if it starts with a double quote
      let parsedCode = '';
      try {
        // If the match starts with double quote (which means it's part of a JSON record)
        if (content.startsWith('"')) {
          // Find the matching end quote
          // Since it's a JSON string, let's find the next unescaped quote that finishes the string
          // We can parse the prefix using JSON.parse
          // Let's find the end of the JSON string
          let endIdx = content.indexOf('","Description"');
          if (endIdx === -1) {
            endIdx = content.indexOf('",\n      "Description"');
          }
          if (endIdx === -1) {
            endIdx = content.indexOf('", "Description"');
          }
          if (endIdx !== -1) {
            const jsonString = content.substring(0, endIdx + 1);
            parsedCode = JSON.parse(jsonString);
          }
        }
      } catch (e) {
        // Fallback: regular string clean up
      }
      
      // If we couldn't parse it as JSON, let's clean it up manually
      if (!parsedCode) {
        let codeContent = content.substring(startIdx);
        // Remove trailing database junk or JSON fields
        // In the database log, it might be followed by description, targetFile, etc.
        const endMarkers = ['","Description"', '",\n      "Description"', '", "Description"'];
        for (const marker of endMarkers) {
          const markerIdx = codeContent.indexOf(marker);
          if (markerIdx !== -1) {
            codeContent = codeContent.substring(0, markerIdx);
          }
        }
        // Unescape newlines and quotes
        parsedCode = codeContent
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
      }
      
      // Check if it looks complete (ends with closing bracket of the component)
      if (parsedCode.includes('export default function CompositionRenderer') && parsedCode.includes('return') && parsedCode.trim().endsWith('}')) {
        console.log(`FOUND PERFECT MATCH in ${file} (length: ${parsedCode.length})`);
        bestMatch = parsedCode;
        bestMatchFile = file;
        break;
      }
    }
  }
}

if (bestMatch) {
  const destPath = 'components/composition/CompositionRenderer.tsx';
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, bestMatch);
  console.log(`Successfully restored perfect, complete CompositionRenderer.tsx!`);
} else {
  console.log('No perfect match found, trying fallback matching...');
  // Fallback: take the longest match and write it
  let longestCode = '';
  let longestFile = '';
  for (const file of files) {
    if (file.startsWith('composition_renderer_db_match_') && file.endsWith('.txt')) {
      const filePath = path.join(scratchDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('export default function CompositionRenderer')) {
        let cleaned = content;
        // Basic clean up
        let startIdx = cleaned.indexOf('"use client";');
        if (startIdx === -1) startIdx = cleaned.indexOf('use client');
        if (startIdx !== -1) {
          cleaned = cleaned.substring(startIdx);
        }
        let endIdx = cleaned.indexOf('","Description"');
        if (endIdx !== -1) {
          cleaned = cleaned.substring(0, endIdx);
        }
        cleaned = cleaned
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
          
        if (cleaned.length > longestCode.length) {
          longestCode = cleaned;
          longestFile = file;
        }
      }
    }
  }
  if (longestCode) {
    console.log(`Longest match found in ${longestFile} (length: ${longestCode.length})`);
    // Trim extra junk at the end (keep only up to the last closing brace)
    const lastBraceIdx = longestCode.lastIndexOf('}');
    if (lastBraceIdx !== -1) {
      longestCode = longestCode.substring(0, lastBraceIdx + 1);
    }
    const destPath = 'components/composition/CompositionRenderer.tsx';
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, longestCode);
    console.log(`Successfully wrote fallback CompositionRenderer.tsx!`);
  } else {
    console.log('No match containing CompositionRenderer export was found at all!');
  }
}
