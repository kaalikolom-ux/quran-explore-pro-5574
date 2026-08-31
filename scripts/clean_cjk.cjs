const fs = require('fs');
const path = require('path');

const surahsDir = path.join(__dirname, '../public/data/quran/surahs');
const files = fs.readdirSync(surahsDir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const fullPath = path.join(surahsDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if contains Katakana or CJK
    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u3000-\u303f]/.test(content)) {
      console.log(`Cleaning CJK in ${file}...`);
      
      // Look at occurrences
      const json = JSON.parse(content);
      json.ayahs.forEach(a => {
        ['modern_translation_bn', 'modern_translation_en', 'meta_bn', 'meta_en', 'lexicon_modern_notes', 'translation_bn'].forEach(field => {
          if (a[field] && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u3000-\u303f]/.test(a[field])) {
            console.log(`Before in ${file} Ayah ${a.ayah} (${field}):`, a[field]);
            // Common replacements:
            // "পজিティブ" might have been "পজিティブ" with "ティブ" as katakana
            a[field] = a[field]
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/পজিটিভ/g, 'পজিটিভ')
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/পজিটিভ/g, 'পজিটিভ')
              .replace(/পজিティブ/g, 'পজিটিভ')
              .replace(/ティブ/g, 'টিভ')
              .replace(/システム/g, 'সিস্টেম')
              .replace(/。/g, '।');
            console.log(`After in ${file} Ayah ${a.ayah} (${field}):`, a[field]);
          }
        });
      });
      fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
    }
  }
});
