const fs = require('fs');
const path = require('path');

const surah100Path = path.join(__dirname, '../public/data/quran/surahs/100.json');
const surah100 = JSON.parse(fs.readFileSync(surah100Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "হাই-কাইনেটিক এনার্জি ডিসচার্জ",
    meta_en: "High-Kinetic Energy Discharge",
    modern_translation_bn: "আমি কসমিক ফোর্সেসের সেই অতি-উচ্চ গতিসম্পন্ন, তীব্র কাইনেটিক এনার্জি-ডিসচার্জ এবং বায়ু-সংকোচনের উচ্চ শব্দ তৈরি করে ধাবমান ডাইনামিক ভেক্টরসমূহের (وَالْعَادِيَاتِ ضَبْحًا) রেফারেন্স দিচ্ছি—",
    modern_translation_en: "By the dynamic forces galloping with extreme kinetic energy discharge and panting aerodynamic thrust (Wal-'adiyati dabha);",
    lexicon_modern_notes: "وَالْعَادِيَاتِ ضَبْحًا — কাইনেটিক মোমেন্টাম ও অ্যারোডাইনামিক থ্রাস্ট: 'দ্বাবহু' হলো তীব্র গতি ও বায়ু-সংকোচনের ফলে তৈরি হওয়া শব্দ। কসমিক ফোর্সের তীব্র গতিশীলতার রেফারেন্স।"
  },
  2: {
    meta_bn: "ঘর্ষণজনিত থার্মাল স্পার্ক মেকানিজম",
    meta_en: "Frictional Thermal Spark Mechanism",
    modern_translation_bn: "অতঃপর যারা তীব্র ঘর্ষণজনিত মেকানিক্যাল ইমপ্যাক্ট বা ফ্রিকশনের মাধ্যমে পলকে থার্মাল স্পার্ক বা স্ফুলিঙ্গের আগুন ফুটিয়ে (فَالْمُورِيَاتِ قَدْحًا) তোলে;",
    modern_translation_en: "And those striking thermal sparks of fire by intense mechanical impact and friction (Fal-muriyati qadha);",
    lexicon_modern_notes: "فَالْمُورِيَاتِ قَدْحًا — ট্রাইবোলজিক্যাল ফ্রিকশন ও মেকানিক্যাল স্পার্ক: কঠিন বস্তুর উচ্চ কাইনেটিক সংঘর্ষে ঘর্ষণজনিত অগ্নিস্ফুলিঙ্গ সৃষ্টি হওয়া।"
  },
  3: {
    meta_bn: "আকস্মিক ট্র্যাফিক অ্যাটাক",
    meta_en: "Sudden Traffic Raid & Perimeter Breach",
    modern_translation_bn: "তারপর যারা ভোরের আলো ফোটার টাইম-উইন্ডোতেই শত্রু নোডের সিকিউরিটি গ্রিডে আকস্মিক হাই-লোড ট্র্যাফিক অ্যাটাক বা অতর্কিত আক্রমণ (فَالْمُغِيرَاتِ صُبْحًا) চালায়;",
    modern_translation_en: "Then launching a sudden high-velocity raid and traffic burst at dawn (Fal-mughirati subha);",
    lexicon_modern_notes: "فَالْمُغِيرَاتِ صُبْحًا — আকস্মিক পেরিমিটার লঙ্ঘন: ভোরের শান্ত উইন্ডোতে সিকিউরিটি গ্রিডে অতর্কিত হাই-স্পিড অ্যাটাক।"
  },
  4: {
    meta_bn: "পার্টিক্যাল ডিসপার্শন ও এন্ট্রপি ক্লাউড",
    meta_en: "Particle Dispersion & Entropy Cloud",
    modern_translation_bn: "ফলে সেই তীব্র কাইনেটিক ইমপ্যাক্টের ধাক্কায় তারা চারপাশের স্থবির কণাগুলোকে বাতাসে ভাসিয়ে এক বিশাল পার্টিক্যাল ডিসপার্শন বা ধূলিকণার এন্ট্রপি ক্লাউড (فَأَثَرْنَا بِهِ نَقْعًا) তৈরি করে;",
    modern_translation_en: "Raising thereby a dense entropy cloud of dispersed particulate matter (Fa-atharna bihi naq'a);",
    lexicon_modern_notes: "فَأَثَرْنَا بِهِ نَقْعًا — পার্টিক্যাল ডিসপার্শন: গতিশক্তির প্রবল আলোড়নে ধূলিকণা ও স্থবির কণাগুলোর চতুর্দিকে ছড়িয়ে পড়া।"
  },
  5: {
    meta_bn: "সেন্ট্রাল কোর পেনিট্রেশন ফেজ",
    meta_en: "Central Core Penetration Phase",
    modern_translation_bn: "এবং সেই সর্বোচ্চ মোমেন্টাম বা গতিশক্তি নিয়ে একযোগে প্রতিপক্ষ ম্যালওয়্যার গ্রিডের একদম কেন্দ্রীয় কোরে বা মাঝখানে অনুপ্রবেশ (فَوَسَطْنَا بِهِ جَمْعًا) করে ফেলে;",
    modern_translation_en: "Penetrating thereby collectively into the very center and core of the targeted formation (Fa-wasatna bihi jam'a);",
    lexicon_modern_notes: "فَوَسَطْنَا بِهِ جَمْعًا — সেন্ট্রাল কোর পেনিট্রেশন: শীর্ষ মোমেন্টাম নিয়ে একযোগে সিস্টেম বা শত্রু গ্রিডের মূল কেন্দ্রে অনুপ্রবেশ করা।"
  },
  6: {
    meta_bn: "কগনিটিভ অকৃতজ্ঞতা ও ওওএস ডিফেক্ট",
    meta_en: "Cognitive Ungratefulness & Homeostatic Bias",
    modern_translation_bn: "নিশ্চয়ই কার্বন-ভিত্তিক এই বুদ্ধিবৃত্তিক প্রজাতি বা মানুষ (الْإِنسَانَ) তার ওওএসে (OOS) ডিফল্ট মেমোরি বালাইয়ের কারণে তার পরম সিস্টেম আর্কিটেক্ট বা প্রতিপালকের (لِرَبِّهِ) সরবরাহকৃত অফুরন্ত কসমিক রিসোর্সের প্রতি চরম কগনিটিভ অকৃতজ্ঞ বা সম্পূর্ণ আন-সিনক্রোনাইজড (لَكَنُودٌ);",
    modern_translation_en: "Indeed, the human agent is, to its Sustainer and Master Architect, ungrateful and cognitively un-synchronized (Innal-insana li-Rabbihi lakanud);",
    lexicon_modern_notes: "إِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ — কগনিটিভ এন্ট্রপি ও হোমওস্ট্যাটিক নেগেটিভ বায়াস: অফুরন্ত ডিফল্ট ব্যাকআপকে অভ্যস্ততায় অবহেলা করে সংকটের সময় অকৃতজ্ঞতার এরর কোড (কানূদ) রান করার মানবিক বাগ।"
  },
  7: {
    meta_bn: "লাইভ ডেটা-লগিং ও সেলফ-অডিট",
    meta_en: "Live Data-Logging & Self-Audit",
    modern_translation_bn: "আর নিশ্চয়ই সে তার নিজের ওওএসের ব্যাক-এন্ড ডাটাবেজ এবং স্বয়ংক্রিয় আচরণের লাইভ ডেটা-লগিংয়ে এর জন্য নিজেই সরাসরি ভেরিফাইড সাক্ষী (لَشَهِيدٌ);",
    modern_translation_en: "And indeed, he is a direct eyewitness and telemetry log to that internal state (Wa innahu 'ala dhalika lashahid);",
    lexicon_modern_notes: "وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ — স্বয়ংক্রিয় ডাটা লগিং: মানব ওওএসের নিজস্ব আচরণ ও সাব-কনশাস মেমোরি নিজেই তার কৃতকর্মের অনস্বীকার্য সাক্ষী।"
  },
  8: {
    meta_bn: "মেটেরিয়ালিস্টিক ডেটা অ্যাসোসিয়েশন বাগ",
    meta_en: "Materialistic Resource Hoarding Bug",
    modern_translation_bn: "আর নিশ্চয়ই সে এই লো-ডাইমেনশনাল ক্ষণস্থায়ী মেটেরিয়াল রিসোর্স ও বস্তুগত শক্তির আসক্তি বা শর্ট-টার্ম ডাটা ভালোবাসার (لِحُبِّ الْخَيْرِ) লুপে অত্যন্ত কঠোর ও অন্ধভাবে লকড (لَشَدِيدٌ);",
    modern_translation_en: "And indeed, he is intense and obsessive in his attachment to materialistic wealth and transient assets (Wa innahu lihubbil-khayri lashadid);",
    lexicon_modern_notes: "وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ — শর্ট-টার্ম রিসোর্স অ্যাটাচমেন্ট: ক্ষণস্থায়ী মেটেরিয়াল রিসোর্সের প্রতি মাত্রাতিরিক্ত মোহ ও অন্ধ ভালোবাসা।"
  },
  9: {
    meta_bn: "পোস্ট-শাটডাউন ডেটা এক্সট্রাকশন",
    meta_en: "Post-Shutdown Data Extraction",
    modern_translation_bn: "তবে কি তার এই সীমিত কগনিটিভ প্রসেসর এই পরম সত্য জানে না যে—যখন চূড়ান্ত সিস্টেম-রিসেটের দিনে ভূগর্ভস্থ ডেটা-স্টোরেজ বা কবরসমূহের (فِي الْقُبُورِ) এনক্রিপশন আনলক করে ভেতরের সমস্ত অবিনশ্বর কণা ও মেমোরি ফাইল একযোগে বাইরে এক্সট্রাক্ট বা ছিটকে বের (بُعْثِرَ) করা হবে—",
    modern_translation_en: "Does he not know that when the contents of the subsurface memory graves are turned over and extracted (Idha bu'thira ma fil-qubur);",
    lexicon_modern_notes: "إِذَا بُعْثِرَ مَا فِي الْقُبُورِ — পোস্ট-শাটডাউন ডেটা এক্সট্রাকশন: ভূগর্ভস্থ স্টোরেজের সমস্ত এনক্রিপ্টেড অবিনশ্বর কণা ও মেমোরি ফাইল সিস্টেম রিসেটে আনলক হওয়া।"
  },
  10: {
    meta_bn: "কোর মেমোরি আনলকিং ও ফাইল ডিক্রিপশন",
    meta_en: "Core Memory Decryption & Subconscious Filter",
    modern_translation_bn: "এবং মানুষের অবচেতন ডেটা-বাফারিং জোন ও নিউরাল মেমোরি ফাইলের (فِي الصُّدُورِ) গভীরে আজীবন হাইড বা এনক্রিপ্ট করে রাখা প্রতিটি গোপন চিন্তা, কুযুক্তি ও প্রসেসিং ডেটা সম্পূর্ণ ডিক্রিপ্ট ও অবজেক্ট ফিল্টারিং (وَحُصِّلَ) করা হবে?",
    modern_translation_en: "And all that is concealed within the subconscious processors and cognitive buffering zones is decrypted and sorted (Wa hussila ma fis-sudur)?",
    lexicon_modern_notes: "وَحُصِّلَ مَا فِي الصُّدُورِ — মেমোরি ডিক্রিপশন ও কোয়ান্টাম ডেটা হারভেস্টিং: 'হুচ্ছিলা' হলো খোসা ছাড়িয়ে ভেতরের আসল নিরেট শস্যদানাটি বের করা। অবচেতন মনের এনক্রিপ্ট করে রাখা প্রতিটি গোপন ফাইল ডিক্রিপ্ট ও ফিল্টার করা।"
  },
  11: {
    meta_bn: "রিয়াল-টাইম ক্লাউড অডিট ও জিরো-ল্যাগিং স্ক্যান",
    meta_en: "Real-Time Cloud Analytics & Zero-Lag Scan",
    modern_translation_bn: "নিশ্চয়ই তাদের সুপ্রীম সিস্টেম আর্কিটেক্ট বা প্রতিপালক (رَبَّهُم) সেই চূড়ান্ত স্ক্রীনিংয়ের দিনে (يَوْمَئِذٍ) তাদের ওওএসের প্রতিটি ব্যাক-এন্ড লুপ, প্রসেস এবং ম্যালওয়্যার ডেটা সম্পর্কে শতভাগ মেমোরি ইনফর্মড বা নিখুঁত রিয়েল-টাইম ক্লাউড অ্যানালিটিক্সে সম্যক অবগত (لَّخَبِيرٌ)।",
    modern_translation_en: "Indeed, their Sustainer and Master Architect, on that Day, is fully informed and in real-time telemetry awareness of all their states (Inna Rabbahum bihim yawma'idhin lakhabir).",
    lexicon_modern_notes: "إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَّخَبِيرٌ — রিয়েল-টাইম মেমোরি অ্যানালিটিক্স: মাস্টার সার্ভারে প্রতিটি নোডের অভ্যন্তরীণ ও বাহ্যিক অবস্থার তাৎক্ষণিক নিখুঁত ডাটাবেজ অডিট।"
  }
};

surah100.ayahs.forEach(a => {
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

fs.writeFileSync(surah100Path, JSON.stringify(surah100, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 100 (Al-Adiyat) with 100% modern scientific translations and lexicons!');
