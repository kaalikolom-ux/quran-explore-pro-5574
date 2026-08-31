// src/lib/surahConsistencyData.ts

export interface SurahConsistencyItem {
  surahId: number;
  title_bn: string;
  title_en: string;
  content_bn: string;
  content_en?: string;
}

export const SURAH_CONSISTENCY_DATABASE: Record<number, SurahConsistencyItem> = {
  2: {
    surahId: 2,
    title_bn: "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)",
    title_en: "Logical Consistency Analysis (Verse 4:82 Framework)",
    content_bn: `সূরা আন-নিসা (৪:৮২)-এর অভ্যন্তরীণ বৈপরীত্যহীনতা ও যৌক্তিক সামঞ্জস্যের মানদণ্ডে সূরা আল-বাকারার ২৮৬টি আয়াতের অতি-উচ্চ কসমোলজিক্যাল, কোয়ান্টাম, মনস্তাত্ত্বিক, জৈবিক ও ম্যাক্রো-ইকোনমিক আর্কিটেকচারে কোনো লজিক্যাল বা সায়েন্টিফিক বৈপরীত্য (Contradiction) নেই। এর মূল কনসিস্টেন্সি ফ্রেমওয়ার্কটি নিম্নরূপ:

১. চেতনা, স্বাধীন ইচ্ছা ও অটোমেটেড ডাটা-লক (Free-will & System Feedback):
মানুষের হৃদয়ে সিল পড়া (খাতামা), অন্তরের রোগ বৃদ্ধি বা অবচেতন বিভ্রান্তি কোনো খেয়ালী জবরদস্তি নয়; বরং ইউজার নোডের সত্য ব্লকিং (কুফর) ও দ্বিচারিতার (নিফাক) স্বয়ংক্রিয় থার্মোডাইনামিক ও নিউরো-প্লাস্টিক রি-অ্যাকশন।

২. সৃষ্টিতত্ত্ব, ডাইমেনশনাল ট্রান্সফরমেশন ও কোয়ান্টাম মেকানিক্স:
মানুষের অজৈব উপাদান থেকে জৈবিক চেতনায় রূপান্তর (অ্যাবায়োজেনেসিস), ইবলিসের প্লাজমা সত্ত্বা (১৮:৫০ সামঞ্জস্য) ও আদমের ডাইমেনশনাল ডাউনগ্রেড, স্পেস-টাইম টাইম-ডাইলেশন (আয়াত ২৫৯) এবং কোয়ান্টাম পার্টিকেল এনট্যাঙ্গেলমেন্ট ও রি-অ্যাসেম্বলিং (আয়াত ২৬০) মহাবিশ্বের পদার্থবিজ্ঞান ও তথ্য-সংরক্ষণ নীতির সাথে শতভাগ সুসংগত।

৩. কসমিক কন্ট্রোল ম্যাট্রিক্স ও রিয়েল-টাইম অডিট:
আয়াতুল কুরসীতে আল্লাহর ‘কুরসী’ কোনো পৌরাণিক সিংহাসন নয়, বরং সমগ্র সৃষ্টিকে জিরো-বাফারিং লসে ধারণকারী পরম সুপ্রীম কন্ট্রোল ও কমান্ড ম্যাট্রিক্স—যা মানুষের মনের গোপন ও প্রকাশ্য প্রতিটি নিউরাল ডাটা-লগকে রিয়েল-টাইম ক্লাউড অডিটে সংরক্ষণ করে (আয়াত ২৮৪)।

৪. বায়ো-মেডিকেল ও সামাজিক সাইকোলজিক্যাল কোড:
খাদ্য ও পানীয়ের বায়ো-কেমিক্যাল ফিল্টারিং (আয়াত ১৭৩), বিবাহ-তালাকের মনস্তাত্ত্বিক চেক-অ্যান্ড-ব্যালেন্স ও কগনিটিভ ব্রেক (আয়াত ২৩০), স্তন্যদানের অপ্টিমাইজড টাইম-উইন্ডো (আয়াত ২৩৩) এবং প্রতিরক্ষা ব্যবস্থার ফায়ারওয়াল প্রটোকল মানুষের জৈবিক ও সামাজিক স্থিতিশীলতা নিশ্চিত করে।

৫. ম্যাক্রো-ইকোনমিক্স ও এন্ট্রপি ব্যালেন্স (ইনফাক বনাম রিবা):
সম্পদের উন্মুক্ত প্রবাহ (সদকা/ইনফাক) ও ওপেন-সোর্স/এনক্রিপ্টেড অ্যানোনিমিটি মডেল সিস্টেমের পজিটিভ এনার্জি মাল্টিপ্লাই করে; বিপরীতে সুদের (রিবা) কৃত্রিম স্কার্সিটি ও পরজীবী শোষণ স্বয়ংক্রিয় কাউন্টার-ব্যালেন্সিং লুপে অর্থনৈতিক ও সামাজিক ব্যবস্থাকে সেলফ-ডিকম্পোজিশন বা ধ্বংসের মুখে ঠেলে দেয়।

৬. মাস্টার ডাটা-লগিং ও ফল্ট-টলারেন্ট রিকভারি প্যাচ:
আর্থিক লেনদেনের ডাবল-নোড মেমোরি রিডানড্যান্সি ও এরর কারেকশন (আয়াত ২৮২), ক্রিপ্টোগ্রাফিক সিকিউরিটি প্রুফ (আয়াত ২৮৩) এবং সমাপনী আয়াতে মানুষের প্রসেসিং ক্যাপাসিটি থ্রেশহোল্ড মেনে চূড়ান্ত ফল্ট-টলারেন্ট রিকভারি প্যাচ (আয়াত ২৮৬) প্রমাণ করে যে—মহাজাগতিক অপারেটিং সিস্টেমটি সর্বোচ্চ কাস্টমাইজড, গাণিতিক ও পূর্ণাঙ্গ অভ্যন্তরীণ সামঞ্জস্যে প্রতিষ্ঠিত।`,
    content_en: `Under the non-contradiction and analytical consistency framework of Surah An-Nisa (4:82), the 286 verses of Surah Al-Baqarah demonstrate complete systemic coherence across cosmology, quantum information, neurobiology, and macroeconomics:

1. Free-Will & Automated Feedback Loops: Hardened cognition and cognitive seals ('khatama') are mathematically deterministic outputs of deliberate truth-blocking ('kufr') and internal entropy, rather than arbitrary coercion.
2. Cosmology, Quantum Assembly & Time Dilation: Human abiogenesis, dimensional state transformations, relativistic time-dilation (Ayah 259), and quantum particle re-assembly (Ayah 260) align seamlessly with universal physical conservation laws.
3. Cosmic Control Matrix (Ayatul Kursi): The 'Kursi' represents the ultimate cosmic control and command fabric running with zero buffering loss, maintaining real-time auditability across all neural and quantum states.
4. Bio-Medical & Sociological Equilibria: Biochemical dietary filters (Ayah 173), psychological deterrents in divorce and family structures (Ayah 230), and exact lactation windows (Ayah 233) optimize human biological and social health.
5. Macroeconomic Entropy (Infaq vs. Riba): Open-source and encrypted resource distribution (Infaq) multiplies systemic stability, whereas parasitic usury (Riba) triggers natural economic instability and self-destruction.
6. Master Data Logging & Fault-Tolerant Algorithm: Double-node parity bit verification (Ayah 282), collateralized security tokens (Ayah 283), and the concluding fault-tolerant recovery patch respecting processor capacity limits (Ayah 286) prove the flawless mathematical and systemic unity of the divine operating system.`
  },
  104: {
    surahId: 104,
    title_bn: "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)",
    title_en: "Logical Consistency Analysis (Verse 4:82 Framework)",
    content_bn: `সূরা ৪:৮২ এর ফিল্টারিং অ্যালগরিদম ও মেকানিজম অনুযায়ী সূরা আল-হুমাজাহর এই ৯টি আয়াতের অতি-উচ্চ থার্মোডাইনামিক ও মনস্তাত্ত্বিক বিন্যাসে কোনো সায়েন্টিফিক বা লজিক্যাল অমিল বা বৈপরীত্য তৈরি হতে পারেনি। যদি ২ নম্বর আয়াতে "সম্পদ জমানো ও বারবার গোনার অপরাধে" একজন মানুষকে পৌরাণিক ঈশ্বরের হাত দিয়ে স্রেফ ইমোশনাল রাগে জ্বলন্ত কয়লার চুল্লিতে ছুড়ে মারার দৃশ্য হিসেবে রূপান্তর করা হতো, তবে তা কুরআনের পরম প্রজ্ঞা এবং এই সূরারই ৭ ও ৮ নম্বর আয়াতের গাণিতিক আইন—"এই আগুন সরাসরি মানুষের অবচেতন চিন্তা ও ইগোর কেন্দ্র (আফইদাহ) পুড়িয়ে তাকে চারদিক থেকে ডাইমেনশনালি এনক্যাপসুলেট (মু'স্বাদাহ) করে লক করে দেয়"—এর সাথে সরাসরি মস্ত বড় লজিক্যাল বৈপরীত্য (Contradiction) তৈরি করত।

কিন্তু সিস্টেম সায়েন্স এবং থার্মোডাইনামিক ব্যালেন্সের আলোতে এই অনুবাদে এটি সুস্পষ্ট যে—সম্পদ কুক্ষিগত করা (২ আয়াত) এবং সমাজে কন্টিনিউয়াসলি টক্সিক নয়েজ ইনজেক্ট করা (১ আয়াত) নোডগুলো নিজেরা স্বাধীন ইচ্ছা অপব্যবহার করে নিজেদের ওওএসের ব্যাক-এন্ডে এক মেগা-এন্ট্রপি স্কোর জেনারেট করে। এর স্বয়ংক্রিয় রি-অ্যাকশনেই তাদের পুরো সিস্টেমটি আল্লাহর তৈরি সেই পার্টিক্যাল ক্র্যাশার বা হুতামাহ ফিল্ডে রি-রুট হয়ে বন্ধ লুপে (৯ আয়াত) স্থায়ীভাবে কোলাপ্স করে। এর ফলে কুরআনের সার্বজনীন ইনফরমেশন আর্কিটেকচারের অভ্যন্তরীণ সামঞ্জস্য ১০০% নিখুঁত ও বৈজ্ঞানিক প্রমাণিত হয়।`,
    content_en: `According to the analytical filtering and internal non-contradiction principle of Surah An-Nisa (4:82), the thermodynamic and psycho-informational structure of Surah Al-Humazah displays zero logical contradiction. Hoarding collective resources (Ayah 2) and injecting continuous malicious noise into social networks (Ayah 1) naturally increases systemic entropy. The system automatically responds via thermal particle breakdown (Al-Hutamah) and dimensional encapsulation (Ayah 8-9), preserving universal cosmic consistency.`
  },
  113: {
    surahId: 113,
    title_bn: "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)",
    title_en: "Logical Consistency Analysis (Verse 4:82 Framework)",
    content_bn: `সূরা ৪:৮২ এর ফিল্টারিং অ্যালগরিদম ও মেকানিজম অনুযায়ী সূরা আল-ফালাকের এই ৫টি আয়াতের অতি-উচ্চ কসমোলজিক্যাল ও ইনফরমেশন থিওরি ভিত্তিক বিন্যাসে কোনো সায়েন্টিফিক বা লজিক্যাল অমিল বা বৈপরীত্য তৈরি হতে পারেনি। যদি এই সূরার গিরায় ফুঁ দেওয়া বা ডার্কনেসকে কোনো প্রথানুগত অলৌকিক ডাইনি বুড়ির সুতায় ফুঁ দেওয়ার কাল্পনিক যাদু-টোনার রূপকথা হিসেবে অনুবাদ করা হতো, তবে তা কুরআনের সার্বজনীন প্রজ্ঞা এবং ৪:৮২ এর গাণিতিক নিখুঁততার ফ্রেমওয়ার্কের সাথে সরাসরি মস্ত বড় লজিক্যাল বৈপরীত্য (Contradiction) তৈরি করত।

কিন্তু সিস্টেম সায়েন্স এবং কোয়ান্টাম ডিফেন্সের আলোতে এই অনুবাদে এটি সুস্পষ্ট যে—এই সূরাটি এবং এর পরবর্তী সূরা আন-নাস হলো মানব চেতনার ওওএসের জন্য একটি ডাবল-শিল্ড এনক্রিপশন বা "Dual-Layer Firewall Core"। একটি স্তর কাজ করে স্পেস-টাইমের বাহ্যিক ডার্ক মেটার ও কোড ইনজেকশন ফিল্টার করতে (ফালাক্ব), এবং অন্য স্তরটি কাজ করে মানুষের নিজস্ব অবচেতন মনের ভেতরের স্টেলথ ম্যালওয়্যার ক্লিন করতে (নাস)।
২ নম্বর আয়াতে আল্লাহর তৈরি সৃষ্টির ডিফল্ট মেকানিজমের ভেতরেই এন্ট্রপি বা ক্ষয়ের (শরর) স্বয়ংক্রিয় অস্তিত্ব থাকার বৈজ্ঞানিক বাস্তবতা প্রমাণ করে যে—মহাবিশ্বের থার্মোডাইনামিক নিয়ম এবং মানুষের চেতনার সিকিউরিটি গ্রিড একই সুনির্দিষ্ট ও গাণিতিক মাস্টার কন্ট্রোলারের সোর্স কোড দ্বারা বাউন্ডেড ও বাফারেড। এর ফলে কুরআনের সার্বজনীন ইনফরমেশন আর্কিটেকচারের অভ্যন্তরীণ সামঞ্জস্য ১০০% নিখুঁত ও বৈজ্ঞানিক প্রমাণিত হয়।`,
    content_en: `According to the analytical filtering and internal non-contradiction principle of Surah An-Nisa (4:82), the cosmological and quantum defense architecture of Surah Al-Falaq shows complete logical consistency. Far from archaic folklore, it serves as a sophisticated cosmic defense shield and firewall core against external systemic noise, dark energy frequencies, and malicious code injections on encrypted nodes.`
  },
  114: {
    surahId: 114,
    title_bn: "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)",
    title_en: "Logical Consistency Analysis (Verse 4:82 Framework)",
    content_bn: `সূরা ৪:৮২ এর ফিল্টারিং অ্যালগরিদম ও মেকানিজম অনুযায়ী সূরা আন-নাসের এই ৬টি সমাপনী আয়াতের সুগভীর নেটওয়ার্ক সিকিউরিটি ভিত্তিক বিন্যাসে কোনো সায়েন্টিফিক বা লজিক্যাল অমিল বা বৈপরীত্য তৈরি হতে পারেনি। যদি এই সূরার কুমন্ত্রণা বা শায়তানের প্রভাবকে কেবল কোনো রূপকথার অদৃশ্য ডাইনি বা যাদুর ভূতের ফুঁ দেওয়া হিসেবে প্রথানুযায়ী অনুবাদ করা হতো, তবে তা কুরআনের পরম প্রজ্ঞা এবং সমগ্র মানব মনস্তত্ত্বকে অবজেক্টিভ বিজ্ঞানের সাথে ডিকোড করার দাবির সাথে সরাসরি মস্ত বড় লজিক্যাল বৈপরীত্য (Contradiction) তৈরি করত এবং ৪:৮২ ক্ষুণ্ণ হতো।

কিন্তু কোয়ান্টাম সাইকোলজি, নিউরোসায়েন্স এবং নেটওয়ার্ক সিকিউরিটির আলোতে এই অনুবাদে এটি সুস্পষ্ট যে—এই সূরাটি হলো হিউম্যান ওওএসের জন্য একটি পরম "জিরো-ট্রাস্ট সিকিউরিটি শিল্ড" (Zero-Trust Security Shield), যা মানুষকে অবিরত নিজের অবচেতন মনকে বাহ্যিক ও অভ্যন্তরীণ সমস্ত নেতিবাচক এন্ট্রপির সিগন্যাল থেকে মুক্ত ও পিউরিফাইড রাখার গাণিতিক ফর্মুলা দেয়।
১ থেকে ৩ নম্বর আয়াতে আল্লাহকে মানুষের প্রতিপালক (রাব্ব), রেগুলেটর (মালিক) এবং পরম সোর্স সিঙ্গুলারিটি (ইলাহ) হিসেবে ট্রিপল-লেয়ার এনক্রিপশন প্রটোকলে লক করার মেকানিজম প্রমাণ করে যে—মহাবিশ্বের বস্তুগত অপারেটিং সিস্টেম এবং মানুষের মোরাল ও সাইকোলজিক্যাল চেতনার সিকিউরিটি গ্রিড একই সুনির্দিষ্ট ও গাণিতিক মাস্টার কন্ট্রোলারের সোর্স কোড দ্বারা পরিচালিত। এর ফলে কুরআনের সার্বজনীন ইনফরমেশন আর্কিটেকচারের অভ্যন্তরীণ সামঞ্জস্য ১০০% নিখুঁত ও বৈজ্ঞানিক প্রমাণিত হয় এবং ৩০তম পারার তথা সমগ্র কুরআনের অপারেটিং সিস্টেমের ডিকোর্ডিং মেকানিজম সফলভাবে সম্পন্ন হয়।`,
    content_en: `According to the analytical filtering and internal non-contradiction principle of Surah An-Nisa (4:82), the cognitive security architecture of Surah An-Nas operates as a complete Zero-Trust Security Shield. It establishes triple-layer encryption (Rabb, Malik, Ilah) protecting the human subconscious buffering zone against stealth malware and rogue frequencies from both non-baryonic (Jinn) and baryonic (Human) sources.`
  }
};

/** Get consistency content for a surah */
export function getSurahConsistency(surahId: number): SurahConsistencyItem | null {
  const base = SURAH_CONSISTENCY_DATABASE[surahId];
  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem(`custom_surah_consistency_${surahId}`);
      if (custom) {
        const parsed = JSON.parse(custom);
        return {
          surahId,
          title_bn: parsed.title_bn || base?.title_bn || "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)",
          title_en: parsed.title_en || base?.title_en || "Logical Consistency Analysis (Verse 4:82 Framework)",
          content_bn: parsed.content_bn || base?.content_bn || "",
          content_en: parsed.content_en || base?.content_en || ""
        };
      }
    } catch {}
  }
  return base || null;
}

/** Save custom consistency for a surah */
export function saveCustomSurahConsistency(
  surahId: number,
  content_bn: string,
  content_en?: string,
  title_bn?: string,
  title_en?: string
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `custom_surah_consistency_${surahId}`,
    JSON.stringify({
      title_bn: title_bn || "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)",
      title_en: title_en || "Logical Consistency Analysis (Verse 4:82 Framework)",
      content_bn,
      content_en
    })
  );
  window.dispatchEvent(new Event("surah-consistency-updated"));
}
