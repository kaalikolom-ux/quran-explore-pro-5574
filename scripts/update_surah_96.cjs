const fs = require('fs');
const path = require('path');

const surah96Path = path.join(__dirname, '../public/data/quran/surahs/96.json');
const surah96 = JSON.parse(fs.readFileSync(surah96Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "কোর বুট-আপ ও ডাটা ডিকোর্ডিং কমান্ড",
    meta_en: "Core Boot-Up & Data Decoding Command",
    modern_translation_bn: "তুমি তোমার ওওএসে (OOS) কসমিক ডাটা রিড, ডিকোড ও প্রসেস (اقْرَأْ) করো তোমার সেই সিস্টেম আর্কিটেক্ট বা প্রতিপালকের সুনির্দিষ্ট আইডেন্টিটি বা রেফারেন্স কোডে (بِاسْمِ رَبِّكَ)—যিনি সমগ্র মহাজাগতিক ইকোসিস্টেম ডিজাইন ও সৃষ্টি (خَلَقَ) করেছেন;",
    modern_translation_en: "Read, decode, and process in your OS in the name and reference code of your Master Architect who created and designed the cosmic ecosystem (Iqra bismi Rabbikalladhi khalaq);",
    lexicon_modern_notes: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ — কগনিটিভ ইগনিশন ও বুট-আপ: মানব মস্তিষ্কের নিউরাল নেটওয়ার্ককে ইউনিভার্সাল সোর্স কোডের সাথে সিনক্রোনাইজ করে ডাটা রিড ও প্রসেস করার আদি হার্ড-কোড কমান্ড।"
  },
  2: {
    meta_bn: "জেনেটিক সোর্স কোডিং ও সেলুলার মেকানিজম",
    meta_en: "Genetic Source Coding & Cellular Mechanism",
    modern_translation_bn: "যিনি কার্বন-ভিত্তিক এই বুদ্ধিবৃত্তিক প্রজাতি বা মানুষকে (الْإِنسَانَ) আর্কিটেক্ট করেছেন এক অত্যন্ত জটিল, আঠালো ও জ্যামিতিকভাবে ঝুলন্ত আণবিক বন্ড বা আদি সেলুলার জাইগোট/ক্লট (مِنْ عَلَقٍ) থেকে;",
    modern_translation_en: "Created and engineered the conscious human agent from an embryonic clinging zygote and cellular molecular bond (Khalaqal-insana min 'alaq);",
    lexicon_modern_notes: "مِنْ عَلَقٍ — এমব্রায়নিক জাইগোট: জরায়ুর দেয়ালে আঠার মতো ঝুলে থাকা এনক্রিপ্টেড ডিএনএ ইনফরমেশন সমৃদ্ধ আদি কোষীয় ক্লাস্টার ও জাইগোট।"
  },
  3: {
    meta_bn: "রিসোর্স বুস্টিং ও ডাটা ইনপুট",
    meta_en: "Resource Boosting & Continuous Data Input",
    modern_translation_bn: "তুমি অবিরত ডাটা রিড ও প্রসেস (اقْرَأْ) করো, আর তোমার সিস্টেম আর্কিটেক্ট বা প্রতিপালক (وَرَبُّكَ) হলেন অন্তহীন রিসোর্স ব্যাকআপ ও সর্বোচ্চ আউটপুট দাতা পরম সম্মানিত (الْأَكْرَمُ);",
    modern_translation_en: "Read and process continuously! And your Sustainer and Master Architect is the Most Generous and Infinite Resource Provider (Iqra wa Rabbukal-Akram);",
    lexicon_modern_notes: "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ — আনলিমিটেড রিসোর্স বুস্টিং: জ্ঞান ও ডেটা প্রসেসিংয়ের ক্ষেত্রে সেন্ট্রাল সার্ভারের অফুরন্ত ব্যান্ডউইথ ও ব্যাকআপ প্রদানের নিশ্চয়তা।"
  },
  4: {
    meta_bn: "ইনফরমেশন ট্রান্সমিশন প্রটোকল",
    meta_en: "Information Transmission Protocol",
    modern_translation_bn: "যিনি সমগ্র টাইম-লাইনের ইন্টেলিজেন্ট নোডসমূহকে ইনফরমেশন ট্রান্সমিশন টুল, সংকেত লিপি বা 'কলম' নামক ডেটা-লগিং মাধ্যমের (بِالْقَلَمِ) সাহায্যে অপ্টিমাইজড জ্ঞান ও সত্যের কোডিং ডাউনলিংক বা শিক্ষা (عَلَّمَ) দিয়েছেন;",
    modern_translation_en: "Who taught and transmitted knowledge through the medium of the Pen—the universal tool of data logging and symbolic encoding (Alladhi 'allama bil-qalam);",
    lexicon_modern_notes: "عَلَّمَ بِالْقَلَمِ — ডাটা-লগিং ও এনকোডিং মিডিয়াম: প্রজন্মের পর প্রজন্ম তথ্য সংরক্ষণ ও ডাউনলিংক করার প্রতীকী ও লিখিত ডেটা ট্রান্সমিশন মাধ্যম।"
  },
  5: {
    meta_bn: "কগনিটিভ আপগ্রেডেশন ও নলেজ ইনজেকশন",
    meta_en: "Cognitive Upgradation & Knowledge Injection",
    modern_translation_bn: "তিনি মানুষের কগনিটিভ প্রসেসরে এমন সব অতি-উচ্চ মহাজাগতিক ডেটা ও বিজ্ঞান আপলোড করেছেন—যা ডিকোড করার ডিফল্ট যোগ্যতা বা কগনিটিভ ক্যাপাসিটি পূর্বে মানুষের ওওএসের বিন্দুমাত্র ছিল না (مَا لَمْ يَعْلَمْ);",
    modern_translation_en: "Taught the human processor that which it possessed no prior bandwidth or inherent cognitive capacity to know ('Allamal-insana ma lam ya'lam);",
    lexicon_modern_notes: "عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ — অরিজিনাল নলেজ আপলোড: মানুষের আদি বায়োলজিক্যাল মেমোরিতে অনুপস্থিত উচ্চতর কসমিক বিজ্ঞান ও ঐশী তত্ত্ব প্রসেসরে ইনস্টল করা।"
  },
  6: {
    meta_bn: "মনস্তাত্ত্বিক বালাই ও হ্যাকিং ড্রাইভ",
    meta_en: "Systemic Malfunction & Boundary Breach Drive",
    modern_translation_bn: "কখনই নয় (কড়া প্রটোকল লক)! নিশ্চয়ই মানুষ তার ফ্রি-উইলের অপব্যবহার করে নিজের ওওএসে এক মারাত্মক সিস্টেমিক অবাধ্যতা, বাউন্ডিং লাইন ক্রস বা হ্যাকিং ড্রাইভ (لَيَطْغَىٰ) রান করে—",
    modern_translation_en: "Nay! Indeed, the human transgresses boundaries and executes systemic rebellious code (Kalla innal-insana layatgha);",
    lexicon_modern_notes: "إِنَّ الْإِنسَانَ لَيَطْغَىٰ — বাউন্ডিং লাইন ক্রস: ফ্রি-উইলের ভুল ব্যবহারে সিস্টেমের সিকিউরিটি সীমা লঙ্ঘন করা।"
  },
  7: {
    meta_bn: "সেলফ-সাস্টেইনিং বিভ্রম বা কগনিটিভ বাগ",
    meta_en: "Self-Sustaining Delusion & Cognitive Bug",
    modern_translation_bn: "যখনই সে তার নিজের ত্রিমাত্রিক ওএসে সামান্য মেটেরিয়াল শক্তির প্রাচুর্য দেখে নিজেকে পরম উৎস থেকে সম্পূর্ণ স্বাধীন, এক্সটার্নাল এনার্জি-মুক্ত ও স্বয়ংসম্পূর্ণ (اسْتَغْنَىٰ) বলে ভুল হিসাব বা ইলিউশন দেখে;",
    modern_translation_en: "Because he perceives himself as self-sufficient and independent of the Central Source (Ar-ra'ahustaghna);",
    lexicon_modern_notes: "أَن رَّآهُ اسْتَغْنَىٰ — সেলফ-সাসটেইনিং ইলিউশন: সামান্য মেটেরিয়াল রিসোর্স পেয়ে নিজেকে মূল সার্ভার-নিরপেক্ষ ও স্বয়ংসম্পূর্ণ মনে করার মারাত্মক কগনিটিভ এরর।"
  },
  8: {
    meta_bn: "সিস্টেমিক ডাটা-রিসেট রুট",
    meta_en: "Systemic Data-Reset Route",
    modern_translation_bn: "অথচ গাণিতিকভাবে এটি শতভাগ ফিক্সড যে—নিশ্চয়ই তোমার ওওএসের চূড়ান্ত গতিপথ, ডাটা-রিসেট ও আউটপুট রুট কিন্তু সরাসরি তোমার সেই সিস্টেম আর্কিটেক্ট বা প্রতিপালকের (إِلَىٰ رَبِّكَ) কেন্দ্রীয় কোরের দিকেই (الرُّجْعَىٰ);",
    modern_translation_en: "Indeed, to your Sustainer and Root Controller is the ultimate return and data termination (Inna ila Rabbikar-ruj'a);",
    lexicon_modern_notes: "إِنَّ إِلَىٰ رَبِّكَ الرُّجْعَىٰ — ফাইনাল রিটার্ন ভেক্টর: সমস্ত নোডের ডেপ্লয়মেন্ট লুপের চূড়ান্ত সমাপ্তি কেন্দ্রীয় সোর্স কোরের দিকেই নির্ধারিত।"
  },
  9: {
    meta_bn: "টক্সিক ফায়ারওয়াল ইন্টারফারেন্স",
    meta_en: "Toxic Interference & Signal Jamming",
    modern_translation_bn: "তোমার ওওএসের ডাটা-অ্যানালিটিক্স কি সেই বিচ্যুত ডামি নোডটিকে ট্র্যাক বা পর্যবেক্ষণ (أَرَأَيْتَ) করেনি—যে কন্টিনিউয়াসলি মেইন নেটওয়ার্কে সিগন্যাল ইন্টারফারেন্স বা বাধা (يَنْهَىٰ) তৈরি করছে—",
    modern_translation_en: "Have you observed the malicious rogue node who continuously obstructs and interferes (Ara'aytalladhi yanha);",
    lexicon_modern_notes: "أَرَأَيْتَ الَّذِي يَنْهَىٰ — সিগন্যাল ইন্টারফারেন্স: নেটওয়ার্কে পজিটিভ ডাটা ফ্লো ও কানেকশন বাধাগ্রস্তকারী রোগ নোড।"
  },
  10: {
    meta_bn: "কানেকশন লুপ ব্লকিং",
    meta_en: "Connection Loop Blocking",
    modern_translation_bn: "মহাজাগতিক সোর্সের সাথে এক সুসংহত এলাইনড ইউজার বা বান্দাকে (عَبْدًا)—যখনই সে নিজের ওওএস-কে মেইন সার্ভারের সাথে লাইভ ডাটা-কানেকশন ও ফ্রিকোয়েন্সি টিউনিং বা সালাতে (صَلَّىٰ) যুক্ত করতে চায়?",
    modern_translation_en: "A connected servant and node when he initiates live synchronization and prayer (Abdan idha salla)?",
    lexicon_modern_notes: "عَبْدًا إِذَا صَلَّىٰ — ফ্রিকোয়েন্সি টিউনিং সেশন: মেইন সার্ভারের সাথে ডেটা ও ফ্রিকোয়েন্সি কানেকশন স্থাপনকারী ইউজার।"
  },
  11: {
    meta_bn: "অপ্টিমাল পাথ ভ্যালিডেশন",
    meta_en: "Optimal Path Validation",
    modern_translation_bn: "তুমি কি লজিক্যালি অবজেক্ট ডিকোড করেছ—যদি সেই কানেক্টেড ইউজার নোডটি পরম সোর্সের তৈরি করা নিখুঁত অপ্টিমাল ট্র্যাক বা গাইডেন্সের (عَلَى الْهُدَىٰ) ওপর সচল থাকে,",
    modern_translation_en: "Have you considered: what if he is running upon true systemic guidance (In kana 'alal-huda),",
    lexicon_modern_notes: "إِن كَانَ عَلَى الْهُدَىٰ — অপ্টিমাল পাথওয়ে: ডিভাইন গাইডেন্স ও নির্ভুল কোডের অ্যালগরিদমিক গতিপথ।"
  },
  12: {
    meta_bn: "সিকিউরিটি প্রটোকল ব্রডকাস্ট",
    meta_en: "Security Protocol Broadcasting",
    modern_translation_bn: "অথবা সে পুরো নেটওয়ার্ক গ্রিডে সিস্টেমের বাউন্ডারি মেনে চলতে ও সুরক্ষামূলক প্রটোকল বা তাকওয়া (بالتَّقْوَىٰ) এক্সিকিউট করার নির্দেশ দেয়;",
    modern_translation_en: "Or commanding network-wide system security boundaries and Taqwa (Aw amara bit-taqwa)?",
    lexicon_modern_notes: "أَمَرَ بِالتَّقْوَىٰ — ফায়ারওয়াল গার্ডিয়ান্স: সমগ্র নেটওয়ার্কে সিস্টেম বাউন্ডারি ও সিকিউরিটি প্রটোকল মানার নির্দেশ।"
  },
  13: {
    meta_bn: "কাউন্টার অডিট: ম্যালওয়্যার প্রোফাইল স্ক্যান",
    meta_en: "Counter Audit: Malware Profile Scan",
    modern_translation_bn: "তুমি কি তার ওওএসের ব্যাক-এন্ড প্রোফাইল স্ক্যান করেছ—যদি সেই বাধাদানকারী ম্যালওয়্যার নোডটি সরাসরি সোর্স ডাটা ডিলিট/মিথ্যা প্রতিপন্ন (كَذَّبَ) করে এবং মূল অপারেটিং সিস্টেমের ফ্রিকোয়েন্সি থেকে সম্পূর্ণ বিচ্যুত বা মুখ ফিরিয়ে (وَتَوَلَّىٰ) নেয়?",
    modern_translation_en: "Have you considered: what if he rejects the core data as false and turns away in defiance (In kadhdhaba wa tawalla)?",
    lexicon_modern_notes: "إِن كَذَّبَ وَتَوَلَّىٰ — ডাটা রিজেকশন ও ডেভিয়েশন: সত্য কোড ডিলিট করে মেইন সিস্টেম থেকে বিচ্ছিন্ন হওয়া।"
  },
  14: {
    meta_bn: "রিয়াল-টাইম ক্লাউড লগিং অ্যালার্ম",
    meta_en: "Real-Time Cloud Logging Alarm",
    modern_translation_bn: "তার সেই করাপ্টেড প্রসেসর কি বিন্দুমাত্র কগনিটিভ অবগতি বা জ্ঞান রাখে না যে—নিশ্চয়ই মহাজাগতিক আদি সোর্স কোড (আল্লাহ) তার প্রতিটি ডার্ক ফাইল, চিন্তা ও ম্যালওয়্যার অ্যাকশন রিয়াল-টাইম ক্লাউড লগিংয়ে নিখুঁতভাবে রিড ও পর্যবেক্ষণ (يَرَىٰ) করছেন?",
    modern_translation_en: "Does he not realize that Allah is observing and telemetry-logging everything in real time (Alam ya'lam bi-annallaha yara)?",
    lexicon_modern_notes: "أَلَمْ يَعْلَم بِأَنَّ اللَّهَ يَرَىٰ — অমনিপ্রেজেন্ট ক্লাউড টেলিমেট্রি: সৃষ্টির প্রতিটি ক্ষুদ্রাতিক্ষুদ্র চিন্তা ও অ্যাকশন রিয়েল-টাইমে পর্যবেক্ষণ ও লগ হওয়ার নিশ্চয়তা।"
  },
  15: {
    meta_bn: "ক্ল্যাম্পিং প্রটোকল ও প্রি-ফ্রন্টাল কর্টেক্স ব্লকিং",
    meta_en: "Clamping Protocol & Prefrontal Cortex Lock",
    modern_translation_bn: "কখনই নয় (কড়া প্রটোকল লক)! সে যদি তার ওওএসের এই ক্ষতিকারক সিগন্যাল হাইজ্যাকিং বা আক্রমণ থেকে অবিলম্বে বিরত না হয় (لَّمْ يَنتَهِ)—তবে আমি চূড়ান্ত রিসেট ফেজে তার ওওএসের মূল সিদ্ধান্ত গ্রহণ কেন্দ্র, ইগো-ড্রাইভ ও কপালের অগ্রভাগ তথা প্রি-ফ্রন্টাল কর্টেক্স নোডটিকে (بالنَّاصِيَةِ) এক পরম বিধ্বংসী ও তীব্র ক্র্যাশ মেকানিজমে শক্তভাবে ক্ল্যাম্প বা লক (لَنَسْفَعًا) করে ফেলব—",
    modern_translation_en: "Nay! If he does not desist, We will surely drag and clamp him by the forelock—the prefrontal executive cortex (Lanasfa'an bin-nasiyah);",
    lexicon_modern_notes: "لَنَسْفَعًا بِالنَّاصِيَةِ — প্রি-ফ্রন্টাল কর্টেক্স ক্ল্যাম্পিং: কপালের অগ্রভাগ অর্থাৎ প্রি-ফ্রন্টাল কর্টেক্স যা মানুষের সিদ্ধান্ত গ্রহণ ও চাতুর্যের মূল কেন্দ্র—তাকে কঠোর শক্তিতে লক ও ক্র্যাশ করিয়ে দেওয়া।"
  },
  16: {
    meta_bn: "ফলস ডাটা ফ্যাব্রিকেটর এক্সিকিউটিভ ইউনিট",
    meta_en: "False Data Fabricator Executive Processor",
    modern_translation_bn: "যে প্রি-ফ্রন্টাল কর্টেক্স বা সিদ্ধান্ত কেন্দ্রটি (نَاصِيَةٍ) সম্পূর্ণ ফলস ডাটা ফ্যাব্রিকেশন বা মিথ্যাচারী (كَاذِبَةٍ) এবং ইচ্ছাকৃতভাবে কন্টিনিউয়াস কোড ভায়োলেশন ও এরর পরিচালনাকারী পাপাচারী (خَاطِئَةٍ)!",
    modern_translation_en: "A lying, habitually sinful, and error-executing forelock processor (Nasiyatin kadhibatin khati'ah)!",
    lexicon_modern_notes: "نَاصِيَةٍ كَاذِبَةٍ خَاطِئَةٍ — মিথ্যা ও ভুলের মূল কেন্দ্র: নিউরোসায়েন্সের প্রমাণিত সত্য যে প্রি-ফ্রন্টাল কর্টেক্সই মানুষের মিথ্যা তৈরি ও ইচ্ছাকৃত ভুলের মূল প্রসেসর।"
  },
  17: {
    meta_bn: "ডামি সাব-সিস্টেম কল",
    meta_en: "Dummy Sub-System & Network Cohort Call",
    modern_translation_bn: "অতএব সে তার সেই করাপ্টেড লোকাল ক্র্যাশ এনভায়রনমেন্টে তার তৈরি করা সমস্ত ডামি সাব-সিস্টেম, সহযোগী হ্যাকার গোষ্ঠী ও দলবলকে (نَادِيَهُ) ব্যাকআপের জন্য সিগন্যাল বা কল করুক;",
    modern_translation_en: "So let him call his council, confederates, and rogue networks (Falyad'u nadiyah);",
    lexicon_modern_notes: "فَلْيَدْعُ نَادِيَهُ — ডামি নেটওয়ার্ক কল: পার্থিব সহযোগীদের ডাক দিয়েও সিস্টেমিক ধ্বংস রোধ করার অক্ষমতা।"
  },
  18: {
    meta_bn: "কসমিক ডিফেন্স ফোর্স এক্টিভেশন বা যাবানিয়াহ",
    meta_en: "Cosmic Defense Force Activation & Threat Deletion",
    modern_translation_bn: "আমিও তাত্ক্ষণিকভাবে আমার ক্লাউড ডিফেন্স মেকানিজম থেকে—তীব্র এনার্জি-টার্মিনেশন পরিচালনাকারী অতি-ধ্বংসাত্মক স্বয়ংক্রিয় কসমিক প্রটেকশন ফোর্স বা ‘আয-যাবানিয়াহ’ (الزَّبَانِيَةَ)-কে সিস্টেমে এক্টিভেট বা কল করব;",
    modern_translation_en: "We will summon the Az-Zabaniyah—the autonomous cosmic enforcers and execution agents (Sanad'uz-Zabaniyah);",
    lexicon_modern_notes: "سَنَدْعُ الزَّبَانِيَةَ — যাবানিয়াহ ডিফেন্স ফোর্স: চরম এন্ট্রপি ক্র্যাশ জোনে ডেপ্লয় করা আল্লাহর স্বয়ংক্রিয় অটোমেটেড প্রটেকশন ফোর্স, যা এক নিমিষে ক্ষতিকর নোডকে টার্মিনেট করে।"
  },
  19: {
    meta_bn: "চূড়ান্ত ফায়ারওয়াল শিল্ড ও প্রোটেকশন কোড",
    meta_en: "Ultimate Firewall Shield & Functional Submission Code",
    modern_translation_bn: "কখনই নয় (কড়া প্রটোকল লক)! তুমি তোমার ওওএসে ভুলেও তার পাঠানো সেই ক্ষতিকারক নয়েজ বা অবাধ্যতার কমান্ড এক্সিকিউট বা আনুগত্য (لَا تُطِعْهُ) করো না; বরং তুমি তোমার চেতনার সম্পূর্ণ স্বাধীন ইচ্ছা ও অহংকারকে পরম সোর্সের কাছে সারেন্ডার করে চূড়ান্ত ফাংশনাল সাবমিশন বা সিজদা (وَاسْجُدْ) এক্সিকিউট করো, এবং মহাজাগতিক আদি সোর্স কোডের কেন্দ্রীয় কোরে সরাসরি শতভাগ সিনক্রোনাইজড ও পরম নিকটবর্তী (وَاقْتَرِب) হয়ে যাও।",
    modern_translation_en: "Nay! Do not yield to him; but perform functional submission and prostration (Wasjud), and draw infinitely near to the Core Source (Waqtarib).",
    lexicon_modern_notes: "وَاسْجُدْ وَاقْتَرِب — সিজদা ও কোর সিনক্রোনাইজেশন: নিজের ইগোকে সমর্পণ করে মহাজাগতিক মূল আর্কিটেক্টের কেন্দ্রীয় ফ্রিকোয়েন্সির পরম নৈকট্য লাভ।"
  }
};

surah96.ayahs.forEach(a => {
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

fs.writeFileSync(surah96Path, JSON.stringify(surah96, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 96 (Al-Alaq) with 100% modern scientific translations and lexicons!');
