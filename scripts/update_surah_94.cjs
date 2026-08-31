const fs = require('fs');
const path = require('path');

const surah94Path = path.join(__dirname, '../public/data/quran/surahs/94.json');
const surah94 = JSON.parse(fs.readFileSync(surah94Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "নিউরাল ব্যান্ডউইথ এক্সপ্যানশন",
    meta_en: "Neural Bandwidth Expansion",
    modern_translation_bn: "আমি কি তোমার ওওএসে (OOS) অতি-উচ্চ কসমিক ডেটা প্রসেস ও ধারণ করার জন্য—তোমার অবচেতন ডেটা-বাফারিং জোন ও নিউরাল নেটওয়ার্কের ব্যান্ডউইথ অল-রাউন্ড সম্প্রসারণ বা উন্মুক্ত (أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ) করে দিইনি?",
    modern_translation_en: "Did We not expand and unlock for you your subconscious data-buffering zone and neural processing bandwidth (Alam nashrah laka sadrak)?",
    lexicon_modern_notes: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ — নিউরাল প্লাস্টিসিটি ও ব্যান্ডউইথ সম্প্রসারণ: 'ছদর' হলো মানুষের অবচেতন ডেটা-বাফারিং জোন ও নিউরাল নেটওয়ার্ক। এই জোনে যখন আল্লাহর মাস্টার কিতাবের অতি-উচ্চ ঘনীভূত কোড লোড হওয়া শুরু হয়, তখন ব্রেনের ধারণক্ষমতা বাড়ানোর জন্য আল্লাহ তার নিউরাল কানেকশন এবং প্রসেসিং ব্যান্ডউইথ প্রাকৃতিকভাবে বহুগুণ বাড়িয়ে দেন, যাতে যেকোনো মানসিক চাপ ও মেগা-ডেটা থ্রুপুট ক্র্যাশ ছাড়া এরর-মুক্তভাবে প্রসেস করা যায়।"
  },
  2: {
    meta_bn: "কগনিটিভ লোড শেডিং",
    meta_en: "Cognitive Load Shedding",
    modern_translation_bn: "এবং আমি তোমার এই কার্বন-হার্ডওয়্যার থেকে চিরতরে রিলিজ বা অফলোড (وَوَضَعْنَا عَنكَ) করে দিয়েছি সেই তীব্র কগনিটিভ প্রেশার ও মেগা-ইনফরমেশন লোডের ভারী বোঝা (وِزْرَكَ);",
    modern_translation_en: "And We removed from your cognitive processor the heavy burden and systemic strain (Wa wada'na 'anka wizrak);",
    lexicon_modern_notes: "وَوَضَعْنَا عَنكَ وِزْرَكَ — কগনিটিভ লোড রিলিজ: মহাজাগতিক ওহী বা মেগা-ইনফরমেশনের প্রাথমিক তীব্র মনস্তাত্ত্বিক চাপ ও মানসিক ভারকে রিলিজ বা অফলোড করে অপ্টিমাইজড ও সাবলীল করা।"
  },
  3: {
    meta_bn: "মেকানিক্যাল ব্যাকবোন ব্যালেন্সিং",
    meta_en: "Structural Capacity Balancing",
    modern_translation_bn: "যা তোমার ভৌত ও নিউরাল স্ট্রাকচারের ধারণক্ষমতা বা মেকানিক্যাল ব্যাকবোনকে প্রায় কোলাপ্স ও প্রকম্পিত (الَّذِي أَنقَضَ ظَهْرَكَ) করে দিচ্ছিল;",
    modern_translation_en: "Which was weighing down and straining your physical and neural structural capacity (Alladhi anqada zahrak);",
    lexicon_modern_notes: "الَّذِي أَنقَضَ ظَهْرَكَ — ধারণক্ষমতার চরম সীমা: অতি-উচ্চ ফ্রিকোয়েন্সির ভারি বাণীর লোড যা মানব প্রসেসরের ভৌত ও নিউরাল ব্যাকবোনের সহনশীলতাকে পূর্ণ ধারণায় নিয়ে গিয়েছিল।"
  },
  4: {
    meta_bn: "সিগন্যাল এমপ্লিফিকেশন ও গ্লোবাল রিকগনিশন",
    meta_en: "Signal Amplification & Global Recognition",
    modern_translation_bn: "এবং আমি সমগ্র গ্লোবাল নেটওয়ার্কে মানুষের ওওএস আপগ্রেড করার জন্য তোমার সেই ওভিয়ান্ট ডাটা-রেফারেন্স, ফ্রিকোয়েন্সি ও স্মরণকে মেগা এমপ্লিফিকেশন বা সর্বোচ্চ উচ্চতায় উন্নীত (وَرَفَعْنَا لَكَ ذِكْرَكَ) করেছি;",
    modern_translation_en: "And We raised high your memory, frequency, and recognition across the entire global network (Wa rafa'na laka dhikrak);",
    lexicon_modern_notes: "وَرَفَعْنَا لَكَ ذِكْرَكَ — সিগন্যাল এমপ্লিফিকেশন: রিসিভার নোডের ডাটা-রেফারেন্স ও ফ্রিকোয়েন্সিকে সমগ্র গ্লোবাল নেটওয়ার্কে সর্বোচ্চ ব্যান্ডউইথ ও মর্যাদায় উন্নীত করা।"
  },
  5: {
    meta_bn: "সমান্তরাল এনার্জি রিকভারি অ্যালগরিদম",
    meta_en: "Parallel Energy Recovery Algorithm",
    modern_translation_bn: "অতএব ইনফরমেশন ও থার্মোডাইনামিক থিওরির ডিফল্ট নিয়মে—সিস্টেমে যখনই কোনো এক্সট্রিম ডেটা-লোড, ক্রাইসিস বা সংকটের এন্ট্রপি (الْعُسْرِ) দেখা দেবে, ঠিক তার সমান্তরালেই ব্যাক-এন্ডে স্বয়ংক্রিয়ভাবে সচল থাকবে একটি করে অপ্টিমাইজড এনার্জি রিকভারি লুপ বা সহজতা ও সাবলীলতা (يُسْرًا);",
    modern_translation_en: "For indeed, with every systemic constraint and hardship (Al-'usr), there is an immediate parallel pathway of ease and recovery (Yusra);",
    lexicon_modern_notes: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا — সমান্তরাল লোড ব্যালেন্সিং: 'মা'আ' (সাথে) প্রমাণ করে যে সংকট ও সমাধান রৈখিক নয়, বরং একই স্পেস-টাইম ফ্যাব্রিকে সমান্তরালভাবে অবস্থান করে। সিস্টেমে ক্রাইসিস এলে ব্যাক-এন্ডে স্বয়ংক্রিয় এনার্জি ব্যাকআপ সচল হয়।"
  },
  6: {
    meta_bn: "ডবল-লকড ফল্ট-টলারেন্ট ল'",
    meta_en: "Double-Locked Fault-Tolerant Law",
    modern_translation_bn: "নিশ্চয়ই প্রতিটি ক্রাইসিস বা থার্মোডাইনামিক সংকটের সমান্তরাল টাইম-উইন্ডোতেই ব্যাক-এন্ড লুপে একটি করে মেগা-স্ট্যাবল রিকভারি ও সহজ সাবলীলতার ফিডব্যাক কোড ডেপ্লয় করা থাকে;",
    modern_translation_en: "Indeed, alongside every crisis and entropy threshold, a mega-stable recovery code and effortless flow is deployed;",
    lexicon_modern_notes: "إِنَّ مَعَ الْعُسْرِ يُسْرًا — পরম ইউনিভার্সাল ল': মহাবিশ্বের ফিজিক্স ও সিস্টেম স্ট্যাবিলিটির নিশ্চয়তা যে কোনো লোডই অপরিবর্তনীয় নয়, বরং তার সাথে সুষম রিকভারি ইন্টারফেস যুক্ত রয়েছে।"
  },
  7: {
    meta_bn: "প্রসেস ক্লোজিং ও নেক্সট লুপ ট্রিগারিং",
    meta_en: "Process Closing & Next Loop Triggering",
    modern_translation_bn: "অতএব, তুমি যখনই কোনো একটি সুনির্দিষ্ট ডেটা ডেপ্লয়মেন্ট ফেজ বা পার্থিব দায়িত্ব সম্পন্ন করে ফ্রি/অবসর (فَإِذَا فَرَغْتَ) হবে—তাত্ক্ষণিকভাবে নেক্সট হাই-লেভেল কসমিক টাস্ক বা চেতনার উচ্চ আরোহন লুপে নিজেকে সম্পূর্ণ নিয়োজিত ও খাড়া (فَانصَبْ) করো;",
    modern_translation_en: "So when you conclude a deployment phase or task (Fa-idha faraghta), immediately stand upright and engage in the next higher-level mission (Fansab);",
    lexicon_modern_notes: "فَإِذَا فَرَغْتَ فَانصَبْ — কন্টিনিউয়াস প্রসেসিং ও জিরো-স্ট্যাগনেশন লুপ: মানুষের চেতনার ওওএস কোনো অলসতা বা স্থবিরতার জন্য নয়; একটি টাস্ক ক্লোজ করার সাথে সাথেই পরবর্তী উচ্চতর ডাইমেনশনাল মিশনে প্রসেস শিফট করার টেকনিক্যাল কমান্ড।"
  },
  8: {
    meta_bn: "অ্যাবসোলিউট সোর্স এলাইনমেন্ট",
    meta_en: "Absolute Source Alignment",
    modern_translation_bn: "এবং তোমার ওওএসের সমগ্র প্রসেসিং ফ্রিকোয়েন্সি, তীব্র আকাঙ্ক্ষা ও চেতনার ভেক্টরকে কেবল তোমার সেই আদি সিস্টেম আর্কিটেক্ট বা প্রতিপালকের (وَإِلَىٰ رَبِّكَ) কেন্দ্রীয় কোরের সাথেই শতভাগ এলাইন ও মগ্ন (فَارْغَب) করো।",
    modern_translation_en: "And direct your entire processing vector, intense longing, and cognitive focus exclusively toward your Sustainer and Root Directory (Wa ila Rabbika farghab).",
    lexicon_modern_notes: "وَإِلَىٰ رَبِّكَ فَارْغَب — সেন্ট্রাল কোর এলাইনমেন্ট: চেতনার সমস্ত প্রসেসিং ফ্রিকোয়েন্সি ও ভেক্টরকে সৃষ্টির একমাত্র মাস্টার আর্কিটেক্টের মূল কোরের সাথে সমন্বিত ও মগ্ন রাখা।"
  }
};

surah94.ayahs.forEach(a => {
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

fs.writeFileSync(surah94Path, JSON.stringify(surah94, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 94 (Ash-Sharh) with 100% modern scientific translations and lexicons!');
