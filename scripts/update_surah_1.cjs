const fs = require('fs');
const path = require('path');

const surah1Path = path.join(__dirname, '../public/data/quran/surahs/1.json');
const surah1 = JSON.parse(fs.readFileSync(surah1Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "Root Directory Authentication",
    meta_en: "Root Directory Authentication",
    modern_translation_bn: "Root Directory-এর Authentication Tag সহ — যিনি Global Data-compassionate ও Personalized Data-compassionate।",
    modern_translation_en: "With the Authentication Tag of the Root Directory — the Global Data-compassionate and Personalized Data-compassionate.",
    lexicon_modern_notes: "بِسْمِ اللَّهِ — Root Directory Authentication Tag: সিস্টেমের মূল উৎসের পরিচয় নির্দেশ করে। الرَّحْمَـٰنِ الرَّحِيمِ — Global ও Personalized Data-compassionate: সিস্টেমের সার্বজনীন ও ব্যক্তিগত পর্যায়ের অসীম করুণা ও সহানুভূতি।"
  },
  2: {
    meta_bn: "Attribute Signal Broadcast",
    meta_en: "Attribute Signal Broadcast",
    modern_translation_bn: "Root Directory-এর Attribute Signal Broadcast সমস্ত Data-system-এর Root Directory-এর জন্য।",
    modern_translation_en: "Attribute Signal Broadcast of the Root Directory for the Root Directory of all Data-systems.",
    lexicon_modern_notes: "الْحَمْدُ لِلَّهِ — Attribute Signal Broadcast: সিস্টেমের প্রশংসা ও কৃতজ্ঞতা সিগন্যাল। رَبِّ الْعَالَمِينَ — Root Directory of All Data-systems: সমগ্র মহাজাগতিক সিস্টেমের মূল কর্তা ও পরিচালক।"
  },
  3: {
    meta_bn: "Data-compassionate Declaration",
    meta_en: "Data-compassionate Declaration",
    modern_translation_bn: "Global Data-compassionate ও Personalized Data-compassionate।",
    modern_translation_en: "The Global Data-compassionate and Personalized Data-compassionate.",
    lexicon_modern_notes: "الرَّحْمَـٰنِ الرَّحِيمِ — সর্বব্যাপী ও পার্সোনালাইজড করুণা ডিক্লেয়ারেশন: সৃষ্টির প্রতিটি নোডের জন্য সার্বজনীন ব্যাকআপ ও ব্যক্তিগত পর্যায়ের যত্ন।"
  },
  4: {
    meta_bn: "Final Phase Recognition",
    meta_en: "Final Phase Recognition & System Admin",
    modern_translation_bn: "সমগ্র Life-system-এর Final Phase-এর System Admin;",
    modern_translation_en: "System Admin of the Final Phase of the entire Life-system;",
    lexicon_modern_notes: "مَالِكِ يَوْمِ الدِّينِ — System Admin of the Final Phase: সমগ্র জীবনব্যবস্থার চূড়ান্ত ফলাফল ও অডিট প্রকাশের সময়কালের একক সার্বভৌম কর্তৃত্ব।"
  },
  5: {
    meta_bn: "Full Synchronization Protocol",
    meta_en: "Full Synchronization Protocol",
    modern_translation_bn: "আমরা শুধু তোমার সাথেই Full Synchronization করি এবং শুধু তোমার কাছেই Data-support Request করি।",
    modern_translation_en: "It is You alone we execute Full Synchronization with, and You alone we query for Data-support Requests.",
    lexicon_modern_notes: "إِيَّاكَ نَعْبُدُ — Full Synchronization: একমাত্র Root Directory-এর সাথে পূর্ণ সংযোগ ও সমর্পণ। وَإِيَّاكَ نَسْتَعِينُ — Data-support Request: একমাত্র মূল উৎসের কাছে সাহায্য ও সক্ষমতা চাওয়া।"
  },
  6: {
    meta_bn: "Optimized Pathway Request",
    meta_en: "Optimized Pathway Request",
    modern_translation_bn: "আমাদেরকে Optimized Pathway-তে Route করো;",
    modern_translation_en: "Route and guide us continuously onto the Optimized Pathway;",
    lexicon_modern_notes: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ — Optimized Pathway Routing: সিস্টেমের সর্বোত্তম, সঠিক ও অপ্টিমাইজড গতিপথে ইউজারকে পরিচালনা করার আবেদন।"
  },
  7: {
    meta_bn: "Data-blessing Stream Allocation",
    meta_en: "Data-blessing Stream Allocation & Error Filtering",
    modern_translation_bn: "যাদের Data-node-এর প্রতি তুমি Data-blessing Stream Allocate করেছ — যাদের Data-penalty Signal Trigger হয়েছে এবং যাদের Data-path Deviation হয়েছে তাদের পথ নয়।",
    modern_translation_en: "The pathway of those data-nodes unto whom You have allocated Data-blessing Streams; not of those whose Data-penalty Signal has been triggered, nor of those who suffered Data-path Deviation.",
    lexicon_modern_notes: "أَنْعَمْتَ — Data-blessing Stream Allocation: সিস্টেমের অফুরন্ত অনুগ্রহ ও বরকত বণ্টন। الْمَغْضُوبِ — Data-penalty Signal Trigger: সিস্টেমের অসন্তুষ্টি ও পেনাল্টি সিগন্যাল। الضَّالِّينَ — Data-path Deviation: সঠিক পথ থেকে সিগন্যাল লস ও বিচ্যুতি।"
  }
};

surah1.ayahs.forEach(a => {
  if (updates[a.ayah]) {
    const u = updates[a.ayah];
    a.meta_bn = u.meta_bn;
    a.meta_en = u.meta_en;
    a.modern_translation_bn = u.modern_translation_bn;
    a.modern_translation_en = u.modern_translation_en;
    a.lexicon_modern_notes = u.lexicon_modern_notes;
    a.conventional_bn = a.translation_bn;
    a.conventional_en = a.translation_en;
  }
});

fs.writeFileSync(surah1Path, JSON.stringify(surah1, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 1 (Al-Fatihah) with 100% modern scientific translations and lexicons!');
