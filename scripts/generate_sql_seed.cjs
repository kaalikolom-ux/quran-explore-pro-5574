const fs = require('fs');
const path = require('path');

const surahsDir = path.join(__dirname, '../public/data/quran/surahs');
const outputSqlPath = path.join(__dirname, '../backups/seed_quran_master_data.sql');

console.log('--- Generating Master SQL Seed for Supabase ---');

const files = fs.readdirSync(surahsDir)
  .filter(f => f.endsWith('.json'))
  .sort((a, b) => parseInt(a) - parseInt(b));

let sql = `-- ==============================================================================
-- MASTER QURAN DATA SEED SCRIPT FOR SUPABASE
-- Project: Quran Explore Pro (kaalikolom-ux / wooniche.com)
-- Total Surahs: ${files.length}
-- Generated: ${new Date().toISOString()}
-- ==============================================================================

-- 1. Ensure Table Structure
CREATE TABLE IF NOT EXISTS public.quran_verses (
  surah integer NOT NULL,
  ayah integer NOT NULL,
  text_uthmani text NOT NULL,
  words jsonb NOT NULL DEFAULT '[]'::jsonb,
  transliteration text,
  bn_text text,
  en_text text,
  conventional_bn text,
  conventional_en text,
  modern_translation_bn text,
  modern_translation_en text,
  meta_bn text,
  meta_en text,
  lexicon_modern_notes text,
  audio_url text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (surah, ayah)
);

CREATE TABLE IF NOT EXISTS public.ayah_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  surah integer NOT NULL,
  ayah integer NOT NULL,
  meta_bn text,
  meta_en text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (surah, ayah)
);

`;

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

let totalAyahs = 0;
let totalModern = 0;
let totalMeta = 0;

for (const file of files) {
  const surahId = parseInt(path.basename(file, '.json'), 10);
  const data = JSON.parse(fs.readFileSync(path.join(surahsDir, file), 'utf8'));

  if (!data.ayahs || !Array.isArray(data.ayahs)) continue;

  sql += `\n-- ------------------------------------------------------------------------------\n`;
  sql += `-- Surah ${surahId}: ${data.ayahs.length} Ayahs\n`;
  sql += `-- ------------------------------------------------------------------------------\n`;

  const valuesRows = [];
  const metaRows = [];

  data.ayahs.forEach(a => {
    totalAyahs++;
    const convBn = a.conventional_bn || a.translation_bn || '';
    const convEn = a.conventional_en || a.translation_en || '';
    const modBn = a.modern_translation_bn || null;
    const modEn = a.modern_translation_en || null;
    const mBn = a.meta_bn || null;
    const mEn = a.meta_en || null;

    if (modBn || modEn) totalModern++;
    if (mBn || mEn) totalMeta++;

    let lexNotes = '';
    if (a.lexicon_modern_notes) {
      lexNotes = typeof a.lexicon_modern_notes === 'string'
        ? a.lexicon_modern_notes
        : JSON.stringify(a.lexicon_modern_notes);
    }

    const sPad = String(surahId).padStart(3, '0');
    const aPad = String(a.ayah).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sPad}${aPad}.mp3`;
    const wordsJson = JSON.stringify(a.words || []).replace(/'/g, "''");

    valuesRows.push(`(${surahId}, ${a.ayah}, ${escapeSql(a.text_uthmani || '')}, '${wordsJson}'::jsonb, ${escapeSql(a.transliteration || '')}, ${escapeSql(convBn)}, ${escapeSql(convEn)}, ${escapeSql(convBn)}, ${escapeSql(convEn)}, ${escapeSql(modBn)}, ${escapeSql(modEn)}, ${escapeSql(mBn)}, ${escapeSql(mEn)}, ${escapeSql(lexNotes || null)}, ${escapeSql(audioUrl)}, now())`);

    if (mBn || mEn) {
      metaRows.push(`(${surahId}, ${a.ayah}, ${escapeSql(mBn)}, ${escapeSql(mEn)}, now())`);
    }
  });

  // Batch insert into quran_verses
  sql += `INSERT INTO public.quran_verses (surah, ayah, text_uthmani, words, transliteration, bn_text, en_text, conventional_bn, conventional_en, modern_translation_bn, modern_translation_en, meta_bn, meta_en, lexicon_modern_notes, audio_url, updated_at)\nVALUES\n  ` + valuesRows.join(',\n  ') + `\nON CONFLICT (surah, ayah) DO UPDATE SET\n  text_uthmani = EXCLUDED.text_uthmani,\n  words = EXCLUDED.words,\n  transliteration = EXCLUDED.transliteration,\n  bn_text = EXCLUDED.bn_text,\n  en_text = EXCLUDED.en_text,\n  conventional_bn = EXCLUDED.conventional_bn,\n  conventional_en = EXCLUDED.conventional_en,\n  modern_translation_bn = EXCLUDED.modern_translation_bn,\n  modern_translation_en = EXCLUDED.modern_translation_en,\n  meta_bn = EXCLUDED.meta_bn,\n  meta_en = EXCLUDED.meta_en,\n  lexicon_modern_notes = EXCLUDED.lexicon_modern_notes,\n  audio_url = EXCLUDED.audio_url,\n  updated_at = now();\n`;

  if (metaRows.length > 0) {
    sql += `\nINSERT INTO public.ayah_metadata (surah, ayah, meta_bn, meta_en, updated_at)\nVALUES\n  ` + metaRows.join(',\n  ') + `\nON CONFLICT (surah, ayah) DO UPDATE SET\n  meta_bn = EXCLUDED.meta_bn,\n  meta_en = EXCLUDED.meta_en,\n  updated_at = now();\n`;
  }
}

fs.writeFileSync(outputSqlPath, sql, 'utf8');
console.log(`✅ Master SQL Seed created: ${outputSqlPath} (${(fs.statSync(outputSqlPath).size / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`Total Ayahs: ${totalAyahs}`);
console.log(`Ayahs with Modern Scientific Translations: ${totalModern}`);
console.log(`Ayahs with Metadata Tags: ${totalMeta}`);
