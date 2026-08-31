const fs = require('fs');
const path = require('path');

const surah2Path = path.join(__dirname, '../public/data/quran/surahs/2.json');
const surah2 = JSON.parse(fs.readFileSync(surah2Path, 'utf8'));

surah2.ayahs.forEach(a => {
  if (a.lexicon_modern_notes) {
    if (Array.isArray(a.lexicon_modern_notes)) {
      const formatted = a.lexicon_modern_notes.map(item => {
        if (typeof item === 'string') return item;
        const parts = [];
        if (item.word) parts.push(item.word);
        if (item.meaning) parts.push(item.meaning);
        if (item.scientific_note) parts.push(item.scientific_note);
        
        if (item.word && (item.meaning || item.scientific_note)) {
          const desc = [item.meaning, item.scientific_note].filter(Boolean).join(': ');
          return `${item.word} — ${desc}`;
        }
        return parts.join(' — ');
      }).join('; ');
      a.lexicon_modern_notes = formatted;
    } else if (typeof a.lexicon_modern_notes === 'object') {
      a.lexicon_modern_notes = JSON.stringify(a.lexicon_modern_notes);
    }
  }
});

fs.writeFileSync(surah2Path, JSON.stringify(surah2, null, 2), 'utf8');
console.log('Successfully formatted all lexicon_modern_notes as strings in Surah 2!');
