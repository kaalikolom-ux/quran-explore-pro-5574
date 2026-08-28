import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { ALL_SURAHS_DATABASE } from "./quranSearchEngine";

const API = "https://api.quran.com/api/v4";

export type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: string;
  translated_name: { name: string };
};

export type QWord = {
  id: number;
  position: number;
  char_type_name: string;
  text_uthmani?: string;
  translation: { text: string };
  transliteration: { text: string | null };
};

export type Verse = {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  words: QWord[];
  translations: { resource_id: number; text: string }[];
};

export const BN_TRANSLATION_ID = 161; // Taisirul Quran
export const EN_TRANSLATION_ID = 19; // M. Pickthall

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Quran API error ${res.status}`);
  return (await res.json()) as T;
}

/** Read the local (Supabase) mirror first so the app works offline. */
async function mirrorChapters(): Promise<Chapter[] | null> {
  try {
    const { data, error } = await supabase
      .from("quran_chapters")
      .select("id, name_simple, name_arabic, translated_name, verses_count, revelation_place")
      .order("id");
    if (error || !data || data.length < 114) return null;
    return data.map((c) => ({
      id: c.id,
      name_simple: c.name_simple,
      name_arabic: c.name_arabic,
      verses_count: c.verses_count,
      revelation_place: c.revelation_place ?? "",
      translated_name: { name: c.translated_name },
    }));
  } catch {
    return null;
  }
}

async function mirrorVerses(surah: number): Promise<Verse[] | null> {
  try {
    const { data, error } = await supabase
      .from("quran_verses")
      .select("surah, ayah, text_uthmani, words, bn_text, en_text")
      .eq("surah", surah)
      .order("ayah");
    if (error || !data || data.length === 0) return null;
    return data.map((v) => ({
      id: v.surah * 1000 + v.ayah,
      verse_number: v.ayah,
      verse_key: `${v.surah}:${v.ayah}`,
      text_uthmani: v.text_uthmani,
      words: (v.words as unknown as QWord[]) ?? [],
      translations: [
        { resource_id: BN_TRANSLATION_ID, text: v.bn_text ?? "" },
        { resource_id: EN_TRANSLATION_ID, text: v.en_text ?? "" },
      ],
    }));
  } catch {
    return null;
  }
}

/** Fetch local static surah json from /data/quran/surahs/${surah}.json for zero network latency */
async function localSurahJson(surah: number): Promise<Verse[] | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(`/data/quran/surahs/${surah}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.ayahs || data.ayahs.length === 0) return null;
    return data.ayahs.map((a: any) => ({
      id: a.surah * 1000 + a.ayah,
      verse_number: a.ayah,
      verse_key: `${a.surah}:${a.ayah}`,
      text_uthmani: a.words?.map((w: any) => w.text_uthmani).join(" ") || "",
      words: (a.words || []).map((w: any) => ({
        id: w.id,
        position: w.position,
        char_type_name: "word",
        text_uthmani: w.text_uthmani,
        translation: { text: w.translation_bn || "" },
        transliteration: { text: w.transliteration || "" },
        root: w.root,
        lemma: w.lemma,
        grammar_bn: w.grammar_bn,
      })),
      translations: [
        { resource_id: BN_TRANSLATION_ID, text: a.translation_bn || "" },
        { resource_id: EN_TRANSLATION_ID, text: a.translation_en || "" },
      ],
    }));
  } catch {
    return null;
  }
}

export const chaptersQuery = (lang: "bn" | "en") =>
  queryOptions({
    queryKey: ["quran", "chapters", lang],
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      // 1. Instant load from local ALL_SURAHS_DATABASE
      if (ALL_SURAHS_DATABASE && ALL_SURAHS_DATABASE.length === 114) {
        return ALL_SURAHS_DATABASE.map((s) => ({
          id: s.id,
          name_simple: s.name_en,
          name_arabic: s.name_arabic,
          verses_count: s.total_verses,
          revelation_place: s.type === "Meccan" ? "makkah" : "madinah",
          translated_name: { name: lang === "bn" ? s.meaning_bn : s.meaning_en },
        }));
      }

      try {
        const mirrored = await mirrorChapters();
        if (mirrored && mirrored.length >= 114) return mirrored;
        const data = await getJson<{ chapters: Chapter[] }>(`${API}/chapters?language=${lang}`);
        if (data?.chapters && data.chapters.length > 0) {
          return data.chapters;
        }
      } catch (err) {
        console.warn("Chapters API fallback activated:", err);
      }
      return (ALL_SURAHS_DATABASE || []).map((s) => ({
        id: s.id,
        name_simple: s.name_en,
        name_arabic: s.name_arabic,
        verses_count: s.total_verses,
        revelation_place: s.type === "Meccan" ? "makkah" : "madinah",
        translated_name: { name: lang === "bn" ? s.meaning_bn : s.meaning_en },
      }));
    },
  });

export const versesQuery = (surah: number, lang: "bn" | "en") =>
  queryOptions({
    queryKey: ["quran", "verses", surah, lang],
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      // 1. Instant load from local bundled json
      const localData = await localSurahJson(surah);
      if (localData && localData.length > 0) return localData;

      // 2. Fallback to Supabase mirrored database
      const mirrored = await mirrorVerses(surah);
      if (mirrored && mirrored.length > 0) return mirrored;

      // 3. Fallback to Quran API
      const params = new URLSearchParams({
        words: "true",
        language: lang,
        word_fields: "text_uthmani,transliteration",
        fields: "text_uthmani",
        translations: `${BN_TRANSLATION_ID},${EN_TRANSLATION_ID}`,
        per_page: "300",
      });
      const data = await getJson<{ verses: Verse[] }>(
        `${API}/verses/by_chapter/${surah}?${params.toString()}`,
      );
      return data.verses;
    },
  });

export function stripHtml(input: string) {
  return input.replace(/<sup[^>]*>.*?<\/sup>/g, "").replace(/<[^>]+>/g, "");
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function localNumber(value: number | string, lang: "bn" | "en") {
  if (lang === "en") return String(value);
  return String(value)
    .split("")
    .map((c) => (/\d/.test(c) ? BN_DIGITS[Number(c)] : c))
    .join("");
}

// Mishary Rashid Al-Afasy (quran.com recitation id 7)
export const AFASY_RECITATION_ID = 7;
export const audioQuery = (surah: number) =>
  queryOptions({
    queryKey: ["quran", "audio", AFASY_RECITATION_ID, surah],
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      // Direct local generation without ANY external API call (100% independent & offline-ready)
      const meta = ALL_SURAHS_DATABASE.find((s) => s.id === surah);
      const totalVerses = meta?.total_verses || 7;
      const sStr = String(surah).padStart(3, "0");
      const map: Record<number, string> = {};
      for (let a = 1; a <= totalVerses; a++) {
        const aStr = String(a).padStart(3, "0");
        map[a] = `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;
      }
      return map;
    },
  });
