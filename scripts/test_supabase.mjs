import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) {
    env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

console.log('Testing Supabase URL:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  try {
    const { data: chapters, error: chErr } = await supabase
      .from('quran_chapters')
      .select('id, name_simple, translated_name')
      .limit(5);

    if (chErr) {
      console.error('quran_chapters error:', chErr);
    } else {
      console.log('Successfully queried quran_chapters:', chapters);
    }

    const { data: verses, error: vErr } = await supabase
      .from('quran_verses')
      .select('surah, ayah, bn_text')
      .limit(5);

    if (vErr) {
      console.error('quran_verses error:', vErr);
    } else {
      console.log('Successfully queried quran_verses count/sample:', verses?.length, verses);
    }
  } catch (err) {
    console.error('Error during test:', err);
  }
}

test();
