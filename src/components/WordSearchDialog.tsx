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

/** Strip all Arabic harakat, quranic marks and normalize letters */
function cleanArabic(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "") // All vowels, tanween & quran symbols
    .replace(/[أإآٱ]/g, "ا") // Normalize Alif
    .replace(/[يىئ]/g, "ي") // Normalize Yaa / Hamza
    .replace(/[ة]/g, "ه") // Normalize Taa Marbuta
    .replace(/[ؤ]/g, "و") // Normalize Waw
    .replace(/[^\u0621-\u064A]/g, "") // Keep pure Arabic letters only
    .trim();
}

/** Regex builder to highlight matched word accurately inside the verse */
function highlightArabicWord(fullText: string, searchWord: string) {
  const bare = cleanArabic(searchWord);
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
  const targetClean = cleanArabic(rawWord);

  const results = useQuery<VerseResult[]>({
    queryKey: ["word-lexicon-search-v12", rawWord, targetClean, lang],
    enabled: !!rawWord,
    queryFn: async () => {
      if (!targetClean) return [];

      // ১. শব্দ দিয়ে আয়াতগুলো সার্চ করা
      const searchRes = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(
          targetClean
        )}&size=30`
      );

      if (!searchRes.ok) throw new Error("Search failed");
      const searchJson = await searchRes.json();
      const hits = searchJson?.search?.results || [];

      if (hits.length === 0) return [];

      // ২. প্রতিটি আয়াতের শব্দে শব্দে ডাটা ও ট্রান্সলেশন আনা
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
            
            // শুধুমাত্র আসল শব্দগুলো নেওয়া (আয়াত নম্বর ও ওয়াক্ফ মার্কার বাদে)
            const wordsList: any[] = (v.words || []).filter(
              (w: any) => w.char_type_name === "word"
            );

            // স্কোরিং অ্যালগরিদম দিয়ে সেরা ম্যাচিং শব্দটি খুঁজে বের করা
            let bestWord: any = null;
            let highestScore = 0;

            for (const w of wordsList) {
              const wText = cleanArabic(
                w.text_uthmani || w.text_imlaei || w.text || ""
              );
              
              if (!wText) continue;

              // ১. হুবহু মিললে সর্বোচ্চ স্কোর
              if (wText === targetClean) {
                bestWord = w;
                highestScore = 100;
                break;
              }

              // ২. প্রিফিক্সসহ মিল (যেমন: بالمسجد এবং المسجد)
              if (wText.endsWith(targetClean) || targetClean.endsWith(wText)) {
                if (highestScore < 80) {
                  bestWord = w;
                  highestScore = 80;
                }
              }

              // ৩. সাবস্ট্রিং মিল (যেকোনো একটার ভেতরে আরেকটা থাকা)
              else if (wText.includes(targetClean) || targetClean.includes(wText)) {
                if (highestScore < 50) {
                  bestWord = w;
                  highestScore = 50;
                }
              }
            }

            // সঠিক ওয়ার্ড ইনফো তৈরি
            const wordInfo: WordInfo | undefined = bestWord
              ? {
                  text_uthmani: bestWord.text_uthmani || bestWord.text,
                  transliteration:
                    bestWord.transliteration?.text ||
                    bestWord.transliteration ||
                    "",
                  translation:
                    bestWord.translation?.text ||
                    bestWord.translation ||
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