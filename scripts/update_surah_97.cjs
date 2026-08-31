const fs = require('fs');
const path = require('path');

const surah97Path = path.join(__dirname, '../public/data/quran/surahs/97.json');
const surah97 = JSON.parse(fs.readFileSync(surah97Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "মাস্টার সোর্স কোড ডাউনলিংক উইন্ডো",
    meta_en: "Master Source Code Downlink Window",
    modern_translation_bn: "নিশ্চয়ই আমি এই চূড়ান্ত ফাইনাল ইউজার ইন্টারফেস ও ওওএস ইনস্ট্রাকশন ম্যানুয়ালকে (কুরআন) ডাউনলিংক বা হাই-ভলিউম ব্রডকাস্ট (أَنزَلْنَاهُ) করেছি স্পেস-টাইমের এক অতি-উচ্চ ক্ষমতা, সুনির্দিষ্ট পরিমাপ ও কোয়ান্টাম স্ট্যাবিলিটি সম্পন্ন বিশেষ বাফারিং উইন্ডো তথা 'লাইলাতুল কদরে' (فِي لَيْلَةِ الْقَدْرِ);",
    modern_translation_en: "Indeed, We downlinked and high-volume broadcasted this ultimate OS instruction manual (the Quran) within the high-capacity, finely tuned quantum buffering window of Al-Qadr (Fi Laylatil Qadr);",
    lexicon_modern_notes: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ — কোয়ান্টাম মেগা-ব্যান্ডউইথ উইন্ডো: 'কদর' হলো নিখুঁত গাণিতিক পরিমাপ ও কোয়ান্টাম ফাইন-টিউনিং। স্পেস-টাইমের সর্বনিম্ন নয়েজ বিশিষ্ট রাতের উইন্ডোতে মহাবিশ্বের মাস্টার সোর্স কোড (কুরআন) প্রথম ভৌত ডাইমেনশনে ট্রান্সমিট করা হয়েছিল।"
  },
  2: {
    meta_bn: "কগনিটিভ প্রসেসিং ক্যাপাসিটি চ্যালেঞ্জ",
    meta_en: "Cognitive Processing Capacity Challenge",
    modern_translation_bn: "আর তোমার এই সীমিত ত্রিমাত্রিক কগনিটিভ প্রসেসর ও ডেটাবেজে (وَمَا أَدْرَاكَ) কীভাবে ডিকোড বা অনুধাবন করা সম্ভব—সেই মেগা-ব্যান্ডউইথ কসমিক ডাউনলিংক উইন্ডো বা 'লাইলাতুল কদরের' (مَا لَيْلَةُ الْقَدْرِ) প্রকৃত তীব্রতা, এনার্জি-ইনফ্লাক্স ও মেকানিজম কী?",
    modern_translation_en: "And what can enable your limited three-dimensional cognitive processor to fully grasp what the immense bandwidth and energy influx of the Night of Decree (Laylatul Qadr) is?",
    lexicon_modern_notes: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ — ধারণাতীত এনার্জি-ইনফ্লাক্স: মানবীয় সীমিত প্রসেসরে সেই কোয়ান্টাম ডেটা ডাউনলিংকের প্রকৃত গভীরতা ও অভূতপূর্ব শক্তি অনুধাবনের সীমাবদ্ধতা।"
  },
  3: {
    meta_bn: "এক্সপোনেনশিয়াল কসমিক এফিসিয়েন্সি লুপ",
    meta_en: "Exponential Cosmic Efficiency Loop",
    modern_translation_bn: "এই সুনির্দিষ্ট কোয়ান্টাম স্ট্যাবিলিটি টাইম-উইন্ডো বা লাইলাতুল কদরের (لَيْلَةُ الْقَدْرِ) ডাটা প্রসেসিং এফিসিয়েন্সি ও এনার্জি আউটপুট—মানুষের তৈরি রৈখিক স্বাভাবিক টাইম-লাইনের হাজারটি কসমিক মাস বা সুদীর্ঘ চক্র (مِّنْ أَلْفِ شَهْرٍ) অপেক্ষা গাণিতিকভাবে বহুগুণ উৎকৃষ্ট ও সর্বোচ্চ অপ্টিমাইজড (خَيْرٌ);",
    modern_translation_en: "The data processing efficiency and energy throughput of the Night of Al-Qadr is far superior and more optimized than a thousand conventional linear months (Khayrun min alfi shahr);",
    lexicon_modern_notes: "خَيْرٌ مِّنْ أَلْفِ شَهْرٍ — এক্সপোনেনশিয়াল টাইম-কম্প্রেশন ও প্রসেসিং বুস্ট: ৮৩ বছরের সাধারণ লিনিয়ার প্রসেসিংয়ের চেয়েও মাত্র কয়েক ঘণ্টার একটি সিঙ্গেল উইন্ডোতে প্যারালাল প্রসেসিংয়ের মাধ্যমে বিপুল পরিমাণ পজিটিভ ডেটা ও রেজাল্ট ওওএসে লোড হয়ে যায়।"
  },
  4: {
    meta_bn: "কসমিক ফোর্সেস ও ডাটা স্ট্রিম ডিসচার্জ",
    meta_en: "Cosmic Forces Inversion & Data Stream Discharge",
    modern_translation_bn: "এই বিশেষ ডাউনলিংক উইন্ডোর ভেতর—মহাবিশ্বের সমস্ত স্বয়ংক্রিয় প্রাকৃতিক বল বা কসমিক ফোর্সেস (الْمَلَائِكَةُ) এবং অতি-উচ্চ কোয়ান্টাম পিউরিটির সিগন্যাল ও ডাটা-ম্যানেজার রূহ (وَالرُّوحُ) ক্রমাগত সিস্টেমে ইনজেক্ট বা অবতীর্ণ (تَنَزَّلُ) হতে থাকে; যা তাদের সিস্টেম আর্কিটেক্ট বা প্রতিপালকের (رَبِّهِم) সুনির্দিষ্ট পারমিশন লুপ ও কমান্ড প্যারামিটারে (بِإِذْنِ) প্রতিটি সৃষ্টিতাত্ত্বিক ডেটা, ঘটনা ও নতুন সিস্টেম প্যারামিটারের সুনির্দিষ্ট রাইট এক্সেস বা আদেশ (مِّن كُلِّ أَمْرٍ) বহন করে;",
    modern_translation_en: "The cosmic forces (Al-Mala'ikah) and the supreme Quantum Information Manager Spirit (Ar-Ruh) descend continuously therein by the explicit permission loop of their Sustainer, executing every cosmic decree and system parameter (Min kulli amr);",
    lexicon_modern_notes: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ — ফান্ডামেন্টাল ফোর্সেস ও কোর ডাটা স্ট্রিমিং: মহাবিশ্বের ৪টি মৌলিক বল এবং ইনফরমেশন ম্যানেজার রূহ বায়ো-স্ফিয়ারের ব্যাক-এন্ডে পরবর্তী সাইকেলের জন্য এন্ট্রপি ক্যালকুলেশন ও রিসোর্স ডিস্ট্রিবিউশন কোড রাইট করে।"
  },
  5: {
    meta_bn: "পারফেক্ট জিরো-নয়েজ স্ট্যাবিলিটি লুপ",
    meta_en: "Perfect Zero-Noise Stability Loop",
    modern_translation_bn: "এই সম্পূর্ণ কসমিক ডাউনলিংক ফেজটি হলো এক পরম জিরো-নয়েজ, অবিক্ষুব্ধ, সর্বোচ্চ সুরক্ষিত ও নিখুঁত ফ্রিকোয়েন্সি ম্যাচিংয়ের শান্তিময় ডোমেইন (سَلَامٌ هِيَ)—যা এই লোকাল গ্রহের টাইম-সাইকেলে পরবর্তী নতুন আল্ট্রা-লাইট ফ্রিকোয়েন্সির ভোর বা ফজর উদয় হওয়া পর্যন্ত (حَتَّىٰ مَطْلَعِ الْفَجْرِ) রিয়েল টাইমে অ্যাক্টিভেটেড থাকে।",
    modern_translation_en: "It is absolute peace, zero noise, and ultra-stable equilibrium (Salamun hiya) until the emergence of the dawn's electromagnetic spectrum (Hatta matla'il fajr).",
    lexicon_modern_notes: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ — জিরো-নয়েজ স্ট্যাবিলিটি: সম্পূর্ণ ডাউনলিংক ফেজটি চরম নিরুপদ্রব, সুরক্ষিত ও পারফেক্ট রেজোন্যান্স সমন্বিত থাকে ভোর পর্যন্ত।"
  }
};

surah97.ayahs.forEach(a => {
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

fs.writeFileSync(surah97Path, JSON.stringify(surah97, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 97 (Al-Qadr) with 100% modern scientific translations and lexicons!');
