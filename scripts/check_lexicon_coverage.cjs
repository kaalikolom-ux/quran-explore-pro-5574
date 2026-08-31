const fs = require('fs');
const path = require('path');

const surah2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/quran/surahs/2.json'), 'utf8'));

let withLexicon = 0;
let withoutLexicon = 0;
const missingAyahs = [];

surah2.ayahs.forEach(a => {
  const hasLex = Boolean(a.lexicon_modern_notes && (
    (typeof a.lexicon_modern_notes === 'string' && a.lexicon_modern_notes.trim().length > 0) ||
    (Array.isArray(a.lexicon_modern_notes) && a.lexicon_modern_notes.length > 0)
  ));
  if (hasLex) {
    withLexicon++;
  } else {
    withoutLexicon++;
    missingAyahs.push(a.ayah);
  }
});

console.log(`Surah 2 Total Ayahs: ${surah2.ayahs.length}`);
console.log(`With Lexicon Notes: ${withLexicon}`);
console.log(`Without Lexicon Notes: ${withoutLexicon}`);
console.log(`Missing Ayahs (${missingAyahs.length}):`, missingAyahs.slice(0, 50).join(', ') + (missingAyahs.length > 50 ? '...' : ''));
