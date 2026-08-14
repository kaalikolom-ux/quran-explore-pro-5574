import { createFileRoute } from "@tanstack/react-router";
import { Sliders, Type, Database, Minus, Plus, RotateCcw } from "lucide-react";
import { usePrefs, type LayerKey } from "@/lib/prefs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OfflineSyncAdmin } from "@/components/OfflineSyncAdmin";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "সেটিংস ও প্রদর্শন ব্যবস্থাপনা — কুরআন অন্বেষা" },
      { name: "description", content: "আপনার সুবিধামতো কুরআন পাঠের প্রদর্শন, ফন্ট সাইজ এবং অফলাইন ডেটা কাস্টমাইজ করুন।" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const {
    lang,
    layers,
    toggleLayer,
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
  } = usePrefs();

  const layerOptions: { key: LayerKey; labelBn: string; labelEn: string; descBn: string; descEn: string }[] = [
    {
      key: "arabic",
      labelBn: "আরবি টেক্সট",
      labelEn: "Arabic Text",
      descBn: "মূল কুরআন পাঠ প্রদর্শন",
      descEn: "Show main Quranic Arabic text",
    },
    {
      key: "words",
      labelBn: "শব্দে শব্দে অর্থ",
      labelEn: "Word-by-word Meaning",
      descBn: "প্রতিটি শব্দের নিচে স্বতন্ত্র অর্থ",
      descEn: "Display breakdown for each individual word",
    },
    {
      key: "transliteration",
      labelBn: "উচ্চারণ (Transliteration)",
      labelEn: "Transliteration",
      descBn: "সহজে পড়ার জন্য উচ্চারণ নির্দেশিকা",
      descEn: "Phonetic reading guide",
    },
    {
      key: "translation",
      labelBn: "মূল অনুবাদ ব্লক",
      labelEn: "Translation Block",
      descBn: "পূর্ণ আয়াতের অনুবাদের অংশ",
      descEn: "Show full verse translation container",
    },
    {
      key: "bn",
      labelBn: "বাংলা অনুবাদ (প্রচলিত)",
      labelEn: "Bengali Standard Translation",
      descBn: "মুহিউদ্দীন খান / তাইসিরুল কুরআন",
      descEn: "Classical standard Bengali translation",
    },
    {
      key: "en",
      labelBn: "ইংরেজি অনুবাদ (সহীহ ইন্টারন্যাশনাল)",
      labelEn: "English Translation (Sahih Int.)",
      descBn: "সহীহ ইন্টারন্যাশনাল স্ট্যান্ডার্ড অনুবাদ",
      descEn: "Standard English translation",
    },
    {
      key: "sciBn",
      labelBn: "প্রকৃত অনুবাদ (বাংলা)",
      labelEn: "Authentic / Scientific (Bengali)",
      descBn: "বিজ্ঞানভিত্তিক ও গভীর ভাষাগত অনুবাদ",
      descEn: "Deep linguistic & scientific rendering in Bengali",
    },
    {
      key: "sciEn",
      labelBn: "প্রকৃত অনুবাদ (ইংরেজি)",
      labelEn: "Authentic / Scientific (English)",
      descBn: "বিজ্ঞানভিত্তিক ও গভীর ভাষাগত অনুবাদ",
      descEn: "Deep linguistic & scientific rendering in English",
    },
    {
      key: "lexicon",
      labelBn: "অভিধান / Lexicon",
      labelEn: "Lexicon / Dictionary",
      descBn: "শব্দকোষ ও ব্যাকরণগত বিশ্লেষণ",
      descEn: "Word root dictionary & notes",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Sliders className="size-7 text-primary" />
          {lang === "bn" ? "ব্যক্তিগত পছন্দ ও সেটিংস" : "Preferences & Settings"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {lang === "bn"
            ? "আপনার পছন্দ অনুযায়ী সেটিংস ঠিক করে রাখুন, ওয়েবসাইট স্বয়ংক্রিয়ভাবে তা মনে রাখবে।"
            : "Customize your reading experience. Your preferences are saved automatically on this device."}
        </p>
      </div>

      {/* কার্ড ১: প্রদর্শন লেয়ার সেটিংস */}
      <section className="card-soft p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sliders className="size-5 text-primary" />
            {lang === "bn" ? "প্রদর্শন সেটিংস (Display Layers)" : "Display Layers"}
          </h2>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {lang === "bn" ? "স্বয়ংক্রিয় সংরক্ষিত" : "Auto-saved"}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {layerOptions.map((opt) => (
            <div
              key={opt.key}
              className="flex items-center justify-between p-3.5 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/30 transition-colors"
            >
              <div className="space-y-0.5 pr-2">
                <Label htmlFor={`layer-${opt.key}`} className="font-medium cursor-pointer text-sm">
                  {lang === "bn" ? opt.labelBn : opt.labelEn}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {lang === "bn" ? opt.descBn : opt.descEn}
                </p>
              </div>
              <Switch
                id={`layer-${opt.key}`}
                checked={layers[opt.key]}
                onCheckedChange={() => toggleLayer(opt.key)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* কার্ড ২: ফন্ট সাইজ নিয়ন্ত্রণ ও প্রিভিউ */}
      <section className="card-soft p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Type className="size-5 text-primary" />
            {lang === "bn" ? "ফন্ট সাইজ স্কেলিং" : "Font Size Scaling"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setArabicFontSize(28);
              setTranslationFontSize(16);
            }}
            className="text-xs text-muted-foreground h-8"
          >
            <RotateCcw className="size-3.5 mr-1" />
            {lang === "bn" ? "ডিফল্ট করুন" : "Reset Default"}
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* আরবি ফন্ট সাইজ */}
          <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-background/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {lang === "bn" ? "আরবি টেক্সটের সাইজ" : "Arabic Font Size"}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded">
                {arabicFontSize}px
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={arabicFontSize <= 18}
                onClick={() => setArabicFontSize((s) => Math.max(18, s - 2))}
              >
                <Minus className="size-4" />
              </Button>
              <div className="flex-1 text-center font-mono text-sm">{arabicFontSize}px</div>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={arabicFontSize >= 48}
                onClick={() => setArabicFontSize((s) => Math.min(48, s + 2))}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          {/* অনুবাদ ফন্ট সাইজ */}
          <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-background/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {lang === "bn" ? "অনুবাদ টেক্সটের সাইজ" : "Translation Font Size"}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded">
                {translationFontSize}px
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={translationFontSize <= 12}
                onClick={() => setTranslationFontSize((s) => Math.max(12, s - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <div className="flex-1 text-center font-mono text-sm">{translationFontSize}px</div>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={translationFontSize >= 28}
                onClick={() => setTranslationFontSize((s) => Math.min(28, s + 1))}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* লাইভ প্রিভিউ বক্স */}
        <div className="rounded-lg border border-primary/20 bg-muted/20 p-5 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {lang === "bn" ? "লাইভ নমুনা প্রিভিউ" : "Live Sample Preview"}
          </span>
          <p
            className="arabic text-right leading-loose text-foreground"
            style={{ fontSize: `${arabicFontSize}px` }}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p
            className="text-foreground/90 leading-relaxed"
            style={{ fontSize: `${translationFontSize}px` }}
          >
            পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে শুরু করছি।
          </p>
        </div>
      </section>

      {/* কার্ড ৩: অফলাইন সিঙ্ক ও ডেটা সংরক্ষণ */}
      <section className="card-soft p-6 space-y-6">
        <div className="border-b border-border/60 pb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Database className="size-5 text-primary" />
            {lang === "bn" ? "অফলাইন ডেটা ও ক্যাশ ব্যবস্থাপনা" : "Offline Data & Sync"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "bn"
              ? "ইন্টারনেট ছাড়াও কুরআন পড়ার জন্য সুরাগুলো আপনার ডিভাইসে সংরক্ষণ করে রাখতে পারেন।"
              : "Download surahs into your local browser storage for seamless offline access."}
          </p>
        </div>

        <OfflineSyncAdmin />
      </section>
    </div>
  );
}