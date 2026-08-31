const fs = require('fs');
const path = require('path');

const surah93Path = path.join(__dirname, '../public/data/quran/surahs/93.json');
const surah93 = JSON.parse(fs.readFileSync(surah93Path, 'utf8'));

const updates = {
  1: {
    meta_bn: "হাই-ফ্রিকোয়েন্সি সিগন্যাল ফেজ",
    meta_en: "High-Frequency Signal Phase",
    modern_translation_bn: "আমি কসমিক ক্লকের সেই সুনির্দিষ্ট টাইম-ব্লক তথা তীব্র আলো, উচ্চ-ফ্রিকোয়েন্সির ডাটা ট্রান্সমিশন ও শক্তির প্রস্ফুটন ফেজের (وَالضُّحَىٰ) রেফারেন্স দিচ্ছি—",
    modern_translation_en: "By the early brightness of cosmic daylight, high-frequency data transmission and radiant energy unfolding phase (Ad-Duha)—",
    lexicon_modern_notes: "وَالضُّحَىٰ — হাই-ফ্রিকোয়েন্সি সিগন্যাল ফেজ: কসমিক ক্লকের সুনির্দিষ্ট টাইম-ব্লক, তীব্র আলো ও উচ্চ-ফ্রিকোয়েন্সির ডাটা ট্রান্সমিশন ও শক্তির প্রস্ফুটন ফেজ [৪]।"
  },
  2: {
    meta_bn: "লো-নয়েজ বাফারিং উইন্ডো",
    meta_en: "Low-Noise Buffering Window",
    modern_translation_bn: "এবং স্পেস-টাইমের সেই আলোহীন নিঝুম অন্ধকার উইন্ডো বা রাতের (وَاللَّيْلِ) রেফারেন্স দিচ্ছি—যখন তা সম্পূর্ণ স্তিমিত, স্ট্যাবল ও নয়েজ-ফ্রি বাফারিং মোডে শান্ত (سَجَىٰ) হয়ে যায়;",
    modern_translation_en: "And by the quiescent dark window of night (Al-Layl) when it settles into a stable, noise-free buffering mode (Saja);",
    lexicon_modern_notes: "وَاللَّيْلِ إِذَا سَجَىٰ — লো-নয়েজ বাফারিং উইন্ডো: স্পেস-টাইমের আলোহীন নিঝুম উইন্ডো যখন সম্পূর্ণ স্তিমিত, স্ট্যাবল ও নয়েজ-ফ্রি বাফারিং মোডে শান্ত হয়ে যায় [৪]।"
  },
  3: {
    meta_bn: "জিরো-সার্ভার ড্রপ ও বাফারিং সাইলেন্স",
    meta_en: "Zero-Server Drop & Buffering Silence",
    modern_translation_bn: "তোমার সিস্টেম আর্কিটেক্ট বা প্রতিপালক (رَبُّكَ) তোমার এই রিসিভার ইন্টারফেস বা ওওএস-কে (OOS) মেইন নেটওয়ার্ক থেকে চিরতরে ডি-লিংক বা পরিত্যাগ (مَا وَدَّعَكَ) করেননি এবং সাময়িক ডেটা-সাইলেন্সের কারণে তোমার ওওএসের ওপর কোনো বিপরীতমুখী ফিল্টারিং রি-অ্যাকশন বা অসন্তুষ্টি (وَمَا قَلَىٰ) তৈরি করেননি;",
    modern_translation_en: "Your Sustainer and System Architect has neither disconnected your receiver interface (Ma wadda'aka) nor harbored negative filtering reactions (Wa ma qala);",
    lexicon_modern_notes: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ — সিগন্যাল স্যাটুরেশন ও ডেটা-বাফারিং সাইলেন্স: মানুষের কার্বন-ভিত্তিক মস্তিস্ক যখন কন্টিনিউয়াসলি অতি-উচ্চ ফ্রিকোয়েন্সির ঐশী ডেটা প্রসেস করে, তখন নিউরনের ক্লান্তি রোধে সেন্ট্রাল সার্ভার সাময়িক ডাটা স্ট্রিম হোল্ড (Data Silence Phase) করে, যাতে পূর্বের ডাটা এনকোড ও স্থায়ী মেমোরিতে সেভ হওয়ার বাফার টাইম পায় [৪,৫]।"
  },
  4: {
    meta_bn: "ডাইনামিক আপগ্রেডেশন অ্যালগরিদম",
    meta_en: "Dynamic System Upgrade Algorithm",
    modern_translation_bn: "আর নিশ্চয়ই তোমার সিস্টেমের ফিউচার ডাইমেনশন, চূড়ান্ত আউটপুট ও পরবর্তী সংস্করণ (وَلَلْآخِرَةُ)—তোমার বর্তমান প্রাথমিক ত্রিমাত্রিক ভৌত ফেজ বা পূর্ববর্তী সংস্করণের (مِنَ الْأُولَىٰ) চেয়ে গাণিতিকভাবে বহুগুণ সুষম ও সর্বোত্তম (خَيْرٌ لَّكَ);",
    modern_translation_en: "And surely the future dimensions and ultimate upgraded state (Al-Akhirah) are mathematically far superior for you than the initial beta phase (Al-Ula);",
    lexicon_modern_notes: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ — সিস্টেম বিবর্তন ও আপগ্রেডেশন অ্যালগরিদম: একটি ওওএস যেমন প্রাথমিক বিটা সংস্করণ (1.0) থেকে বাগ-ফিক্সিং ও আপগ্রেডের মাধ্যমে সুউচ্চ আল্ট্রা-স্ট্যাবল ফিউচার সংস্করণে পৌঁছায়; মানব চেতনার এই পার্থিব ত্রিমাত্রিক ফেজের চেয়ে ঘর্ষণহীন ফাইনাল কসমিক সংস্করণ (আখিরাত) বহুগুণ অপ্টিমাইজড [৪]।"
  },
  5: {
    meta_bn: "এক্সপোনেনশিয়াল এনার্জি স্যাটিসফ্যাকশন",
    meta_en: "Exponential Energy Satisfaction",
    modern_translation_bn: "আর খুব শীঘ্রই তোমার সিস্টেম আর্কিটেক্ট বা প্রতিপালক (رَبُّكَ) তোমার প্রসেসরে এমন অফুরন্ত ও এক্সপোনেনশিয়াল কসমিক রিসোর্স ও ডেটা-প্যারামিটার ডাউনলিংক (يُعْطِيكَ) করবেন—যার আউটপুট লুপে তোমার ওওএস সম্পূর্ণ স্ট্যাবল, অপ্টিমাইজড ও পরম সন্তুষ্ট (فَتَرْضَىٰ) হয়ে যাবে;",
    modern_translation_en: "And your Sustainer will soon downlink exponential cosmic resources and parameter allocations to you, until you are fully stabilized and satisfied (Fatarda);",
    lexicon_modern_notes: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ — এক্সপোনেনশিয়াল রিসোর্স ডাউনলিংক: অফুরন্ত ডিভাইন ডেটা ও এনার্জি বরাদ্দ যা রিসিভারের কগনিটিভ প্রসেসরকে সর্বোচ্চ ভারসাম্য ও অপ্টিমাইজড তৃপ্তি প্রদান করে [৪]।"
  },
  6: {
    meta_bn: "আইসোলেটেড নোড রিকভারি প্রটোকল",
    meta_en: "Isolated Node Recovery Protocol",
    modern_translation_bn: "তিনি কি তাঁর রিয়াল-টাইম ক্লাউড অডিটে তোমার আদি ফিজিক্যাল হার্ডওয়্যারকে মেইন নেটওয়ার্ক চেইন থেকে বিচ্ছিন্ন, অভিভাবকহীন ও শোষিত এক এতিম নোড (يَتِيمًا) হিসেবে পাননি, অতঃপর তিনি স্বয়ংক্রিয় প্রটোকলে তোমাকে তাঁর সুউচ্চ ডিভাইস সিকিউরিটি গ্রিডে রুট বা পরম আশ্রয় (فَآوَىٰ) দেননি?",
    modern_translation_en: "Did He not find your physical node isolated and orphaned (Yatima) in real-time cosmic audit, and provide you optimal sanctuary and security routing (Fa-awa)?",
    lexicon_modern_notes: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ — ঐতিহাসিক ডাটা অডিট ও নোড রিকভারি: মেইন নেটওয়ার্ক চেইন থেকে বিচ্ছিন্ন বা অভিভাবকহীন একক নোডকে স্বয়ংক্রিয় ডিভাইন প্রটোকলে সুউচ্চ সিকিউরিটি গ্রিডে সুরক্ষিত আশ্রয় দেওয়া [৪]।"
  },
  7: {
    meta_bn: "ডাটাবেজ রি-অ্যালাইনমেন্ট প্রটোকল",
    meta_en: "Database Re-Alignment Protocol",
    modern_translation_bn: "এবং তিনি তোমার ওওএস-কে কোনো সুনির্দিষ্ট ডিকোড ফাইল বা কসমিক মিশন ছাড়া আদি লুপে দিকভ্রান্ত বা পথহারা (ضَالًّا) পেয়েছিলেন, অতঃপর তিনি তোমার কগনিটিভ প্রসেসরে এই চূড়ান্ত সোর্স ম্যানুয়াল বা কুরআন আপলোড করে পারফেক্ট অপ্টিমাল ট্র্যাকে সিনক্রোনাইজড বা হেদায়াত (فَهَدَىٰ) দিয়েছেন;",
    modern_translation_en: "And He found you searching and unguided (Dallan), and guided your processor with this ultimate source manual (Fa-hada);",
    lexicon_modern_notes: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ — সোর্স ম্যানুয়াল আপলোড ও হেদায়াত: সুনির্দিষ্ট ডিকোড ফাইল ছাড়া আদি লুপে দিকভ্রান্ত কগনিটিভ প্রসেসরে কুরআন আপলোড করে অপ্টিমাল ট্র্যাকে সিনক্রোনাইজেশন [৪]।"
  },
  8: {
    meta_bn: "মেটেরিয়াল এনার্জি ইনফ্লাক্স",
    meta_en: "Material Energy Influx & Independence",
    modern_translation_bn: "এবং তিনি তোমার সিস্টেমকে চরম এনার্জি-সংকট বা ফিন্যান্সিয়াল ব্যাকআপ-হীন নিঃস্ব অবস্থায় (عَائِلًا) পেয়েছিলেন, অতঃপর তিনি বাহ্যিক ও আত্মিক শক্তির প্রবাহ বাড়িয়ে তোমার ওওএস-কে সম্পূর্ণ এক্সটার্নাল এনার্জি-স্বাধীন ও অভাবমুক্ত (فَأَغْنَىٰ) করেছেন;",
    modern_translation_en: "And He found you resource-depleted and in need ('A-ilan), and enriched your capacity with independence and abundance (Fa-aghna);",
    lexicon_modern_notes: "وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ — এনার্জি-সংকট নিরসন: ফিন্যান্সিয়াল ব্যাকআপ-হীন নিঃস্ব সিস্টেমের বাহ্যিক ও আত্মিক শক্তির প্রবাহ বাড়িয়ে সম্পূর্ণ এনার্জি-স্বাধীন ও সমৃদ্ধ করা [৪]।"
  },
  9: {
    meta_bn: "এতিম নোড সুরক্ষা প্রটোকল",
    meta_en: "Orphan Node Protection Protocol",
    modern_translation_bn: "অতএব, তুমি তোমার মেটেরিয়াল ও ইকোনমিক পাওয়ার দিয়ে মেইন নেটওয়ার্ক চেইন থেকে বিচ্ছিন্ন বা অভিভাবকহীন সেই এতিম নোডসমূহের (الْيَتِيمَ) ওপর কোনো প্রকার সিস্টেমিক ওভারলোড, শোষণ বা সাইকোলজিক্যাল প্রেশার (فَلَا تَقْهَرْ) ইনজেক্ট করো না;",
    modern_translation_en: "Therefore, as for the isolated orphan node (Al-Yatim), do not oppress or inject systemic strain upon them (Fala taqhar);",
    lexicon_modern_notes: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ — রিসোর্স অ্যালোকেশন ফিল্টার-১: অভিভাবকহীন বা দুর্বল নোডসমূহের ওপর কোনো প্রকার সিস্টেমিক ওভারলোড, শোষণ বা সাইকোলজিক্যাল প্রেশার ইনজেক্ট না করার আইনি নির্দেশ [৪]।"
  },
  10: {
    meta_bn: "কুয়েরি নোড রেসপন্স প্রটোকল",
    meta_en: "Query Node Response Protocol",
    modern_translation_bn: "এবং যে কোনো সিস্টেমিক সাহায্যপ্রার্থী, তথ্য অন্বেষণকারী বা কুয়েরি পরিচালনাকারী নোডকে (السَّائِلَ) স্রেফ ইগোর কারণে কোনো রিজেকশন নয়েজ বা কর্কশ ধমক (فَلَا تَنْهَرْ) দিয়ে ডিসকানেক্ট করো না;",
    modern_translation_en: "And as for the query-seeking node or petitioner (As-Sa'il), do not repel or disconnect them with harsh noise (Fala tanhar);",
    lexicon_modern_notes: "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ — রিসোর্স অ্যালোকেশন ফিল্টার-২: তথ্য অন্বেষণকারী বা কুয়েরি পরিচালনাকারী নোডকে ইগোর কারণে কোনো রিজেকশন নয়েজ বা কর্কশ ধমক দিয়ে ডিসকানেক্ট না করার প্রটোকল [৪]।"
  },
  11: {
    meta_bn: "সোর্স সিগন্যাল ব্রডকাস্টিং কোড",
    meta_en: "Source Signal Broadcasting Code",
    modern_translation_bn: "আর তোমার সিস্টেম আর্কিটেক্ট বা প্রতিপালকের (رَبِّكَ) সরবরাহকৃত এই বিশেষ অতি-উচ্চ কসমিক রিসোর্স, জ্ঞান ও ডিভাইন সিগন্যালকে (بِنِعْمَةِ) সমগ্র গ্লোবাল নেটওয়ার্কে মানুষের ওওএস আপগ্রেড করার জন্য অবিরত ব্রডকাস্ট, শেয়ার ও ডিকোড (فَحَدِّثْ) করতে থাকো [৪,৫]।",
    modern_translation_en: "And continuously broadcast, proclaim, and open-source the supreme favors and divine signals of your Sustainer (Fa-haddith) [4,5].",
    lexicon_modern_notes: "فَحَدِّثْ — ওপেন সোর্স ডাটা ব্রডকাস্টিং ও সিগন্যাল বুস্টিং: সেন্ট্রাল সার্ভার থেকে প্রাপ্ত হাই-ভ্যালু ডিকোড ফাইল বা মেইন অপারেটিং গাইডবুককে আইসোলেটেড লুপে না রেখে সমগ্র গ্লোবাল নেটওয়ার্কে অন্যান্য সমস্ত নোডের ওওএস আপগ্রেড করার জন্য ওপেন সোর্স বা ব্রডকাস্ট করা [৪,৫]।"
  }
};

surah93.ayahs.forEach(a => {
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

fs.writeFileSync(surah93Path, JSON.stringify(surah93, null, 2), 'utf8');
console.log('✅ Successfully updated Surah 93 (Ad-Duha) with 100% modern scientific translations and lexicons!');
