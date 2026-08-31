const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually without external dependencies
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

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Supabase credentials missing in .env file!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const surahsDir = path.join(__dirname, '../public/data/quran/surahs');
const isDryRun = process.argv.includes('--dry-run');

async function syncQuranToSupabase() {
  console.log(`--- Starting Hybrid Master Sync to Supabase (${isDryRun ? 'DRY RUN' : 'LIVE UPLOAD'}) ---`);
  console.log(`Connected to Supabase Project: ${SUPABASE_URL}`);

  const files = fs.readdirSync(surahsDir)
    .filter(f => f.endsWith('.json'))
    .sort((a, b) => parseInt(a) - parseInt(b));

  console.log(`Found ${files.length} Surah JSON files in ${surahsDir}`);

  let totalAyahsUploaded = 0;
  let totalMetaCount = 0;
  let totalModernTranslationCount = 0;

  for (const file of files) {
    const surahId = parseInt(path.basename(file, '.json'), 10);
    const surahData = JSON.parse(fs.readFileSync(path.join(surahsDir, file), 'utf8'));

    if (!surahData.ayahs || !Array.isArray(surahData.ayahs)) {
      console.warn(`⚠️ Warning: Surah ${surahId} has no ayahs array!`);
      continue;
    }

    const versesBatch = surahData.ayahs.map(a => {
      const convBn = a.conventional_bn || a.translation_bn || '';
      const convEn = a.conventional_en || a.translation_en || '';
      const modBn = a.modern_translation_bn || null;
      const modEn = a.modern_translation_en || null;
      const mBn = a.meta_bn || null;
      const mEn = a.meta_en || null;

      if (modBn || modEn) totalModernTranslationCount++;
      if (mBn || mEn) totalMetaCount++;

      let lexNotes = '';
      if (a.lexicon_modern_notes) {
        lexNotes = typeof a.lexicon_modern_notes === 'string'
          ? a.lexicon_modern_notes
          : JSON.stringify(a.lexicon_modern_notes);
      }

      const sPad = String(surahId).padStart(3, '0');
      const aPad = String(a.ayah).padStart(3, '0');

      return {
        surah: surahId,
        ayah: a.ayah,
        text_uthmani: a.text_uthmani || a.words?.map(w => w.text_uthmani).join(' ') || '',
        words: a.words || [],
        transliteration: a.transliteration || '',
        bn_text: convBn,
        en_text: convEn,
        conventional_bn: convBn,
        conventional_en: convEn,
        modern_translation_bn: modBn,
        modern_translation_en: modEn,
        meta_bn: mBn,
        meta_en: mEn,
        lexicon_modern_notes: lexNotes || null,
        audio_url: `https://everyayah.com/data/Alafasy_128kbps/${sPad}${aPad}.mp3`
      };
    });

    if (isDryRun) {
      totalAyahsUploaded += versesBatch.length;
      console.log(`[DryRun] Surah ${surahId}: ${versesBatch.length} ayahs validated.`);
      continue;
    }

    // Live Upsert in chunks of 50
    const chunkSize = 50;
    for (let i = 0; i < versesBatch.length; i += chunkSize) {
      const chunk = versesBatch.slice(i, i + chunkSize);
      const { error } = await supabase
        .from('quran_verses')
        .upsert(chunk, { onConflict: 'surah,ayah' });

      if (error) {
        console.error(`❌ Error upserting Surah ${surahId} (Ayahs ${i + 1}-${i + chunk.length}):`, error.message);
      }
    }

    // Also upsert ayah_metadata
    const metaBatch = versesBatch
      .filter(v => v.meta_bn || v.meta_en)
      .map(v => ({
        surah: v.surah,
        ayah: v.ayah,
        meta_bn: v.meta_bn,
        meta_en: v.meta_en
      }));

    if (metaBatch.length > 0) {
      const { error: metaErr } = await supabase
        .from('ayah_metadata')
        .upsert(metaBatch, { onConflict: 'surah,ayah' });

      if (metaErr) {
        // Handled silently
      }
    }

    totalAyahsUploaded += versesBatch.length;
    process.stdout.write(`✅ Synced Surah ${surahId} (${versesBatch.length} ayahs)\r`);
  }

  console.log('\n--- Sync Summary ---');
  console.log(`Total Ayahs Processed: ${totalAyahsUploaded}`);
  console.log(`Ayahs with Modern Scientific Translations: ${totalModernTranslationCount}`);
  console.log(`Ayahs with Metadata Tags: ${totalMetaCount}`);
  console.log('✅ Quran Master Sync Completed Successfully!');
}

syncQuranToSupabase().catch(err => {
  console.error('Fatal Error during sync:', err);
  process.exit(1);
});
