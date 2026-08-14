import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import React from "react";

import { localNumber } from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Strip Arabic diacritics and normalize characters completely */
function normalizeArabic(text: string) {
  if (!text) return "";
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "") // Remove all harakat and Quranic marks
    .replace(/[أإآٱ]/g, "ا") // Normalize Alif
    .replace(/[يى]/g, "ي") // Normalize Yaa / Alif Maqsoora
    .replace(/[ة]/g, "ه") // Normalize Taa Marbuta
    .replace(/[ؤ]/g, "و") // Normalize Waw with Hamza
    .replace(/[ئ]/g, "ي") // Normalize Yaa with Hamza
    .replace(/[^\u0621-\u064A]/g, "") // Keep only clean Arabic letters
    .trim();
}

/** Regex builder to match exact Arabic word with optional Harakat */
function highlightArabicWord(fullText: string, searchWord: string) {
  const bare = normalizeArabic(searchWord);
  if (!bare) return fullText;

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

  const regex = new RegExp(`(${regexPattern})`, "gu");
  const parts = fullText.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span
        key={i}
        className="rounded-md bg-primary/25 px-1 py-0.5 font-bold text-primary dark:bg-primary/35"
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
  const rawWord = word ? word.trim() : "";
  const normalized = normalizeArabic(rawWord);

  const results = useQuery<VerseResult[]>({
    queryKey: ["word-lexicon-search-v10", rawWord, normalized, lang],
    enabled: !!rawWord,
    queryFn: async () => {
      const searchTarget = normalized || rawWord;

      // 1. Search for matching verse keys
      const searchRes = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(
          searchTarget
        )}&size=30`
      );

      if (!searchRes.ok) throw new Error("Search failed");
      const searchJson = await searchRes.json();
      const hits = searchJson?.search?.results || [];

      if (hits.length === 0) return [];

      // 2. Fetch specific word lexicon & verse data
      const detailedVerses = await Promise.all(
        hits.slice(0, 30).map(async (hit: any) => {
          try {
            const verseRes = await fetch(
              `https://api.quran.com/api/v4/verses/by_key/${hit.verse_key}?language=${
                lang === "bn" ? "bn" : "en"
              }&words=true`
            );
            if (!verseRes.ok) return null;
            const verseJson = await verseRes.json();
            const v = verseJson.verse;

            const [s, a] = hit.verse_key.split(":").map(Number);
            const words: any[] = (v.words || []).filter(
              (w: any) => w.char_type_name === "word" // Filter out end markers
            );

            // ১. হুবহু (Exact) ম্যাচ খোঁজা
            let matchedWord = words.find((w) => {
              const wNorm = normalizeArabic(w.text_uthmani || w.text || "");
              return wNorm === normalized;
            });

            // ২. যদি হুবহু না পাওয়া যায় তবে আংশিক (Contains) ম্যাচ খোঁজা
            if (!matchedWord) {
              matchedWord = words.find((w) => {
                const wNorm = normalizeArabic(w.text_uthmani || w.text || "");
                return wNorm.includes(normalized) || normalized.includes(wNorm);
              });
            }

            return {
              surah: s,
              ayah: a,
              text_uthmani: v.text_uthmani || hit.text,
              wordInfo: matchedWord
                ? {
                    text_uthmani: matchedWord.text_uthmani || matchedWord.text,
                    transliteration:
                      matchedWord.transliteration?.text ||
                      matchedWord.transliteration,
                    translation:
                      matchedWord.translation?.text ||
                      matchedWord.translation,
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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="arabic text-3xl text-primary">{word}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {t("wordSearch")} · অভিধান
            </span>
          </DialogTitle>
          <DialogDescription>
            এই শব্দটি যেসব আয়াতে রয়েছে এবং ওই আয়াতে শব্দটির নির্দিষ্ট উচ্চারণ ও অর্থ নিচে দেওয়া হলো:
          </DialogDescription>
        </DialogHeader>

        {results.isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground animate-pulse">
            অভিধান ও আয়াতগুলো প্রস্তুত হচ্ছে...
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

              {/* ১. সম্পূর্ণ আরবি আয়াত (সার্চ করা শব্দটি হাইলাইটেড) */}
              <p className="arabic text-right text-2xl leading-relaxed text-foreground">
                {highlightArabicWord(v.text_uthmani, rawWord)}
              </p>

              {/* ২. নির্দিষ্ট শব্দের অভিধান/অর্থ কার্ড (Lexicon Row) */}
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