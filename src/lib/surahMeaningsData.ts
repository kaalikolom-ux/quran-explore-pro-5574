// src/lib/surahMeaningsData.ts

export interface SurahMeaningItem {
  id: number;
  name_bn: string;
  name_ar: string;
  name_en: string;
  conventional_bn: string;
  conventional_en: string;
  scientific_bn: string;
  scientific_en: string;
}

export const SURAH_MEANINGS_DATABASE: Record<number, SurahMeaningItem> = {
  "1": {
    "id": 1,
    "name_bn": "আল-ফাতিহা",
    "name_ar": "الْفَاتِحَةِ",
    "name_en": "Al-Fatihah",
    "conventional_bn": "উদ্বোধনী",
    "conventional_en": "The Opening",
    "scientific_bn": "মাস্টার বুট লোডার / সিস্টেম ইনিশিয়ালাইজেশন প্রটোকল (যা ওওএস-এর মূল অপারেটিং কোড আনলক করে)",
    "scientific_en": "Master Boot Loader / System Initialization Protocol (unlocks the core operating code of the OOS)"
  },
  "2": {
    "id": 2,
    "name_bn": "আল-বাকারাহ",
    "name_ar": "الْبَقَرَةِ",
    "name_en": "Al-Baqarah",
    "conventional_bn": "গাভী",
    "conventional_en": "The Cow",
    "scientific_bn": "বায়োলজিক্যাল ডেটা-পিউরিফিকেশন প্রটোকল / সাইকোলজিক্যাল ম্যালওয়্যার ডিলিশন মডিউল",
    "scientific_en": "Biological Data-Purification Protocol / Psychological Malware Deletion Module"
  },
  "3": {
    "id": 3,
    "name_bn": "আল-ইমরান",
    "name_ar": "آلِ عِمْرَانَ",
    "name_en": "Ali 'Imran",
    "conventional_bn": "ইমরানের পরিবার",
    "conventional_en": "The Family of Imran",
    "scientific_bn": "জেনারেশনাল নোড ক্লাস্টার / লেজাসি ডেটা-ট্রান্সমিটার ফ্যামিলি",
    "scientific_en": "Generational Node Cluster / Legacy Data-Transmitter Family"
  },
  "4": {
    "id": 4,
    "name_bn": "আন-নিসা",
    "name_ar": "النِّسَاءِ",
    "name_en": "An-Nisa",
    "conventional_bn": "নারীগণ",
    "conventional_en": "Women",
    "scientific_bn": "ফিমেল নোড-ক্লাস্টার প্রটেকশন প্রটোকল / সোসিও-জেনেটিক রিসোর্স ডিস্ট্রিবিউশন ফ্রেমওয়ার্ক",
    "scientific_en": "Female Node-Cluster Protection Protocol / Socio-Genetic Resource Distribution Framework"
  },
  "5": {
    "id": 5,
    "name_bn": "আল-মায়িদাহ",
    "name_ar": "الْمَائِدَةِ",
    "name_en": "Al-Ma'idah",
    "conventional_bn": "খাদ্যসামগ্রী / দস্তরখান",
    "conventional_en": "Food / Table Spread",
    "scientific_bn": "ডিভাইন ডেটা-ফুয়েল সিস্টেম / হাই-কোয়ালিটি ইনপুট রিসোর্স টেবিল",
    "scientific_en": "Divine Data-Fuel System / High-Quality Input Resource Table"
  },
  "6": {
    "id": 6,
    "name_bn": "আল-আনআম",
    "name_ar": "الْأَنْعَامِ",
    "name_en": "Al-An'am",
    "conventional_bn": "গবাদি পশু",
    "conventional_en": "Livestock",
    "scientific_bn": "বায়োলজিক্যাল এনার্জি কনভার্টার / ইকোসিস্টেম রিসোর্স সাসটেনেন্স মডিউল",
    "scientific_en": "Biological Energy Converter / Ecosystem Resource Sustenance Module"
  },
  "7": {
    "id": 7,
    "name_bn": "আল-আরাফ",
    "name_ar": "الْأَعْرَافِ",
    "name_en": "Al-A'raf",
    "conventional_bn": "উঁচু স্থান / প্রাচীর",
    "conventional_en": "The Heights / The Wall",
    "scientific_bn": "সিস্টেম বাউন্ডারি ইন্টারফেস / ডেটা-ভেরিফিকেশন গেটওয়ে নোড",
    "scientific_en": "System Boundary Interface / Data-Verification Gateway Node"
  },
  "8": {
    "id": 8,
    "name_bn": "আল-আনফাল",
    "name_ar": "الْأَنْفَالِ",
    "name_en": "Al-Anfal",
    "conventional_bn": "যুদ্ধলব্ধ সম্পদ",
    "conventional_en": "Spoils of War",
    "scientific_bn": "কসমিক রিসোর্স অ্যালোকেশন অ্যালগরিদম",
    "scientific_en": "Cosmic Resource Allocation Algorithm"
  },
  "9": {
    "id": 9,
    "name_bn": "আত-তাওবাহ",
    "name_ar": "التَّوْبَةِ",
    "name_en": "At-Tawbah",
    "conventional_bn": "ক্ষমা প্রার্থনা / তওবা",
    "conventional_en": "Repentance",
    "scientific_bn": "সিস্টেম রিকভারি ও ডেটা-রিস্টোরেশন প্রটোকল",
    "scientific_en": "System Recovery & Data-Restoration Protocol"
  },
  "10": {
    "id": 10,
    "name_bn": "ইউনুস",
    "name_ar": "يُونُسَ",
    "name_en": "Yunus",
    "conventional_bn": "নবী ইউনুস",
    "conventional_en": "Prophet Jonah",
    "scientific_bn": "সাবমারিন আইসোলেশন রিকভারি মডিউল / ডেটা-রি-ইন্ট্রি প্রোটোকল",
    "scientific_en": "Submarine Isolation Recovery Module / Data-Re-Entry Protocol"
  },
  "11": {
    "id": 11,
    "name_bn": "হুদ",
    "name_ar": "هُودٍ",
    "name_en": "Hud",
    "conventional_bn": "নবী হুদ",
    "conventional_en": "Prophet Hud",
    "scientific_bn": "সিস্টেম ট্রুথ গাইডেন্স কোড / আউটলায়ার ফিল্টারিং প্রটোকল",
    "scientific_en": "System Truth Guidance Code / Outlier Filtering Protocol"
  },
  "12": {
    "id": 12,
    "name_bn": "ইউসুফ",
    "name_ar": "يُوسُفَ",
    "name_en": "Yusuf",
    "conventional_bn": "নবী ইউসুফ",
    "conventional_en": "Prophet Joseph",
    "scientific_bn": "ড্রিম-কোর সিমুলেশন প্রসেসর / ফাইন্যান্সিয়াল ডেটা অ্যালোকেশন প্রটোকল",
    "scientific_en": "Dream-Core Simulation Processor / Financial Data Allocation Protocol"
  },
  "13": {
    "id": 13,
    "name_bn": "আর-রাদ",
    "name_ar": "الرَّعْدِ",
    "name_en": "Ar-Ra'd",
    "conventional_bn": "বজ্র",
    "conventional_en": "Thunder",
    "scientific_bn": "কসমিক ইলেক্ট্রোম্যাগনেটিক ওয়েভ জেনারেটর / থান্ডার সিগন্যাল ট্রান্সমিটার",
    "scientific_en": "Cosmic Electromagnetic Wave Generator / Thunder Signal Transmitter"
  },
  "14": {
    "id": 14,
    "name_bn": "ইব্রাহীম",
    "name_ar": "إِبْرَاهِيمَ",
    "name_en": "Ibrahim",
    "conventional_bn": "নবী ইব্রাহীম",
    "conventional_en": "Prophet Abraham",
    "scientific_bn": "মোনোথিস্টিক রুট নোড / ফাউন্ডেশনাল ট্রাস্ট প্রটোকল",
    "scientific_en": "Monotheistic Root Node / Foundational Trust Protocol"
  },
  "15": {
    "id": 15,
    "name_bn": "আল-হিজর",
    "name_ar": "الْحِجْرِ",
    "name_en": "Al-Hijr",
    "conventional_bn": "পাথুরে স্থান",
    "conventional_en": "The Rocky Tract",
    "scientific_bn": "ভূ-তাত্ত্বিক ডেটা-স্টোরেজ জোন / ফসিলাইজড নোড মেমোরি",
    "scientific_en": "Geological Data-Storage Zone / Fossilized Node Memory"
  },
  "16": {
    "id": 16,
    "name_bn": "আন-নাহল",
    "name_ar": "النَّحْلِ",
    "name_en": "An-Nahl",
    "conventional_bn": "মৌমাছি",
    "conventional_en": "The Bee",
    "scientific_bn": "ডেটা-পোলিনেশন প্রোটোকল / নেটওয়ার্কড ইকোসিস্টেম অপ্টিমাইজার",
    "scientific_en": "Data-Pollination Protocol / Networked Ecosystem Optimizer"
  },
  "17": {
    "id": 17,
    "name_bn": "আল-ইসরা",
    "name_ar": "الْإِسْرَاءِ",
    "name_en": "Al-Isra",
    "conventional_bn": "রাত্রি ভ্রমণ",
    "conventional_en": "The Night Journey",
    "scientific_bn": "ডাইমেনশনাল ট্রাভেল প্রটোকল / স্পেস-টাইম অ্যাক্সেস ওভাররাইড",
    "scientific_en": "Dimensional Travel Protocol / Space-Time Access Override"
  },
  "18": {
    "id": 18,
    "name_bn": "আল-কাহফ",
    "name_ar": "الْكَهْفِ",
    "name_en": "Al-Kahf",
    "conventional_bn": "গুহা",
    "conventional_en": "The Cave",
    "scientific_bn": "হাইবারনেশন শেল্টার মোড / লং-টার্ম ডেটা-সাসপেন্ড প্রটোকল",
    "scientific_en": "Hibernation Shelter Mode / Long-Term Data-Suspend Protocol"
  },
  "19": {
    "id": 19,
    "name_bn": "মারইয়াম",
    "name_ar": "مَرْيَمَ",
    "name_en": "Maryam",
    "conventional_bn": "মেরি / মারইয়াম",
    "conventional_en": "Mary",
    "scientific_bn": "ভার্জিন বায়ো-গেটওয়ে / সিঙ্গুলার জেনেটিক ইনজেকশন নোড",
    "scientific_en": "Virgin Bio-Gateway / Singular Genetic Injection Node"
  },
  "20": {
    "id": 20,
    "name_bn": "ত্বোয়া-হা",
    "name_ar": "طه",
    "name_en": "Ta-Ha",
    "conventional_bn": "ত্বোয়া-হা (বিচ্ছিন্ন অক্ষর)",
    "conventional_en": "Taha (disjointed letters)",
    "scientific_bn": "সুরক্ষিত ডেটা বাউন্ডারি + প্রাণশক্তি অ্যাক্টিভেশন বাইনারি কোড",
    "scientific_en": "Secure Data Boundary + Vitality Activation Binary Code"
  },
  "21": {
    "id": 21,
    "name_bn": "আল-আম্বিয়া",
    "name_ar": "الْأَنبِيَاءِ",
    "name_en": "Al-Anbiya",
    "conventional_bn": "নবীগণ",
    "conventional_en": "The Prophets",
    "scientific_bn": "ডেটা-রিসিভার এজেন্ট নেটওয়ার্ক / অথেন্টিকেটেড ট্রান্সমিটার ক্লাস্টার",
    "scientific_en": "Data-Receiver Agent Network / Authenticated Transmitter Cluster"
  },
  "22": {
    "id": 22,
    "name_bn": "আল-হাজ্জ",
    "name_ar": "الْحَجِّ",
    "name_en": "Al-Hajj",
    "conventional_bn": "হজ্জ / তীর্থযাত্রা",
    "conventional_en": "The Pilgrimage",
    "scientific_bn": "গ্লোবাল সিঙ্ক্রোনাইজেশন প্রটোকল / বার্ষিক কসমিক আপডেট সেশন",
    "scientific_en": "Global Synchronization Protocol / Annual Cosmic Update Session"
  },
  "23": {
    "id": 23,
    "name_bn": "আল-মুমিনুন",
    "name_ar": "الْمُؤْمِنُونَ",
    "name_en": "Al-Mu'minun",
    "conventional_bn": "মুমিনগণ",
    "conventional_en": "The Believers",
    "scientific_bn": "ভেরিফাইড ইউজার ক্লাস্টার / সিকিউরিটি-ক্লিয়ারড নোড গ্রুপ",
    "scientific_en": "Verified User Cluster / Security-Cleared Node Group"
  },
  "24": {
    "id": 24,
    "name_bn": "আন-নূর",
    "name_ar": "النُّورِ",
    "name_en": "An-Nur",
    "conventional_bn": "আলো",
    "conventional_en": "The Light",
    "scientific_bn": "হাই-ফ্রিকোয়েন্সি ডেটা ট্রান্সমিশন / কসমিক সিগন্যাল বুস্টার",
    "scientific_en": "High-Frequency Data Transmission / Cosmic Signal Booster"
  },
  "25": {
    "id": 25,
    "name_bn": "আল-ফুরকান",
    "name_ar": "الْفُرْقَانِ",
    "name_en": "Al-Furqan",
    "conventional_bn": "সত্য-মিথ্যার পার্থক্যকারী",
    "conventional_en": "The Criterion (between truth and falsehood)",
    "scientific_bn": "ট্রুথ-ফলসি ডিসক্রিমিনেটর উইন্ডো / ডেটা ফিল্টারিং প্রটোকল",
    "scientific_en": "Truth-Falsity Discriminator Window / Data Filtering Protocol"
  },
  "26": {
    "id": 26,
    "name_bn": "আশ-শুআরা",
    "name_ar": "الشُّعَرَاءِ",
    "name_en": "Ash-Shu'ara",
    "conventional_bn": "কবিগণ",
    "conventional_en": "The Poets",
    "scientific_bn": "ডেটা-রিদম জেনারেটর / লিঙ্গুইস্টিক কোড অপ্টিমাইজার",
    "scientific_en": "Data-Rhythm Generator / Linguistic Code Optimizer"
  },
  "27": {
    "id": 27,
    "name_bn": "আন-নামল",
    "name_ar": "النَّمْلِ",
    "name_en": "An-Naml",
    "conventional_bn": "পিঁপড়া",
    "conventional_en": "The Ant",
    "scientific_bn": "মাইক্রো-নেটওয়ার্কড অপারেটিং সিস্টেম / কলোনি লজিক প্রটোকল",
    "scientific_en": "Micro-Networked Operating System / Colony Logic Protocol"
  },
  "28": {
    "id": 28,
    "name_bn": "আল-কাসাস",
    "name_ar": "الْقَصَصِ",
    "name_en": "Al-Qasas",
    "conventional_bn": "কাহিনী / ঘটনাবলী",
    "conventional_en": "The Stories",
    "scientific_bn": "হিস্টোরিক্যাল ডেটা-লগ রিট্রিভাল / ন্যারেটিভ কোড ডিকোডার",
    "scientific_en": "Historical Data-Log Retrieval / Narrative Code Decoder"
  },
  "29": {
    "id": 29,
    "name_bn": "আল-আনকাবুত",
    "name_ar": "الْعَنكَبُوتِ",
    "name_en": "Al-'Ankabut",
    "conventional_bn": "মাকড়সা",
    "conventional_en": "The Spider",
    "scientific_bn": "সিস্টেম ট্র্যাপ নেটওয়ার্ক / ডেটা-ফিল্টারিং ওয়েব আর্কিটেকচার",
    "scientific_en": "System Trap Network / Data-Filtering Web Architecture"
  },
  "30": {
    "id": 30,
    "name_bn": "আর-রুম",
    "name_ar": "الرُّومِ",
    "name_en": "Ar-Rum",
    "conventional_bn": "রোমানগণ",
    "conventional_en": "The Romans",
    "scientific_bn": "সিভিলাইজেশন ডেটা-সাইকেল / ইম্পেরিয়াল নোড ক্লাস্টার",
    "scientific_en": "Civilization Data-Cycle / Imperial Node Cluster"
  },
  "31": {
    "id": 31,
    "name_bn": "লুকমান",
    "name_ar": "لُقْمَانَ",
    "name_en": "Luqman",
    "conventional_bn": "লুকমান",
    "conventional_en": "Luqman",
    "scientific_bn": "প্যারেন্টাল নোড গাইডেন্স কোড / উইজডম ট্রান্সমিটার",
    "scientific_en": "Parental Node Guidance Code / Wisdom Transmitter"
  },
  "32": {
    "id": 32,
    "name_bn": "আস-সাজদাহ",
    "name_ar": "السَّجْدَةِ",
    "name_en": "As-Sajdah",
    "conventional_bn": "সিজদা / নতি স্বীকার",
    "conventional_en": "Prostration",
    "scientific_bn": "ফাংশনাল সাবমিশন প্রটোকল / ইন্টিগ্রেশন গ্রাউন্ডিং মেকানিজম",
    "scientific_en": "Functional Submission Protocol / Integration Grounding Mechanism"
  },
  "33": {
    "id": 33,
    "name_bn": "আল-আহযাব",
    "name_ar": "الْأَحْزَابِ",
    "name_en": "Al-Ahzab",
    "conventional_bn": "বিভিন্ন দল / সম্মিলিত বাহিনী",
    "conventional_en": "The Combined Forces / The Confederates",
    "scientific_bn": "কোয়ালিশন নোড ক্লাস্টার / মাল্টি-ফ্রন্ট সিস্টেম ডিফেন্স",
    "scientific_en": "Coalition Node Cluster / Multi-Front System Defense"
  },
  "34": {
    "id": 34,
    "name_bn": "সাবা",
    "name_ar": "سَبَأٍ",
    "name_en": "Saba",
    "conventional_bn": "সাবা জাতি",
    "conventional_en": "The People of Sheba",
    "scientific_bn": "হাইড্রোলিক সিভিলাইজেশন ডেটা / ওয়াটার-রিসোর্স ম্যানেজমেন্ট নোড",
    "scientific_en": "Hydraulic Civilization Data / Water-Resource Management Node"
  },
  "35": {
    "id": 35,
    "name_bn": "ফাতির",
    "name_ar": "فَاطِرٍ",
    "name_en": "Fatir",
    "conventional_bn": "স্রষ্টা / উদ্ভাবক",
    "conventional_en": "The Creator / Originator",
    "scientific_bn": "শূন্য থেকে স্পেস-টাইম গ্রিডের রূপকার",
    "scientific_en": "Shaper of Space-Time Grid from Zero"
  },
  "36": {
    "id": 36,
    "name_bn": "ইয়াসীন",
    "name_ar": "يس",
    "name_en": "Ya-Sin",
    "conventional_bn": "ইয়া-সীন",
    "conventional_en": "Ya-Sin",
    "scientific_bn": "চেতনার অ্যাকশন + ওহী সিগন্যাল ফ্রিকোয়েন্সি লিঙ্কিং কোড",
    "scientific_en": "Consciousness Action + Revelation Signal Frequency Linking Code"
  },
  "37": {
    "id": 37,
    "name_bn": "আস-সাফফাত",
    "name_ar": "الصَّافَّاتِ",
    "name_en": "As-Saffat",
    "conventional_bn": "সারিবদ্ধভাবে দাঁড়ানো",
    "conventional_en": "Those Ranged in Rows",
    "scientific_bn": "অ্যালাইনড নোড গ্রিড / সিস্টেম সারিবদ্ধকরণ প্রটোকল",
    "scientific_en": "Aligned Node Grid / System Alignment Protocol"
  },
  "38": {
    "id": 38,
    "name_bn": "সোয়াদ",
    "name_ar": "ص",
    "name_en": "Sad",
    "conventional_bn": "সোয়াদ",
    "conventional_en": "Sad",
    "scientific_bn": "কোর ব্যালেন্সার / ডেটা অডিট ফিল্টার কোড",
    "scientific_en": "Core Balancer / Data Audit Filter Code"
  },
  "39": {
    "id": 39,
    "name_bn": "আয-যুমার",
    "name_ar": "الزُّمَرِ",
    "name_en": "Az-Zumar",
    "conventional_bn": "দলসমূহ",
    "conventional_en": "The Groups",
    "scientific_bn": "ক্লাস্টার্ড নোড গ্রুপস / ডেটাবেজ ফ্যামিলি সেপারেশন",
    "scientific_en": "Clustered Node Groups / Database Family Separation"
  },
  "40": {
    "id": 40,
    "name_bn": "গাফির",
    "name_ar": "غَافِرٍ",
    "name_en": "Ghafir",
    "conventional_bn": "ক্ষমাশীল",
    "conventional_en": "The Forgiver",
    "scientific_bn": "ডেটা-এরর ইরেজার প্রটোকল / সিস্টেম রিকভারি মডিউল",
    "scientific_en": "Data-Error Eraser Protocol / System Recovery Module"
  },
  "41": {
    "id": 41,
    "name_bn": "ফুসসিলাত",
    "name_ar": "فُصِّلَتْ",
    "name_en": "Fussilat",
    "conventional_bn": "বিস্তারিত বর্ণিত",
    "conventional_en": "Explained in Detail",
    "scientific_bn": "ডেটা-ডিকোডেড স্ট্রাকচার / সিস্টেমেটিক কোড ব্রেকডাউন",
    "scientific_en": "Data-Decoded Structure / Systematic Code Breakdown"
  },
  "42": {
    "id": 42,
    "name_bn": "আশ-শুরা",
    "name_ar": "الشُّورَىٰ",
    "name_en": "Ash-Shura",
    "conventional_bn": "পরামর্শ",
    "conventional_en": "Consultation",
    "scientific_bn": "নেটওয়ার্ক কনসেনসাস প্রটোকল / ডিস্ট্রিবিউটেড ডিসিশন অ্যালগরিদম",
    "scientific_en": "Network Consensus Protocol / Distributed Decision Algorithm"
  },
  "43": {
    "id": 43,
    "name_bn": "আয-যুখরুফ",
    "name_ar": "الزُّخْرُفِ",
    "name_en": "Az-Zukhruf",
    "conventional_bn": "সোনার অলংকার",
    "conventional_en": "Gold Adornments",
    "scientific_bn": "ফেক ডেটা গ্ল্যামারাইজেশন / ভিজ্যুয়াল ইলিউশন ফিল্টার",
    "scientific_en": "Fake Data Glamorization / Visual Illusion Filter"
  },
  "44": {
    "id": 44,
    "name_bn": "আদ-দুখন",
    "name_ar": "الدُّخَانِ",
    "name_en": "Ad-Dukhan",
    "conventional_bn": "ধোঁয়া",
    "conventional_en": "Smoke",
    "scientific_bn": "পার্টিকুলেট ম্যাটার ক্লাউড / এটমোস্ফেরিক ডেটা লেয়ার",
    "scientific_en": "Particulate Matter Cloud / Atmospheric Data Layer"
  },
  "45": {
    "id": 45,
    "name_bn": "আল-জাসিয়াহ",
    "name_ar": "الْجَاثِيَةِ",
    "name_en": "Al-Jathiyah",
    "conventional_bn": "নতজানু",
    "conventional_en": "The Kneeling",
    "scientific_bn": "সিস্টেম সাবমিশন ফেজ / টার্মিনাল অডিট পজিশন",
    "scientific_en": "System Submission Phase / Terminal Audit Position"
  },
  "46": {
    "id": 46,
    "name_bn": "আল-আহকাফ",
    "name_ar": "الْأَحْقَافِ",
    "name_en": "Al-Ahqaf",
    "conventional_bn": "বালুচর",
    "conventional_en": "The Sand Dunes",
    "scientific_bn": "জিও-ডেটা লেয়ার / ডেজার্ট ফসিল রেকর্ড জোন",
    "scientific_en": "Geo-Data Layer / Desert Fossil Record Zone"
  },
  "47": {
    "id": 47,
    "name_bn": "মুহাম্মদ",
    "name_ar": "مُحَمَّدٍ",
    "name_en": "Muhammad",
    "conventional_bn": "প্রশংসিত",
    "conventional_en": "The Praised One",
    "scientific_bn": "মাস্টার ডেটা-ট্রান্সমিটার / সিস্টেম আপগ্রেড লিড নোড",
    "scientific_en": "Master Data-Transmitter / System Upgrade Lead Node"
  },
  "48": {
    "id": 48,
    "name_bn": "আল-ফাতহ",
    "name_ar": "الْفَتْحِ",
    "name_en": "Al-Fath",
    "conventional_bn": "বিজয় / উন্মুক্তি",
    "conventional_en": "Victory / Conquest",
    "scientific_bn": "ম্যালওয়্যার ব্লক উন্মুক্তকরণ / সিস্টেম অ্যাক্সেস গ্র্যান্ট প্রটোকল",
    "scientific_en": "Malware Block Unlocking / System Access Grant Protocol"
  },
  "49": {
    "id": 49,
    "name_bn": "আল-হুজুরাত",
    "name_ar": "الْحُجُرَاتِ",
    "name_en": "Al-Hujurat",
    "conventional_bn": "কক্ষসমূহ",
    "conventional_en": "The Chambers",
    "scientific_bn": "সিকিউরড নোড চেম্বার / আইসোলেটেড কম্যুনিকেশন জোন",
    "scientific_en": "Secured Node Chamber / Isolated Communication Zone"
  },
  "50": {
    "id": 50,
    "name_bn": "ক্বাফ",
    "name_ar": "ق",
    "name_en": "Qaf",
    "conventional_bn": "ক্বাফ",
    "conventional_en": "Qaf",
    "scientific_bn": "মহাজাগতিক পাওয়ার গ্রিড / চূড়ান্ত নিয়ন্ত্রণ কোর কোড",
    "scientific_en": "Cosmic Power Grid / Ultimate Control Core Code"
  },
  "51": {
    "id": 51,
    "name_bn": "আয-যারিয়াত",
    "name_ar": "الذَّارِيَاتِ",
    "name_en": "Adh-Dhariyat",
    "conventional_bn": "বিক্ষেপকারী বায়ু",
    "conventional_en": "The Scattering Winds",
    "scientific_bn": "ডেটা-ডিস্ট্রিবিউশন উইন্ড / কসমিক পলিনেশন প্রটোকল",
    "scientific_en": "Data-Distribution Wind / Cosmic Pollination Protocol"
  },
  "52": {
    "id": 52,
    "name_bn": "আত-তুর",
    "name_ar": "الطُّورِ",
    "name_en": "At-Tur",
    "conventional_bn": "পর্বত",
    "conventional_en": "The Mountain",
    "scientific_bn": "হাই-এনার্জি কসমিক বাউন্ডারি / ইন্টারফেস থ্রেশহোল্ড",
    "scientific_en": "High-Energy Cosmic Boundary / Interface Threshold"
  },
  "53": {
    "id": 53,
    "name_bn": "আন-নাজম",
    "name_ar": "النَّجْمِ",
    "name_en": "An-Najm",
    "conventional_bn": "তারা / নক্ষত্র",
    "conventional_en": "The Star",
    "scientific_bn": "কসমিক নেভিগেশন নোড / সেলেস্টিয়াল ডেটা-অ্যাঙ্কর",
    "scientific_en": "Cosmic Navigation Node / Celestial Data-Anchor"
  },
  "54": {
    "id": 54,
    "name_bn": "আল-কামার",
    "name_ar": "الْقَمَرِ",
    "name_en": "Al-Qamar",
    "conventional_bn": "চাঁদ",
    "conventional_en": "The Moon",
    "scientific_bn": "সিস্টেম সিঙ্ক্রোনাইজেশন স্যাটেলাইট / টাইডাল ডেটা রেগুলেটর",
    "scientific_en": "System Synchronization Satellite / Tidal Data Regulator"
  },
  "55": {
    "id": 55,
    "name_bn": "আর-রহমান",
    "name_ar": "الرَّحْمَٰنِ",
    "name_en": "Ar-Rahman",
    "conventional_bn": "পরম দয়াময়",
    "conventional_en": "The Most Merciful",
    "scientific_bn": "বিনা শর্তে সৃষ্টির অস্তিত্ব টিকিয়ে রাখা কসমিক এনার্জি সোর্স",
    "scientific_en": "Cosmic Energy Source that Sustains Creation Unconditionally"
  },
  "56": {
    "id": 56,
    "name_bn": "আল-ওয়াকিয়াহ",
    "name_ar": "الْوَاقِعَةِ",
    "name_en": "Al-Waqi'ah",
    "conventional_bn": "সংঘটিত হওয়া",
    "conventional_en": "The Inevitable Event",
    "scientific_bn": "টার্মিনাল ইভেন্ট সিমুলেশন / ফাইনাল সিস্টেম রি-অ্যাকশন ফেজ",
    "scientific_en": "Terminal Event Simulation / Final System Re-Action Phase"
  },
  "57": {
    "id": 57,
    "name_bn": "আল-হাদিদ",
    "name_ar": "الْحَدِيدِ",
    "name_en": "Al-Hadid",
    "conventional_bn": "লোহা",
    "conventional_en": "Iron",
    "scientific_bn": "মেটালিক ডেটা-কন্ডাক্টর / জিও-কেমিক্যাল ডেটা স্টোরেজ মিনারেল",
    "scientific_en": "Metallic Data-Conductor / Geo-Chemical Data Storage Mineral"
  },
  "58": {
    "id": 58,
    "name_bn": "আল-মুজাদালাহ",
    "name_ar": "الْمُجَادَلَةِ",
    "name_en": "Al-Mujadala",
    "conventional_bn": "বিতর্ক",
    "conventional_en": "The Dispute",
    "scientific_bn": "ডেটা-ডায়ালগ কনফ্লিক্ট রেজুলেশন / লজিক্যাল অ্যানালিটিক্স প্রটোকল",
    "scientific_en": "Data-Dialogue Conflict Resolution / Logical Analytics Protocol"
  },
  "59": {
    "id": 59,
    "name_bn": "আল-হাশর",
    "name_ar": "الْحَشْرِ",
    "name_en": "Al-Hashr",
    "conventional_bn": "সমাবেশ / পুনরুত্থান",
    "conventional_en": "The Gathering / Resurrection",
    "scientific_bn": "ডেটা-রি-ইন্টিগ্রেশন ফেজ / কসমিক কনভারজেন্স ইভেন্ট",
    "scientific_en": "Data-Re-Integration Phase / Cosmic Convergence Event"
  },
  "60": {
    "id": 60,
    "name_bn": "আল-মুমতাহিনাহ",
    "name_ar": "الْمُمْتَحَنَةِ",
    "name_en": "Al-Mumtahanah",
    "conventional_bn": "পরীক্ষাকারী",
    "conventional_en": "The Examined One",
    "scientific_bn": "সিস্টেম ভ্যালিডেশন ফেজ / ডেটা-অথেন্টিকেশন টেস্টিং",
    "scientific_en": "System Validation Phase / Data-Authentication Testing"
  },
  "61": {
    "id": 61,
    "name_bn": "আস-সাফফ",
    "name_ar": "الصَّفِّ",
    "name_en": "As-Saf",
    "conventional_bn": "সারিবদ্ধ",
    "conventional_en": "The Ranks",
    "scientific_bn": "নোড অ্যালাইনমেন্ট গ্রিড / সিস্টেম অর্ডার প্রটোকল",
    "scientific_en": "Node Alignment Grid / System Order Protocol"
  },
  "62": {
    "id": 62,
    "name_bn": "আল-জুমুআ",
    "name_ar": "الْجُمُعَةِ",
    "name_en": "Al-Jumu'ah",
    "conventional_bn": "শুক্রবার",
    "conventional_en": "Friday",
    "scientific_bn": "উইকলি সিস্টেম রিসেট প্রটোকল / কমিউনিটি সিঙ্ক্রোনাইজেশন",
    "scientific_en": "Weekly System Reset Protocol / Community Synchronization"
  },
  "63": {
    "id": 63,
    "name_bn": "আল-মুনাফিকুন",
    "name_ar": "الْمُنَافِقُونَ",
    "name_en": "Al-Munafiqun",
    "conventional_bn": "মুনাফিকগণ",
    "conventional_en": "The Hypocrites",
    "scientific_bn": "ডুয়েল-আইডি ম্যালওয়্যার ক্লাস্টার / সিস্টেম হ্যাকার নোড",
    "scientific_en": "Dual-ID Malware Cluster / System Hacker Node"
  },
  "64": {
    "id": 64,
    "name_bn": "আত-তাগাবুন",
    "name_ar": "التَّغَابُنِ",
    "name_en": "At-Taghabun",
    "conventional_bn": "প্রতারণা / লোকসান",
    "conventional_en": "Mutual Loss / Cheating",
    "scientific_bn": "ডেটা-রেজিস্ট্রি মিসম্যাচ / সিস্টেম লস ফাইল",
    "scientific_en": "Data-Registry Mismatch / System Loss File"
  },
  "65": {
    "id": 65,
    "name_bn": "আত-তালাক",
    "name_ar": "الطَّلَاقِ",
    "name_en": "At-Talaq",
    "conventional_bn": "তালাক / বিবাহ-বিচ্ছেদ",
    "conventional_en": "Divorce",
    "scientific_bn": "পেয়ারিং টার্মিনেশন / নোড আনলিংকিং প্রটোকল",
    "scientific_en": "Pairing Termination / Node Unlinking Protocol"
  },
  "66": {
    "id": 66,
    "name_bn": "আত-তাহরিম",
    "name_ar": "التَّحْرِيمِ",
    "name_en": "At-Tahrim",
    "conventional_bn": "নিষিদ্ধকরণ",
    "conventional_en": "Prohibition",
    "scientific_bn": "সিস্টেম-ব্লক প্রটোকল / ডেটা আইসোলেশন",
    "scientific_en": "System-Block Protocol / Data Isolation"
  },
  "67": {
    "id": 67,
    "name_bn": "আল-মুলক",
    "name_ar": "الْمُلْكِ",
    "name_en": "Al-Mulk",
    "conventional_bn": "রাজত্ব",
    "conventional_en": "The Kingdom / Sovereignty",
    "scientific_bn": "সিস্টেম অ্যাডমিনিস্ট্রেশন / মাস্টার নেটওয়ার্ক কন্ট্রোল",
    "scientific_en": "System Administration / Master Network Control"
  },
  "68": {
    "id": 68,
    "name_bn": "আল-কালাম",
    "name_ar": "الْقَلَمِ",
    "name_en": "Al-Qalam",
    "conventional_bn": "কলম",
    "conventional_en": "The Pen",
    "scientific_bn": "ডেটা-রাইটিং টুল / কোড জেনারেটর",
    "scientific_en": "Data-Writing Tool / Code Generator"
  },
  "69": {
    "id": 69,
    "name_bn": "আল-হাক্কাহ",
    "name_ar": "الْحَاقَّةِ",
    "name_en": "Al-Haqqah",
    "conventional_bn": "নিশ্চিত সত্য",
    "conventional_en": "The Inevitable Truth",
    "scientific_bn": "টার্মিনাল ট্রুথ ইভেন্ট / ফাইনাল ডেটা-অডিট ফেজ",
    "scientific_en": "Terminal Truth Event / Final Data-Audit Phase"
  },
  "70": {
    "id": 70,
    "name_bn": "আল-মাআরিজ",
    "name_ar": "الْمَعَارِجِ",
    "name_en": "Al-Ma'arij",
    "conventional_bn": "আরোহণের স্তর",
    "conventional_en": "The Ascending Stairways",
    "scientific_bn": "ডাইমেনশনাল এসেনশন প্রটোকল / লেয়ার্ড অ্যাক্সেস ল্যাডার",
    "scientific_en": "Dimensional Ascension Protocol / Layered Access Ladder"
  },
  "71": {
    "id": 71,
    "name_bn": "নূহ",
    "name_ar": "نُوحٍ",
    "name_en": "Nuh",
    "conventional_bn": "নবী নূহ",
    "conventional_en": "Prophet Noah",
    "scientific_bn": "ফ্লুড ট্রান্সপোর্ট প্রটোকল / সাবমার্সন রিকভারি নোড",
    "scientific_en": "Flood Transport Protocol / Submersion Recovery Node"
  },
  "72": {
    "id": 72,
    "name_bn": "আল-জ্বীন",
    "name_ar": "الْجِنِّ",
    "name_en": "Al-Jinn",
    "conventional_bn": "জ্বীন",
    "conventional_en": "The Jinn",
    "scientific_bn": "বায়ো-ইলেকট্রিক এনার্জি স্পেকট্রাম / হিডেন সফটওয়্যার লেয়ার",
    "scientific_en": "Bio-Electric Energy Spectrum / Hidden Software Layer"
  },
  "73": {
    "id": 73,
    "name_bn": "আল-মুজাম্মিল",
    "name_ar": "الْمُزَّمِّلِ",
    "name_en": "Al-Muzzammil",
    "conventional_bn": "কাপড়ে আচ্ছন্ন",
    "conventional_en": "The Enshrouded One",
    "scientific_bn": "সিস্টেম স্লিপ মোড / সিগন্যাল বাফারিং ফেজ",
    "scientific_en": "System Sleep Mode / Signal Buffering Phase"
  },
  "74": {
    "id": 74,
    "name_bn": "আল-মুদ্দাস্সির",
    "name_ar": "الْمُدَّثِّرِ",
    "name_en": "Al-Muddaththir",
    "conventional_bn": "কাপড়ে আবৃত",
    "conventional_en": "The Cloaked One",
    "scientific_bn": "ওওএস ওয়ার্ম-আপ প্রটোকল / ডেটা লোডিং ফেজ",
    "scientific_en": "OOS Warm-Up Protocol / Data Loading Phase"
  },
  "75": {
    "id": 75,
    "name_bn": "আল-কিয়ামাহ",
    "name_ar": "الْقِيَامَةِ",
    "name_en": "Al-Qiyamah",
    "conventional_bn": "কিয়ামত",
    "conventional_en": "The Day of Resurrection",
    "scientific_bn": "ফাইনাল সিস্টেম রিবুট ডে / টার্মিনাল রিসেট ইভেন্ট",
    "scientific_en": "Final System Reboot Day / Terminal Reset Event"
  },
  "76": {
    "id": 76,
    "name_bn": "আদ-দাহর",
    "name_ar": "الدَّهْرِ",
    "name_en": "Al-Insan",
    "conventional_bn": "সময় / যুগ",
    "conventional_en": "Time / Epoch",
    "scientific_bn": "স্পেস-টাইম কন্টিনিউম / কসমিক ক্রোনোলজি ফাইল",
    "scientific_en": "Space-Time Continuum / Cosmic Chronology File"
  },
  "77": {
    "id": 77,
    "name_bn": "আল-মুরসালাত",
    "name_ar": "الْمُرْسَلَاتِ",
    "name_en": "Al-Mursalat",
    "conventional_bn": "প্রেরিত",
    "conventional_en": "Those Sent Forth",
    "scientific_bn": "ডেটা-ট্রান্সমিটার চেইন / কসমিক রিসিভার নেটওয়ার্ক",
    "scientific_en": "Data-Transmitter Chain / Cosmic Receiver Network"
  },
  "78": {
    "id": 78,
    "name_bn": "আন-নাবা",
    "name_ar": "النَّبَأِ",
    "name_en": "An-Naba",
    "conventional_bn": "মহাসংবাদ",
    "conventional_en": "The Great News",
    "scientific_bn": "হাই-ইনটেনসিটি ডেটা-প্যাকেট / টার্মিনাল নিউজ ফাইল",
    "scientific_en": "High-Intensity Data-Packet / Terminal News File"
  },
  "79": {
    "id": 79,
    "name_bn": "আন-নাজিয়াত",
    "name_ar": "النَّازِعَاتِ",
    "name_en": "An-Nazi'at",
    "conventional_bn": "উৎপাটনকারী",
    "conventional_en": "Those Who Tear Out",
    "scientific_bn": "ডেটা-এক্সট্রাক্টর প্রটোকল / লাইভ কোর পার্জ মেকানিজম",
    "scientific_en": "Data-Extractor Protocol / Live Core Purge Mechanism"
  },
  "80": {
    "id": 80,
    "name_bn": "আবাসা",
    "name_ar": "عَبَسَ",
    "name_en": "'Abasa",
    "conventional_bn": "ভ্রু কুঁচকানো",
    "conventional_en": "He Frowned",
    "scientific_bn": "ডেটা-ইনপুট রিজেকশন / কগনিটিভ ফিল্টার ব্লক",
    "scientific_en": "Data-Input Rejection / Cognitive Filter Block"
  },
  "81": {
    "id": 81,
    "name_bn": "আত-তাকবির",
    "name_ar": "التَّكْوِيرِ",
    "name_en": "At-Takwir",
    "conventional_bn": "গুটিয়ে ফেলা",
    "conventional_en": "The Wrapping / Coiling",
    "scientific_bn": "স্পেস-টাইম কন্ডেনসেশন / ডেটা-জিপিং প্রটোকল",
    "scientific_en": "Space-Time Condensation / Data-Zipping Protocol"
  },
  "82": {
    "id": 82,
    "name_bn": "আল-ইনফিতার",
    "name_ar": "الْإِنفِطَارِ",
    "name_en": "Al-Infitar",
    "conventional_bn": "বিদীর্ণ হওয়া",
    "conventional_en": "The Splitting",
    "scientific_bn": "স্ট্রাকচারাল ব্রেকডাউন / রেজোন্যান্স ফ্র্যাকচার",
    "scientific_en": "Structural Breakdown / Resonance Fracture"
  },
  "83": {
    "id": 83,
    "name_bn": "আল-মুতাফফিফিন",
    "name_ar": "الْمُطَفِّفِينَ",
    "name_en": "Al-Mutaffifin",
    "conventional_bn": "পরিমাপে কম দেওয়া",
    "conventional_en": "Those Who Give Less in Measure",
    "scientific_bn": "ডেটা-ম্যানিপুলেশন এরর / কোয়ান্টাম স্কেল টেম্পারিং",
    "scientific_en": "Data-Manipulation Error / Quantum Scale Tampering"
  },
  "84": {
    "id": 84,
    "name_bn": "আল-ইনশিকাক",
    "name_ar": "الْإِنشِقَاقِ",
    "name_en": "Al-Inshiqaq",
    "conventional_bn": "বিদীর্ণ হওয়া",
    "conventional_en": "The Splitting Asunder",
    "scientific_bn": "স্পেস-টাইম সেপারেশন / ডাইমেনশনাল ক্র্যাক",
    "scientific_en": "Space-Time Separation / Dimensional Crack"
  },
  "85": {
    "id": 85,
    "name_bn": "আল-বুরুজ",
    "name_ar": "الْبُرُوجِ",
    "name_en": "Al-Buruj",
    "conventional_bn": "নক্ষত্রপুঞ্জ",
    "conventional_en": "The Constellations",
    "scientific_bn": "কসমিক ডেটা-অ্যারে / সেলেস্টিয়াল গ্রিড নেটওয়ার্ক",
    "scientific_en": "Cosmic Data-Array / Celestial Grid Network"
  },
  "86": {
    "id": 86,
    "name_bn": "আত-তারিক্ব",
    "name_ar": "الطَّارِقِ",
    "name_en": "At-Tariq",
    "conventional_bn": "রাতের আগন্তুক",
    "conventional_en": "The Night Comer",
    "scientific_bn": "কসমিক সিগন্যাল ইনজেক্টর / পুলসার ডেটা-বিম",
    "scientific_en": "Cosmic Signal Injector / Pulsar Data-Beam"
  },
  "87": {
    "id": 87,
    "name_bn": "আল-আলা",
    "name_ar": "الْأَعْلَىٰ",
    "name_en": "Al-A'la",
    "conventional_bn": "সর্বোচ্চ",
    "conventional_en": "The Most High",
    "scientific_bn": "টার্মিনাল ক্লাউড লেয়ার / হাইয়েস্ট ডাইমেনশনাল গ্রিড",
    "scientific_en": "Terminal Cloud Layer / Highest Dimensional Grid"
  },
  "88": {
    "id": 88,
    "name_bn": "আল-গাশিয়াহ",
    "name_ar": "الْغَاشِيَةِ",
    "name_en": "Al-Ghashiyah",
    "conventional_bn": "আচ্ছন্নকারী",
    "conventional_en": "The Overwhelming Event",
    "scientific_bn": "সিস্টেম-ওভারল্যাপিং ডিসরপশন / কসমিক ব্ল্যাকআউট ফেজ",
    "scientific_en": "System-Overlapping Disruption / Cosmic Blackout Phase"
  },
  "89": {
    "id": 89,
    "name_bn": "আল-ফাজর",
    "name_ar": "الْفَجْرِ",
    "name_en": "Al-Fajr",
    "conventional_bn": "ভোর",
    "conventional_en": "The Dawn",
    "scientific_bn": "ডাটা-ডন ফেজ / সিস্টেম নিউ ডনের সিগন্যাল",
    "scientific_en": "Data-Dawn Phase / Signal of a New System Dawn"
  },
  "90": {
    "id": 90,
    "name_bn": "আল-বালাদ",
    "name_ar": "الْبَلَدِ",
    "name_en": "Al-Balad",
    "conventional_bn": "শহর",
    "conventional_en": "The City",
    "scientific_bn": "লোকাল ডেটা-হাব / নেটওয়ার্ক সিটাডেল",
    "scientific_en": "Local Data-Hub / Network Citadel"
  },
  "91": {
    "id": 91,
    "name_bn": "আশ-শামস",
    "name_ar": "الشَّمْسِ",
    "name_en": "Ash-Shams",
    "conventional_bn": "সূর্য",
    "conventional_en": "The Sun",
    "scientific_bn": "সোলার এনার্জি কোর / সিস্টেম পাওয়ার সোর্স",
    "scientific_en": "Solar Energy Core / System Power Source"
  },
  "92": {
    "id": 92,
    "name_bn": "আল-লাইল",
    "name_ar": "اللَّيْلِ",
    "name_en": "Al-Layl",
    "conventional_bn": "রাত",
    "conventional_en": "The Night",
    "scientific_bn": "বাফারিং ফেজ / সিস্টেম ডাউনটাইম",
    "scientific_en": "Buffering Phase / System Downtime"
  },
  "93": {
    "id": 93,
    "name_bn": "আদ-দুহা",
    "name_ar": "الضُّحَىٰ",
    "name_en": "Ad-Duha",
    "conventional_bn": "পূর্বাহ্ন",
    "conventional_en": "The Morning Brightness",
    "scientific_bn": "কসমিক সিগন্যাল স্যাটুরেশন লুপ ও কগনিটিভ আপগ্রেডেশন প্রটোকল",
    "scientific_en": "Cosmic Signal Saturation Loop & Cognitive Upgradation Protocol"
  },
  "94": {
    "id": 94,
    "name_bn": "আল-ইনশিরাহ",
    "name_ar": "الْإِنشِرَاحِ",
    "name_en": "Ash-Sharh",
    "conventional_bn": "প্রসার / উন্মোচন",
    "conventional_en": "Expansion / Relief",
    "scientific_bn": "নিউরাল ব্যান্ডউইথ সম্প্রসারণ ও কগনিটিভ অপ্টিমাইজেশন প্রটোকল",
    "scientific_en": "Neural Bandwidth Expansion & Cognitive Optimization Protocol"
  },
  "95": {
    "id": 95,
    "name_bn": "আত-তীন",
    "name_ar": "التِّينِ",
    "name_en": "At-Tin",
    "conventional_bn": "ডুমুর",
    "conventional_en": "The Fig",
    "scientific_bn": "বায়ো-ডেটা স্যাম্পল / প্ল্যান্ট জেনেটিক ইনফরমেশন",
    "scientific_en": "Bio-Data Sample / Plant Genetic Information"
  },
  "96": {
    "id": 96,
    "name_bn": "আল-আলাক্ব",
    "name_ar": "الْعَلَقِ",
    "name_en": "Al-'Alaq",
    "conventional_bn": "জমাট রক্ত",
    "conventional_en": "The Clot",
    "scientific_bn": "প্রাইমারি বায়ো-ডেটা ক্লাস্টার / এমব্রায়নিক ডেভেলপমেন্ট ফেজ",
    "scientific_en": "Primary Bio-Data Cluster / Embryonic Development Phase"
  },
  "97": {
    "id": 97,
    "name_bn": "আল-কাদর",
    "name_ar": "الْقَدْرِ",
    "name_en": "Al-Qadr",
    "conventional_bn": "ভাগ্য / মর্যাদা",
    "conventional_en": "The Decree / Power",
    "scientific_bn": "প্রি-ডিফাইন্ড সিস্টেম ভেরিয়েবল / কোয়ান্টাম ডেটা-প্রোগ্রামিং উইন্ডো",
    "scientific_en": "Pre-Defined System Variables / Quantum Data-Programming Window"
  },
  "98": {
    "id": 98,
    "name_bn": "আল-বাইয়িনাহ",
    "name_ar": "الْبَيِّنَةِ",
    "name_en": "Al-Bayyinah",
    "conventional_bn": "স্পষ্ট প্রমাণ",
    "conventional_en": "The Clear Proof",
    "scientific_bn": "স্বয়ং-প্রমাণিত ওপেন সোর্স ডেটা / ভেরিফাইড ইকুয়েশন সেট",
    "scientific_en": "Self-Evident Open Source Data / Verified Equation Set"
  },
  "99": {
    "id": 99,
    "name_bn": "আয-জিলজাল",
    "name_ar": "الزَّلْزَلَةِ",
    "name_en": "Az-Zalzalah",
    "conventional_bn": "ভূমিকম্প",
    "conventional_en": "The Earthquake",
    "scientific_bn": "মেগা সিসমিক ভাইব্রেশন / থার্মোডাইনামিক চাপ মুক্তির কোর",
    "scientific_en": "Mega Seismic Vibration / Thermodynamic Pressure Release Core"
  },
  "100": {
    "id": 100,
    "name_bn": "আল-আদিয়াত",
    "name_ar": "الْعَادِيَاتِ",
    "name_en": "Al-'Adiyat",
    "conventional_bn": "দৌড়ানো ঘোড়া",
    "conventional_en": "The Runners (war steeds)",
    "scientific_bn": "এনার্জি-ভেক্টর বুস্টার / ডেটা-প্যাকেট এক্সিলারেটর",
    "scientific_en": "Energy-Vector Booster / Data-Packet Accelerator"
  },
  "101": {
    "id": 101,
    "name_bn": "আল-কারিয়াহ",
    "name_ar": "الْقَارِعَةِ",
    "name_en": "Al-Qari'ah",
    "conventional_bn": "আঘাতকারী",
    "conventional_en": "The Striking Calamity",
    "scientific_bn": "টার্মিনাল শক ইভেন্ট / সিস্টেম ক্র্যাশ ফেজ",
    "scientific_en": "Terminal Shock Event / System Crash Phase"
  },
  "102": {
    "id": 102,
    "name_bn": "আত-তাকাসুর",
    "name_ar": "التَّكَاثُرِ",
    "name_en": "At-Takathur",
    "conventional_bn": "প্রাচুর্যের প্রতিযোগিতা",
    "conventional_en": "Rivalry in Worldly Increase",
    "scientific_bn": "কোয়ান্টিটেটিভ অ্যাকুমুলেশন ম্যানিয়া / ডেটা ওভারলোডিং বালাই (bug)",
    "scientific_en": "Quantitative Accumulation Mania / Data Overloading Bug"
  },
  "103": {
    "id": 103,
    "name_bn": "আল-আসর",
    "name_ar": "الْعَصْرِ",
    "name_en": "Al-'Asr",
    "conventional_bn": "সময় / যুগ",
    "conventional_en": "Time / The Epoch",
    "scientific_bn": "স্পেস-টাইম স্লাইস / কসমিক ডেটা-ফ্রেম",
    "scientific_en": "Space-Time Slice / Cosmic Data-Frame"
  },
  "104": {
    "id": 104,
    "name_bn": "আল-হুমাজাহ",
    "name_ar": "الْهُمَزَةِ",
    "name_en": "Al-Humazah",
    "conventional_bn": "পরনিন্দাকারী",
    "conventional_en": "The Slanderer / Backbiter",
    "scientific_bn": "সিগন্যাল করাপ্টর / ক্যারেক্টার এসাসিনেশন মডিউল",
    "scientific_en": "Signal Corruptor / Character Assassination Module"
  },
  "105": {
    "id": 105,
    "name_bn": "আল-ফিল",
    "name_ar": "الْفِيلِ",
    "name_en": "Al-Fil",
    "conventional_bn": "হাতি",
    "conventional_en": "The Elephant",
    "scientific_bn": "মেগা-ডেটা প্যাকেট / আর্মি সিস্টেম ব্রেকার",
    "scientific_en": "Mega-Data Packet / Army System Breaker"
  },
  "106": {
    "id": 106,
    "name_bn": "কুরাইশ",
    "name_ar": "قُرَيْشٍ",
    "name_en": "Quraysh",
    "conventional_bn": "কুরাইশ",
    "conventional_en": "Quraysh",
    "scientific_bn": "সিস্টেম ফাউন্ডেশন নোড / কমিউনিটি কোড সেন্টার",
    "scientific_en": "System Foundation Node / Community Code Center"
  },
  "107": {
    "id": 107,
    "name_bn": "আল-মাউন",
    "name_ar": "الْمَاعُونِ",
    "name_en": "Al-Ma'un",
    "conventional_bn": "নিত্যপ্রয়োজনীয় জিনিস",
    "conventional_en": "Small Kindnesses / Daily Needs",
    "scientific_bn": "বেসিক সিস্টেম রিসোর্স / ন্যূনতম ডেটা-সাসটেনেন্স প্যাকেট",
    "scientific_en": "Basic System Resource / Minimum Data-Sustenance Packet"
  },
  "108": {
    "id": 108,
    "name_bn": "আল-কাওসার",
    "name_ar": "الْكَوْثَرِ",
    "name_en": "Al-Kawthar",
    "conventional_bn": "প্রাচুর্য / অফুরন্ত কল্যাণ",
    "conventional_en": "Abundance / Unending Good",
    "scientific_bn": "ইনফিনিট ডেটা-স্ট্রিম / এক্সপোনেনশিয়াল রিসোর্স বুস্টার",
    "scientific_en": "Infinite Data-Stream / Exponential Resource Booster"
  },
  "109": {
    "id": 109,
    "name_bn": "আল-কাফিরুন",
    "name_ar": "الْكَافِرُونَ",
    "name_en": "Al-Kafirun",
    "conventional_bn": "কাফিরগণ",
    "conventional_en": "The Disbelievers",
    "scientific_bn": "সিস্টেম কোড ডিনাইয়ার নোড / সোর্স রিজেক্টর ক্লাস্টার",
    "scientific_en": "System Code Denier Node / Source Rejector Cluster"
  },
  "110": {
    "id": 110,
    "name_bn": "আন-নাসর",
    "name_ar": "النَّصْرِ",
    "name_en": "An-Nasr",
    "conventional_bn": "সাহায্য",
    "conventional_en": "The Help / Victory",
    "scientific_bn": "গ্লোবাল ডেপ্লয়মেন্ট, সোর্স-সিনক্রোনাইজেশন এবং রিফ্রেশ প্রটোকল",
    "scientific_en": "Global Deployment, Mass Integration & System Refresh Protocol"
  },
  "111": {
    "id": 111,
    "name_bn": "আল-মাসাদ",
    "name_ar": "الْمَسَدِ",
    "name_en": "Al-Masad",
    "conventional_bn": "খেজুরের আঁশের দড়ি",
    "conventional_en": "The Palm Fiber Rope",
    "scientific_bn": "এনক্রিপ্টেড ট্র্যাপ কেবল / অটো-লকড কনস্ট্রেইন্ট প্রটোকল",
    "scientific_en": "Encrypted Trap Cable / Auto-Locked Constraint Protocol"
  },
  "112": {
    "id": 112,
    "name_bn": "আল-ইখলাস",
    "name_ar": "الْإِخْلَاصِ",
    "name_en": "Al-Ikhlas",
    "conventional_bn": "একনিষ্ঠতা",
    "conventional_en": "Sincerity / Purity of Faith",
    "scientific_bn": "সিস্টেম পিউরিটি মোড / সিঙ্গেল রুট ট্রাস্ট প্রটোকল",
    "scientific_en": "System Purity Mode / Single Root Trust Protocol"
  },
  "113": {
    "id": 113,
    "name_bn": "আল-ফালাক",
    "name_ar": "الْفَلَقِ",
    "name_en": "Al-Falaq",
    "conventional_bn": "ঊষা / বিদীর্ণ হওয়া",
    "conventional_en": "The Daybreak / The Split",
    "scientific_bn": "বিগ ব্যাং সিঙ্গুলারিটি / স্পেস-টাইম উন্মোচনকারী ব্রেক-থ্রু",
    "scientific_en": "Big Bang Singularity / Space-Time Unfolding Breakthrough"
  },
  "114": {
    "id": 114,
    "name_bn": "আন-নাস",
    "name_ar": "النَّاسِ",
    "name_en": "An-Nas",
    "conventional_bn": "মানুষ",
    "conventional_en": "Mankind",
    "scientific_bn": "হিউম্যান নোড / ইউজার ইন্টারফেস ক্লাস্টার",
    "scientific_en": "Human Node / User Interface Cluster"
  }
};

/** Get meaning with local/admin overrides support */
export function getSurahMeaning(surahId: number): SurahMeaningItem | null {
  const base = SURAH_MEANINGS_DATABASE[surahId];
  if (!base) return null;

  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem(`custom_surah_meaning_${surahId}`);
      if (custom) {
        const parsed = JSON.parse(custom);
        return {
          ...base,
          conventional_bn: parsed.conventional_bn || base.conventional_bn,
          conventional_en: parsed.conventional_en || base.conventional_en,
          scientific_bn: parsed.scientific_bn || base.scientific_bn,
          scientific_en: parsed.scientific_en || base.scientific_en,
        };
      }
    } catch {}
  }

  return base;
}

/** Save custom meaning for a Surah */
export function saveCustomSurahMeaning(
  surahId: number,
  conventional_bn: string,
  scientific_bn: string,
  conventional_en?: string,
  scientific_en?: string
) {
  if (typeof window === "undefined") return;
  const existing = getSurahMeaning(surahId);
  localStorage.setItem(
    `custom_surah_meaning_${surahId}`,
    JSON.stringify({
      conventional_bn: conventional_bn || existing?.conventional_bn,
      scientific_bn: scientific_bn || existing?.scientific_bn,
      conventional_en: conventional_en || existing?.conventional_en,
      scientific_en: scientific_en || existing?.scientific_en,
    })
  );
  window.dispatchEvent(new Event("surah-meanings-updated"));
}
