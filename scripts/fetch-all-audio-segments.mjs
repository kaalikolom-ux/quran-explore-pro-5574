import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/data/quran/segments');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
}

async function fetchSurahSegments(surahId) {
  const url = `https://api.quran.com/api/v4/verses/by_chapter/${surahId}?audio=7&per_page=300`;
  const data = await fetchWithRetry(url);
  const compact = {};

  for (const verse of data.verses || []) {
    const rawSegments = verse.audio?.segments || [];
    // Format: [ [wordPos, startMs, endMs], ... ]
    compact[verse.verse_number] = rawSegments.map((s) => [s[1], s[2], s[3]]);
  }

  const filePath = path.join(OUT_DIR, `${surahId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(compact));
  return Object.keys(compact).length;
}

async function main() {
  console.log('Starting download of audio word segments for all 114 Surahs...');
  const total = 114;
  const concurrency = 6;
  let completed = 0;

  const queue = Array.from({ length: total }, (_, i) => i + 1);

  async function worker() {
    while (queue.length > 0) {
      const surahId = queue.shift();
      try {
        const ayahCount = await fetchSurahSegments(surahId);
        completed++;
        process.stdout.write(`\r[${completed}/${total}] Surah ${surahId} done (${ayahCount} ayahs)`);
      } catch (err) {
        console.error(`\nFailed for Surah ${surahId}:`, err.message);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  console.log('\nAll 114 Surahs audio segments successfully downloaded to public/data/quran/segments/!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
