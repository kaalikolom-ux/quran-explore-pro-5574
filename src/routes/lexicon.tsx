// src/routes/lexicon.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  BookA,
  Search,
  Sparkles,
  BookOpen,
  Volume2,
  ExternalLink,
  Layers,
  Flame,
  ArrowRight,
  Filter,
  CheckCircle2
} from "lucide-react";

import { usePrefs } from "@/lib/prefs";
import { localNumber } from "@/lib/quran";

export const Route = createFileRoute("/lexicon")({
  head: () => ({
    meta: [
      { title: "কুরআনিক অভিধান ও শব্দকোষ (উচ্চারণ ও অর্থসহ) — Quranic Lexicon | কুরআন অন্বেষা" },
      {
        name: "description",
        content:
          "পবিত্র কুরআনের ১,৬০০+ মূল ধাতু (Root), প্রতিটি আরবি শব্দের বাংলা উচ্চারণ, অর্থ, ব্যাকরণ ও রেফারেন্সসহ সম্পূর্ণ অভিধান ও শব্দকোষ।",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "কুরআনিক অভিধান ও শব্দকোষ (বাংলা উচ্চারণসহ) — কুরআন অন্বেষা" },
      {
        property: "og:description",
        content: "পবিত্র কুরআনের প্রতিটি আরবি শব্দের বাংলা উচ্চারণ, ধাতু ও অর্থ শিখুন।",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://qurananwesha.com/lexicon" }
    ]
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
}

const ARABIC_ALPHABET = [
  "সব", "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
];

function QuranLexiconPage() {
  const { lang, t } = usePrefs();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("সব");
  const [page, setPage] = useState(1);
  const itemsPerPage = 18;

  const { data: lexicon = [], isLoading } = useQuery<LexiconEntry[]>({
    queryKey: ["quran-lexicon-database"],
    queryFn: async () => {
      const res = await fetch("/data/quran/lexicon.json");
      if (!res.ok) throw new Error("Failed to load lexicon data");
      return res.json();
    },
    staleTime: Infinity,
  });

  const cleanQuery = searchTerm.trim().toLowerCase();

  const filteredEntries = useMemo(() => {
    let list = lexicon;

    if (selectedLetter !== "সব") {
      list = list.filter((item) => item.first_letter === selectedLetter);
    }

    if (!cleanQuery) return list;

    return list.filter((item) => {
      const matchRoot = item.root.includes(cleanQuery) || item.root_formatted.includes(cleanQuery);
      const matchMeaning = (item.primary_meanings_bn || "").toLowerCase().includes(cleanQuery);
      const matchWords = item.derived_words.some(
        (w) =>
          w.text_uthmani.includes(cleanQuery) ||
          w.pronunciation_bn.toLowerCase().includes(cleanQuery) ||
          w.transliteration.toLowerCase().includes(cleanQuery) ||
          w.meaning_bn.toLowerCase().includes(cleanQuery)
      );
      return matchRoot || matchMeaning || matchWords;
    });
  }, [lexicon, selectedLetter, cleanQuery]);

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
            {lang === "bn" ? "শব্দে শব্দে কুরআনিক অভিধান ও উচ্চারণ" : "Quranic Lexicon & Phonetic Dictionary"}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white leading-tight">
            {lang === "bn" ? "কুরআনিক আরবি শব্দকোষ ও ধাতু" : "Quranic Arabic Lexicon & Roots"}
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed font-normal">
            {lang === "bn"
              ? "পবিত্র কুরআনের ১,৬৪২টি মূল ধাতু (Roots) ও সহস্রাধিক শব্দের সহজ বাংলা উচ্চারণ, অর্থ ও রেফারেন্স। আরবি রিডিং না জানলেও বাংলা উচ্চারণে সহজেই কুরআন বুঝুন।"
              : "Explore 1,642 Quranic roots and thousands of words with Bengali phonetics, meanings, grammar, and direct verse references."}
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
                    ? "বাংলা উচ্চারণ (যেমন: রব্বি, রহমান), অর্থ বা আরবি রুট লিখুন..."
                    : "Search by Bengali pronunciation, meaning, or Arabic root..."
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

      {/* ২. বর্ণানুক্রমিক ফিল্টার বার (Arabic Alphabet Bar) */}
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

          <div className="text-xs text-muted-foreground">
            পৃষ্ঠা {localNumber(page, lang)} / {localNumber(totalPages, lang)}
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
            {paginatedEntries.map((item) => (
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

                  {/* গঠিত শব্দসমূহ ও বাংলা উচ্চারণ (Derived Words with Bengali Phonetics) */}
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
                                <span>{sRef.surah}:{sRef.ayah}</span>
                                <ExternalLink className="size-2.5" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* কার্ড ফুটার - সূরায় বিস্তারিত পড়ার লিংক */}
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-primary font-semibold">
                  <span>সব আয়াত ও ব্যাকরণ দেখুন</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ৪. পেজিনেশন কন্ট্রোলস */}
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
    </div>
  );
}
