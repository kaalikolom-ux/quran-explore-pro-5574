const fs = require('fs');
const path = require('path');

const surahsDir = path.join(__dirname, '../public/data/quran/surahs');
const files = fs.readdirSync(surahsDir);

const completedSurahs = [];
const partialSurahs = [];

files.forEach(file => {
  if (file.endsWith('.json')) {
    const fullPath = path.join(surahsDir, file);
    const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const totalAyahs = json.ayahs.length;
    const modernCount = json.ayahs.filter(a => a.modern_translation_bn && a.modern_translation_bn.trim() !== '').length;
    
    if (modernCount === totalAyahs && totalAyahs > 0) {
      completedSurahs.push({
        id: json.surah,
        totalAyahs,
        modernCount
      });
    } else if (modernCount > 0) {
      partialSurahs.push({
        id: json.surah,
        totalAyahs,
        modernCount
      });
    }
  }
});

completedSurahs.sort((a, b) => a.id - b.id);
partialSurahs.sort((a, b) => a.id - b.id);

console.log('--- 100% COMPLETED SURAHS ---');
console.log(JSON.stringify(completedSurahs, null, 2));

console.log('--- PARTIALLY COMPLETED SURAHS ---');
console.log(JSON.stringify(partialSurahs, null, 2));
