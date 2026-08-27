// scripts/generate-quran-lexicon.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SURAHS_DIR = path.join(__dirname, "../public/data/quran/surahs");
const OUTPUT_FILE = path.join(__dirname, "../public/data/quran/lexicon.json");

// Transliteration English to Bangla phonetic pronunciation helper
const enToBnPhonetic = {
  "aa": "আ", "a": "আ", "b": "ব", "t": "ত", "th": "ছ", "th'": "ছ",
  "j": "জ", "h": "হ", "ḥ": "হ", "kh": "খ", "d": "দ", "dh": "য",
  "r": "র", "z": "য", "s": "স", "sh": "শ", "ṣ": "স", "ḍ": "দ",
  "ṭ": "ত", "ẓ": "য", "ʿ": "‘", "gh": "গ", "f": "ফ", "q": "ক",
  "k": "ক", "l": "ল", "m": "ম", "n": "ন", "w": "ওয়", "u": "উ",
  "uu": "উ", "oo": "উ", "y": "ই", "i": "ই", "ee": "ঈ", "e": "এ",
  "o": "ও", "al-": "আল-", "l-": "ল-"
};

function generateBanglaPronunciation(translit, textUthmani) {
  if (!translit) return "";
  let clean = translit.toLowerCase().trim();
  
  // Custom common high-frequency replacements
  const commonMap = {
    "bis'mi": "বিসমি",
    "l-lahi": "লিল্লাহি",
    "allah": "আল্লাহ",
    "allahu": "আল্লাহু",
    "allaha": "আল্লাহা",
    "allahi": "আল্লাহি",
    "al-raḥmāni": "আর-রহমানি",
    "l-raḥmāni": "র-রহমানি",
    "al-raḥīmi": "আর-রহিমি",
    "l-raḥīmi": "র-রহিমি",
    "al-ḥamdu": "আল-হামদু",
    "lillahi": "লিল্লাহি",
    "rabbi": "রব্বি",
    "rabbu": "রব্বু",
    "rabbaka": "রব্বাকা",
    "rabbana": "রব্বানা",
    "rabbihim": "রব্বিহিম",
    "l-ʿālamīna": "ল-আলামীন",
    "al-ʿālamīna": "আল-আলামীন",
    "māliki": "মালিকি",
    "yawmi": "ইয়াওমি",
    "l-dīni": "দ-দীন",
    "al-dīni": "আদ-দীন",
    "iyyāka": "ইয়্যাকা",
    "naʿbudu": "না‘বুদু",
    "wa-iyyāka": "ওয়া-ইয়্যাকা",
    "nastaʿīnu": "নাসতা‘ঈন",
    "ih'dinā": "ইহদিনা",
    "l-ṣirāṭa": "স-সিরাতা",
    "al-ṣirāṭa": "আস-সিরাতা",
    "l-mus'taqīma": "ল-মুসতাকীম",
    "al-mus'taqīma": "আল-মুসতাকীম"
  };

  if (commonMap[clean]) return commonMap[clean];

  // Phonetic rule conversion
  let res = clean
    .replace(/al-/g, "আল-")
    .replace(/l-/g, "ল-")
    .replace(/bi-/g, "বি-")
    .replace(/wa-/g, "ওয়া-")
    .replace(/fa-/g, "ফা-")
    .replace(/sh/g, "শ")
    .replace(/kh/g, "খ")
    .replace(/th/g, "ছ")
    .replace(/dh/g, "য")
    .replace(/gh/g, "গ")
    .replace(/ʿ/g, "‘")
    .replace(/ā/g, "া")
    .replace(/ī/g, "ী")
    .replace(/ū/g, "ূ")
    .replace(/ḥ/g, "হ")
    .replace(/ṣ/g, "স")
    .replace(/ḍ/g, "দ")
    .replace(/ṭ/g, "ত")
    .replace(/ẓ/g, "য")
    .replace(/a/g, "া")
    .replace(/i/g, "ি")
    .replace(/u/g, "ু")
    .replace(/b/g, "ব")
    .replace(/t/g, "ত")
    .replace(/j/g, "জ")
    .replace(/d/g, "দ")
    .replace(/r/g, "র")
    .replace(/z/g, "য")
    .replace(/s/g, "স")
    .replace(/f/g, "ফ")
    .replace(/q/g, "ক")
    .replace(/k/g, "ক")
    .replace(/l/g, "ল")
    .replace(/m/g, "ম")
    .replace(/n/g, "ন")
    .replace(/h/g, "হ")
    .replace(/w/g, "ও")
    .replace(/y/g, "ই");

  return res.replace(/^া/, "আ").replace(/^ি/, "ই").replace(/^ু/, "উ");
}

console.log("📚 কুরআনিক অভিধান ও শব্দকোষ ডাটাবেজ তৈরি শুরু হচ্ছে...");

const rootMap = new Map();

for (let sId = 1; sId <= 114; sId++) {
  const filePath = path.join(SURAHS_DIR, `${sId}.json`);
  if (!fs.existsSync(filePath)) continue;

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const ayah of data.ayahs) {
    const aNum = ayah.ayah;

    for (const w of ayah.words) {
      if (!w.root || w.root === "—" || w.grammar_bn === "মার্কার") continue;

      const rKey = w.root.trim();
      const existing = rootMap.get(rKey) || {
        root: rKey,
        firstLetter: rKey[0] || "ا",
        totalOccurrences: 0,
        ayahsCount: 0,
        ayahSet: new Set(),
        meaningsBn: new Set(),
        grammarTags: new Set(),
        words: new Map(), // wordText -> { text, translit, translit_bn, meaning_bn, count, occurrences: [] }
      };

      existing.totalOccurrences++;
      const ayahKey = `${sId}:${aNum}`;
      existing.ayahSet.add(ayahKey);

      if (w.translation_bn && w.translation_bn !== "—") {
        existing.meaningsBn.add(w.translation_bn.replace(/[()"]/g, "").trim());
      }
      if (w.grammar_bn) {
        existing.grammarTags.add(w.grammar_bn);
      }

      const wKey = w.text_uthmani;
      const wEntry = existing.words.get(wKey) || {
        text_uthmani: w.text_uthmani,
        lemma: w.lemma || w.text_uthmani,
        transliteration: w.transliteration || "",
        pronunciation_bn: generateBanglaPronunciation(w.transliteration, w.text_uthmani),
        meaning_bn: w.translation_bn || "",
        count: 0,
        sampleAyahs: []
      };

      wEntry.count++;
      if (wEntry.sampleAyahs.length < 3) {
        wEntry.sampleAyahs.push({ surah: sId, ayah: aNum });
      }
      existing.words.set(wKey, wEntry);

      rootMap.set(rKey, existing);
    }
  }
}

// Convert map to sorted structured array
const lexiconList = Array.from(rootMap.values()).map((r) => {
  const wordsArr = Array.from(r.words.values()).sort((a, b) => b.count - a.count);
  const meaningsArr = Array.from(r.meaningsBn).filter(Boolean).slice(0, 5);

  const allAyahs = Array.from(r.ayahSet)
    .map((str) => {
      const [surah, ayah] = str.split(":").map(Number);
      return [surah, ayah];
    })
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  return {
    root: r.root,
    root_formatted: r.root.split("").join(" "),
    first_letter: r.firstLetter,
    total_occurrences: r.totalOccurrences,
    ayahs_count: r.ayahSet.size,
    primary_meanings_bn: meaningsArr.join(", "),
    grammar_types: Array.from(r.grammarTags).slice(0, 3),
    unique_words_count: wordsArr.length,
    derived_words: wordsArr.slice(0, 6),
    all_ayahs: allAyahs
  };
});

// Sort by Arabic Alphabetical order
lexiconList.sort((a, b) => a.root.localeCompare(b.root, "ar"));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(lexiconList), "utf-8");

console.log(`✅ কুরআনিক অভিধান সফলভাবে তৈরি হয়েছে! মোট ${lexiconList.length}টি মূল ধাতু (Roots) ও সহস্রাধিক শব্দ অন্তর্ভুক্ত হয়েছে।`);
