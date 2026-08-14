import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import React, { useState } from "react";
import { Sparkles, BookOpen, Layers } from "lucide-react";

import { localNumber } from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Strip all Arabic harakat, quranic annotation symbols, and normalize letters */
function cleanArabic(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "") // All vowels & marks
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[يىئ]/g, "ي")
    .replace(/[ة]/g, "ه")
    .replace(/[ؤ]/g, "و")
    .replace(/[^\u0621-\u064A]/g, "") // Pure Arabic letters only
    .trim();
}

/** Build Regex for exact word matching */
function buildWordRegex(searchWord: string): RegExp {
  const bare = cleanArabic(searchWord);
  if (!bare) return new RegExp("$^");

  const harakatPattern = "[\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]*";
  const regexPattern = bare
    .split("")
    .map((char) => {
      if (char === "ا") return `[اأإآٱ]${harakatPattern}`;
      if (char === "ي") return `[ييىئ]${harakatPattern}`;
      if (char === "ه") return `[ههة]${harakatPattern}`;
      if (char === "و") return `[ووؤ]${harakatPattern}`;
      return `${char}${harakatPattern}`;
    })
    .join("");

  return new RegExp(`(${regexPattern})`, "gu");
}

/** Regex highlight renderer */
function highlightArabic(fullText: string, searchWord: string) {
  if (!searchWord) return fullText;
  const regex = buildWordRegex(searchWord);

  const parts = fullText.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span
        key={i}
        className="rounded-md bg-amber-400/25 px-1 py-0.5 font-bold text-amber-300 dark:bg-amber-400/35"
      >
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

type WordInfo = {
  text_uthmani: string;
  transliteration?: string;
  translation?: string;
  root?: string;
  lemma?: string;
};

type VerseResult = {
  surah: number;
  ayah: number;
  text_uthmani: string;
  wordInfo?: WordInfo;
};

export function WordSearchDialog({
  word,
  onClose,
}: {
  word: string | null;
  onClose: () => void;
}) {
  const { t, lang } = usePrefs();
  const [searchType, setSearchType] = useState<"word" | "root">("word");
  const rawWord = word ? word.trim() : "";
  const targetClean = cleanArabic(rawWord);

  // ১. ক্লিক করা শব্দের মূল রূপ (Root/Lemma) ও প্রাথমিক ডাটা আনা
  const wordDetails = useQuery({
    queryKey: ["word-morphology", targetClean],
    enabled: !!targetClean,
    queryFn: async () => {
      const res = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(targetClean)}&size=1`
      );
      if (!res.ok) return null;
      const json = await res.json();
      const firstHit = json?.search?.results?.[0];
      if (!firstHit) return null;

      const vRes = await fetch(
        `https://api.quran.com/api/v4/verses/by_key/${firstHit.verse_key}?language=${
          lang === "bn" ? "bn" : "en"
        }&words=true&word_fields=text_uthmani,text_imlaei,location`
      );
      if (!vRes.ok) return null;
      const vJson = await vRes.json();
      const allWords: any[] = vJson.verse?.words || [];

      const matched = allWords.find((w) => {
        const u = cleanArabic(w.text_uthmani || "");
        const im = cleanArabic(w.text_imlaei || "");
        return u === targetClean || im === targetClean;
      });

      return {
        text_uthmani: matched?.text_uthmani || rawWord,
        transliteration: matched?.transliteration?.text || "",
        translation: matched?.translation?.text || "",
        // ব্যাকরণ ও মূল রুট (API সিম্পল রুট ফলব্যাক)
        root: targetClean.slice(0, 3), // ৩ অক্ষরের রুট
        lemma: targetClean,
      };
    },
  });

  const activeSearchWord =
    searchType === "root" && wordDetails.data?.root
      ? wordDetails.data.root
      : targetClean;

  // ২. সার্চ রেজাল্ট সংগ্রহ
  const results = useQuery<VerseResult[]>({
    queryKey: ["word-search-results", activeSearchWord, searchType, lang],
    enabled: !!activeSearchWord,
    queryFn: async () => {
      const searchRes = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(
          activeSearchWord
        )}&size=30`
      );

      if (!searchRes.ok) throw new Error("Search failed");
      const searchJson = await searchRes.json();
      const hits = searchJson?.search?.results || [];

      if (hits.length === 0) return [];

      const detailedVerses = await Promise.all(
        hits.slice(0, 30).map(async (hit: any) => {
          try {
            const verseRes = await fetch(
              `https://api.quran.com/api/v4/verses/by_key/${hit.verse_key}?language=${
                lang === "bn" ? "bn" : "en"
              }&words=true&word_fields=text_uthmani,text_imlaei,location`
            );
            if (!verseRes.ok) return null;
            const verseJson = await verseRes.json();
            const v = verseJson.verse;
            const [s, a] = hit.verse_key.split(":").map(Number);
            const allWords: any[] = v.words || [];

            let matchedWord = allWords.find((w) => {
              const u = cleanArabic(w.text_uthmani || "");
              const im = cleanArabic(w.text_imlaei || "");
              return u.includes(activeSearchWord) || im.includes(activeSearchWord);
            });

            return {
              surah: s,
              ayah: a,
              text_uthmani: v.text_uthmani || hit.text,
              wordInfo: matchedWord
                ? {
                    text_uthmani: matchedWord.text_uthmani || matchedWord.text,
                    transliteration: matchedWord.transliteration?.text || "",
                    translation: matchedWord.translation?.text || "",
                  }
                : undefined,
            };
          } catch {
            return null;
          }
        })
      );

      return detailedVerses.filter(Boolean) as VerseResult[];
    },
  });

  return (
    <Dialog open={!!word} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col items-center justify-center text-center space-y-2 py-2">
            {/* ১. মূল নির্বাচিত শব্দ */}
            <span className="arabic text-4xl text-primary font-bold tracking-wide">
              {wordDetails.data?.text_uthmani || rawWord}
            </span>

            {/* ২. উচ্চারণ ও অনুবাদ */}
            {wordDetails.data?.transliteration && (
              <p className="text-sm italic text-muted-foreground">
                [{wordDetails.data.transliteration}]
              </p>
            )}
            {wordDetails.data?.translation && (
              <p className="text-base font-semibold text-foreground">
                {wordDetails.data.translation}
              </p>
            )}

            {/* ৩. GreenTech স্টাইল রুট ও ক্রিয়ামূল ব্যাজ */}
            <div className="flex items-center justify-center gap-4 pt-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs">
                <span className="text-muted-foreground font-medium">মূল (Root):</span>
                <span className="arabic text-sm font-bold text-amber-500">
                  {wordDetails.data?.root || targetClean}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs">
                <span className="text-muted-foreground font-medium">ক্রিয়ামূল:</span>
                <span className="arabic text-sm font-bold text-emerald-500">
                  {wordDetails.data?.lemma || targetClean}
                </span>
              </div>
            </div>

            {/* ৪. নির্বাচন বাটন (শব্দ নাকি রুট অনুসন্ধান করবেন) */}
            <div className="flex items-center rounded-xl border border-border bg-muted/60 p-1 text-xs mt-3">
              <button
                type="button"
                onClick={() => setSearchType("word")}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 font-medium transition-all ${
                  searchType === "word"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="size-3.5" /> হুবহু এই শব্দ ({rawWord})
              </button>
              <button
                type="button"
                onClick={() => setSearchType("root")}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 font-medium transition-all ${
                  searchType === "root"
                    ? "bg-background text-primary shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="size-3.5 text-amber-500" /> মূল রুট ({wordDetails.data?.root || targetClean})
              </button>
            </div>
          </div>

          <DialogDescription className="text-center text-xs pt-1">
            {searchType === "word"
              ? `কুরআনে যেখানে যেখানে "${rawWord}" শব্দটি ব্যবহৃত হয়েছে:`
              : `কুরআনে এই মূল ধাতু/রুট (${wordDetails.data?.root || targetClean}) থেকে গঠিত সকল আয়াতের তালিকা:`}
          </DialogDescription>
        </DialogHeader>

        {results.isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground animate-pulse">
            আয়াত ও অভিধান প্রস্তুত হচ্ছে...
          </div>
        )}

        {results.isError && (
          <div className="py-8 text-center text-sm text-destructive">
            {t("error")}
          </div>
        )}

        {results.data && results.data.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {t("noWordResults")}
          </div>
        )}

        {/* আয়াতসমূহের তালিকা */}
        <div className="mt-3 space-y-4">
          {results.data?.map((v) => (
            <div
              key={`${v.surah}:${v.ayah}`}
              className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-xs"
            >
              {/* অবস্থান ও লিংক */}
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {lang === "bn" ? "অবস্থান:" : "Location:"}
                </span>
                <Link
                  to="/surah/$id"
                  params={{ id: String(v.surah) }}
                  hash={`ayah-${v.ayah}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  সুরা {localNumber(v.surah, lang)} : আয়াত {localNumber(v.ayah, lang)} ➔
                </Link>
              </div>

              {/* আয়াত টেক্সট */}
              <p className="arabic text-right text-2xl leading-relaxed text-foreground">
                {highlightArabic(v.text_uthmani, activeSearchWord)}
              </p>

              {/* আয়াতের ভেতর শব্দটির অর্থ */}
              {v.wordInfo?.translation && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2 border border-border/40 text-xs">
                  <span className="arabic text-base font-semibold text-primary">
                    {v.wordInfo.text_uthmani}
                  </span>
                  <span className="font-medium text-foreground bg-primary/10 px-2 py-0.5 rounded">
                    অর্থ: {v.wordInfo.translation}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}