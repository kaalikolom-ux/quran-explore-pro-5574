import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Edit3,
  Check,
  X,
  BookMarked,
  Languages,
  Layers,
  FileText,
  Volume2,
  BookmarkCheck,
  Search,
  Navigation,
  Loader2,
  ExternalLink,
  Play,
  Pause,
  Bookmark,
  Copy,
  Share2,
  StickyNote,
  Trash2,
  Download,
  CheckCircle2,
  FileAudio,
  Repeat,
  Square,
  Cpu,
  Scale,
  Compass,
} from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { useBookmarks, type BookmarkTarget } from "@/lib/bookmarks";
import { useIsAdmin } from "@/lib/auth";
import { getSurahMeaning, saveCustomSurahMeaning, type SurahMeaningItem } from "@/lib/surahMeaningsData";
import { getSurahConsistency, saveCustomSurahConsistency, type SurahConsistencyItem } from "@/lib/surahConsistencyData";
import { 
  resolveAudioSrc, 
  downloadSurahAudio, 
  isSurahAudioDownloaded, 
  isAudioSavedOffline, 
  saveAudioOffline, 
  deleteAudioOffline, 
  saveSurahOffline, 
  getSurahOffline, 
  AUDIO_CACHE, 
  SURAH_TEXT_CACHE 
} from "@/lib/offline";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SurahSearchParams = {
  ayah?: number;
};

const SURAH_META_MAP: Record<number, { name_bn: string; name_ar: string; type: string; total: number }> = {
  1: { name_bn: "আল-ফাতিহা", name_ar: "الفاتحة", type: "মাক্কী", total: 7 },
  2: { name_bn: "আল-বাকারাহ", name_ar: "البقرة", type: "মাদানী", total: 286 },
  3: { name_bn: "আলে ইমরান", name_ar: "آل عمران", type: "মাদানী", total: 200 },
  4: { name_bn: "আন-নিসা", name_ar: "النساء", type: "মাদানী", total: 176 },
  5: { name_bn: "আল-মায়িদাহ", name_ar: "المائدة", type: "মাদানী", total: 120 },
  6: { name_bn: "আল-আনআম", name_ar: "الأنعام", type: "মাক্কী", total: 165 },
  7: { name_bn: "আল-আরাফ", name_ar: "الأعراف", type: "মাক্কী", total: 206 },
  8: { name_bn: "আল-আনফাল", name_ar: "الأنفال", type: "মাদানী", total: 75 },
  9: { name_bn: "আত-তাওবাহ", name_ar: "التوبة", type: "মাদানী", total: 129 },
  10: { name_bn: "ইউনুস", name_ar: "يونس", type: "মাক্কী", total: 109 },
  11: { name_bn: "হুদ", name_ar: "هود", type: "মাক্কী", total: 123 },
  12: { name_bn: "ইউসুফ", name_ar: "يوسف", type: "মাক্কী", total: 111 },
  13: { name_bn: "আর-রাদ", name_ar: "الرعد", type: "মাদানী", total: 43 },
  14: { name_bn: "ইবরাহিম", name_ar: "إبراهيم", type: "মাক্কী", total: 52 },
  15: { name_bn: "আল-হিজর", name_ar: "الحجر", type: "মাক্কী", total: 99 },
  16: { name_bn: "আন-নাহল", name_ar: "النحل", type: "মাক্কী", total: 128 },
  17: { name_bn: "আল-ইসরা", name_ar: "الإسراء", type: "মাক্কী", total: 111 },
  18: { name_bn: "আল-কাহফ", name_ar: "الكهف", type: "মাক্কী", total: 110 },
  19: { name_bn: "মারিয়াম", name_ar: "مريم", type: "মাক্কী", total: 98 },
  20: { name_bn: "ত্বা-হা", name_ar: "طه", type: "মাক্কী", total: 135 },
  21: { name_bn: "আল-আম্বিয়া", name_ar: "الأنبياء", type: "মাক্কী", total: 112 },
  22: { name_bn: "আল-হাজ্জ", name_ar: "الحج", type: "মাদানী", total: 78 },
  23: { name_bn: "আল-মুমিনুন", name_ar: "المؤمنون", type: "মাক্কী", total: 118 },
  24: { name_bn: "আন-নুর", name_ar: "النور", type: "মাদানী", total: 64 },
  25: { name_bn: "আল-ফুরকান", name_ar: "الفرقان", type: "মাক্কী", total: 77 },
  26: { name_bn: "আশ-শুয়ারা", name_ar: "الشعراء", type: "মাক্কী", total: 227 },
  27: { name_bn: "আন-নামল", name_ar: "النمل", type: "মাক্কী", total: 93 },
  28: { name_bn: "আল-কাসাস", name_ar: "القصص", type: "মাক্কী", total: 88 },
  29: { name_bn: "আল-আনকাবুত", name_ar: "العنكبوت", type: "মাক্কী", total: 69 },
  30: { name_bn: "আর-রুম", name_ar: "الروم", type: "মাক্কী", total: 60 },
  31: { name_bn: "লুকমান", name_ar: "لقمان", type: "মাক্কী", total: 34 },
  32: { name_bn: "আস-সাজদাহ", name_ar: "السجدة", type: "মাক্কী", total: 30 },
  33: { name_bn: "আল-আহযাব", name_ar: "الأحزاب", type: "মাদানী", total: 73 },
  34: { name_bn: "সাবা", name_ar: "سبإ", type: "মাক্কী", total: 54 },
  35: { name_bn: "ফাতির", name_ar: "فاطر", type: "মাক্কী", total: 45 },
  36: { name_bn: "ইয়াসিন", name_ar: "يس", type: "মাক্কী", total: 83 },
  37: { name_bn: "আস-সাফফাত", name_ar: "الصافات", type: "মাক্কী", total: 182 },
  38: { name_bn: "সোয়াদ", name_ar: "ص", type: "মাক্কী", total: 88 },
  39: { name_bn: "আজ-জুমার", name_ar: "الزمر", type: "মাক্কী", total: 75 },
  40: { name_bn: "গাফির", name_ar: "غافر", type: "মাক্কী", total: 85 },
  41: { name_bn: "ফুসসিলাত", name_ar: "فصلت", type: "মাক্কী", total: 54 },
  42: { name_bn: "আশ-শুরা", name_ar: "الشورى", type: "মাক্কী", total: 53 },
  43: { name_bn: "আজ-জুখরূফ", name_ar: "الزخرف", type: "মাক্কী", total: 89 },
  44: { name_bn: "আদ-দুখান", name_ar: "الدخان", type: "মাক্কী", total: 59 },
  45: { name_bn: "আল-জাসিয়াহ", name_ar: "الجاثية", type: "মাক্কী", total: 37 },
  46: { name_bn: "আল-আহকাফ", name_ar: "الأحقاف", type: "মাক্কী", total: 35 },
  47: { name_bn: "মুহাম্মদ", name_ar: "محمد", type: "মাদানী", total: 38 },
  48: { name_bn: "আল-ফাতহ", name_ar: "الفتح", type: "মাদানী", total: 29 },
  49: { name_bn: "আল-হুজুরাত", name_ar: "الحجرات", type: "মাদানী", total: 18 },
  50: { name_bn: "কাফ", name_ar: "ق", type: "মাক্কী", total: 45 },
  51: { name_bn: "আজ-যারিয়াত", name_ar: "الذاريات", type: "মাক্কী", total: 60 },
  52: { name_bn: "আত-তুর", name_ar: "الطور", type: "মাক্কী", total: 49 },
  53: { name_bn: "আন-নাজম", name_ar: "النجم", type: "মাক্কী", total: 62 },
  54: { name_bn: "আল-কামার", name_ar: "القمر", type: "মাক্কী", total: 55 },
  55: { name_bn: "আর-রাহমান", name_ar: "الرحمن", type: "মাদানী", total: 78 },
  56: { name_bn: "আল-ওয়াকিয়াহ", name_ar: "الواقعة", type: "মাক্কী", total: 96 },
  57: { name_bn: "আল-হাদিদ", name_ar: "الحديد", type: "মাদানী", total: 29 },
  58: { name_bn: "আল-মুজাদালাহ", name_ar: "المجادلة", type: "মাদানী", total: 22 },
  59: { name_bn: "আল-হাশর", name_ar: "الحشر", type: "মাদানী", total: 24 },
  60: { name_bn: "আল-মুমতাহানাহ", name_ar: "الممتحنة", type: "মাদানী", total: 13 },
  61: { name_bn: "আস-সফ", name_ar: "الصف", type: "মাদানী", total: 14 },
  62: { name_bn: "আল-জুমুআহ", name_ar: "الجمعة", type: "মাদানী", total: 11 },
  63: { name_bn: "আল-মুনাফিকুন", name_ar: "المنافقون", type: "মাদানী", total: 11 },
  64: { name_bn: "আত-তাগাবুন", name_ar: "التغابن", type: "মাদানী", total: 18 },
  65: { name_bn: "আত-ত্বালাক", name_ar: "الطلاق", type: "মাদানী", total: 12 },
  66: { name_bn: "আত-তাহরিম", name_ar: "التحريم", type: "মাদানী", total: 12 },
  67: { name_bn: "আল-মুলক", name_ar: "الملك", type: "মাক্কী", total: 30 },
  68: { name_bn: "আল-কলম", name_ar: "القلم", type: "মাক্কী", total: 52 },
  69: { name_bn: "আল-হাক্কাহ", name_ar: "الحاقة", type: "মাক্কী", total: 52 },
  70: { name_bn: "আল-মাআরিজ", name_ar: "المعارج", type: "মাক্কী", total: 44 },
  71: { name_bn: "নুহ", name_ar: "نوح", type: "মাক্কী", total: 28 },
  72: { name_bn: "আল-জ্বিন", name_ar: "الجن", type: "মাক্কী", total: 28 },
  73: { name_bn: "আল-মুযযাম্মিল", name_ar: "المزمل", type: "মাক্কী", total: 20 },
  74: { name_bn: "আল-মুদ্দাসসির", name_ar: "المدثر", type: "মাক্কী", total: 56 },
  75: { name_bn: "আল-কিয়ামাহ", name_ar: "القيامة", type: "মাক্কী", total: 40 },
  76: { name_bn: "আল-ইনসান", name_ar: "الإنسان", type: "মাদানী", total: 31 },
  77: { name_bn: "আল-মুরসালাত", name_ar: "المرسلات", type: "মাক্কী", total: 50 },
  78: { name_bn: "আন-নাবা", name_ar: "النبإ", type: "মাক্কী", total: 40 },
  79: { name_bn: "আন-নাযিয়াত", name_ar: "النازعات", type: "মাক্কী", total: 46 },
  80: { name_bn: "আবাসা", name_ar: "عبس", type: "মাক্কী", total: 42 },
  81: { name_bn: "আত-তাকভীর", name_ar: "التکویر", type: "মাক্কী", total: 29 },
  82: { name_bn: "আল-ইনফিতার", name_ar: "الانفطار", type: "মাক্কী", total: 19 },
  83: { name_bn: "আল-মুতাফফিফিন", name_ar: "المطففين", type: "মাক্কী", total: 36 },
  84: { name_bn: "আল-ইনশিকাক", name_ar: "الانشقاق", type: "মাক্কী", total: 25 },
  85: { name_bn: "আল-বুরূজ", name_ar: "البروج", type: "মাক্কী", total: 22 },
  86: { name_bn: "আত-তারিক", name_ar: "الطارق", type: "মাক্কী", total: 17 },
  87: { name_bn: "আল-আলা", name_ar: "الأعلى", type: "মাক্কী", total: 19 },
  88: { name_bn: "আল-গাশিয়াহ", name_ar: "الغاشية", type: "মাক্কী", total: 26 },
  89: { name_bn: "আল-ফাজর", name_ar: "الفجر", type: "মাক্কী", total: 30 },
  90: { name_bn: "আল-বালাদ", name_ar: "البلد", type: "মাক্কী", total: 20 },
  91: { name_bn: "আশ-শামস", name_ar: "الشمس", type: "মাক্কী", total: 15 },
  92: { name_bn: "আল-লাইল", name_ar: "الليل", type: "মাক্কী", total: 21 },
  93: { name_bn: "আদ-দুহা", name_ar: "الضحى", type: "মাক্কী", total: 11 },
  94: { name_bn: "আশ-শারহ", name_ar: "الشرح", type: "মাক্কী", total: 8 },
  95: { name_bn: "আত-তীন", name_ar: "التين", type: "মাক্কী", total: 8 },
  96: { name_bn: "আল-আলাক", name_ar: "العلق", type: "মাক্কী", total: 19 },
  97: { name_bn: "আল-কদর", name_ar: "القدر", type: "মাক্কী", total: 5 },
  98: { name_bn: "আল-বাইয়িনাহ", name_ar: "البينة", type: "মাদানী", total: 8 },
  99: { name_bn: "আল-যিলযাল", name_ar: "الزلزلة", type: "মাদানী", total: 8 },
  100: { name_bn: "আল-আদিয়াত", name_ar: "العاديات", type: "মাক্কী", total: 11 },
  101: { name_bn: "আল-কারিয়াহ", name_ar: "القارعة", type: "মাক্কী", total: 11 },
  102: { name_bn: "আত-তাকাসুর", name_ar: "التكاثر", type: "মাক্কী", total: 8 },
  103: { name_bn: "আল-আসর", name_ar: "العصر", type: "মাক্কী", total: 3 },
  104: { name_bn: "আল-হুমাযাহ", name_ar: "الهمزة", type: "মাক্কী", total: 9 },
  105: { name_bn: "আল-ফীল", name_ar: "الفيل", type: "মাক্কী", total: 5 },
  106: { name_bn: "কুরাইশ", name_ar: "قريش", type: "মাক্কী", total: 4 },
  107: { name_bn: "আল-মাউন", name_ar: "الماعون", type: "মাক্কী", total: 7 },
  108: { name_bn: "আল-কাউসার", name_ar: "الکوثر", type: "মাক্কী", total: 3 },
  109: { name_bn: "আল-কাফিরুন", name_ar: "الكافرون", type: "মাক্কী", total: 6 },
  110: { name_bn: "আন-নাসর", name_ar: "النصر", type: "মাদানী", total: 3 },
  111: { name_bn: "আল-লাহাব", name_ar: "المسد", type: "মাক্কী", total: 5 },
  112: { name_bn: "আল-ইখলাস", name_ar: "الإخلاص", type: "মাক্কী", total: 4 },
  113: { name_bn: "আল-ফালাক", name_ar: "الفلق", type: "মাক্কী", total: 5 },
  114: { name_bn: "আন-নাস", name_ar: "الناس", type: "মাক্কী", total: 6 },
};

export const Route = createFileRoute("/surah/$id")({
  validateSearch: (search: Record<string, unknown>): SurahSearchParams => {
    return {
      ayah: search.ayah ? Number(search.ayah) : undefined,
    };
  },
  head: ({ params }) => {
    const sId = Number(params.id) || 1;
    const metaObj = SURAH_META_MAP[sId] || { name_bn: `সুরা ${sId}`, name_ar: "", type: "কুরআন", total: 0 };
    const pageTitle = `সুরা ${metaObj.name_bn} (${metaObj.name_ar}) — শব্দে শব্দে অর্থ ও অনুবাদ | কুরআন অন্বেষা`;
    const pageDesc = `পবিত্র কুরআনের সুরা ${metaObj.name_bn} (${metaObj.type}, আয়াত ${metaObj.total}) এর প্রতিটি শব্দের বাংলা অর্থ, উচ্চারণ, প্রামাণ্য অনুবাদ ও গভীর ব্যাকরণগত ব্যাখ্যা পড়ুন।`;

    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: pageDesc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://wooniche.com/surah/${sId}` },
        { property: "og:site_name", content: "কুরআন অন্বেষা — Quran Explorer" },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: pageDesc },
        { property: "og:image", content: "https://wooniche.com/og-image.jpg" },
        { property: "og:image:secure_url", content: "https://wooniche.com/og-image.jpg" },
        { property: "og:image:type", content: "image/jpeg" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "পবিত্র কুরআন — বুঝে পড়ুন | কুরআন অন্বেষা" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: pageDesc },
        { name: "twitter:image", content: "https://wooniche.com/og-image.jpg" },
      ],
      links: [
        { rel: "canonical", href: `https://wooniche.com/surah/${sId}` },
      ],
    };
  },
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
  text_uthmani?: string;
  transliteration?: string;
  conventional_bn?: string;
  conventional_en?: string;
  translation_bn?: string;
  translation_en?: string;
  core_meaning_bn?: string;
  core_meaning_en?: string;
  modern_translation_bn?: string;
  modern_translation_en?: string;
  lexicon_modern_notes?: string;
  meta_bn?: string;
  meta_en?: string;
  words: QuranWord[];
};

export type SurahData = {
  surah: number;
  ayahs: QuranAyah[];
};

function toEnglishNumber(str: string): string {
  const bnToEn: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  return str.replace(/[০-৯]/g, (d) => bnToEn[d] || d);
}

function formatNumber(num: number | string, lang: string) {
  if (lang !== "bn") return String(num);
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

function cleanArabicText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "")
    .replace(/[ٱإأآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[\s\-\.\,\/]/g, "")
    .trim();
}

function extractIntelligentRoot(wordObj: QuranWord): string {
  if (wordObj.root && wordObj.root !== "—" && wordObj.root.trim().length > 0) {
    return cleanArabicText(wordObj.root);
  }

  let base = cleanArabicText(wordObj.lemma || wordObj.text_uthmani);
  if (!base) return "";

  if (base.startsWith("ال") && base.length > 4) base = base.slice(2);
  if ((base.startsWith("و") || base.startsWith("ف") || base.startsWith("ব") || base.startsWith("ل") || base.startsWith("س") || base.startsWith("ك")) && base.length > 4) {
    base = base.slice(1);
  }
  if (base.startsWith("ال") && base.length > 4) base = base.slice(2);

  if ((base.endsWith("ون") || base.endsWith("ين") || base.endsWith("ات") || base.endsWith("هم") || base.endsWith("كم") || base.endsWith("না") || base.endsWith("হা")) && base.length > 4) {
    base = base.slice(0, -2);
  } else if ((base.endsWith("ه") || base.endsWith("ي") || base.endsWith("ك")) && base.length > 3) {
    base = base.slice(0, -1);
  }

  if ((base.startsWith("م") || base.startsWith("ت") || base.startsWith("ي") || base.startsWith("ন") || base.startsWith("ا")) && base.length === 4) {
    base = base.slice(1);
  }

  return base;
}

const applyLocalMetaOverrides = (sId: number, data: SurahData) => {
  if (typeof window !== "undefined" && data?.ayahs) {
    data.ayahs.forEach((a) => {
      try {
        const saved = localStorage.getItem(`quran_ayah_meta_${sId}_${a.ayah}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.meta_bn && typeof parsed.meta_bn === "string" && parsed.meta_bn.trim().length > 0) {
            a.meta_bn = parsed.meta_bn.trim();
          }
          if (parsed.meta_en && typeof parsed.meta_en === "string" && parsed.meta_en.trim().length > 0) {
            a.meta_en = parsed.meta_en.trim();
          }
          if (parsed.core_meaning_bn && typeof parsed.core_meaning_bn === "string" && parsed.core_meaning_bn.trim().length > 0) {
            a.core_meaning_bn = parsed.core_meaning_bn.trim();
          }
          if (parsed.core_meaning_en && typeof parsed.core_meaning_en === "string" && parsed.core_meaning_en.trim().length > 0) {
            a.core_meaning_en = parsed.core_meaning_en.trim();
          }
          if (parsed.modern_translation_bn && typeof parsed.modern_translation_bn === "string" && parsed.modern_translation_bn.trim().length > 0) {
            a.modern_translation_bn = parsed.modern_translation_bn.trim();
          }
          if (parsed.modern_translation_en && typeof parsed.modern_translation_en === "string" && parsed.modern_translation_en.trim().length > 0) {
            a.modern_translation_en = parsed.modern_translation_en.trim();
          }
          if (parsed.lexicon_modern_notes && typeof parsed.lexicon_modern_notes === "string" && parsed.lexicon_modern_notes.trim().length > 0) {
            a.lexicon_modern_notes = parsed.lexicon_modern_notes.trim();
          }
          if (parsed.conventional_bn && typeof parsed.conventional_bn === "string" && parsed.conventional_bn.trim().length > 0) {
            a.conventional_bn = parsed.conventional_bn.trim();
          }
          if (parsed.conventional_en && typeof parsed.conventional_en === "string" && parsed.conventional_en.trim().length > 0) {
            a.conventional_en = parsed.conventional_en.trim();
          }
        }
      } catch {}
    });
  }
  return data;
};

const APP_DATA_VERSION = "20260903_v3_core";

const fetchSurahData = async (sId: number): Promise<SurahData> => {
  // 1. Fetch directly from local static JSON (Cloudflare Edge CDN / ServiceWorker Cache)
  const url = `/data/quran/surahs/${sId}.json?v=${APP_DATA_VERSION}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const freshData: SurahData = await res.json();
      applyLocalMetaOverrides(sId, freshData);
      // Persist to IndexedDB for offline use
      await saveSurahOffline(sId, freshData);
      return freshData;
    }
  } catch (err) {
    console.warn(`Static fetch failed for Surah ${sId}, checking offline storage...`, err);
  }

  // 2. Offline fallback (IndexedDB + Cache Storage)
  const offlineData = await getSurahOffline(sId);
  if (offlineData?.ayahs && offlineData.ayahs.length > 0) {
    return applyLocalMetaOverrides(sId, offlineData);
  }

  // 3. Fallback to unversioned static path
  const fallbackRes = await fetch(`/data/quran/surahs/${sId}.json`);
  if (fallbackRes.ok) {
    const freshData: SurahData = await fallbackRes.json();
    applyLocalMetaOverrides(sId, freshData);
    await saveSurahOffline(sId, freshData);
    return freshData;
  }

  throw new Error(`Failed to load Surah ${sId}`);
};

const fetchSurahInitData = async (sId: number): Promise<SurahData> => {
  // 1. Offline fallback (IndexedDB) - if user has visited or downloaded before, instant!
  try {
    const offlineData = await getSurahOffline(sId);
    if (offlineData?.ayahs && offlineData.ayahs.length > 0) {
      return applyLocalMetaOverrides(sId, offlineData);
    }
  } catch {}

  // 2. Fetch lightweight init JSON (~15 KB, first 5 ayahs)
  const initUrl = `/data/quran/surahs/init/${sId}.json?v=${APP_DATA_VERSION}`;
  try {
    const res = await fetch(initUrl);
    if (res.ok) {
      const initData: SurahData = await res.json();
      return applyLocalMetaOverrides(sId, initData);
    }
  } catch (err) {
    console.warn(`Init fetch failed for Surah ${sId}, falling back to full static...`, err);
  }

  // 3. Fallback to full static
  return fetchSurahData(sId);
};

const AyahJumpSearchForm = React.memo(function AyahJumpSearchForm({
  surahId,
  totalAyahs,
  onNavigate,
  onScrollToAyah,
}: {
  surahId: number;
  totalAyahs: number;
  onNavigate: (targetSurah: number, targetAyah?: number) => void;
  onScrollToAyah: (ayah: number) => void;
}) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = text.trim();
    if (!raw) return;

    const normalized = toEnglishNumber(raw);
    const match = normalized.match(/^(\d{1,3})[:\/ঃ\.\-](\d{1,3})$/);

    if (match) {
      const targetSurah = Number(match[1]);
      const targetAyah = Number(match[2]);

      if (targetSurah >= 1 && targetSurah <= 114) {
        if (targetSurah === surahId) {
          onScrollToAyah(targetAyah);
        } else {
          onNavigate(targetSurah, targetAyah);
        }
      }
      setText("");
      return;
    }

    const singleNum = Number(normalized);
    if (!isNaN(singleNum) && singleNum > 0) {
      if (singleNum <= totalAyahs && singleNum > 114) {
        onScrollToAyah(singleNum);
        setText("");
        return;
      }
      if (singleNum <= 114) {
        onNavigate(singleNum);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setText("");
        return;
      }
      if (singleNum <= totalAyahs) {
        onScrollToAyah(singleNum);
        setText("");
        return;
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1 bg-muted/50 border border-border/70 rounded-lg px-2 py-1 focus-within:border-foreground/30 transition-all shrink-0"
    >
      <Search className="size-3 text-muted-foreground shrink-0" />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="৩৩/৪০ বা ১-১১৪..."
        className="bg-transparent border-none outline-none text-xs w-16 sm:w-24 text-foreground placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground hover:bg-muted transition-colors border border-border/50 cursor-pointer"
      >
        যান
      </button>
    </form>
  );
});

interface AyahCardProps {
  ayah: QuranAyah;
  surahId: number;
  isPlaying: boolean;
  isBookmarked: boolean;
  isAyahAudioSaved: boolean;
  isThisAyahDownloading: boolean;
  hasNote: boolean;
  noteContent?: string;
  isEditing: boolean;
  isAdmin: boolean;
  lang: "bn" | "en";
  showArabic: boolean;
  showWordByWord: boolean;
  showTransliteration: boolean;
  showConventionalBn: boolean;
  showConventionalEn: boolean;
  showCoreMeaningBn: boolean;
  showCoreMeaningEn: boolean;
  showModernBn: boolean;
  showModernEn: boolean;
  showLexicon: boolean;
  showMetaData: boolean;
  arabicFontSize: number;
  translationFontSize: number;
  editForm: {
    conventional_bn: string;
    conventional_en: string;
    core_meaning_bn: string;
    core_meaning_en: string;
    modern_translation_bn: string;
    modern_translation_en: string;
    lexicon_modern_notes: string;
    meta_bn: string;
    meta_en: string;
  };
  setEditForm: React.Dispatch<
    React.SetStateAction<{
      conventional_bn: string;
      conventional_en: string;
      core_meaning_bn: string;
      core_meaning_en: string;
      modern_translation_bn: string;
      modern_translation_en: string;
      lexicon_modern_notes: string;
      meta_bn: string;
      meta_en: string;
    }>
  >;
  onPlayAyah: (ayahNum: number) => void;
  onToggleBookmark: (ayah: QuranAyah) => void;
  onToggleAyahAudioDownload: (ayahNum: number) => void;
  onCopyAyah: (ayah: QuranAyah) => void;
  onShareAyah: (ayahNum: number) => void;
  onOpenNote: (ayahNum: number) => void;
  onDeleteNote: (ayahNum: number) => void;
  onStartEdit: (ayah: QuranAyah) => void;
  onSaveEdit: (ayahNum: number) => void;
  onCancelEdit: () => void;
  onSelectWord: (info: { surah: number; ayah: number; word: QuranWord }) => void;
}

const AyahCard = React.memo(function AyahCard({
  ayah,
  surahId,
  isPlaying,
  isBookmarked,
  isAyahAudioSaved,
  isThisAyahDownloading,
  hasNote,
  noteContent,
  isEditing,
  isAdmin,
  lang,
  showArabic,
  showWordByWord,
  showTransliteration,
  showConventionalBn,
  showConventionalEn,
  showCoreMeaningBn,
  showCoreMeaningEn,
  showModernBn,
  showModernEn,
  showLexicon,
  showMetaData,
  arabicFontSize,
  translationFontSize,
  editForm,
  setEditForm,
  onPlayAyah,
  onToggleBookmark,
  onToggleAyahAudioDownload,
  onCopyAyah,
  onShareAyah,
  onOpenNote,
  onDeleteNote,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onSelectWord,
}: AyahCardProps) {
  const hasCoreMeaningBnData = Boolean(
    ayah.core_meaning_bn && ayah.core_meaning_bn.trim().length > 0
  );
  const hasCoreMeaningEnData = Boolean(
    ayah.core_meaning_en && ayah.core_meaning_en.trim().length > 0
  );
  const hasModernBnData = Boolean(
    ayah.modern_translation_bn && ayah.modern_translation_bn.trim().length > 0
  );
  const hasModernEnData = Boolean(
    ayah.modern_translation_en && ayah.modern_translation_en.trim().length > 0
  );

  return (
    <div
      id={`ayah-${ayah.ayah}`}
      className={`scroll-mt-36 rounded-2xl border bg-card p-4 sm:p-5 space-y-4 shadow-sm transition-all duration-300 ${
        isPlaying
          ? "border-primary/80 ring-2 ring-primary/20 bg-primary/[0.02] shadow-md"
          : hasNote
          ? "border-amber-400/50 shadow-amber-400/5 hover:border-border"
          : "border-border/70 hover:border-border"
      }`}
    >
      <div className="border-b border-border/40 pb-3 space-y-2.5">
        {/* [শীর্ষ সারি] আয়াতের নম্বর ও মেটা ডাটা (Meta Data) */}
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-primary shrink-0 pt-0.5 sm:pt-0">
            <span>{surahId}:{ayah.ayah}</span>
          </div>

          {/* মেটা ডাটা / Meta Data বক্স */}
          {showMetaData && (ayah.meta_bn || ayah.meta_en) && (
            <div className="flex-1 min-w-0 flex flex-col justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 px-2.5 py-1 transition-all">
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 select-none leading-none">
                {lang === "bn" ? "মেটা ডাটা" : "Meta Data"}
              </span>
              <p className="text-[11px] sm:text-xs md:text-[13px] font-medium text-foreground/95 whitespace-normal break-words leading-relaxed mt-0.5">
                {lang === "bn"
                  ? (ayah.meta_bn || ayah.meta_en)
                  : (ayah.meta_en || ayah.meta_bn)}
              </p>
            </div>
          )}
        </div>

        {/* [নিচের সারি] অডিও/বুকমার্ক ও একশন বাটনসমূহ */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => onPlayAyah(ayah.ayah)}
              title={isPlaying ? "পজ করুন" : "এই আয়াত থেকে শুনুন"}
              className={`p-1.5 rounded-lg transition-colors hover:bg-muted hover:text-foreground cursor-pointer ${
                isPlaying ? "text-primary bg-primary/10" : ""
              }`}
            >
              {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(ayah)}
              title={isBookmarked ? "বুকমার্ক সরান" : "বুকমার্ক করুন"}
              className={`p-1.5 rounded-lg transition-colors hover:bg-muted hover:text-foreground cursor-pointer ${
                isBookmarked ? "text-amber-500 fill-amber-500 bg-amber-500/10" : ""
              }`}
            >
              <Bookmark className={`size-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>

            <button
              type="button"
              disabled={isThisAyahDownloading}
              onClick={() => onToggleAyahAudioDownload(ayah.ayah)}
              title={isAyahAudioSaved ? "অফলাইন অডিও সংরক্ষিত আছে (মুছতে ক্লিক করুন)" : "এই আয়াতের অডিও অফলাইনে সংরক্ষণ করুন"}
              className={`p-1.5 rounded-lg transition-colors hover:bg-muted cursor-pointer ${
                isAyahAudioSaved
                  ? "text-emerald-500 bg-emerald-500/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isThisAyahDownloading ? (
                <Loader2 className="size-4 animate-spin text-primary" />
              ) : isAyahAudioSaved ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Download className="size-4" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onCopyAyah(ayah)}
              title="আয়াত কপি করুন"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Copy className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => onShareAyah(ayah.ayah)}
              title="আয়াত শেয়ার করুন"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Share2 className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenNote(ayah.ayah)}
              title={hasNote ? "নোট দেখুন / এডিট করুন" : "ব্যক্তিগত নোট যুক্ত করুন"}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                hasNote
                  ? "text-amber-400 bg-amber-400/15 ring-1 ring-amber-400/40 shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <StickyNote className={`size-4 ${hasNote ? "fill-amber-400/30" : ""}`} />
            </button>

            {isAdmin && (
              <div className="ml-2 border-l border-border/40 pl-2">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="default"
                      className="h-7 px-2 text-xs"
                      onClick={() => onSaveEdit(ayah.ayah)}
                    >
                      <Check className="size-3 mr-1" /> সংরক্ষণ
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      onClick={onCancelEdit}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border/40"
                    onClick={() => onStartEdit(ayah)}
                  >
                    <Edit3 className="size-3 mr-1" /> এডিট
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* [১] শব্দে শব্দে আরবি টেক্সট */}
      <div
        dir="rtl"
        style={{ display: showArabic ? "flex" : "none" }}
        className="flex-wrap items-center justify-start gap-x-4 gap-y-4 py-2 border-b border-border/40"
      >
        {ayah.words.map((word) => (
          <div
            key={word.position}
            onClick={() =>
              onSelectWord({
                surah: surahId,
                ayah: ayah.ayah,
                word,
              })
            }
            className="group flex flex-col items-center cursor-pointer rounded-lg p-1.5 transition-all hover:bg-muted/60 active:scale-95"
          >
            <span
              className="arabic text-foreground transition-colors group-hover:text-primary leading-loose"
              style={{ fontSize: `${arabicFontSize}px` }}
            >
              {word.text_uthmani}
            </span>
            <span
              style={{
                display: showWordByWord && word.transliteration ? "block" : "none",
                fontSize: `${Math.max(10, translationFontSize - 4)}px`,
              }}
              className="font-mono text-muted-foreground/80 italic group-hover:text-foreground mt-0.5"
            >
              {word.transliteration}
            </span>
            <span
              style={{
                display: showWordByWord && word.translation_bn ? "block" : "none",
                fontSize: `${Math.max(11, translationFontSize - 3)}px`,
              }}
              className="text-muted-foreground font-medium transition-colors group-hover:text-foreground mt-0.5 text-center"
            >
              {word.translation_bn}
            </span>
          </div>
        ))}
      </div>

      {/* [২] পুরো আয়াতের উচ্চারণ */}
      {ayah.transliteration && (
        <div
          style={{ display: showTransliteration ? "block" : "none" }}
          className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1 transition-colors hover:border-border/80"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Volume2 className="size-3.5 text-muted-foreground/80" />
            <span>উচ্চারণ (Transliteration)</span>
          </div>
          <p
            className="text-xs italic text-foreground/90 font-serif leading-relaxed pl-5.5"
            style={{ fontSize: `${Math.max(12, translationFontSize - 2)}px` }}
          >
            {ayah.transliteration}
          </p>
        </div>
      )}

      {/* [৩] অনুবাদের ৪টি পৃথক সারি */}
      <div className="space-y-3 pt-0.5">
        {/* [এডমিন মোড] মেটা ডাটা (Meta Data) সম্পাদনা */}
        {isEditing && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 p-3.5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="size-3.5" />
              <span>আয়াতের মেটা ডাটা / Meta Data (নম্বরের পাশে দৃশ্যমান হবে)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground">মেটা ডাটা (বাংলা)</Label>
                <Input
                  value={editForm.meta_bn}
                  onChange={(e) => setEditForm({ ...editForm, meta_bn: e.target.value })}
                  placeholder="যেমন: সিস্টেমের মূল উৎসের পরিচয় ও করুণাময় গুণাবলী"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground">Meta Data (English)</Label>
                <Input
                  value={editForm.meta_en}
                  onChange={(e) => setEditForm({ ...editForm, meta_en: e.target.value })}
                  placeholder="e.g. Root Directory Authentication"
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>
          </div>
        )}

        {/* ১. আক্ষরিক অনুবাদ */}
        <div
          style={{ display: isEditing || showConventionalBn ? "block" : "none" }}
          className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1 transition-colors hover:border-border/80"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <FileText className="size-3.5 text-muted-foreground/80" />
            <span>১. আক্ষরিক অনুবাদ</span>
          </div>
          {isEditing ? (
            <Textarea
              value={editForm.conventional_bn}
              onChange={(e) =>
                setEditForm({ ...editForm, conventional_bn: e.target.value })
              }
              className="mt-1 bg-background font-normal"
              style={{ fontSize: `${translationFontSize}px` }}
              placeholder="আক্ষরিক বাংলা অনুবাদ লিখুন বা সম্পাদনা করুন..."
            />
          ) : (
            <p
              className="text-sm font-normal text-foreground/90 leading-relaxed pl-5.5"
              style={{ fontSize: `${translationFontSize}px`, fontWeight: 400 }}
            >
              {ayah.conventional_bn || (ayah as any).translation_bn || "আক্ষরিক বাংলা অনুবাদ লোড হচ্ছে..."}
            </p>
          )}
        </div>

        {/* ২. Surface Translation */}
        <div
          style={{ display: isEditing || showConventionalEn ? "block" : "none" }}
          className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1 transition-colors hover:border-border/80"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Languages className="size-3.5 text-muted-foreground/80" />
            <span>২. Surface Translation</span>
          </div>
          {isEditing ? (
            <Textarea
              value={editForm.conventional_en}
              onChange={(e) =>
                setEditForm({ ...editForm, conventional_en: e.target.value })
              }
              className="font-serif italic mt-1 bg-background font-normal"
              style={{ fontSize: `${translationFontSize}px` }}
              placeholder="Surface English translation..."
            />
          ) : (
            <p
              className="text-xs italic text-muted-foreground font-serif leading-relaxed pl-5.5 font-normal"
              style={{ fontSize: `${Math.max(12, translationFontSize - 1)}px`, fontWeight: 400 }}
            >
              {ayah.conventional_en || (ayah as any).translation_en || (lang === "bn" ? "Surface translation লোড হচ্ছে..." : "Loading surface translation...")}
            </p>
          )}
        </div>

        {/* ৩. অন্তর্গত অনুবাদ */}
        <div
          style={{ display: isEditing || (showCoreMeaningBn && hasCoreMeaningBnData) ? "block" : "none" }}
          className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5 transition-colors hover:border-border/80"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Compass className="size-3.5 text-primary" />
            <span>৩. অন্তর্গত অনুবাদ</span>
          </div>
          {isEditing ? (
            <Textarea
              value={editForm.core_meaning_bn}
              onChange={(e) =>
                setEditForm({ ...editForm, core_meaning_bn: e.target.value })
              }
              className="mt-1 bg-background font-normal"
              style={{ fontSize: `${translationFontSize}px` }}
              placeholder="আয়াতের অন্তর্গত ভাবার্থ বা অনুবাদ লিখুন..."
            />
          ) : (
            <p
              className="text-xs sm:text-sm font-normal text-foreground/90 leading-relaxed pl-5.5"
              style={{ fontSize: `${translationFontSize}px`, fontWeight: 400 }}
            >
              {ayah.core_meaning_bn}
            </p>
          )}
        </div>

        {/* ৪. Interlinear Translation */}
        <div
          style={{ display: isEditing || (showCoreMeaningEn && hasCoreMeaningEnData) ? "block" : "none" }}
          className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5 transition-colors hover:border-border/80"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Compass className="size-3.5 text-primary" />
            <span>৪. Interlinear Translation</span>
          </div>
          {isEditing ? (
            <Textarea
              value={editForm.core_meaning_en}
              onChange={(e) =>
                setEditForm({ ...editForm, core_meaning_en: e.target.value })
              }
              className="font-serif italic mt-1 bg-background font-normal"
              style={{ fontSize: `${translationFontSize}px` }}
              placeholder="Interlinear English translation..."
            />
          ) : (
            <p
              className="text-xs sm:text-sm font-normal text-muted-foreground font-serif italic leading-relaxed pl-5.5"
              style={{ fontSize: `${Math.max(12, translationFontSize - 1)}px`, fontWeight: 400 }}
            >
              {ayah.core_meaning_en}
            </p>
          )}
        </div>

        {/* ৫. বৈজ্ঞানিক অনুবাদ */}
        <div
          style={{ display: isEditing || (showModernBn && hasModernBnData) ? "block" : "none" }}
          className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5 transition-colors hover:border-border/80"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <BookMarked className="size-3.5 text-primary" />
            <span>৫. বৈজ্ঞানিক অনুবাদ</span>
          </div>
          {isEditing ? (
            <Textarea
              value={editForm.modern_translation_bn}
              onChange={(e) =>
                setEditForm({ ...editForm, modern_translation_bn: e.target.value })
              }
              className="mt-1 bg-background font-normal text-muted-foreground"
              style={{ fontSize: `${translationFontSize}px` }}
              placeholder="আমাদের বৈজ্ঞানিক বাংলা অনুবাদ ইনপুট দিন..."
            />
          ) : (
            <p
              className="text-xs sm:text-sm font-normal text-muted-foreground leading-relaxed pl-5.5"
              style={{ fontSize: `${translationFontSize}px`, fontWeight: 400 }}
            >
              {ayah.modern_translation_bn}
            </p>
          )}
        </div>

        {/* ৬. Scientific Translation */}
        <div
          style={{ display: isEditing || (showModernEn && hasModernEnData) ? "block" : "none" }}
          className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5 transition-colors hover:border-border/80"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <BookmarkCheck className="size-3.5 text-primary" />
            <span>৬. Scientific Translation</span>
          </div>
          {isEditing ? (
            <Textarea
              value={editForm.modern_translation_en}
              onChange={(e) =>
                setEditForm({ ...editForm, modern_translation_en: e.target.value })
              }
              className="font-serif italic mt-1 bg-background font-normal text-muted-foreground"
              style={{ fontSize: `${translationFontSize}px` }}
              placeholder="Scientific contemporary English translation..."
            />
          ) : (
            <p
              className="text-xs sm:text-sm font-normal text-muted-foreground font-serif italic leading-relaxed pl-5.5"
              style={{ fontSize: `${Math.max(12, translationFontSize - 1)}px`, fontWeight: 400 }}
            >
              {ayah.modern_translation_en}
            </p>
          )}
        </div>
      </div>

      {/* [৪] অভিধান / Lexicon */}
      <div
        style={{ display: showLexicon ? "block" : "none" }}
        className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2.5 transition-colors hover:border-border/80"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Layers className="size-3.5 text-muted-foreground/80" />
          <span>অভিধান / Lexicon</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pl-5.5">
          {ayah.words
            .filter((w) => w.text_uthmani)
            .map((w, idx) => {
              const wordRoot = extractIntelligentRoot(w);
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-lg border border-border/50 bg-background/50 px-2.5 py-1 font-mono text-[11px]"
                >
                  <span className="arabic font-bold text-foreground text-sm">{w.text_uthmani}</span>
                  {wordRoot && (
                    <span className="text-muted-foreground font-semibold">({wordRoot})</span>
                  )}
                  {w.translation_bn && (
                    <span className="text-muted-foreground/80 text-[10px]">· {w.translation_bn}</span>
                  )}
                </span>
              );
            })}
        </div>

        {isEditing ? (
          <div className="mt-2 pt-2 border-t border-border/40 pl-5.5">
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">
              আধুনিক অভিধান / Lexicon নোট:
            </label>
            <Textarea
              value={editForm.lexicon_modern_notes}
              onChange={(e) =>
                setEditForm({ ...editForm, lexicon_modern_notes: e.target.value })
              }
              className="text-sm bg-background"
              placeholder="শব্দের আধুনিক অর্থ, ব্যুৎপত্তি বা ব্যাকরণগত নোট..."
            />
          </div>
        ) : (
          ayah.lexicon_modern_notes && (
            <div className="mt-2 pt-2 border-t border-border/30 pl-5.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground mr-1">লেক্সিকন নোট:</span>
                {typeof ayah.lexicon_modern_notes === "string"
                  ? ayah.lexicon_modern_notes
                  : Array.isArray(ayah.lexicon_modern_notes)
                  ? (ayah.lexicon_modern_notes as any[]).map((n) => typeof n === 'string' ? n : `${n.word ? n.word + ' — ' : ''}${n.meaning ? n.meaning + ': ' : ''}${n.scientific_note || ''}`).join('; ')
                  : String(ayah.lexicon_modern_notes)}
              </p>
            </div>
          )
        )}
      </div>

      {/* [৫] ব্যক্তিগত নোট কার্ড */}
      {hasNote && (
        <div className="rounded-xl border border-amber-400/40 bg-amber-400/[0.04] p-4 space-y-2 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <StickyNote className="size-3.5" />
              <span>আমার ব্যক্তিগত নোট / তাদাব্বুর</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onOpenNote(ayah.ayah)}
                className="p-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="নোট এডিট করুন"
              >
                <Edit3 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteNote(ayah.ayah)}
                className="p-1 rounded-md text-xs text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="নোট মুছে ফেলুন"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-foreground/95 leading-relaxed pl-5.5 whitespace-pre-wrap">
            {noteContent}
          </p>
        </div>
      )}
    </div>
  );
});

function SurahDetailPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const surahId = Number(id) || 1;
  const { prefs, publicPermissions, userPermissions, isLayerAllowed, lang } = usePrefs();
  const { toggle: toggleBm, isBookmarked: checkBookmarked } = useBookmarks();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isLoopingSurah, setIsLoopingSurah] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isAudioDownloaded, setIsAudioDownloaded] = useState(false);
  const [downloadingSurahAudio, setDownloadingSurahAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState<number | null>(null);
  const [downloadingFullMp3, setDownloadingFullMp3] = useState(false);

  const [cachedAyahs, setCachedAyahs] = useState<Set<number>>(new Set());
  const [downloadingAyahsMap, setDownloadingAyahsMap] = useState<Record<number, boolean>>({});

  const [activeNoteAyah, setActiveNoteAyah] = useState<number | null>(null);
  const [ayahNotes, setAyahNotes] = useState<Record<string, string>>({});
  const [currentNoteText, setCurrentNoteText] = useState("");

  const [surahMeaning, setSurahMeaning] = useState<SurahMeaningItem | null>(() => getSurahMeaning(surahId));
  const [meaningEditDialogOpen, setMeaningEditDialogOpen] = useState(false);
  const [editMeaningConventionalBn, setEditMeaningConventionalBn] = useState("");
  const [editMeaningScientificBn, setEditMeaningScientificBn] = useState("");
  const [editMeaningConventionalEn, setEditMeaningConventionalEn] = useState("");
  const [editMeaningScientificEn, setEditMeaningScientificEn] = useState("");

  const [surahConsistency, setSurahConsistency] = useState<SurahConsistencyItem | null>(() => getSurahConsistency(surahId));
  const [consistencyEditDialogOpen, setConsistencyEditDialogOpen] = useState(false);
  const [editConsistencyBn, setEditConsistencyBn] = useState("");
  const [editConsistencyEn, setEditConsistencyEn] = useState("");
  const [editConsistencyTitleBn, setEditConsistencyTitleBn] = useState("");

  useEffect(() => {
    setSurahConsistency(getSurahConsistency(surahId));
    const handleConsistencyUpdate = () => setSurahConsistency(getSurahConsistency(surahId));
    window.addEventListener("surah-consistency-updated", handleConsistencyUpdate);
    return () => window.removeEventListener("surah-consistency-updated", handleConsistencyUpdate);
  }, [surahId]);

  const handleSaveSurahConsistency = () => {
    saveCustomSurahConsistency(surahId, editConsistencyBn, editConsistencyEn, editConsistencyTitleBn);
    setSurahConsistency(getSurahConsistency(surahId));
    setConsistencyEditDialogOpen(false);
    toast.success(lang === "bn" ? "লজিক্যাল কনসিস্টেন্সি ডাটা সংরক্ষিত হয়েছে" : "Logical consistency updated successfully");
  };

  useEffect(() => {
    setSurahMeaning(getSurahMeaning(surahId));
    const handleUpdate = () => setSurahMeaning(getSurahMeaning(surahId));
    window.addEventListener("surah-meanings-updated", handleUpdate);
    return () => window.removeEventListener("surah-meanings-updated", handleUpdate);
  }, [surahId]);

  const handleSaveSurahMeaning = () => {
    saveCustomSurahMeaning(
      surahId,
      editMeaningConventionalBn,
      editMeaningScientificBn,
      editMeaningConventionalEn,
      editMeaningScientificEn
    );
    setSurahMeaning(getSurahMeaning(surahId));
    setMeaningEditDialogOpen(false);
    toast.success(lang === "bn" ? "সুরার প্রচলিত ও বিজ্ঞানভিত্তিক অর্থ সংরক্ষিত হয়েছে" : "Surah meanings updated successfully");
  };

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(`notes_surah_${surahId}`);
      if (savedNotes) setAyahNotes(JSON.parse(savedNotes));
    } catch (e) {
      console.error(e);
    }
  }, [surahId]);

  const [selectedWordInfo, setSelectedWordInfo] = useState<{
    surah: number;
    ayah: number;
    word: QuranWord;
  } | null>(null);

  const [editingAyah, setEditingAyah] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    conventional_bn: "",
    conventional_en: "",
    core_meaning_bn: "",
    core_meaning_en: "",
    modern_translation_bn: "",
    modern_translation_en: "",
    lexicon_modern_notes: "",
    meta_bn: "",
    meta_en: "",
  });

  const meta = SURAH_META_MAP[surahId] || SURAH_META_MAP[1];

  // ১. প্রাথমিক ইনস্ট্যান্ট লোড (প্রথম ৫টি আয়াত - মাত্র ~১৫ KB, যা ১৫-২০ মিলিসেকেন্ডে চলে আসে)
  const initQuery = useQuery<SurahData>({
    queryKey: ["local-surah-init", surahId],
    queryFn: () => fetchSurahInitData(surahId),
    staleTime: 1000 * 60 * 60 * 24,
  });

  // ২. ব্যাকগ্রাউন্ডে সম্পূর্ণ সুরার ডাটাবেজ ফেচ (ফুল ৪.৫ মেগাবাইট ফাইল ব্যাকগ্রাউন্ডে লোড হবে)
  const surahQuery = useQuery<SurahData>({
    queryKey: ["local-surah-cache", surahId],
    queryFn: () => fetchSurahData(surahId),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });

  // একটিভ ডাটা: ফুল ডাটা লোড হলে সেটি, অন্যথায় দ্রুতগতির ইনিশিয়াল ডাটা
  const currentSurahData = surahQuery.data || initQuery.data;
  const isFullDataLoaded = Boolean(surahQuery.data?.ayahs && surahQuery.data.ayahs.length > 5);

  // প্রগ্রেসিভ ভার্চুয়ালাইজড স্ক্রল রেন্ডারিং (শুরুতে ৫টি, স্ক্রল করার সাথে সাথে ১০টি করে লোড হবে)
  const INITIAL_BATCH_SIZE = 5;
  const BATCH_INCREMENT = 10;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // সুরা পরিবর্তন বা সার্চ প্যারামে আয়াত স্পেসিফাই করা হলে রেন্ডার কাউন্ট অ্যাডজাস্ট
  useEffect(() => {
    if (search.ayah) {
      setVisibleCount(Math.max(INITIAL_BATCH_SIZE, Number(search.ayah) + 5));
    } else {
      setVisibleCount(INITIAL_BATCH_SIZE);
    }
  }, [surahId, search.ayah]);

  // ফুল ডাটা ব্যাকগ্রাউন্ডে আসার পর যদি সার্চের আয়াত থাকে তবে দৃশ্যমান কাউন্ট বাড়ানো
  useEffect(() => {
    if (search.ayah && surahQuery.data?.ayahs) {
      setVisibleCount((prev) => Math.max(prev, Number(search.ayah) + 5));
    }
  }, [search.ayah, surahQuery.data]);

  // প্রগ্রেসিভ স্ক্রল ইন্টারসেকশন অবজারভার (ভিজিটর নিচে নামার ৬০০ পিক্সেল আগেই পরবর্তী ব্যাচ রেন্ডার করে)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((prev) => {
            const maxAvailable = currentSurahData?.ayahs?.length || meta.total;
            if (prev < maxAvailable) {
              return Math.min(prev + BATCH_INCREMENT, maxAvailable);
            }
            return prev;
          });
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentSurahData?.ayahs?.length, meta.total]);

  // ডিসপ্লে করা আয়াতসমূহ (শুধুমাত্র দৃশ্যমান ব্যাচ রেন্ডার হবে)
  const displayedAyahs = useMemo(() => {
    if (!currentSurahData?.ayahs) return [];
    return currentSurahData.ayahs.slice(0, visibleCount);
  }, [currentSurahData?.ayahs, visibleCount]);

  const surahAudioUrls = useMemo(() => {
    const sStr = String(surahId).padStart(3, "0");
    const total = meta.total;
    const urls: string[] = [];
    for (let i = 1; i <= total; i++) {
      const aStr = String(i).padStart(3, "0");
      urls.push(`https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`);
    }
    return urls;
  }, [surahId, meta.total]);

  const checkIndividualAyahCaches = async () => {
    try {
      const sStr = String(surahId).padStart(3, "0");
      const found = new Set<number>();
      for (let i = 1; i <= meta.total; i++) {
        const aStr = String(i).padStart(3, "0");
        const url = `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;
        const isSaved = await isAudioSavedOffline(url);
        if (isSaved) found.add(i);
      }
      setCachedAyahs(found);
      if (found.size === meta.total && meta.total > 0) {
        setIsAudioDownloaded(true);
      } else {
        setIsAudioDownloaded(false);
      }
    } catch (e) {
      // Ignore cache query errors
    }
  };

  useEffect(() => {
    if (initQuery.isSuccess || surahQuery.isSuccess) {
      checkIndividualAyahCaches();
    }
  }, [initQuery.isSuccess, surahQuery.isSuccess, surahId]);

  const handleDownloadThisSurahAudio = async () => {
    if (surahAudioUrls.length === 0) return;
    setDownloadingSurahAudio(true);
    setAudioProgress(0);
    try {
      await downloadSurahAudio(surahAudioUrls, (done, total) => {
        setAudioProgress(Math.round((done / total) * 100));
      });
      setIsAudioDownloaded(true);
      await checkIndividualAyahCaches();
      toast.success(lang === "bn" ? `সুরা ${meta.name_bn}-এর সম্পূর্ণ অডিও অফলাইনে সংরক্ষিত হয়েছে!` : `Audio of Surah ${meta.name_bn} downloaded!`);
    } catch (err) {
      toast.error(lang === "bn" ? "অডিও ডাউনলোডে সমস্যা হয়েছে, ইন্টারনেট চেক করুন" : "Audio download failed, check connection");
    } finally {
      setDownloadingSurahAudio(false);
      setTimeout(() => setAudioProgress(null), 3000);
    }
  };

  const handleDownloadFullSurahMp3ToDevice = async () => {
    setDownloadingFullMp3(true);
    const sStr = String(surahId).padStart(3, "0");
    const fullSurahUrl = `https://server8.mp3quran.net/afs/${sStr}.mp3`;

    try {
      toast.info(lang === "bn" ? `সুরা ${meta.name_bn} MP3 ডাউনলোড শুরু হয়েছে...` : `Downloading Surah ${meta.name_bn} MP3...`);
      const response = await fetch(fullSurahUrl);
      if (!response.ok) throw new Error("File download failed");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `Surah_${sStr}_${meta.name_bn.replace(/\s+/g, "_")}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(lang === "bn" ? `সুরা ${meta.name_bn} আপনার ডিভাইসে ডাউনলোড সম্পন্ন হয়েছে!` : `Surah ${meta.name_bn} MP3 downloaded to device!`);
    } catch (err) {
      const a = document.createElement("a");
      a.href = fullSurahUrl;
      a.target = "_blank";
      a.download = `Surah_${sStr}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloadingFullMp3(false);
    }
  };

  const handleToggleAyahAudioDownload = async (ayahNum: number) => {
    const sStr = String(surahId).padStart(3, "0");
    const aStr = String(ayahNum).padStart(3, "0");
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;

    setDownloadingAyahsMap((prev) => ({ ...prev, [ayahNum]: true }));
    try {
      const exists = await isAudioSavedOffline(audioUrl);

      if (exists) {
        await deleteAudioOffline(audioUrl);
        setCachedAyahs((prev) => {
          const next = new Set(prev);
          next.delete(ayahNum);
          return next;
        });
        setIsAudioDownloaded(false);
        toast.info(`আয়াত ${ayahNum}-এর অডিও অফলাইন থেকে সরানো হয়েছে`);
      } else {
        const res = await fetch(audioUrl, { mode: "cors" });
        if (!res.ok) throw new Error("Audio download failed");
        const blob = await res.blob();
        await saveAudioOffline(audioUrl, blob);
        setCachedAyahs((prev) => new Set(prev).add(ayahNum));
        toast.success(`আয়াত ${ayahNum}-এর অডিও অফলাইনে সংরক্ষিত হয়েছে`);
      }
    } catch (err) {
      toast.error("আয়াত অডিও সংরক্ষণ ব্যর্থ হয়েছে, ইন্টারনেট চেক করুন");
    } finally {
      setDownloadingAyahsMap((prev) => ({ ...prev, [ayahNum]: false }));
    }
  };

  useEffect(() => {
    if (surahId < 114) {
      queryClient.prefetchQuery({
        queryKey: ["local-surah-cache", surahId + 1],
        queryFn: () => fetchSurahData(surahId + 1),
        staleTime: Infinity,
      });
    }
    if (surahId > 1) {
      queryClient.prefetchQuery({
        queryKey: ["local-surah-cache", surahId - 1],
        queryFn: () => fetchSurahData(surahId - 1),
        staleTime: Infinity,
      });
    }
  }, [surahId, queryClient]);

  const scrollToAyah = (ayahNum: number) => {
    // নিশ্চিত করা যেন স্ক্রলের টার্গেট আয়াতটি DOM-এ মাউন্ট করা থাকে
    setVisibleCount((prev) => Math.max(prev, ayahNum + 5));

    let attempts = 0;
    const interval = setInterval(() => {
      const el = document.getElementById(`ayah-${ayahNum}`);
      if (el) {
        const headerOffset = 140;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        el.classList.add("ring-2", "ring-primary/40");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-primary/40");
        }, 2000);

        clearInterval(interval);
      }
      attempts++;
      if (attempts > 30) clearInterval(interval);
    }, 80);
  };

  useEffect(() => {
    if (search.ayah && (initQuery.isSuccess || surahQuery.isSuccess)) {
      scrollToAyah(Number(search.ayah));
    }
  }, [initQuery.isSuccess, surahQuery.isSuccess, search.ayah, surahId]);

  const playAyahSequentially = useCallback(async (ayahNum: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // নিশ্চিত করা যেন অডিও চলার সময় চলতি আয়াতটি দৃশ্যমান থাকে
    setVisibleCount((prev) => Math.max(prev, ayahNum + 5));

    const sStr = String(surahId).padStart(3, "0");
    const aStr = String(ayahNum).padStart(3, "0");
    const rawAudioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;

    const audioUrl = await resolveAudioSrc(rawAudioUrl);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingAyah(ayahNum);

    scrollToAyah(ayahNum);

    audio.play().catch(() => {
      toast.error(lang === "bn" ? `আয়াত ${ayahNum} প্লে করা যায়নি` : `Failed to play ayah ${ayahNum}`);
      setPlayingAyah(null);
    });

    audio.onended = () => {
      const totalAyahs = meta.total;
      if (ayahNum < totalAyahs) {
        playAyahSequentially(ayahNum + 1);
      } else {
        if (isLoopingSurah) {
          playAyahSequentially(1);
        } else {
          setPlayingAyah(null);
          toast.success(lang === "bn" ? `সুরা ${meta.name_bn} তেলাওয়াত সম্পন্ন হয়েছে` : `Completed recitation of Surah ${meta.name_bn}`);
        }
      }
    };
  }, [surahId, meta.total, meta.name_bn, isLoopingSurah, lang]);

  const handleNavigate = useCallback(
    (targetSurah: number, targetAyah?: number) => {
      navigate({
        to: "/surah/$id",
        params: { id: String(targetSurah) },
        search: targetAyah ? { ayah: targetAyah } : undefined,
      });
    },
    [navigate]
  );

  const handleToggleSurahPlay = useCallback(() => {
    if (playingAyah !== null) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAyah(null);
    } else {
      playAyahSequentially(1);
    }
  }, [playingAyah, playAyahSequentially]);

  const handlePlayAyah = useCallback((ayahNum: number) => {
    if (playingAyah === ayahNum) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingAyah(null);
    } else {
      playAyahSequentially(ayahNum);
    }
  }, [playingAyah, playAyahSequentially]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [surahId]);

  const isAyahBookmarked = useCallback((ayahNum: number) => {
    return checkBookmarked({
      kind: "ayah",
      surah: surahId,
      ayah: ayahNum,
      label: "",
    });
  }, [checkBookmarked, surahId]);

  const handleToggleBookmark = useCallback((ayah: QuranAyah) => {
    const target: BookmarkTarget = {
      kind: "ayah",
      surah: surahId,
      ayah: ayah.ayah,
      label: `সুরা ${meta.name_bn} : আয়াত ${ayah.ayah}`,
    };

    const isNowBookmarked = toggleBm(target);

    if (isNowBookmarked) {
      toast.success(`আয়াত ${ayah.ayah} বুকমার্কে সংরক্ষণ করা হয়েছে`);
    } else {
      toast.info(`আয়াত ${ayah.ayah} বুকমার্ক থেকে সরানো হয়েছে`);
    }
  }, [surahId, meta.name_bn, toggleBm]);

  const handleCopyAyah = useCallback((ayah: QuranAyah) => {
    const arabicText = ayah.text_uthmani || ayah.words?.map((w) => w.text_uthmani).join(" ") || "";
    const translationText = ayah.conventional_bn || (ayah as any).translation_bn || ayah.words?.map((w) => w.translation_bn).filter(Boolean).join(" ") || "";
    const transliterationText = ayah.transliteration || ayah.words?.map((w) => w.transliteration).filter(Boolean).join(" ") || "";

    const fullCopyText = `${arabicText}

[উচ্চারণ]: ${transliterationText}
[অনুবাদ]: ${translationText}

— সুরা ${meta.name_bn} (${surahId}:${ayah.ayah})`;

    navigator.clipboard.writeText(fullCopyText);
    toast.success("আয়াত সম্পূর্ণ কপি করা হয়েছে");
  }, [meta.name_bn, surahId]);

  const handleShareAyah = useCallback((ayahNum: number) => {
    const shareUrl = `${window.location.origin}/surah/${surahId}?ayah=${ayahNum}`;
    if (navigator.share) {
      navigator.share({
        title: `সুরা ${meta.name_bn} - আয়াত ${ayahNum}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("আয়াতের লিংক কপি করা হয়েছে");
    }
  }, [meta.name_bn, surahId]);

  const handleOpenNote = useCallback((ayahNum: number) => {
    setActiveNoteAyah(ayahNum);
    setCurrentNoteText(ayahNotes[ayahNum] || "");
  }, [ayahNotes]);

  const handleSaveNote = () => {
    if (!activeNoteAyah) return;
    const cleanText = currentNoteText.trim();
    const updated = { ...ayahNotes };
    
    if (cleanText) {
      updated[activeNoteAyah] = cleanText;
      toast.success(`আয়াত ${activeNoteAyah} এর নোট সংরক্ষিত হয়েছে`);
    } else {
      delete updated[activeNoteAyah];
      toast.info(`আয়াত ${activeNoteAyah} এর নোট মুছে ফেলা হয়েছে`);
    }
    
    setAyahNotes(updated);
    localStorage.setItem(`notes_surah_${surahId}`, JSON.stringify(updated));
    setActiveNoteAyah(null);
  };

  const handleDeleteNote = useCallback((ayahNum: number) => {
    const updated = { ...ayahNotes };
    delete updated[ayahNum];
    setAyahNotes(updated);
    localStorage.setItem(`notes_surah_${surahId}`, JSON.stringify(updated));
    toast.info("নোট মুছে ফেলা হয়েছে");
  }, [ayahNotes, surahId]);

  const handleStartEdit = useCallback((ayah: QuranAyah) => {
    setEditingAyah(ayah.ayah);
    setEditForm({
      conventional_bn: ayah.conventional_bn || (ayah as any).translation_bn || "",
      conventional_en: ayah.conventional_en || (ayah as any).translation_en || "",
      core_meaning_bn: ayah.core_meaning_bn || "",
      core_meaning_en: ayah.core_meaning_en || "",
      modern_translation_bn: ayah.modern_translation_bn || "",
      modern_translation_en: ayah.modern_translation_en || "",
      lexicon_modern_notes: ayah.lexicon_modern_notes || "",
      meta_bn: ayah.meta_bn || "",
      meta_en: ayah.meta_en || "",
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingAyah(null);
  }, []);

  const handleSaveEdit = async (ayahNumber: number) => {
    const targetData = surahQuery.data || initQuery.data;
    if (targetData) {
      const target = targetData.ayahs.find((a) => a.ayah === ayahNumber);
      if (target) {
        target.conventional_bn = editForm.conventional_bn.trim();
        (target as any).translation_bn = editForm.conventional_bn.trim();
        target.conventional_en = editForm.conventional_en.trim();
        (target as any).translation_en = editForm.conventional_en.trim();
        target.core_meaning_bn = editForm.core_meaning_bn.trim();
        target.core_meaning_en = editForm.core_meaning_en.trim();
        target.modern_translation_bn = editForm.modern_translation_bn.trim();
        target.modern_translation_en = editForm.modern_translation_en.trim();
        target.lexicon_modern_notes = editForm.lexicon_modern_notes.trim();
        target.meta_bn = editForm.meta_bn.trim();
        target.meta_en = editForm.meta_en.trim();

        // Local storage override
        try {
          localStorage.setItem(`quran_ayah_meta_${surahId}_${ayahNumber}`, JSON.stringify({
            meta_bn: editForm.meta_bn.trim(),
            meta_en: editForm.meta_en.trim(),
            core_meaning_bn: editForm.core_meaning_bn.trim(),
            core_meaning_en: editForm.core_meaning_en.trim(),
            modern_translation_bn: editForm.modern_translation_bn.trim(),
            modern_translation_en: editForm.modern_translation_en.trim(),
            lexicon_modern_notes: editForm.lexicon_modern_notes.trim(),
            conventional_bn: editForm.conventional_bn.trim(),
            conventional_en: editForm.conventional_en.trim(),
          }));
          await saveSurahOffline(surahId, targetData);
        } catch {}

        // Cloud sync (Supabase quran_verses master table)
        try {
          await (supabase as any).from("quran_verses").upsert({
            surah: surahId,
            ayah: ayahNumber,
            text_uthmani: target.text_uthmani || target.words?.map(w => w.text_uthmani).join(" ") || "",
            words: target.words || [],
            transliteration: target.transliteration || "",
            conventional_bn: editForm.conventional_bn.trim(),
            conventional_en: editForm.conventional_en.trim(),
            bn_text: editForm.conventional_bn.trim(),
            en_text: editForm.conventional_en.trim(),
            core_meaning_bn: editForm.core_meaning_bn.trim() || null,
            core_meaning_en: editForm.core_meaning_en.trim() || null,
            modern_translation_bn: editForm.modern_translation_bn.trim() || null,
            modern_translation_en: editForm.modern_translation_en.trim() || null,
            meta_bn: editForm.meta_bn.trim() || null,
            meta_en: editForm.meta_en.trim() || null,
            lexicon_modern_notes: editForm.lexicon_modern_notes.trim() || null,
            updated_at: new Date().toISOString(),
          }, { onConflict: "surah,ayah" });

          if (editForm.meta_bn.trim() || editForm.meta_en.trim()) {
            await (supabase as any).from("ayah_metadata").upsert({
              surah: surahId,
              ayah: ayahNumber,
              meta_bn: editForm.meta_bn.trim() || null,
              meta_en: editForm.meta_en.trim() || null,
            }, { onConflict: "surah,ayah" });
          }

          if (editForm.conventional_bn.trim()) {
            await (supabase as any).from("verse_translations").upsert({
              surah: surahId,
              ayah: ayahNumber,
              lang: "bn",
              note: editForm.meta_bn.trim(),
              text: editForm.conventional_bn.trim(),
            }, { onConflict: "surah,ayah,lang" });
          }
        } catch (cloudErr) {
          console.warn("Supabase master sync notice:", cloudErr);
        }
      }
    }
    toast.success("আয়াতের মেটা ডাটা ও অনুবাদ ডাটাবেজ এবং লোকাল ক্যাশে সংরক্ষিত হয়েছে");
    setEditingAyah(null);
  };

  const showArabic = isLayerAllowed("showArabic", isAdmin) && prefs.showArabic;
  const showWordByWord = isLayerAllowed("showWordByWord", isAdmin) && prefs.showWordByWord;
  const showTransliteration = isLayerAllowed("showTransliteration", isAdmin) && prefs.showTransliteration;
  const showConventionalBn = isLayerAllowed("showConventionalBn", isAdmin) && prefs.showConventionalBn;
  const showConventionalEn = isLayerAllowed("showConventionalEn", isAdmin) && prefs.showConventionalEn;
  const showCoreMeaningBn = isLayerAllowed("showCoreMeaningBn", isAdmin) && prefs.showCoreMeaningBn;
  const showCoreMeaningEn = isLayerAllowed("showCoreMeaningEn", isAdmin) && prefs.showCoreMeaningEn;
  const showModernBn = isLayerAllowed("showModernBn", isAdmin) && prefs.showModernBn;
  const showModernEn = isLayerAllowed("showModernEn", isAdmin) && prefs.showModernEn;
  const showLexicon = isLayerAllowed("showLexicon", isAdmin) && prefs.showLexicon;
  const showLexiconScientific = isLayerAllowed("showLexiconScientific", isAdmin) && prefs.showLexiconScientific;
  const showMetaData = isLayerAllowed("showMetaData", isAdmin) && prefs.showMetaData;
  const showLogicalConsistency = isLayerAllowed("showLogicalConsistency", isAdmin) && prefs.showLogicalConsistency;

  const arabicFontSize = prefs.arabicFontSize || 22;
  const translationFontSize = prefs.translationFontSize || 12;

  const isSurahPlaying = playingAyah !== null;

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-3 space-y-6">
      
      {/* ফ্লোটিং স্টিকি হেডার (হেডারের নিচে মোবাইল ও ডেস্কটপ উভয় ভিউতে স্টিকি) */}
      <div className="sticky top-14 sm:top-16 z-40 bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          
          {/* হেডারের শীর্ষ অংশ */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-md bg-muted font-bold text-xs text-foreground font-mono shrink-0">
                {formatNumber(surahId, lang)}
              </span>
              <div className="leading-tight min-w-0">
                <h1 className="text-sm font-semibold text-foreground flex items-center gap-1 truncate">
                  <span className="truncate">{meta.name_bn}</span>
                  <span className="arabic text-xs text-muted-foreground font-normal hidden sm:inline shrink-0">
                    ({meta.name_ar})
                  </span>
                </h1>
                <p className="text-[10px] text-muted-foreground truncate">
                  {meta.type} · আয়াত {formatNumber(meta.total, lang)}
                </p>
              </div>
            </div>

            <AyahJumpSearchForm
              surahId={surahId}
              totalAyahs={meta.total}
              onNavigate={handleNavigate}
              onScrollToAyah={scrollToAyah}
            />
          </div>

          {/* বাটনের অংশ */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 overflow-x-auto no-scrollbar pt-1 sm:pt-0 border-t sm:border-t-0 border-border/30">
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant={isSurahPlaying ? "default" : "outline"}
                onClick={handleToggleSurahPlay}
                className={`h-7 px-2 sm:px-2.5 text-[11px] font-medium transition-all shrink-0 ${
                  isSurahPlaying ? "bg-primary text-primary-foreground shadow-xs animate-pulse" : ""
                }`}
                title={isSurahPlaying ? "তেলাওয়াত বন্ধ করুন" : "সম্পূর্ণ সুরা একনাগাড়ে শুনুন"}
              >
                {isSurahPlaying ? (
                  <>
                    <Pause className="size-3.5 mr-1 fill-current shrink-0" />
                    <span>আয়াত {formatNumber(playingAyah, lang)}</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3.5 mr-1 fill-current text-primary shrink-0" />
                    <span>শুনুন</span>
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const nextState = !isLoopingSurah;
                  setIsLoopingSurah(nextState);
                  if (nextState) {
                    toast.success(lang === "bn" ? "লুপ মোড চালু হয়েছে (সুরা বারবার বাজবে)" : "Loop mode enabled");
                  } else {
                    toast.info(lang === "bn" ? "লুপ মোড বন্ধ করা হয়েছে" : "Loop mode disabled");
                  }
                }}
                className={`h-7 px-2 text-[11px] font-medium transition-all shrink-0 ${
                  isLoopingSurah
                    ? "bg-primary/15 text-primary border-primary/50 shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={isLoopingSurah ? "লুপ বন্ধ করুন" : "সুরাটি শেষ হলে আবার শুরু থেকে বাজান (লুপ)"}
              >
                <Repeat className={`size-3.5 ${isLoopingSurah ? "text-primary stroke-[2.5]" : ""}`} />
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={downloadingSurahAudio || isAudioDownloaded}
                onClick={handleDownloadThisSurahAudio}
                className="h-7 px-2 text-[11px] font-medium hidden md:inline-flex shrink-0"
                title={isAudioDownloaded ? "এই সুরার অডিও অফলাইনে সংরক্ষিত আছে" : "ওয়েব প্লেয়ারের জন্য সম্পূর্ণ সুরার অডিও ক্যাশ করুন"}
              >
                {downloadingSurahAudio ? (
                  <>
                    <Loader2 className="size-3 mr-1 animate-spin text-primary" />
                    <span>{audioProgress}%</span>
                  </>
                ) : isAudioDownloaded ? (
                  <>
                    <Check className="size-3 mr-1 text-emerald-500" />
                    <span className="hidden sm:inline">ক্যাশড</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3 mr-1 text-primary" />
                    <span className="hidden sm:inline">ক্যাশ</span>
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={downloadingFullMp3}
                onClick={handleDownloadFullSurahMp3ToDevice}
                className="h-7 px-2 text-[11px] font-medium bg-primary/5 hover:bg-primary/15 text-primary border-primary/30 shrink-0"
                title={`সুরা ${meta.name_bn}-এর সম্পূর্ণ MP3 ফাইল আপনার মোবাইলে/কম্পিউটারে ডাউনলোড করুন`}
              >
                {downloadingFullMp3 ? (
                  <Loader2 className="size-3 mr-1 animate-spin text-primary" />
                ) : (
                  <FileAudio className="size-3 mr-1" />
                )}
                <span>MP3</span>
              </Button>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {surahId > 1 && (
                <Button asChild variant="outline" size="sm" className="h-7 px-2 text-xs">
                  <Link to="/surah/$id" params={{ id: String(surahId - 1) }}>
                    <ChevronLeft className="size-3.5" />
                  </Link>
                </Button>
              )}
              {surahId < 114 && (
                <Button asChild variant="outline" size="sm" className="h-7 px-2 text-xs">
                  <Link to="/surah/$id" params={{ id: String(surahId + 1) }}>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* সুরার নামের প্রচলিত ও বিজ্ঞানভিত্তিক অর্থ ব্যানার (Responsive Desktop & Mobile & Bilingual) */}
      {isLayerAllowed("showSurahScientificMeaning", isAdmin) && prefs.showSurahScientificMeaning && surahMeaning && (
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-card via-muted/20 to-card p-3.5 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="size-3.5" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                {lang === "bn" ? `সুরা ${meta.name_bn}-এর নামের প্রচলিত ও বিজ্ঞানভিত্তিক অর্থ` : `Meanings of Surah ${meta.name_en}`}
              </span>
            </div>

            {isAdmin && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditMeaningConventionalBn(surahMeaning.conventional_bn || "");
                  setEditMeaningScientificBn(surahMeaning.scientific_bn || "");
                  setEditMeaningConventionalEn(surahMeaning.conventional_en || "");
                  setEditMeaningScientificEn(surahMeaning.scientific_en || "");
                  setMeaningEditDialogOpen(true);
                }}
                className="h-6 px-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-md cursor-pointer shrink-0"
              >
                <Edit3 className="size-3 mr-1" />
                <span>{lang === "bn" ? "অর্থ এডিট" : "Edit Meanings"}</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
            {/* প্রচলিত অর্থ (Conventional / Popular Meaning) */}
            <div className="md:col-span-4 flex flex-col justify-between rounded-xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10 p-3 sm:p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <BookOpen className="size-3.5 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  {lang === "bn" ? "প্রচলিত অর্থ" : "Popular Meaning"}
                </span>
              </div>
              <p className="text-sm font-normal text-foreground/90 leading-relaxed">
                {lang === "bn"
                  ? (surahMeaning.conventional_bn || surahMeaning.conventional_en)
                  : (surahMeaning.conventional_en || surahMeaning.conventional_bn)}
              </p>
            </div>

            {/* বিজ্ঞানভিত্তিক অর্থ (Science-Based Meaning) */}
            <div className="md:col-span-8 flex flex-col justify-between rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-3 sm:p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-primary">
                <Cpu className="size-3.5 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  {lang === "bn" ? "বিজ্ঞানভিত্তিক গবেষণা ও গভীর অর্থ" : "Science-Based Deep Meaning"}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-normal text-foreground/90 leading-relaxed">
                {lang === "bn"
                  ? (surahMeaning.scientific_bn || surahMeaning.scientific_en)
                  : (surahMeaning.scientific_en || surahMeaning.scientific_bn)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* বিসমিল্লাহ */}
      {surahId !== 9 && surahId !== 1 && (
        <div className="text-center py-2" style={{ display: showArabic ? "block" : "none" }}>
          <p className="arabic text-foreground/90 font-medium" style={{ fontSize: `${arabicFontSize + 2}px` }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* লোডিং স্টেট - শুধুমাত্র প্রথমবার ইনিশিয়াল ডাটা না আসা পর্যন্ত দেখাবে (যা মাত্র ২০-৩০ মিলিসেকেন্ড) */}
      {!currentSurahData && (initQuery.isLoading || surahQuery.isLoading) && (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span>কুরআনের আয়াতসমূহ লোড হচ্ছে...</span>
        </div>
      )}

      {/* আয়াতসমূহ (প্রগ্রেসিভ ব্যাচ রেন্ডারিং) */}
      <div className="space-y-6">
        {displayedAyahs.map((ayah) => {
          const isEditing = editingAyah === ayah.ayah;
          const isBookmarked = isAyahBookmarked(ayah.ayah);
          const isPlaying = playingAyah === ayah.ayah;
          const isAyahAudioSaved = cachedAyahs.has(ayah.ayah);
          const isThisAyahDownloading = Boolean(downloadingAyahsMap[ayah.ayah]);
          const noteContent = ayahNotes[ayah.ayah];
          const hasNote = Boolean(noteContent && noteContent.trim().length > 0);

          return (
            <AyahCard
              key={ayah.ayah}
              ayah={ayah}
              surahId={surahId}
              isPlaying={isPlaying}
              isBookmarked={isBookmarked}
              isAyahAudioSaved={isAyahAudioSaved}
              isThisAyahDownloading={isThisAyahDownloading}
              hasNote={hasNote}
              noteContent={noteContent}
              isEditing={isEditing}
              isAdmin={isAdmin}
              lang={lang}
              showArabic={showArabic}
              showWordByWord={showWordByWord}
              showTransliteration={showTransliteration}
              showConventionalBn={showConventionalBn}
              showConventionalEn={showConventionalEn}
              showCoreMeaningBn={showCoreMeaningBn}
              showCoreMeaningEn={showCoreMeaningEn}
              showModernBn={showModernBn}
              showModernEn={showModernEn}
              showLexicon={showLexicon}
              showMetaData={showMetaData}
              arabicFontSize={arabicFontSize}
              translationFontSize={translationFontSize}
              editForm={editForm}
              setEditForm={setEditForm}
              onPlayAyah={handlePlayAyah}
              onToggleBookmark={handleToggleBookmark}
              onToggleAyahAudioDownload={handleToggleAyahAudioDownload}
              onCopyAyah={handleCopyAyah}
              onShareAyah={handleShareAyah}
              onOpenNote={handleOpenNote}
              onDeleteNote={handleDeleteNote}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onSelectWord={setSelectedWordInfo}
            />
          );
        })}
      </div>

      {/* স্ক্রল সেনটিনেল (স্ক্রল ডাউন করার সাথে সাথে পরবর্তী ব্যাচ স্বয়ংক্রিয়ভাবে আনফোল্ড করার জন্য) */}
      <div ref={sentinelRef} className="h-4 w-full pointer-events-none" />

      {/* ব্যাকগ্রাউন্ড ফুল ডাটা লোডিং প্রোগ্রেস / ইনফরমেশন */}
      {currentSurahData && displayedAyahs.length < meta.total && (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          {!isFullDataLoaded && surahQuery.isLoading ? (
            <div className="flex items-center gap-2 text-primary/80 animate-pulse text-xs sm:text-sm">
              <Loader2 className="size-4 animate-spin" />
              <span>{lang === "bn" ? "পরবর্তী আয়াতসমূহ প্রস্তুত হচ্ছে..." : "Preparing next verses..."}</span>
            </div>
          ) : displayedAyahs.length < (currentSurahData?.ayahs?.length || meta.total) ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVisibleCount((prev) => Math.min(prev + 20, meta.total))}
              className="rounded-full text-xs"
            >
              {lang === "bn" ? "আরো আয়াত দেখুন" : "Load more verses"}
            </Button>
          ) : null}
        </div>
      )}

      {/* ⚖️ ৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য) সেকশন */}
      <div
        style={{ display: showLogicalConsistency ? "block" : "none" }}
        className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5 space-y-2.5 transition-colors hover:border-border/80"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <Scale className="size-4 text-primary shrink-0" />
            <div className="min-w-0 flex flex-wrap items-baseline gap-x-2">
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {lang === "bn"
                  ? (surahConsistency?.title_bn || "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)")
                  : (surahConsistency?.title_en || "Verse 4:82 Logical Consistency Framework")}
              </span>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                {lang === "bn"
                  ? "— কুরআনের সার্বজনীন ইনফরমেশন আর্কিটেকচার ও বৈজ্ঞানিক সামঞ্জস্য বিশ্লেষণ"
                  : "— Internal non-contradiction & universal systemic harmony analysis"}
              </span>
            </div>
          </div>

          {isAdmin && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditConsistencyTitleBn(surahConsistency?.title_bn || "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)");
                setEditConsistencyBn(surahConsistency?.content_bn || "");
                setEditConsistencyEn(surahConsistency?.content_en || "");
                setConsistencyEditDialogOpen(true);
              }}
              className="h-6 px-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-md cursor-pointer shrink-0"
            >
              <Edit3 className="size-3 mr-1" />
              <span>{lang === "bn" ? "কনসিস্টেন্সি এডিট" : "Edit Consistency"}</span>
            </Button>
          )}
        </div>

        {surahConsistency?.content_bn ? (
          <div className="pt-1">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal whitespace-pre-line">
              {lang === "bn" ? surahConsistency.content_bn : (surahConsistency.content_en || surahConsistency.content_bn)}
            </p>
          </div>
        ) : (
          <div className="p-3 text-center text-xs text-muted-foreground/70">
            {lang === "bn"
              ? "এই সুরার ৪:৮২ লজিক্যাল কনসিস্টেন্সি গবেষণা কাজ চলমান রয়েছে..."
              : "Verse 4:82 Logical Consistency research is currently under development for this Surah..."}
          </div>
        )}
      </div>

      <WordAndRootSearchDialog
        selectedWord={selectedWordInfo}
        onClose={() => setSelectedWordInfo(null)}
      />

      <Dialog open={activeNoteAyah !== null} onOpenChange={(open) => !open && setActiveNoteAyah(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <StickyNote className="size-4 text-amber-400" />
              <span>আয়াত {surahId}:{activeNoteAyah} এর ব্যক্তিগত নোট</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <Textarea
              value={currentNoteText}
              onChange={(e) => setCurrentNoteText(e.target.value)}
              placeholder="এই আয়াত সম্পর্কিত আপনার ব্যক্তিগত অনুভূতি, তাদাব্বুর বা নোট এখানে লিখুন..."
              rows={5}
              className="bg-background text-sm leading-relaxed focus-visible:ring-amber-400/40"
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveNoteAyah(null)}>
                বাতিল
              </Button>
              <Button size="sm" onClick={handleSaveNote}>
                সংরক্ষণ করুন
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* সুরার প্রচলিত ও বিজ্ঞানভিত্তিক অর্থ এডিট ডায়ালগ (এডমিন অনলি) */}
      <Dialog open={meaningEditDialogOpen} onOpenChange={setMeaningEditDialogOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span>{lang === "bn" ? `সুরা ${meta.name_bn}-এর প্রচলিত ও বিজ্ঞানভিত্তিক অর্থ এডিট` : `Edit Surah ${meta.name_en} Meanings`}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* বাংলা সেকশন */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                <BookOpen className="size-3.5 text-primary" />
                <span>বাংলা অর্থ (Bangla Meanings)</span>
              </span>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-foreground/80">
                  প্রচলিত অর্থ (Bangla Conventional)
                </Label>
                <Input
                  value={editMeaningConventionalBn}
                  onChange={(e) => setEditMeaningConventionalBn(e.target.value)}
                  placeholder="যেমন: উদ্বোধনী"
                  className="text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-foreground/80">
                  বিজ্ঞানভিত্তিক অর্থ (Bangla Science-Based)
                </Label>
                <Textarea
                  rows={2}
                  value={editMeaningScientificBn}
                  onChange={(e) => setEditMeaningScientificBn(e.target.value)}
                  placeholder="যেমন: মাস্টার বুট লোডার / সিস্টেম ইনিশিয়ালাইজেশন প্রটোকল..."
                  className="text-xs sm:text-sm font-medium leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* ইংলিশ সেকশন */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                <Languages className="size-3.5 text-emerald-500" />
                <span>English Meanings</span>
              </span>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-foreground/80">
                  Popular Meaning (English)
                </Label>
                <Input
                  value={editMeaningConventionalEn}
                  onChange={(e) => setEditMeaningConventionalEn(e.target.value)}
                  placeholder="e.g. The Opening"
                  className="text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-foreground/80">
                  Science-Based Meaning (English)
                </Label>
                <Textarea
                  rows={2}
                  value={editMeaningScientificEn}
                  onChange={(e) => setEditMeaningScientificEn(e.target.value)}
                  placeholder="e.g. Master Boot Loader / System Initialization Protocol..."
                  className="text-xs sm:text-sm font-medium leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
              <Button variant="outline" size="sm" onClick={() => setMeaningEditDialogOpen(false)}>
                {lang === "bn" ? "বাতিল" : "Cancel"}
              </Button>
              <Button size="sm" onClick={handleSaveSurahMeaning} className="bg-primary text-primary-foreground cursor-pointer">
                <Check className="size-3.5 mr-1" />
                {lang === "bn" ? "সংরক্ষণ করুন" : "Save Meanings"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ৪:৮২ লজিক্যাল কনসিস্টেন্সি এডিট ডায়ালগ (এডমিন অনলি) */}
      <Dialog open={consistencyEditDialogOpen} onOpenChange={setConsistencyEditDialogOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              <span>{lang === "bn" ? `সুরা ${meta.name_bn} — ৪:৮২ লজিক্যাল কনসিস্টেন্সি এডিট` : `Edit Surah ${meta.name_en} Consistency`}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">শিরোনাম (Title)</Label>
              <Input
                value={editConsistencyTitleBn}
                onChange={(e) => setEditConsistencyTitleBn(e.target.value)}
                placeholder="৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)"
                className="text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">বাংলা বিশ্লেষণ (Bangla Content)</Label>
              <Textarea
                rows={6}
                value={editConsistencyBn}
                onChange={(e) => setEditConsistencyBn(e.target.value)}
                placeholder="এই সুরার ৪:৮২ ভিত্তিক বৈজ্ঞানিক সামঞ্জস্য বিশ্লেষণ লিখুন..."
                className="text-xs sm:text-sm font-normal leading-relaxed resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">English Analysis (Optional)</Label>
              <Textarea
                rows={4}
                value={editConsistencyEn}
                onChange={(e) => setEditConsistencyEn(e.target.value)}
                placeholder="English logical consistency analysis..."
                className="text-xs sm:text-sm font-normal leading-relaxed resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
              <Button variant="outline" size="sm" onClick={() => setConsistencyEditDialogOpen(false)}>
                {lang === "bn" ? "বাতিল" : "Cancel"}
              </Button>
              <Button size="sm" onClick={handleSaveSurahConsistency} className="bg-primary text-primary-foreground cursor-pointer">
                <Check className="size-3.5 mr-1" />
                {lang === "bn" ? "সংরক্ষণ করুন" : "Save Consistency"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const searchCacheMap = new Map<string, MatchedOccurrence[]>();

type MatchedOccurrence = {
  surah: number;
  ayah: number;
  matchedWords: QuranWord[];
  allWords: QuranWord[];
};

function WordAndRootSearchDialog({
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
  const [results, setResults] = useState<MatchedOccurrence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const activeRoot = useMemo(() => {
    if (!selectedWord) return "";
    return extractIntelligentRoot(selectedWord.word);
  }, [selectedWord]);

  useEffect(() => {
    if (!selectedWord) return;

    const cacheKey = `${searchType}:${searchType === "word" ? cleanArabicText(selectedWord.word.text_uthmani) : activeRoot}`;
    
    if (searchCacheMap.has(cacheKey)) {
      setResults(searchCacheMap.get(cacheKey)!);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setResults([]);

    const runSearch = async () => {
      const matchedAyahs: MatchedOccurrence[] = [];
      const cleanTargetWord = cleanArabicText(selectedWord.word.text_uthmani);
      const surahIds = Array.from({ length: 114 }, (_, i) => i + 1);

      await Promise.all(
        surahIds.map(async (sId) => {
          try {
            const data: SurahData = await queryClient.fetchQuery({
              queryKey: ["local-surah-cache", sId],
              queryFn: () => fetchSurahData(sId),
              staleTime: Infinity,
            });

            data.ayahs.forEach((a) => {
              const matchedWordsInThisAyah: QuranWord[] = [];

              a.words.forEach((w) => {
                let isMatch = false;

                if (searchType === "word") {
                  isMatch = cleanArabicText(w.text_uthmani) === cleanTargetWord;
                } else if (searchType === "root" && activeRoot) {
                  const wRoot = extractIntelligentRoot(w);
                  isMatch = wRoot === activeRoot;
                }

                if (isMatch) {
                  matchedWordsInThisAyah.push(w);
                }
              });

              if (matchedWordsInThisAyah.length > 0) {
                matchedAyahs.push({
                  surah: sId,
                  ayah: a.ayah,
                  matchedWords: matchedWordsInThisAyah,
                  allWords: a.words,
                });
              }
            });
          } catch (e) {}
        })
      );

      if (isMounted) {
        matchedAyahs.sort((a, b) => a.surah - b.surah || a.ayah - b.ayah);
        searchCacheMap.set(cacheKey, matchedAyahs);
        setResults(matchedAyahs);
        setIsLoading(false);
      }
    };

    runSearch();

    return () => {
      isMounted = false;
    };
  }, [selectedWord, searchType, activeRoot, queryClient]);

  if (!selectedWord) return null;
  const { word, surah, ayah } = selectedWord;

  const handleJumpToAyah = (sId: number, aNum: number) => {
    onClose();
    navigate({
      to: "/surah/$id",
      params: { id: String(sId) },
      search: { ayah: aNum },
    });
  };

  const totalWordOccurrences = results.reduce((acc, curr) => acc + curr.matchedWords.length, 0);

  return (
    <Dialog open={!!selectedWord} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col sm:max-w-2xl p-0 gap-0 border border-border/80 shadow-2xl bg-card">
        
        <DialogHeader className="p-5 pb-3 border-b border-border/60 bg-muted/20 text-center shrink-0">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              {word.grammar_bn || "শব্দ"}
            </span>
          </div>

          <DialogTitle className="arabic text-3xl text-foreground font-bold tracking-wide my-1">
            {word.text_uthmani}
          </DialogTitle>

          {word.transliteration && (
            <p className="text-xs italic text-muted-foreground font-mono">
              [{word.transliteration}]
            </p>
          )}
          {word.translation_bn && (
            <p className="text-sm font-medium text-foreground/90 mt-1">
              "{word.translation_bn}"
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto mt-3">
            <div className="rounded-xl border border-border/70 bg-card p-2 text-center shadow-xs">
              <span className="text-[10px] text-muted-foreground block mb-0.5">ক্রিয়ামূল:</span>
              <span className="arabic text-sm font-semibold text-foreground">
                {word.lemma || word.text_uthmani}
              </span>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-2 text-center shadow-xs">
              <span className="text-[10px] text-muted-foreground block mb-0.5">মূল ধাতু (Root):</span>
              <span className="arabic text-sm font-semibold text-foreground">
                {activeRoot || "—"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 mt-3 p-1 rounded-xl bg-muted/80 w-fit mx-auto border border-border/60">
            <button
              type="button"
              onClick={() => setSearchType("word")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                searchType === "word"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="size-3.5" /> হুবহু এই শব্দ
            </button>
            <button
              type="button"
              disabled={!activeRoot}
              onClick={() => setSearchType("root")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                searchType === "root"
                  ? "bg-background text-primary shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground disabled:opacity-40"
              }`}
            >
              <Sparkles className="size-3.5 text-primary" /> মূল রুট ({activeRoot || "নেই"})
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1 border-b border-border/40 pb-2">
            <span>
              {searchType === "word" 
                ? `হুবহু "${word.text_uthmani}" শব্দের ব্যবহার` 
                : `মূল ধাতু "${activeRoot}" থেকে গঠিত সকল শব্দের ব্যবহার`}
            </span>
            <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md">
              {formatNumber(results.length, lang)} টি আয়াতে মোট {formatNumber(totalWordOccurrences, lang)} বার
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span>কুরআন জুড়ে অনুসন্ধান করা হচ্ছে...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              কোনো ফলাফল পাওয়া যায়নি।
            </div>
          ) : (
            results.map((res, index) => {
              const surahObj = SURAH_META_MAP[res.surah] || { name_bn: `সুরা ${res.surah}` };
              const cleanTargetWord = cleanArabicText(word.text_uthmani);

              return (
                <div
                  key={`${res.surah}-${res.ayah}-${index}`}
                  className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2.5 shadow-xs hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground font-mono">
                      <span className="size-2 rounded-full bg-primary" />
                      {surahObj.name_bn} ({res.surah}:{res.ayah})
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => handleJumpToAyah(res.surah, res.ayah)}
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium cursor-pointer"
                    >
                      <span>আয়াতে যান</span>
                      <ExternalLink className="size-3" />
                    </button>
                  </div>

                  <div 
                    dir="rtl" 
                    className="flex flex-wrap items-center justify-start gap-x-2 gap-y-2 py-1 leading-loose"
                  >
                    {res.allWords.map((w, wIdx) => {
                      let isHighlighted = false;
                      if (searchType === "word") {
                        isHighlighted = cleanArabicText(w.text_uthmani) === cleanTargetWord;
                      } else if (searchType === "root" && activeRoot) {
                        const wRoot = extractIntelligentRoot(w);
                        const wText = cleanArabicText(w.text_uthmani);
                        const wLemma = cleanArabicText(w.lemma || "");
                        isHighlighted = (wRoot === activeRoot) || wLemma.includes(activeRoot) || wText.includes(activeRoot);
                      }

                      return (
                        <span
                          key={wIdx}
                          className={`arabic text-lg rounded-md px-1.5 py-0.5 transition-all ${
                            isHighlighted
                              ? "bg-primary/20 text-primary font-bold border border-primary/40 shadow-2xs"
                              : "text-foreground/90 font-normal"
                          }`}
                        >
                          {w.text_uthmani}
                        </span>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {res.matchedWords.map((mw, mIdx) => (
                      <div 
                        key={mIdx} 
                        className="rounded-lg bg-muted/40 p-2 border border-border/40 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground arabic text-sm">
                            {mw.text_uthmani}
                          </span>
                          {mw.transliteration && (
                            <span className="italic text-muted-foreground font-mono text-[11px]">
                              [{mw.transliteration}]
                            </span>
                          )}
                          {mw.translation_bn && (
                            <span className="text-foreground/90 font-medium">
                              : {mw.translation_bn}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                          শব্দ নং {formatNumber(mw.position, lang)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}