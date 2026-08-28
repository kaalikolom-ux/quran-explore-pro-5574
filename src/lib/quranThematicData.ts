// src/lib/quranThematicData.ts
export interface ThematicTopic {
  id: string;
  title_bn: string;
  title_en: string;
  category_bn: string;
  category_en: string;
  description_bn: string;
  description_en: string;
  icon: string;
  keywords: string[];
  references: {
    surah: number;
    surah_name_bn: string;
    surah_name_en: string;
    ayahs: number[];
    ayah_range: string;
    highlight_text_bn?: string;
  }[];
}

export const QURAN_THEMATIC_DATABASE: ThematicTopic[] = [
  // ১. বিজ্ঞান ও সৃষ্টিতত্ত্ব (Science, Astronomy & Biology)
  {
    id: "universe-expansion",
    title_bn: "মহাবিশ্ব সম্প্রসারণ (Expanding Universe)",
    title_en: "Expanding Universe & Cosmology",
    category_bn: "বিজ্ঞান ও সৃষ্টিতত্ত্ব",
    category_en: "Science & Cosmology",
    description_bn: "মহাবিশ্ব যে প্রতিনিয়ত সম্প্রসারিত হচ্ছে সে সম্পর্কে কুরআনের বৈজ্ঞানিক নিদর্শন।",
    description_en: "Scientific Quranic verses about the continuous expansion of the universe.",
    icon: "Sparkles",
    keywords: ["মহাবিশ্ব", "সম্প্রসারণ", "আকাশ", "সৃষ্টি", "universe", "expanding", "expansion", "cosmology", "space", "sky", "science", "বিজ্ঞান"],
    references: [
      {
        surah: 51,
        surah_name_bn: "আজ-যারিয়াত",
        surah_name_en: "Adh-Dhariyat",
        ayahs: [47],
        ayah_range: "৫১:৪৭",
        highlight_text_bn: "আমি নিজ শক্তিবলে আকাশ সৃষ্টি করেছি এবং নিশ্চয়ই আমিই একে প্রতিনিয়ত সম্প্রসারিত করছি।"
      }
    ]
  },
  {
    id: "big-bang-creation",
    title_bn: "বিগ ব্যাং ও সৃষ্টিতত্ত্ব (Big Bang & Origins)",
    title_en: "The Big Bang & Origins of Life",
    category_bn: "বিজ্ঞান ও সৃষ্টিতত্ত্ব",
    category_en: "Science & Cosmology",
    description_bn: "আসমান ও জমিনের একত্রিত অবস্থা থেকে বিস্ফোরণ এবং পানি থেকে সমস্ত প্রাণের সৃষ্টি।",
    description_en: "The heavens and the earth joined together, split apart, and life created from water.",
    icon: "Sparkles",
    keywords: ["বিগ ব্যাং", "সৃষ্টিতত্ত্ব", "পানি", "প্রাণ", "আসমান জমিন", "big bang", "creation", "origins", "water", "life", "physics", "বিজ্ঞান"],
    references: [
      {
        surah: 21,
        surah_name_bn: "আল-আম্বিয়া",
        surah_name_en: "Al-Anbiya",
        ayahs: [30],
        ayah_range: "২১:৩০",
        highlight_text_bn: "কাফেররা কি দেখে না যে আসমান ও জমিন ওতপ্রোতভাবে মিশে ছিল, অতঃপর আমি উভয়কে পৃথক করে দিলাম এবং প্রাণবান সবকিছু পানি থেকে সৃষ্টি করলাম?"
      }
    ]
  },
  {
    id: "embryology-human-development",
    title_bn: "ভ্রূণতত্ত্ব ও মানব সৃষ্টি (Embryology)",
    title_en: "Human Embryology & Biology",
    category_bn: "বিজ্ঞান ও সৃষ্টিতত্ত্ব",
    category_en: "Science & Biology",
    description_bn: "মায়ের গর্ভে পর্যায়ক্রমে মানব ভ্রূণ বিকাশের নিখুঁত বিবরণ।",
    description_en: "Precise biological stages of human embryonic development in the womb.",
    icon: "HeartPulse",
    keywords: ["ভ্রূণ", "মানব সৃষ্টি", "গর্ভ", "শুক্রবিন্দু", "রক্তপিণ্ড", "হাড্ডি মাংস", "embryology", "embryo", "human development", "biology", "fetus", "bio", "biology"],
    references: [
      {
        surah: 23,
        surah_name_bn: "আল-মুমিনুন",
        surah_name_en: "Al-Mu'minun",
        ayahs: [12, 13, 14],
        ayah_range: "২৩:১২-১৪",
        highlight_text_bn: "আমি মানুষকে মাটির নির্যাস থেকে সৃষ্টি করেছি, অতঃপর শুক্রবিন্দু, জমাট রক্ত, মাংসপিণ্ড এবং হাড়ে রূপান্তর করে মাংস দ্বারা ঢেকে দিয়েছি।"
      },
      {
        surah: 96,
        surah_name_bn: "আল-আলাক",
        surah_name_en: "Al-Alaq",
        ayahs: [1, 2],
        ayah_range: "৯৬:১-২",
        highlight_text_bn: "পাঠ করুন আপনার পালনকর্তার নামে যিনি সৃষ্টি করেছেন জমাট রক্তপিণ্ড (আলাক) থেকে।"
      }
    ]
  },
  {
    id: "mountains-pegs-geology",
    title_bn: "পর্বতের ভূমিকা ও ভূতত্ত্ব (Mountains as Pegs)",
    title_en: "Geology & Mountains as Stabilizers",
    category_bn: "বিজ্ঞান ও সৃষ্টিতত্ত্ব",
    category_en: "Science & Geology",
    description_bn: "পৃথিবীর ভূত্বককে স্থিতিশীল রাখতে পেরেকের মতো পর্বতের গভীর শিকড় ও ভূমিকা।",
    description_en: "Mountains acting as stabilizing pegs to prevent the shaking of Earth's crust.",
    icon: "Mountain",
    keywords: ["পাহাড়", "পর্বত", "ভূতত্ত্ব", "পেরেক", "ভূমিকম্প", "mountains", "pegs", "geology", "earth", "tectonics", "earthquake", "ভূতত্ত্ব"],
    references: [
      {
        surah: 78,
        surah_name_bn: "আন-নাবা",
        surah_name_en: "An-Naba",
        ayahs: [6, 7],
        ayah_range: "৭৮:৬-৭",
        highlight_text_bn: "আমি কি জমিনকে বিছানা এবং পর্বতমালাকে পেরেকরূপে স্থাপন করিনি?"
      },
      {
        surah: 21,
        surah_name_bn: "আল-আম্বিয়া",
        surah_name_en: "Al-Anbiya",
        ayahs: [31],
        ayah_range: "২১:৩১",
        highlight_text_bn: "আমি পৃথিবীতে ভারী পর্বতমালা স্থাপন করেছি যাতে তা মানুষকে নিয়ে হেলে না পড়ে।"
      }
    ]
  },
  {
    id: "seas-barrier-oceanography",
    title_bn: "সমুদ্রের অদৃশ্য প্রাচীর (Barrier between Oceans)",
    title_en: "Oceanography & Marine Barriers",
    category_bn: "বিজ্ঞান ও সৃষ্টিতত্ত্ব",
    category_en: "Science & Oceanography",
    description_bn: "মিষ্টি ও নোনা পানির এবং দুই সমুদ্রের মিলনস্থলে অদৃশ্য ঘনত্বের প্রাচীর।",
    description_en: "The invisible barrier between meeting seas preventing them from transgressing.",
    icon: "Waves",
    keywords: ["সমুদ্র", "সাগর", "নদী", "পানি", "প্রাচীর", "নোনা পানি", "ocean", "sea", "barrier", "marine", "oceanography", "water", "density"],
    references: [
      {
        surah: 55,
        surah_name_bn: "আর-রাহমান",
        surah_name_en: "Ar-Rahman",
        ayahs: [19, 20],
        ayah_range: "৫৫:১৯-২০",
        highlight_text_bn: "তিনি পাশাপাশি দুই সাগর প্রবাহিত করেছেন, উভয়ের মাঝে রয়েছে এক অন্তরাল যা তারা অতিক্রম করে না।"
      },
      {
        surah: 25,
        surah_name_bn: "আল-ফুরকান",
        surah_name_en: "Al-Furqan",
        ayahs: [53],
        ayah_range: "২৫:৫৩",
        highlight_text_bn: "তিনিই দুই দরিয়াকে একসাথে মিলিত করেছেন—একটি সুমিষ্ট তৃষ্ণানিবারক, অন্যটি নোনা বিস্বাদ; এবং মাঝে রেখেছেন এক পর্দা।"
      }
    ]
  },
  {
    id: "iron-sent-down",
    title_bn: "লোহার উৎপত্তি ও মহাজাগতিক অবতরণ (Iron Origin)",
    title_en: "Origin of Iron & Astronomy",
    category_bn: "বিজ্ঞান ও সৃষ্টিতত্ত্ব",
    category_en: "Science & Astronomy",
    description_bn: "লোহা পৃথিবীতে তৈরি হয়নি বরং মহাকাশ থেকে সুপারনোভার মাধ্যমে নাযিল বা প্রেরিত হয়েছে।",
    description_en: "Iron was sent down from space with great power and immense human benefit.",
    icon: "Shield",
    keywords: ["লোহা", "হাদিদ", "মহাকাশ", "ধাতু", "iron", "hadid", "supernova", "astronomy", "element", "metal"],
    references: [
      {
        surah: 57,
        surah_name_bn: "আল-হাদিদ",
        surah_name_en: "Al-Hadid",
        ayahs: [25],
        ayah_range: "৫৭:২৫",
        highlight_text_bn: "এবং আমি লোহা অবতীর্ণ করেছি যাতে রয়েছে প্রচণ্ড শক্তি এবং মানুষের বহুবিধ কল্যাণ।"
      }
    ]
  },
  {
    id: "orbits-sun-moon",
    title_bn: "সূর্য ও চাঁদের নিজস্ব কক্ষপথ (Celestial Orbits)",
    title_en: "Solar & Lunar Orbits in Astronomy",
    category_bn: "বিজ্ঞান ও সৃষ্টিতত্ত্ব",
    category_en: "Science & Astronomy",
    description_bn: "সূর্য ও চন্দ্র প্রত্যেকে নিজ নিজ নির্ধারিত কক্ষপথে সন্তরণ করছে।",
    description_en: "The sun and the moon each floating in its own determined orbit.",
    icon: "Sun",
    keywords: ["সূর্য", "চাঁদ", "কক্ষপথ", "চন্দ্র", "রাত্রি", "দিন", "sun", "moon", "orbit", "celestial", "astronomy", "planets"],
    references: [
      {
        surah: 21,
        surah_name_bn: "আল-আম্বিয়া",
        surah_name_en: "Al-Anbiya",
        ayahs: [33],
        ayah_range: "২১:৩৩",
        highlight_text_bn: "তিনিই সৃষ্টি করেছেন রাত ও দিন এবং সূর্য ও চাঁদ; প্রত্যেকেই নিজ নিজ কক্ষপথে বিচরণ করছে।"
      },
      {
        surah: 36,
        surah_name_bn: "ইয়াসিন",
        surah_name_en: "Ya-Sin",
        ayahs: [38, 39, 40],
        ayah_range: "৩৬:৩৮-৪০",
        highlight_text_bn: "সূর্য তার নির্দিষ্ট গন্তব্যের দিকে ছুটে চলে... আর চন্দ্রের জন্য আমি নির্ধারণ করেছি বিভিন্ন মনযিল।"
      }
    ]
  },

  // ২. পরিবার, সমাজ ও নৈতিকতা (Family, Social Ethics & Manners)
  {
    id: "parents-kindness",
    title_bn: "পিতা-মাতার প্রতি সদাচার ও অধিকার (Honoring Parents)",
    title_en: "Kindness & Rights of Parents",
    category_bn: "পরিবার ও সমাজ",
    category_en: "Family & Social Ethics",
    description_bn: "পিতা-মাতার সাথে সর্বোত্তম ব্যবহার, বার্ধক্যে সেবা এবং তাদের জন্য দুআ করার নির্দেশ।",
    description_en: "Commandments on treating parents with utmost kindness, respect and prayers in old age.",
    icon: "Heart",
    keywords: ["পিতা মাতা", "মা বাবা", "মা", "বাবা", "পিতামাতা", "পিতামাতার হক", "উফ না বলা", "parents", "mother", "father", "kindness", "family", "respect", "honoring parents"],
    references: [
      {
        surah: 17,
        surah_name_bn: "বনী ইসরাঈল",
        surah_name_en: "Al-Isra",
        ayahs: [23, 24],
        ayah_range: "১৭:২৩-২৪",
        highlight_text_bn: "তোমার প্রতিপালক আদেশ দিয়েছেন... পিতা-মাতার সাথে সদ্ব্যবহার কর। তাদের একজন বা উভয়ে বার্ধক্যে উপনীত হলে তাদের 'উফ' বলো না এবং তাদের জন্য রহমতের ডানা বিছিয়ে দাও।"
      },
      {
        surah: 31,
        surah_name_bn: "লুকমান",
        surah_name_en: "Luqman",
        ayahs: [14],
        ayah_range: "৩১:১৪",
        highlight_text_bn: "আমি মানুষকে তার পিতা-মাতার ব্যাপারে নির্দেশ দিয়েছি; তার মা কষ্টের পর কষ্ট সহ্য করে তাকে গর্ভে ধারণ করেছে।"
      },
      {
        surah: 46,
        surah_name_bn: "আল-আহকাফ",
        surah_name_en: "Al-Ahqaf",
        ayahs: [15],
        ayah_range: "৪৬:১৫",
        highlight_text_bn: "এবং আমি মানুষকে নির্দেশ দিয়েছি পিতা-মাতার প্রতি সদাচার করতে..."
      }
    ]
  },
  {
    id: "marriage-family-harmony",
    title_bn: "বিবাহ, দাম্পত্য ভালোবাসা ও পরিবার (Marriage & Spouse)",
    title_en: "Marriage, Peace & Marital Rights",
    category_bn: "পরিবার ও সমাজ",
    category_en: "Family & Social Ethics",
    description_bn: "স্বামী-স্ত্রীর মাঝে প্রশান্তি, পারস্পরিক ভালোবাসা ও মায়ার বন্ধন সৃষ্টি।",
    description_en: "Spouses as a source of tranquility, love, mercy, and mutual marital harmony.",
    icon: "HeartHandshake",
    keywords: ["বিয়ে", "বিবাহ", "স্ত্রী", "স্বামী", "দাম্পত্য", "পরিবার", "ভালোবাসা", "marriage", "spouse", "wife", "husband", "family", "love", "mercy", "nikah"],
    references: [
      {
        surah: 30,
        surah_name_bn: "আর-রুম",
        surah_name_en: "Ar-Rum",
        ayahs: [21],
        ayah_range: "৩০:২১",
        highlight_text_bn: "তাঁর অন্যতম নিদর্শন এই যে, তিনি তোমাদের মধ্য থেকে তোমাদের সঙ্গিনী সৃষ্টি করেছেন যাতে তোমরা তাদের নিকট প্রশান্তি পাও এবং তোমাদের মাঝে ভালোবাসা ও দয়া সৃষ্টি করেছেন।"
      },
      {
        surah: 4,
        surah_name_bn: "আন-নিসা",
        surah_name_en: "An-Nisa",
        ayahs: [19],
        ayah_range: "৪:১৯",
        highlight_text_bn: "তোমরা স্ত্রীদের সাথে সুন্দর ও সম্মানজনকভাবে জীবনযাপন কর।"
      }
    ]
  },
  {
    id: "orphans-charity",
    title_bn: "এতিম ও অসহায়ের অধিকার (Orphans & Underprivileged)",
    title_en: "Care for Orphans & The Needy",
    category_bn: "পরিবার ও সমাজ",
    category_en: "Family & Social Ethics",
    description_bn: "এতিমের সম্পদ রক্ষা, অসহায়কে সহায়তা এবং দুর্ব্যবহারের কঠোর নিষেধ।",
    description_en: "Strict protection of orphans' property and helping the poor and needy.",
    icon: "Users",
    keywords: ["এতিম", "অসহায়", "গরীব", "মিসকিন", "অনাথ", "দান", "orphans", "needy", "poor", "miskeen", "charity", "justice"],
    references: [
      {
        surah: 4,
        surah_name_bn: "আন-নিসা",
        surah_name_en: "An-Nisa",
        ayahs: [2, 10],
        ayah_range: "৪:২, ১০",
        highlight_text_bn: "এতিমদের তাদের ধন-সম্পদ সমর্পণ কর... যারা অন্যায়ভাবে এতিমদের সম্পদ গ্রাস করে, তারা তাদের পেটে আগুনই ভর্তি করে।"
      },
      {
        surah: 93,
        surah_name_bn: "আদ-দুহা",
        surah_name_en: "Ad-Duha",
        ayahs: [9, 10],
        ayah_range: "৯৩:৯-১০",
        highlight_text_bn: "অতএব আপনি এতিমের প্রতি কঠোর হবেন না এবং সাহায্যপ্রার্থীকে ধমক দেবেন না।"
      },
      {
        surah: 107,
        surah_name_bn: "আল-মাউন",
        surah_name_en: "Al-Ma'un",
        ayahs: [1, 2, 3],
        ayah_range: "১০৭:১-৩",
        highlight_text_bn: "আপনি কি দেখেছেন তাকে যে বিচার দিবসকে অস্বীকার করে? সে তো এতিমকে তাড়িয়ে দেয় এবং মিসকিনকে অন্নদানে উৎসাহিত করে না।"
      }
    ]
  },
  {
    id: "truthfulness-justice-backbiting",
    title_bn: "গীবত ও মিথ্যা অপবাদের কুফল (No Backbiting & Gossip)",
    title_en: "Prohibition of Backbiting, Slander & Suspicion",
    category_bn: "পরিবার ও সমাজ",
    category_en: "Ethics & Morals",
    description_bn: "গীবত করাকে মৃত ভাইয়ের মাংস খাওয়ার সাথে তুলনা এবং অনুমানের বশবর্তী হওয়া নিষেধ।",
    description_en: "Backbiting compared to eating the flesh of a dead brother; prohibition of suspicion.",
    icon: "MessageSquareOff",
    keywords: ["গীবত", "পরনিন্দা", "মিথ্যা", "অপবাদ", "সন্দেহ", "কুৎসা", "backbiting", "gossip", "slander", "suspicion", "lies", "morals", "ethics"],
    references: [
      {
        surah: 49,
        surah_name_bn: "আল-হুজুরাত",
        surah_name_en: "Al-Hujurat",
        ayahs: [12],
        ayah_range: "৪৯:১২",
        highlight_text_bn: "হে মুমিনগণ! তোমরা অধিকাংশ অনুমান থেকে দূরে থাক... এবং একে অপরের গীবত করো না; তোমাদের কেউ কি তার মৃত ভাইয়ের গোশত খাওয়া পছন্দ করবে?"
      },
      {
        surah: 104,
        surah_name_bn: "আল-হুমাযাহ",
        surah_name_en: "Al-Humazah",
        ayahs: [1],
        ayah_range: "১০৪:১",
        highlight_text_bn: "ধ্বংস প্রত্যেক এমন ব্যক্তির জন্য যে পশ্চাতে ও সম্মুখে মানুষের কুৎসা রটায় ও দোষ খুঁজে বেড়ায়।"
      }
    ]
  },

  // ৩. অর্থনীতি, ব্যবসা ও সামাজিক ইনসাফ (Economics, Trade & Justice)
  {
    id: "business-trade-vs-usury",
    title_bn: "হালাল ব্যবসা বনাম সুদের নিষেধাজ্ঞা (Trade vs Riba)",
    title_en: "Halal Trade & Prohibition of Usury (Riba)",
    category_bn: "অর্থনীতি ও আইন",
    category_en: "Economics & Law",
    description_bn: "ব্যবসাকে হালাল এবং সুদের লেনদেনকে চিরতরে হারাম ঘোষণা।",
    description_en: "Allah has permitted trade and forbidden usury (Riba).",
    icon: "Coins",
    keywords: ["সুদ", "ব্যবসা", "বাণিজ্য", "হালাল", "হারাম", "রিবা", "লেনদেন", "riba", "usury", "interest", "trade", "business", "halal", "finance", "economics"],
    references: [
      {
        surah: 2,
        surah_name_bn: "আল-বাকারাহ",
        surah_name_en: "Al-Baqarah",
        ayahs: [275, 276, 278, 279],
        ayah_range: "২:২৭৫-২৭৯",
        highlight_text_bn: "আল্লাহ ব্যবসাকে হালাল করেছেন এবং সুদকে হারাম করেছেন... হে মুমিনগণ! সুদ পরিহার কর, যদি তা না কর তবে আল্লাহ ও তাঁর রাসূলের বিরুদ্ধে যুদ্ধের ঘোষণা জেনে নাও।"
      },
      {
        surah: 3,
        surah_name_bn: "আলে ইমরান",
        surah_name_en: "Ali 'Imran",
        ayahs: [130],
        ayah_range: "৩:১৩০",
        highlight_text_bn: "হে ঈমানদারগণ! তোমরা চক্রবৃদ্ধি হারে সুদ খেও না।"
      }
    ]
  },
  {
    id: "debt-contracts-writing",
    title_bn: "ঋণ, চুক্তি ও লিখিত দলিলের বিধান (Contracts & Debt)",
    title_en: "Debt Regulations, Written Contracts & Witnesses",
    category_bn: "অর্থনীতি ও আইন",
    category_en: "Economics & Law",
    description_bn: "কুরআনের দীর্ঘতম আয়াত (আয়াতুল মুদায়ানাহ)—আর্থিক লেনদেন ও ঋণ লিখে রাখার নিয়ম।",
    description_en: "The longest verse in the Quran detailing financial agreements, debts, and witnesses.",
    icon: "FileText",
    keywords: ["ঋণ", "চুক্তি", "দলিল", "সাক্ষী", "আমানত", "debt", "contracts", "writing", "witness", "longest verse", "2:282", "finance"],
    references: [
      {
        surah: 2,
        surah_name_bn: "আল-বাকারাহ",
        surah_name_en: "Al-Baqarah",
        ayahs: [282],
        ayah_range: "২:২৮২",
        highlight_text_bn: "হে মুমিনগণ! যখন তোমরা নির্দিষ্ট মেয়াদের জন্য ঋণের লেনদেন কর, তখন তা লিখে রাখ..."
      }
    ]
  },
  {
    id: "zakat-charity-sadaqah",
    title_bn: "যাকাত, সদকা ও দানের ফজিলত (Zakat & Charity)",
    title_en: "Zakat, Charity & Virtues of Spending",
    category_bn: "অর্থনীতি ও ইবাদত",
    category_en: "Economics & Worship",
    description_bn: "যাকাতের ৮টি খাত এবং আল্লাহর পথে ব্যয়ের অফুরন্ত প্রতিদান।",
    description_en: "The 8 recipients of Zakat and immense rewards of spending in the way of Allah.",
    icon: "HandCoins",
    keywords: ["যাকাত", "সদকা", "দান", "ইনফাক", "যাকাতের খাত", "দরিদ্র", "zakat", "charity", "sadaqah", "giving", "wealth", "spending"],
    references: [
      {
        surah: 2,
        surah_name_bn: "আল-বাকারাহ",
        surah_name_en: "Al-Baqarah",
        ayahs: [261, 267],
        ayah_range: "২:২৬১, ২৬৭",
        highlight_text_bn: "যারা আল্লাহর পথে নিজেদের ধন-সম্পদ ব্যয় করে, তাদের দৃষ্টান্ত একটি বীজের মতো যা সাতটি শীষ উৎপন্ন করে, প্রতিটি শীষে একশত শস্যদানা থাকে।"
      },
      {
        surah: 9,
        surah_name_bn: "আত-তাওবাহ",
        surah_name_en: "At-Tawbah",
        ayahs: [60],
        ayah_range: "৯:৬০",
        highlight_text_bn: "যাকাত কেবল দরিদ্র, মিসকিন, যাকাত আদায়ে নিযুক্ত কর্মচারী এবং যাদের অন্তর জয় করা উদ্দেশ্য..."
      }
    ]
  },

  // ৪. মানসিক প্রশান্তি, ধৈর্য ও বিপদাপদ (Patience, Inner Peace & Trials)
  {
    id: "patience-trials-ease",
    title_bn: "ধৈর্য, পরীক্ষা ও কষ্টের পর স্বস্তি (Patience & Ease)",
    title_en: "Patience in Trials & Relief After Hardship",
    category_bn: "আত্মশুদ্ধি ও সান্ত্বনা",
    category_en: "Spirituality & Comfort",
    description_bn: "জীবনের পরীক্ষাগুলোতে সবর করা এবং নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।",
    description_en: "Steadfast patience in adversity, with the divine promise that with hardship comes ease.",
    icon: "ShieldAlert",
    keywords: ["ধৈর্য", "সবর", "পরীক্ষা", "কষ্ট", "স্বস্তি", "বিপদ", "patience", "sabr", "hardship", "ease", "trials", "mental peace", "anxiety", "depression"],
    references: [
      {
        surah: 2,
        surah_name_bn: "আল-বাকারাহ",
        surah_name_en: "Al-Baqarah",
        ayahs: [153, 155, 156],
        ayah_range: "২:১৫৩, ১৫৫-১৫৬",
        highlight_text_bn: "হে মুমিনগণ! ধৈর্য ও সালাতের মাধ্যমে সাহায্য চাও; নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন... যারা বিপদে পড়লে বলে: ইন্না লিল্লাহি ওয়া ইন্না ইলাইহি রাজিউন।"
      },
      {
        surah: 94,
        surah_name_bn: "আল-ইনশিরাহ",
        surah_name_en: "Ash-Sharh",
        ayahs: [5, 6],
        ayah_range: "৯৪:৫-৬",
        highlight_text_bn: "নিশ্চয়ই কষ্টের সাথে স্বস্তি রয়েছে; নিঃসন্দেহে কষ্টের সাথেই স্বস্তি রয়েছে।"
      }
    ]
  },
  {
    id: "remembrance-inner-peace",
    title_bn: "আল্লাহর স্মরণে অন্তরের প্রশান্তি (Peace in Dhikr)",
    title_en: "Inner Peace through Remembrance of Allah (Dhikr)",
    category_bn: "আত্মশুদ্ধি ও সান্ত্বনা",
    category_en: "Spirituality & Comfort",
    description_bn: "কেবলমাত্র আল্লাহর স্মরণের মাধ্যমেই মানুষের অস্থির অন্তর পরম শান্তি লাভ করে।",
    description_en: "Only in the remembrance of Allah do troubled hearts find ultimate peace.",
    icon: "Smile",
    keywords: ["শান্তি", "প্রশান্তি", "জিকির", "স্মরণ", "অন্তর", "মন", "হৃদয়", "peace", "tranquility", "dhikr", "remembrance", "heart", "serenity"],
    references: [
      {
        surah: 13,
        surah_name_bn: "আর-রাদ",
        surah_name_en: "Ar-Ra'd",
        ayahs: [28],
        ayah_range: "১৩:২৮",
        highlight_text_bn: "যারা ঈমান এনেছে এবং যাদের অন্তর আল্লাহর স্মরণে প্রশান্ত হয়; জেনে রাখ, আল্লাহর স্মরণেই কেবল অন্তরসমূহ শান্তি পায়।"
      }
    ]
  },
  {
    id: "never-despair-mercy",
    title_bn: "আল্লাহর রহমত থেকে নিরাশ না হওয়া (Never Despair)",
    title_en: "Never Despair of Allah's Infinite Mercy",
    category_bn: "আত্মশুদ্ধি ও সান্ত্বনা",
    category_en: "Spirituality & Forgiveness",
    description_bn: "যত বড় পাপই হোক না কেন, আল্লাহর অসীম ক্ষমা ও রহমতের হাত সর্বদা উন্মুক্ত।",
    description_en: "The greatest assurance of hope: Allah forgives all sins for those who repent.",
    icon: "SunMedium",
    keywords: ["রহমত", "ক্ষমা", "তওবা", "নিরাশ", "আশা", "পাপ", "গুনাহ", "mercy", "forgiveness", "tawbah", "hope", "despair", "repentance"],
    references: [
      {
        surah: 39,
        surah_name_bn: "আজ-জুমার",
        surah_name_en: "Az-Zumar",
        ayahs: [53],
        ayah_range: "৩৯:৫৩",
        highlight_text_bn: "বলুন: হে আমার বান্দাগণ যারা নিজেদের ওপর অবিচার করেছ! তোমরা আল্লাহর রহমত থেকে নিরাশ হয়ো না; নিশ্চয়ই আল্লাহ সমস্ত পাপ ক্ষমা করে দেন।"
      },
      {
        surah: 12,
        surah_name_bn: "ইউসুফ",
        surah_name_en: "Yusuf",
        ayahs: [87],
        ayah_range: "১২:৮৭",
        highlight_text_bn: "আল্লাহর রহমত থেকে নিরাশ হয়ো না; কাফের সম্প্রদায় ছাড়া কেউ আল্লাহর রহমত থেকে নিরাশ হয় না।"
      }
    ]
  },

  // ৫. ইবাদত ও বিধিবিধান (Worship & Core Commandments)
  {
    id: "salah-prayer-establishment",
    title_bn: "নামাজ / সালাত কায়েম ও গুরুত্ব (Salah / Prayer)",
    title_en: "Establishment & Importance of Salah (Prayer)",
    category_bn: "ইবাদত ও বিধিবিধান",
    category_en: "Worship & Rulings",
    description_bn: "সময়ানুযায়ী সালাত আদায় এবং সালাত কীভাবে অশ্লীল ও অন্যায় কাজ থেকে বিরত রাখে।",
    description_en: "Performing prayer at prescribed times and how prayer prevents immorality and wrongdoing.",
    icon: "Clock",
    keywords: ["নামাজ", "সালাত", "নামায", "প্রার্থনা", "সেজদা", "রুকু", "salah", "salat", "prayer", "worship", "sujood", "fajr", "namaz"],
    references: [
      {
        surah: 29,
        surah_name_bn: "আল-আনকাবুত",
        surah_name_en: "Al-'Ankabut",
        ayahs: [45],
        ayah_range: "২৯:৪৫",
        highlight_text_bn: "সালাত কায়েম করুন; নিশ্চয়ই সালাত অশ্লীল ও অন্যায় কাজ থেকে বিরত রাখে এবং আল্লাহর স্মরণই সর্বশ্রেষ্ঠ।"
      },
      {
        surah: 4,
        surah_name_bn: "আন-নিসা",
        surah_name_en: "An-Nisa",
        ayahs: [103],
        ayah_range: "৪:১০৩",
        highlight_text_bn: "নিশ্চয়ই সালাত মুমিনদের ওপর নির্দিষ্ট সময়ে ফরজ করা হয়েছে।"
      }
    ]
  },
  {
    id: "fasting-ramadan-rulings",
    title_bn: "সিয়াম / রোজা ও রমজানের বিধান (Fasting & Ramadan)",
    title_en: "Fasting & Rules of Ramadan",
    category_bn: "ইবাদত ও বিধিবিধান",
    category_en: "Worship & Rulings",
    description_bn: "রমজান মাসে কুরআন নাযিল, তাকওয়া অর্জনের উদ্দেশ্যে রোজা ফরজ হওয়ার আয়াতসমূহ।",
    description_en: "Prescription of fasting in Ramadan for achieving Taqwa (God-consciousness).",
    icon: "Moon",
    keywords: ["রোজা", "সিয়াম", "রমজান", "রমাদান", "সাহরি", "ইফতার", "fasting", "ramadan", "sawm", "siyam", "taqwa", "iftar"],
    references: [
      {
        surah: 2,
        surah_name_bn: "আল-বাকারাহ",
        surah_name_en: "Al-Baqarah",
        ayahs: [183, 184, 185],
        ayah_range: "২:১৮৩-১৮৫",
        highlight_text_bn: "হে ঈমানদারগণ! তোমাদের ওপর সিয়াম ফরজ করা হয়েছে যেমন ফরজ করা হয়েছিল তোমাদের পূর্ববর্তীদের ওপর, যাতে তোমরা তাকওয়া অর্জন করতে পার... রমজান মাস, যাতে কুরআন নাযিল করা হয়েছে।"
      }
    ]
  },

  // ৬. নবীদের ঘটনাবলী (Stories of the Prophets)
  {
    id: "prophet-musa-pharaoh",
    title_bn: "হযরত মূসা (আঃ) ও ফেরাউনের ঘটনা (Moses & Pharaoh)",
    title_en: "Prophet Musa (Moses) & Pharaoh",
    category_bn: "নবীদের জীবনী",
    category_en: "Stories of the Prophets",
    description_bn: "মুসা (আঃ)-এর নবুওয়াত, নীল নদ পার হওয়া, অলৌকিক লাঠি এবং ফেরাউনের পতন।",
    description_en: "Prophet Musa's mission, the miracle of the staff, parting of the sea and downfall of Pharaoh.",
    icon: "Scroll",
    keywords: ["মুসা", "মূসা", "ফেরাউন", "লাঠি", "নীল নদ", "বনী ইসরাঈল", "musa", "moses", "pharaoh", "miracle", "staff", "sea", "israel"],
    references: [
      {
        surah: 20,
        surah_name_bn: "ত্বা-হা",
        surah_name_en: "Taha",
        ayahs: [9, 10, 11, 12, 13, 14],
        ayah_range: "২০:৯-২৪",
        highlight_text_bn: "আপনার কাছে কি মূসার বৃত্তান্ত পৌঁছেছে? যখন তিনি আগুন দেখলেন..."
      },
      {
        surah: 28,
        surah_name_bn: "আল-কাসাস",
        surah_name_en: "Al-Qasas",
        ayahs: [3, 4, 5, 6],
        ayah_range: "২৮:৩-৬",
        highlight_text_bn: "আমি মূসা ও ফেরাউনের সত্য বৃত্তান্ত আপনার কাছে বর্ণনা করছি..."
      }
    ]
  },
  {
    id: "prophet-ibrahim-sacrifice",
    title_bn: "হযরত ইবরাহীম (আঃ) ও কুরবানী (Abraham & Sacrifice)",
    title_en: "Prophet Ibrahim (Abraham) & The Supreme Sacrifice",
    category_bn: "নবীদের জীবনী",
    category_en: "Stories of the Prophets",
    description_bn: "একত্ববাদের সন্ধান, কাবা ঘর নির্মাণ এবং মহান কুরবানীর আনুগত্যের পরীক্ষা।",
    description_en: "Monotheism, building the Kaaba, and the supreme sacrifice of Prophet Ibrahim.",
    icon: "Flame",
    keywords: ["ইবরাহীম", "ইব্রাহিম", "কুরবানী", "কাবা", "ইসমাইল", "হজ", "ibrahim", "abraham", "sacrifice", "qurbani", "kaaba", "ismail", "hajj"],
    references: [
      {
        surah: 37,
        surah_name_bn: "আস-সাফফাত",
        surah_name_en: "As-Saffat",
        ayahs: [100, 101, 102, 103, 104, 105, 106, 107],
        ayah_range: "৩৭:১০০-১০৭",
        highlight_text_bn: "অতঃপর যখন সে তার পিতার সাথে চলাফেরার বয়সে পৌঁছাল, তখন ইবরাহীম বলল: হে বৎস! আমি স্বপ্নে দেখেছি যে তোমাকে জবেহ করছি... নিশ্চয়ই এটি ছিল এক স্পষ্ট পরীক্ষা।"
      },
      {
        surah: 2,
        surah_name_bn: "আল-বাকারাহ",
        surah_name_en: "Al-Baqarah",
        ayahs: [127],
        ayah_range: "২:১২৭",
        highlight_text_bn: "এবং স্মরণ কর যখন ইবরাহীম ও ইসমাঈল কাবাগৃহের ভিত্তি স্থাপন করছিল..."
      }
    ]
  },
  {
    id: "prophet-muhammad-mercy",
    title_bn: "হযরত মুহাম্মদ (সাঃ) ও বিশ্বনবীর চরিত্র (Prophet Muhammad SAW)",
    title_en: "Prophet Muhammad (SAW) - Mercy to the Worlds",
    category_bn: "নবীদের জীবনী",
    category_en: "Stories of the Prophets",
    description_bn: "সর্বকালের সর্বশ্রেষ্ঠ চরিত্র, খাতামুন নাবিয়্যীন এবং বিশ্বজগতের জন্য রহমত।",
    description_en: "The Seal of the Prophets, supreme character, and sent as a mercy to all creation.",
    icon: "Sparkles",
    keywords: ["মুহাম্মদ", "মোহাম্মদ", "রাসূল", "নবী", "নবুওয়াত", "রহমত", "muhammad", "prophet", "messenger", "rasool", "mercy", "seal of prophets"],
    references: [
      {
        surah: 21,
        surah_name_bn: "আল-আম্বিয়া",
        surah_name_en: "Al-Anbiya",
        ayahs: [107],
        ayah_range: "২১:১০৭",
        highlight_text_bn: "এবং আমি আপনাকে সমগ্র বিশ্বজগতের জন্য কেবল রহমতস্বরূপ প্রেরণ করেছি।"
      },
      {
        surah: 33,
        surah_name_bn: "আল-আহযাব",
        surah_name_en: "Al-Ahzab",
        ayahs: [21, 40],
        ayah_range: "৩৩:২১, ৪০",
        highlight_text_bn: "নিশ্চয়ই তোমাদের জন্য আল্লাহর রাসূলের মধ্যে রয়েছে সর্বোত্তম আদর্শ... মুহাম্মদ তোমাদের মধ্যে কোনো পুরুষের পিতা নন, বরং তিনি আল্লাহর রাসূল এবং শেষ নবী।"
      },
      {
        surah: 68,
        surah_name_bn: "আল-কলম",
        surah_name_en: "Al-Qalam",
        ayahs: [4],
        ayah_range: "৬৮:৪",
        highlight_text_bn: "এবং আপনি অবশ্যই মহান চরিত্রের ওপর প্রতিষ্ঠিত।"
      }
    ]
  }
];
