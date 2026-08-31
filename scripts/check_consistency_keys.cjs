const fs = require('fs');
const path = require('path');

const consistencyPath = path.join(__dirname, '../src/lib/surahConsistencyData.ts');
const consistencyContent = fs.readFileSync(consistencyPath, 'utf8');

const keys = consistencyContent.match(/\b(\d+):\s*\{/g);
console.log('Surahs in surahConsistencyData.ts:', keys);
