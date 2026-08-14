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

/** Common Arabic root / word meanings fallback dictionary for Bengali & English */
const WORD_MEANING_DICTIONARY: Record<string, { bn: string[]; en: string[] }> = {
  جعل: { bn: ["আরোপ", "ন্যস্ত", "নির্ধারণ", "বানায়", "স্থাপন", "করে"], en: ["assign", "make", "set", "place"] },
  يوم: { bn: ["দিন", "দিবস", "কেয়ামত"], en: ["day", "daytime"] },
  سماء: { bn: ["আকাশ", "আকাশমন্ডলী", "আকাশমণ্ডল"], en: ["heaven", "sky"] },
  ارض: { bn: ["পৃথিবী", "জমি", "ভূখণ্ড"], en: ["earth", "land"] },
  رحم: { bn: ["দয়ালু", "রহম", "দয়া", "করুণাময়"], en: ["merciful", "mercy", "compassionate"] },
  علم: { bn: ["জ্ঞান", "জানেন", "অবগত", "শিক্ষা"], en: ["know", "knowledge", "learn"] },
  قول: { bn: ["বলুন", "বলেন", "কথা", "বক্তব্য"], en: ["say", "said", "speech"] },
  ويل: { bn: ["দুর্ভোগ", "ধ্বংস", "পরিতাপ"], en: ["woe", "destruction"] },
};

/** Strip Arabic diacritics and normalize characters */
function normalizeArabic(text: string) {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u0652\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

/** Regex builder to match Arabic word with optional Harakat */
function highlightArabicWord(fullText: string, searchWord: string) {
  const bare = normalizeArabic(searchWord);
  if (!bare) return fullText;

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
        className="rounded-md bg-primary/25 px-1 py-0.5 font-bold text-primary dark:bg-primary/35"
      >
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

/** Smart highlight function for Transliteration and Translation */
function highlightTextWithCandidates(fullText: string, candidateWords: string[]) {
  if (!fullText || !candidateWords || candidateWords.length === 0) return fullText;

  const validCandidates = candidateWords
    .map((w) => w.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .filter((w) => w.length > 1);

  if (validCandidates.length === 0) return fullText;

  const pattern = validCandidates.join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = fullText.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span
        key={i}
        className="rounded bg-primary/25 px-1 py-0.5 font-semibold text-primary dark:bg-primary/35"
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
  matchedTransliterations: string[];
  translation?: string;
  matchedTranslations: string[];
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
    queryKey: ["word-search-v7", rawWord, normalized, lang],
    enabled: !!rawWord,
    queryFn: async () => {
      const searchTarget = normalized || rawWord;
      const transId = lang === "bn" ? "163" : "131";

      const searchRes = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(
          searchTarget
        )}&size=25`
      );

      if (!searchRes.ok) throw new Error("Search failed");
      const searchJson = await searchRes.json();
      const hits = searchJson?.search?.results || [];

      if (hits.length === 0) return [];

      const detailedVerses = await Promise.all(
        hits.slice(0, 25).map(async (hit: any) => {
          try {
            const verseRes = await fetch(
              `https://api.quran.com/api/v4/verses/by_key/${hit.verse_key}?language=${
                lang === "bn" ? "bn" : "en"
              }&words=true&translations=${transId}`
            );
            if (!verseRes.ok) return null;
            const verseJson = await verseRes.json();
            const v = verseJson.verse;

            const [s, a] = hit.verse_key.split(":").map(Number);
            const words = v.words || [];

            // 1. Collect all transliterations for matching
            const matchedWordObjs = words.filter((w: any) => {
              const wordNorm = normalizeArabic(w.text_uthmani || "");
              return wordNorm.includes(normalized) || normalized.includes(wordNorm);
            });

            const transCandidates = matchedWordObjs
              .map((w: any) => w.transliteration?.text)
              .filter(Boolean);

            // 2. Collect translation candidate words from API + Dictionary fallback
            const transMeaningCandidates = matchedWordObjs
              .map((w: any) => w.translation?.text)
              .filter(Boolean);

            // Check dictionary for fallback synonyms
            Object.keys(WORD_MEANING_DICTIONARY).forEach((rootKey) => {
              if (normalized.includes(rootKey) || rootKey.includes(normalized)) {
                const dictWords = WORD_MEANING_DICTIONARY[rootKey][lang === "bn" ? "bn" : "en"];
                transMeaningCandidates.push(...dictWords);
              }
            });

            const transliterationStr = words
              .map((w: any) => w.transliteration?.text)
              .filter(Boolean)
              .join(" ");

            const translationStr = v.translations?.[0]?.text
              ? v.translations[0].text
                  .replace(/<[^>]*>?/gm, "")
                  .replace(/\[\d+\]/g, "")
              : "";

            return {
              surah: s,
              ayah: a,
              text_uthmani: v.text_uthmani || hit.text,
              transliteration: transliterationStr,
              matchedTransliterations: transCandidates,
              translation: translationStr,
              matchedTranslations: transMeaningCandidates,
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
              {t("wordSearch")}
            </span>
          </DialogTitle>
          <DialogDescription>
            এই শব্দ বা মূল অক্ষর সম্বলিত আয়াতসমূহ (শব্দ, উচ্চারণ ও অর্থ হাইলাইট করা হয়েছে):
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

        <div className="mt-3 space-y-4">
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

              {/* ২. উচ্চারণ (Transliteration হাইলাইটেড) */}
              {v.transliteration && (
                <div className="rounded bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground/80">উচ্চারণ: </span>
                  <span className="italic">
                    {highlightTextWithCandidates(v.transliteration, v.matchedTransliterations)}
                  </span>
                </div>
              )}

              {/* ৩. পূর্ণ অর্থ/অনুবাদ (Translation স্মার্ট হাইলাইটেড) */}
              {v.translation && (
                <div className="border-l-2 border-primary/60 pl-3 py-0.5">
                  <p className="text-xs font-semibold text-primary mb-0.5">
                    {lang === "bn" ? "অনুবাদ:" : "Translation:"}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {highlightTextWithCandidates(v.translation, v.matchedTranslations)}
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