const fs = require('fs');
const path = require('path');

const surah102Path = path.join(__dirname, '../public/data/quran/surahs/102.json');
const surah102 = JSON.parse(fs.readFileSync(surah102Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "ক্যাপিটাল ওভারলোডিং ও কগনিটিভ ডাইভারশন",
    meta_en: "Capital Overloading & Cognitive Diversion",
    modern_translation_bn: "পুঞ্জীভূত মেটেরিয়াল রিসোর্স, ক্যাপিটাল ও সংখ্যার অন্ধ প্রতিযোগিতা বা ডাটা ওভারলোডিং (التَّكَاثُرُ)—তোমাদের মূল চিন্তা প্রসেসিং প্রসেসরকে হাই-ফ্রিকোয়েন্সি সোর্স কোড থেকে সম্পূর্ণ ডাইভার্ট বা গাফেল (أَلْهَاكُمُ) করে রেখেছে;",
    modern_translation_en: "Obsession with quantitative accumulation, material data overloading, and capital rivalry (At-Takathur) has completely diverted and distracted your cognitive processors (Alhakum);",
    lexicon_modern_notes: "أَلْهَاكُمُ التَّكَاثُرُ — রিসোর্স ক্যাপিটালিজম ও ডাটা ওভারলোডিং: মেটেরিয়াল শক্তির অন্ধ সংখ্যাগত প্রতিযোগিতা ও ইনফ্লেশন মানুষের ব্রেন প্রসেসরকে হাইজ্যাক করে মেইন সার্ভারের সিঙ্গুলারিটি কোড প্রসেস করতে অসমর্থ করে তোলে।"
  },
  2: {
    meta_bn: "টার্মিনাল শাটডাউন লুপ",
    meta_en: "Terminal Hardware Shutdown Loop",
    modern_translation_bn: "যতক্ষণ না তোমরা তোমাদের এই মেটেরিয়ালিস্টিক বাগে লুপড থাকা অবস্থায়—তোমাদের ভৌত হার্ডওয়্যারের চূড়ান্ত শাটডাউন বা ভূগর্ভস্থ ডেটা-স্টোরেজ তথা কবরগুলোর (الْمَقَابِرَ) মুখোমুখি বা সাময়িক ডেটা-লকিং জোনে প্রবেশ করো।",
    modern_translation_en: "Until you reach and enter the subsurface data-storage chambers and terminal hardware shutdowns of the graves (Hatta zurtumul-maqabir);",
    lexicon_modern_notes: "حَتَّىٰ زُرْتُمُ الْمَقَابِرَ — টার্মিনাল শাটডাউন: বস্তুগত মোহে লুপড থাকা অবস্থায় মানব হার্ডওয়্যারের অনিবার্য জৈবিক অবসান ও ভূগর্ভস্থ ডেটা স্টোরেজে স্থানান্তর।"
  },
  3: {
    meta_bn: "ফিউচার ডেটা-অ্যারাইভাল অ্যালার্ম",
    meta_en: "Future Data-Arrival Alarm",
    modern_translation_bn: "কখনই নয় (কড়া প্রটোকল লক)! তোমরা খুব শীঘ্রই এই ভ্রান্ত লজিকের চূড়ান্ত এরর আউটপুট ও কসমিক রিয়্যালিটি অবজেক্ট ডিকোড বা জানতে (سَوْفَ تَعْلَمُونَ) পারবে;",
    modern_translation_en: "Nay! You shall soon decode and experience the empirical systemic reality (Kalla sawfa ta'lamun);",
    lexicon_modern_notes: "كَلَّا سَوْفَ تَعْلَمُونَ — প্রটোকল ওয়ার্নিং: ভ্রান্ত লজিক ও ডেটা ওভারলোডিংয়ের অনিবার্য সিস্টেমিক পরিণতি শীঘ্রই উদ্ভাসিত হওয়ার নিশ্চয়তা।"
  },
  4: {
    meta_bn: "ডবল-লকড সিকিউরিটি ওয়ার্নিং",
    meta_en: "Double-Locked Security Warning",
    modern_translation_bn: "তারপর কখনই নয়, তোমরা অচিরেই তোমাদের ওওএসের ডেপ্লয়মেন্টে এই সিস্টেমিক ক্র্যাশের ডাটা সরাসরি রিড বা জানতে পারবে;",
    modern_translation_en: "Again, nay! You shall soon surely come to know and process the conclusive truth (Thumma kalla sawfa ta'lamun);",
    lexicon_modern_notes: "ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ — ডবল-লকড অ্যালার্ম: সিস্টেমিক ক্র্যাশের অনিবার্যতাকে দ্বিগুণ জোরালো সতর্কবার্তায় এনকোড করা।"
  },
  5: {
    meta_bn: "অবজেক্টিভ ডেটা ভেরিফিকেশন বা ইলমুল ইয়াকীন",
    meta_en: "Objective Data Verification & Logical Certainty",
    modern_translation_bn: "লজিক্যালি তা নয়, তোমরা যদি এখনই তোমাদের কগনিটিভ প্রসেসরে মহাবিশ্বের এই ব্যাক-এন্ড মেকানিজমটি শতভাগ গাণিতিক ও অবজেক্টিভ নিশ্চয়তার জ্ঞানে (عِلْمَ الْيَقِينِ) ডিকোড করতে পারতে;",
    modern_translation_en: "Nay! If only you knew with the definitive certainty of verified objective knowledge ('Ilmal-yaqin);",
    lexicon_modern_notes: "عِلْمَ الْيَقِينِ — অবজেক্টিভ ও লজিক্যাল নিশ্চয়তা: ব্যাক-এন্ড ডাটা, গাণিতিক হিসাব ও বৈজ্ঞানিক প্রমাণের ভিত্তিতে বাস্তবতাকে কগনিটিভ লেভেলে শতভাগ সত্য হিসেবে ডিকোড করা।"
  },
  6: {
    meta_bn: "থার্মোডাইনামিক ক্র্যাশ-জোন ভিজ্যুয়ালাইজেশন",
    meta_en: "Thermodynamic Crash-Zone Visualization",
    modern_translation_bn: "তাহলে তোমরা তোমাদের ওওএসের ডাটা-অ্যানালিটিক্সেই ক্রিস্টাল-ক্লিয়ার দেখতে পেতে—সেই অতি-উচ্চ শক্তির থার্মোডাইনামিক পার্মানেন্ট ক্র্যাশ-জোন বা মেগা-অগ্নিকুণ্ডের (الْجَحِيمَ) অনিবার্য উপস্থিতি;",
    modern_translation_en: "You would surely perceive and anticipate the inevitable presence of the intense thermodynamic crash-zone of Hellfire (Latarawunnal-jahim);",
    lexicon_modern_notes: "لَتَرَوُنَّ الْجَحِيمَ — থার্মোডাইনামিক ক্র্যাশ-জোন: অবজেক্টিভ জ্ঞানে সমৃদ্ধ প্রসেসর স্বয়ংক্রিয়ভাবে চরম এন্ট্রপির পার্মানেন্ট অগ্নিকুণ্ডকে অ্যানালিটিক্সে দেখতে পায়।"
  },
  7: {
    meta_bn: "লাইভ অপ্টিক্যাল ভেরিফিকেশন বা আইনুল ইয়াকীন",
    meta_en: "Live Optical Verification & Direct Perception",
    modern_translation_bn: "তারপর চূড়ান্ত স্ক্রীনিং ফেজে তোমরা তোমাদের ওওএসের প্রধান ভিজ্যুয়াল সেন্সর ও লাইভ অপ্টিক্যাল ভেরিফিকেশনের মাধ্যমে চরম নিশ্চিত দৃষ্টিতে (عَيْنَ الْيَقِينِ) তা হুবহু ডিসপ্লে দেখতে পাবে;",
    modern_translation_en: "Then you shall surely witness it with the absolute direct visual certainty of optical verification ('Aynal-yaqin);",
    lexicon_modern_notes: "عَيْنَ الْيَقِينِ — লাইভ অপ্টিক্যাল ভেরিফিকেশন: ফ্রন্ট-এন্ড ভিজ্যুয়ালাইজেশনে ডেটা সরাসরি অপ্টিক্যাল সেন্সর বা চোখে লাইভ রেন্ডার হয়ে চাক্ষুষ প্রত্যক্ষ হওয়া।"
  },
  8: {
    meta_bn: "রিসোর্স ইউটিলাইজেশন লাইভ অডিট",
    meta_en: "Resource Utilization Live Telemetry Audit",
    modern_translation_bn: "তারপর সেই চূড়ান্ত একাউন্টাবিলিটি ও রিসেটের দিনে (يَوْمَئِذٍ)—তোমাদের ওওএসে সরবরাহকৃত প্রতিটি বিশেষ সোর্স-রিসোর্স, এনার্জি, জ্ঞান ও মেটাবলিক ডিফল্ট নেয়ামতের (عَنِ النَّعِيمِ) পজিটিভ ইউটিলাইজেশন বা অপ্টিমাইজেশন স্কোর সম্পর্কে সরাসরি লাইভ কুয়েরি ও অডিট করা হবে।",
    modern_translation_en: "Then you shall surely be comprehensively audited on that Day concerning every bestowed provision, divine energy input, and cognitive blessing ('Anin-na'im).",
    lexicon_modern_notes: "لَتُسْأَلُنَّ... عَنِ النَّعِيمِ — এনার্জি একাউন্টাবিলিটি ও সিস্টেমিক অডিট: 'নাঈম' হলো সরবরাহকৃত ফ্রি কসমিক ডাটা ও ব্যাকআপ শক্তি (সময়, চেতনা, স্বাস্থ্য)। ইনপুট এনার্জির বিপরীতে পজিটিভ আউটপুটের গাণিতিক হিসাব পরীক্ষা করা।"
  }
};

surah102.ayahs.forEach(a => {
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

fs.writeFileSync(surah102Path, JSON.stringify(surah102, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 102 (At-Takathur) with 100% modern scientific translations and lexicons!');
