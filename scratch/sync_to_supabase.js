const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const rootDir = path.dirname(__dirname); // Resolve to C:\Users\Admin\Ahvaanam
const envPath = path.join(rootDir, '.env');
const invitesDir = path.join(rootDir, 'components', 'data', 'invites');

console.log(`Syncing from project root: ${rootDir}`);

// Parse env variables manually
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials missing in .env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncToSupabase() {
  console.log('Reading local profiles...');
  if (!fs.existsSync(invitesDir)) {
    console.log(`No invites folder found at: ${invitesDir}`);
    return;
  }

  const files = fs.readdirSync(invitesDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'default.json');

  if (jsonFiles.length === 0) {
    console.log('No local profiles found to sync.');
    return;
  }

  console.log(`Found ${jsonFiles.length} profiles to upload.`);

  for (const filename of jsonFiles) {
    const id = path.basename(filename, '.json');
    const filePath = path.join(invitesDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const config = JSON.parse(content);

    console.log(`Uploading ${id} to Supabase...`);
    const { error } = await supabase
      .from('invitations')
      .upsert({ id, config, updated_at: new Date().toISOString() });

    if (error) {
      console.error(`❌ Failed to upload ${id}:`, error.message);
    } else {
      console.log(`✅ Successfully uploaded ${id}!`);
    }
  }

  console.log('Sync complete! All profiles are now in Supabase.');
}

syncToSupabase();
