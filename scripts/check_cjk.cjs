const fs = require('fs');
const path = require('path');

// Regex to match CJK characters (Chinese, Japanese Kanji/Kana, Korean Hangul, Full-width punctuation)
const cjkRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u3000-\u303f]/g;

function checkString(str, location) {
  let match;
  while ((match = cjkRegex.exec(str)) !== null) {
    console.log(`Found CJK character "${match[0]}" (code: ${match[0].charCodeAt(0).toString(16)}) at ${location}`);
  }
}

// 1. Check all surah json files
const surahsDir = path.join(__dirname, '../public/data/quran/surahs');
const files = fs.readdirSync(surahsDir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const fullPath = path.join(surahsDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const json = JSON.parse(content);
    if (json.ayahs) {
      json.ayahs.forEach(a => {
        if (a.modern_translation_bn) checkString(a.modern_translation_bn, `Surah ${json.surah}:${a.ayah} modern_translation_bn`);
        if (a.modern_translation_en) checkString(a.modern_translation_en, `Surah ${json.surah}:${a.ayah} modern_translation_en`);
        if (a.meta_bn) checkString(a.meta_bn, `Surah ${json.surah}:${a.ayah} meta_bn`);
        if (a.meta_en) checkString(a.meta_en, `Surah ${json.surah}:${a.ayah} meta_en`);
        if (a.lexicon_modern_notes) checkString(a.lexicon_modern_notes, `Surah ${json.surah}:${a.ayah} lexicon_modern_notes`);
      });
    }
  }
});

// 2. Check surahConsistencyData.ts
const consistencyPath = path.join(__dirname, '../src/lib/surahConsistencyData.ts');
const consistencyContent = fs.readFileSync(consistencyPath, 'utf8');
checkString(consistencyContent, 'surahConsistencyData.ts');

// 3. Check surahMeaningsData.ts
const meaningsPath = path.join(__dirname, '../src/lib/surahMeaningsData.ts');
const meaningsContent = fs.readFileSync(meaningsPath, 'utf8');
checkString(meaningsContent, 'surahMeaningsData.ts');

console.log('--- Scan completed ---');
