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

/** Strip Arabic diacritics and normalize characters */
function normalizeArabic(text: string) {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u0652\u0670\u06D6-\u06ED\u0640]/g, "") // Remove harakat
    .replace(/[أإآٱ]/g, "ا") // Normalize Alif
    .replace(/ى/g, "ي") // Normalize Alif Maqsoora
    .replace(/ة/g, "ه") // Normalize Ta Marbootah
    .trim();
}

/** Regex builder to match Arabic word even when it has diacritics (Harakat) */
function highlightArabicWord(fullText: string, searchWord: string) {
  const bare = normalizeArabic(searchWord);
  if (!bare) return fullText;

  // Allow optional harakat between each letter of the word
  const harakatPattern = "[\\u064B-\\u0652\\u0670\\u06D6-\\u06ED\\u0640]*";
  const regexPattern = bare
    .split("")
    .map((char) => {
      if (char === "ا") return `[اأإآٱ]${harakatPattern}`;
      if (char === "ي") return `[ييى]${harakatPattern}`;
      if (char === "ه") return `[ههة]${harakatPattern}`;
      return `${char}${harakatPattern}`;
    })
    .join("");

  const regex = new RegExp(`(${regexPattern})`, "gu");
  const parts = fullText.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span
        key={i}
        className="rounded-md bg-primary/20 px-1 py-0.5 font-bold text-primary dark:bg-primary/30"
      >
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

type VerseResult = {
  surah: number;
  ayah: number;
  text_uthmani: string;
  transliteration?: string;
  translation?: string;
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
    queryKey: ["word-search-complete-v5", rawWord, normalized, lang],
    enabled: !!rawWord,
    queryFn: async () => {
      const searchTarget = normalized || rawWord;
      const transId = lang === "bn" ? "163" : "131"; // 163: Bengali, 131: Sahih International

      // 1. Get search match verse keys
      const searchRes = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(
          searchTarget
        )}&size=25`
      );

      if (!searchRes.ok) throw new Error("Search failed");
      const searchJson = await searchRes.json();
      const hits = searchJson?.search?.results || [];

      if (hits.length === 0) return [];

      // 2. Fetch full verse details (Arabic, Transliteration, Translation) in parallel
      const detailedVerses = await Promise.all(
        hits.slice(0, 25).map(async (hit: any) => {
          try {
            const verseRes = await fetch(
              `https://api.quran.com/api/v4/verses/by_key/${hit.verse_key}?language=${lang === "bn" ? "bn" : "en"}&words=true&translations=${transId}`
            );
            if (!verseRes.ok) return null;
            const verseJson = await verseRes.json();
            const v = verseJson.verse;

            const [s, a] = hit.verse_key.split(":").map(Number);
            const transliterationStr = (v.words || [])
              .map((w: any) => w.transliteration?.text)
              .filter(Boolean)
              .join(" ");

            const translationStr = v.translations?.[0]?.text
              ? v.translations[0].text.replace(/<[^>]*>?/gm, "").replace(/\[\d+\]/g, "")
              : "";

            return {
              surah: s,
              ayah: a,
              text_uthmani: v.text_uthmani || hit.text,
              transliteration: transliterationStr,
              translation: translationStr,
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
            <span className="text-sm font-normal text-muted-foreground">{t("wordSearch")}</span>
          </DialogTitle>
          <DialogDescription>
            এই শব্দ বা মূল অক্ষর সম্বলিত আয়াতসমূহ (শব্দটি আয়াতে হাইলাইট করা হয়েছে):
          </DialogDescription>
        </DialogHeader>

        {results.isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground animate-pulse">
            উচ্চারণ ও অনুবাদসহ আয়াতগুলো প্রস্তুত হচ্ছে...
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

        <div className="space-y-4 mt-3">
          {results.data?.map((v) => (
            <div
              key={`${v.surah}:${v.ayah}`}
              className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-xs"
            >
              {/* আয়াত ও সুরা নম্বর বার */}
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {lang === "bn" ? "স্থান:" : "Location:"}
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

              {/* ১. আরবি টেক্সট (সার্চ করা শব্দটি হাইলাইটেড) */}
              <p className="arabic text-right text-2xl leading-relaxed text-foreground">
                {highlightArabicWord(v.text_uthmani, rawWord)}
              </p>

              {/* ২. উচ্চারণ (Transliteration) */}
              {v.transliteration && (
                <div className="rounded bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground/80">উচ্চারণ: </span>
                  <span className="italic">{v.transliteration}</span>
                </div>
              )}

              {/* ৩. পূর্ণ অর্থ/অনুবাদ (Translation) */}
              {v.translation && (
                <div className="border-l-2 border-primary/60 pl-3 py-0.5">
                  <p className="text-xs font-semibold text-primary mb-0.5">
                    {lang === "bn" ? "অনুবাদ:" : "Translation:"}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {v.translation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}