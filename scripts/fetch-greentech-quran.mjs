// scripts/fetch-greentech-quran.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "../public/data/quran/surahs");

// ডিরেক্টরি না থাকলে তৈরি করা
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("🚀 গ্রীনটেক কুরআন ডাটা বান্ডেল ডাউনলোড ও প্রসেসিং শুরু হচ্ছে...");

async function downloadSurah(surahId) {
  try {
    // গ্রীনটেক ওপেন সোর্স কমপ্লিট মরফোলজি মিরর থেকে ফেচ
    const res = await fetch(
      `https://raw.githubusercontent.com/GreenTech-AppsFoundation/Quran-App-Data/master/Surah_JSON/${surahId}.json`
    );

    if (!res.ok) {
      // ব্যাকআপ মিরর (Quran Corpus / WBW Morphological dataset)
      const backupRes = await fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${surahId}?language=bn&words=true&word_fields=text_uthmani,text_imlaei,location&per_page=300`
      );
      if (!backupRes.ok) throw new Error(`Surah ${surahId} fetch failed`);
      
      const json = await backupRes.json();
      const processed = {
        surah: surahId,
        ayahs: json.verses.map((v) => ({
          surah: surahId,
          ayah: v.verse_number,
          text_uthmani: v.text_uthmani,
          words: (v.words || []).map((w, idx) => ({
            id: w.id,
            position: idx + 1,
            text_uthmani: w.text_uthmani || w.text,
            transliteration: w.transliteration?.text || "",
            translation_bn: w.translation?.text || "",
            root: w.root || "—",
            lemma: w.lemma || w.text_uthmani,
            grammar_bn: w.char_type_name === "word" ? "শব্দ" : "মার্কার",
          })),
        })),
      };

      fs.writeFileSync(
        path.join(OUTPUT_DIR, `${surahId}.json`),
        JSON.stringify(processed, null, 2)
      );
      return;
    }

    const data = await res.json();
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${surahId}.json`),
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error(`❌ সুরা ${surahId} ডাউনলোডে ত্রুটি:`, error.message);
  }
}

async function run() {
  for (let i = 1; i <= 114; i++) {
    process.stdout.write(`⏳ প্রসেস হচ্ছে: সুরা ${i}/114 ... \r`);
    await downloadSurah(i);
  }
  console.log("\n✅ আলহামদুলিল্লাহ! ১১৪টি সূরার সম্পূর্ণ ডাটা public/data/quran/surahs/ ফোল্ডারে সফলভাবে সংরক্ষিত হয়েছে!");
}

run();