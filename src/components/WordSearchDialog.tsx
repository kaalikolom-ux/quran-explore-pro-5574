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
    queryKey: ["word-search-v3", rawWord, normalized, lang],
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
          .limit(50);

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

      // Step 2: Fallback to Quran.com Official API v4 with transliteration & translation
      const searchTarget = normalized || rawWord;
      const transResource = lang === "bn" ? "163" : "131"; // 163: Bengali, 131: Sahih International

      const response = await fetch(
        `https://api.quran.com/api/v4/search?q=${encodeURIComponent(
          searchTarget
        )}&size=50&language=${lang === "bn" ? "bn" : "en"}`
      );

      if (!response.ok) {
        throw new Error("Search API failed");
      }

      const resData = await response.json();
      const hits = resData?.search?.results || [];

      // Fetch additional transliteration details if needed
      const parsedResults: VerseResult[] = hits.map((hit: any) => {
        const [s, a] = hit.verse_key.split(":").map(Number);
        
        // Extract transliteration from words if available in hit
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

      return parsedResults;
    },
  });

  return (
    <Dialog open={!!word} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="arabic text-2xl text-primary">{word}</span>
            <span className="text-sm font-normal text-muted-foreground">{t("wordSearch")}</span>
          </DialogTitle>
          <DialogDescription>
            {t("wordSearchHint")} · {t("searchInDb")}
          </DialogDescription>
        </DialogHeader>

        {results.isLoading && <p className="py-4 text-center text-sm text-muted-foreground">{t("loading")}</p>}
        {results.isError && <p className="py-4 text-center text-sm text-destructive">{t("error")}</p>}
        {results.data && results.data.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">{t("noWordResults")}</p>
        )}

        <ul className="divide-y divide-border">
          {results.data?.map((v) => (
            <li key={`${v.surah}:${v.ayah}`} className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <Link
                  to="/surah/$id"
                  params={{ id: String(v.surah) }}
                  hash={`ayah-${v.ayah}`}
                  onClick={onClose}
                  className="rounded bg-accent/60 px-2.5 py-1 text-xs font-semibold text-primary hover:underline"
                >
                  সুরা {localNumber(v.surah, lang)} : আয়াত {localNumber(v.ayah, lang)} ➔
                </Link>
              </div>

              {/* আরবি টেক্সট */}
              <p className="arabic text-right text-2xl leading-loose text-foreground">
                {v.text_uthmani}
              </p>

              {/* উচ্চারণ (Transliteration) */}
              {v.transliteration && (
                <p className="text-xs italic text-muted-foreground/80 leading-relaxed">
                  উচ্চারণ: {v.transliteration}
                </p>
              )}

              {/* অনুবাদ/অর্থ (Translation) */}
              {v.translation && (
                <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-primary/40 pl-3">
                  {v.translation}
                </p>
              )}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}