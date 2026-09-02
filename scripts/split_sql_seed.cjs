const fs = require('fs');
const path = require('path');

const masterSqlPath = path.join(__dirname, '../backups/seed_quran_master_data.sql');
const chunksDir = path.join(__dirname, '../backups/sql_chunks');

if (!fs.existsSync(chunksDir)) {
  fs.mkdirSync(chunksDir, { recursive: true });
}

const content = fs.readFileSync(masterSqlPath, 'utf8');

// Split by "-- Surah X:" marker
const parts = content.split(/\n-- ------------------------------------------------------------------------------\n-- Surah /);

// Part 0 contains schema + chapters
const headerAndChapters = parts[0];
fs.writeFileSync(path.join(chunksDir, '01_schema_and_114_chapters.sql'), headerAndChapters, 'utf8');
console.log(`Saved 01_schema_and_114_chapters.sql (${(headerAndChapters.length / 1024).toFixed(1)} KB)`);

// Chunk groups
const groups = [
  { name: '02_surah_1_to_3.sql', range: [1, 3] },
  { name: '03_surah_4_to_10.sql', range: [4, 10] },
  { name: '04_surah_11_to_30.sql', range: [11, 30] },
  { name: '05_surah_31_to_70.sql', range: [31, 70] },
  { name: '06_surah_71_to_114.sql', range: [71, 114] },
];

groups.forEach(g => {
  let gSql = `-- Chunk: ${g.name} (Surahs ${g.range[0]} to ${g.range[1]})\n\n`;
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    const match = p.match(/^(\d+):/);
    if (match) {
      const sId = parseInt(match[1], 10);
      if (sId >= g.range[0] && sId <= g.range[1]) {
        gSql += `-- ------------------------------------------------------------------------------\n-- Surah ` + p;
      }
    }
  }
  fs.writeFileSync(path.join(chunksDir, g.name), gSql, 'utf8');
  console.log(`Saved ${g.name} (${(gSql.length / (1024 * 1024)).toFixed(2)} MB)`);
});

console.log('✅ All modular SQL chunks created in backups/sql_chunks/');
