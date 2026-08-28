// scripts/build-quran-corpus.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORPUS_URL =
  "https://raw.githubusercontent.com/bnjasim/quranic-corpus/master/quranic-corpus-morphology-0.4.txt";
const SURAHS_DIR = path.join(__dirname, "../public/data/quran/surahs");

const bwToArabicMap = {
  "'": "ء",
  ">": "أ",
  "&": "ؤ",
  "<": "إ",
  "}": "ئ",
  A: "ا",
  b: "ب",
  p: "ة",
  t: "ت",
  v: "ث",
  j: "ج",
  H: "ح",
  x: "خ",
  d: "د",
  "*": "ذ",
  r: "ر",
  z: "ز",
  s: "س",
  $: "ش",
  S: "ص",
  D: "ض",
  T: "ط",
  Z: "ظ",
  E: "ع",
  g: "غ",
  f: "ف",
  q: "ق",
  k: "ك",
  l: "ل",
  m: "م",
  n: "ن",
  h: "ه",
  w: "و",
  Y: "ى",
  y: "ي",
  "{": "ٱ",
  "`": "ٰ",
  "~": "ّ",
  o: "ْ",
  a: "َ",
  u: "ُ",
  i: "ِ",
  F: "ً",
  N: "ٌ",
  K: "ٍ",
  _: "ـ",
};

function bwToArabic(bwStr) {
  if (!bwStr) return "";
  return bwStr
    .split("")
    .map((c) => bwToArabicMap[c] || c)
    .join("");
}

const posBanglaMap = {
  N: "বিশেষ্য (Noun)",
  PN: "নামবাচক বিশেষ্য (Proper Noun)",
  V: "ক্রিয়া (Verb)",
  ADJ: "বিশেষণ (Adjective)",
  PRON: "সর্বনাম (Pronoun)",
  DEM: "নির্দেশক সর্বনাম (Demonstrative)",
  REL: "সাপেক্ষ সর্বনাম (Relative)",
  LOC: "স্থানবাচক (Location)",
  T: "কালবাচক (Time)",
  P: "অব্যয় (Preposition)",
  CONJ: "সংযোজক অব্যয় (Conjunction)",
  INTG: "প্রশ্নবোধক (Interrogative)",
  NEG: "না-বোধক (Negative)",
  VOC: "সম্বোধন পদ (Vocative)",
  EMPH: "দৃঢ়তাবোধক (Emphatic)",
  CERT: "নিশ্চয়তাবোধক (Certainty)",
  COND: "শর্তবাচক (Conditional)",
  RES: "সীমাবদ্ধতা (Restriction)",
  EXP: "ব্যাখ্যামূলক (Explanation)",
  SUR: "আশ্চর্যসূচক (Surprise)",
  CIRC: "অবস্থাবাচক (Circumstantial)",
  SUB: "অধীনস্থ যোজক (Subordinating)",
  ACC: "অভিঘাত পদ (Accusative)",
  AMD: "সংশোধন পদ (Amendment)",
  ANS: "উত্তর পদ (Answer)",
  AVR: "অনিচ্ছা পদ (Aversion)",
  CAUS: "কারণবাচক (Cause)",
  COM: "সঙ্গতিবাচক (Comitative)",
  EQ: "সমতাবাচক (Equalization)",
  EXH: "উৎসাহবাচক (Exhortation)",
  FUT: "ভবিষ্যদ্বাচক (Future)",
  INC: "অসম্পূর্ণ (Inceptive)",
  INT: "উদ্দেশ্যবাচক (Intention)",
  LIP: "সম্ভাবনা পদ (Possibility)",
  LUT: "আকাঙ্ক্ষাবাচক (Desire)",
  PRO: "নিষেধবাচক (Prohibition)",
  PREV: "প্রতিরোধক (Preventive)",
  RET: "প্রত্যাহার পদ (Retraction)",
  RSLT: "ফলাফল পদ (Result)",
  SUP: "সম্পূরক পদ (Supplemental)",
};

async function main() {
  console.log("📥 ১/৩: The Quranic Arabic Corpus (Leeds University) ডাউনলোড হচ্ছে...");
  const res = await fetch(CORPUS_URL);
  if (!res.ok) throw new Error("Corpus download failed: " + res.statusText);
  const text = await res.text();

  console.log("📊 ২/৩: মরফোলজি ডাটা পার্স ও ম্যাপিং হচ্ছে...");
  const wordCorpusMap = new Map();

  const lines = text.split("\n");
  for (const line of lines) {
    if (!line || line.startsWith("#") || line.startsWith("LOCATION")) continue;
    const parts = line.split("\t");
    if (parts.length < 4) continue;

    const locRaw = parts[0].replace(/[()]/g, ""); // "1:1:1:2"
    const [sStr, aStr, wStr] = locRaw.split(":");
    const key = `${sStr}:${aStr}:${wStr}`;

    const tag = parts[2];
    const features = parts[3];

    let rootBw = "";
    let lemBw = "";
    let posTag = tag;

    const rootMatch = features.match(/ROOT:([^|]+)/);
    if (rootMatch) rootBw = rootMatch[1];

    const lemMatch = features.match(/LEM:([^|]+)/);
    if (lemMatch) lemBw = lemMatch[1];

    const posMatch = features.match(/POS:([^|]+)/);
    if (posMatch) posTag = posMatch[1];

    const existing = wordCorpusMap.get(key) || {
      root: "",
      lemma: "",
      pos: "",
      grammar_bn: "",
    };

    if (rootBw && !existing.root) {
      existing.root = bwToArabic(rootBw);
    }
    if (lemBw && !existing.lemma) {
      existing.lemma = bwToArabic(lemBw);
    }
    if (posTag && (!existing.pos || tag === "STEM")) {
      existing.pos = posTag;
      existing.grammar_bn = posBanglaMap[posTag] || "শব্দ";
    }

    wordCorpusMap.set(key, existing);
  }

  console.log(`✨ মোট ${wordCorpusMap.size}টি শব্দের মরফোলজিকাল এনোটেস্ন পার্স সম্পন্ন হয়েছে!`);

  console.log("💾 ৩/৩: ১১৪টি সূরার ফাইলে ১০০% নিখুঁত রুট ও ব্যাকরণ ইনজেক্ট করা হচ্ছে...");

  let updatedSurahs = 0;
  let totalWordsUpdated = 0;
  let rootsCount = 0;

  for (let sId = 1; sId <= 114; sId++) {
    const filePath = path.join(SURAHS_DIR, `${sId}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`File missing: ${filePath}`);
      continue;
    }

    const surahData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const ayah of surahData.ayahs) {
      const aNum = ayah.ayah;
      let wordPos = 1;

      for (const w of ayah.words) {
        if (w.grammar_bn === "মার্কার" || /^[০-৯0-9\u0660-\u0669]+$/.test(w.text_uthmani)) {
          continue;
        }

        const key = `${sId}:${aNum}:${wordPos}`;
        const corpusData = wordCorpusMap.get(key);

        if (corpusData) {
          if (corpusData.root) {
            w.root = corpusData.root;
            rootsCount++;
          } else {
            w.root = "—";
          }

          if (corpusData.lemma) {
            w.lemma = corpusData.lemma;
          }

          if (corpusData.grammar_bn) {
            w.grammar_bn = corpusData.grammar_bn;
          }
        }

        wordPos++;
        totalWordsUpdated++;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(surahData, null, 2), "utf-8");
    updatedSurahs++;
  }

  console.log(
    `\n🎉 আলহামদুলিল্লাহ! ${updatedSurahs}টি সূরার মোট ${totalWordsUpdated}টি শব্দে ${rootsCount}টি প্রামাণ্য রুট সফলভাবে আপডেট হয়েছে!`,
  );
}

main().catch(console.error);
