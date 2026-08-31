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

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Supabase credentials missing in .env file!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const surahsDir = path.join(__dirname, '../public/data/quran/surahs');

async function syncSupabaseToLocal() {
  console.log('--- Starting Reverse Sync (Supabase DB -> Local Edge JSON) ---');

  const { data: dbVerses, error } = await supabase
    .from('quran_verses')
    .select('surah, ayah, modern_translation_bn, modern_translation_en, meta_bn, meta_en, conventional_bn, conventional_en, lexicon_modern_notes')
    .or('modern_translation_bn.not.is.null,meta_bn.not.is.null,lexicon_modern_notes.not.is.null');

  if (error) {
    console.error('❌ Failed to fetch overrides from Supabase:', error.message);
    process.exit(1);
  }

  if (!dbVerses || dbVerses.length === 0) {
    console.log('ℹ️ No cloud overrides found in Supabase.');
    return;
  }

  console.log(`Found ${dbVerses.length} verses with overrides in Supabase.`);

  // Group by surah
  const surahMap = new Map();
  dbVerses.forEach(v => {
    if (!surahMap.has(v.surah)) surahMap.set(v.surah, []);
    surahMap.get(v.surah).push(v);
  });

  let updatedSurahsCount = 0;

  for (const [surahId, verses] of surahMap.entries()) {
    const filePath = path.join(surahsDir, `${surahId}.json`);
    if (!fs.existsSync(filePath)) continue;

    const surahData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    verses.forEach(dbV => {
      const targetAyah = surahData.ayahs.find(a => a.ayah === dbV.ayah);
      if (targetAyah) {
        if (dbV.modern_translation_bn) {
          targetAyah.modern_translation_bn = dbV.modern_translation_bn;
          modified = true;
        }
        if (dbV.modern_translation_en) {
          targetAyah.modern_translation_en = dbV.modern_translation_en;
          modified = true;
        }
        if (dbV.meta_bn) {
          targetAyah.meta_bn = dbV.meta_bn;
          modified = true;
        }
        if (dbV.meta_en) {
          targetAyah.meta_en = dbV.meta_en;
          modified = true;
        }
        if (dbV.lexicon_modern_notes) {
          targetAyah.lexicon_modern_notes = dbV.lexicon_modern_notes;
          modified = true;
        }
        if (dbV.conventional_bn) {
          targetAyah.conventional_bn = dbV.conventional_bn;
          modified = true;
        }
        if (dbV.conventional_en) {
          targetAyah.conventional_en = dbV.conventional_en;
          modified = true;
        }
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(surahData, null, 2), 'utf8');
      updatedSurahsCount++;
      console.log(`✅ Merged Supabase updates into Surah ${surahId}.json`);
    }
  }

  console.log(`--- Reverse Sync Finished: ${updatedSurahsCount} Surah files updated locally ---`);
}

syncSupabaseToLocal().catch(err => {
  console.error('Fatal error during reverse sync:', err);
  process.exit(1);
});
