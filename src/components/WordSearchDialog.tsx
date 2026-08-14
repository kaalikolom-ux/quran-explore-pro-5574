import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import React, { useState } from "react";
import { Search, Sparkles, BookOpen } from "lucide-react";

import { localNumber } from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Strip all Arabic harakat, quranic annotation symbols, and normalize letters */
function cleanArabic(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "") // All vowels, tanween & marks
    .replace(/[أإآٱ]/g, "ا") // Normalize Alif
    .replace(/[يىئ]/g, "ي") // Normalize Yaa
    .replace(/[ة]/g, "ه") // Normalize Taa Marbuta
    .replace(/[ؤ]/g, "و") // Normalize Waw
    .replace(/[^\u0621-\u064A]/g, "") // Keep pure Arabic letters only
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

/** Build Regex for Root matching (finds any word containing root letters in order) */
function buildRootRegex(root: string): RegExp {
  const bare = cleanArabic(root);
  if (!bare) return new RegExp("$^");

  const harakatPattern = "[\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640\\u0621-\\u064A]*";
  const letters = bare.split("");
  const pattern = letters.map((l) => `[${l}][\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]*`).join(harakatPattern);

  return new RegExp(`(\\b${harakatPattern}${pattern}${harakatPattern}\\b|${pattern})`, "gu");
}

/** Regex highlight renderer */
function highlightArabic(fullText: string, searchWord: string, isRootMode = false) {
  if (!searchWord) return fullText;
  const regex = isRootMode ? buildRootRegex(searchWord) : buildWordRegex(searchWord);

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
  const [searchMode, setSearchMode] = useState<"word" | "root">("word");
  const [customInput, setCustomInput] = useState("");

  const activeQuery = customInput.trim() || (word ? word.trim() : "");
  const targetClean = cleanArabic(activeQuery);

  const results = useQuery<VerseResult[]>({
    queryKey: ["word-lexicon-search-v15", activeQuery, targetClean, searchMode, lang],
    enabled: !!activeQuery,
    queryFn: async () => {
      if (!targetClean) return [];

      // ১. রুট বা শব্দ দিয়ে আয়াত অনুসন্ধান
      const searchRes = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(
          targetClean
        )}&size=30`
      );

      if (!searchRes.ok) throw new Error("Search failed");
      const searchJson = await searchRes.json();
      const hits = searchJson?.search?.results || [];

      if (hits.length === 0) return [];

      // ২. প্রতিটি আয়াতের শব্দ ও অর্থ লোড করা
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

            // নির্দিষ্ট ম্যাচিং শব্দ বাছাই
            let matchedWord: any = null;

            if (searchMode === "root") {
              // রুট মোডে রুট প্যাটার্ন ম্যাচ
              matchedWord = allWords.find((w) => {
                const u = cleanArabic(w.text_uthmani || "");
                const im = cleanArabic(w.text_imlaei || "");
                const regex = buildRootRegex(targetClean);
                return regex.test(u) || regex.test(im);
              });
            } else {
              // শব্দ মোডে এক্স্যাক্ট বা সাবস্ট্রিং ম্যাচ
              matchedWord = allWords.find((w) => {
                const u = cleanArabic(w.text_uthmani || "");
                const im = cleanArabic(w.text_imlaei || "");
                return u === targetClean || im === targetClean;
              });

              if (!matchedWord) {
                matchedWord = allWords.find((w) => {
                  const u = cleanArabic(w.text_uthmani || "");
                  const im = cleanArabic(w.text_imlaei || "");
                  return (
                    (u && (u.includes(targetClean) || targetClean.includes(u))) ||
                    (im && (im.includes(targetClean) || targetClean.includes(im)))
                  );
                });
              }
            }

            const wordInfo: WordInfo | undefined = matchedWord
              ? {
                  text_uthmani:
                    matchedWord.text_uthmani ||
                    matchedWord.text_imlaei ||
                    matchedWord.text ||
                    activeQuery,
                  transliteration:
                    matchedWord.transliteration?.text ||
                    matchedWord.transliteration ||
                    "",
                  translation:
                    matchedWord.translation?.text ||
                    matchedWord.translation ||
                    "",
                }
              : undefined;

            return {
              surah: s,
              ayah: a,
              text_uthmani: v.text_uthmani || hit.text,
              wordInfo,
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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
            <DialogTitle className="flex items-center gap-3">
              <span className="arabic text-3xl text-primary">{activeQuery}</span>
              <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                {searchMode === "root" ? "রুট (جذر) অনুসন্ধান" : "শব্দ অনুসন্ধান ও অভিধান"}
              </span>
            </DialogTitle>

            {/* অনুসন্ধান মোড টগল (শব্দ vs রুট) */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-1 text-xs">
              <button
                type="button"
                onClick={() => setSearchMode("word")}
                className={`rounded px-2.5 py-1 font-medium transition-all ${
                  searchMode === "word"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="inline size-3.5 mr-1" /> নির্দিষ্ট শব্দ
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("root")}
                className={`rounded px-2.5 py-1 font-medium transition-all ${
                  searchMode === "root"
                    ? "bg-background text-primary shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="inline size-3.5 mr-1 text-amber-500" /> রুট (Root)
              </button>
            </div>
          </div>

          <DialogDescription className="pt-2 text-xs">
            {searchMode === "root"
              ? "💡 রুট মোড: মূল ধাতু (যেমন: سجد বা كتب বা عوذ) এর মাধ্যমে কুরআনের সকল উদ্ভূত শব্দ একসাথে খুঁজুন।"
              : "এই শব্দটি যেসব আয়াতে রয়েছে এবং ওই আয়াতে শব্দটির নির্দিষ্ট উচ্চারণ ও অর্থ নিচে দেওয়া হলো:"}
          </DialogDescription>
        </DialogHeader>

        {/* ইনপুট বার (সরাসরি রুট বা অন্য শব্দ লিখে টেস্ট করার জন্য) */}
        <div className="flex gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={
                searchMode === "root"
                  ? "রুট লিখুন (যেমন: كتب বা سجد বা عوذ)..."
                  : "অন্য কোনো আরবি শব্দ লিখুন..."
              }
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          {customInput && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCustomInput("")}
            >
              রিসেট
            </Button>
          )}
        </div>

        {results.isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground animate-pulse">
            কুরআনের আয়াত ও রুট ডাটা বিশ্লেষণ করা হচ্ছে...
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

        <div className="mt-3 space-y-4">
          {results.data?.map((v) => (
            <div
              key={`${v.surah}:${v.ayah}`}
              className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-xs"
            >
              {/* আয়াত ও সুরা নম্বর বার */}
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

              {/* ১. সম্পূর্ণ আরবি আয়াত (শব্দ বা রুট হাইলাইটেড) */}
              <p className="arabic text-right text-2xl leading-relaxed text-foreground">
                {highlightArabic(v.text_uthmani, activeQuery, searchMode === "root")}
              </p>

              {/* ২. নির্দিষ্ট শব্দের অর্থ ও উচ্চারণ কার্ড */}
              {v.wordInfo && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2 border border-border/40">
                  <div className="flex items-center gap-3">
                    <span className="arabic text-lg font-semibold text-primary">
                      {v.wordInfo.text_uthmani}
                    </span>
                    {v.wordInfo.transliteration && (
                      <span className="text-xs italic text-muted-foreground">
                        [{v.wordInfo.transliteration}]
                      </span>
                    )}
                  </div>
                  {v.wordInfo.translation && (
                    <span className="text-sm font-medium text-foreground bg-primary/10 px-2.5 py-0.5 rounded">
                      অর্থ: {v.wordInfo.translation}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}