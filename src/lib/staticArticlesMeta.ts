// src/lib/staticArticlesMeta.ts
// Lightweight metadata version of articles data for high-performance home & directory pages.
// DO NOT import full content here - keeps the initial bundle ultra lightweight (< 20 KB).

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

export interface StaticArticleMeta {
  id: string;
  slug: string;
  title_bn: string;
  title_en?: string;
  excerpt_bn: string;
  excerpt_en?: string;
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
    "id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "name_bn": "বিজ্ঞানভিত্তিক",
    "name_en": "Scientific",
    "slug": "scientific",
    "description_bn": "পবিত্র কুরআনের আয়াতভিত্তিক বৈজ্ঞানিক বিশ্লেষণ, ইনফরমেশন থিওরি ও মহাজাগতিক অপারেটিং সিস্টেম ফ্রেমওয়ার্ক।",
    "description_en": "Scientific verse analysis, information theory, and Cosmic Operating System frameworks of the Holy Quran.",
    "sort_order": 1,
    "is_restricted": false
  },
  {
    "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
    "name_bn": "কুরআনিক",
    "name_en": "Quranic",
    "slug": "quranic",
    "description_bn": "পবিত্র কুরআনের আয়াতভিত্তিক চিন্তাশীল আলোচনা, গভীর তাদাব্বুর ও জ্ঞান অন্বেষণ।",
    "description_en": "Quranic reflections, deep contemplation, and thematic explorations.",
    "sort_order": 2,
    "is_restricted": false
  }
];

export const STATIC_AUTHORS: Record<string, StaticAuthor> = {
  "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1": {
    "id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "name_bn": "আলম এম.",
    "name_en": "Alam M",
    "bio_bn": "কুরআনের শব্দ ও সংখ্যা গভীর চিন্তার আহ্বান জানায়। আমি সেই চিহ্নগুলো অনুসরণ করি। আমি আলম, পাঠ্যের কাছে নম্র, বিশ্লেষণে কঠোর। লিখি নিজের বোধ থেকে; চূড়ান্ত জ্ঞান একমাত্র আল্লাহর কাছে।",
    "bio_en": "The Quran’s words and numbers invite deep thought. I trace those traces. I'm Alam, humble before the text, rigorous in analysis. I write from my understanding; only ALLAH knows best.",
    "image_url": "https://res.cloudinary.com/coindyna/image/upload/i_am_alam.webp"
  }
};

export const STATIC_ARTICLES_META: StaticArticleMeta[] = [
  {
    "id": "art-zalika-dhalika-shobder-ortho-o-quranic-proyog",
    "slug": "zalika-dhalika-shobder-ortho-o-quranic-proyog",
    "title_bn": "যা-লিকা (ذَٰلِكَ): \"এটা\" নাকি \"ওইটা\" বা \"সেটা\"? কুরআনের ভাষাতাত্ত্বিক রহস্য ও ৫টি মূল প্যাটার্ন",
    "title_en": "Zalika (ذَٰلِكَ) in the Quran: 'This' or 'That'? Linguistic Dimensions and 5 Core Contextual Patterns",
    "excerpt_bn": "কুরআনে ২০০+ বার ব্যবহৃত 'যা-লিকা' (ذَٰلِكَ) কি কেবল দূরত্ববাচক 'ওইটা'? মর্যাদা, উপসংহার, কার্যকারণ, মানসিক দূরত্ব ও নিদর্শন নির্দেশ — এই ৫টি মূল প্যাটার্নে কুরআনের অভ্যন্তরীণ ভাষাতাত্ত্বিক সামঞ্জস্য।",
    "excerpt_en": "An exhaustive linguistic inquiry into the demonstrative pronoun 'Zalika' in the Holy Quran, uncovering its 3 dimensions and 5 core structural patterns from dignity to conclusion.",
    "cover_image_url": null,
    "published": true,
    "published_at": "2026-09-06T09:00:00.000Z",
    "created_at": "2026-09-06T09:00:00.000Z",
    "updated_at": "2026-09-06T09:00:00.000Z",
    "tags": [
      "কুরআনিক",
      "যা-লিকা",
      "ذَٰلِكَ",
      "কুরআনের ব্যাকরণ",
      "ইসমুল ইশারা",
      "সূরা আল-বাকারা ২",
      "কুরআনের ভাষাতত্ত্ব",
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
      "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
      "name_bn": "কুরআনিক",
      "name_en": "Quranic",
      "slug": "quranic",
      "description_bn": "কুরআনের সার্বজনীন দর্শন, গভীর জীবনবিধান, আত্মিক মর্যাদা ও আয়াতভিত্তিক মৌলিক গবেষণা।",
      "description_en": "Universal philosophy of the Quran, life guidance, spiritual dimensions, and root verse analysis.",
      "sort_order": 2,
      "is_restricted": false
    }
  },
  {
    "id": "art-quraner-bhashagoto-kathamo-o-terminologir-aloke-nobuwat-o-risalater-somapti",
    "slug": "quraner-bhashagoto-kathamo-o-terminologir-aloke-nobuwat-o-risalater-somapti",
    "title_bn": "কুরআনের ভাষাগত কাঠামো ও টার্মিনোলজির আলোকে নবুওয়াত ও রিসালাতের সমাপ্তি: একটি সিস্টেমিক বিশ্লেষণ",
    "title_en": "Finality of Prophethood and Messengership in Light of Quranic Linguistic Architecture: A Systemic Analysis",
    "excerpt_bn": "‘খাতামুন নাবিয়্যীন’ ও ‘আকমালতু লাকুম দীনাকুম’ — কুরআনের ধাতুমূল, ব্যাকরণিক রূপ ও অভ্যন্তরীণ সিস্টেমিক লজিকের আলোকে নবুওয়াত ও রিসালাতের চিরন্তন সমাপ্তির এক অকাট্য ভাষাতাত্ত্বিক বিশ্লেষণ।",
    "excerpt_en": "A systemic linguistic analysis of the finality of Prophethood and Messengership based on Quranic root semantics, contextual syntax, and internal structural consistency.",
    "cover_image_url": null,
    "published": true,
    "published_at": "2026-09-06T08:05:00.000Z",
    "created_at": "2026-09-06T08:05:00.000Z",
    "updated_at": "2026-09-06T08:05:00.000Z",
    "tags": [
      "কুরআনিক",
      "নবুওয়াত ও রিসালাতের সমাপ্তি",
      "খাতামুন নাবিয়্যীন",
      "সূরা আল-আহযাব ৪০",
      "সূরা আল-মায়িদা ৩",
      "ভাষাতাত্ত্বিক বিশ্লেষণ",
      "সিস্টেমিক অ্যানালাইসিস",
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
      "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
      "name_bn": "কুরআনিক",
      "name_en": "Quranic",
      "slug": "quranic",
      "description_bn": "কুরআনের সার্বজনীন দর্শন, গভীর জীবনবিধান, আত্মিক মর্যাদা ও আয়াতভিত্তিক মৌলিক গবেষণা।",
      "description_en": "Universal philosophy of the Quran, life guidance, spiritual dimensions, and root verse analysis.",
      "sort_order": 2,
      "is_restricted": false
    }
  },
  {
    "id": "art-amra-ki-sotyi-quran-bujhi",
    "slug": "amra-ki-sotyi-quran-bujhi",
    "title_bn": "আমরা কি সত্যিই কুরআন বুঝি?",
    "title_en": "Do We Truly Understand the Quran?",
    "excerpt_bn": "\"মা লাম তাকুনু তা’লামুন\" — কুরআন কি কেবল বাহ্যিক আচার-অনুষ্ঠানের সংকীর্ণ গ্রন্থ, নাকি মহাবিশ্ব সম্প্রসারণ, বিগ ব্যাং, সমুদ্রের অন্ধকার ও জীববিজ্ঞানের গভীরতম চিন্তার এক চিরন্তন মহাকাব্য?",
    "excerpt_en": "An in-depth inquiry into whether the Quran was revealed merely for narrow ritualism, or as a cosmic, intellectual guide challenging human intellect across astronomy, geology, embryology, and deep science.",
    "cover_image_url": null,
    "published": true,
    "published_at": "2026-07-31T12:00:00.000Z",
    "created_at": "2026-07-31T12:00:00.000Z",
    "updated_at": "2026-09-06T08:00:00.000Z",
    "tags": [
      "কুরআনিক",
      "বিজ্ঞানভিত্তিক",
      "আমরা কি সত্যিই কুরআন বুঝি",
      "মহাবিশ্বের সম্প্রসারণ",
      "বিগ ব্যাং",
      "কুরআনে চিন্তা ও গবেষণা",
      "ফিকহ বনাম দর্শন",
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
      "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
      "name_bn": "কুরআনিক",
      "name_en": "Quranic",
      "slug": "quranic",
      "description_bn": "কুরআনের সার্বজনীন দর্শন, গভীর জীবনবিধান, আত্মিক মর্যাদা ও আয়াতভিত্তিক মৌলিক গবেষণা।",
      "description_en": "Universal philosophy of the Quran, life guidance, spiritual dimensions, and root verse analysis.",
      "sort_order": 2,
      "is_restricted": false
    }
  },
  {
    "id": "art-quraner-bhashay-ki-shurjo-poschim-theke-udito-howar-ingit-ache",
    "slug": "quraner-bhashay-ki-shurjo-poschim-theke-udito-howar-ingit-ache-ekti-bhashatattwik-gobeshona",
    "title_bn": "কুরআনের ভাষায় কি \"সূর্য পশ্চিম থেকে উদিত হওয়ার\" কোনো ইঙ্গিত আছে? একটি ভাষাতাত্ত্বিক গবেষণা",
    "title_en": "Is There an Indication in the Quran of the Sun Rising from the West? A Linguistic Investigation",
    "excerpt_bn": "কুরআনে সরাসরি না বলা হলেও সূরা আর-রাহমানের 'মাশরিকাইন' ও 'মাগরিবাইন' (দ্বিবচন), সূরা আল-মাআরিজের 'মাশারিক' (বহুবচন) এবং ২:২৫৮, ৮১:১ ও ৭৫:৭-৯ আয়াতের ভাষাতাত্ত্বিক শব্দমূল বিশ্লেষণে এক অভাবনীয় মহাজাগতিক মডেলের উন্মোচন।",
    "excerpt_en": "A linguistic investigation of Mashriqayn vs Mashariq (dual vs plural) in Surah Ar-Rahman 55:17 and Al-Ma'arij 70:40, exploring cosmic shifts and textual implications of the sun's trajectory in the Quran.",
    "published": true,
    "published_at": "2026-09-06T07:20:00.000Z",
    "created_at": "2026-09-06T07:20:00.000Z",
    "updated_at": "2026-09-06T07:20:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "বিজ্ঞানভিত্তিক",
      "সূর্য পশ্চিম থেকে উদয়",
      "ভাষাতাত্ত্বিক গবেষণা",
      "মাশরিকাইন ও মাগরিবাইন",
      "সূরা আর-রহমান ১৭",
      "সূরা আল-বাকারা ২৫৮",
      "মহাজাগতিক পরিবর্তন",
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
    }
  },
  {
    "id": "art-salat-bonam-procholito-namaz-quran-ki-bole",
    "slug": "salat-bonam-procholito-namaz-quran-ki-bole",
    "title_bn": "সালাত বনাম প্রচলিত নামাজ: কুরআন কী বলে?",
    "title_en": "Salat vs Conventional Namaz: What Does the Quran Really Say?",
    "excerpt_bn": "কুরআনে বর্ণিত ‘সালাত’ কি কেবল একটি নির্দিষ্ট আনুষ্ঠানিক উপাসনা, নাকি এর চেয়ে বড় কোনো জীবনবিধান? যুদ্ধক্ষেত্রে সালাত (৪:১০২-১০৩), সার্বক্ষণিক সালাত (৭০:২৩), আল্লাহ ও ফেরেশতাদের সালাত (৩৩:৫৬) এবং ওহীর বাস্তব প্রতিফলনের গভীর কুরআনিক বিশ্লেষণ।",
    "excerpt_en": "Is 'Salat' merely a ritual prayer or a comprehensive operational paradigm? A rigorous textual analysis of battlefield Salat (4:102), perpetual Salat (70:23), divine Salat (33:56), and moral execution under Surah 29:45.",
    "published": true,
    "published_at": "2026-09-06T07:15:00.000Z",
    "created_at": "2026-09-06T07:15:00.000Z",
    "updated_at": "2026-09-06T07:15:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
    "tags": [
      "সালাত বনাম নামাজ",
      "কুরআনিক সালাত",
      "সূরা আন-নিসা ১০২",
      "সার্বক্ষণিক সালাত",
      "সূরা মা'আরিজ ২৩",
      "সূরা আল-আহযাব ৫৬",
      "আলম এম.",
      "কুরআনিক"
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
      "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
      "name_bn": "কুরআনিক",
      "name_en": "Quranic",
      "slug": "quranic",
      "description_bn": "পবিত্র কুরআনের আয়াতভিত্তিক চিন্তাশীল আলোচনা, গভীর তাদাব্বুর ও জ্ঞান অন্বেষণ।",
      "description_en": "Quranic reflections, deep contemplation, and thematic explorations.",
      "sort_order": 2,
      "is_restricted": false
    }
  },
  {
    "id": "art-pitatamatar-proti-shodbyabohar-quraner-nirdesh-o-uh-na-bolar-shishtachar",
    "slug": "pitatamatar-proti-shodbyabohar-quraner-nirdesh-o-uh-na-bolar-shishtachar",
    "title_bn": "পিতামাতার প্রতি সদ্ব্যবহার: 'উহ্' না বলার কুরআনিক দর্শন ও আত্মিক মর্যাদা",
    "title_en": "Filial Piety in the Quran: The Philosophy of Never Uttering 'Uff' and the Honour of Elderly Parents",
    "excerpt_bn": "সূরা আল-ইসরা (১৭:২৩-২৪), লোকমান (৩১:১৪-১৫) ও আল-আহকাফ (৪৬:১৫)-এর আলোকে পিতামাতার বার্ধক্যে সন্তানের মনস্তাত্ত্বিক ধৈর্য, 'উহ্' না বলার সূক্ষ্ম শিষ্টাচার, দোয়ার ভাষা এবং কুরআনিক জীবনবিধানের গভীর বিশ্লেষণ।",
    "excerpt_en": "A comprehensive Quranic study exploring Surah Al-Isra 17:23-24, Luqman 31:14-15, and Al-Ahqaf 46:15 on filial ethics, psychological patience with elderly parents, the nuance of 'Uff', and divine prayers.",
    "published": true,
    "published_at": "2026-09-06T07:00:00.000Z",
    "created_at": "2026-09-06T07:00:00.000Z",
    "updated_at": "2026-09-06T07:00:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
    "tags": [
      "পিতামাতার অধিকার",
      "সূরা আল-ইসরা ২৩-২৪",
      "উহ্ শব্দ না বলা",
      "সূরা লোকমান ১৪",
      "পিতামাতার জন্য দোআ",
      "কুরআনিক জীবনদর্শন",
      "আলম এম.",
      "কুরআনিক"
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
      "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
      "name_bn": "কুরআনিক",
      "name_en": "Quranic",
      "slug": "quranic",
      "description_bn": "পবিত্র কুরআনের আয়াতভিত্তিক চিন্তাশীল আলোচনা, গভীর তাদাব্বুর ও জ্ঞান অন্বেষণ।",
      "description_en": "Quranic reflections, deep contemplation, and thematic explorations.",
      "sort_order": 2,
      "is_restricted": false
    }
  },
  {
    "id": "art-mrito-mach-halal-quran-theke-proman",
    "slug": "mrito-mach-halal-quran-theke-proman",
    "title_bn": "মৃত মাছ হালাল: কুরআন থেকেই প্রমাণ",
    "title_en": "Dead Fish is Halal: Linguistic and Textual Proof from the Quran",
    "excerpt_bn": "সূরা আল-মা'ইদাহ (৫:৩)-এর আয়াতে বর্ণিত ১০টি হারাম বিষয়ের ভাষাতাত্ত্বিক ও জৈবিক বিশ্লেষণে অকাট্যভাবে প্রমাণিত হয় যে মৃত মাছ এই নিষেধাজ্ঞার অন্তর্ভুক্ত নয়।",
    "excerpt_en": "A linguistic, textual, and biological analysis of the prohibited categories in Surah Al-Ma'idah 5:3 demonstrating why aquatic dead fish are fundamentally excluded from the prohibition.",
    "published": true,
    "published_at": "2026-09-06T06:45:00.000Z",
    "created_at": "2026-09-06T06:45:00.000Z",
    "updated_at": "2026-09-06T06:45:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
    "tags": [
      "সূরা আল-মায়েদা ৫:৩",
      "মৃত মাছ হালাল",
      "কুরআনিক খাদ্যবিধি",
      "ভাষাতাত্ত্বিক বিশ্লেষণ",
      "আলম এম.",
      "কুরআনিক"
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
      "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
      "name_bn": "কুরআনিক",
      "name_en": "Quranic",
      "slug": "quranic",
      "description_bn": "পবিত্র কুরআনের আয়াতভিত্তিক চিন্তাশীল আলোচনা, গভীর তাদাব্বুর ও জ্ঞান অন্বেষণ।",
      "description_en": "Quranic reflections, deep contemplation, and thematic explorations.",
      "sort_order": 2,
      "is_restricted": false
    }
  },
  {
    "id": "art-islam-dhormer-tag-naki-ekti-purnanggo-jibonbyabostha",
    "slug": "islam-dhormer-tag-naki-ekti-purnanggo-jibonbyabostha",
    "title_bn": "ইসলাম: ধর্মের ট্যাগ, নাকি একটি পূর্ণাঙ্গ জীবনব্যবস্থা?",
    "title_en": "Islam: A Religious Label, or a Comprehensive System of Life?",
    "excerpt_bn": "ইসলাম কি কেবল একটি সম্প্রদায়গত ধর্মীয় পরিচয়, নাকি মানুষের সামগ্রিক জীবনব্যবস্থা? 'দ্বীন' বনাম 'ধর্ম', মাযহাবের উৎপত্তি, কুরআনিক পরিচয় 'মুসলিম', দলীয় বিভাজন ও ৪:৮২ ফিল্টারের আলোকে এক অনন্য আত্মবিশ্লেষণ।",
    "excerpt_en": "Is Islam merely a sectarian label or an all-encompassing system of life? Deconstructing 'Deen' versus 'Religion', the evolution of Madhhabs, Quranic identity 'Muslim', and unity under Surah 4:82.",
    "published": true,
    "published_at": "2026-09-02T00:00:00.000Z",
    "created_at": "2026-09-02T00:00:00.000Z",
    "updated_at": "2026-09-02T00:00:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
    "tags": [
      "দ্বীন বনাম ধর্ম",
      "মাযহাব ও পরিচয়",
      "মুসলিম",
      "কুরআনিক দর্শন",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি",
      "তাওহিদ ও জীবনব্যবস্থা",
      "আলম এম.",
      "কুরআনিক"
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
      "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
      "name_bn": "কুরআনিক",
      "name_en": "Quranic",
      "slug": "quranic",
      "description_bn": "পবিত্র কুরআনের আয়াতভিত্তিক চিন্তাশীল আলোচনা, গভীর তাদাব্বুর ও জ্ঞান অন্বেষণ।",
      "description_en": "Quranic reflections, deep contemplation, and thematic explorations.",
      "sort_order": 2,
      "is_restricted": false
    }
  },
  {
    "id": "art-surah-yusufe-ki-sotyi-swopner-kotha-bola-hoyeche",
    "slug": "surah-yusufe-ki-sotyi-swopner-kotha-bola-hoyeche",
    "title_bn": "সূরা ইউসুফে কি সত্যিই স্বপ্নের কথা বলা হয়েছে?",
    "title_en": "Was It Really a Dream in Surah Yusuf? A Rigorous Linguistic Analysis",
    "excerpt_bn": "ইউসুফ (আ.) কি সত্যিই স্বপ্ন দেখেছিলেন, নাকি কুরআন অন্য কোনো গভীর দর্শন ও উপলব্ধির কথা বলছে? ১২:৪ আয়াতের 'রাআইতু', রসমুল-মুসহাফ, কাওকাব শব্দমূল, তা'ওয়ীলিল-আহাদীস এবং পূর্বধারণামুক্ত কুরআন গবেষণার পদ্ধতিগত বিশ্লেষণ।",
    "excerpt_en": "Did Yusuf (AS) actually see a dream in 12:4, or does the text indicate a profound perception? A rigorous linguistic exploration of 'Ra'aytu', Rasm al-Mushaf, Kawakab, Ta'weel al-Ahadith, and presupposition-free Quranic methodology.",
    "published": true,
    "published_at": "2026-09-06T06:25:00.000Z",
    "created_at": "2026-09-06T06:25:00.000Z",
    "updated_at": "2026-09-06T06:25:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
    "tags": [
      "সূরা ইউসুফ",
      "স্বপ্ন বনাম উপলব্ধি",
      "তাদাব্বুর",
      "ভাষাতাত্ত্বিক বিশ্লেষণ",
      "রাআইতু",
      "তা'ওয়ীলিল আহাদীস",
      "আলম এম.",
      "কুরআনিক"
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
      "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
      "name_bn": "কুরআনিক",
      "name_en": "Quranic",
      "slug": "quranic",
      "description_bn": "পবিত্র কুরআনের আয়াতভিত্তিক চিন্তাশীল আলোচনা, গভীর তাদাব্বুর ও জ্ঞান অন্বেষণ।",
      "description_en": "Quranic reflections, deep contemplation, and thematic explorations.",
      "sort_order": 2,
      "is_restricted": false
    }
  },
  {
    "id": "art-quraner-ayate-bhabishyat-projuktir-ingit",
    "slug": "quraner-ayate-bhabishyat-projuktir-ingit",
    "title_bn": "কুরআনের আয়াতে ভবিষ্যৎ প্রযুক্তির ইঙ্গিত?",
    "title_en": "Hints of Future Technology in Quranic Verses?",
    "excerpt_bn": "কুরআন কি ভবিষ্যৎ প্রযুক্তির পূর্বাভাষ দেয়? সুলাইমান, মূসা, ঈসা ও ইবরাহিম (আ.)-এর বর্ণিত ঘটনা এবং দূরত্ব অতিক্রম, বায়ুপ্রবাহ, প্রাণী যোগাযোগ, চিকিৎসাবিজ্ঞান ও মানুষের সীমাহীন অনুসন্ধানের গভীর বিশ্লেষণ।",
    "excerpt_en": "Does the Quran foreshadow future technology? An analytical reflection on the narratives of Solomon, Moses, Jesus, and Abraham—exploring distance, aerodynamics, medicine, and unbounded human inquiry.",
    "published": true,
    "published_at": "2026-09-06T06:15:00.000Z",
    "created_at": "2026-09-06T06:15:00.000Z",
    "updated_at": "2026-09-06T06:15:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
    "tags": [
      "কুরআন ও প্রযুক্তি",
      "ভবিষ্যৎ বিজ্ঞান",
      "তাদাব্বুর",
      "সুলাইমান (আ.)",
      "কুরআনিক দর্শন",
      "জ্ঞান অন্বেষণ",
      "আলম এম.",
      "কুরআনিক"
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
      "id": "9397b0e6-f196-47a1-80bd-fdfc98f82015",
      "name_bn": "কুরআনিক",
      "name_en": "Quranic",
      "slug": "quranic",
      "description_bn": "পবিত্র কুরআনের আয়াতভিত্তিক চিন্তাশীল আলোচনা, গভীর তাদাব্বুর ও জ্ঞান অন্বেষণ।",
      "description_en": "Quranic reflections, deep contemplation, and thematic explorations.",
      "sort_order": 2,
      "is_restricted": false
    }
  },
  {
    "id": "art-jumuah-62-9-10-collective-conscious-communion-reset",
    "slug": "jumuah-62-9-10-collective-conscious-communion-reset",
    "title_bn": "সূরা আল-জুমুআ (৬২:৯-১০): ‘সালাত’ কি কেবল রিচুয়াল নামাজ নাকি সাপ্তাহিক সমষ্টিগত রিসেট? অর্থনীতি ও চেতনার গভীর ব্যবচ্ছেদ",
    "title_en": "Surah Al-Jumu'ah (62:9-10): Is Salat a Ritual Prayer or a Weekly Collective Conscious Reset?",
    "excerpt_bn": "সালাত শব্দটিকে কেবল ‘নামাজ’ হিসেবে অনুবাদ করলে আয়াতের সামাজিক ও অর্থনৈতিক নিয়ন্ত্রণমূলক গভীর মেসেজ কীভাবে ঢাকা পড়ে যায়? ৬২:৯-১০ আয়াতের রুট বিশ্লেষণ, লেনদেন স্থগিতের উদ্দেশ্য ও বাস্তব প্রয়োগের রূপরেখা।",
    "excerpt_en": "Why reducing 'Salat' to ritual prayer obscures the socioeconomic and cognitive resetting architecture of Surah Al-Jumu'ah 62:9-10. Root analysis of conscious communion and marketplace ethics under Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T22:08:00.000Z",
    "created_at": "2026-09-03T22:08:00.000Z",
    "updated_at": "2026-09-03T22:08:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "সূরা আল-জুমুআ ৬২:৯-১০",
      "সালাতের কোর মিনিং",
      "সাপ্তাহিক সমষ্টিগত রিসেট",
      "অর্থনীতি ও লেনদেন",
      "শব্দমূল বিশ্লেষণ",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-surah-maidah-5-6-integrated-purification-and-wudu",
    "slug": "surah-maidah-5-6-integrated-purification-and-wudu",
    "title_bn": "কুরআনের আয়াত ৫:৬ — অজু কি কেবল শারীরিক, নাকি একটি সমন্বিত মানব প্রস্তুতি ও পরিশুদ্ধি ব্যবস্থা? (৪:৮২ ফিল্টার)",
    "title_en": "Surah Al-Ma'idah (5:6): Is Wudu Merely Physical Washing or an Integrated Systemic Purification?",
    "excerpt_bn": "সূরা আল-মায়েদা ৫:৬ কেবল শারীরিক হাত-মুখ ধোয়ার আনুষ্ঠানিকতা নয়। ওয়াজহ (মনোযোগ), আইদী (কর্মক্ষমতা), রুউস (নেতৃত্ব), আরজুল (অগ্রযাত্রা) ও তায়াম্মুম (দৃঢ় সংকল্প)—১০টি শব্দমূলের ভিত্তিতে সমন্বিত প্রস্তুতির গভীর উন্মোচন।",
    "excerpt_en": "Deconstructing Surah Al-Ma'idah 5:6 across 10 lexical roots: Focus (Wajh), Agency (Aydi), Leadership (Ru'us), Trajectory (Arjul), and Resolute Will (Tayammum) — from physical hygiene to holistic consciousness under Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T22:00:00.000Z",
    "created_at": "2026-09-03T22:00:00.000Z",
    "updated_at": "2026-09-03T22:00:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "সূরা আল-মায়েদা ৫:৬",
      "অজু ও সমন্বিত পরিশুদ্ধি",
      "১০টি শব্দমূল বিশ্লেষণ",
      "ওয়াজহ ও নিয়ত",
      "নেতৃত্ব ও কর্মপদ্ধতি",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-aal-e-imran-3-14-nisa-and-human-desires-analysis",
    "slug": "aal-e-imran-3-14-nisa-and-human-desires-analysis",
    "title_bn": "আলে-ইমরান (৩:১৪): ‘নিসা’ (النِّسَاء) কি কেবল জৈবিক নারী নাকি সম্পর্কনির্ভর টান? মানবিক প্রবৃত্তি ও ক্ষমতার কাঠামোর গভীর ব্যবচ্ছেদ",
    "title_en": "Aal-e-Imran (3:14): Is 'An-Nisa' Strictly Biological Women or Relational Attachments? Deconstructing Desires and Power Systems",
    "excerpt_bn": "৩:১৪ আয়াতে ‘নিসা’ বলতে কি শুধু নারী বোঝায়? রুট ن-س-أ (বিলম্ব/নির্ভরশীলতা), ‘আল-বানীন’ (উত্তরাধিকার/ক্ষমতা) এবং সঞ্চিত সম্পদের মনোস্তাত্ত্বিক বিশ্লেষণ—কুরআনে প্রবৃত্তি ও মালিকানার সার্বজনীন রূপরেখা।",
    "excerpt_en": "Surah Aal-e-Imran 3:14 decoded: Why 'An-Nisa' represents relational and emotional dependencies rather than mere biological gender, harmonizing human psychology, capital, and status under Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T21:55:00.000Z",
    "created_at": "2026-09-03T21:55:00.000Z",
    "updated_at": "2026-09-03T21:55:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "আলে ইমরান ৩:১৪",
      "নিসা শব্দের রুট",
      "সম্পর্কনির্ভর টান",
      "প্রবৃত্তির মোহ ও ক্ষমতা",
      "শব্দমূল বিশ্লেষণ",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-quranic-balance-hud-11-15-vs-baqarah-2-201-hasanah",
    "slug": "quranic-balance-hud-11-15-vs-baqarah-2-201-hasanah",
    "title_bn": "কুরআনে কোনো বিরোধপূর্ণ কথা রয়েছে? পার্থিব মোহ (১১:১৫-১৬) বনাম ‘রাব্বানা আতিনা ফিদ্দুনিয়া হাসানাহ’ (২:২০১) — ঐশী ভারসাম্যের এক অনুপম দর্শন",
    "title_en": "Is There Any Contradiction in the Quran? Worldly Life (11:15-16) vs. 'Rabbana Atina fid-Dunya Hasanah' (2:201)",
    "excerpt_bn": "সূরা হূদ (১১:১৫-১৬)-এ পার্থিব জীবনের মোহ সম্পর্কে তীব্র সতর্কবার্তা, আবার সূরা বাকারা (২:২০১)-এ দুনিয়ার কল্যাণের প্রার্থনা—এতে কি বৈপরীত্য রয়েছে? শব্দমূল ‘হাসানাহ’ (ح س ن) ও ঐশী ভারসাম্যের অকাট্য সমাধান।",
    "excerpt_en": "Examining the apparent tension between Surah Hud 11:15-16 (warning against worldly obsession) and Surah Al-Baqarah 2:201 (supplication for worldly good): Decoding the root 'ḥ-s-n' and the divine equilibrium of Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T21:50:00.000Z",
    "created_at": "2026-09-03T21:50:00.000Z",
    "updated_at": "2026-09-03T21:50:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "কুরআনে কোনো বিরোধ নেই",
      "সূরা হূদ ১১:১৫",
      "রাব্বানা আতিনা ফিদ্দুনিয়া",
      "হাসানাহ শব্দের রুট",
      "ঐশী ভারসাম্য",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-salat-jumuah-dhikr-and-social-responsibility",
    "slug": "salat-jumuah-dhikr-and-social-responsibility",
    "title_bn": "সালাত, জুমুআ, যিকর ও সামাজিক দায়িত্ব: কুরআনের আলোকে একটি ভাষাগত ও প্রাসঙ্গিক পর্যালোচনা (৪:৮২ ফিল্টার)",
    "title_en": "Salat, Jumu'ah, Dhikr, and Social Responsibility: A Linguistic and Contextual Quranic Review",
    "excerpt_bn": "সালাত, জুমুআ, যিকর ও তাসবীহ—শুধুই কি আনুষ্ঠানিক আচার নাকি আল্লাহর নির্দেশনার সাথে অবিচ্ছিন্ন সংযোগ ও সামাজিক সমাবেশ? শব্দমূল বিশ্লেষণ ও সূরা ৪:৮২ ফিল্টারে কুরআনিক পরিভাষার গভীর পুনর্মূল্যায়ন।",
    "excerpt_en": "Deconstructing Salat (continuous alignment), Dhikr (active cognitive retention), Jumu'ah (social assembly), and societal justice through lexical roots and the invariant non-contradiction framework of Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T21:46:00.000Z",
    "created_at": "2026-09-03T21:46:00.000Z",
    "updated_at": "2026-09-03T21:46:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "সালাত ও যিকর",
      "জুমুআ ও সামাজিক সমাবেশ",
      "আকিমিস সালাত",
      "সামাজিক দায়িত্ব ও এতিম",
      "শব্দমূল বিশ্লেষণ",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-qasam-root-analysis-surah-balad-90-1",
    "slug": "qasam-root-analysis-surah-balad-90-1",
    "title_bn": "“কসম” শব্দটি আসলে কী? সূরা আল-বালাদ (৯০:১) ও ‘লা উক্বসিমু’ (لَا أُقْسِمُ)-এর ধাতুভিত্তিক নিখুঁত বিশ্লেষণ",
    "title_en": "What Does 'Qasam' Really Mean? Lexical Root Analysis of 'Lā Uqsimu' in Surah Al-Balad 90:1",
    "excerpt_bn": "‘কসম’ কি মানুষের মতো শপথ করা? রুট ق-س-م (বণ্টন/নির্ধারণ), ‘লা’ (لَا)-এর ভুল ধারণা প্রত্যাখ্যান এবং সূরা আল-বালাদ ৯০:১-এর আলোকে কুরআনে সত্যকে দৃঢ়ভাবে প্রতিষ্ঠার রূপরেখা।",
    "excerpt_en": "Deconstructing the root q-s-m (demarcation/allocation), the emphatic refutation of 'Lā', and Surah Al-Balad 90:1: Why 'Qasam' in the Quran represents firm establishment of truth rather than human oaths.",
    "published": true,
    "published_at": "2026-09-03T21:42:00.000Z",
    "created_at": "2026-09-03T21:42:00.000Z",
    "updated_at": "2026-09-03T21:42:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "কসম শব্দের রুট",
      "সূরা আল-বালাদ ৯০:১",
      "লা উক্বসিমু",
      "শব্দতাত্ত্বিক বিশ্লেষণ",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-legislative-authority-of-deen-tawhid-analysis",
    "slug": "legislative-authority-of-deen-tawhid-analysis",
    "title_bn": "দ্বীনের বিধান কার হাতে? কুরআনের আলোকে তাওহীদের বিচারিক ও আইনগত সার্বভৌমত্ব (৪:৮২ ফিল্টার)",
    "title_en": "Who Holds Legislative Authority in Deen? A Deep Quranic Analysis of Judicial Tawheed",
    "excerpt_bn": "দ্বীনের হালাল-হারাম ও বাধ্যতামূলক আইন প্রণয়নের অধিকার কার? সূরা ইউসুফ (১২:৪০), আশ-শূরা (৪২:২১) ও তাওবা (৯:৩১)-এর শব্দতাত্ত্বিক বিশ্লেষণে মানুষের তৈরি বিধানকে ধর্মের স্তরে তোলার ভয়াবহতা ও কুরআনের পরিপূর্ণতা।",
    "excerpt_en": "Who has the absolute authority to decree Halal and Haram in religion? An exhaustive Quranic deconstruction of Judicial Tawheed, human-made religious laws, and the supreme sufficiency of the Divine Book under Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T21:38:00.000Z",
    "created_at": "2026-09-03T21:38:00.000Z",
    "updated_at": "2026-09-03T21:38:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "দ্বীনের বিধান",
      "তাওহীদের বিচারিক রূপ",
      "হুকুম কেবল আল্লাহর",
      "হালাল ও হারাম",
      "কুরআনের পরিপূর্ণতা",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-deaf-dumb-blind-cognitive-analysis-2-18",
    "slug": "deaf-dumb-blind-cognitive-analysis-2-18",
    "title_bn": "বধির-মূক-অন্ধ (২:১৮): শারীরিক প্রতিবন্ধকতা নাকি চেতনার অন্ধত্ব? ৮৩০ কোটি মানুষের বাস্তবতায় কুরআনের গভীর অন্তর্দৃষ্টি",
    "title_en": "Deaf, Dumb, and Blind (2:18): Physical Disability or Cognitive Paralysis? Surah 4:82 Analysis",
    "excerpt_bn": "পৃথিবীর ৮৩০ কোটিরও বেশি মানুষের প্রায় সবাই চোখে দেখে, কানে শোনে ও কথা বলে। তাহলে ২:১৮ আয়াতে ‘তারা বধির, মূক ও অন্ধ’ বলতে কুরআন আসলে কী বুঝিয়েছে? শব্দমূল ও মনস্তত্ত্বভিত্তিক গভীর বিশ্লেষণ।",
    "excerpt_en": "With over 8.3 billion people possessing functional senses, Surah Al-Baqarah (2:18) 'Deaf, dumb, and blind' decoded as cognitive dissonance, suppression of truth, and psychological blindness under Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T21:35:00.000Z",
    "created_at": "2026-09-03T21:35:00.000Z",
    "updated_at": "2026-09-03T21:35:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "বধির-মূক-অন্ধ",
      "সূরা আল-বাকারা ২:১৮",
      "কোর মিনিং",
      "মনস্তাত্ত্বিক অন্ধত্ব",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-masjidul-haram-and-masjidul-aqsa-spiritual-dimension",
    "slug": "masjidul-haram-and-masjidul-aqsa-spiritual-dimension",
    "title_bn": "মসজিদুল হারাম ও মসজিদুল আকসা: ভৌত স্থাপনা বনাম চেতনার আধ্যাত্মিক মেরুদণ্ড (৪:৮২ ফিল্টার)",
    "title_en": "Al-Masjid Al-Haram & Al-Masjid Al-Aqsa: Physical Architecture vs. The Spiritual Zenith of Consciousness",
    "excerpt_bn": "মসজিদকে শুধু ইট-পাথরের ভৌত স্থাপনা ধরে নিলে ৪:৮২ আয়াতের মর্মার্থ রক্ষা করা যায় না। আল-ইসরা (১৭:১) ও আল-বাকারা (২:১৪৪)-এর শব্দতাত্ত্বিক বিশ্লেষণে অন্তরের নিরাপদ আত্মসমর্পণ থেকে আধ্যাত্মিক শীর্ষবিন্দুর জীবন্ত যাত্রা।",
    "excerpt_en": "Decoding the lexical semantics of Al-Masjid Al-Haram (the inviolable state of surrender) and Al-Masjid Al-Aqsa (the farthest spiritual zenith) beyond brick-and-mortar confinements under Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T21:30:00.000Z",
    "created_at": "2026-09-03T21:30:00.000Z",
    "updated_at": "2026-09-03T21:30:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "মসজিদুল হারাম",
      "মসজিদুল আকসা",
      "আল-ইসরা ১৭:১",
      "আধ্যাত্মিক যাত্রা",
      "শব্দতাত্ত্বিক বিশ্লেষণ",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-nasi-quranic-chronology-and-calendar-analysis",
    "slug": "nasi-quranic-chronology-and-calendar-analysis",
    "title_bn": "নাসি (পিছিয়ে দেওয়া): কুরআনের কালপঞ্জি, প্রত্নতত্ত্ব ও গাণিতিক ইন্টারক্যালেশনের গভীর বিশ্লেষণ",
    "title_en": "Nasi' (Postponement): A Deep Epigraphical, Chronological, and Mathematical Analysis of the Quranic Calendar",
    "excerpt_bn": "ইয়েমেনের সাবা প্রত্নলিপি, সূরা তাওবার ৩৭ নম্বর আয়াত এবং সূরা কাহফের গাণিতিক রহস্য—'নাসি' কি লিপ-ইয়ার নাকি যুদ্ধবিরতি ও হজ্জ পিছিয়ে দেওয়ার চক্রান্ত? প্রচলিত বিভ্রান্তি বনাম কুরআনের নির্ভুল কালপঞ্জি।",
    "excerpt_en": "Decoding the Sabaean epigraphical inscription 'ns'w', Surah At-Tawbah 9:37, and the 300+9 year luni-solar mathematical proof in Surah Al-Kahf: Why Nasi' is ritual postponement, not astronomical intercalation.",
    "published": true,
    "published_at": "2026-09-03T21:25:00.000Z",
    "created_at": "2026-09-03T21:25:00.000Z",
    "updated_at": "2026-09-03T21:25:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "নাসি ও কালপঞ্জি",
      "কুরআনিক ক্যালেন্ডার",
      "ইন্টারক্যালেশন",
      "আসহাবে কাহাফ ও রাকীম",
      "সাবীয় প্রত্নলিপি",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি"
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
    }
  },
  {
    "id": "art-shirk-and-mushrikun-core-meaning-and-societal-analysis",
    "slug": "shirk-and-mushrikun-core-meaning-and-societal-analysis",
    "title_bn": "শিরক কী, মুশরিক কারা? শুধু মূর্তিপূজা নয়—মনস্তাত্ত্বিক, সামাজিক ও রাজনৈতিক শিরকের গভীরে (৪:৮২ ফিল্টার)",
    "title_en": "What is Shirk and Who are the Mushrikun? Beyond Idolatry: Cognitive, Societal, and Political Polytheism",
    "excerpt_bn": "শিরক মানে শুধু পাথরের মূর্তি পূজা নয়। মানুষের তৈরি হালাল-হারাম, সুপারিশ ও ব্যাকডোর খোঁজার মনস্তত্ত্ব, রাজনৈতিক ক্ষমতার অন্ধ আনুগত্য এবং সংখ্যাগরিষ্ঠতার বিভ্রান্তি—কুরআনের দ্বিস্তর বিশ্লেষণে শিরকের প্রকৃত স্বরূপ উন্মোচন।",
    "excerpt_en": "Shirk is not merely stone idolatry. Fabricated religious laws, the cognitive corruption of intercession, political despotism, and majoritarian fallacies decoded through the multi-tier core meaning framework of Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T21:20:00.000Z",
    "created_at": "2026-09-03T21:20:00.000Z",
    "updated_at": "2026-09-03T21:20:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "শিরক ও তাওহীদ",
      "মুশরিক কারা",
      "শাফায়াত ও মধ্যস্থতা",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি",
      "কোর মিনিং",
      "আলম এম.",
      "রাজনৈতিক শিরক",
      "স্বাধীন চেতনা"
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
    }
  },
  {
    "id": "art-siratal-mustaqeem-99-principles-of-infallible-path",
    "slug": "siratal-mustaqeem-99-principles-of-infallible-path",
    "title_bn": "সিরাতুল মুস্তাক্বীম (১:৬): ভ্রান্তিহীন ও স্থায়ী পথের ৯৯টি বাস্তব কুরআনভিত্তিক রূপরেখা",
    "title_en": "Sirat al-Mustaqeem (1:6): 99 Quranic Principles of the Infallible and Permanent Path",
    "excerpt_bn": "আল-ফাতিহা (১:৬)-এর ‘ইহদিনাস সিরাতাল মুস্তাক্বীম’ কেবল একটি আনুষ্ঠানিক প্রার্থনা নয়—এটি পুরো কুরআন জুড়ে ছড়িয়ে থাকা ৯৯টি স্পষ্ট ব্যবহারিক নীতি ও বাস্তব জীবনবিধানের সমষ্টি। রুট বিশ্লেষণ ও কোর মিনিং রূপরেখা।",
    "excerpt_en": "Surah Al-Fatihah (1:6) 'Guide us to the Straight Path' decoded into 99 actionable, ethical, cognitive, and societal principles across the Holy Quran. Root analysis and core meaning framework.",
    "published": true,
    "published_at": "2026-09-03T21:15:00.000Z",
    "created_at": "2026-09-03T21:15:00.000Z",
    "updated_at": "2026-09-03T21:15:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "সিরাতুল মুস্তাক্বীম",
      "কোর মিনিং",
      "আল-ফাতিহা ১:৬",
      "বাস্তব জীবনবিধান",
      "আলম এম.",
      "বিজ্ঞানভিত্তিক",
      "Sirat al-Mustaqeem",
      "4:82 Consistency"
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
    }
  },
  {
    "id": "art-jinn-iblis-shaytan-malaikah-fantasy-or-cosmic-energy-states",
    "slug": "jinn-iblis-shaytan-malaikah-fantasy-or-cosmic-energy-states",
    "title_bn": "জ্বীন, ইবলিস, শয়তান, মালাইকা — রূপকথার ফ্যান্টাসি? (৪:৮২ লজিক্যাল কনসিস্টেন্সি ও রুট বিশ্লেষণ)",
    "title_en": "Jinn, Iblis, Shaytan, Malaikah: Fairy-Tale Fantasy or Cosmic Energy States? (Surah 4:82 Root Analysis)",
    "excerpt_bn": "আমরা যদি জ্বীন, ইবলিস, শয়তান, মালাইকা পরিভাষাগুলোকে প্রচলিত রূপকথার ফ্যান্টাসি হিসেবে ধরে রাখি, তবে সিস্টেমের অন্যান্য আয়াতের সাথে লজিক্যাল কোলাপ্স ঘটবেই এবং ৪:৮২ ফিল্টারের লঙ্ঘন হবে। ৪-স্তরের শব্দতাত্ত্বিক মেকানিজম ও বিজ্ঞানভিত্তিক কোর-অ্যানালিসিস।",
    "excerpt_en": "Decoding Jinn, Iblis, Shaytan, and Malaikah beyond fairy-tale tropes into bio-electric energy spectrums, cognitive deadlocks, malware protocols, and invariant universal laws under Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T16:15:00.000Z",
    "created_at": "2026-09-03T16:15:00.000Z",
    "updated_at": "2026-09-03T16:15:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "জ্বীন ও ইনসান",
      "ইবলিস ও শয়তান",
      "মালাইকা",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি",
      "বিজ্ঞানভিত্তিক",
      "আলম এম.",
      "কসমিক ওওএস",
      "Bio-Electric Spectrum"
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
    }
  },
  {
    "id": "art-quranic-waw-cosmic-witness-not-human-oath",
    "slug": "quranic-waw-cosmic-witness-not-human-oath",
    "title_bn": "কুরআনে 'ওয়াও' (وَ): স্রষ্টার শপথ বনাম মহাজাগতিক সাক্ষ্য ও প্রমাণ (৪:৮২ লজিক্যাল কনসিস্টেন্সি)",
    "title_en": "The Quranic Particle 'Waw' (وَ): Divine Oath vs. Cosmic Witness & Evidentiary Proofs (Under Surah 4:82)",
    "excerpt_bn": "পরম স্রষ্টা কি তাঁর নিজের নশ্বর সৃষ্টির শপথ করতে পারেন? নাকি এটি মহাজাগতিক বাস্তব সাক্ষ্য ও একত্ববাদের অকাট্য প্রমাণের উপস্থাপন? সূরা আন-নিসা (৪:৮২)-এর ফিল্টারে ঐতিহ্যগত অনুবাদ বিভ্রাটের সমাধান ও বিজ্ঞানভিত্তিক নতুন দিগন্ত।",
    "excerpt_en": "Can the Self-Sufficient Creator swear human-style oaths by His own mortal creation? Or does the Arabic particle 'Waw' function as an evidentiary citation of cosmic laws? Resolving traditional translation dilemmas through Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T15:50:00.000Z",
    "created_at": "2026-09-03T15:50:00.000Z",
    "updated_at": "2026-09-03T15:50:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "মহাজাগতিক সাক্ষ্য",
      "শপথ বনাম সাক্ষ্য",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি",
      "বিজ্ঞানভিত্তিক",
      "আলম এম.",
      "Cosmic Witness",
      "Divine Evidentiary Anchors"
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
    }
  },
  {
    "id": "art-quranic-terms-conventional-vs-modern-scientific-meanings",
    "slug": "quranic-terms-conventional-vs-modern-scientific-meanings",
    "title_bn": "কুরআনিক পরিভাষাকোষ: প্রচলিত অর্থ বনাম আধুনিক বিজ্ঞানভিত্তিক অর্থ (৪:৮২ লজিক্যাল সামঞ্জস্য নির্দেশিকা)",
    "title_en": "Quranic Lexicon: Conventional Meanings vs Modern Scientific Concepts (Verse 4:82 Consistency Guide)",
    "excerpt_bn": "জ্বীন, ইনসান, মালাইকা, শয়তান, ইবলিস, আরশ, কুরসী, কিতাব, কলম, আকাশ, জমিন, পাহাড়, নূর, অন্ধকার ও রূহ — প্রচলিত রূপকথার ফ্যান্টাসি থেকে মুক্ত হয়ে কীভাবে এই শব্দগুলো মহাজাগতিক বিজ্ঞান ও ৪:৮২ ফিল্টারে নিখুঁত ও বাস্তব অর্থ প্রকাশ করে।",
    "excerpt_en": "Decoding core Quranic terminology — Jinn, Insan, Malaikah, Shaytan, Iblis, Arsh, Kursi, Kitab, Qalam, Samawat, Ard, Jibal, Noor, Dhulumaat, and Rooh — from fairy-tale tropes into rigorous scientific frameworks under Surah 4:82.",
    "published": true,
    "published_at": "2026-09-03T08:15:00.000Z",
    "created_at": "2026-09-03T08:15:00.000Z",
    "updated_at": "2026-09-03T08:15:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
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
    }
  },
  {
    "id": "art-surah-al-fatihah-1-the-opening-protocol",
    "slug": "sura-al-fatihah-1-the-opening-protocol",
    "title_bn": "সূরা আল-ফাতিহা (১): মহাজাগতিক সিস্টেমের দ্য ওপেনিং প্রটোকল ও কমিউনিকেশন ফ্রেমওয়ার্ক",
    "title_en": "Surah Al-Fatihah (1): The Cosmic Opening Protocol & Systemic Communication Framework",
    "excerpt_bn": "সূরা আল-ফাতিহা মহাজাগতিক সিস্টেমের Root Directory Authentication, Attribute Signal Broadcast, Data-compassionate Declaration, Final Phase System Admin, Full Synchronization Protocol, Optimized Pathway Request ও Data-blessing Stream Allocation উপস্থাপন করে।",
    "excerpt_en": "Surah Al-Fatihah decodes the Master Opening Protocol: Root Directory Authentication, Attribute Signal Broadcast, Global Data-Compassion, Final Phase System Admin, and Optimized Pathway Routing.",
    "published": true,
    "published_at": "2026-08-31T22:25:00.000Z",
    "created_at": "2026-08-31T22:25:00.000Z",
    "updated_at": "2026-08-31T22:25:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "সূরা আল-ফাতিহা",
      "বিজ্ঞানভিত্তিক",
      "কসমিক ওএস",
      "Root Directory",
      "The Opening Protocol",
      "৪:৮২ লজিক্যাল কনসিস্টেন্সি",
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
    }
  },
  {
    "id": "art-bigganbhittik-quranic-onubade-shobder-proyog-o-porimitibodh",
    "slug": "bigganbhittik-quranic-onubade-shobder-proyog-o-porimitibodh",
    "title_bn": "বিজ্ঞানভিত্তিক কুরআনিক অনুবাদে শব্দের প্রয়োগ ও পরিমিতিবোধ: আক্ষরিক বনাম তাত্ত্বিক বোঝাপড়া",
    "title_en": "Word Application & Balance in Scientific Quranic Translation: Literal vs Expository Understanding",
    "excerpt_bn": "বিজ্ঞানভিত্তিক অনুবাদে অতিরিক্ত শব্দ প্রয়োগের ঝুঁকি, শব্দানুবাদ বনাম তাত্ত্বিক অনুবাদের পার্থক্য এবং ৪:৮২ ফিল্টারের অধীনে কঠোর আকিদাগত ও ভাষাগত ভারসাম্য রক্ষার মেথডোলজি।",
    "excerpt_en": "The risk of verbosity in scientific translations, literal vs expository translation paradigms, and safeguarding the 4:82 consistency filter with theological rigor.",
    "published": true,
    "published_at": "2026-09-03T00:30:00.000Z",
    "created_at": "2026-09-03T00:30:00.000Z",
    "updated_at": "2026-09-03T00:30:00.000Z",
    "author_id": "38aa28c8-3535-4a1b-ba06-3d1e2792a9c1",
    "category_id": "7f3d2a1b-4c5e-4689-a012-3456789abcde",
    "tags": [
      "বিজ্ঞানভিত্তিক",
      "কুরআন গবেষণা",
      "অনুবাদ তত্ত্ব",
      "৪:৮২ ফিল্টার",
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
    }
  }
];
