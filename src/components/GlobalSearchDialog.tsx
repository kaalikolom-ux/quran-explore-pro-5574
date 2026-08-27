// src/components/GlobalSearchDialog.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  BookOpen,
  Sparkles,
  FileText,
  Compass,
  ArrowRight,
  X,
  Layers,
  Flame,
  CheckCircle2,
  Clock,
  HelpCircle,
  Tag
} from "lucide-react";

import { usePrefs } from "@/lib/prefs";
import { chaptersQuery, localNumber } from "@/lib/quran";
import { supabase } from "@/integrations/supabase/client";
import { QURAN_THEMATIC_DATABASE, ThematicTopic } from "@/lib/quranThematicData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

export function GlobalSearchDialog({
  open,
  onOpenChange,
  initialQuery = "",
}: GlobalSearchDialogProps) {
  const { lang, t } = usePrefs();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "topics" | "surahs" | "articles">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial query when opened
  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialQuery]);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const chapters = useQuery(chaptersQuery(lang));

  // Articles search query
  const articlesQuery = useQuery({
    queryKey: ["global-search-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title_bn, title_en, slug, excerpt_bn, excerpt_en, cover_image_url, published_at, category:categories(name_bn, name_en)")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) return [];
      return data || [];
    },
    staleTime: 60 * 1000,
  });

  const cleanQ = query.trim().toLowerCase();

  // 1. Topic search matches
  const matchedTopics = useMemo(() => {
    if (!cleanQ) return QURAN_THEMATIC_DATABASE.slice(0, 4); // Trending initial
    return QURAN_THEMATIC_DATABASE.filter((t) => {
      const matchTitle =
        t.title_bn.toLowerCase().includes(cleanQ) ||
        t.title_en.toLowerCase().includes(cleanQ);
      const matchCategory =
        t.category_bn.toLowerCase().includes(cleanQ) ||
        t.category_en.toLowerCase().includes(cleanQ);
      const matchDesc =
        t.description_bn.toLowerCase().includes(cleanQ) ||
        t.description_en.toLowerCase().includes(cleanQ);
      const matchKeywords = t.keywords.some((k) =>
        k.toLowerCase().includes(cleanQ)
      );
      return matchTitle || matchCategory || matchDesc || matchKeywords;
    });
  }, [cleanQ]);

  // 2. Surah & Ayah reference matches
  const matchedSurahs = useMemo(() => {
    const list = chapters.data || [];
    if (!cleanQ) return list.slice(0, 6);

    // Check if input is a direct ayah query like "33:40" or "৩৩ঃ৪০"
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const normalizedDigits = cleanQ.replace(/[০-৯]/g, (w) => String(bnDigits.indexOf(w)));
    const ayahMatch = normalizedDigits.match(/^(\d{1,3})[:ঃ\/\.\-](\d{1,3})$/);

    if (ayahMatch) {
      const sNum = Number(ayahMatch[1]);
      const aNum = Number(ayahMatch[2]);
      const found = list.filter((s) => s.id === sNum);
      if (found.length > 0) {
        return found.map((s) => ({ ...s, targetAyah: aNum }));
      }
    }

    // Number match
    if (/^\d+$/.test(normalizedDigits)) {
      const sNum = Number(normalizedDigits);
      return list.filter((s) => s.id === sNum);
    }

    // Name match
    return list.filter(
      (s) =>
        s.name_simple.toLowerCase().includes(cleanQ) ||
        s.translated_name.name.toLowerCase().includes(cleanQ) ||
        s.name_arabic.includes(cleanQ)
    );
  }, [cleanQ, chapters.data]);

  // 3. Articles & Posts matches
  const matchedArticles = useMemo(() => {
    const list = articlesQuery.data || [];
    if (!cleanQ) return list.slice(0, 3);

    return list.filter((a: any) => {
      const tBn = (a.title_bn || "").toLowerCase();
      const tEn = (a.title_en || "").toLowerCase();
      const eBn = (a.excerpt_bn || "").toLowerCase();
      const eEn = (a.excerpt_en || "").toLowerCase();
      const cBn = (a.category?.name_bn || "").toLowerCase();
      const cEn = (a.category?.name_en || "").toLowerCase();

      return (
        tBn.includes(cleanQ) ||
        tEn.includes(cleanQ) ||
        eBn.includes(cleanQ) ||
        eEn.includes(cleanQ) ||
        cBn.includes(cleanQ) ||
        cEn.includes(cleanQ)
      );
    });
  }, [cleanQ, articlesQuery.data]);

  const totalResults =
    (cleanQ ? matchedTopics.length : 0) +
    (cleanQ ? matchedSurahs.length : 0) +
    (cleanQ ? matchedArticles.length : 0);

  const handleSelectSurah = (surahId: number, targetAyah?: number) => {
    onOpenChange(false);
    navigate({
      to: "/surah/$id",
      params: { id: String(surahId) },
      search: targetAyah ? { ayah: targetAyah } : undefined,
    });
  };

  const handleSelectArticle = (slug: string) => {
    onOpenChange(false);
    navigate({
      to: "/articles/$slug",
      params: { slug },
    });
  };

  const popularSuggestions = [
    { label: "পিতা-মাতার অধিকার", q: "পিতা মাতা" },
    { label: "মহাবিশ্ব সৃষ্টি ও বিজ্ঞান", q: "মহাবিশ্ব" },
    { label: "ভ্রূণতত্ত্ব ও মানব সৃষ্টি", q: "ভ্রূণ" },
    { label: "ব্যবসা ও সুদের বিধান", q: "সুদ" },
    { label: "ধৈর্য ও কষ্টের পর স্বস্তি", q: "ধৈর্য" },
    { label: "রোজা ও রমজান", q: "রোজা" },
    { label: "হযরত মূসা (আঃ)", q: "মুসা" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 border border-border/80 bg-card shadow-2xl overflow-hidden rounded-2xl">
        
        {/* সার্চ হেডার ইনপুট বার */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/70 bg-muted/20">
          <Search className="size-5 text-primary shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === "bn"
                ? "কুরআন, সুরা, বিষয়ভিত্তিক ভাবার্থ বা আর্টিকেল খুঁজুন... (যেমন: পিতা-মাতা, বিজ্ঞান, সুদ, ২:১৮৩)"
                : "Search Quran, Surahs, Thematic Topics or Articles... (e.g. parents, science, 2:183)"
            }
            className="w-full bg-transparent text-base sm:text-lg text-foreground placeholder:text-muted-foreground outline-none border-none font-medium"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground">
              ESC
            </kbd>
          )}
        </div>

        {/* ফিল্টার ট্যাব বার */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border/50 bg-background/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            সব ফলাফল {cleanQ && `(${totalResults})`}
          </button>
          <button
            onClick={() => setActiveTab("topics")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
              activeTab === "topics"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Sparkles className="size-3 text-amber-400" /> বিষয়ভিত্তিক অন্বেষা ({matchedTopics.length})
          </button>
          <button
            onClick={() => setActiveTab("surahs")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
              activeTab === "surahs"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <BookOpen className="size-3" /> সুরা ও আয়াত ({matchedSurahs.length})
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
              activeTab === "articles"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <FileText className="size-3" /> আর্টিকেল ও পোস্ট ({matchedArticles.length})
          </button>
        </div>

        {/* সার্চ রেজাল্ট বডি */}
        <div className="max-h-[62vh] overflow-y-auto p-4 space-y-6">
          
          {/* যদি কিছু না লেখা থাকে: পপুলার সাজেশন চিপস */}
          {!cleanQ && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Flame className="size-3.5 text-amber-500" /> জনপ্রিয় অনুসন্ধানের বিষয়সমূহ
              </p>
              <div className="flex flex-wrap gap-1.5">
                {popularSuggestions.map((item) => (
                  <button
                    key={item.q}
                    onClick={() => setQuery(item.q)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ১. বিষয়ভিত্তিক অন্বেষা (Thematic Topics) */}
          {(activeTab === "all" || activeTab === "topics") && matchedTopics.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-400" /> বিষয়ভিত্তিক ভাবার্থ ও বিজ্ঞান ({matchedTopics.length})
                </p>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {matchedTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold text-primary/90 bg-primary/10 px-2 py-0.5 rounded-md">
                          {lang === "en" ? topic.category_en : topic.category_bn}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {topic.references.length}টি রেফারেন্স
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {lang === "en" ? topic.title_en : topic.title_bn}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                        {lang === "en" ? topic.description_en : topic.description_bn}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {topic.references.slice(0, 2).map((ref, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectSurah(ref.surah, ref.ayahs[0])}
                            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-primary hover:text-white transition-all cursor-pointer"
                          >
                            <span>সুরা {ref.surah_name_bn} ({ref.ayah_range})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ২. সুরা ও আয়াত (Surahs) */}
          {(activeTab === "all" || activeTab === "surahs") && matchedSurahs.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-primary" /> সুরা ও আয়াত ({matchedSurahs.length})
              </p>

              <div className="grid gap-2 sm:grid-cols-3">
                {matchedSurahs.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSurah(s.id, s.targetAyah)}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/50 hover:border-foreground/30 transition-all text-left group cursor-pointer"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-xs font-bold text-accent-foreground shrink-0">
                        {localNumber(s.id, lang)}
                      </span>
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {s.name_simple}
                          {s.targetAyah && (
                            <span className="ml-1 text-xs font-bold text-primary">
                              ({localNumber(s.targetAyah, lang)} নং আয়াত)
                            </span>
                          )}
                        </span>
                        <span className="block text-[11px] text-muted-foreground truncate">
                          {s.translated_name?.name} · {localNumber(s.verses_count, lang)} আয়াত
                        </span>
                      </div>
                    </div>
                    <span className="arabic text-sm text-primary/80 shrink-0 ml-2">
                      {s.name_arabic}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ৩. আর্টিকেল ও রিসার্চ পোস্ট (Articles & Posts) */}
          {(activeTab === "all" || activeTab === "articles") && matchedArticles.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" /> আর্টিকেল ও গবেষণাপত্র ({matchedArticles.length})
              </p>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {matchedArticles.map((a: any) => {
                  const title = lang === "en" && a.title_en ? a.title_en : a.title_bn;
                  const excerpt = lang === "en" && a.excerpt_en ? a.excerpt_en : a.excerpt_bn;

                  return (
                    <div
                      key={a.id}
                      onClick={() => handleSelectArticle(a.slug)}
                      className="group flex gap-3 p-3 rounded-xl border border-border/70 bg-card hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer"
                    >
                      {a.cover_image_url && (
                        <img
                          src={a.cover_image_url}
                          alt={title}
                          className="size-16 rounded-lg object-cover shrink-0 border border-border/40"
                        />
                      )}
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            {a.category?.name_bn || "আর্টিকেল"}
                          </span>
                          <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-1">
                            {title}
                          </h4>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                            {excerpt || "বিস্তারিত পড়তে ক্লিক করুন..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ফলাফল পাওয়া না গেলে */}
          {cleanQ && matchedTopics.length === 0 && matchedSurahs.length === 0 && matchedArticles.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <HelpCircle className="size-10 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm font-semibold text-foreground">
                "{query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                অন্য কোনো প্রতিশব্দ দিয়ে চেষ্টা করুন বা সরাসরি সুরার নাম (যেমন: বাকারা), নম্বর (যেমন: 2:183) অথবা সাধারণ বিষয় (যেমন: বিজ্ঞান, পিতা-মাতা, সুদ) লিখে সার্চ করুন।
              </p>
            </div>
          )}

        </div>

        {/* ফুটার টিপস */}
        <div className="px-4 py-2.5 border-t border-border/50 bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>💡 <strong>টিপ:</strong> সুরা বা নির্দিষ্ট আয়াতে যেতে <code className="bg-muted px-1 rounded">2:183</code> লিখুন</span>
          </div>
          <span className="hidden sm:inline">Quran Explorer Global AI Search</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
