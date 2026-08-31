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
    id: "cat-scientific",
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

export const STATIC_ARTICLES: StaticArticle[] = [
  {
    id: "art-surah-al-fatihah-1-the-opening-protocol",
    slug: "sura-al-fatihah-1-the-opening-protocol",
    title_bn: "সূরা আল-ফাতিহা (১): মহাজাগতিক সিস্টেমের দ্য ওপেনিং প্রটোকল ও কমিউনিকেশন ফ্রেমওয়ার্ক",
    title_en: "Surah Al-Fatihah (1): The Cosmic Opening Protocol & Systemic Communication Framework",
    excerpt_bn: "সূরা আল-ফাতিহা মহাজাগতিক সিস্টেমের Root Directory Authentication, Attribute Signal Broadcast, Data-compassionate Declaration, Final Phase System Admin, Full Synchronization Protocol, Optimized Pathway Request ও Data-blessing Stream Allocation উপস্থাপন করে।",
    excerpt_en: "Surah Al-Fatihah decodes the Master Opening Protocol: Root Directory Authentication, Attribute Signal Broadcast, Global Data-Compassion, Final Phase System Admin, and Optimized Pathway Routing.",
    category_id: "cat-scientific",
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
  }
];
