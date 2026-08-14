import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { localNumber } from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Strip Arabic diacritics and normalize characters for accurate search */
function normalizeArabic(text: string) {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u0652\u0670\u06D6-\u06ED\u0640]/g, "") // Remove harakat/diacritics
    .replace(/[أإآٱ]/g, "ا") // Normalize Alif
    .replace(/ى/g, "ي") // Normalize Alif Maqsoora
    .replace(/ة/g, "ه") // Normalize Ta Marbootah
    .trim();
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
    queryKey: ["word-search-full-v4", rawWord, normalized, lang],
    enabled: !!rawWord,
    queryFn: async () => {
      // Step 1: Try local Supabase database search
      try {
        const { data, error } = await supabase
          .from("quran_verses")
          .select("surah, ayah, text_uthmani, bn_text, en_text")
          .ilike("text_uthmani", `%${normalized}%`)
          .order("surah")
          .order("ayah")
          .limit(40);

        if (!error && data && data.length > 0) {
          return data.map((v) => ({
            surah: v.surah,
            ayah: v.ayah,
            text_uthmani: v.text_uthmani,
            translation: lang === "bn" ? v.bn_text : v.en_text,
          }));
        }
      } catch (e) {
        console.warn("Supabase local search fallback to Quran API", e);
      }

      // Step 2: Fallback to Quran.com Official API v4 (fetches verse text + translation + transliteration)
      const searchTarget = normalized || rawWord;
      const response = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(
          searchTarget
        )}&size=40&language=${lang === "bn" ? "bn" : "en"}`
      );

      if (!response.ok) {
        throw new Error("Search API failed");
      }

      const resData = await response.json();
      const hits = resData?.search?.results || [];

      return hits.map((hit: any) => {
        const [s, a] = hit.verse_key.split(":").map(Number);
        const words = hit.words || [];
        const transliterationStr = words
          .map((w: any) => w.transliteration?.text)
          .filter(Boolean)
          .join(" ");

        return {
          surah: s,
          ayah: a,
          text_uthmani: hit.text,
          transliteration: transliterationStr || undefined,
          translation: hit.translations?.[0]?.text
            ? hit.translations[0].text.replace(/<[^>]*>?/gm, "")
            : "",
        };
      });
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
            এই শব্দ বা মূল অক্ষর সম্বলিত আয়াতগুলো এবং তাদের উচ্চারণ ও অর্থ নিচে দেখানো হলো:
          </DialogDescription>
        </DialogHeader>

        {results.isLoading && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            আয়াত ও অর্থ লোড হচ্ছে...
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

        <div className="space-y-4 mt-2">
          {results.data?.map((v) => (
            <div
              key={`${v.surah}:${v.ayah}`}
              className="rounded-lg border border-border/80 bg-card p-4 space-y-3 shadow-xs"
            >
              {/* হেডলাইন: সুরা ও আয়াত নম্বর উইথ লিঙ্ক */}
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {lang === "bn" ? "আয়াত নম্বর:" : "Verse:"}
                </span>
                <Link
                  to="/surah/$id"
                  params={{ id: String(v.surah) }}
                  hash={`ayah-${v.ayah}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  সুরা {localNumber(v.surah, lang)} : আয়াত {localNumber(v.ayah, lang)} ➔
                </Link>
              </div>

              {/* ১. আরবি পাঠ */}
              <p className="arabic text-right text-2xl leading-relaxed text-foreground">
                {v.text_uthmani}
              </p>

              {/* ২. উচ্চারণ (Transliteration) */}
              {v.transliteration && (
                <p className="text-xs italic text-muted-foreground leading-normal bg-muted/30 p-2 rounded">
                  <span className="font-semibold non-italic">উচ্চারণ:</span> {v.transliteration}
                </p>
              )}

              {/* ৩. অর্থ/অনুবাদ (Translation) */}
              {v.translation && (
                <div className="border-l-3 border-primary/60 pl-3 pt-1">
                  <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide mb-0.5">
                    {lang === "bn" ? "অনুবাদ:" : "Translation:"}
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
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