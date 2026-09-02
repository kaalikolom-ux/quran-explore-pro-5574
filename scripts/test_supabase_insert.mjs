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

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testInsert() {
  const chapterRow = {
    id: 1,
    name_simple: "Al-Fatihah",
    name_arabic: "الفاتحة",
    translated_name: "সূচনা",
    verses_count: 7,
    revelation_place: "makkah",
    lang: "bn"
  };

  const { data: chData, error: chErr } = await supabase
    .from('quran_chapters')
    .upsert(chapterRow, { onConflict: 'id' });

  console.log('Insert quran_chapters result:', { chData, chErr });

  const verseRow = {
    surah: 1,
    ayah: 1,
    text_uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    words: [],
    bn_text: "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি।",
    en_text: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
  };

  const { data: vData, error: vErr } = await supabase
    .from('quran_verses')
    .upsert(verseRow, { onConflict: 'surah,ayah' });

  console.log('Insert quran_verses result:', { vData, vErr });
}

testInsert();
