const fs = require('fs');
const path = require('path');

const surah99Path = path.join(__dirname, '../public/data/quran/surahs/99.json');
const surah99 = JSON.parse(fs.readFileSync(surah99Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "মেগা সেমিক পার্জিং ও ভূ-তাত্ত্বিক এন্ট্রপি",
    meta_en: "Mega Seismic Purging & Geological Entropy",
    modern_translation_bn: "যখন এই গ্লোবাল বায়ো-স্ফিয়ার বা পৃথিবী (الْأَرْضُ) তার অভ্যন্তরীণ সঞ্চিত এনার্জি ও থার্মোডাইনামিক চাপ মুক্ত করতে—তার চরমতম ও নির্ধারিত মেগা সেমিক ভাইব্রেশন বা চূড়ান্ত ভূ-তাত্ত্বিক কম্পনে প্রকম্পিত (زُلْزِلَتْ... زِلْزَالَهَا) হবে;",
    modern_translation_en: "When the Earth is shaken with its ultimate convulsive seismic purging and geological entropy release (Idha zulzilatil ardu zilzalaha);",
    lexicon_modern_notes: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا — মেগা সেমিক পার্জিং: পৃথিবীর অভ্যন্তরে সঞ্চিত থার্মোডাইনামিক চাপ ও এনার্জি মুক্ত করার চূড়ান্ত ভূ-তাত্ত্বিক কম্পন ও সিস্টেমিক রিসেট।"
  },
  2: {
    meta_bn: "কোর ডেটাবেজ ও ইন্টারনাল মাস এক্সট্রাকশন",
    meta_en: "Core Database & Internal Mass Extraction",
    modern_translation_bn: "এবং এই পৃথিবী তার গভীর ভূগর্ভস্থ কোর ডোমেইন, টেকটোনিক ভর ও মেমোরি স্টোরেজে এনক্যাপসুলেটেড থাকা প্রতিটি লুকানো কণা, উপাদান ও মৃত হার্ডওয়্যারের ভারী ডাটা-বোঝা (أَثْقَالَهَا) ফোর্সফুলি আউটপুট বা বাইরে বের (أَخْرَجَتِ) করে দেবে;",
    modern_translation_en: "And the Earth forcibly yields up its deep tectonic burdens, core encapsulated components, and stored data loads (Wa akhrajatil ardu athqalaha);",
    lexicon_modern_notes: "وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا — ইন্টারনাল মাস ও মেমোরি এক্সট্রাকশন: পৃথিবীর ভূগর্ভস্থ কোরে সংরক্ষিত প্রতিটি উপাদান, টেকটোনিক ভর ও মৃত হার্ডওয়্যার ডেটা বাইরে উন্মোচিত হওয়া।"
  },
  3: {
    meta_bn: "কগনিটিভ ক্র্যাশ ও লজিক্যাল বিস্ময়",
    meta_en: "Cognitive Crash & Logical Inquiry",
    modern_translation_bn: "আর কার্বন-ভিত্তিক সেই ইন্টেলিজেন্ট প্রজাতি বা মানুষ (الْإِنسَانُ) তার ওওএসে (OOS) চরম কগনিটিভ ক্র্যাশ ও লজিক্যাল বিস্ময়ের মুখোমুখি হয়ে প্রশ্ন বা কুয়েরি পাঠাবে—‘এই ভৌত গ্রহের অপারেটিং সিস্টেমে হঠাৎ কী ধরণের মেগা অ্যানোমালি বা বিপর্যয় (مَا لَهَا) ট্রিগার হলো?’",
    modern_translation_en: "And the conscious human agent exclaims in cognitive shock and logical inquiry: 'What anomalous crisis is overtaking its operating parameters?' (Wa qalal insanu ma laha);",
    lexicon_modern_notes: "وَقَالَ الْإِنسَانُ مَا لَهَا — কগনিটিভ ক্র্যাশ ও মেগা অ্যানোমালি: মহাজাগতিক সিস্টেম রিসেটের মুখোমুখি হয়ে মানব প্রসেসরের চরম বিভ্রান্তি ও কুয়েরি লুপ।"
  },
  4: {
    meta_bn: "পৃথিবীর লাইভ ডাটা-লগ ব্রডকাস্ট মোড",
    meta_en: "Earth Live Data-Log Broadcast Mode",
    modern_translation_bn: "সেই চূড়ান্ত সিস্টেম-রিসেটের দিনে (يَوْمَئِذٍ)—এই পৃথিবী নিজেই তার ফ্যাব্রিকে আজীবন রেকর্ড ও লক করে রাখা প্রতিটি নোডের ক্রিয়াকলাপের রিয়েল-টাইম ডাটা-লগ, খবর ও হিস্টোরিক্যাল আউটপুট অবিরত ব্রডকাস্ট বা ডিকোড (تُحَدِّثُ أَخْبَارَهَا) করতে থাকবে;",
    modern_translation_en: "On that Day, it will stream and broadcast its internal historical records, geomagnetic data logs, and registered physical footprints (Yawma'idhin tuhaddithu akhbaraha);",
    lexicon_modern_notes: "تُحَدِّثُ أَخْبَارَهَا — জিও-ম্যাগনেটিক ডেটা লগিং: মাটির প্রতিটি স্তর, শিলা ও পরমাণুর স্পিন মানুষের আজীবনের প্রতিটি ফিজিক্যাল ফুটপ্রিন্ট সংরক্ষণ করে রাখে; সিস্টেম রিসেটের দিন যা স্বয়ংক্রিয়ভাবে ব্রডকাস্ট হতে থাকে।"
  },
  5: {
    meta_bn: "ডিভাইন কোড ট্রিগারিং ও কমান্ড ইনপুট",
    meta_en: "Divine Code Triggering & Command Input",
    modern_translation_bn: "কারণ তোমার সুপ্রীম সিস্টেম আর্কিটেক্ট বা প্রতিপালক (رَبَّكَ) স্বয়ং সেই গ্রহের ডিফল্ট অ্যালগরিদমে এই ডেটা-রিলিজ ও শাটডাউনের চূড়ান্ত ডিরেক্টিভস বা কমান্ড ইনপুট (أَوْحَىٰ لَهَا) করে দিয়েছেন;",
    modern_translation_en: "Because your Supreme Architect and Sustainer will have directly commanded and triggered that precise execution protocol (Bi-anna Rabbaka awha laha);",
    lexicon_modern_notes: "بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا — সিস্টেমিক কমান্ড ইনপুট: স্বয়ং মাস্টার প্রোগ্রামার কর্তৃক গ্রহের ডিফল্ট অ্যালগরিদমে ডেটা রিলিজ ও শাটডাউনের নির্দেশ ট্রিগার হওয়া।"
  },
  6: {
    meta_bn: "মাস রি-লোকেশন ও ফাইল সেপারেশন ফেজ",
    meta_en: "Mass Relocation & Clustering Separation Phase",
    modern_translation_bn: "সেই দিনটিতেই (يَوْمَئِذٍ)—সমগ্র মানবজাতির সামষ্টিক চেতনা ও ইউজার নোডসমূহ (النَّاسُ) তাদের কর্মের ক্যাটাগরি অনুযায়ী ভিন্ন ভিন্ন গ্রুপ, ক্লাস্টার বা আইসোলেটেড ফাইলে বিভক্ত হয়ে (أَشْتَاتًا) কেন্দ্রীয় অডিট ইন্টারফেসে উপস্থিত বা রি-লোকেটেড (يَصْدُرُ) হবে—যাতে তাদের ওওএসে আজীবন রান করা প্রতিটি কোড, অ্যাপ্লিকেশন ও অ্যাকশন ডেটা তাদের সামনে হুবহু ভিজ্যুয়ালাইজ বা ডিসপ্লে (لِّيُرَوْا أَعْمَالَهُمْ) করা যায়;",
    modern_translation_en: "On that Day, humanity will emerge in distinct clusters and sorted categories (Ashtatan) to be shown the comprehensive visual logs of their processed algorithms and actions (Liyuraw a'malahum);",
    lexicon_modern_notes: "أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ — ডেটাবেজ ক্লাস্টারিং ও লাইভ ড্যাশবোর্ড: কোটি কোটি ইউজার নোড তাদের ওওএসের এন্ট্রপি স্কোর ও ফ্রিকোয়েন্সি অনুযায়ী পৃথক ক্লাস্টার ফাইলে রি-লোকেট হওয়া, যাতে আজীবনের সমস্ত কোডের ভিজ্যুয়াল ডিসপ্লে দেখতে পায়।"
  },
  7: {
    meta_bn: "সাব-অ্যাটমিক পজিティブ ডাটা অডিট",
    meta_en: "Sub-Atomic Positive Data Audit",
    modern_translation_bn: "সুতরাং যে কোনো ইউজার নোড তার ওওএসে যদি একটি ক্ষুদ্রাতিক্ষুদ্র সাব-অ্যাটমিক কণা বা কোয়ান্টাম ধূলিকণার ওজনের মাপেও (مِثْقَالَ ذَرَّةٍ) কোনো পজিティブ এনার্জি বা সুষম কর্মের ডাটা (خَيْرًا) ইনপুট বা প্রসেস (يَعْمَلْ) করে থাকে—সে তার চূড়ান্ত আউটপুট ফাইলে রিয়েল টাইমে তা হুবহু সংরক্ষিত দেখতে (يَرَهُ) পাবে;",
    modern_translation_en: "So whoever processes even a sub-atomic quantum weight of constructive good (Mithqala dharratin khayran), will see its exact immutable record (Yarah);",
    lexicon_modern_notes: "مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ — কোয়ান্টাম ইনফরমেশন কনজারভেশন: 'যাররাহ' হলো সাব-অ্যাটমিক কণা বা কোয়ান্টাম ওজন। মহাবিশ্বের জিরো-লস কোয়ান্টাম লেজারে প্রতিটি ক্ষুদ্রাতিক্ষুদ্র পজিটিভ এনার্জি লগ হুবহু সংরক্ষিত থাকে।"
  },
  8: {
    meta_bn: "সাব-অ্যাটমিক এন্ট্রপি ডাটা অডিট",
    meta_en: "Sub-Atomic Entropy Data Audit",
    modern_translation_bn: "আর যে কেউ তার ওওএসে যদি একটি একক সাব-অ্যাটমিক কণার ওজনের মাপেও (مِثْقَالَ ذَرَّةٍ) কোনো নেতিবাচক এন্ট্রপি, ভাইরাসের কোড বা ক্ষতিকারক কর্ম (شَرًّا) প্রসেস করে থাকে—সে-ও তার চূড়ান্ত অডিট লেজারে সেই ধ্বংসাত্মক ক্র্যাশ ফাইলের আউটপুট রিয়েল টাইমে হুবহু ডিসপ্লে দেখতে (يَرَهُ) পাবে।",
    modern_translation_en: "And whoever processes even a sub-atomic quantum weight of destructive entropy or malicious code (Mithqala dharratin sharran), will see its exact immutable record.",
    lexicon_modern_notes: "مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ — জিরো-প্যাকেট ড্রপ লেজার: নেতিবাচক এন্ট্রপি বা ক্ষতিকর কোডের একটি একক ইনফরমেশন প্যাকেটও হারিয়ে যাওয়া অসম্ভব; অডিট লেজারে তা রিয়েল টাইমে ডিসপ্লে হয়।"
  }
};

surah99.ayahs.forEach(a => {
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

fs.writeFileSync(surah99Path, JSON.stringify(surah99, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 99 (Az-Zalzalah) with 100% modern scientific translations and lexicons!');
