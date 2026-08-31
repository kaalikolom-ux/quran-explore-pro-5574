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

async function inspectInsert() {
  // Test quran_verses schema
  const { data, error } = await supabase.from('quran_verses').upsert({
    surah: 1,
    ayah: 1,
    text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    words: [],
    bn_text: 'শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।',
    en_text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    audio_url: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3'
  }, { onConflict: 'surah,ayah' }).select();

  console.log('quran_verses insert result:', error ? error.message : 'SUCCESS', data);

  // Test ayah_metadata
  const { data: mData, error: mErr } = await supabase.from('ayah_metadata').upsert({
    surah: 1,
    ayah: 1,
    meta_bn: 'সিস্টেম ইনিশিয়ালাইজেশন ও বিসমিল্লাহ প্রটোকল',
    meta_en: 'System Initialization & Bismillah Protocol'
  }, { onConflict: 'surah,ayah' }).select();

  console.log('ayah_metadata insert result:', mErr ? mErr.message : 'SUCCESS', mData);
}

inspectInsert();
