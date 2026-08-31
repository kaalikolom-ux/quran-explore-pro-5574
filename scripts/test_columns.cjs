const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value.trim();
      }
    });
  }
}

loadEnv();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

async function testSchema() {
  console.log('Testing existing tables in Supabase...');

  const { data: vData, error: vErr } = await supabase.from('quran_verses').select('*').limit(1);
  console.log('quran_verses check:', vErr ? vErr.message : 'OK', vData ? Object.keys(vData[0] || {}) : '');

  const { data: mData, error: mErr } = await supabase.from('ayah_metadata').select('*').limit(1);
  console.log('ayah_metadata check:', mErr ? mErr.message : 'OK', mData ? Object.keys(mData[0] || {}) : '');

  const { data: tData, error: tErr } = await supabase.from('verse_translations').select('*').limit(1);
  console.log('verse_translations check:', tErr ? tErr.message : 'OK', tData ? Object.keys(tData[0] || {}) : '');

  const { data: cData, error: cErr } = await supabase.from('quran_chapters').select('*').limit(1);
  console.log('quran_chapters check:', cErr ? cErr.message : 'OK', cData ? Object.keys(cData[0] || {}) : '');
}

testSchema();
