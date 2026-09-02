// src/components/QuranExportAdmin.tsx
import { useState, useMemo } from "react";
import {
  BookOpen,
  FileDown,
  Download,
  Printer,
  Sparkles,
  Layers,
  Settings2,
  FileCode,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ListFilter,
  Sliders,
  CheckSquare,
  Square,
  RefreshCw,
  BookMarked,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { ALL_SURAHS_DATABASE } from "@/lib/quranSearchEngine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  ExportOptions,
  SurahExportData,
  fetchBatchSurahsForExport,
  generateHtmlBook,
  generateEpub,
  generateMarkdownBook,
  openPrintPdfWindow,
  downloadBlob,
} from "@/lib/quranExportEngine";

// 30 Juz Surah Mapping for quick juz selection
const JUZ_MAPPING: { juz: number; name: string; startSurah: number; endSurah: number }[] = [
  { juz: 1, name: "পারা ১ (আলিফ লাম মীম)", startSurah: 1, endSurah: 2 },
  { juz: 2, name: "পারা ২ (সায়াকুলু)", startSurah: 2, endSurah: 2 },
  { juz: 3, name: "পারা ৩ (তিলকার রুসুল)", startSurah: 2, endSurah: 3 },
  { juz: 4, name: "পারা ৪ (লান তানালু)", startSurah: 3, endSurah: 4 },
  { juz: 5, name: "পারা ৫ (ওয়াল মুহসানাত)", startSurah: 4, endSurah: 4 },
  { juz: 6, name: "পারা ৬ (লা ইউহিব্বুল্লাহ)", startSurah: 4, endSurah: 5 },
  { juz: 7, name: "পারা ৭ (ওয়া ইজা সামিউ)", startSurah: 5, endSurah: 6 },
  { juz: 8, name: "পারা ৮ (ওয়া লাও আন্নানা)", startSurah: 6, endSurah: 7 },
  { juz: 9, name: "পারা ৯ (ক্বাল আল-মালাউ)", startSurah: 7, endSurah: 8 },
  { juz: 10, name: "পারা ১০ (ওয়া'লামু)", startSurah: 8, endSurah: 9 },
  { juz: 11, name: "পারা ১১ (ইয়া'তাযিরূন)", startSurah: 9, endSurah: 11 },
  { juz: 12, name: "পারা ১২ (ওয়া মা মিন দা-ব্বাহ)", startSurah: 11, endSurah: 12 },
  { juz: 13, name: "পারা ১৩ (ওয়া মা উবাররিউ)", startSurah: 12, endSurah: 14 },
  { juz: 14, name: "পারা ১৪ (রুবা-মা)", startSurah: 15, endSurah: 16 },
  { juz: 15, name: "পারা ১৫ (সুবহানাল্লাজি)", startSurah: 17, endSurah: 18 },
  { juz: 16, name: "পারা ১৬ (ক্বালা আলাম)", startSurah: 18, endSurah: 20 },
  { juz: 17, name: "পারা ১৭ (ইক্বতারা বা)", startSurah: 21, endSurah: 22 },
  { juz: 18, name: "পারা ১৮ (ক্বাদ আফলাহা)", startSurah: 23, endSurah: 25 },
  { juz: 19, name: "পারা ১৯ (ওয়া ক্বালাল্লাজিনা)", startSurah: 25, endSurah: 27 },
  { juz: 20, name: "পারা ২০ (আম্মান খালাক্বা)", startSurah: 27, endSurah: 29 },
  { juz: 21, name: "পারা ২১ (উতলু মা উহিয়া)", startSurah: 29, endSurah: 33 },
  { juz: 22, name: "পারা ২২ (ওয়া মাই ইয়াক্বনুত)", startSurah: 33, endSurah: 36 },
  { juz: 23, name: "পারা ২৩ (ওয়া মা লিয়া)", startSurah: 36, endSurah: 39 },
  { juz: 24, name: "পারা ২৪ (ফামান আজলামু)", startSurah: 39, endSurah: 41 },
  { juz: 25, name: "পারা ২৫ (ইলাইহি ইউরাদ্দু)", startSurah: 41, endSurah: 45 },
  { juz: 26, name: "পারা ২৬ (হা-মীম)", startSurah: 46, endSurah: 51 },
  { juz: 27, name: "পারা ২৭ (ক্বালা ফামা খত্ববুকুম)", startSurah: 51, endSurah: 57 },
  { juz: 28, name: "পারা ২৮ (ক্বাদ সামি'আল্লাহু)", startSurah: 58, endSurah: 66 },
  { juz: 29, name: "পারা ২৯ (তাবারাকাল্লাজি)", startSurah: 67, endSurah: 77 },
  { juz: 30, name: "পারা ৩০ (আম্মা ইয়াতাসা-আলুন)", startSurah: 78, endSurah: 114 },
];

export function QuranExportAdmin() {
  // Scope State
  const [scopeMode, setScopeMode] = useState<"single" | "range" | "juz" | "all">("single");
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(4);
  const [selectedJuz, setSelectedJuz] = useState<number>(30);

  // Book Options State
  const [bookTitle, setBookTitle] = useState("আল-কুরআনুল কারীম — আধুনিক বিজ্ঞানভিত্তিক অনুবাদ ও তাদাব্বুর");
  const [bookSubtitle, setBookSubtitle] = useState("প্রচলিত ও আধুনিক বিজ্ঞানভিত্তিক অনুবাদের পূর্ণাঙ্গ সংকলন");
  const [compilerName, setCompilerName] = useState("কুরআন অন্বেষা রিসার্চ টিম (Quran Explore Pro)");
  const [includeCover, setIncludeCover] = useState(true);
  const [includeToc, setIncludeToc] = useState(true);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  // Content Layer Toggles
  const [showArabic, setShowArabic] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [showConventionalBn, setShowConventionalBn] = useState(true);
  const [showConventionalEn, setShowConventionalEn] = useState(false);
  const [showCoreMeaningBn, setShowCoreMeaningBn] = useState(true);
  const [showCoreMeaningEn, setShowCoreMeaningEn] = useState(false);
  const [showModernBn, setShowModernBn] = useState(true);
  const [showModernEn, setShowModernEn] = useState(false);
  const [showMetaData, setShowMetaData] = useState(true);
  const [showLexicon, setShowLexicon] = useState(true);
  const [showSurahIntro, setShowSurahIntro] = useState(true);
  const [showBismillah, setShowBismillah] = useState(true);

  // Processing & Export State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Calculated target Surah IDs
  const targetSurahIds = useMemo<number[]>(() => {
    if (scopeMode === "single") return [selectedSurah];
    if (scopeMode === "range") {
      const start = Math.max(1, Math.min(rangeStart, rangeEnd));
      const end = Math.min(114, Math.max(rangeStart, rangeEnd));
      const list: number[] = [];
      for (let i = start; i <= end; i++) list.push(i);
      return list;
    }
    if (scopeMode === "juz") {
      const found = JUZ_MAPPING.find((j) => j.juz === selectedJuz);
      if (!found) return [1];
      const list: number[] = [];
      for (let i = found.startSurah; i <= found.endSurah; i++) list.push(i);
      return list;
    }
    // "all"
    return Array.from({ length: 114 }, (_, i) => i + 1);
  }, [scopeMode, selectedSurah, rangeStart, rangeEnd, selectedJuz]);

  const targetSurahsMeta = useMemo(() => {
    return targetSurahIds.map((id) => ALL_SURAHS_DATABASE.find((s) => s.id === id)).filter(Boolean) as SurahMeta[];
  }, [targetSurahIds]);

  const totalVersesInScope = useMemo(() => {
    return targetSurahsMeta.reduce((sum, s) => sum + s.total_verses, 0);
  }, [targetSurahsMeta]);

  const exportOptions: ExportOptions = {
    bookTitle,
    bookSubtitle,
    compilerName,
    includeCover,
    includeToc,
    fontSize,
    showArabic,
    showTransliteration,
    showWordByWord,
    showConventionalBn,
    showConventionalEn,
    showCoreMeaningBn,
    showCoreMeaningEn,
    showModernBn,
    showModernEn,
    showMetaData,
    showLexicon,
    showSurahIntro,
    showBismillah,
  };

  const loadTargetSurahs = async (): Promise<SurahExportData[]> => {
    setIsProcessing(true);
    setProgressPercent(0);
    setProgressText("কুরআনের ডেটা লোড হচ্ছে...");

    try {
      const data = await fetchBatchSurahsForExport(targetSurahIds, (loaded, total, currentName) => {
        const p = Math.round((loaded / total) * 100);
        setProgressPercent(p);
        setProgressText(`${currentName} লোড হচ্ছে (${loaded}/${total})...`);
      });
      return data;
    } catch (err: any) {
      toast.error(err.message || "ডেটা লোড করতে ব্যর্থ হয়েছে");
      throw err;
    } finally {
      setIsProcessing(false);
      setProgressText("");
    }
  };

  // 1. Export as PDF (Open Print Dialog)
  const handleExportPdf = async () => {
    try {
      const surahs = await loadTargetSurahs();
      if (!surahs.length) return;
      toast.success("প্রিন্ট ও PDF উইন্ডো প্রস্তুত করা হয়েছে!");
      openPrintPdfWindow(exportOptions, surahs);
    } catch (e: any) {
      toast.error(e.message || "PDF তৈরিতে সমস্যা হয়েছে");
    }
  };

  // 2. Export as EPUB 3.0 (.epub)
  const handleExportEpub = async () => {
    try {
      const surahs = await loadTargetSurahs();
      if (!surahs.length) return;
      setProgressText("EPUB ই-বুক ফাইল কম্পাইল হচ্ছে...");
      setIsProcessing(true);

      const blob = await generateEpub(exportOptions, surahs);
      const filename =
        scopeMode === "single"
          ? `Quran_Surah_${selectedSurah}_${targetSurahsMeta[0]?.name_en || ""}.epub`
          : `Al-Quran_EBook_${targetSurahIds.length}_Surahs.epub`;

      downloadBlob(blob, filename);
      toast.success("EPUB ই-বুক সফলভাবে ডাউনলোড হয়েছে!");
    } catch (e: any) {
      toast.error(e.message || "EPUB তৈরিতে সমস্যা হয়েছে");
    } finally {
      setIsProcessing(false);
      setProgressText("");
    }
  };

  // 3. Export as Standalone HTML Book (.html)
  const handleExportHtml = async () => {
    try {
      const surahs = await loadTargetSurahs();
      if (!surahs.length) return;

      const html = generateHtmlBook(exportOptions, surahs);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const filename =
        scopeMode === "single"
          ? `Quran_Surah_${selectedSurah}_${targetSurahsMeta[0]?.name_en || ""}.html`
          : `Al-Quran_Offline_Book.html`;

      downloadBlob(blob, filename);
      toast.success("অফলাইন HTML বুক সফলভাবে ডাউনলোড হয়েছে!");
    } catch (e: any) {
      toast.error(e.message || "HTML বুক তৈরিতে সমস্যা হয়েছে");
    }
  };

  // 4. Export as Markdown (.md)
  const handleExportMarkdown = async () => {
    try {
      const surahs = await loadTargetSurahs();
      if (!surahs.length) return;

      const md = generateMarkdownBook(exportOptions, surahs);
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const filename =
        scopeMode === "single"
          ? `Quran_Surah_${selectedSurah}_${targetSurahsMeta[0]?.name_en || ""}.md`
          : `Al-Quran_Markdown_Book.md`;

      downloadBlob(blob, filename);
      toast.success("মার্কডাউন ফাইল সফলভাবে ডাউনলোড হয়েছে!");
    } catch (e: any) {
      toast.error(e.message || "মার্কডাউন তৈরিতে সমস্যা হয়েছে");
    }
  };

  // 5. Generate Live Preview
  const handleGeneratePreview = async () => {
    try {
      const surahs = await loadTargetSurahs();
      if (!surahs.length) return;
      const html = generateHtmlBook(exportOptions, surahs);
      setPreviewHtml(html);
      setPreviewOpen(true);
    } catch (e: any) {
      toast.error(e.message || "প্রিভিউ লোড করতে ব্যর্থ হয়েছে");
    }
  };

  // Quick select presets
  const selectAllLayers = () => {
    setShowArabic(true);
    setShowTransliteration(true);
    setShowWordByWord(true);
    setShowConventionalBn(true);
    setShowConventionalEn(true);
    setShowCoreMeaningBn(true);
    setShowCoreMeaningEn(true);
    setShowModernBn(true);
    setShowModernEn(true);
    setShowMetaData(true);
    setShowLexicon(true);
    setShowSurahIntro(true);
    setShowBismillah(true);
  };

  const selectModernOnly = () => {
    setShowArabic(true);
    setShowTransliteration(false);
    setShowWordByWord(false);
    setShowConventionalBn(true);
    setShowConventionalEn(false);
    setShowCoreMeaningBn(true);
    setShowCoreMeaningEn(false);
    setShowModernBn(true);
    setShowModernEn(false);
    setShowMetaData(true);
    setShowLexicon(true);
    setShowSurahIntro(true);
    setShowBismillah(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-primary/5 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <BookOpen className="size-6 text-primary" />
              <h2 className="text-lg font-bold text-foreground">কুরআন PDF ও E-Book এক্সপোর্টার</h2>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                PRO GENERATOR
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              পুরো কুরআন অথবা সুনির্দিষ্ট সূরা আধুনিক বিজ্ঞানভিত্তিক অনুবাদ, প্রচলিত অনুবাদ, আরবী হরফ, তাদাব্বুর ও লেক্সিকন
              নোটসহ প্রিন্ট-রেডি <strong>PDF</strong>, স্ট্যান্ডার্ড <strong>EPUB 3.0 ই-বুক</strong>, কিংবা অফলাইন <strong>HTML বুক</strong> এ
              রূপান্তর করে শেয়ার করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePreview}
              disabled={isProcessing}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Eye className="size-3.5 text-primary" /> লাইভ প্রিভিউ দেখুন
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar when loading */}
      {isProcessing && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-xs font-semibold text-primary">
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>{progressText}</span>
            </div>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      {/* Main Grid: Scope on Left, Options on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scope & Surah Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Scope Selector Box */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <ListFilter className="size-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">১. কুরআনের পরিধি নির্বাচন</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScopeMode("single")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  scopeMode === "single"
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <BookMarked className="size-4 mb-1" />
                <span>সুনির্দিষ্ট একক সূরা</span>
              </button>

              <button
                type="button"
                onClick={() => setScopeMode("range")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  scopeMode === "range"
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <Sliders className="size-4 mb-1" />
                <span>কাস্টম সূরা পরিসীমা</span>
              </button>

              <button
                type="button"
                onClick={() => setScopeMode("juz")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  scopeMode === "juz"
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <Layers className="size-4 mb-1" />
                <span>পারা / জুয নির্বাচন</span>
              </button>

              <button
                type="button"
                onClick={() => setScopeMode("all")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  scopeMode === "all"
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <Sparkles className="size-4 mb-1" />
                <span>সম্পূর্ণ কুরআন (১-১১৪)</span>
              </button>
            </div>

            {/* Scope Specific Inputs */}
            {scopeMode === "single" && (
              <div className="space-y-2 pt-2 border-t border-border/40">
                <Label htmlFor="single-surah-select" className="text-xs font-medium text-foreground">
                  সূরা নির্বাচন করুন:
                </Label>
                <select
                  id="single-surah-select"
                  value={selectedSurah}
                  onChange={(e) => setSelectedSurah(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-medium shadow-xs"
                >
                  {ALL_SURAHS_DATABASE.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id}. {s.name_bn} ({s.name_arabic}) — {s.meaning_bn} [{s.total_verses} আয়াত]
                    </option>
                  ))}
                </select>
              </div>
            )}

            {scopeMode === "range" && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">শুরুর সূরা:</Label>
                  <select
                    value={rangeStart}
                    onChange={(e) => setRangeStart(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs font-medium shadow-xs"
                  >
                    {ALL_SURAHS_DATABASE.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id}. {s.name_bn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">শেষের সূরা:</Label>
                  <select
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs font-medium shadow-xs"
                  >
                    {ALL_SURAHS_DATABASE.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id}. {s.name_bn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {scopeMode === "juz" && (
              <div className="space-y-2 pt-2 border-t border-border/40">
                <Label className="text-xs font-medium text-foreground">পারা / জুয নির্বাচন করুন:</Label>
                <select
                  value={selectedJuz}
                  onChange={(e) => setSelectedJuz(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-medium shadow-xs"
                >
                  {JUZ_MAPPING.map((j) => (
                    <option key={j.juz} value={j.juz}>
                      {j.name} (সূরা {j.startSurah} থেকে {j.endSurah})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {scopeMode === "all" && (
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-xs text-primary font-medium">
                ✨ সম্পূর্ণ আল-কুরআনের ১১৪টি সূরার ৬,২৩৬টি আয়াত এক্সপোর্ট করা হবে।
              </div>
            )}

            {/* Scope Summary Badge */}
            <div className="rounded-lg bg-muted/30 border border-border/60 p-3 text-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>নির্বাচিত মোট সূরা:</span>
                <span className="font-bold text-foreground">{targetSurahIds.length} টি</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>মোট আয়াত সংখ্যা:</span>
                <span className="font-bold text-primary">{totalVersesInScope} টি</span>
              </div>
            </div>
          </div>

          {/* Book Metadata Settings Box */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Settings2 className="size-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">২. বই ও কভারের তথ্য</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-medium">বইয়ের মূল শিরোনাম:</Label>
                <Input
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="বইয়ের শিরোনাম"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">সাবটাইটেল / বিবরণ:</Label>
                <Input
                  value={bookSubtitle}
                  onChange={(e) => setBookSubtitle(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="সাবটাইটেল"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">সংকলক / অনুবাদক নাম:</Label>
                <Input
                  value={compilerName}
                  onChange={(e) => setCompilerName(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="সংকলকের নাম"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={includeCover}
                    onChange={(e) => setIncludeCover(e.target.checked)}
                    className="rounded accent-primary size-3.5"
                  />
                  <span>কভার পেজ যুক্ত করুন</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={includeToc}
                    onChange={(e) => setIncludeToc(e.target.checked)}
                    className="rounded accent-primary size-3.5"
                  />
                  <span>সূচিপত্র (TOC) তৈরি করুন</span>
                </label>
              </div>

              <div className="pt-2 border-t border-border/40">
                <Label className="text-xs font-medium mb-1.5 block">ফন্ট সাইজ:</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["sm", "base", "lg"] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`py-1.5 rounded border text-xs font-semibold cursor-pointer ${
                        fontSize === sz
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {sz === "sm" ? "ছোট (Small)" : sz === "base" ? "সাধারণ (Medium)" : "বড় (Large)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content Layers & Export Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Content Layer Selector Box */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">৩. অনুবাদের লেয়ার ও কনটেন্ট নির্বাচন</h3>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={selectModernOnly}
                  className="rounded px-2 py-0.5 bg-primary/10 text-primary font-medium hover:bg-primary/20 cursor-pointer"
                >
                  স্ট্যান্ডার্ড প্রিসেট
                </button>
                <button
                  type="button"
                  onClick={selectAllLayers}
                  className="rounded px-2 py-0.5 bg-muted text-muted-foreground font-medium hover:text-foreground cursor-pointer"
                >
                  সব লেয়ার
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors">
                <span className="font-medium text-foreground">📖 আরবী হরফ (Uthmani Script)</span>
                <Switch checked={showArabic} onCheckedChange={setShowArabic} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors">
                <span className="font-medium text-foreground">🔤 উচ্চারণ (Transliteration)</span>
                <Switch checked={showTransliteration} onCheckedChange={setShowTransliteration} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors">
                <span className="font-medium text-foreground">🧩 শব্দে শব্দে অর্থ (Word by Word)</span>
                <Switch checked={showWordByWord} onCheckedChange={setShowWordByWord} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors">
                <span className="font-medium text-foreground">📜 প্রচলিত অনুবাদ (বাংলা)</span>
                <Switch checked={showConventionalBn} onCheckedChange={setShowConventionalBn} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors">
                <span className="font-medium text-foreground">🌐 Conventional (English)</span>
                <Switch checked={showConventionalEn} onCheckedChange={setShowConventionalEn} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer transition-colors">
                <span className="font-medium text-amber-700 dark:text-amber-400">💡 অন্তর্নিহিত অর্থ (বাংলা)</span>
                <Switch checked={showCoreMeaningBn} onCheckedChange={setShowCoreMeaningBn} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer transition-colors">
                <span className="font-medium text-amber-700 dark:text-amber-400">💡 Core Meaning (English)</span>
                <Switch checked={showCoreMeaningEn} onCheckedChange={setShowCoreMeaningEn} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors">
                <span className="font-semibold text-primary">🔬 আধুনিক বিজ্ঞানভিত্তিক অনুবাদ (বাংলা)</span>
                <Switch checked={showModernBn} onCheckedChange={setShowModernBn} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors">
                <span className="font-medium text-primary">🔬 Modern Scientific (English)</span>
                <Switch checked={showModernEn} onCheckedChange={setShowModernEn} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer transition-colors">
                <span className="font-medium text-emerald-700 dark:text-emerald-400">🏷️ মেটাডাটা ও মূল বিষয়বস্তু ট্যাগ</span>
                <Switch checked={showMetaData} onCheckedChange={setShowMetaData} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer transition-colors">
                <span className="font-medium text-emerald-700 dark:text-emerald-400">🔍 লেক্সিকন ও বিজ্ঞানভিত্তিক নোট</span>
                <Switch checked={showLexicon} onCheckedChange={setShowLexicon} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors">
                <span className="font-medium text-foreground">📘 সূরার পরিচিতি ও বৈজ্ঞানিক অর্থ</span>
                <Switch checked={showSurahIntro} onCheckedChange={setShowSurahIntro} />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors sm:col-span-2">
                <span className="font-medium text-foreground">✨ সূরার শুরুতে বিসমিল্লাহ প্রদর্শন</span>
                <Switch checked={showBismillah} onCheckedChange={setShowBismillah} />
              </label>
            </div>
          </div>

          {/* Export Action Buttons Box */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Download className="size-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">৪. এক্সপোর্ট ফরম্যাট ও ডাউনলোড</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* PDF Export Button */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col justify-between space-y-3 hover:border-primary transition-all">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                    <Printer className="size-4" />
                    <span>প্রিন্ট-রেডি PDF ডকুমেন্ট</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    সুন্দর বুক স্টাইল মার্জিন, কভার পেজ ও অটো-হেডারসহ ভেক্টর প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন।
                  </p>
                </div>
                <Button
                  onClick={handleExportPdf}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs cursor-pointer"
                >
                  <Printer className="size-3.5 mr-1.5" /> PDF / প্রিন্ট তৈরি করুন
                </Button>
              </div>

              {/* EPUB Export Button */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500 transition-all">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                    <BookOpen className="size-4" />
                    <span>স্ট্যান্ডার্ড EPUB 3.0 ই-বুক</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Apple Books, Google Play Books, Kindle এবং যেকোনো ই-বুক রিডারের জন্য তৈরি <code>.epub</code> ফাইল।
                  </p>
                </div>
                <Button
                  onClick={handleExportEpub}
                  disabled={isProcessing}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs cursor-pointer"
                >
                  <Download className="size-3.5 mr-1.5" /> EPUB (.epub) ডাউনলোড
                </Button>
              </div>

              {/* Offline HTML Book Export Button */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col justify-between space-y-3 hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    <FileCode className="size-4" />
                    <span>অফলাইন HTML বুক</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    সার্চ বার ও ডার্ক/লাইট মোডসহ সিঙ্গেল <code>.html</code> ফাইল যা ইন্টারনেট ছাড়াই যেকোনো ডিভাইসে চলবে।
                  </p>
                </div>
                <Button
                  onClick={handleExportHtml}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                >
                  <Download className="size-3.5 mr-1.5" /> HTML (.html) ডাউনলোড
                </Button>
              </div>

              {/* Markdown Export Button */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4 flex flex-col justify-between space-y-3 hover:border-foreground/30 transition-all">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
                    <FileText className="size-4" />
                    <span>রিসার্চ মার্কডাউন (Markdown)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    গবেষণা ও টেক্সট এডিটরে ব্যবহারের জন্য ফরম্যাটেড <code>.md</code> মার্কডাউন ফাইল।
                  </p>
                </div>
                <Button
                  onClick={handleExportMarkdown}
                  disabled={isProcessing}
                  variant="outline"
                  className="w-full text-xs cursor-pointer"
                >
                  <FileDown className="size-3.5 mr-1.5" /> Markdown (.md) ডাউনলোড
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewOpen && previewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-5xl rounded-2xl border border-border bg-card shadow-2xl flex flex-col h-[90vh]">
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/30">
              <div className="flex items-center gap-2">
                <Eye className="size-5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">লাইভ বুক প্রিভিউ</h3>
                <span className="text-xs text-muted-foreground">({targetSurahIds.length} টি সূরা)</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleExportPdf}
                  className="bg-primary text-primary-foreground text-xs cursor-pointer"
                >
                  <Printer className="size-3.5 mr-1" /> PDF প্রিন্ট
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewOpen(false)}
                  className="text-xs cursor-pointer"
                >
                  বন্ধ করুন
                </Button>
              </div>
            </div>
            <div className="flex-1 p-2 overflow-hidden">
              <iframe
                title="Book Preview"
                srcDoc={previewHtml}
                className="w-full h-full rounded-xl border border-border bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
