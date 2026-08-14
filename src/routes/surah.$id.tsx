import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
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
  BookmarkCheck
} from "lucide-react";

import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/surah/$id")({
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
  modern_meaning?: string; // আমাদের আধুনিক শব্দার্থ
};

export type QuranAyah = {
  surah: number;
  ayah: number;
  text_uthmani: string;
  transliteration?: string;          // পূর্ণ আয়াতের উচ্চারণ
  conventional_bn?: string;          // ১. প্রচলিত অনুবাদ (Greentech বাংলা)
  conventional_en?: string;          // ২. Conventional Translation (Greentech ইংরেজি)
  modern_translation_bn?: string;    // ৩. আধুনিক অনুবাদ (আমাদের বাংলা)
  modern_translation_en?: string;    // ৪. Modern Translation (আমাদের ইংরেজি)
  lexicon_modern_notes?: string;     // ৫. অভিধান/Lexicon আধুনিক নোট
  words: QuranWord[];
};

export type SurahData = {
  surah: number;
  ayahs: QuranAyah[];
};

const SURAH_LIST = [
  { id: 1, name_bn: "আল-ফাতিহা", name_ar: "الفاتحة", type: "মাক্কী", total: 7 },
  { id: 2, name_bn: "আল-বাকারাহ", name_ar: "البقرة", type: "মাদানী", total: 286 },
  { id: 3, name_bn: "আলে ইমরান", name_ar: "آل عمران", type: "মাদানী", total: 200 },
  { id: 4, name_bn: "আন-নিসা", name_ar: "النساء", type: "মাদানী", total: 176 },
  { id: 5, name_bn: "আল-মায়িদাহ", name_ar: "المائدة", type: "মাদানী", total: 120 },
  { id: 6, name_bn: "আল-আনআম", name_ar: "الأنعام", type: "মাক্কী", total: 165 },
  { id: 7, name_bn: "আল-আরাফ", name_ar: "الأعراف", type: "মাক্কী", total: 206 },
  { id: 8, name_bn: "আল-আনফাল", name_ar: "الأنفال", type: "মাদানী", total: 75 },
  { id: 9, name_bn: "আত-তাওবাহ", name_ar: "التوبة", type: "মাদানী", total: 129 },
  { id: 10, name_bn: "ইউনুস", name_ar: "يونس", type: "মাক্কী", total: 109 },
  { id: 11, name_bn: "হুদ", name_ar: "هود", type: "মাক্কী", total: 123 },
  { id: 12, name_bn: "ইউসুফ", name_ar: "يوسف", type: "মাক্কী", total: 111 },
  { id: 13, name_bn: "আর-রাদ", name_ar: "الرعد", type: "মাদানী", total: 43 },
  { id: 14, name_bn: "ইবরাহিম", name_ar: "إبراهيم", type: "মাক্কী", total: 52 },
  { id: 15, name_bn: "আল-হিজর", name_ar: "الحجر", type: "মাক্কী", total: 99 },
  { id: 16, name_bn: "আন-নাহল", name_ar: "النحل", type: "মাক্কী", total: 128 },
  { id: 17, name_bn: "আল-ইসরা", name_ar: "الإسراء", type: "মাক্কী", total: 111 },
  { id: 18, name_bn: "আল-কাহফ", name_ar: "الكهف", type: "মাক্কী", total: 110 },
  { id: 19, name_bn: "মারিয়াম", name_ar: "مريم", type: "মাক্কী", total: 98 },
  { id: 20, name_bn: "ত্বা-হা", name_ar: "طه", type: "মাক্কী", total: 135 },
  { id: 21, name_bn: "আল-আম্বিয়া", name_ar: "الأنبياء", type: "মাক্কী", total: 112 },
  { id: 22, name_bn: "আল-হাজ্জ", name_ar: "الحج", type: "মাদানী", total: 78 },
  { id: 23, name_bn: "আল-মুমিনুন", name_ar: "المؤمنون", type: "মাক্কী", total: 118 },
  { id: 24, name_bn: "আন-নুর", name_ar: "النور", type: "মাদানী", total: 64 },
  { id: 25, name_bn: "আল-ফুরকান", name_ar: "الفرقان", type: "মাক্কী", total: 77 },
  { id: 26, name_bn: "আশ-শুয়ারা", name_ar: "الشعراء", type: "মাক্কী", total: 227 },
  { id: 27, name_bn: "আন-নামল", name_ar: "النمل", type: "মাক্কী", total: 93 },
  { id: 28, name_bn: "আল-কাসাস", name_ar: "القصص", type: "মাক্কী", total: 88 },
  { id: 29, name_bn: "আল-আনকাবুত", name_ar: "العنكبوت", type: "মাক্কী", total: 69 },
  { id: 30, name_bn: "আর-রুম", name_ar: "الروم", type: "মাক্কী", total: 60 },
  { id: 31, name_bn: "লুকমান", name_ar: "لقمان", type: "মাক্কী", total: 34 },
  { id: 32, name_bn: "আস-সাজদাহ", name_ar: "السجدة", type: "মাক্কী", total: 30 },
  { id: 33, name_bn: "আল-আহযাব", name_ar: "الأحزاب", type: "মাদানী", total: 73 },
  { id: 34, name_bn: "সাবা", name_ar: "سبإ", type: "মাক্কী", total: 54 },
  { id: 35, name_bn: "ফাতির", name_ar: "فاطر", type: "মাক্কী", total: 45 },
  { id: 36, name_bn: "ইয়াসিন", name_ar: "يس", type: "মাক্কী", total: 83 },
  { id: 37, name_bn: "আস-সাফফাত", name_ar: "الصافات", type: "মাক্কী", total: 182 },
  { id: 38, name_bn: "সোয়াদ", name_ar: "ص", type: "মাক্কী", total: 88 },
  { id: 39, name_bn: "আজ-জুমার", name_ar: "الزمر", type: "মাক্কী", total: 75 },
  { id: 40, name_bn: "গাফির", name_ar: "غافر", type: "মাক্কী", total: 85 },
  { id: 41, name_bn: "ফুসসিলাত", name_ar: "فصلت", type: "মাক্কী", total: 54 },
  { id: 42, name_bn: "আশ-শুরা", name_ar: "الشورى", type: "মাক্কী", total: 53 },
  { id: 43, name_bn: "আজ-জুখরূফ", name_ar: "الزخرف", type: "মাক্কী", total: 89 },
  { id: 44, name_bn: "আদ-দুখান", name_ar: "الدخان", type: "মাক্কী", total: 59 },
  { id: 45, name_bn: "আল-জাসিয়াহ", name_ar: "الجاثية", type: "মাক্কী", total: 37 },
  { id: 46, name_bn: "আল-আহকাফ", name_ar: "الأحقاف", type: "মাক্কী", total: 35 },
  { id: 47, name_bn: "মুহাম্মদ", name_ar: "محمد", type: "মাদানী", total: 38 },
  { id: 48, name_bn: "আল-ফাতহ", name_ar: "الفتح", type: "মাদানী", total: 29 },
  { id: 49, name_bn: "আল-হুজুরাত", name_ar: "الحجرات", type: "মাদানী", total: 18 },
  { id: 50, name_bn: "কাফ", name_ar: "ق", type: "মাক্কী", total: 45 },
  { id: 51, name_bn: "আজ-যারিয়াত", name_ar: "الذاريات", type: "মাক্কী", total: 60 },
  { id: 52, name_bn: "আত-তুর", name_ar: "الطور", type: "মাক্কী", total: 49 },
  { id: 53, name_bn: "আন-নাজম", name_ar: "النجم", type: "মাক্কী", total: 62 },
  { id: 54, name_bn: "আল-কামার", name_ar: "القمر", type: "মাক্কী", total: 55 },
  { id: 55, name_bn: "আর-রাহমান", name_ar: "الرحمن", type: "মাদানী", total: 78 },
  { id: 56, name_bn: "আল-ওয়াকিয়াহ", name_ar: "الواقعة", type: "মাক্কী", total: 96 },
  { id: 57, name_bn: "আল-হাদিদ", name_ar: "الحديد", type: "মাদানী", total: 29 },
  { id: 58, name_bn: "আল-মুজাদালাহ", name_ar: "المجادلة", type: "মাদানী", total: 22 },
  { id: 59, name_bn: "আল-হাশর", name_ar: "الحشر", type: "মাদানী", total: 24 },
  { id: 60, name_bn: "আল-মুমতাহানাহ", name_ar: "الممتحنة", type: "মাদানী", total: 13 },
  { id: 61, name_bn: "আস-সফ", name_ar: "الصف", type: "মাদানী", total: 14 },
  { id: 62, name_bn: "আল-জুমুআহ", name_ar: "الجمعة", type: "মাদানী", total: 11 },
  { id: 63, name_bn: "আল-মুনাফিকুন", name_ar: "المنافقون", type: "মাদানী", total: 11 },
  { id: 64, name_bn: "আত-তাগাবুন", name_ar: "التغابن", type: "মাদানী", total: 18 },
  { id: 65, name_bn: "আত-ত্বালাক", name_ar: "الطلاق", type: "মাদানী", total: 12 },
  { id: 66, name_bn: "আত-তাহরিম", name_ar: "التحريم", type: "মাদানী", total: 12 },
  { id: 67, name_bn: "আল-মুলক", name_ar: "الملك", type: "মাক্কী", total: 30 },
  { id: 68, name_bn: "আল-কলম", name_ar: "القلم", type: "মাক্কী", total: 52 },
  { id: 69, name_bn: "আল-হাক্কাহ", name_ar: "الحاقة", type: "মাক্কী", total: 52 },
  { id: 70, name_bn: "আল-মাআরিজ", name_ar: "المعارج", type: "মাক্কী", total: 44 },
  { id: 71, name_bn: "নুহ", name_ar: "نوح", type: "মাক্কী", total: 28 },
  { id: 72, name_bn: "আল-জ্বিন", name_ar: "الجن", type: "মাক্কী", total: 28 },
  { id: 73, name_bn: "আল-মুযযাম্মিল", name_ar: "المزمل", type: "মাক্কী", total: 20 },
  { id: 74, name_bn: "আল-মুদ্দাসসির", name_ar: "المدثر", type: "মাক্কী", total: 56 },
  { id: 75, name_bn: "আল-কিয়ামাহ", name_ar: "القيامة", type: "মাক্কী", total: 40 },
  { id: 76, name_bn: "আল-ইনসান", name_ar: "الإنسان", type: "মাদানী", total: 31 },
  { id: 77, name_bn: "আল-মুরসালাত", name_ar: "المرسلات", type: "মাক্কী", total: 50 },
  { id: 78, name_bn: "আন-নাবা", name_ar: "النبإ", type: "মাক্কী", total: 40 },
  { id: 79, name_bn: "আন-নাযিয়াত", name_ar: "الনাজعات", type: "মাক্কী", total: 46 },
  { id: 80, name_bn: "আবাসা", name_ar: "عبس", type: "মাক্কী", total: 42 },
  { id: 81, name_bn: "আত-তাকভীর", name_ar: "التکویر", type: "মাক্কী", total: 29 },
  { id: 82, name_bn: "আল-ইনফিতার", name_ar: "الانفطار", type: "মাক্কী", total: 19 },
  { id: 83, name_bn: "আল-মুতাফফিফিন", name_ar: "المطففين", type: "মাক্কী", total: 36 },
  { id: 84, name_bn: "আল-ইনশিকাক", name_ar: "الانشقاق", type: "মাক্কী", total: 25 },
  { id: 85, name_bn: "আল-বুরূজ", name_ar: "البروج", type: "মাক্কী", total: 22 },
  { id: 86, name_bn: "আত-তারিক", name_ar: "الطارق", type: "মাক্কী", total: 17 },
  { id: 87, name_bn: "আল-আলা", name_ar: "الأعلى", type: "মাক্কী", total: 19 },
  { id: 88, name_bn: "আল-গাশিয়াহ", name_ar: "الغاشية", type: "মাক্কী", total: 26 },
  { id: 89, name_bn: "আল-ফাজর", name_ar: "الفجر", type: "মাক্কী", total: 30 },
  { id: 90, name_bn: "আল-বালাদ", name_ar: "البلد", type: "মাক্কী", total: 20 },
  { id: 91, name_bn: "আশ-শামস", name_ar: "الشمس", type: "মাক্কী", total: 15 },
  { id: 92, name_bn: "আল-লাইল", name_ar: "الليل", type: "মাক্কী", total: 21 },
  { id: 93, name_bn: "আদ-দুহা", name_ar: "الضحى", type: "মাক্কী", total: 11 },
  { id: 94, name_bn: "আশ-শারহ", name_ar: "الشرح", type: "মাক্কী", total: 8 },
  { id: 95, name_bn: "আত-তীন", name_ar: "التين", type: "মাক্কী", total: 8 },
  { id: 96, name_bn: "আল-আলাক", name_ar: "العلق", type: "মাক্কী", total: 19 },
  { id: 97, name_bn: "আল-কদর", name_ar: "القدر", type: "মাক্কী", total: 5 },
  { id: 98, name_bn: "আল-বাইয়িনাহ", name_ar: "البينة", type: "মাদানী", total: 8 },
  { id: 99, name_bn: "আল-যিলযাল", name_ar: "الزلزلة", type: "মাদানী", total: 8 },
  { id: 100, name_bn: "আল-আদিয়াত", name_ar: "العاديات", type: "মাক্কী", total: 11 },
  { id: 101, name_bn: "আল-কারিয়াহ", name_ar: "القارعة", type: "মাক্কী", total: 11 },
  { id: 102, name_bn: "আত-তাকাসুর", name_ar: "التكاثر", type: "মাক্কী", total: 8 },
  { id: 103, name_bn: "আল-আসর", name_ar: "العصر", type: "মাক্কী", total: 3 },
  { id: 104, name_bn: "আল-হুমাযাহ", name_ar: "الهمزة", type: "মাক্কী", total: 9 },
  { id: 105, name_bn: "আল-ফীল", name_ar: "الفيل", type: "মাক্কী", total: 5 },
  { id: 106, name_bn: "কুরাইশ", name_ar: "قريش", type: "মাক্কী", total: 4 },
  { id: 107, name_bn: "আল-মাউন", name_ar: "الماعون", type: "মাক্কী", total: 7 },
  { id: 108, name_bn: "আল-কাউসার", name_ar: "الكوثر", type: "মাক্কী", total: 3 },
  { id: 109, name_bn: "আল-কাফিরুন", name_ar: "الكافرون", type: "মাক্কী", total: 6 },
  { id: 110, name_bn: "আন-নাসর", name_ar: "النصر", type: "মাদানী", total: 3 },
  { id: 111, name_bn: "আল-লাহাব", name_ar: "المسد", type: "মাক্কী", total: 5 },
  { id: 112, name_bn: "আল-ইখলাস", name_ar: "الإخلاص", type: "মাক্কী", total: 4 },
  { id: 113, name_bn: "আল-ফালাক", name_ar: "الفلق", type: "মাক্কী", total: 5 },
  { id: 114, name_bn: "আন-নাস", name_ar: "الناس", type: "মাক্কী", total: 6 },
];

function formatNumber(num: number | string, lang: string) {
  if (lang !== "bn") return String(num);
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

function SurahDetailPage() {
  const { id } = Route.useParams();
  const surahId = Number(id) || 1;
  const { lang } = usePrefs();

  // অ্যাডমিন স্ট্যাটাস
  const isAdmin = true;

  const [selectedWordInfo, setSelectedWordInfo] = useState<{
    surah: number;
    ayah: number;
    word: QuranWord;
  } | null>(null);

  const [editingAyah, setEditingAyah] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    modern_translation_bn: "",
    modern_translation_en: "",
    lexicon_modern_notes: "",
  });

  const meta = SURAH_LIST[surahId - 1] || SURAH_LIST[0];

  const surahQuery = useQuery<SurahData>({
    queryKey: ["local-greentech-surah-v7", surahId],
    queryFn: async () => {
      const res = await fetch(`/data/quran/surahs/${surahId}.json`);
      if (!res.ok) throw new Error(`Failed to load Surah ${surahId}`);
      return res.json();
    },
  });

  const handleStartEdit = (ayah: QuranAyah) => {
    setEditingAyah(ayah.ayah);
    setEditForm({
      modern_translation_bn: ayah.modern_translation_bn || "",
      modern_translation_en: ayah.modern_translation_en || "",
      lexicon_modern_notes: ayah.lexicon_modern_notes || "",
    });
  };

  const handleSaveEdit = (ayahNumber: number) => {
    if (surahQuery.data) {
      const target = surahQuery.data.ayahs.find((a) => a.ayah === ayahNumber);
      if (target) {
        target.modern_translation_bn = editForm.modern_translation_bn;
        target.modern_translation_en = editForm.modern_translation_en;
        target.lexicon_modern_notes = editForm.lexicon_modern_notes;
      }
    }
    setEditingAyah(null);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
      {/* সুরা হেডার */}
      <div className="card-soft flex flex-col items-center justify-center p-6 text-center space-y-2 border border-border/80 shadow-xs rounded-xl bg-card">
        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
          সুরা নম্বর: {formatNumber(meta.id, lang)} · {meta.type}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {meta.name_bn}{" "}
          <span className="arabic text-2xl font-normal text-muted-foreground">
            ({meta.name_ar})
          </span>
        </h1>
        <p className="text-xs text-muted-foreground">
          মোট আয়াত: {formatNumber(meta.total, lang)} টি
        </p>

        {/* নেভিগেশন বাটন */}
        <div className="flex items-center gap-3 pt-2">
          {surahId > 1 && (
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to="/surah/$id" params={{ id: String(surahId - 1) }}>
                <ChevronLeft className="size-3.5 mr-1" /> পূর্ববর্তী সুরা
              </Link>
            </Button>
          )}
          {surahId < 114 && (
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to="/surah/$id" params={{ id: String(surahId + 1) }}>
                পরবর্তী সুরা <ChevronRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* বিসমিল্লাহ */}
      {surahId !== 9 && surahId !== 1 && (
        <div className="text-center py-4">
          <p className="arabic text-2xl text-foreground/90 font-medium">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* লোডিং স্টেট */}
      {surahQuery.isLoading && (
        <div className="py-16 text-center text-sm text-muted-foreground animate-pulse">
          কুরআনের আয়াতসমূহ লোড হচ্ছে...
        </div>
      )}

      {/* আয়াতসমূহ */}
      <div className="space-y-6">
        {surahQuery.data?.ayahs?.map((ayah) => {
          const fallbackEn = ayah.conventional_en || ayah.words.map(w => w.translation_bn ? w.transliteration : "").filter(Boolean).join(" ");

          return (
            <div
              key={ayah.ayah}
              id={`ayah-${ayah.ayah}`}
              className="rounded-xl border border-border/70 bg-card p-5 space-y-4 shadow-xs transition-all hover:border-border/90"
            >
              {/* হেডার ও এডিট অ্যাকশন */}
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center size-7 rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                    {formatNumber(ayah.ayah, lang)}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {meta.name_bn} {surahId}:{ayah.ayah}
                  </span>
                </div>

                {/* ADMIN EDIT ACTION BUTTON */}
                {isAdmin && (
                  <div>
                    {editingAyah === ayah.ayah ? (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleSaveEdit(ayah.ayah)}
                        >
                          <Check className="size-3.5 mr-1" /> সংরক্ষণ
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => setEditingAyah(null)}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-xs text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                        onClick={() => handleStartEdit(ayah)}
                      >
                        <Edit3 className="size-3 mr-1" /> আধুনিক অনুবাদ ও অভিধান এডিট
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* [১] শব্দে শব্দে আরবি টেক্সট (Word-by-Word) */}
              <div
                dir="rtl"
                className="flex flex-wrap items-center justify-start gap-x-4 gap-y-5 py-3 border-b border-border/40"
              >
                {ayah.words.map((word) => (
                  <div
                    key={word.position}
                    onClick={() =>
                      setSelectedWordInfo({
                        surah: surahId,
                        ayah: ayah.ayah,
                        word,
                      })
                    }
                    className="group flex flex-col items-center cursor-pointer rounded-lg p-2 transition-all hover:bg-primary/10 active:scale-95"
                  >
                    <span className="arabic text-2xl sm:text-3xl text-foreground transition-colors group-hover:text-primary leading-loose">
                      {word.text_uthmani}
                    </span>
                    {word.transliteration && (
                      <span className="text-[11px] font-mono text-muted-foreground/80 italic group-hover:text-primary/90 mt-0.5">
                        {word.transliteration}
                      </span>
                    )}
                    {word.translation_bn && (
                      <span className="text-xs text-muted-foreground font-medium transition-colors group-hover:text-foreground mt-1 text-center">
                        {word.translation_bn}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* [২] পুরো আয়াতের পরে আয়াতের Transliteration / উচ্চারণ */}
              {ayah.transliteration && (
                <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <Volume2 className="size-3.5 text-primary" />
                    <span>উচ্চারণ / Transliteration:</span>
                  </div>
                  <p className="text-sm italic text-foreground font-serif leading-relaxed pl-5">
                    {ayah.transliteration}
                  </p>
                </div>
              )}

              {/* [৩] অনুবাদের ৪টি পৃথক সারি (4 Rows) */}
              <div className="space-y-3 pt-1">
                {/* সারি ১: প্রচলিত অনুবাদ (Greentech বাংলা) */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <FileText className="size-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      ১. প্রচলিত অনুবাদ
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground/90 leading-relaxed pl-5">
                    {ayah.conventional_bn || (ayah as any).translation_bn || "প্রচলিত বাংলা অনুবাদ লোড হচ্ছে..."}
                  </p>
                </div>

                {/* সারি ২: Conventional Translation (Greentech ইংরেজি) */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-600/90 dark:text-amber-400/90">
                    <Languages className="size-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      ২. Conventional Translation
                    </span>
                  </div>
                  <p className="text-sm italic text-muted-foreground font-serif leading-relaxed pl-5">
                    {ayah.conventional_en || fallbackEn || "Conventional English translation..."}
                  </p>
                </div>

                {/* সারি ৩: আধুনিক অনুবাদ (আমাদের বাংলা অনুবাদ) */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <BookMarked className="size-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      ৩. আধুনিক অনুবাদ
                    </span>
                  </div>
                  {editingAyah === ayah.ayah ? (
                    <Textarea
                      value={editForm.modern_translation_bn}
                      onChange={(e) =>
                        setEditForm({ ...editForm, modern_translation_bn: e.target.value })
                      }
                      className="text-sm ml-5 mt-1"
                      placeholder="আমাদের আধুনিক বাংলা অনুবাদ ইনপুট দিন..."
                    />
                  ) : (
                    <p className="text-sm font-semibold text-foreground leading-relaxed pl-5">
                      {ayah.modern_translation_bn || "— [আধুনিক বাংলা অনুবাদ পর্যায়ক্রমে যুক্ত হবে]"}
                    </p>
                  )}
                </div>

                {/* সারি ৪: Modern Translation (আমাদের ইংরেজি অনুবাদ) */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                    <BookmarkCheck className="size-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      ৪. Modern Translation
                    </span>
                  </div>
                  {editingAyah === ayah.ayah ? (
                    <Textarea
                      value={editForm.modern_translation_en}
                      onChange={(e) =>
                        setEditForm({ ...editForm, modern_translation_en: e.target.value })
                      }
                      className="text-sm font-serif italic ml-5 mt-1"
                      placeholder="Modern contemporary English translation..."
                    />
                  ) : (
                    <p className="text-sm italic text-foreground/90 font-serif leading-relaxed pl-5">
                      {ayah.modern_translation_en || "— [Modern English translation will be updated sequentially]"}
                    </p>
                  )}
                </div>
              </div>

              {/* [৪] অভিধান / Lexicon */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Layers className="size-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    অভিধান / Lexicon
                  </span>
                </div>

                {/* Greentech এর মূল শব্দার্থ ও রুট ব্যাজসমূহ */}
                <div className="pl-5 flex flex-wrap gap-2">
                  {ayah.words
                    .filter((w) => w.root && w.root !== "—")
                    .map((w, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/60 px-2.5 py-1 font-mono text-[11px]"
                      >
                        <span className="arabic font-bold text-foreground text-sm">{w.text_uthmani}</span>
                        <span className="text-amber-500 font-bold">({w.root})</span>
                        <span className="text-muted-foreground text-[10px]">
                          {w.translation_bn ? `· ${w.translation_bn}` : ""}
                        </span>
                      </span>
                    ))}
                </div>

                {/* এডিটেবল আধুনিক/Modern শব্দার্থ ও ব্যাকরণ নোট */}
                {editingAyah === ayah.ayah ? (
                  <div className="pl-5 mt-2">
                    <label className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                      আধুনিক অভিধান / Lexicon শব্দার্থ ইনপুট:
                    </label>
                    <Textarea
                      value={editForm.lexicon_modern_notes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lexicon_modern_notes: e.target.value })
                      }
                      className="text-sm"
                      placeholder="শব্দের আধুনিক অর্থ, প্রাসঙ্গিক ব্যাকরণগত বিশ্লেষণ বা গভীর অর্থ লিখুন..."
                    />
                  </div>
                ) : (
                  ayah.lexicon_modern_notes && (
                    <div className="pl-5">
                      <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-md border border-border/40 leading-relaxed">
                        <span className="font-semibold text-foreground mr-1">আধুনিক অভিধান নোট:</span>
                        {ayah.lexicon_modern_notes}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* গ্রীনটেক স্টাইল Word & Root Search ডায়ালগ */}
      <WordAndRootSearchDialog
        selectedWord={selectedWordInfo}
        onClose={() => setSelectedWordInfo(null)}
      />
    </div>
  );
}

/** গ্রীনটেক স্টাইল Word & Root Search ডায়ালগ */
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

  if (!selectedWord) return null;
  const { word, surah, ayah } = selectedWord;

  const activeRoot = word.root && word.root !== "—" ? word.root : word.text_uthmani.slice(0, 3);

  return (
    <Dialog open={!!selectedWord} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl p-0 gap-0 border border-border/80 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {word.grammar_bn || "শব্দ"}
            </span>
          </div>

          <DialogTitle className="arabic text-4xl text-foreground font-bold tracking-wide my-1">
            {word.text_uthmani}
          </DialogTitle>

          {word.transliteration && (
            <p className="text-xs italic text-muted-foreground font-mono">
              [{word.transliteration}]
            </p>
          )}
          {word.translation_bn && (
            <p className="text-base font-semibold text-foreground/90 mt-1">
              "{word.translation_bn}"
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mt-4">
            <div className="rounded-xl border border-border/70 bg-card p-2.5 text-center shadow-2xs">
              <span className="text-[11px] text-muted-foreground block mb-0.5">ক্রিয়ামূল:</span>
              <span className="arabic text-base font-bold text-foreground">
                {word.lemma || word.text_uthmani}
              </span>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-2.5 text-center shadow-2xs">
              <span className="text-[11px] text-muted-foreground block mb-0.5">মূল (Root):</span>
              <span className="arabic text-base font-bold text-amber-500">
                {activeRoot}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 mt-4 p-1 rounded-xl bg-muted/80 w-fit mx-auto border border-border/60">
            <button
              type="button"
              onClick={() => setSearchType("word")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                searchType === "word"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="size-3.5" /> হুবহু এই শব্দ
            </button>
            <button
              type="button"
              onClick={() => setSearchType("root")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                searchType === "root"
                  ? "bg-background text-primary shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="size-3.5 text-amber-500" /> মূল রুট ({activeRoot})
            </button>
          </div>
        </DialogHeader>

        <div className="p-5 text-center text-xs text-muted-foreground space-y-1">
          <p>অবস্থান: সুরা {formatNumber(surah, lang)} : আয়াত {formatNumber(ayah, lang)} · শব্দ {formatNumber(word.position, lang)}</p>
          <p className="text-[11px] text-primary/80">
            {searchType === "word" ? `কুরআন জুড়ে "${word.text_uthmani}" শব্দের ব্যবহার` : `কুরআন জুড়ে মূল ধাতু "${activeRoot}" থেকে গঠিত সকল আয়াত`}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}