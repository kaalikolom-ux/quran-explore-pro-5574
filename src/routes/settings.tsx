import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useCallback } from "react";
import { 
  Sliders, 
  Download, 
  Check, 
  Type, 
  HardDrive, 
  RefreshCw,
  Layers,
  Database,
  Eye,
  Sun,
  Moon,
  Sparkles,
  Globe,
  ShieldCheck,
  Lock,
  Music,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

import { usePrefs, type Prefs, type ThemeMode } from "@/lib/prefs";
import { useIsAdmin } from "@/lib/auth";
import { 
  saveSurahOffline, 
  downloadSurahAudio, 
  getOfflineStorageStats, 
  clearAllOfflineAudio, 
  clearAllOfflineSurahs 
} from "@/lib/offline";
import { SURAH_META_MAP } from "./surah.$id";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { isAdmin } = useIsAdmin();
  const { prefs, publicPermissions, userPermissions, updatePref, updatePublicPermission, isLayerAllowed, lang, themeMode, setThemeMode } = usePrefs();

  const [downloadingSurahs, setDownloadingSurahs] = useState(false);
  const [downloadingAyahs, setDownloadingAyahs] = useState(false);
  const [surahProgress, setSurahProgress] = useState<number | null>(null);
  const [ayahProgress, setAyahProgress] = useState<number | null>(null);

  // Audio download & storage inspection state
  const [storageStats, setStorageStats] = useState<{ audioCount: number; audioSizeBytes: number; surahCount: number } | null>(null);
  const [selectedAudioSurahId, setSelectedAudioSurahId] = useState(1);
  const [downloadingAudioSurah, setDownloadingAudioSurah] = useState(false);
  const [audioSurahProgress, setAudioSurahProgress] = useState<number | null>(null);

  const refreshStorageStats = useCallback(async () => {
    try {
      const stats = await getOfflineStorageStats();
      setStorageStats(stats);
    } catch {}
  }, []);

  useEffect(() => {
    refreshStorageStats();
  }, [refreshStorageStats]);

  const handleDownloadAllSurahs = async () => {
    setDownloadingSurahs(true);
    setSurahProgress(0);
    try {
      for (let i = 1; i <= 114; i++) {
        const url = `/data/quran/surahs/${i}.json`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          await saveSurahOffline(i, data);
        }
        setSurahProgress(Math.round((i / 114) * 100));
      }
      toast.success(lang === "bn" ? "১১৪টি সুরার টেক্সট ডাটা অফলাইনে সংরক্ষিত হয়েছে!" : "All 114 surahs cached offline successfully!");
      await refreshStorageStats();
    } catch (e) {
      console.error(e);
      toast.error(lang === "bn" ? "ডাউনলোডে সমস্যা হয়েছে, ইন্টারনেট চেক করুন" : "Download failed, check connection");
    } finally {
      setDownloadingSurahs(false);
      setTimeout(() => setSurahProgress(null), 3000);
    }
  };

  const handleDownloadAllAyahs = async () => {
    setDownloadingAyahs(true);
    setAyahProgress(0);
    try {
      for (let i = 1; i <= 114; i++) {
        const url = `/data/quran/surahs/${i}.json`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          await saveSurahOffline(i, data);
        }
        setAyahProgress(Math.round((i / 114) * 100));
      }
      toast.success(lang === "bn" ? "৬২৩৬টি আয়াত ও শব্দকোষ অফলাইনে সংরক্ষিত!" : "All 6236 ayahs & roots saved offline!");
      await refreshStorageStats();
    } catch (e) {
      console.error(e);
      toast.error(lang === "bn" ? "সংরক্ষণে ত্রুটি হয়েছে" : "Failed to save offline");
    } finally {
      setDownloadingAyahs(false);
      setTimeout(() => setAyahProgress(null), 3000);
    }
  };

  const handleDownloadSelectedSurahAudio = async () => {
    const meta = SURAH_META_MAP[selectedAudioSurahId];
    if (!meta) return;
    setDownloadingAudioSurah(true);
    setAudioSurahProgress(0);
    try {
      const sStr = String(selectedAudioSurahId).padStart(3, "0");
      const urls: string[] = [];
      for (let a = 1; a <= meta.total; a++) {
        const aStr = String(a).padStart(3, "0");
        urls.push(`https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`);
      }
      await downloadSurahAudio(urls, (done, total) => {
        setAudioSurahProgress(Math.round((done / total) * 100));
      });
      toast.success(lang === "bn" ? `সুরা ${meta.name_bn}-এর সম্পূর্ণ ${meta.total}টি অডিও অফলাইনে সংরক্ষিত হয়েছে!` : `Surah ${meta.name_bn} audio downloaded offline!`);
      await refreshStorageStats();
    } catch (e) {
      console.error(e);
      toast.error(lang === "bn" ? "অডিও ডাউনলোডে সমস্যা হয়েছে, ইন্টারনেট চেক করুন" : "Audio download failed");
    } finally {
      setDownloadingAudioSurah(false);
      setTimeout(() => setAudioSurahProgress(null), 3000);
    }
  };

  const handleClearAudioStorage = async () => {
    if (confirm(lang === "bn" ? "আপনি কি ফোনের সব অফলাইন অডিও ফাইল মুছে ফেলতে চান?" : "Delete all offline audio?")) {
      await clearAllOfflineAudio();
      await refreshStorageStats();
      toast.success(lang === "bn" ? "সব অফলাইন অডিও মুছে ফেলা হয়েছে" : "All offline audio cleared");
    }
  };

  const handleClearAllStorage = async () => {
    if (confirm(lang === "bn" ? "আপনি কি সম্পূর্ণ অফলাইন ডাটাবেজ (সুরা টেক্সট ও অডিও) রিসেট করতে চান?" : "Reset all offline data?")) {
      await clearAllOfflineAudio();
      await clearAllOfflineSurahs();
      await refreshStorageStats();
      toast.success(lang === "bn" ? "সম্পূর্ণ অফলাইন ডাটা রিসেট হয়েছে" : "All offline data reset");
    }
  };

  const displayLayers: { key: keyof Prefs; title: string; desc: string }[] = [
    {
      key: "showArabic",
      title: lang === "bn" ? "আরবি টেক্সট" : "Arabic Text",
      desc: lang === "bn" ? "মূল কুরআন পাঠ প্রদর্শন" : "Display original Quranic text",
    },
    {
      key: "showWordByWord",
      title: lang === "bn" ? "শব্দে শব্দে অর্থ" : "Word by Word Meaning",
      desc: lang === "bn" ? "প্রতিটি শব্দের নিচে স্বতন্ত্র অর্থ ও উচ্চারণ" : "Meaning & transliteration under each word",
    },
    {
      key: "showTransliteration",
      title: lang === "bn" ? "উচ্চারণ (Transliteration)" : "Ayah Transliteration",
      desc: lang === "bn" ? "সহজে পড়ার জন্য আয়াতের উচ্চারণ নির্দেশিকা" : "Full ayah phonetic reading guide",
    },
    {
      key: "showConventionalBn",
      title: lang === "bn" ? "১. প্রচলিত অনুবাদ" : "1. Conventional Translation (BN)",
      desc: lang === "bn" ? "মুহিউদ্দীন খান / তাইসিরুল কুরআন (Greentech)" : "Standard Bengali translation",
    },
    {
      key: "showConventionalEn",
      title: lang === "bn" ? "২. Conventional Translation" : "2. Conventional Translation (EN)",
      desc: lang === "bn" ? "সহীহ ইন্টারন্যাশনাল স্ট্যান্ডার্ড অনুবাদ (Greentech)" : "Sahih International translation",
    },
    {
      key: "showModernBn",
      title: lang === "bn" ? "৩. আধুনিক অনুবাদ" : "3. Modern Translation (BN)",
      desc: lang === "bn" ? "আমাদের প্রাঞ্জল ও সহজবোধ্য আধুনিক বাংলা অনুবাদ" : "Contemporary contextual Bengali translation",
    },
    {
      key: "showModernEn",
      title: lang === "bn" ? "৪. Modern Translation" : "4. Modern Translation (EN)",
      desc: lang === "bn" ? "আমাদের সমসাময়িক আধুনিক ইংরেজি অনুবাদ" : "Contemporary contextual English translation",
    },
    {
      key: "showLexicon",
      title: lang === "bn" ? "অভিধান / Lexicon" : "Lexicon / Vocabulary",
      desc: lang === "bn" ? "শব্দকোষ, মূল ধাতু (Root) ও ব্যাকরণগত বিশ্লেষণ" : "Vocabulary, Arabic roots and grammatical notes",
    },
    {
      key: "showLexiconScientific",
      title: lang === "bn" ? "বিজ্ঞানভিত্তিক অর্থ ও গবেষণা" : "Scientific Meanings & Context",
      desc: lang === "bn" ? "অভিধানে মূল ধাতুর আধুনিক বিজ্ঞানভিত্তিক ব্যাখ্যা ও প্রেক্ষাপট প্রদর্শন" : "Show scientific insights and contextual research in lexicon",
    },
    {
      key: "showMetaData",
      title: lang === "bn" ? "মেটা ডাটা / Meta Data" : "Ayah Meta Data",
      desc: lang === "bn" ? "প্রতিটি আয়াতের নম্বরের পাশে বিষয়ভিত্তিক মেটা ডাটা ও টপিক ট্যাগ প্রদর্শন" : "Display contextual topic and metadata next to ayah numbers",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sliders className="size-6 text-primary" />
            {lang === "bn" ? "সেটিংস ও পছন্দসমূহ" : "Settings & Preferences"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "bn"
              ? "অফলাইন ডাটা, ফন্ট সাইজ এবং ডিসপ্লে লেয়ার কাস্টমাইজ করুন"
              : "Manage offline data, font scaling and customize display layers"}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <Check className="size-3" />
          {lang === "bn" ? "স্বয়ংক্রিয় সংরক্ষিত" : "Auto saved"}
        </span>
      </div>

      {/* ১. চক্ষু-বান্ধব থিম ও আলোর তীব্রতা (Eye-Comfort & Theme Selection) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Eye className="size-4 text-primary" />
            <span>{lang === "bn" ? "চক্ষু-বান্ধব থিম ও ব্যাকগ্রাউন্ড কালার" : "Eye-Comfort Themes & Color Tone"}</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
            {lang === "bn" ? "পড়ার স্বাচ্ছন্দ্যের জন্য নিজের মতো সাজিয়ে নিন" : "Personalize for relaxed reading"}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* Option 1: Mushaf Sepia (Warm Paper) */}
          <button
            type="button"
            onClick={() => setThemeMode("sepia")}
            className={`group relative flex flex-col justify-between rounded-xl border-2 p-3 sm:p-3.5 text-left transition-all cursor-pointer bg-[#fbf7ee] ${
              themeMode === "sepia"
                ? "border-[#1f6f43] ring-2 ring-[#1f6f43]/40 shadow-md scale-[1.01]"
                : "border-[#e2d3bb] hover:border-[#1f6f43]/60 shadow-xs"
            }`}
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#2c231b]">
                  <span className="size-3 sm:size-3.5 rounded-full bg-[#f4ecdc] border border-[#e2d3bb] inline-block shadow-xs shrink-0" />
                  {lang === "bn" ? "মুসহাফ সেপিয়া" : "Mushaf Sepia"}
                </span>
                <span className="self-start sm:self-auto rounded-full bg-[#ede2cf] px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-[#1f6f43] border border-[#e2d3bb]">
                  {lang === "bn" ? "চোখের প্রশান্তি" : "Eye Comfort"}
                </span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-[#796c5c] leading-relaxed">
                {lang === "bn"
                  ? "মুদ্রিত কুরআনের মতো উষ্ণ ক্রিম পেপার টোন। চোখে আলো লাগে না।"
                  : "Warm parchment cream tone with zero harsh glare."}
              </p>
            </div>
            <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-[#e2d3bb] pt-1.5 sm:pt-2 text-[10px] sm:text-[11px]">
              <span className="font-mono text-[#1f6f43] font-bold">
                {themeMode === "sepia" ? "✓ " + (lang === "bn" ? "সক্রিয়" : "Active") : (lang === "bn" ? "নির্বাচন করুন" : "Select")}
              </span>
            </div>
          </button>

          {/* Option 2: Soft Slate / Mist (Blue Filter) */}
          <button
            type="button"
            onClick={() => setThemeMode("slate")}
            className={`group relative flex flex-col justify-between rounded-xl border-2 p-3 sm:p-3.5 text-left transition-all cursor-pointer bg-[#f1f5f9] ${
              themeMode === "slate"
                ? "border-[#2563eb] ring-2 ring-[#2563eb]/40 shadow-md scale-[1.01]"
                : "border-[#cbd5e1] hover:border-[#2563eb]/60 shadow-xs"
            }`}
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#1e293b]">
                  <span className="size-3 sm:size-3.5 rounded-full bg-[#e2e8f0] border border-[#cbd5e1] inline-block shadow-xs shrink-0" />
                  {lang === "bn" ? "নরম স্লেট" : "Soft Slate"}
                </span>
                <span className="self-start sm:self-auto rounded-full bg-[#dbeafe] px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-[#1e40af] border border-[#bfdbfe]">
                  {lang === "bn" ? "ব্লু-ফিল্টার" : "Blue Filter"}
                </span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-[#64748b] leading-relaxed">
                {lang === "bn"
                  ? "নরম কুল পেপার টোন। অতিরিক্ত নীল আলোর ক্লান্তি দূর করে।"
                  : "Cool pastel slate background, reducing fatigue."}
              </p>
            </div>
            <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-[#cbd5e1] pt-1.5 sm:pt-2 text-[10px] sm:text-[11px]">
              <span className="font-mono text-[#2563eb] font-bold">
                {themeMode === "slate" ? "✓ " + (lang === "bn" ? "সক্রিয়" : "Active") : (lang === "bn" ? "নির্বাচন করুন" : "Select")}
              </span>
            </div>
          </button>

          {/* Option 3: Midnight Dark */}
          <button
            type="button"
            onClick={() => setThemeMode("dark")}
            className={`group relative flex flex-col justify-between rounded-xl border-2 p-3 sm:p-3.5 text-left transition-all cursor-pointer bg-[#141414] ${
              themeMode === "dark"
                ? "border-[#4a90e2] ring-2 ring-[#4a90e2]/40 shadow-md scale-[1.01]"
                : "border-white/15 hover:border-[#4a90e2]/60 shadow-xs"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#f4f4f5]">
                  <span className="size-3 sm:size-3.5 rounded-full bg-[#1c1c1f] border border-white/25 inline-block shadow-xs shrink-0" />
                  {lang === "bn" ? "মিডনাইট ডার্ক" : "Midnight Dark"}
                </span>
                <Moon className="size-3.5 text-[#4a90e2]" />
              </div>
              <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-[#a1a1aa] leading-relaxed">
                {lang === "bn"
                  ? "গভীর ডার্ক ব্যাকগ্রাউন্ড। রাতে পড়ার জন্য ও ওলেড ডিসপ্লেতে চমৎকার।"
                  : "Deep dark background, optimal for night reading."}
              </p>
            </div>
            <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-white/15 pt-1.5 sm:pt-2 text-[10px] sm:text-[11px]">
              <span className="font-mono text-[#4a90e2] font-bold">
                {themeMode === "dark" ? "✓ " + (lang === "bn" ? "সক্রিয়" : "Active") : (lang === "bn" ? "নির্বাচন করুন" : "Select")}
              </span>
            </div>
          </button>

          {/* Option 4: Pure Light */}
          <button
            type="button"
            onClick={() => setThemeMode("light")}
            className={`group relative flex flex-col justify-between rounded-xl border-2 p-3 sm:p-3.5 text-left transition-all cursor-pointer bg-[#ffffff] ${
              themeMode === "light"
                ? "border-[#2a6f97] ring-2 ring-[#2a6f97]/40 shadow-md scale-[1.01]"
                : "border-[#dee2e6] hover:border-[#2a6f97]/60 shadow-xs"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#18181b]">
                  <span className="size-3 sm:size-3.5 rounded-full bg-[#f8f9fa] border border-[#dee2e6] inline-block shadow-xs shrink-0" />
                  {lang === "bn" ? "স্বাভাবিক লাইট" : "Classic Light"}
                </span>
                <Sun className="size-3.5 text-[#f59e0b]" />
              </div>
              <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-[#52525b] leading-relaxed">
                {lang === "bn"
                  ? "দিনের আলো ও সর্বোচ্চ স্পষ্টতার জন্য স্বাভাবিক সাদা মোড।"
                  : "Crisp white background for daylight environments."}
              </p>
            </div>
            <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-[#dee2e6] pt-1.5 sm:pt-2 text-[10px] sm:text-[11px]">
              <span className="font-mono text-[#2a6f97] font-bold">
                {themeMode === "light" ? "✓ " + (lang === "bn" ? "সক্রিয়" : "Active") : (lang === "bn" ? "নির্বাচন করুন" : "Select")}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ২. ফন্ট সাইজ সেটিংস */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Type className="size-4 text-primary" />
          <span>{lang === "bn" ? "ফন্ট সাইজ সেটিংস" : "Font Size Settings"}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                {lang === "bn" ? "আরবি ফন্ট সাইজ" : "Arabic Font Size"}
              </Label>
              <span className="font-mono text-xs text-primary font-bold">{prefs.arabicFontSize}px</span>
            </div>
            <Slider
              value={[prefs.arabicFontSize]}
              min={20}
              max={52}
              step={1}
              onValueChange={(val) => updatePref("arabicFontSize", val[0])}
              className="py-1 cursor-pointer"
            />
            <div className="text-center pt-2 border-t border-border/40">
              <p className="arabic text-foreground font-normal leading-relaxed" style={{ fontSize: `${prefs.arabicFontSize}px` }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                {lang === "bn" ? "অনুবাদ ফন্ট সাইজ" : "Translation Font Size"}
              </Label>
              <span className="font-mono text-xs text-primary font-bold">{prefs.translationFontSize}px</span>
            </div>
            <Slider
              value={[prefs.translationFontSize]}
              min={12}
              max={28}
              step={1}
              onValueChange={(val) => updatePref("translationFontSize", val[0])}
              className="py-1 cursor-pointer"
            />
            <div className="text-center pt-3 border-t border-border/40">
              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: `${prefs.translationFontSize}px` }}>
                পরম করুণাময় অতি দয়ালু আল্লাহর নামে
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* অফলাইন ডাউনলোড */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Database className="size-4 text-primary" />
          <span>{lang === "bn" ? "অফলাইন ডাউনলোড ম্যানেজমেন্ট" : "Offline Data Management"}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {lang === "bn" ? "১. সুরা ডাউনলোড (১১৪টি)" : "1. Download Surahs (114)"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "bn" ? "সম্পূর্ণ ১১৪টি সূরার লোকাল ডাটা ক্যাশ করুন" : "Cache all 114 surahs for full offline access"}
                </p>
              </div>
              <HardDrive className="size-5 text-muted-foreground" />
            </div>

            {surahProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>ডাউনলোড হচ্ছে...</span>
                  <span>{surahProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${surahProgress}%` }} />
                </div>
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              disabled={downloadingSurahs}
              onClick={handleDownloadAllSurahs}
              className="w-full text-xs h-8 cursor-pointer"
            >
              {downloadingSurahs ? (
                <>
                  <RefreshCw className="size-3.5 mr-1.5 animate-spin" />
                  ডাউনলোড হচ্ছে ({surahProgress}%)
                </>
              ) : (
                <>
                  <Download className="size-3.5 mr-1.5" />
                  ১১৪টি সুরা ডাউনলোড করুন
                </>
              )}
            </Button>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {lang === "bn" ? "২. আয়াত ডাউনলোড (৬২৩৬টি)" : "2. Download Ayahs (6236)"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "bn" ? "শব্দে শব্দে অর্থ ও রুটসহ অফলাইন ডাটা সেভ করুন" : "Save all ayahs with words and roots"}
                </p>
              </div>
              <Download className="size-5 text-muted-foreground" />
            </div>

            {ayahProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>সংরক্ষণ হচ্ছে...</span>
                  <span>{ayahProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${ayahProgress}%` }} />
                </div>
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              disabled={downloadingAyahs}
              onClick={handleDownloadAllAyahs}
              className="w-full text-xs h-8 cursor-pointer"
            >
              {downloadingAyahs ? (
                <>
                  <RefreshCw className="size-3.5 mr-1.5 animate-spin" />
                  সংরক্ষণ হচ্ছে ({ayahProgress}%)
                </>
              ) : (
                <>
                  <Download className="size-3.5 mr-1.5" />
                  ৬২৩৬টি আয়াত অফলাইন সেভ করুন
                </>
              )}
            </Button>
          </div>

          {/* ৩. সুরার অডিও ডাউনলোড */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {lang === "bn" ? "৩. সুরার অডিও ডাউনলোড (MP3)" : "3. Download Surah Audio"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "bn" ? "অফলাইনে শোনার জন্য যেকোনো সুরার অডিও নামিয়ে রাখুন" : "Download surah MP3s for offline player"}
                </p>
              </div>
              <Music className="size-5 text-primary" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedAudioSurahId}
                onChange={(e) => setSelectedAudioSurahId(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground outline-none cursor-pointer"
              >
                {Object.entries(SURAH_META_MAP).map(([idStr, meta]) => (
                  <option key={idStr} value={idStr}>
                    {idStr}. {meta.name_bn} ({meta.total} আয়াত)
                  </option>
                ))}
              </select>
            </div>

            {audioSurahProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>অডিও ডাউনলোড হচ্ছে...</span>
                  <span>{audioSurahProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${audioSurahProgress}%` }} />
                </div>
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              disabled={downloadingAudioSurah}
              onClick={handleDownloadSelectedSurahAudio}
              className="w-full text-xs h-8 cursor-pointer border-primary/40 hover:bg-primary/10 text-primary"
            >
              {downloadingAudioSurah ? (
                <>
                  <RefreshCw className="size-3.5 mr-1.5 animate-spin" />
                  ডাউনলোড হচ্ছে ({audioSurahProgress}%)
                </>
              ) : (
                <>
                  <Download className="size-3.5 mr-1.5" />
                  সুরা {SURAH_META_MAP[selectedAudioSurahId]?.name_bn}-এর অডিও ডাউনলোড
                </>
              )}
            </Button>
          </div>

          {/* ৪. লোকাল স্টোরেজ স্ট্যাটাস ও মেমরি */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {lang === "bn" ? "৪. অফলাইন স্টোরেজ স্ট্যাটাস" : "4. Offline Storage Status"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "bn" ? "আপনার ডিভাইসে সংরক্ষিত অফলাইন ফাইলের পরিমাণ" : "Data stored on your device"}
                </p>
              </div>
              <Database className="size-5 text-emerald-500" />
            </div>

            <div className="bg-muted/40 rounded-lg p-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">সংরক্ষিত সুরা টেক্সট:</span>
                <span className="font-semibold text-foreground font-mono">
                  {storageStats?.surahCount ?? 0} / ১১৪ টি
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">সংরক্ষিত অডিও ফাইল:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {storageStats?.audioCount ?? 0} টি ({(((storageStats?.audioSizeBytes ?? 0) / (1024 * 1024))).toFixed(1)} MB)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearAudioStorage}
                className="flex-1 text-[11px] h-7.5 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 cursor-pointer"
              >
                <Trash2 className="size-3 mr-1" />
                অডিও মুছুন
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearAllStorage}
                className="flex-1 text-[11px] h-7.5 text-destructive border-destructive/30 hover:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="size-3 mr-1" />
                সব রিসেট
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ডিসপ্লে লেয়ার সেটিংস */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Layers className="size-4 text-primary" />
            <span>{lang === "bn" ? "প্রদর্শন সেটিংস (Display Layers)" : "Display Layers"}</span>
          </div>

          {isAdmin && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
              <ShieldCheck className="size-3.5" />
              {lang === "bn" ? "এডমিন মোড: ভিজিটর অনুমোদন সক্রিয়" : "Admin Mode: Visitor Access Control"}
            </span>
          )}
        </div>

        {isAdmin && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
            <Globe className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-foreground">
                {lang === "bn" ? "এডমিন মাস্টার কন্ট্রোল:" : "Admin Master Control:"}
              </span>{" "}
              {lang === "bn"
                ? "আপনি যেভাবে অনুমোদন দেবেন, সাধারণ ভিজিটররা ঠিক ততটুকুই দেখতে পাবে। কোনো অনুবাদ বা মেটা ডাটা অপশন প্রস্তুতাধীন থাকলে তার নিচের ভিজিটর সুইচটি বন্ধ করে রাখুন—এতে কোনো ভিজিটর তা দেখতে পাবে না, কিন্তু এডমিন হিসেবে আপনি সবসময় দেখতে ও এডিট করতে পারবেন।"
                : "You control exactly what public visitors see. Turn off public access for work-in-progress layers so visitors won't see them, while you as admin can always view and edit."}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayLayers.map((layer) => {
            const isChecked = prefs[layer.key] === true;
            const isPublicAllowed = publicPermissions[layer.key] ?? true;
            const isAllowedForMe = isLayerAllowed(layer.key, isAdmin);
            const isRestrictedForVisitor = !isAdmin && !isAllowedForMe;

            return (
              <div
                key={layer.key}
                className={`flex flex-col justify-between rounded-xl border p-4 shadow-xs transition-all ${
                  isRestrictedForVisitor
                    ? "border-border/40 bg-muted/20 opacity-70"
                    : "border-border/70 bg-card hover:border-border"
                }`}
              >
                {/* শীর্ষ অংশ: লেয়ারের নাম ও ইউজারের নিজস্ব ডিসপ্লে টগল */}
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer"
                  onClick={() => {
                    if (!isRestrictedForVisitor) {
                      updatePref(layer.key, !isChecked);
                    }
                  }}
                >
                  <div className="space-y-1 select-none flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Label htmlFor={layer.key} className="text-sm font-semibold text-foreground cursor-pointer">
                        {layer.title}
                      </Label>
                      {isRestrictedForVisitor && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <Lock className="size-2.5" />
                          {lang === "bn" ? "প্রস্তুতাধীন" : "Work in Progress"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {layer.desc}
                    </p>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <Switch
                      id={layer.key}
                      disabled={isRestrictedForVisitor}
                      checked={isChecked}
                      onCheckedChange={(val) => updatePref(layer.key, val)}
                    />
                  </div>
                </div>

                {/* এডমিন মাস্টার অংশ: ভিজিটরদের জন্য গ্লোবাল অনুমতি টগল সুইচ */}
                {isAdmin && (
                  <div 
                    className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Globe className={`size-3.5 shrink-0 ${isPublicAllowed ? "text-emerald-500" : "text-amber-500"}`} />
                      <span className="text-xs font-semibold text-foreground/90 truncate">
                        {lang === "bn" ? "ভিজিটর অনুমোদন:" : "Visitor Access:"}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isPublicAllowed 
                          ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" 
                          : "text-amber-600 bg-amber-500/10 dark:text-amber-400"
                      }`}>
                        {isPublicAllowed 
                          ? (lang === "bn" ? "উন্মুক্ত" : "Allowed") 
                          : (lang === "bn" ? "লুকানো (Hidden)" : "Restricted")}
                      </span>
                    </div>

                    <Switch
                      id={`admin-perm-${layer.key}`}
                      checked={isPublicAllowed}
                      onCheckedChange={async (val) => {
                        await updatePublicPermission(layer.key, val);
                        toast.success(
                          lang === "bn" 
                            ? `"${layer.title}" সাধারণ ভিজিটরদের জন্য ${val ? "উন্মুক্ত" : "লুকানো/স্থগিত"} করা হয়েছে`
                            : `"${layer.title}" is now ${val ? "visible" : "hidden"} for public visitors`
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}