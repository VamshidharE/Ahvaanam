const fs = require('fs');
const path = require('path');

const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations\\d2c79442-9bab-465c-a40a-56c20332cbe2.db';
const walPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\conversations\\d2c79442-9bab-465c-a40a-56c20332cbe2.db-wal';

const sections = [
  { name: 'countdown', keyword: 'export default function CountdownSection', dest: 'components/sections/countdown/index.tsx' },
  { name: 'couple', keyword: 'export default function CoupleSection', dest: 'components/sections/couple/index.tsx' },
  { name: 'dressCode', keyword: 'export default function DressCodeSection', dest: 'components/sections/dressCode/index.tsx' },
  { name: 'events', keyword: 'export default function EventsSection', dest: 'components/sections/events/index.tsx' },
  { name: 'families', keyword: 'export default function FamiliesSection', dest: 'components/sections/families/index.tsx' },
  { name: 'faq', keyword: 'export default function FAQSection', dest: 'components/sections/faq/index.tsx' },
  { name: 'footer', keyword: 'export default function FooterSection', dest: 'components/sections/footer/index.tsx' },
  { name: 'gallery', keyword: 'export default function GallerySection', dest: 'components/sections/gallery/index.tsx' },
  { name: 'hero', keyword: 'export default function HeroSection', dest: 'components/sections/hero/index.tsx' },
  { name: 'rsvp', keyword: 'export default function RSVPSection', dest: 'components/sections/rsvp/index.tsx' },
  { name: 'story', keyword: 'export default function StorySection', dest: 'components/sections/story/index.tsx' },
  { name: 'venue', keyword: 'export default function VenueSection', dest: 'components/sections/venue/index.tsx' }
];

function loadBinary(filePath) {
  if (!fs.existsSync(filePath)) return '';
  console.log(`Loading ${filePath}...`);
  const buf = fs.readFileSync(filePath);
  let content = '';
  for (let i = 0; i < buf.length; i++) {
    const charCode = buf[i];
    if (charCode === 0) {
      content += ' ';
    } else if (charCode >= 32 && charCode <= 126) {
      content += String.fromCharCode(charCode);
    } else if (charCode === 10 || charCode === 13 || charCode === 9) {
      content += String.fromCharCode(charCode);
    } else {
      content += ' ';
    }
  }
  return content;
}

const dbContent = loadBinary(dbPath);
const walContent = loadBinary(walPath);
const mergedContent = dbContent + '\n' + walContent;

for (const sec of sections) {
  console.log(`Searching for section: ${sec.name} using keyword: "${sec.keyword}"...`);
  
  let idx = 0;
  let candidates = [];
  while ((idx = mergedContent.toLowerCase().indexOf(sec.keyword.toLowerCase(), idx)) !== -1) {
    const surrounding = mergedContent.substring(Math.max(0, idx - 1000), idx + 2000);
    const isOurScript = surrounding.includes('extract_all_sections') || 
                        surrounding.includes('extract_legacy_orchestrator') ||
                        surrounding.includes('extract_from_db');
                        
    if (!isOurScript) {
      let startIdx = mergedContent.lastIndexOf('use client', idx);
      if (startIdx === -1 || startIdx < idx - 1000) {
        startIdx = idx - 200;
      }
      
      const slice = mergedContent.substring(startIdx, startIdx + 12000);
      let code = slice;
      
      // Clean JSON formatting
      const endMarkers = ['","Description"', '",\n      "Description"', '", "Description"', '","description"'];
      for (const marker of endMarkers) {
        const markerIdx = code.indexOf(marker);
        if (markerIdx !== -1) {
          code = code.substring(0, markerIdx);
        }
      }
      
      let parsed = code
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
        
      const lastBrace = parsed.lastIndexOf('}');
      if (lastBrace !== -1) {
        parsed = parsed.substring(0, lastBrace + 1);
      }
      
      const isJunk = parsed.includes('command(') || 
                     parsed.includes('sqlite') || 
                     parsed.includes('SQLite') ||
                     parsed.includes('trajectory_id') ||
                     parsed.includes('sessionID');
                     
      if (!isJunk && parsed.includes(sec.keyword) && parsed.trim().endsWith('}')) {
        candidates.push(parsed);
      }
    }
    idx += sec.keyword.length;
  }
  
  if (candidates.length > 0) {
    // Sort by length descending
    candidates.sort((a, b) => b.length - a.length);
    const best = candidates[0];
    
    // Create destination folder
    fs.mkdirSync(path.dirname(sec.dest), { recursive: true });
    fs.writeFileSync(sec.dest, best);
    console.log(`  -> Successfully restored complete ${sec.name} to ${sec.dest} (size: ${best.length})`);
  } else {
    console.log(`  -> No clean match found for section ${sec.name}!`);
  }
}
console.log('All sections processing done.');
