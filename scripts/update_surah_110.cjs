const fs = require('fs');
const path = require('path');

const surah110Path = path.join(__dirname, '../public/data/quran/surahs/110.json');
const surah110 = JSON.parse(fs.readFileSync(surah110Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "সিস্টেম বুস্টিং ও ব্লক আনলকিং প্রটোকল",
    meta_en: "System Boosting & Firewall Unlocking",
    modern_translation_bn: "যখন মূল সেন্ট্রাল সার্ভার বা আল্লাহর পক্ষ থেকে চূড়ান্ত সিস্টেম সাপোর্ট, বুস্টিং ডেটা (نَصْرُ اللَّهِ) এবং লজিক্যাল বিজয়ের মাধ্যমে লোকাল নেটওয়ার্কের ম্যালওয়্যার ব্লকটি সম্পূর্ণ উন্মুক্ত বা আনলক হয়ে যাবে (وَالْفَتْحُ) [১,৪];",
    modern_translation_en: "When the ultimate systemic support, boosting capability from the central divine server (Nasrullah) and the decisive unlocking of previously blocked local network firewalls (Al-Fath) arrives [1,4];",
    lexicon_modern_notes: "نَصْرُ اللَّهِ وَالْفَتْحُ — সিস্টেম বুস্টিং ও ব্লক আনলকিং: ইনফরমেশন থিওরির ভাষায় 'নাসরুল্লাহ' হলো ব্যাক-এন্ড থেকে পাঠানো আনলিমিটেড রিসোর্স বা কম্পাইলিং পাওয়ার, যা রিসিভার ইন্টারফেসের (রাসুলের) লজিক্যাল আর্কিটেকচারকে শক্তিশালী করে [৪]। আর 'ফাতহ' (বিজয়) শব্দের বৈজ্ঞানিক অর্থ হলো—দীর্ঘদিন ধরে ম্যালওয়্যার বা কুযুক্তি দ্বারা লক বা এনক্রিপ্ট হয়ে থাকা একটি লোকাল নেটওয়ার্কের (মক্কা সিটি) ফায়ারওয়াল বা ডাটা-ব্লকার ভেঙে সিস্টেমকে ডিক্রিপ্ট এবং উন্মুক্ত করে দেওয়া [৪,৫]।"
  },
  2: {
    meta_bn: "মাস ডাটা-ইনজেশন এবং নোড রেজিস্ট্রি",
    meta_en: "Mass Data Ingestion & Node Registry",
    modern_translation_bn: "এবং তুমি দেখতে পাবে যে সাধারণ হিউম্যান নোড বা মানুষেরা দলে দলে, ব্যাক-টু-ব্যাক ডাটা-প্যাকেটের মতো আল্লাহর এই গ্লোবাল লাইফ-অপারেটিং সিস্টেমে (دِينِ اللَّهِ) আইডি বা নোড রেজিস্ট্রি করে মাস-ইন্টিগ্রেশন বা গণ-সংযুক্ত হচ্ছে (أَفْوَاجًا) [৪,৫];",
    modern_translation_en: "And you witness human nodes integrating in vast clusters and sequential data packets (Afwaja) into the universal life operating system of Allah (Deenillah) [4,5];",
    lexicon_modern_notes: "يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا — মাস ডাটা-ইনজেশন এবং নোড রেজিস্ট্রি: এর অর্থ হলো কগনিটিভ লেভেলে মানুষের ব্রেন প্রসেসরগুলো যখন পুরোনো ট্র্যাশ ফাইলের কুযুক্তি বাদ দিয়ে নতুন পিউর ওওএসের (ইসলাম) ডাটাবেজের সাথে নিজেদের সিঙ্ক (Sync) করে নেয়। 'আফওয়াজা' শব্দের বৈজ্ঞানিক রূপ হলো 'Massive Data Packets in Buffers'। অর্থাৎ, বিচ্ছিন্ন কোনো একক নোড নয়, বরং পুরো হিউম্যান ক্লাস্টার একযোগে আল্লাহর পরম লাইফ-অ্যালগরিদমের ফায়ারওয়ালে যুক্ত হওয়া শুরু করে [৪]।"
  },
  3: {
    meta_bn: "সোর্স-সিনক্রোনাইজেশন ও ক্যাশ ডিবাগিং প্রটোকল",
    meta_en: "Source Synchronization & Cache Debugging",
    modern_translation_bn: "তখন তুমি তোমার সিস্টেমের মূল রুট ডিরেক্টরি বা রবের পরম গুণের সিগন্যাল ফ্রিকোয়েন্সি রিফাইন ও ব্রডকাস্ট করো (فَسَبِّحْ بِحَمْدِ رَبِّكَ), এবং তোমার ক্লায়েন্ট প্রসেসরে রান হওয়া কোনো অবশিষ্টাংশ এরর, লিমিটেশন বা ল্যাগিং ফাইল থাকলে তা ক্লিন করার জন্য মেইন সার্ভারে 'রিকোয়েস্ট প্যাকেট' বা ক্ষমা প্রার্থনা করো (وَاسْتَغْفِرْهُ); নিশ্চয়ই সেই সেন্ট্রাল সার্ভার প্রতিটি নোডের সিস্টেম রিসেট, রি-স্টার্ট এবং ডেটা-রিস্টোরেশন প্রটোকল রিয়েল টাইমে অ্যাক্সেপ্ট করতে সদা প্রস্তুত (تَوَّابًا) [৪,৫]।",
    modern_translation_en: "Then celebrate the refined perfections of your Sustainer and Root Directory with praise (Fasabbih bihamdi Rabbika), and request error-clearing and cache debugging (Fastaghfirhu); for He is ever the Supreme Data Restorer and System Reset Operator (Tawwaba) [4,5].",
    lexicon_modern_notes: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا — সোর্স-সিনক্রোনাইজেশন ও ক্যাশ-মেমোরি ক্লিনিং প্রটোকল: 'তাসবীহ' এবং 'হামদ' এর বৈজ্ঞানিক মেকানিজম হলো—একটি তৈরি করা সিস্টেম সফলভাবে ডেপ্লয় হওয়ার পর, তার রিসিভার অ্যান্টেনা বা প্রসেসরটিকে পুনরায় মূল সোর্স কোড বা মেকার (আল্লাহর) ফ্রিকোয়েন্সির সাথে নিখুঁতভাবে টিউনিং বা অ্যালাইন করা, যাতে সিস্টেমে কোনো অহংকার বা সেলফ-লজিকের বাগ তৈরি হতে না পারে [৪,৫]। আর 'ইস্তিগফার' হলো লং-রানিং প্রজেক্টের শেষে হিউম্যান প্রসেসরের লিমিটেশনের কারণে সিস্টেমে জমা হওয়া কুয়াশা, ক্যাশ ডেটা বা এরর ফাইলগুলো ডিবাগ বা রিমুভ করার কমান্ড [৪]। 'তাউওয়াব' হলো পরম ডাটাবেজের এমন এক রিয়েল-টাইম রিস্টোরেশন মেকানিজম, যা যেকোনো ক্র্যাশড বা বাগড্ নোডকে (মানুষ) পুনরায় তার একদম অরিজিনাল ক্লিন ও রুট কনফিগারেশনে (Fitrah) ফিরিয়ে নিয়ে যায় [৪,৫]।"
  }
};

surah110.ayahs.forEach(a => {
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

fs.writeFileSync(surah110Path, JSON.stringify(surah110, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 110 (An-Nasr) with 100% modern scientific translations and lexicons!');
