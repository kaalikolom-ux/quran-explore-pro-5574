import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  Sliders,
  Download,
  Check,
  Type,
  HardDrive,
  RefreshCw,
  Layers,
  Database,
} from "lucide-react";
import { toast } from "sonner";

import { usePrefs, type Prefs } from "@/lib/prefs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const SURAH_TEXT_CACHE = "quran-text-v1";

function SettingsPage() {
  const { prefs, updatePref, lang } = usePrefs();

  const [downloadingSurahs, setDownloadingSurahs] = useState(false);
  const [downloadingAyahs, setDownloadingAyahs] = useState(false);
  const [surahProgress, setSurahProgress] = useState<number | null>(null);
  const [ayahProgress, setAyahProgress] = useState<number | null>(null);

  const handleDownloadAllSurahs = async () => {
    if (typeof window === "undefined" || !("caches" in window)) {
      toast.error(
        lang === "bn"
          ? "আপনার ব্রাউজারে অফলাইন স্টোরেজ সাপোর্ট নেই"
          : "Offline storage not supported in your browser",
      );
      return;
    }

    setDownloadingSurahs(true);
    setSurahProgress(0);
    try {
      const cache = await caches.open(SURAH_TEXT_CACHE);
      for (let i = 1; i <= 114; i++) {
        const url = `/data/quran/surahs/${i}.json`;
        const existing = await cache.match(url);
        if (!existing) {
          const res = await fetch(url);
          if (res.ok) {
            await cache.put(url, res.clone());
          }
        }
        setSurahProgress(Math.round((i / 114) * 100));
      }
      toast.success(
        lang === "bn"
          ? "১১৪টি সুরার ডাটা অফলাইনে সম্পূর্ণ সংরক্ষিত হয়েছে!"
          : "All 114 surahs cached offline successfully!",
      );
    } catch (e) {
      console.error(e);
      toast.error(
        lang === "bn"
          ? "ডাউনলোডে সমস্যা হয়েছে, ইন্টারনেট চেক করুন"
          : "Download failed, check connection",
      );
    } finally {
      setDownloadingSurahs(false);
      setTimeout(() => setSurahProgress(null), 3000);
    }
  };

  const handleDownloadAllAyahs = async () => {
    if (typeof window === "undefined" || !("caches" in window)) {
      toast.error(
        lang === "bn"
          ? "আপনার ব্রাউজারে অফলাইন স্টোরেজ সাপোর্ট নেই"
          : "Offline storage not supported in your browser",
      );
      return;
    }

    setDownloadingAyahs(true);
    setAyahProgress(0);
    try {
      const cache = await caches.open(SURAH_TEXT_CACHE);
      for (let i = 1; i <= 114; i++) {
        const url = `/data/quran/surahs/${i}.json`;
        const res = await fetch(url);
        if (res.ok) {
          await cache.put(url, res.clone());
        }
        setAyahProgress(Math.round((i / 114) * 100));
      }
      toast.success(
        lang === "bn"
          ? "৬২৩৬টি আয়াত ও শব্দকোষ অফলাইনে সম্পূর্ণ সংরক্ষিত!"
          : "All 6236 ayahs & roots saved offline!",
      );
    } catch (e) {
      console.error(e);
      toast.error(lang === "bn" ? "সংরক্ষণে ত্রুটি হয়েছে" : "Failed to save offline");
    } finally {
      setDownloadingAyahs(false);
      setTimeout(() => setAyahProgress(null), 3000);
    }
  };

  const displayLayers: { key: keyof Prefs; title: string; desc: string }[] = [
    {
      key: "showArabic",
      title: "আরবি টেক্সট",
      desc: "মূল কুরআন পাঠ প্রদর্শন",
    },
    {
      key: "showWordByWord",
      title: "শব্দে শব্দে অর্থ",
      desc: "প্রতিটি শব্দের নিচে স্বতন্ত্র অর্থ ও উচ্চারণ",
    },
    {
      key: "showTransliteration",
      title: "বাংলা উচ্চারণ (Transliteration)",
      desc: "সহজে পড়ার জন্য আয়াতের উচ্চারণ নির্দেশিকা",
    },
    {
      key: "showConventionalBn",
      title: "১. প্রচলিত বাংলা অনুবাদ",
      desc: "মুহিউদ্দীন খান / তাইসিরুল কুরআন (Greentech)",
    },
    {
      key: "showModernBn",
      title: "২. আধুনিক বিজ্ঞানভিত্তিক বাংলা অনুবাদ",
      desc: "আমাদের প্রাঞ্জল ও সমসাময়িক বিজ্ঞানভিত্তিক বাংলা অনুবাদ",
    },
    {
      key: "showLexicon",
      title: "কুরআনিক অভিধান",
      desc: "শব্দকোষ, মূল ধাতু (Root) ও ব্যাকরণগত বিশ্লেষণ",
    },
    {
      key: "showLexiconScientific",
      title: "বিজ্ঞানভিত্তিক অর্থ ও গবেষণা",
      desc: "অভিধানে মূল ধাতুর আধুনিক বিজ্ঞানভিত্তিক ব্যাখ্যা ও প্রেক্ষাপট প্রদর্শন",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sliders className="size-6 text-primary" />
            সেটিংস ও পছন্দসমূহ
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            অফলাইন ডাটা, ফন্ট সাইজ এবং ডিসপ্লে লেয়ার কাস্টমাইজ করুন
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <Check className="size-3" />
          স্বয়ংক্রিয় সংরক্ষিত
        </span>
      </div>

      {/* ফন্ট সাইজ সেটিংস */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Type className="size-4 text-primary" />
          <span>ফন্ট সাইজ সেটিংস</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">আরবি ফন্ট সাইজ</Label>
              <span className="font-mono text-xs text-primary font-bold">
                {prefs.arabicFontSize}px
              </span>
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
              <p
                className="arabic text-foreground font-normal leading-relaxed"
                style={{ fontSize: `${prefs.arabicFontSize}px` }}
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">অনুবাদ ফন্ট সাইজ</Label>
              <span className="font-mono text-xs text-primary font-bold">
                {prefs.translationFontSize}px
              </span>
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
              <p
                className="text-muted-foreground leading-relaxed"
                style={{ fontSize: `${prefs.translationFontSize}px` }}
              >
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
          <span>অফলাইন ডাউনলোড ম্যানেজমেন্ট</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">১. সুরা ডাউনলোড (১১৪টি)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  সম্পূর্ণ ১১৪টি সূরার লোকাল ডাটা ক্যাশ করুন
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
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${surahProgress}%` }}
                  />
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
                <h3 className="text-sm font-semibold text-foreground">২. আয়াত ডাউনলোড (৬২৩৬টি)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  শব্দে শব্দে অর্থ ও রুটসহ অফলাইন ডাটা সেভ করুন
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
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${ayahProgress}%` }}
                  />
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
        </div>
      </div>

      {/* ডিসপ্লে লেয়ার সেটিংস */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Layers className="size-4 text-primary" />
          <span>প্রদর্শন সেটিংস (Display Layers)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayLayers.map((layer) => {
            const isChecked = prefs[layer.key] === true;

            return (
              <div
                key={layer.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-all hover:border-border cursor-pointer"
                onClick={() => updatePref(layer.key, !isChecked)}
              >
                <div className="space-y-0.5 select-none pointer-events-none">
                  <Label
                    htmlFor={layer.key}
                    className="text-sm font-semibold text-foreground cursor-pointer"
                  >
                    {layer.title}
                  </Label>
                  <p className="text-xs text-muted-foreground leading-relaxed">{layer.desc}</p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    id={layer.key}
                    checked={isChecked}
                    onCheckedChange={(val) => updatePref(layer.key, val)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
