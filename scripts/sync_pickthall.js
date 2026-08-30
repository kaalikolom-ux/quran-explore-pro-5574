const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log("Fetching complete Marmaduke Pickthall translation dataset (6,236 verses)...");
  const pickthallData = await fetchJson('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-mohammedmarmadu.json');
  console.log(`Successfully fetched ${pickthallData.quran.length} Pickthall verses.`);

  const pickthallMap = new Map();
  for (const item of pickthallData.quran) {
    pickthallMap.set(`${item.chapter}_${item.verse}`, item.text);
  }

  const surahsDir = path.join(__dirname, '..', 'public', 'data', 'quran', 'surahs');
  const files = fs.readdirSync(surahsDir).filter(f => f.endsWith('.json'));

  console.log(`Found ${files.length} Surah JSON files in ${surahsDir}`);

  let updatedCount = 0;
  let totalAyahsUpdated = 0;

  for (const file of files) {
    const filePath = path.join(surahsDir, file);
    const surahData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (Array.isArray(surahData.ayahs)) {
      for (const ayah of surahData.ayahs) {
        const key = `${ayah.surah}_${ayah.ayah}`;
        const pickthallTranslation = pickthallMap.get(key);
        if (pickthallTranslation) {
          ayah.translation_en = pickthallTranslation;
          ayah.conventional_en = pickthallTranslation;
          totalAyahsUpdated++;
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(surahData, null, 2), 'utf8');
      updatedCount++;
    }
  }

  console.log(`Completed: ${updatedCount} surah files updated with ${totalAyahsUpdated} Pickthall verses!`);
}

main().catch(err => {
  console.error("Error updating Pickthall translation:", err);
  process.exit(1);
});
