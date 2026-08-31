const fs = require('fs');
const path = require('path');

const surah95Path = path.join(__dirname, '../public/data/quran/surahs/95.json');
const surah95 = JSON.parse(fs.readFileSync(surah95Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "বায়ো-স্পেশাল ও কসমিক ইকোসিস্টেম রেফারেন্স",
    meta_en: "Bio-Spatial & Cosmic Ecosystem Reference",
    modern_translation_bn: "আমি মানুষের বায়োলজিক্যাল ও জেনেটিক বিবর্তনের সাথে লিঙ্কড সেই বিশেষ ভূ-তাত্ত্বিক অঞ্চল ও অনন্য ওমেগা ফ্যাটি-অ্যাসিড সমৃদ্ধ বায়ো-ইকোসিস্টেম—তথা তীন ও যয়তুনের (وَالتِّينِ وَالزَّيْتُونِ) আণবিক ও কোয়ান্টাম কনফিগারেশনের রেফারেন্স দিচ্ছি—",
    modern_translation_en: "By the molecular configuration and nutritional bio-ecosystem of the Fig and the Olive (Wat-tini waz-zaytun);",
    lexicon_modern_notes: "وَالتِّينِ وَالزَّيْتُونِ — বায়ো-স্পেশাল ইকোসিস্টেম: মানুষের সেলুলার ও বায়োলজিক্যাল পুষ্টির আণবিক কনফিগারেশন এবং বিশেষ ভূ-তাত্ত্বিক পরিবেশের রেফারেন্স।"
  },
  2: {
    meta_bn: "সিগন্যাল ডাউনলিংক স্টেশন",
    meta_en: "Signal Downlink Station & Frequency Coordinate",
    modern_translation_bn: "এবং সিনাই উপত্যকার সেই সুনির্দিষ্ট কসমিক ফ্রিকোয়েন্সি সিগন্যাল রিসিভিং স্টেশন বা তূর পর্বতের (وَطُورِ سِينِينَ) কোঅর্ডিনেটের রেফারেন্স দিচ্ছি—",
    modern_translation_en: "And by Mount Sinai—the designated cosmic frequency receiving station (Wa turi sinin);",
    lexicon_modern_notes: "وَطُورِ سِينِينَ — সিগন্যাল রিসিভিং স্টেশন: মহাজাগতিক ওহী ও ফ্রিকোয়েন্সি ডাউনলিংকের ঐতিহাসিক ভৌগোলিক নোড।"
  },
  3: {
    meta_bn: "সেন্ট্রাল সিকিউর ডাটা-হাব",
    meta_en: "Central Secure Geometric Data-Hub",
    modern_translation_bn: "এবং মানুষের সম্মিলিত চেতনার এই পরম নিরাপদ, নয়েজ-ফ্রি ও কেন্দ্রীয় জ্যামিতিক ডাটা-হাব তথা মক্কা নামক অবিক্ষুব্ধ শহরের (وَهَٰذَا الْبَلَدِ الْأَمِينِ) রেফারেন্স দিচ্ছি—",
    modern_translation_en: "And by this secure, noise-free, and central geometric data-hub of Makkah (Wa hadhal-baladil-amin);",
    lexicon_modern_notes: "وَهَٰذَا الْبَلَدِ الْأَمِينِ — সেন্ট্রাল সিকিউর হাব: সম্মিলিত মানব চেতনার নিরাপদ, সুরক্ষিত ও কেন্দ্রীয় জ্যামিতিক ডেটা সেন্টার।"
  },
  4: {
    meta_bn: "দ্য মাস্টারপিস হিউম্যান আর্কিটেকচার কোড",
    meta_en: "The Masterpiece Human Neural Architecture",
    modern_translation_bn: "নিশ্চয়ই আমি কার্বন-ভিত্তিক এই বুদ্ধিবৃত্তিক প্রজাতি বা মানুষকে (الْإِنسَانَ) তার নিউরাল নেটওয়ার্ক, কগনিটিভ ব্রেন ও শারীরিক মেকানিজমে—মহাবিশ্বের সর্বোচ্চ, নিখুঁত ও সর্বোত্তম অপ্টিমাইজড কনফিগারেশনে (فِي أَحْسَنِ تَقْوِيمٍ) আর্কিটেক্ট বা সৃষ্টি করেছি;",
    modern_translation_en: "We have certainly created and engineered the human agent in the supreme, flawless, and most optimal cognitive configuration (Fi ahsani taqwim);",
    lexicon_modern_notes: "فِي أَحْسَنِ تَقْوِيمٍ — সুপ্রীম বায়ো-অপ্টিমাইজেশন: মানুষের নিউরাল নেটওয়ার্ক ও নিওকর্টেক্সকে সৃষ্টির সর্বোচ্চ ভারসাম্য ও নিখুঁত সক্ষমতায় আর্কিটেক্ট করা।"
  },
  5: {
    meta_bn: "কগনিটিভ ডাউনগ্রেডেশন ও সিস্টেমিক ক্র্যাশ মোড",
    meta_en: "Cognitive Downgradation & Systemic Crash Mode",
    modern_translation_bn: "অতঃপর সে যখন তার ফ্রি-উইলের অপব্যবহার করে মেইন ওওএস থেকে ডি-লিঙ্ক হয়—তখন সিস্টেমের স্বয়ংক্রিয় কাউন্টার-অ্যাকশনে আমি তাকে সর্বনিম্ন, ক্ষয়িষ্ণু ও এন্ট্রপি-যুক্ত চরম ডাউনগ্রেডেড ব্যাক-ট্র্যাকিং স্তরে (أَسْفَلَ سَافِلِينَ) রিভার্স ব্যাক বা পতিত করাই—",
    modern_translation_en: "Then We return and regress him to the lowest of the low in systemic degradation (Thumma radadnahu asfala safilin);",
    lexicon_modern_notes: "أَسْفَلَ سَافِلِينَ — কগনিটিভ রিগ্রেশন ও এন্ট্রপি পতন: ফ্রি-উইলের অপব্যবহারে ওওএস থেকে বিচ্ছিন্ন হয়ে চেতনার সর্বনিম্ন ও অবক্ষয়িত ডোমেইনে পতন।"
  },
  6: {
    meta_bn: "সিকিউরিটি ফিল্টার: ভেরিফাইড ইউজার ব্যাকআপ লুপ",
    meta_en: "Security Filter: Verified User Backup Loop",
    modern_translation_bn: "কেবলমাত্র সেইসব ভেরিফাইড ও রেজিস্টার্ড ইউজার নোড ব্যতীত—যারা পরম সোর্সের সাথে নিজেদের ওওএস সিনক্রোনাইজড রেখেছে (آمَنُوا) এবং সিস্টেমে অবিরত পজিটিভ এনার্জি ও ভারসাম্যমূলক অপ্টিমাইজড কর্ম ইনপুট (وَعَمِلُوا الصَّالِحَاتِ) দিয়েছে; তাদের প্রোফাইলে স্বয়ংক্রিয়ভাবে জেনারেট হতে থাকবে এক অন্তহীন, অবিনশ্বর ও নিরবচ্ছিন্ন এনার্জি রিওয়ার্ড বা আউটপুট (أَجْرُهُمْ غَيْرُ مَمْنُونٍ)।",
    modern_translation_en: "Except for those registered nodes who maintain systemic sync (Amanu) and execute continuous positive, constructive code (Wa 'amilus-salihati); for them is an uninterrupted and perpetual energy reward (Ajrun ghayru mamnun).",
    lexicon_modern_notes: "أَجْرُهُمْ غَيْرُ مَمْنُونٍ — নিরবচ্ছিন্ন এনার্জি রিওয়ার্ড: সিনক্রোনাইজড ইউজারদের জন্য সিস্টেমের স্বয়ংক্রিয় অবিনশ্বর আউটপুট ও ভারসাম্য লুপ।"
  },
  7: {
    meta_bn: "লজিক্যাল কাউন্টার-কুয়েরি",
    meta_en: "Logical Counter-Query & System Rejection Bug",
    modern_translation_bn: "অতএব এই পরম গাণিতিক ও বায়ো-লজিক্যাল রিয়্যালিটি ডিকোড হওয়ার পর—কোন কুযুক্তি বা ম্যালওয়্যার বাগ তোমার এই পিউর ইন্টারফেসে এসে এই ইউনিভার্সাল অপারেটিং সিস্টেম ও চূড়ান্ত ডাটা-রিসেট টাইম-লাইনকে (بِالدِّينِ) মিথ্যা বা রিজেক্ট করতে প্ররোচিত করতে পারে?",
    modern_translation_en: "So what then causes you to deny and reject the ultimate universal operating system and cosmic audit (Biddin)?",
    lexicon_modern_notes: "فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ — সিস্টেম রিজেকশন ফিল্টার: সুস্পষ্ট বৈজ্ঞানিক প্রমাণের পরও বিচার দিবস ও মহাজাগতিক বিধান অস্বীকার করার অযৌক্তিকতা।"
  },
  8: {
    meta_bn: "দ্য আল্টিমেট জিরো-এরর সুপ্রীম জাজ",
    meta_en: "The Ultimate Zero-Error Supreme Regulator",
    modern_translation_bn: "মহাজাগতিক আদি সোর্স কোড বা আল্লাহ কি মহাবিশ্বের সমস্ত অ্যালগরিদম, আইনি প্রসেসর ও অডিটিং সিস্টেমের চূড়ান্ত, সর্বোচ্চ ও জিরো-এরর সুপ্রীম রেগুলেটর বা বিচারক (بِأَحْكَمِ الْحَاكِمِينَ) নন?",
    modern_translation_en: "Is not Allah the ultimate, most just, and supreme algorithm-regulator of all judges and systems (Bi-ahkamil-hakimin)?",
    lexicon_modern_notes: "بِأَحْكَمِ الْحَاكِمِينَ — সুপ্রীম অ্যালগরিদমিক একাউন্টাবিলিটি: মহাবিশ্বের সমস্ত অডিট লেজার ও নিয়মের চূড়ান্ত, নিরপেক্ষ ও জিরো-এরর সুপ্রীম রেগুলেটর।"
  }
};

surah95.ayahs.forEach(a => {
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

fs.writeFileSync(surah95Path, JSON.stringify(surah95, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 95 (At-Tin) with 100% modern scientific translations and lexicons!');
