// src/lib/staticArticlesData.ts

export interface StaticCategory {
  id: string;
  name_bn: string;
  name_en: string;
  slug: string;
  description_bn?: string;
  description_en?: string;
  sort_order?: number;
  is_restricted?: boolean;
}

export interface StaticAuthor {
  id: string;
  name_bn: string;
  name_en: string;
  bio_bn?: string;
  bio_en?: string;
  image_url?: string;
}

export interface StaticArticle {
  id: string;
  slug: string;
  title_bn: string;
  title_en?: string;
  excerpt_bn: string;
  excerpt_en?: string;
  content_bn: string;
  content_en?: string;
  cover_image_url?: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at?: string;
  author_id?: string;
  category_id?: string;
  tags?: string[];
  author?: StaticAuthor;
  category?: StaticCategory;
}

export const STATIC_CATEGORIES: StaticCategory[] = [
  {
    id: "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    name_bn: "বিজ্ঞানভিত্তিক",
    name_en: "Scientific",
    slug: "scientific",
    description_bn: "পবিত্র কুরআনের আয়াতভিত্তিক বৈজ্ঞানিক বিশ্লেষণ, ইনফরমেশন থিওরি ও মহাজাগতিক অপারেটিং সিস্টেম ফ্রেমওয়ার্ক।",
    description_en: "Scientific verse analysis, information theory, and Cosmic Operating System frameworks of the Holy Quran.",
    sort_order: 1,
    is_restricted: false,
  },
];

export const STATIC_AUTHORS: Record<string, StaticAuthor> = {
  "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1": {
    id: "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    name_bn: "আলম এম.",
    name_en: "Alam M",
    bio_bn: "কুরআনের শব্দ ও সংখ্যা গভীর চিন্তার আহ্বান জানায়। আমি সেই চিহ্নগুলো অনুসরণ করি। আমি আলম, পাঠ্যের কাছে নম্র, বিশ্লেষণে কঠোর। লিখি নিজের বোধ থেকে; চূড়ান্ত জ্ঞান একমাত্র আল্লাহর কাছে।",
    bio_en: "The Quran’s words and numbers invite deep thought. I trace those traces. I'm Alam, humble before the text, rigorous in analysis. I write from my understanding; only ALLAH knows best.",
    image_url: "https://res.cloudinary.com/coindyna/image/upload/i_am_alam.webp",
  },
};

export const STATIC_ARTICLES: StaticArticle[] = [{
  "id": "art-quranic-terms-conventional-vs-modern-scientific-meanings",
  "slug": "quranic-terms-conventional-vs-modern-scientific-meanings",
  "title_bn": "কুরআনিক পরিভাষাকোষ: প্রচলিত অর্থ বনাম আধুনিক বিজ্ঞানভিত্তিক অর্থ (৪:৮২ লজিক্যাল সামঞ্জস্য নির্দেশিকা)",
  "title_en": "Quranic Lexicon: Conventional Meanings vs Modern Scientific Concepts (Verse 4:82 Consistency Guide)",
  "excerpt_bn": "জ্বীন, ইনসান, মালাইকা, শয়তান, ইবলিস, আরশ, কুরসী, কিতাব, কলম, আকাশ, জমিন, পাহাড়, নূর, অন্ধকার ও রূহ — প্রচলিত রূপকথার ফ্যান্টাসি থেকে মুক্ত হয়ে কীভাবে এই শব্দগুলো মহাজাগতিক বিজ্ঞান ও ৪:৮২ ফিল্টারে নিখুঁত ও বাস্তব অর্থ প্রকাশ করে।",
  "excerpt_en": "Decoding core Quranic terminology — Jinn, Insan, Malaikah, Shaytan, Iblis, Arsh, Kursi, Kitab, Qalam, Samawat, Ard, Jibal, Noor, Dhulumaat, and Rooh — from fairy-tale tropes into rigorous scientific frameworks under Surah 4:82.",
  "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
  "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
  "published": true,
  "published_at": "2026-09-03T08:15:00.000Z",
  "created_at": "2026-09-03T08:15:00.000Z",
  "updated_at": "2026-09-03T08:15:00.000Z",
  "tags": [
    "কুরআনিক পরিভাষাকোষ",
    "বিজ্ঞানভিত্তিক অর্থ",
    "প্রচলিত অর্থ বনাম আধুনিক অর্থ",
    "৪:৮২ লজিক্যাল কনসিস্টেন্সি",
    "জ্বীন ও ইনসান",
    "মালাইকা ও শয়তান",
    "আলম এম."
  ],
  "author": {
    "id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "name_bn": "আলম এম.",
    "name_en": "Alam M",
    "bio_bn": "কুরআনের শব্দ ও সংখ্যা গভীর চিন্তার আহ্বান জানায়। আমি সেই চিহ্নগুলো অনুসরণ করি। আমি আলম, পাঠ্যের কাছে নম্র, বিশ্লেষণে কঠোর। লিখি নিজের বোধ থেকে; চূড়ান্ত জ্ঞান একমাত্র আল্লাহর কাছে।",
    "bio_en": "The Quran’s words and numbers invite deep thought. I trace those traces. I'm Alam, humble before the text, rigorous in analysis. I write from my understanding; only ALLAH knows best.",
    "image_url": "https://res.cloudinary.com/coindyna/image/upload/i_am_alam.webp"
  },
  "category": {
    "id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "name_bn": "বিজ্ঞানভিত্তিক",
    "name_en": "Scientific",
    "slug": "scientific",
    "description_bn": "পবিত্র কুরআনের আয়াতভিত্তিক বৈজ্ঞানিক বিশ্লেষণ, ইনফরমেশন থিওরি ও মহাজাগতিক অপারেটিং সিস্টেম ফ্রেমওয়ার্ক।",
    "description_en": "Scientific verse analysis, information theory, and Cosmic Operating System frameworks of the Holy Quran.",
    "sort_order": 1,
    "is_restricted": false
  },
  "content_bn": "\n<div class=\"article-rich-container space-y-10 text-foreground/90 font-sans\">\n\n  <!-- ইন্ট্রোডাকশন ও মেথডোলজি কার্ড -->\n  <div class=\"rounded-3xl border-2 border-primary/20 bg-linear-to-br from-primary/5 via-background to-secondary/20 p-6 sm:p-10 shadow-lg backdrop-blur-xs\">\n    <div class=\"flex items-center gap-2 mb-4\">\n      <span class=\"inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold tracking-wide rounded-full bg-primary text-primary-foreground uppercase shadow-xs\">\n        ⚖️ ৪:৮২ ফিল্টার ভিত্তিক পরিভাষাকোষ\n      </span>\n      <span class=\"text-xs text-muted-foreground font-medium\">কোর লেক্সিকন ফ্রেমওয়ার্ক</span>\n    </div>\n    <h2 class=\"text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4\">\n      কুরআনিক পরিভাষার বৈজ্ঞানিক রূপান্তর ও ৪:৮২ ফিল্টার\n    </h2>\n    <p class=\"text-base sm:text-lg leading-relaxed text-foreground font-medium mb-3\">\n      আমরা যদি <strong>জ্বীন, ইনসান, মালাইকা, শয়তান, ইবলিস, আরশ, কুরসী, কলম ও কিতাব</strong>—এই মহাজাগতিক পরিভাষাগুলোকে প্রচলিত লোককাহিনি বা রূপকথার ফ্যান্টাসি হিসেবে ধরে রাখি, তবে সিস্টেমের অন্যান্য আয়াতের সাথে অনিবার্যভাবে <strong>লজিক্যাল কোলাপ্স (Logical Collapse)</strong> ঘটবে এবং সূরা আন-নিসা (৪:৮২)-এর সেই অবিনশ্বর ডিটেকশন কোড—<em>\"তাতে তারা অনেক বৈপরীত্য খুঁজে পেত\"</em>—এর লঙ্ঘন হয়ে যাবে।\n    </p>\n    <p class=\"text-sm sm:text-base text-muted-foreground leading-relaxed\">\n      নিচে প্রতিটি মূল শব্দের <strong>আরবি রুট</strong>, <strong>প্রচলিত ঐতিহ্যবাহী অর্থ</strong>, তার <strong>যৌক্তিক সীমাবদ্ধতা</strong> এবং <strong>আধুনিক বিজ্ঞানভিত্তিক ও সিস্টেমিক অর্থ</strong> পাশাপাশি উপস্থাপন করা হলো।\n    </p>\n  </div>\n\n  <!-- সেকশন ১: সচেতন সত্তা ও বুদ্ধিবৃত্তিক এন্টিটিজ -->\n  <div class=\"space-y-6\">\n    <div class=\"flex items-center gap-3 border-b-2 border-primary/20 pb-3\">\n      <div class=\"size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg\">১</div>\n      <div>\n        <h3 class=\"text-xl sm:text-2xl font-bold text-foreground\">সচেতন সত্তা ও ইন্টেলিজেন্ট এন্টিটিজ (Sentient & Executive Entities)</h3>\n        <p class=\"text-xs sm:text-sm text-muted-foreground\">জ্বীন, ইনসান, মালাইকা, শয়তান, ইবলিস ও রূহ</p>\n      </div>\n    </div>\n\n    <!-- কার্ড গ্রিড -->\n    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6\">\n\n      <!-- ১.১ জ্বীন -->\n      <div class=\"rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 transition-all\">\n        <div class=\"flex items-center justify-between mb-3 border-b border-border/60 pb-2\">\n          <span class=\"text-2xl font-arabic font-bold text-primary\">الْجِنّ (Jinn)</span>\n          <span class=\"text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground\">Root: ج-ن-ن</span>\n        </div>\n        <div class=\"space-y-3 text-sm\">\n          <div class=\"p-3 rounded-xl bg-muted/40 border border-border/50\">\n            <span class=\"text-xs font-bold text-muted-foreground uppercase block mb-1\">📖 প্রচলিত অর্থ:</span>\n            <p class=\"text-foreground/80\">অদৃশ্য ভূত, আগুনের তৈরি অশরীরী জীব যা গাছে বা নির্জন স্থানে থাকে এবং মানুষকে ভর করে।</p>\n          </div>\n          <div class=\"p-3 rounded-xl bg-primary/10 border border-primary/30\">\n            <span class=\"text-xs font-bold text-primary uppercase block mb-1\">🔬 আধুনিক বিজ্ঞানভিত্তিক অর্থ:</span>\n            <p class=\"text-foreground font-semibold\">হিডেন বায়ো-ইলেকট্রিক এনার্জি স্পেকট্রাম / প্লাজমা-বেসড এনার্জি ফিল্ড (Hidden Bio-Electric Plasma Entities)।</p>\n            <p class=\"text-xs text-muted-foreground mt-1\"><strong>আক্ষরিক রুট:</strong> <em>জিন্না / জান্না</em> = যা মানুষের দৃশ্যমান অপটিক্যাল স্পেকট্রামের বাইরে আবৃত থাকে (৫৫:১৫, ১৫:২৭)।</p>\n          </div>\n        </div>\n      </div>\n\n      <!-- ১.২ ইনসান -->\n      <div class=\"rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 transition-all\">\n        <div class=\"flex items-center justify-between mb-3 border-b border-border/60 pb-2\">\n          <span class=\"text-2xl font-arabic font-bold text-primary\">الْإِنسَان (Insan)</span>\n          <span class=\"text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground\">Root: أ-ن-س / ن-س-ي</span>\n        </div>\n        <div class=\"space-y-3 text-sm\">\n          <div class=\"p-3 rounded-xl bg-muted/40 border border-border/50\">\n            <span class=\"text-xs font-bold text-muted-foreground uppercase block mb-1\">📖 প্রচলিত অর্থ:</span>\n            <p class=\"text-foreground/80\">সাধারণ রক্ত-মাংসের মানুষ বা মানবজাতি।</p>\n          </div>\n          <div class=\"p-3 rounded-xl bg-primary/10 border border-primary/30\">\n            <span class=\"text-xs font-bold text-primary uppercase block mb-1\">🔬 আধুনিক বিজ্ঞানভিত্তিক অর্থ:</span>\n            <p class=\"text-foreground font-semibold\">কার্বন-বেসড বায়োলজিক্যাল হার্ডওয়্যার, সমাজবদ্ধ সচেতন ইন্টেলিজেন্ট নোড (Carbon-Based Intelligent Cognitive Node)।</p>\n            <p class=\"text-xs text-muted-foreground mt-1\"><strong>আক্ষরিক রুট:</strong> <em>উন্স / নাস</em> = সমাজবদ্ধ পারস্পরিক যোগাযোগক্ষম ও শিক্ষণক্ষম সত্তা (৫৫:১৪, ৯৬:৫)।</p>\n          </div>\n        </div>\n      </div>\n\n      <!-- ১.৩ মালাইকা -->\n      <div class=\"rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 transition-all\">\n        <div class=\"flex items-center justify-between mb-3 border-b border-border/60 pb-2\">\n          <span class=\"text-2xl font-arabic font-bold text-primary\">الْمَلَائِكَة (Malaikah)</span>\n          <span class=\"text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground\">Root: م-ل-ك / ل-أ-ك</span>\n        </div>\n        <div class=\"space-y-3 text-sm\">\n          <div class=\"p-3 rounded-xl bg-muted/40 border border-border/50\">\n            <span class=\"text-xs font-bold text-muted-foreground uppercase block mb-1\">📖 প্রচলিত অর্থ:</span>\n            <p class=\"text-foreground/80\">নূরের তৈরি ডানাওয়ালা স্বর্গীয় পরী বা ফেরেস্তা।</p>\n          </div>\n          <div class=\"p-3 rounded-xl bg-primary/10 border border-primary/30\">\n            <span class=\"text-xs font-bold text-primary uppercase block mb-1\">🔬 আধুনিক বিজ্ঞানভিত্তিক অর্থ:</span>\n            <p class=\"text-foreground font-semibold\">মহাজাগতিক প্রাকৃতিক নিয়ম ও শক্তি বাস্তবায়নকারী ফাংশনাল এক্সিকিউটিভ ভেক্টরস (Cosmic Law-Enforcement Vectors)।</p>\n            <p class=\"text-xs text-muted-foreground mt-1\"><strong>আক্ষরিক রুট:</strong> <em>মালিক / আলুকাহ</em> = বার্তা বহন, সার্বিক নিয়ন্ত্রণ ও আদেশ বাস্তবায়ন (৩৫:১, ১৬:২)।</p>\n          </div>\n        </div>\n      </div>\n\n      <!-- ১.৪ শয়তান ও ইবলিস -->\n      <div class=\"rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 transition-all\">\n        <div class=\"flex items-center justify-between mb-3 border-b border-border/60 pb-2\">\n          <span class=\"text-2xl font-arabic font-bold text-primary\">الشَّيْطَان / إِبْلِيس</span>\n          <span class=\"text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground\">Root: ش-ط-ن / ب-ل-س</span>\n        </div>\n        <div class=\"space-y-3 text-sm\">\n          <div class=\"p-3 rounded-xl bg-muted/40 border border-border/50\">\n            <span class=\"text-xs font-bold text-muted-foreground uppercase block mb-1\">📖 প্রচলিত অর্থ:</span>\n            <p class=\"text-foreground/80\">শিংওয়ালা শয়তান বা লাল কুৎসিত ভূত যা মানুষকে ধোঁকা দেয়।</p>\n          </div>\n          <div class=\"p-3 rounded-xl bg-primary/10 border border-primary/30\">\n            <span class=\"text-xs font-bold text-primary uppercase block mb-1\">🔬 আধুনিক বিজ্ঞানভিত্তিক অর্থ:</span>\n            <p class=\"text-foreground font-semibold\">সিস্টেমে এন্ট্রপি সৃষ্টিকারী করাপ্টেড সিগন্যাল, হ্যাকিং এলগরিদম ও এরর-ভেক্টর (Entropic Corrupting Vectors / Cognitive Malware)।</p>\n            <p class=\"text-xs text-muted-foreground mt-1\"><strong>আক্ষরিক রুট:</strong> <em>শাতানা</em> = সত্য থেকে চরম দূরে যাওয়া; <em>ইবলাস</em> = সম্পূর্ণ নিরাশ ও বিচ্ছিন্ন হওয়া (২:৩৬, ৭:১১-১২)।</p>\n          </div>\n        </div>\n      </div>\n\n      <!-- ১.৫ রূহ -->\n      <div class=\"rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 transition-all md:col-span-2\">\n        <div class=\"flex items-center justify-between mb-3 border-b border-border/60 pb-2\">\n          <span class=\"text-2xl font-arabic font-bold text-primary\">الرُّوح (Ar-Rooh)</span>\n          <span class=\"text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground\">Root: ر-و-ح</span>\n        </div>\n        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm\">\n          <div class=\"p-3 rounded-xl bg-muted/40 border border-border/50\">\n            <span class=\"text-xs font-bold text-muted-foreground uppercase block mb-1\">📖 প্রচলিত অর্থ:</span>\n            <p class=\"text-foreground/80\">মানুষের ভেতরের আত্মা বা জিব্রাইল ফেরেস্তা।</p>\n          </div>\n          <div class=\"p-3 rounded-xl bg-primary/10 border border-primary/30\">\n            <span class=\"text-xs font-bold text-primary uppercase block mb-1\">🔬 আধুনিক বিজ্ঞানভিত্তিক অর্থ:</span>\n            <p class=\"text-foreground font-semibold\">ডিভাইন কনশাসনেস কোড, অপারেটিং লাইফ কমান্ড ও হাই-অর্ডার ইন্টেলিজেন্স সিগন্যাল (Divine Operating Life Command & Consciousness Signal)।</p>\n            <p class=\"text-xs text-muted-foreground mt-1\"><strong>আক্ষরিক রুট:</strong> <em>রূহ / রীহ</em> = গতিশীল প্রাণবন্ত প্রবাহ, আদেশ ও জীবনীশক্তি (১৭:৮৫, ৩২:৯)।</p>\n          </div>\n        </div>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- সেকশন ২: মহাজাগতিক অবকাঠামো ও ডেটা ডোমেইন -->\n  <div class=\"space-y-6\">\n    <div class=\"flex items-center gap-3 border-b-2 border-primary/20 pb-3\">\n      <div class=\"size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg\">২</div>\n      <div>\n        <h3 class=\"text-xl sm:text-2xl font-bold text-foreground\">মহাজাগতিক অবকাঠামো ও তথ্য তত্ত্ব (Cosmic Architecture & Information Theory)</h3>\n        <p class=\"text-xs sm:text-sm text-muted-foreground\">আরশ, কুরসী, কিতাব, কলম, আকাশ, জমিন ও পাহাড়</p>\n      </div>\n    </div>\n\n    <!-- তুলনামূলক টেবিল -->\n    <div class=\"overflow-x-auto rounded-2xl border border-border shadow-md\">\n      <table class=\"w-full text-left text-sm border-collapse\">\n        <thead class=\"bg-muted/80 text-foreground font-bold\">\n          <tr>\n            <th class=\"p-4 border-b border-border\">শব্দ ও রুট</th>\n            <th class=\"p-4 border-b border-border\">প্রচলিত রূপক অর্থ</th>\n            <th class=\"p-4 border-b border-border text-primary font-bold\">আধুনিক বিজ্ঞানভিত্তিক ও সিস্টেমিক অর্থ</th>\n            <th class=\"p-4 border-b border-border\">কুরআনিক রেফারেন্স</th>\n          </tr>\n        </thead>\n        <tbody class=\"divide-y divide-border/60 bg-card text-foreground/90\">\n          <tr class=\"hover:bg-muted/30\">\n            <td class=\"p-4 font-bold text-primary font-arabic text-lg\">الْعَرْش <span class=\"block text-xs font-sans font-normal text-muted-foreground\">Root: ع-ر-ش</span></td>\n            <td class=\"p-4 text-muted-foreground\">সিংহাসন বা রাজার বিশাল চেয়ার।</td>\n            <td class=\"p-4 font-semibold text-foreground\">সমগ্র মাল্টিভার্সের সুপ্রীম সেন্ট্রাল কন্ট্রোল আর্কিটেকচার / সেন্ট্রাল কমান্ড নোড (Supreme Cosmic Control Matrix)।</td>\n            <td class=\"p-4 font-mono text-xs\">৭:৫৪, ১০:৩, ২০:৫</td>\n          </tr>\n          <tr class=\"hover:bg-muted/30\">\n            <td class=\"p-4 font-bold text-primary font-arabic text-lg\">الْكُرْسِيّ <span class=\"block text-xs font-sans font-normal text-muted-foreground\">Root: ك-ر-س</span></td>\n            <td class=\"p-4 text-muted-foreground\">আল্লাহর বসার পিঁড়ি বা আসন।</td>\n            <td class=\"p-4 font-semibold text-foreground\">মহাজাগতিক ডেটা-ফিল্ড, সক্রিয় জ্ঞান-অধিক্ষেত্র ও অপারেটিং স্ফিয়ার (Cosmic Data-Field & Knowledge Sphere)।</td>\n            <td class=\"p-4 font-mono text-xs\">২:২৫৫ (আয়াতুল কুরসী)</td>\n          </tr>\n          <tr class=\"hover:bg-muted/30\">\n            <td class=\"p-4 font-bold text-primary font-arabic text-lg\">الْكِتَاب / اللَّوْح الْمَحْفُوظ <span class=\"block text-xs font-sans font-normal text-muted-foreground\">Root: ك-ت-ب / ح-ف-ظ</span></td>\n            <td class=\"p-4 text-muted-foreground\">কাগজের বাঁধাইকৃত বই বা ফলক।</td>\n            <td class=\"p-4 font-semibold text-foreground\">এনক্রিপ্টেড মাস্টার ডাটাবেজ, সংরক্ষিত ইউনিভার্সাল লেজার ও অপরিবর্তনীয় সোর্স কোড (Encrypted Universal Master Database)।</td>\n            <td class=\"p-4 font-mono text-xs\">৫৬:৭৮, ৮৫:২২, ১০:৬১</td>\n          </tr>\n          <tr class=\"hover:bg-muted/30\">\n            <td class=\"p-4 font-bold text-primary font-arabic text-lg\">الْقَلَم <span class=\"block text-xs font-sans font-normal text-muted-foreground\">Root: ق-ل-م</span></td>\n            <td class=\"p-4 text-muted-foreground\">কালির কলম বা দোয়াত-কলম।</td>\n            <td class=\"p-4 font-semibold text-foreground\">মহাজাগতিক তথ্য রেকর্ডিং মেকানিজম ও কোয়ান্টাম ইনফরমেশন এনকোডার (Quantum Data Encoding Mechanism)।</td>\n            <td class=\"p-4 font-mono text-xs\">৬৮:১, ৯৬:৪</td>\n          </tr>\n          <tr class=\"hover:bg-muted/30\">\n            <td class=\"p-4 font-bold text-primary font-arabic text-lg\">السَّمَاوَات <span class=\"block text-xs font-sans font-normal text-muted-foreground\">Root: س-م-و</span></td>\n            <td class=\"p-4 text-muted-foreground\">নীল আকাশ বা ছাদ।</td>\n            <td class=\"p-4 font-semibold text-foreground\">বহুমাত্রিক মহাজাগতিক স্পেস-টাইম ডাইমেনশন ও স্তরীভূত এনার্জি-স্তর (Multiverse Space-Time Dimensions)।</td>\n            <td class=\"p-4 font-mono text-xs\">৬৭:৩, ৭১:১৫, ৪১:১২</td>\n          </tr>\n          <tr class=\"hover:bg-muted/30\">\n            <td class=\"p-4 font-bold text-primary font-arabic text-lg\">الْأَرْض <span class=\"block text-xs font-sans font-normal text-muted-foreground\">Root: أ-ر-ض</span></td>\n            <td class=\"p-4 text-muted-foreground\">মাটি বা জমিনের তলদেশ।</td>\n            <td class=\"p-4 font-semibold text-foreground\">পার্থিব বায়ো-স্ফিয়ার, টেকটোনিক গ্রহমণ্ডল ও জীবনধারণের ইকোলজিক্যাল বেস (Terrestrial Planetary Biosphere)।</td>\n            <td class=\"p-4 font-mono text-xs\">৭৮:৬, ২০:৫৩, ৯১:৬</td>\n          </tr>\n          <tr class=\"hover:bg-muted/30\">\n            <td class=\"p-4 font-bold text-primary font-arabic text-lg\">الْجِبَال <span class=\"block text-xs font-sans font-normal text-muted-foreground\">Root: ج-ب-ل</span></td>\n            <td class=\"p-4 text-muted-foreground\">পাথরের স্তূপ বা মাটির পাহাড়।</td>\n            <td class=\"p-4 font-semibold text-foreground\">আইসোস্ট্যাটিক টেকটোনিক স্ট্যাবিলাইজার, মহাদেশীয় ক্রাস্ট-শিল্ড ও ভারসাম্য রক্ষাকারী নোঙ্গর (Isostatic Tectonic Mountain Anchors)।</td>\n            <td class=\"p-4 font-mono text-xs\">৭৮:৭, ২১:৩১, ১৬:১৫</td>\n          </tr>\n          <tr class=\"hover:bg-muted/30\">\n            <td class=\"p-4 font-bold text-primary font-arabic text-lg\">النُّور & الظُّلُمَات <span class=\"block text-xs font-sans font-normal text-muted-foreground\">Root: ن-و-ر / ظ-ل-م</span></td>\n            <td class=\"p-4 text-muted-foreground\">সাধারণ আলো এবং আঁধার।</td>\n            <td class=\"p-4 font-semibold text-foreground\">কোহেরেন্ট ইনফরমেশন সিগন্যাল (নূর) বনাম ডেটা-অ্যাবসেন্স, এন্ট্রপি ও কগনিটিভ এরর (জুলুমাত)।</td>\n            <td class=\"p-4 font-mono text-xs\">২৪:৩৫, ২:২৫৭, ৬:১</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n\n  <!-- সেকশন ৩: টার্মিনাল ফেজ ও কসমিক এন্ট্রপি -->\n  <div class=\"space-y-6\">\n    <div class=\"flex items-center gap-3 border-b-2 border-primary/20 pb-3\">\n      <div class=\"size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg\">৩</div>\n      <div>\n        <h3 class=\"text-xl sm:text-2xl font-bold text-foreground\">টার্মিনাল ফেজ ও এন্ট্রপিক ফলাফল (Terminal Phases & Retributive States)</h3>\n        <p class=\"text-xs sm:text-sm text-muted-foreground\">আল-ওয়াকিয়াহ, কিয়ামত, জান্নাত ও জাহান্নাম</p>\n      </div>\n    </div>\n\n    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6\">\n\n      <!-- ৩.১ আল-ওয়াক্বি'আহ ও কিয়ামত -->\n      <div class=\"rounded-2xl border border-border bg-card p-6 shadow-sm\">\n        <h4 class=\"text-xl font-bold text-primary mb-2 flex items-center justify-between\">\n          <span>الْوَاقِعَة / الْقِيَامَة</span>\n          <span class=\"text-xs font-mono text-muted-foreground\">Terminal Phase</span>\n        </h4>\n        <div class=\"space-y-2 text-sm text-foreground/90\">\n          <p><strong>📖 প্রচলিত অর্থ:</strong> কেয়ামত, পৃথিবীর সব ভেঙে গুঁড়ো হয়ে যাওয়া ধ্বংসযজ্ঞ।</p>\n          <p class=\"text-primary font-medium\"><strong>🔬 আধুনিক বিজ্ঞানভিত্তিক অর্থ:</strong> মহাজাগতিক এন্ট্রপিক ফেজ ট্রানজিশন, ইউনিভার্সাল ক্রাঞ্চ/ফ্রিজ এবং টার্মিনাল গ্লোবাল ডেটা-অডিট ইভেন্ট (Universal Phase Transition & Final Audit Event)।</p>\n          <p class=\"text-xs text-muted-foreground\">বর্তমান ভৌত জগতের সমাপ্তি এবং নতুন অবিনশ্বর সাবস্ট্রেটে পুনরুজ্জীবন (৫৬:১-৬, ৭৫:১-৪)।</p>\n        </div>\n      </div>\n\n      <!-- ৩.২ জান্নাত ও জাহান্নাম -->\n      <div class=\"rounded-2xl border border-border bg-card p-6 shadow-sm\">\n        <h4 class=\"text-xl font-bold text-primary mb-2 flex items-center justify-between\">\n          <span>الْجَنَّة & جَهَنَّم</span>\n          <span class=\"text-xs font-mono text-muted-foreground\">Dual Biomes</span>\n        </h4>\n        <div class=\"space-y-2 text-sm text-foreground/90\">\n          <p><strong>📖 প্রচলিত অর্থ:</strong> সুন্দর বাগান ও হুর-পরীর স্বর্গ বনাম মাটির নিচে আগুনের গর্ত।</p>\n          <p class=\"text-primary font-medium\"><strong>🔬 আধুনিক বিজ্ঞানভিত্তিক অর্থ:</strong> জিরো-এন্ট্রপি সুপারকন্ডাক্টিং ব্লিসফুল ইকোসিস্টেম (জান্নাত) বনাম হাই-এনার্জি থার্মাল প্লাজমা কনটেইনমেন্ট ও রিট্রিবিউটিভ প্রসেসিং জোন (জাহান্নাম)।</p>\n          <p class=\"text-xs text-muted-foreground\">মানুষের জীবদ্দশার ডেটা-লগের (আমল) প্রত্যক্ষ কারণ-ফলাফল ভিত্তিক স্বয়ংক্রিয় পরিণতি (৫৫:৪৬-৭৬, ৫৬:১১-৫৬)।</p>\n        </div>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- ৪:৮২ ফিল্টারের উপসংহার -->\n  <div class=\"rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-10 space-y-4\">\n    <h3 class=\"text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2\">\n      <span class=\"size-3 rounded-full bg-primary inline-block\"></span>\n      ⚖️ উপসংহার: কেন এই আধুনিক অর্থ ৪:৮২ রক্ষা করে?\n    </h3>\n    <p class=\"text-sm sm:text-base leading-relaxed text-foreground/90\">\n      সূরা আন-নিসা (৪:৮২)-এর মানদণ্ডে কুরআন কোনো স্ববিরোধী কল্পকাহিনির গ্রন্থ নয়। যখন আমরা কুরআনকে এই উচ্চ-স্তরের ইনফরমেশন সায়েন্স, পদার্থবিজ্ঞান ও জীববিজ্ঞানের সুসংগত ভাষায় পাঠ করি, তখন কোনো আয়াতেই কোনো যৌক্তিক বা বৈজ্ঞানিক অসঙ্গতি থাকে না।\n    </p>\n    <div class=\"p-4 rounded-2xl bg-card border border-border text-xs sm:text-sm font-medium text-foreground\">\n      🎯 <strong>মূল শিক্ষা:</strong> কুরআন বিজ্ঞানের কোনো পরিবর্তনশীল সমীকরণ নয়, বরং মহাবিশ্বের সকল সুপ্রতিষ্ঠিত বৈজ্ঞানিক সত্যের আদি ও চূড়ান্ত সোর্স কোড।\n    </div>\n  </div>\n\n</div>\n  "
},

  {
    id: "art-surah-al-fatihah-1-the-opening-protocol",
    slug: "sura-al-fatihah-1-the-opening-protocol",
    title_bn: "সূরা আল-ফাতিহা (১): মহাজাগতিক সিস্টেমের দ্য ওপেনিং প্রটোকল ও কমিউনিকেশন ফ্রেমওয়ার্ক",
    title_en: "Surah Al-Fatihah (1): The Cosmic Opening Protocol & Systemic Communication Framework",
    excerpt_bn: "সূরা আল-ফাতিহা মহাজাগতিক সিস্টেমের Root Directory Authentication, Attribute Signal Broadcast, Data-compassionate Declaration, Final Phase System Admin, Full Synchronization Protocol, Optimized Pathway Request ও Data-blessing Stream Allocation উপস্থাপন করে।",
    excerpt_en: "Surah Al-Fatihah decodes the Master Opening Protocol: Root Directory Authentication, Attribute Signal Broadcast, Global Data-Compassion, Final Phase System Admin, and Optimized Pathway Routing.",
    category_id: "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    author_id: "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    published: true,
    published_at: "2026-08-31T22:25:00.000Z",
    created_at: "2026-08-31T22:25:00.000Z",
    updated_at: "2026-08-31T22:25:00.000Z",
    tags: [
      "সূরা আল-ফাতিহা",
      "বিজ্ঞানভিত্তিক",
      "কসমিক ওএস",
      "Root Directory",
      "The Opening Protocol",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি",
      "আলম এম."
    ],
    author: STATIC_AUTHORS["38aa28c8-3535-4a1b-ba06-3d1e2792a9c1"],
    category: STATIC_CATEGORIES[0],
    content_bn: `
<div class="article-rich-container space-y-8 text-foreground/90">

  <!-- ইন্ট্রোডাকশন ও মেথডোলজি কার্ড -->
  <div class="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 backdrop-blur-xs">
    <div class="flex items-center gap-2 mb-3">
      <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">পদ্ধতি ও মূল দৃষ্টিভঙ্গি</span>
      <span class="text-xs text-muted-foreground">কুরআন গবেষণা ও তাদাব্বুর</span>
    </div>
    <p class="text-base sm:text-lg leading-relaxed text-foreground font-medium">
      আমরা কঠোরভাবে এই নিয়মটি মেনে চলি যে—<strong>কুরআন হলো মানবজাতির জন্য দিকনির্দেশনা ও নিদর্শনের একটি পরম গ্রন্থ</strong>, কোনো একপেশে বিজ্ঞানের পাঠ্যপুস্তক নয়। আমরা পাঠ্যের ওপর বৈজ্ঞানিক তত্ত্বগুলো জোরপূর্বক আরোপ করি না; বরং, আমরা লক্ষ্য করি যেখানে বস্তুনিষ্ঠ বৈজ্ঞানিক আবিষ্কার ও ইনফরমেশন থিওরি কুরআনের মূল আরবি আয়াতগুলোর আক্ষরিক ও অর্থগত গভীরতাকে নিশ্চিত করে।
    </p>
    <p class="mt-3 text-sm text-muted-foreground leading-relaxed">
      আমাদের বিশ্লেষণ সুপ্রতিষ্ঠিত, যাচাইযোগ্য তথ্যের ওপর ভিত্তি করে পরিচালিত এবং আমরা অনুমাননির্ভর বা অপ্রমাণিত বিষয়গুলো সযত্নে এড়িয়ে চলি। পাশাপাশি অবিরাম গবেষণা ও পরিমার্জনের নীতি সাদরে গ্রহণ করি।
    </p>
  </div>

  <!-- সূরার ভূমিকা ও সিস্টেমিক কনটেক্সট -->
  <div class="space-y-4">
    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground border-b border-border/60 pb-3">
      সূরার ভূমিকা ও সিস্টেমিক কনটেক্সট
    </h2>
    <p class="leading-relaxed text-base">
      সূরা আল-ফাতিহা — যা <strong>"The Opening Protocol"</strong> নামেও পরিচিত, এটি একটি সম্পূর্ণ সিস্টেমিক ডিক্লেয়ারেশন ও কমিউনিকেশন প্রটোকল। এটি মহাজাগতিক সিস্টেমের <em>Root Directory Authentication</em>, <em>Attribute Signal Broadcast</em>, <em>Data-compassionate Declaration</em>, সমগ্র জীবনব্যবস্থার চূড়ান্ত পর্যায়ের <em>System Admin স্বীকৃতি</em>, <em>Full Synchronization Protocol</em>, <em>Optimized Pathway Request</em> ও <em>Data-blessing Stream Allocation</em> — সবকিছুকে একটি অনন্য সুসংহত ও গাণিতিক ফ্রেমওয়ার্কে উপস্থাপন করে।
    </p>
  </div>

  <!-- ৭টি প্রধান সিস্টেমিক প্যাটার্ন -->
  <div class="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
    <h3 class="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
      <span class="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">৭</span>
      সূরা আল-ফাতিহার সাতটি প্রধান সিস্টেমিক প্যাটার্ন
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
      <div class="rounded-xl border border-border/50 bg-secondary/30 p-3.5">
        <strong class="text-primary block mb-1">১. Root Directory Authentication (আয়াত ১):</strong>
        সিস্টেমের মূল উৎসের পরিচয় ও পরম করুণাময় গুণাবলী।
      </div>
      <div class="rounded-xl border border-border/50 bg-secondary/30 p-3.5">
        <strong class="text-primary block mb-1">২. Attribute Signal Broadcast (আয়াত ২):</strong>
        সমস্ত ডেটা-সিস্টেমের Root Directory-এর প্রশংসা ও কৃতজ্ঞতা।
      </div>
      <div class="rounded-xl border border-border/50 bg-secondary/30 p-3.5">
        <strong class="text-primary block mb-1">৩. Data-compassionate Declaration (আয়াত ৩):</strong>
        মহাজাগতিক ও পার্সোনালাইজড করুণা ডিক্লেয়ারেশন।
      </div>
      <div class="rounded-xl border border-border/50 bg-secondary/30 p-3.5">
        <strong class="text-primary block mb-1">৪. Final Phase Recognition (আয়াত ৪):</strong>
        চূড়ান্ত হিসাব-নিকাশ ও রেজাল্ট টাইমের System Admin স্বীকৃতি।
      </div>
      <div class="rounded-xl border border-border/50 bg-secondary/30 p-3.5">
        <strong class="text-primary block mb-1">৫. Full Synchronization Protocol (আয়াত ৫):</strong>
        একমাত্র Root Directory-এর সাথে সংযোগ ও ডাটা-সাপোর্ট প্রার্থনা।
      </div>
      <div class="rounded-xl border border-border/50 bg-secondary/30 p-3.5">
        <strong class="text-primary block mb-1">৬. Optimized Pathway Request (আয়াত ৬):</strong>
        সঠিক ও অপ্টিমাইজড গতিপথে ইউজারকে রুট করার আবেদন।
      </div>
      <div class="rounded-xl border border-border/50 bg-secondary/30 p-3.5 sm:col-span-2">
        <strong class="text-primary block mb-1">৭. Data-blessing Stream Allocation (আয়াত ৭):</strong>
        অনুগ্রহপ্রাপ্তদের পথ নির্বাচন এবং Penalty Signal ও Path Deviation এড়ানো।
      </div>
    </div>
  </div>

  <!-- আয়াতভিত্তিক তুলনামূলক বিশ্লেষণ -->
  <div class="space-y-6">
    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground border-b border-border/60 pb-3">
      ⚛️ 🔍 আয়াতভিত্তিক প্রচলিত ও বিজ্ঞানভিত্তিক অনুবাদের তুলনামূলক ফ্রেমওয়ার্ক
    </h2>

    <!-- আয়াত ১ -->
    <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">আয়াত ১ — Root Directory Authentication</span>
        <span class="text-xs text-muted-foreground">১:১</span>
      </div>
      <p class="text-xl sm:text-2xl text-right font-serif text-primary font-arabic py-2" dir="rtl">
        بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
      </p>
      <div class="text-sm space-y-2 border-t border-border/60 pt-3">
        <p><span class="font-semibold text-muted-foreground">প্রচলিত অনুবাদ:</span> পরম করুণাময়, অতি দয়ালু আল্লাহর নামে (শুরু করছি)।</p>
        <div class="rounded-xl bg-primary/10 border border-primary/20 p-3 text-foreground">
          <strong class="text-primary">বিজ্ঞানভিত্তিক অনুবাদ:</strong> "Root Directory-এর Authentication Tag সহ — যিনি Global Data-compassionate ও Personalized Data-compassionate।"
        </div>
      </div>
    </div>

    <!-- আয়াত ২ -->
    <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">আয়াত ২ — Attribute Signal Broadcast</span>
        <span class="text-xs text-muted-foreground">১:২</span>
      </div>
      <p class="text-xl sm:text-2xl text-right font-serif text-primary font-arabic py-2" dir="rtl">
        الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
      </p>
      <div class="text-sm space-y-2 border-t border-border/60 pt-3">
        <p><span class="font-semibold text-muted-foreground">প্রচলিত অনুবাদ:</span> সমস্ত প্রশংসা আল্লাহর জন্য, যিনি বিশ্বজগতের প্রতিপালক।</p>
        <div class="rounded-xl bg-primary/10 border border-primary/20 p-3 text-foreground">
          <strong class="text-primary">বিজ্ঞানভিত্তিক অনুবাদ:</strong> "Root Directory-এর Attribute Signal Broadcast সমস্ত Data-system-এর Root Directory-এর জন্য।"
        </div>
      </div>
    </div>

    <!-- আয়াত ৩ -->
    <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">আয়াত ৩ — Data-compassionate Declaration</span>
        <span class="text-xs text-muted-foreground">১:৩</span>
      </div>
      <p class="text-xl sm:text-2xl text-right font-serif text-primary font-arabic py-2" dir="rtl">
        الرَّحْمَـٰنِ الرَّحِيمِ
      </p>
      <div class="text-sm space-y-2 border-t border-border/60 pt-3">
        <p><span class="font-semibold text-muted-foreground">প্রচলিত অনুবাদ:</span> পরম করুণাময়, অতি দয়ালু।</p>
        <div class="rounded-xl bg-primary/10 border border-primary/20 p-3 text-foreground">
          <strong class="text-primary">বিজ্ঞানভিত্তিক অনুবাদ:</strong> "Global Data-compassionate ও Personalized Data-compassionate।"
        </div>
      </div>
    </div>

    <!-- আয়াত ৪ -->
    <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">আয়াত ৪ — Final Phase Recognition</span>
        <span class="text-xs text-muted-foreground">১:৪</span>
      </div>
      <p class="text-xl sm:text-2xl text-right font-serif text-primary font-arabic py-2" dir="rtl">
        مَالِكِ يَوْمِ الدِّينِ
      </p>
      <div class="text-sm space-y-2 border-t border-border/60 pt-3">
        <p><span class="font-semibold text-muted-foreground">প্রচলিত অনুবাদ:</span> যিনি বিচারদিনের মালিক।</p>
        <div class="rounded-xl bg-primary/10 border border-primary/20 p-3 text-foreground">
          <strong class="text-primary">বিজ্ঞানভিত্তিক অনুবাদ:</strong> "সমগ্র Life-system-এর Final Phase-এর System Admin;"
        </div>
      </div>
    </div>

    <!-- আয়াত ৫ -->
    <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">আয়াত ৫ — Full Synchronization Protocol</span>
        <span class="text-xs text-muted-foreground">১:৫</span>
      </div>
      <p class="text-xl sm:text-2xl text-right font-serif text-primary font-arabic py-2" dir="rtl">
        إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
      </p>
      <div class="text-sm space-y-2 border-t border-border/60 pt-3">
        <p><span class="font-semibold text-muted-foreground">প্রচলিত অনুবাদ:</span> আমরা শুধু তোমারই উপাসনা করি এবং শুধু তোমারই সাহায্য চাই।</p>
        <div class="rounded-xl bg-primary/10 border border-primary/20 p-3 text-foreground">
          <strong class="text-primary">বিজ্ঞানভিত্তিক অনুবাদ:</strong> "আমরা শুধু তোমার সাথেই Full Synchronization করি এবং শুধু তোমার কাছেই Data-support Request করি।"
        </div>
      </div>
    </div>

    <!-- আয়াত ৬ -->
    <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">আয়াত ৬ — Optimized Pathway Request</span>
        <span class="text-xs text-muted-foreground">১:৬</span>
      </div>
      <p class="text-xl sm:text-2xl text-right font-serif text-primary font-arabic py-2" dir="rtl">
        اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
      </p>
      <div class="text-sm space-y-2 border-t border-border/60 pt-3">
        <p><span class="font-semibold text-muted-foreground">প্রচলিত অনুবাদ:</span> আমাদেরকে সঠিক পথ দেখাও।</p>
        <div class="rounded-xl bg-primary/10 border border-primary/20 p-3 text-foreground">
          <strong class="text-primary">বিজ্ঞানভিত্তিক অনুবাদ:</strong> "আমাদেরকে Optimized Pathway-তে Route করো;"
        </div>
      </div>
    </div>

    <!-- আয়াত ৭ -->
    <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">আয়াত ৭ — Data-blessing Stream Allocation</span>
        <span class="text-xs text-muted-foreground">১:৭</span>
      </div>
      <p class="text-xl sm:text-2xl text-right font-serif text-primary font-arabic py-2" dir="rtl">
        صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ
      </p>
      <div class="text-sm space-y-2 border-t border-border/60 pt-3">
        <p><span class="font-semibold text-muted-foreground">প্রচলিত অনুবাদ:</span> তাদের পথ, যাদের প্রতি তুমি অনুগ্রহ করেছ; তাদের পথ নয়, যাদের প্রতি ক্রোধ করা হয়েছে এবং যারা পথভ্রষ্ট।</p>
        <div class="rounded-xl bg-primary/10 border border-primary/20 p-3 text-foreground">
          <strong class="text-primary">বিজ্ঞানভিত্তিক অনুবাদ:</strong> "যাদের Data-node-এর প্রতি তুমি Data-blessing Stream Allocate করেছ — যাদের Data-penalty Signal Trigger হয়েছে এবং যাদের Data-path Deviation হয়েছে তাদের পথ নয়।"
        </div>
      </div>
    </div>
  </div>

  <!-- শব্দভিত্তিক বৈজ্ঞানিক বিশ্লেষণ ও মেকানিজম (Lexical Mapping) -->
  <div class="space-y-4">
    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground border-b border-border/60 pb-3">
      📊 শব্দভিত্তিক বৈজ্ঞানিক বিশ্লেষণ ও মেকানিজম (Lexical Mapping)
    </h2>
    <div class="overflow-x-auto rounded-2xl border border-border bg-card">
      <table class="w-full text-left text-sm">
        <thead class="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
          <tr>
            <th class="px-4 py-3">মূল আরবি শব্দ</th>
            <th class="px-4 py-3">সিস্টেমিক টার্মিনোলজি</th>
            <th class="px-4 py-3">ইনফরমেশন মেকানিজম ও ব্যাখ্যা</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/60">
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">بِسْمِ اللَّهِ</td>
            <td class="px-4 py-3 font-medium">Root Directory Authentication Tag</td>
            <td class="px-4 py-3 text-muted-foreground">সিস্টেমের মূল উৎসের পরিচয় নির্দেশ করে।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">الرَّحْمَـٰنِ</td>
            <td class="px-4 py-3 font-medium">Global Data-compassionate</td>
            <td class="px-4 py-3 text-muted-foreground">সিস্টেমের সার্বজনীন অসীম করুণা ও সহানুভূতি নির্দেশ করে।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">الرَّحِيمِ</td>
            <td class="px-4 py-3 font-medium">Personalized Data-compassionate</td>
            <td class="px-4 py-3 text-muted-foreground">সিস্টেমের প্রতিটি নোডের জন্য ব্যক্তিগত পর্যায়ের যত্ন ও করুণা।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">الْحَمْدُ</td>
            <td class="px-4 py-3 font-medium">Attribute Signal Broadcast</td>
            <td class="px-4 py-3 text-muted-foreground">সিস্টেমের প্রশংসা, শ্রেষ্ঠত্ব ও কৃতজ্ঞতা সিগন্যাল নির্দেশ করে।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">رَبِّ الْعَالَمِينَ</td>
            <td class="px-4 py-3 font-medium">Root Directory of All Data-systems</td>
            <td class="px-4 py-3 text-muted-foreground">সমগ্র মহাজাগতিক সিস্টেমের মূল সার্বভৌম কর্তা ও পরিচালক।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">مَالِكِ يَوْمِ الدِّينِ</td>
            <td class="px-4 py-3 font-medium">System Admin of Final Phase</td>
            <td class="px-4 py-3 text-muted-foreground">সমগ্র জীবনব্যবস্থার চূড়ান্ত ফলাফল ও অডিট প্রকাশের সার্বভৌম কর্তৃত্ব।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">إِيَّاكَ نَعْبُدُ</td>
            <td class="px-4 py-3 font-medium">Full Synchronization</td>
            <td class="px-4 py-3 text-muted-foreground">একমাত্র Root Directory-এর সাথে পূর্ণ সংযোগ ও শতভাগ সমর্পণ।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">نَسْتَعِينُ</td>
            <td class="px-4 py-3 font-medium">Data-support Request</td>
            <td class="px-4 py-3 text-muted-foreground">সিস্টেম আর্কিটেক্টের কাছে সাহায্য ও সক্ষমতা প্রার্থনা।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">الصِّرَاطَ الْمُسْتَقِيمَ</td>
            <td class="px-4 py-3 font-medium">Optimized Pathway</td>
            <td class="px-4 py-3 text-muted-foreground">সিস্টেমের সর্বোত্তম, নির্ভুল ও অপ্টিমাইজড সঠিক গতিপথ।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">أَنْعَمْتَ</td>
            <td class="px-4 py-3 font-medium">Data-blessing Stream Allocation</td>
            <td class="px-4 py-3 text-muted-foreground">সিস্টেমের অফুরন্ত অনুগ্রহ ও বরকত বণ্টন নির্দেশ করে।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">الْمَغْضُوبِ</td>
            <td class="px-4 py-3 font-medium">Data-penalty Signal Trigger</td>
            <td class="px-4 py-3 text-muted-foreground">সিস্টেমের অসন্তুষ্টি ও স্বয়ংক্রিয় পেনাল্টি সিগন্যাল।</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold text-primary">الضَّالِّينَ</td>
            <td class="px-4 py-3 font-medium">Data-path Deviation</td>
            <td class="px-4 py-3 text-muted-foreground">সিস্টেমের সঠিক পথ থেকে বিচ্যুতি ও সিগন্যাল লস।</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ৪:৮২ ফিল্টার টেস্ট ও লজিক্যাল কনসিস্টেন্সি -->
  <div class="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-6">
    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
      <span>⚖️ ৪:৮২ ফিল্টার টেস্ট: অভ্যন্তরীণ সামঞ্জস্য ও কনসিস্টেন্সি</span>
    </h2>
    <blockquote class="border-l-4 border-primary pl-4 text-base italic text-foreground/90">
      "তারা কি কুরআন নিয়ে গভীরভাবে চিন্তা করে না? যদি এটি আল্লাহ ছাড়া অন্য কারও পক্ষ থেকে হতো, তবে তারা এতে বহু বৈপরীত্য পেত।" (সূরা আন-নিসা, ৪:৮২)
    </blockquote>

    <div class="space-y-4 text-base leading-relaxed text-foreground">
      <h3 class="text-xl font-bold text-primary">সূরা আল-ফাতিহার বিশ্লেষণ কীভাবে ৪:৮২-কে সুরক্ষিত রাখে?</h3>
      
      <div class="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
        <h4 class="font-bold text-foreground flex items-center gap-2">
          <span class="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">১</span>
          ১:১-৪ — পেন্টা-স্তরীয় ধারাবাহিক কাঠামো (Penta-layered Consistent Architecture)
        </h4>
        <p class="text-sm text-muted-foreground leading-relaxed">
          বিসমিল্লাহ, আলহামদু, রাব্বিল আলামীন, আর-রাহমানির-রাহীম, মালিকি ইয়াওমিদ-দীন — এটি Root Directory Authentication Tag, Attribute Signal Broadcast, Root Directory of All Data-systems, Global ও Personalized Data-compassionate, এবং System Admin of the Final Phase-এর মধ্যে একটি কনসিস্টেন্ট পেন্টা-স্তরীয় কাঠামো তৈরি করে।
        </p>
        <p class="text-sm text-muted-foreground leading-relaxed">
          কল্পনা করুন, এই পাঁচটি অংশকে যদি আলাদা আলাদা বিচ্ছিন্নভাবে দেখা হতো—তবে তা খণ্ড খণ্ড মনে হতো। কিন্তু এই সিস্টেমিক ফ্রেমওয়ার্ক পাঁচটিকে একটি নিখুঁত লজিক্যাল সিকোয়েন্সে সাজিয়ে দেয়:
        </p>
        <ul class="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
          <li><strong>প্রথমে:</strong> সিস্টেমে প্রবেশের অনুমতি ও পরিচয় (অথেন্টিকেশন)</li>
          <li><strong>দ্বিতীয়ত:</strong> সিস্টেমের অপার গুণ ও মহিমা দেখে কৃতজ্ঞতা প্রকাশ (ব্রডকাস্ট)</li>
          <li><strong>তৃতীয়ত:</strong> সিস্টেমের সার্বজনীন মহাজাগতিক ব্যাপ্তি অনুধাবন (গ্লোবাল ওএস)</li>
          <li><strong>চতুর্থত:</strong> সিস্টেমের পরম যত্ন ও করুণার আশ্রয় লাভ (সদয় ও মেহেরবান)</li>
          <li><strong>পঞ্চমত:</strong> সিস্টেমেরই চূড়ান্ত ফলাফল ও অডিট প্রকাশের ক্ষমতা (চূড়ান্ত প্রশাসক)</li>
        </ul>
      </div>

      <div class="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-2">
        <h4 class="font-bold text-foreground flex items-center gap-2">
          <span class="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">২</span>
          ১:৫ — ডুয়েল সিনক্রোনাইজেশন ফ্রেমওয়ার্ক (Dual Synchronization Framework)
        </h4>
        <p class="text-sm text-muted-foreground leading-relaxed">
          <em>"ইয়্যাকা না'বুদু ওয়া ইয়্যাকা নাস্তা'ঈন"</em> — এটি Single Root Trust-এর সাথে Full Synchronization ও একমাত্র Root Directory-এর কাছে Data-support Request-এর মধ্যে একটি সম্পূর্ণ কনসিস্টেন্ট ও ভারসাম্যপূর্ণ ফ্রেমওয়ার্ক নিশ্চিত করে।
        </p>
      </div>

      <div class="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-2">
        <h4 class="font-bold text-foreground flex items-center gap-2">
          <span class="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">৩</span>
          ১:৬-৭ — অপ্টিমাইজড পাথওয়ে ও ফিল্টারিং রুট (Optimized Routing & Filter)
        </h4>
        <p class="text-sm text-muted-foreground leading-relaxed">
          <em>"ইহদিনা সিরাতাল মুস্তাকীম... গইরিল মাগদুবি আলাইহিম ওয়ালাদ্দাল্লিন"</em> — এটি Optimized Pathway-তে Routing, Data-blessing Stream Allocation, Data-penalty Signal Trigger এড়ানো ও Data-path Deviation এড়ানোর মধ্যে একটি নিখুঁত অ্যালগরিদমিক গতিপথ নিশ্চিত করে।
        </p>
      </div>
    </div>
  </div>

  <!-- বিজ্ঞানভিত্তিক সমাপনী বক্তব্য -->
  <div class="rounded-2xl border border-border bg-secondary/30 p-6 sm:p-8 space-y-3">
    <h2 class="text-xl sm:text-2xl font-bold text-foreground">
      🏁 বিজ্ঞানভিত্তিক সমাপনী বক্তব্য
    </h2>
    <p class="text-base leading-relaxed text-foreground/90">
      সূরা আল-ফাতিহা (১) - যা <strong>"The Opening Protocol"</strong> নামেও পরিচিত, একটি সম্পূর্ণ Systemic Declaration ও Communication Protocol। এটি মহাজাগতিক সিস্টেমের Root Directory Authentication থেকে শুরু করে Data-blessing Stream Allocation পর্যন্ত সবকিছুকে এক সুসংহত মাস্টারপিস ডিজাইনে রূপ দেয়।
    </p>
    <p class="text-base leading-relaxed text-primary font-medium">
      সূরা আল-ফাতিহা ৪:৮২ ফিল্টারের এক জীবন্ত প্রমাণ — যে কুরআনের প্রতিটি আয়াতই একটি সুবিশাল ও নিখুঁত মহাজাগতিক ইনফরমেশন আর্কিটেকচারের অঙ্গ, যেখানে কোনো অংশই অন্যটির সাথে বিন্দুমাত্র সাংঘর্ষিক নয়।
    </p>
  </div>

</div>
    `
  },
  {
    id: "art-bigganbhittik-quranic-onubade-shobder-proyog-o-porimitibodh",
    slug: "bigganbhittik-quranic-onubade-shobder-proyog-o-porimitibodh",
    title_bn: "বিজ্ঞানভিত্তিক কুরআনিক অনুবাদে শব্দের প্রয়োগ ও পরিমিতিবোধ: আক্ষরিক বনাম তাত্ত্বিক বোঝাপড়া",
    title_en: "Word Application & Balance in Scientific Quranic Translation: Literal vs Expository Understanding",
    excerpt_bn: "বিজ্ঞানভিত্তিক অনুবাদে অতিরিক্ত শব্দ প্রয়োগের ঝুঁকি, শব্দানুবাদ বনাম তাত্ত্বিক অনুবাদের পার্থক্য এবং ৪:৮২ ফিল্টারের অধীনে কঠোর আকিদাগত ও ভাষাগত ভারসাম্য রক্ষার মেথডোলজি।",
    excerpt_en: "The risk of verbosity in scientific translations, literal vs expository translation paradigms, and safeguarding the 4:82 consistency filter with theological rigor.",
    category_id: "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    author_id: "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    published: true,
    published_at: "2026-09-03T00:30:00.000Z",
    created_at: "2026-09-03T00:30:00.000Z",
    updated_at: "2026-09-03T00:30:00.000Z",
    tags: [
      "বিজ্ঞানভিত্তিক",
      "কুরআন গবেষণা",
      "অনুবাদ তত্ত্ব",
      "৪:৮২ ফিল্টার",
      "আলম এম."
    ],
    author: STATIC_AUTHORS["38aa28c8-3535-4a1b-ba06-3d1e2792a9c1"],
    category: STATIC_CATEGORIES[0],
    content_bn: `
<div class="article-rich-container space-y-8 text-foreground/90">

  <!-- ইন্ট্রোডাকশন ও মেথডোলজি কার্ড -->
  <div class="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 backdrop-blur-xs">
    <div class="flex items-center gap-2 mb-3">
      <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">বিজ্ঞানভিত্তিক মেথডোলজি</span>
      <span class="text-xs text-muted-foreground">কুরআন গবেষণা ও তাদাব্বুর</span>
    </div>
    <h2 class="text-xl sm:text-2xl font-bold text-foreground mb-3">
      কুরআনিক অনুবাদে শব্দচয়ন, সিস্টেমিক রূপক ও পরিমিতিবোধের স্বরূপ
    </h2>
    <p class="text-sm sm:text-base leading-relaxed text-muted-foreground">
      পবিত্র কুরআনের মূল উদ্দেশ্য হলো <strong>তাদাব্বুর (গভীর চিন্তন ও অনুধাবন)</strong>। একবিংশ শতাব্দীর আধুনিক তথ্যপ্রযুক্তি, কোয়ান্টাম পদার্থবিজ্ঞান ও সিস্টেমস আর্কিটেকচারের যুগে কুরআনের চিরন্তন বার্তাকে একালের চিন্তাশীল মানুষের বোধগম্য ভাষায় তুলে ধরার সময় একটি মৌলিক প্রশ্ন সামনে আসে—<em>"বিজ্ঞানভিত্তিক অনুবাদ করতে গিয়ে আমরা কি অতিরিক্ত শব্দ প্রয়োগ করে ফেলছি, নাকি তা মূল বক্তব্যকে আরও স্বচ্ছ ও প্রাঞ্জল করছে?"</em>
    </p>
  </div>

  <!-- ১. শব্দানুবাদ বনাম তাত্ত্বিক অনুবাদ -->
  <div class="space-y-4">
    <h3 class="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
      <span class="size-2 rounded-full bg-primary inline-block"></span>
      ১. অনুবাদের প্রকারভেদ: ‘শব্দানুবাদ’ বনাম ‘তাত্ত্বিক/সিস্টেমিক অনুবাদ’
    </h3>
    <p class="text-sm sm:text-base leading-relaxed text-muted-foreground">
      অনুবাদ তত্ত্বের (Translation Theory) আলোকে যেকোনো ক্লাসিক্যাল ধর্মগ্রন্থ অনুবাদের ক্ষেত্রে প্রধানত দুটি প্রতিষ্ঠিত ধারা রয়েছে:
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <div class="rounded-xl border border-border bg-card p-5 space-y-2">
        <h4 class="font-bold text-foreground text-sm flex items-center gap-2">
          <span class="size-5 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs">A</span>
          শাব্দিক বা আক্ষরিক অনুবাদ (Tarjama Lafziyya)
        </h4>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          এখানে মূল আরবি শব্দের বিপরীতে কেবল একটি করে বাংলা প্রতিশব্দ প্রতিস্থাপন করা হয়। এতে শব্দসংখ্যা সীমিত থাকে, কিন্তু আধুনিক বৈজ্ঞানিক মনস্তত্ত্বের কাছে বক্তব্যের পূর্ণাঙ্গ ডাইমেনশন ও অভ্যন্তরীণ কার্যকারণ অনেক সময় অনুদঘাটিত থেকে যায়।
        </p>
      </div>

      <div class="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-2">
        <h4 class="font-bold text-primary text-sm flex items-center gap-2">
          <span class="size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">B</span>
          তাত্ত্বিক ও বিজ্ঞানভিত্তিক অনুবাদ (Expository Translation)
        </h4>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          আমাদের এই গবেষণা প্রকল্পের মূল কাঠামো হলো মূলত একটি <strong>Expository & Systemic Translation</strong>। এখানে সংক্ষেপিত একটি আরবি রূপক বা ধারণার পেছনের সুগভীর মহাজাগতিক ও সিস্টেমিক মেকানিজমকে আধুনিক যৌক্তিক পরিভাষায় উন্মোচন করা হয়।
        </p>
      </div>
    </div>
  </div>

  <!-- ২. কেন শব্দসংখ্যা বেশি হয়? -->
  <div class="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
    <h3 class="text-lg sm:text-xl font-bold text-foreground">
      ২. বিজ্ঞানভিত্তিক অনুবাদে শব্দসংখ্যা কিছুটা বেশি হওয়ার কারণসমূহ
    </h3>
    
    <div class="space-y-4">
      <div class="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5">
        <h4 class="text-sm font-bold text-foreground flex items-center gap-2">
          🛡️ ক. লেয়ার ৫ ডুয়েল-ম্যাপিং (Layer 5 Dual Mapping)
        </h4>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          আমরা ইংরেজি টেকনিক্যাল টার্মগুলোকে বাংলায় বানান বিকৃত না করে পিউর ইংরেজি হরফে রেখে ব্র্যাকেটে তার সাবলীল বাংলা অর্থ এবং সাথে মূল আরবি প্রতিশব্দ ধরে রাখছি। যেমন: <code>Dark Matter (অদৃশ্য কৃষ্ণবস্তু বা অন্ধকার) (الظُّلُمَاتِ)</code>। এর ফলে একটি আরবি শব্দ আধুনিক পাঠকের সামনে একটি পূর্ণাঙ্গ সিস্টেমিক কনসেপ্ট হিসেবে ধরা দেয়।
        </p>
      </div>

      <div class="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5">
        <h4 class="text-sm font-bold text-foreground flex items-center gap-2">
          ⚙️ খ. মহাজাগতিক সিস্টেমিক আর্কিটেকচার (OOS Model)
        </h4>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          কুরআনের গভীর আধ্যাত্মিক শব্দগুলোকে যখন আমরা একবিংশ শতাব্দীর মনস্তত্ত্বে রূপান্তর করি—যেমন ‘কুফর’ কে <code>Signal Blockade / System Disconnection</code>, ‘ঈমান’ কে <code>Trust Verification / Protocol Sync</code> এবং ‘আমলনামা’ কে <code>Master Activity Log</code> হিসেবে সংজ্ঞায়িত করা হয়—তখন ধারণাগত সংযোগটি সম্পূর্ণ করতে কিছু কনটেক্সচুয়াল শব্দের প্রয়োজন হয়।
        </p>
      </div>

      <div class="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5">
        <h4 class="text-sm font-bold text-foreground flex items-center gap-2">
          ⚖️ গ. অস্পষ্টতা ও ভুল ব্যাখ্যার ঝুঁকি নিরসন
        </h4>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          অতি-সংক্ষিপ্ত অনুবাদ অনেক সময় বিভ্রান্তির সৃষ্টি করে। পরিভাষার যথাযথ ব্যাখ্যার মাধ্যমে পাঠক যাতে কোনো ভুল ধারণায় পতিত না হন, তা নিশ্চিত করতেই এই পরিমিত ব্যাখ্যামূলক শব্দের সন্নিবেশ।
        </p>
      </div>
    </div>
  </div>

  <!-- ৩. ৪:৮২ ফিল্টারের কঠোর জবাবদিহিতা -->
  <div class="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 space-y-4">
    <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
      <span>🛡️ সেফটি ব্যারিয়ার ও ফিল্টার প্রটোকল</span>
    </div>
    <blockquote class="text-base sm:text-lg font-serif italic text-foreground/90 border-l-4 border-amber-500 pl-4 py-1">
      "তারা কি কুরআন নিয়ে গভীর চিন্তা করে না? যদি তা আল্লাহ ছাড়া অন্য কারও পক্ষ থেকে হতো, তবে অবশ্যই তারা তাতে অনেক বৈপরীত্য ও অমিল দেখতে পেত।" <span class="text-xs not-italic text-muted-foreground block mt-1">— [সূরা আন-নিসা ৪:৮২]</span>
    </blockquote>
    <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
      বিজ্ঞানভিত্তিক অনুবাদে অতিরিক্ত শব্দ প্রয়োগের একটি সুনির্দিষ্ট সীমারেখা রয়েছে। সেটি হলো <strong>৪:৮২ ফিল্টার</strong>:
    </p>
    <ul class="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1.5 pl-2">
      <li><strong>আকিদার মৌলিক সত্য অক্ষুণ্ণ রাখা:</strong> তাওহীদ, রিসালাত ও আখিরাতের কোনো প্রতিষ্ঠিত সত্যকে কখনো খর্ব করা যাবে না। আল্লাহকে কোনো যান্ত্রিক সিপিইউ বা মেকানিক হিসেবে উপস্থাপন করা যাবে না; তিনি পরম স্রষ্টা ও সর্বময় অধিপতি।</li>
      <li><strong>অভ্যন্তরীণ সাংঘর্ষিকতা পরিহার:</strong> একটি সূরায় যে শব্দের যে সিস্টেমিক রূপক দেওয়া হয়েছে, অপর ১১২টি সূরায় তার অর্থের কোনো বৈপরীত্য থাকা চলবে না।</li>
      <li><strong>মূল আরবির সীমা না ভাঙা:</strong> আরবি শব্দের ভাষাগত বা ব্যুৎপত্তিগত সীমার বাইরে নিজের কল্পনাপ্রসূত কোনো বাড়তি তত্ত্ব আরোপ করা যাবে না।</li>
    </ul>
  </div>

  <!-- ৪. প্ল্যাটফর্মের ত্রি-স্তরীয় নিরাপত্তা -->
  <div class="space-y-4">
    <h3 class="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
      <span class="size-2 rounded-full bg-primary inline-block"></span>
      ৪. প্ল্যাটফর্মের ত্রি-স্তরীয় নিরাপত্তা (Three-Tier Architecture)
    </h3>
    <p class="text-sm sm:text-base leading-relaxed text-muted-foreground">
      পাঠকের মনে যেন কোনো বিভ্রান্তি তৈরি না হয়, সেজন্য আমাদের প্ল্যাটফর্মে একই সাথে ৩টি স্তর পাশাপাশি উপস্থাপন করা হয়:
    </p>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs sm:text-sm border border-border rounded-xl overflow-hidden">
        <thead class="bg-muted text-foreground">
          <tr>
            <th class="p-3 border-b border-border font-bold">স্তর</th>
            <th class="p-3 border-b border-border font-bold">ধরণ</th>
            <th class="p-3 border-b border-border font-bold">উদ্দেশ্য</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr>
            <td class="p-3 font-semibold text-foreground">১ম স্তর</td>
            <td class="p-3 text-muted-foreground">শব্দে শব্দে অর্থ ও ব্যাকরণ (Word-by-Word)</td>
            <td class="p-3 text-muted-foreground">১০০% আক্ষরিক ও ব্যুৎপত্তিগত বিশুদ্ধতা প্রদর্শন।</td>
          </tr>
          <tr>
            <td class="p-3 font-semibold text-foreground">২য় স্তর</td>
            <td class="p-3 text-muted-foreground">প্রচলিত অনুবাদ (Conventional Translation)</td>
            <td class="p-3 text-muted-foreground">ঐতিহ্যবাহী সরল, সাবলীল ও সংক্ষিপ্ত পাঠ।</td>
          </tr>
          <tr>
            <td class="p-3 font-semibold text-foreground">৩য় স্তর</td>
            <td class="p-3 text-primary font-medium">আধুনিক বিজ্ঞানভিত্তিক অনুবাদ (Modern Systemic)</td>
            <td class="p-3 text-muted-foreground">আধুনিক মনস্তত্ত্বে গভীর বিশ্লেষণ ও মেকানিজম উন্মোচন।</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- সমাপনী বক্তব্য -->
  <div class="rounded-2xl border border-border bg-secondary/30 p-6 sm:p-8 space-y-3 text-center sm:text-left">
    <h3 class="text-lg sm:text-xl font-bold text-foreground">
      🏁 উপসংহার: আমাদের ভবিষ্যৎ গবেষণার শপথ
    </h3>
    <p class="text-sm sm:text-base leading-relaxed text-foreground/90">
      আমরা জানি, পবিত্র কুরআনের প্রতিটি হরফ পরম পবিত্র। বিজ্ঞানভিত্তিক অনুবাদ কোনোভাবেই মূল ওহীর বিকল্প নয়—এটি কেবল আমাদের যুগের মানুষকে কুরআনের বিস্ময়কর গভীরতার সাথে নতুন করে পরিচিত করানোর একটি বুদ্ধিবৃত্তিক প্রচেষ্টা।
    </p>
    <p class="text-xs sm:text-sm leading-relaxed text-primary font-medium">
      আমরা প্রতিনিয়ত আমাদের অনুবাদকে আরও পরিমিত, সংক্ষিপ্ত এবং বাহুল্যমুক্ত করার জন্য কঠোরভাবে স্ব-নিরীক্ষণ (Self-Audit) চালিয়ে যাব, যেন কুরআনের দ্যুতি ও সৌন্দর্য কোনো কৃত্রিম ভারে ম্লান না হয়ে আরও উজ্জ্বলরূপে মানুষের হৃদয়ে প্রবেশ করে।
    </p>
  </div>

</div>
    `
  }
];

