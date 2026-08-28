// src/routes/lexicon.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  BookA,
  BookOpen,
  Search,
  Sparkles,
  ExternalLink,
  Filter,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  Check,
  Microscope,
  Info,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { usePrefs } from "@/lib/prefs";
import { localNumber } from "@/lib/quran";
import { useIsAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/lexicon")({
  head: () => ({
    meta: [
      {
        title:
          "কুরআনিক অভিধান ও শব্দকোষ (বিজ্ঞানভিত্তিক অর্থ ও উচ্চারণসহ) — Quranic Lexicon | কুরআন অন্বেষা",
      },
      {
        name: "description",
        content:
          "পবিত্র কুরআনের ১,৬০০+ মূল ধাতু (Root), প্রতিটি আরবি শব্দের বাংলা উচ্চারণ, ঐতিহ্যগত ও আধুনিক বিজ্ঞানভিত্তিক অর্থ, ব্যাকরণ ও রেফারেন্সসহ সম্পূর্ণ অভিধান।",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "কুরআনিক অভিধান ও শব্দকোষ — কুরআন অন্বেষা" },
      {
        property: "og:description",
        content:
          "পবিত্র কুরআনের প্রতিটি আরবি শব্দের বাংলা উচ্চারণ, ধাতু, বিজ্ঞানভিত্তিক অর্থ ও গবেষণা শিখুন।",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://qurananwesha.com/lexicon" }],
  }),
  component: QuranLexiconPage,
});

interface DerivedWord {
  text_uthmani: string;
  lemma: string;
  transliteration: string;
  pronunciation_bn: string;
  meaning_bn: string;
  count: number;
  sampleAyahs: { surah: number; ayah: number }[];
}

interface LexiconEntry {
  root: string;
  root_formatted: string;
  first_letter: string;
  total_occurrences: number;
  ayahs_count: number;
  primary_meanings_bn: string;
  grammar_types: string[];
  unique_words_count: number;
  derived_words: DerivedWord[];
  all_ayahs?: (number[] | { surah: number; ayah: number })[];
}

interface ScientificNote {
  summary?: string;
  details?: string;
  references?: string;
  updated_at?: string;
}

type ScientificMap = Record<string, ScientificNote>;

const ARABIC_ALPHABET = [
  "সব",
  "ا",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ه",
  "و",
  "ي",
];

const SURAH_NAMES_BN: Record<number, string> = {
  1: "আল-ফাতিহা",
  2: "আল-বাকারাহ",
  3: "আলে ইমরান",
  4: "আন-নিসা",
  5: "আল-মায়িদাহ",
  6: "আল-আন'আম",
  7: "আল-আ'রাফ",
  8: "আল-আনফাল",
  9: "আত-তাওবাহ",
  10: "ইউনুস",
  11: "হুদ",
  12: "ইউসুফ",
  13: "আর-রাদ",
  14: "ইবরাহীম",
  15: "আল-হিজর",
  16: "আন-নাহল",
  17: "বনী ইসরাঈল",
  18: "আল-কাহফ",
  19: "মারইয়াম",
  20: "ত্বা-হা",
  21: "আল-আম্বিয়া",
  22: "আল-হাজ্জ",
  23: "আল-মুমিনুন",
  24: "আন-নূর",
  25: "আল-ফুরকান",
  26: "আশ-শু'আরা",
  27: "আন-নামল",
  28: "আল-কাসাস",
  29: "আল-আনকাবুত",
  30: "আর-রূম",
  31: "লুকমান",
  32: "আস-সাজদাহ",
  33: "আল-আহযাব",
  34: "সাবা",
  35: "ফাতির",
  36: "ইয়াসীন",
  37: "আস-সাফফাত",
  38: "সোয়াদ",
  39: "আয-যুমার",
  40: "গাফির",
  41: "ফুসসিলাত",
  42: "আশ-শুরা",
  43: "আয-যুখরুফ",
  44: "আদ-দুখান",
  45: "আল-জাসিয়াহ",
  46: "আল-আহকাফ",
  47: "মুহাম্মদ",
  48: "আল-ফাতহ",
  49: "আল-হুজুরাত",
  50: "ক্বাফ",
  51: "আয-যারিয়াত",
  52: "আত-তুর",
  53: "আন-নাজম",
  54: "আল-ক্বামার",
  55: "আর-রাহমান",
  56: "আল-ওয়াকিয়াহ",
  57: "আল-হাদীদ",
  58: "আল-মুজাদালাহ",
  59: "আল-হাশর",
  60: "আল-মুমতাহিনাহ",
  61: "আস-সাফ",
  62: "আল-জুমুআহ",
  63: "আল-মুনাফিকুন",
  64: "আত-তাগাবুন",
  65: "আত-ত্বালাক",
  66: "আত-তাহরীম",
  67: "আল-মুলক",
  68: "আল-কলম",
  69: "আল-হাক্কাহ",
  70: "আল-মাআরিজ",
  71: "নূহ",
  72: "আল-জ্বিন",
  73: "আল-মুযযাম্মিল",
  74: "আল-মুদ্দাসসির",
  75: "আল-কিয়ামাহ",
  76: "আল-ইনসান",
  77: "আল-মুরসালাত",
  78: "আন-নাবা",
  79: "আন-নাযিয়াত",
  80: "আবাসা",
  81: "আত-তাকবীর",
  82: "আল-ইনফিতার",
  83: "আল-মুতাফফিফীন",
  84: "আল-ইনশিক্বাক্ব",
  85: "আল-বুরূজ",
  86: "আত-ত্বারিক্ব",
  87: "আল-আ'লা",
  88: "আল-গাশিয়াহ",
  89: "আল-ফাজর",
  90: "আল-বালাদ",
  91: "আশ-শামস",
  92: "আল-লাইল",
  93: "আদ-দুহা",
  94: "আশ-শারহ",
  95: "আত-তীন",
  96: "আল-আলাক",
  97: "আল-ক্বদর",
  98: "আল-বাইয়িনাহ",
  99: "আল-যিলযাল",
  100: "আল-আদিয়াত",
  101: "আল-ক্বারিআহ",
  102: "আত-তাকাসুর",
  103: "আল-আসর",
  104: "আল-হুমাযাহ",
  105: "আল-ফীল",
  106: "কুরাইশ",
  107: "আল-মাউন",
  108: "আল-কাউসার",
  109: "আল-কাফিরুন",
  110: "আন-নাসর",
  111: "আল-মাসাদ",
  112: "আল-ইখলাস",
  113: "আল-ফালাক",
  114: "আন-নাস",
};

const LEXICON_CACHE_KEY = "quran-lexicon-v3";

const fetchLexiconData = async (): Promise<LexiconEntry[]> => {
  const url = "/data/quran/lexicon.json";
  try {
    if (typeof window !== "undefined" && "caches" in window) {
      try {
        const cache = await caches.open(LEXICON_CACHE_KEY);
        const cached = await cache.match(url);
        if (cached) {
          const d = await cached.json();
          if (Array.isArray(d) && d.length > 0) return d;
        }
      } catch {}
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (
      typeof window !== "undefined" &&
      "caches" in window &&
      Array.isArray(data) &&
      data.length > 0
    ) {
      try {
        const cache = await caches.open(LEXICON_CACHE_KEY);
        const copy = new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        });
        await cache.put(url, copy);
      } catch {}
    }
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Lexicon fetch error:", err);
    return [];
  }
};

// প্রাথমিক কিছু প্রখ্যাত বিজ্ঞানভিত্তিক রুট সিড ডাটা (Initial Seed Data)
const INITIAL_SCIENTIFIC_SEED: ScientificMap = {
  رتق: {
    summary: "মহাবিশ্বের সৃষ্টি ও আদি একত্রিত অবস্থা (Cosmic Singularity)",
    details:
      "কুরআনের ২১:৩০ আয়াতে 'রতক' (رَتْقًا) শব্দটি দ্বারা আসমান ও জমিনের একটি একক পিণ্ডে ওতপ্রোতভাবে মিশে থাকার বৈজ্ঞানিক অবস্থাকে নির্দেশ করে, যা আধুনিক বিগ ব্যাং তত্ত্বের আদি একক মহাজাগতিক অবস্থা (Initial Singularity)-র সাথে হুবহু মিলে যায়।",
    references: "সুরা আল-আম্বিয়া (২১:৩০)",
  },
  علق: {
    summary: "মানব ভ্রূণতত্ত্ব ও জরায়ুর গায়ে সংলগ্ন রক্তপিণ্ড (Embryonic Implantation)",
    details:
      "কুরআনের ৯৬:২ ও ২৩:১৪ আয়াতে 'আলাক' (عَلَق) শব্দটি জরায়ুর দেয়ালে জোঁকের ন্যায় আঁকড়ে থাকা ঝুলন্ত প্রাথমিক ভ্রূণাবস্থাকে নিখুঁতভাবে তুলে ধরে, যা আধুনিক মাইক্রোস্কোপিক ভ্রূণতত্ত্বের আবিষ্কার।",
    references: "সুরা আল-আলাক (৯৬:২), আল-মুমিনুন (২৩:১৪)",
  },
  حدد: {
    summary: "লোহার মহাজাগতিক উৎপত্তি (Extraterrestrial Origin of Iron)",
    details:
      "কুরআনের ৫৭:২৫ আয়াতে 'আনযালনা' (أَنزَلْنَا - আমরা অবতীর্ণ করেছি) শব্দটি ব্যবহার করা হয়েছে। আধুনিক জ্যোতির্বিজ্ঞান প্রমাণ করেছে যে পৃথিবীর কোনো প্রক্রিয়ায় লোহা তৈরি হতে পারে না; এটি সুপারনোভা বিস্ফোরণের মাধ্যমে মহাকাশ থেকে পৃথিবীতে বর্ষিত হয়েছে।",
    references: "সুরা আল-হাদিদ (৫৭:২৫)",
  },
  مرج: {
    summary: "সমুদ্রের অদৃশ্য ঘনত্বের প্রাচীর (Oceanographic Barrier)",
    details:
      "কুরআনের ৫৫:১৯-২০ এবং ২৫:৫৩ আয়াতে দুই সাগরের মিলনস্থলে এমন এক অন্তরাল (বুরযখ) থাকার কথা বলা হয়েছে যা তারা অতিক্রম করে না। সমুদ্রবিজ্ঞানীরা আবিষ্কার করেছেন যে পানির ঘনত্ব, লবণাক্ততা ও তাপমাত্রার পার্থক্যের কারণে দুই সমুদ্রের মাঝে অদৃশ্য পর্দা বজায় থাকে।",
    references: "সুরা আর-রাহমান (৫৫:১৯-২০), আল-ফুরকান (২৫:৫৩)",
  },
  وسع: {
    summary: "মহাবিশ্বের অবিরাম সম্প্রসারণ (Continuous Cosmic Expansion)",
    details:
      "কুরআনের ৫১:৪৭ আয়াতে 'মুসিউন' (مُوسِعُونَ) শব্দটি নির্দেশ করে যে আল্লাহ তায়ালা মহাবিশ্বকে নিরন্তর সম্প্রসারিত করে চলেছেন, যা এডউইন হাবলের আবিষ্কৃত Expanding Universe থিওরির মূল স্তম্ভ।",
    references: "সুরা আজ-যারিয়াত (৫১:৪৭)",
  },
};

function QuranLexiconPage() {
  const { lang, prefs } = usePrefs();
  const { isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("সব");
  const [page, setPage] = useState(1);
  const itemsPerPage = 18;

  // এডিট মোডাল স্টেট (Admin Edit Modal)
  const [editingRoot, setEditingRoot] = useState<LexiconEntry | null>(null);
  const [editSummary, setEditSummary] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editRefs, setEditRefs] = useState("");

  // আয়াতসমূহ দেখার ডায়ালগ স্টেট (Ayahs Modal State)
  const [viewingAyahsRoot, setViewingAyahsRoot] = useState<LexiconEntry | null>(null);

  // ১. মূল অভিধান ডাটাবেজ
  const { data: lexicon = [], isLoading } = useQuery<LexiconEntry[]>({
    queryKey: ["quran-lexicon-database-v3"],
    queryFn: fetchLexiconData,
    staleTime: 1000 * 60 * 60 * 24,
  });

  // ২. বিজ্ঞানভিত্তিক অর্থ ও রিসার্চ ডাটাবেজ (Supabase site_settings)
  const { data: scientificMap = INITIAL_SCIENTIFIC_SEED } = useQuery<ScientificMap>({
    queryKey: ["lexicon-scientific-map-v2"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "lexicon_scientific_map")
          .maybeSingle();

        if (error || !data || !data.value) {
          return INITIAL_SCIENTIFIC_SEED;
        }
        return { ...INITIAL_SCIENTIFIC_SEED, ...(data.value as ScientificMap) };
      } catch (err) {
        return INITIAL_SCIENTIFIC_SEED;
      }
    },
    staleTime: 60 * 1000,
  });

  // ৩. বিজ্ঞানভিত্তিক অর্থ সংরক্ষণ মিউটেশন (Admin Save Mutation)
  const saveScientificMutation = useMutation({
    mutationFn: async ({ rootKey, note }: { rootKey: string; note: ScientificNote | null }) => {
      const updatedMap: ScientificMap = { ...scientificMap };
      if (!note || (!note.summary?.trim() && !note.details?.trim())) {
        delete updatedMap[rootKey];
      } else {
        updatedMap[rootKey] = {
          ...note,
          updated_at: new Date().toISOString(),
        };
      }

      const { error } = await supabase.from("site_settings").upsert({
        key: "lexicon_scientific_map",
        value: updatedMap as any,
        is_public: true,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      return updatedMap;
    },
    onSuccess: (updatedMap) => {
      queryClient.setQueryData(["lexicon-scientific-map"], updatedMap);
      toast.success(
        lang === "bn"
          ? "বিজ্ঞানভিত্তিক অর্থ সফলভাবে সংরক্ষিত হয়েছে!"
          : "Scientific note saved successfully!",
      );
      setEditingRoot(null);
    },
    onError: (err: any) => {
      toast.error(
        lang === "bn" ? `সংরক্ষণে সমস্যা হয়েছে: ${err.message}` : `Failed to save: ${err.message}`,
      );
    },
  });

  const handleOpenEditModal = (item: LexiconEntry) => {
    const existing = scientificMap[item.root] || {};
    setEditingRoot(item);
    setEditSummary(existing.summary || "");
    setEditDetails(existing.details || "");
    setEditRefs(existing.references || "");
  };

  const handleSaveModal = () => {
    if (!editingRoot) return;
    saveScientificMutation.mutate({
      rootKey: editingRoot.root,
      note: {
        summary: editSummary.trim(),
        details: editDetails.trim(),
        references: editRefs.trim(),
      },
    });
  };

  const handleDeleteScientific = () => {
    if (!editingRoot) return;
    saveScientificMutation.mutate({
      rootKey: editingRoot.root,
      note: null,
    });
  };

  const cleanQuery = searchTerm.trim().toLowerCase();

  const filteredEntries = useMemo(() => {
    let list = lexicon;

    if (selectedLetter !== "সব") {
      list = list.filter((item) => item.first_letter === selectedLetter);
    }

    if (!cleanQuery) return list;

    return list.filter((item) => {
      const sci = scientificMap[item.root];
      const matchRoot = item.root.includes(cleanQuery) || item.root_formatted.includes(cleanQuery);
      const matchMeaning = (item.primary_meanings_bn || "").toLowerCase().includes(cleanQuery);
      const matchSci =
        sci &&
        ((sci.summary || "").toLowerCase().includes(cleanQuery) ||
          (sci.details || "").toLowerCase().includes(cleanQuery));
      const matchWords = item.derived_words.some(
        (w) =>
          w.text_uthmani.includes(cleanQuery) ||
          w.pronunciation_bn.toLowerCase().includes(cleanQuery) ||
          w.transliteration.toLowerCase().includes(cleanQuery) ||
          w.meaning_bn.toLowerCase().includes(cleanQuery),
      );
      return matchRoot || matchMeaning || matchWords || matchSci;
    });
  }, [lexicon, selectedLetter, cleanQuery, scientificMap]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, page]);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ১. পেইজ হিরো ব্যানার */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1a2d] to-[#030712] text-white py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[350px] w-[700px] rounded-full bg-[#1d4ed8]/15 blur-[140px]" />
          <div className="absolute -right-20 top-1/3 h-[300px] w-[300px] rounded-full bg-[#0284c7]/15 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-md mb-4 shadow-xs">
            <BookA className="size-4 text-[#60a5fa]" />
            {lang === "bn"
              ? "শব্দে শব্দে কুরআনিক অভিধান, উচ্চারণ ও বিজ্ঞান"
              : "Quranic Lexicon & Scientific Research"}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white leading-tight">
            {lang === "bn"
              ? "কুরআনিক আরবি শব্দকোষ ও বিজ্ঞানভিত্তিক অর্থ"
              : "Quranic Arabic Lexicon & Scientific Notes"}
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed font-normal">
            {lang === "bn"
              ? "পবিত্র কুরআনের ১,৬৪২টি মূল ধাতু (Roots) ও শব্দের সহজ বাংলা উচ্চারণ, অর্থ এবং আধুনিক বিজ্ঞানভিত্তিক গবেষণামূলক ব্যাখ্যা।"
              : "Explore 1,642 Quranic roots with Bengali phonetics, meanings, grammar, and modern scientific contextual research."}
          </p>

          {/* প্রধান সার্চ ইনপুট */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center rounded-2xl border border-white/25 bg-black/40 px-4 py-2.5 backdrop-blur-md shadow-lg focus-within:border-[#60a5fa] focus-within:ring-2 focus-within:ring-[#60a5fa]/30 transition-all">
              <Search className="size-5 text-[#60a5fa] shrink-0 mr-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={
                  lang === "bn"
                    ? "বাংলা উচ্চারণ (যেমন: রব্বি, রহমান), অর্থ, বিজ্ঞান বা আরবি রুট লিখুন..."
                    : "Search by pronunciation, meaning, science, or Arabic root..."
                }
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-white/60 outline-none border-none font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-white/60 hover:text-white text-xs px-2 py-1 bg-white/10 rounded-md cursor-pointer"
                >
                  মুছুন
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ২. বর্ণানুক্রমিক ফিল্টার বার */}
      <div className="sticky top-14 sm:top-16 z-30 border-b border-border/80 bg-background/95 backdrop-blur-md py-3 shadow-xs">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1 shrink-0">
              <Filter className="size-3.5" /> বর্ণ:
            </span>
            {ARABIC_ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedLetter === letter
                    ? "bg-[#2A6F97] text-white shadow-xs scale-105"
                    : "border border-border/70 bg-card text-foreground hover:bg-muted/70"
                }`}
              >
                <span className={letter !== "সব" ? "arabic text-sm" : ""}>{letter}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ৩. মূল কন্টেন্ট ও কার্ড গ্রিড */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* রেজাল্ট হেডার স্ট্যাটাস */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-border/60">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span>
                {selectedLetter === "সব"
                  ? "সকল মূল ধাতু (Roots)"
                  : `"${selectedLetter}" বর্ণ দিয়ে শুরু রুটসমূহ`}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              মোট {localNumber(filteredEntries.length, lang)}টি রুট পাওয়া গেছে
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <ShieldCheck className="size-3" /> এডমিন এডিটিং সক্রিয়
              </span>
            )}
            <div className="text-xs text-muted-foreground font-medium">
              পৃষ্ঠা {localNumber(page, lang)} / {localNumber(totalPages, lang)}
            </div>
          </div>
        </div>

        {/* লোডিং স্টেট */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground font-medium">অভিধান ডাটাবেজ লোড হচ্ছে...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <BookA className="size-12 text-muted-foreground mx-auto opacity-40" />
            <p className="text-base font-semibold text-foreground">কোনো শব্দ বা রুট পাওয়া যায়নি</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              অন্য কোনো প্রতিশব্দ বা বাংলা উচ্চারণ দিয়ে খুঁজুন (যেমন: রব্বি, রহমান, কিতাব, জান্নাত)।
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {paginatedEntries.map((item) => {
              const sci = scientificMap[item.root];
              const hasSciContent = Boolean(sci && (sci.summary?.trim() || sci.details?.trim()));

              return (
                <div
                  key={item.root}
                  className="card-soft group flex flex-col justify-between p-5 border border-border/80 hover:border-primary/50 transition-all hover:shadow-[var(--shadow-lift)]"
                >
                  <div>
                    {/* কার্ড টপ হেডার */}
                    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-3">
                      <div>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                          মূল ধাতু (Root)
                        </span>
                        <h3 className="arabic text-2xl sm:text-3xl font-bold text-primary tracking-wider">
                          {item.root_formatted}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          {localNumber(item.total_occurrences, lang)} বার
                        </span>
                        <span className="block text-[10px] text-muted-foreground mt-1">
                          {localNumber(item.ayahs_count, lang)}টি আয়াতে
                        </span>
                      </div>
                    </div>

                    {/* মূল অর্থ */}
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted-foreground">মূল অর্থসমূহ:</p>
                      <p className="text-sm font-semibold text-foreground/95 leading-relaxed mt-0.5">
                        "{item.primary_meanings_bn || "কুরআনিক শব্দাবলী"}"
                      </p>
                    </div>

                    {/* গঠিত শব্দসমূহ ও বাংলা উচ্চারণ */}
                    <div className="mt-4 space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>কুরআনে ব্যবহৃত শব্দ ও বাংলা উচ্চারণ:</span>
                        <span className="text-[10px] font-normal lowercase font-mono">
                          ({localNumber(item.unique_words_count, lang)}টি রূপ)
                        </span>
                      </p>

                      <div className="grid gap-1.5">
                        {item.derived_words.slice(0, 4).map((w, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-xl bg-muted/40 p-2.5 text-xs border border-border/40 hover:bg-muted/70 transition-colors"
                          >
                            <div className="min-w-0 flex items-center gap-2.5">
                              <span className="arabic text-base font-bold text-foreground shrink-0">
                                {w.text_uthmani}
                              </span>
                              <div className="min-w-0">
                                {w.pronunciation_bn && (
                                  <span className="text-xs font-semibold text-[#1c5576] dark:text-[#58b4e8] block truncate">
                                    [{w.pronunciation_bn}]
                                  </span>
                                )}
                                <span className="text-[11px] text-muted-foreground truncate block">
                                  {w.meaning_bn}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {w.sampleAyahs.slice(0, 1).map((sRef, sIdx) => (
                                <Link
                                  key={sIdx}
                                  to="/surah/$id"
                                  params={{ id: String(sRef.surah) }}
                                  search={{ ayah: sRef.ayah }}
                                  className="inline-flex items-center gap-0.5 rounded-md bg-background px-2 py-1 text-[10px] font-semibold text-foreground hover:bg-primary hover:text-white border border-border transition-all"
                                  title="আয়াতটি পড়ুন"
                                >
                                  <span>
                                    {sRef.surah}:{sRef.ayah}
                                  </span>
                                  <ExternalLink className="size-2.5" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ৪. বিজ্ঞানভিত্তিক অর্থ ও গবেষণা সারি (Strict Conditional Visibility) */}
                    {/* নিয়ম: এই সারিতে কিছু না থাকলে সাধারণ বা লগইন করা কোনো ভিজিটরই দেখতে পাবে না। */}
                    {hasSciContent && prefs.showLexiconScientific && (
                      <div className="mt-4 rounded-xl border border-[#2A6F97]/30 bg-[#2A6F97]/5 dark:bg-[#58b4e8]/10 p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c5576] dark:text-[#58b4e8]">
                            <Microscope className="size-3.5" />
                            <span>বিজ্ঞানভিত্তিক অর্থ ও গবেষণা:</span>
                          </span>
                          {sci?.references && (
                            <span className="text-[10px] text-muted-foreground font-medium">
                              {sci.references}
                            </span>
                          )}
                        </div>

                        {sci?.summary && (
                          <p className="text-xs font-semibold text-foreground">{sci.summary}</p>
                        )}
                        {sci?.details && (
                          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                            {sci.details}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* কার্ড ফুটার (এডমিন এডিট বোতাম এবং ইউজার ন্যাভিগেশন) */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="size-3" />
                        <span>
                          {hasSciContent
                            ? "বিজ্ঞানভিত্তিক অর্থ সম্পাদনা"
                            : "+ বিজ্ঞানভিত্তিক অর্থ যুক্ত করুন"}
                        </span>
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {hasSciContent ? "বিজ্ঞানভিত্তিক গবেষণাসহ" : "প্রামাণ্য মূল ধাতু"}
                      </span>
                    )}

                    {/* আয়াতসমূহ দেখার ডায়ালগ ওপেন বাটন */}
                    <button
                      type="button"
                      onClick={() => setViewingAyahsRoot(item)}
                      className="text-xs text-primary font-semibold inline-flex items-center gap-1.5 hover:underline cursor-pointer group/btn"
                    >
                      <span>{localNumber(item.ayahs_count, lang)}টি আয়াত দেখুন</span>
                      <ArrowRight className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ৫. পেজিনেশন কন্ট্রোলস */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
            >
              পূর্ববর্তী
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pNum = i + 1;
                return (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`size-8 rounded-lg text-xs font-semibold cursor-pointer ${
                      page === pNum
                        ? "bg-[#2A6F97] text-white"
                        : "border border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {localNumber(pNum, lang)}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-1 text-xs text-muted-foreground">...</span>}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
            >
              পরবর্তী
            </button>
          </div>
        )}
      </main>

      {/* ৬. এডমিন বিজ্ঞানভিত্তিক অর্থ এডিট ডায়ালগ (Admin Edit Modal) */}
      <Dialog open={!!editingRoot} onOpenChange={(open) => !open && setEditingRoot(null)}>
        <DialogContent className="max-w-xl p-6 bg-card border-border shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Microscope className="size-5 text-primary" />
              <span>বিজ্ঞানভিত্তিক অর্থ ও গবেষণা সম্পাদনা</span>
            </DialogTitle>
          </DialogHeader>

          {editingRoot && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                <div>
                  <span className="text-[11px] text-muted-foreground font-medium block">
                    মূল ধাতু (Root)
                  </span>
                  <span className="arabic text-2xl font-bold text-primary">
                    {editingRoot.root_formatted}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">কুরআনে মোট ব্যবহার</span>
                  <span className="text-sm font-bold text-foreground">
                    {editingRoot.total_occurrences} বার
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  বিজ্ঞানভিত্তিক সারসংক্ষেপ / মূল অর্থ (এক লাইনে):
                </label>
                <Input
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  placeholder="যেমন: মহাবিশ্বের আদি একত্রিত অবস্থা (Cosmic Singularity)"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  বিজ্ঞানভিত্তিক বিশদ ব্যাখ্যা ও প্রাসঙ্গিক গবেষণা:
                </label>
                <Textarea
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  rows={4}
                  placeholder="আধুনিক বিজ্ঞানের প্রেক্ষিতে শব্দটির তাৎপর্য ও তাফসীর লিখুন..."
                  className="text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  তথ্যসূত্র / প্রাসঙ্গিক আয়াতসমূহ:
                </label>
                <Input
                  value={editRefs}
                  onChange={(e) => setEditRefs(e.target.value)}
                  placeholder="যেমন: সুরা আল-আম্বিয়া (২১:৩০), আজ-যারিয়াত (৫১:৪৭)"
                  className="text-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border mt-6">
                {scientificMap[editingRoot.root] ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteScientific}
                    disabled={saveScientificMutation.isPending}
                    className="cursor-pointer"
                  >
                    <Trash2 className="size-3.5 mr-1" /> মুছে ফেলুন
                  </Button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingRoot(null)}
                    className="cursor-pointer"
                  >
                    বাতিল
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveModal}
                    disabled={saveScientificMutation.isPending}
                    className="bg-[#2A6F97] hover:bg-[#1f5575] text-white cursor-pointer"
                  >
                    <Save className="size-3.5 mr-1" />
                    {saveScientificMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ৭. আয়াতসমূহ প্রদর্শনের ইন্টারেক্টিভ ডায়ালগ (Ayahs Explorer Modal) */}
      <Dialog open={!!viewingAyahsRoot} onOpenChange={(open) => !open && setViewingAyahsRoot(null)}>
        <DialogContent className="max-w-2xl p-6 bg-card border-border shadow-2xl rounded-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2 text-lg font-bold text-foreground border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                <span>পবিত্র কুরআনে আয়াতের রেফারেন্সসমূহ</span>
              </div>
              {viewingAyahsRoot && (
                <span className="arabic text-2xl text-primary font-bold">
                  {viewingAyahsRoot.root_formatted}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {viewingAyahsRoot && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50 text-xs gap-2">
                <div>
                  <span className="text-muted-foreground">মূল অর্থ: </span>
                  <span className="font-semibold text-foreground">
                    "{viewingAyahsRoot.primary_meanings_bn}"
                  </span>
                </div>
                <div className="font-mono text-primary font-bold">
                  মোট {localNumber(viewingAyahsRoot.total_occurrences, lang)} বার ·{" "}
                  {localNumber(viewingAyahsRoot.ayahs_count, lang)}টি আয়াতে
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  নিচের যেকোনো আয়াতে ক্লিক করে সরাসরি পাঠ করুন:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(viewingAyahsRoot.all_ayahs || []).map((ref, idx) => {
                    const surahNum = Array.isArray(ref) ? ref[0] : (ref as any).surah;
                    const ayahNum = Array.isArray(ref) ? ref[1] : (ref as any).ayah;
                    const sName = SURAH_NAMES_BN[surahNum] || `সুরা ${surahNum}`;
                    return (
                      <Link
                        key={idx}
                        to="/surah/$id"
                        params={{ id: String(surahNum) }}
                        search={{ ayah: ayahNum }}
                        onClick={() => setViewingAyahsRoot(null)}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-card hover:bg-primary/10 hover:border-primary/50 text-foreground transition-all group cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="block text-xs font-semibold text-foreground group-hover:text-primary truncate">
                            {sName}
                          </span>
                          <span className="block text-[10px] text-muted-foreground font-mono">
                            আয়াত {localNumber(ayahNum, lang)}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-primary shrink-0 ml-1">
                          {surahNum}:{ayahNum}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
