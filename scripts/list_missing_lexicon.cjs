const fs = require('fs');
const path = require('path');

const surah2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/quran/surahs/2.json'), 'utf8'));

const missing = surah2.ayahs.filter(a => !a.lexicon_modern_notes || (typeof a.lexicon_modern_notes === 'string' ? a.lexicon_modern_notes.trim().length === 0 : a.lexicon_modern_notes.length === 0));

console.log(`Total missing: ${missing.length}`);
missing.forEach(m => {
  console.log(`Ayah ${m.ayah}: [${m.meta_bn || 'No Meta'}] Arabic: ${m.text_uthmani ? m.text_uthmani.slice(0, 40) : m.words?.map(w=>w.text_uthmani).join(' ').slice(0, 40)}`);
});
