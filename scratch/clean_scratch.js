const fs = require('fs');
const path = require('path');

const scratchDir = 'scratch';
if (fs.existsSync(scratchDir)) {
  const files = fs.readdirSync(scratchDir);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(scratchDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted temp scratch file: ${filePath}`);
    }
  }
}
console.log('Clean complete.');
