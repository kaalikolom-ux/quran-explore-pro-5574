const fs = require('fs');
const path = require('path');

const surahsDir = path.join(__dirname, '../public/data/quran/surahs');
const files = fs.readdirSync(surahsDir).filter(f => f.endsWith('.json')).sort((a,b) => parseInt(a)-parseInt(b));

let totalAyahs = 0;
let totalWithLexicon = 0;
let totalWithModernBn = 0;

files.forEach(f => {
  const surah = JSON.parse(fs.readFileSync(path.join(surahsDir, f), 'utf8'));
  let sLex = 0;
  let sMod = 0;
  surah.ayahs.forEach(a => {
    totalAyahs++;
    if (a.lexicon_modern_notes && (typeof a.lexicon_modern_notes === 'string' ? a.lexicon_modern_notes.trim().length > 0 : a.lexicon_modern_notes.length > 0)) {
      totalWithLexicon++;
      sLex++;
    }
    if (a.modern_translation_bn && a.modern_translation_bn.trim().length > 0) {
      totalWithModernBn++;
      sMod++;
    }
  });
  if (sMod > 0 || sLex > 0) {
    console.log(`Surah ${f.replace('.json', '')}: ${surah.ayahs.length} ayahs | Modern Bn: ${sMod} | Lexicon Notes: ${sLex}`);
  }
});

console.log(`\nTOTAL: ${totalAyahs} Ayahs across 114 Surahs`);
console.log(`Total with Modern Translation: ${totalWithModernBn}`);
console.log(`Total with Lexicon Notes: ${totalWithLexicon}`);
