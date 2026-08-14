import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles } from "lucide-react";

import { SURAHS, localNumber } from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/surah/$id")({
  component: SurahDetailPage,
});

export type QuranWord = {
  id?: number;
  position: number;
  text_uthmani: string;
  transliteration?: string;
  translation_bn?: string;
  root?: string;
  lemma?: string;
  grammar_bn?: string;
};

export type QuranAyah = {
  surah: number;
  ayah: number;
  text_uthmani: string;
  words: QuranWord[];
};

export type SurahData = {
  surah: number;
  ayahs: QuranAyah[];
};

function SurahDetailPage() {
  const { id } = Route.useParams();
  const surahId = Number(id) || 1;
  const { lang } = usePrefs();
  const [selectedWordInfo, setSelectedWordInfo] = useState<{
    surah: number;
    ayah: number;
    word: QuranWord;
  } | null>(null);

  const meta = SURAHS.find((s) => s.id === surahId) || SURAHS[0];

  // লোকাল ডাটা ফাইল থেকে সম্পূর্ণ সুরা লোড করা
  const surahQuery = useQuery<SurahData>({
    queryKey: ["local-greentech-surah", surahId],
    queryFn: async () => {
      const res = await fetch(`/data/quran/surahs/${surahId}.json`);
      if (!res.ok) {
        throw new Error(`Failed to load Surah ${surahId}`);
      }
      return res.json();
    },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
      {/* ১. সুরা হেডার কার্ড */}
      <div className="card-soft flex flex-col items-center justify-center p-6 text-center space-y-2 border-border/80 shadow-xs">
        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
          সুরা নম্বর: {localNumber(meta.id, lang)} · {meta.type === "Meccan" ? "মাক্কী" : "মাদানী"}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {meta.name_bn} <span className="arabic text-2xl font-normal text-muted-foreground">({meta.name_ar})</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          মোট আয়াত: {localNumber(meta.total_ayahs, lang)} টি
        </p>

        {/* নেভিগেশন বাটন */}
        <div className="flex items-center gap-3 pt-2">
          {surahId > 1 && (
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to="/surah/$id" params={{ id: String(surahId - 1) }}>
                <ChevronLeft className="size-3.5 mr-1" /> পূর্ববর্তী সুরা
              </Link>
            </Button>
          )}
          {surahId < 114 && (
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to="/surah/$id" params={{ id: String(surahId + 1) }}>
                পরবর্তী সুরা <ChevronRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ২. বিসমিল্লাহ (সুরা তাওবাহ ব্যতিত) */}
      {surahId !== 9 && surahId !== 1 && (
        <div className="text-center py-4">
          <p className="arabic text-2xl text-foreground/90 font-medium">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* লোডিং ও এরর স্টেট */}
      {surahQuery.isLoading && (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
          কুরআনের আয়াতসমূহ লোড হচ্ছে...
        </div>
      )}

      {surahQuery.isError && (
        <div className="py-12 text-center text-sm text-destructive">
          সুরা লোড করতে সমস্যা হয়েছে।
        </div>
      )}

      {/* ৩. আয়াতসমূহের তালিকা */}
      <div className="space-y-6">
        {surahQuery.data?.ayahs?.map((ayah) => (
          <div
            key={ayah.ayah}
            id={`ayah-${ayah.ayah}`}
            className="card-soft p-5 space-y-4 transition-all hover:border-border/90"
          >
            {/* আয়াত নম্বর বার */}
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <span className="inline-flex items-center justify-center size-7 rounded-full bg-muted font-mono text-xs font-semibold text-foreground">
                {localNumber(ayah.ayah, lang)}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {meta.name_en} {surahId}:{ayah.ayah}
              </span>
            </div>

            {/* শব্দে শব্দে কুরআন টেক্সট (ইন্টারেক্টিভ ক্লিক) */}
            <div
              dir="rtl"
              className="flex flex-wrap items-center justify-start gap-x-3 gap-y-4 py-2"
            >
              {ayah.words.map((word) => (
                <div
                  key={word.position}
                  onClick={() =>
                    setSelectedWordInfo({
                      surah: surahId,
                      ayah: ayah.ayah,
                      word,
                    })
                  }
                  className="group flex flex-col items-center cursor-pointer rounded-lg p-1.5 transition-all hover:bg-primary/10 active:scale-95"
                >
                  <span className="arabic text-2xl sm:text-3xl text-foreground transition-colors group-hover:text-primary">
                    {word.text_uthmani}
                  </span>
                  {word.translation_bn && (
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground mt-1 text-center font-normal">
                      {word.translation_bn}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ৪. গ্রীনটেক স্টাইল মডাল ডায়ালগ */}
      <WordDetailsDialog
        selectedWord={selectedWordInfo}
        onClose={() => setSelectedWordInfo(null)}
      />
    </div>
  );
}

/** গ্রীনটেক ওয়ার্ড ইনফো ডায়ালগ */
function WordDetailsDialog({
  selectedWord,
  onClose,
}: {
  selectedWord: {
    surah: number;
    ayah: number;
    word: QuranWord;
  } | null;
  onClose: () => void;
}) {
  const { lang } = usePrefs();
  const [searchType, setSearchType] = useState<"word" | "root">("word");

  if (!selectedWord) return null;
  const { word, surah, ayah } = selectedWord;

  return (
    <Dialog open={!!selectedWord} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl p-0 gap-0 border-border/80 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20 text-center">
          {/* ১. পদ বা ব্যাকরণগত ট্যাগ */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {word.grammar_bn || "শব্দ"}
            </span>
          </div>

          {/* ২. মূল আরবি শব্দ */}
          <DialogTitle className="arabic text-4xl text-foreground font-bold tracking-wide my-1">
            {word.text_uthmani}
          </DialogTitle>

          {/* ৩. উচ্চারণ ও বাংলা অনুবাদ */}
          {word.transliteration && (
            <p className="text-xs italic text-muted-foreground font-mono">
              [{word.transliteration}]
            </p>
          )}
          {word.translation_bn && (
            <p className="text-base font-semibold text-foreground/90 mt-1">
              "{word.translation_bn}"
            </p>
          )}

          {/* ৪. গ্রীনটেক রুট ও ক্রিয়ামূল কার্ড */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mt-4">
            <div className="rounded-xl border border-border/70 bg-card p-2.5 text-center shadow-2xs">
              <span className="text-[11px] text-muted-foreground block mb-0.5">ক্রিয়ামূল:</span>
              <span className="arabic text-base font-bold text-foreground">
                {word.lemma || word.text_uthmani}
              </span>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-2.5 text-center shadow-2xs">
              <span className="text-[11px] text-muted-foreground block mb-0.5">মূল (Root):</span>
              <span className="arabic text-base font-bold text-amber-500">
                {word.root || "—"}
              </span>
            </div>
          </div>

          {/* ৫. মোড সুইচ টগল */}
          <div className="flex items-center justify-center gap-1 mt-4 p-1 rounded-xl bg-muted/80 w-fit mx-auto border border-border/60">
            <button
              type="button"
              onClick={() => setSearchType("word")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                searchType === "word"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="size-3.5" /> হুবহু এই শব্দ
            </button>
            <button
              type="button"
              onClick={() => setSearchType("root")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                searchType === "root"
                  ? "bg-background text-primary shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="size-3.5 text-amber-500" /> মূল রুট ({word.root || "—"})
            </button>
          </div>
        </DialogHeader>

        {/* অবস্থান তথ্য */}
        <div className="p-5 text-center text-xs text-muted-foreground">
          অবস্থান: সুরা {localNumber(surah, lang)} : আয়াত {localNumber(ayah, lang)} · শব্দ নম্বর {localNumber(word.position, lang)}
        </div>
      </DialogContent>
    </Dialog>
  );
}