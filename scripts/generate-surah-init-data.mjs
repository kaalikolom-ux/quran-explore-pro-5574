import fs from "node:fs";
import path from "node:path";

const surahsDir = path.resolve("public/data/quran/surahs");
const initDir = path.resolve("public/data/quran/surahs/init");

if (!fs.existsSync(initDir)) {
  fs.mkdirSync(initDir, { recursive: true });
}

console.log("⚡ Pre-generating instant initial ayah data for all 114 surahs...");

let generatedCount = 0;
let totalInitBytes = 0;

for (let sId = 1; sId <= 114; sId++) {
  const sourceFile = path.join(surahsDir, `${sId}.json`);
  if (!fs.existsSync(sourceFile)) {
    console.warn(`⚠️ Source file missing: ${sourceFile}`);
    continue;
  }

  try {
    const raw = fs.readFileSync(sourceFile, "utf-8");
    const fullData = JSON.parse(raw);

    const initialAyahsCount = Math.min(5, fullData.ayahs.length);
    const initData = {
      surah: fullData.surah || sId,
      total_ayahs: fullData.ayahs.length,
      is_partial: fullData.ayahs.length > initialAyahsCount,
      ayahs: fullData.ayahs.slice(0, initialAyahsCount),
    };

    const targetFile = path.join(initDir, `${sId}.json`);
    const jsonOutput = JSON.stringify(initData);
    fs.writeFileSync(targetFile, jsonOutput, "utf-8");

    totalInitBytes += jsonOutput.length;
    generatedCount++;
  } catch (err) {
    console.error(`❌ Failed processing Surah ${sId}:`, err);
  }
}

console.log(`✅ Successfully generated ${generatedCount} init files in public/data/quran/surahs/init/`);
console.log(`📦 Total uncompressed init size: ${(totalInitBytes / 1024).toFixed(1)} KB (average: ${(totalInitBytes / generatedCount / 1024).toFixed(1)} KB per surah)`);
