import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { 
  Sliders, 
  BookOpen, 
  Sparkles, 
  Languages, 
  FileText, 
  Layers, 
  BookmarkCheck, 
  Volume2, 
  Moon, 
  Sun,
  Check
} from "lucide-react";

import { usePrefs } from "@/lib/prefs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { prefs, updatePref, lang } = usePrefs() as any;

  // টগল আইটেমগুলোর হালনাগাদ তালিকা
  const displayLayers = [
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
      desc: lang === "bn" ? "সহজে পড়ার জন্য আয়াতের উচ্চারণ নির্দেশিকা" : "Full ayah phonetic reading guide",
    },
    {
      key: "showTranslationBlock",
      title: lang === "bn" ? "অনুবাদ ব্লক (Translation Panel)" : "Translation Panel",
      desc: lang === "bn" ? "সকল অনুবাদ সারির সামগ্রিক দৃশ্যমানতা" : "Master switch for all translation rows",
    },
    {
      key: "showConventionalBn",
      title: lang === "bn" ? "১. প্রচলিত অনুবাদ (বাংলা)" : "1. Conventional Translation (BN)",
      desc: lang === "bn" ? "মুহিউদ্দীন খান / তাইসিরুল কুরআন (Greentech)" : "Standard Bengali translation",
    },
    {
      key: "showConventionalEn",
      title: lang === "bn" ? "২. Conventional Translation (English)" : "2. Conventional Translation (EN)",
      desc: lang === "bn" ? "সহীহ ইন্টারন্যাশনাল স্ট্যান্ডার্ড অনুবাদ (Greentech)" : "Sahih International translation",
    },
    {
      key: "showModernBn",
      title: lang === "bn" ? "৩. আধুনিক অনুবাদ (বাংলা)" : "3. Modern Translation (BN)",
      desc: lang === "bn" ? "আমাদের প্রাঞ্জল ও সহজবোধ্য আধুনিক বাংলা অনুবাদ" : "Contemporary contextual Bengali translation",
    },
    {
      key: "showModernEn",
      title: lang === "bn" ? "৪. Modern Translation (English)" : "4. Modern Translation (EN)",
      desc: lang === "bn" ? "আমাদের সমসাময়িক আধুনিক ইংরেজি অনুবাদ" : "Contemporary contextual English translation",
    },
    {
      key: "showLexicon",
      title: lang === "bn" ? "অভিধান / Lexicon" : "Lexicon / Vocabulary",
      desc: lang === "bn" ? "শব্দকোষ, মূল ধাতু (Root) ও ব্যাকরণগত বিশ্লেষণ" : "Vocabulary, Arabic roots and grammatical notes",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
      
      {/* হেডার */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sliders className="size-6 text-primary" />
            {lang === "bn" ? "প্রদর্শন সেটিংস (Display Layers)" : "Display Layers"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "bn"
              ? "কুরআন পাঠের সময় আপনার পছন্দমতো লেয়ারগুলো চালু বা বন্ধ রাখুন"
              : "Customize the display layers to suit your reading preference"}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <Check className="size-3" />
          {lang === "bn" ? "স্বয়ংক্রিয় সংরক্ষিত" : "Auto saved"}
        </span>
      </div>

      {/* সেটিংস টগল গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayLayers.map((layer) => {
          const isChecked = prefs ? prefs[layer.key] !== false : true;

          return (
            <div
              key={layer.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-all hover:border-border"
            >
              <div className="space-y-0.5">
                <Label htmlFor={layer.key} className="text-sm font-semibold text-foreground cursor-pointer">
                  {layer.title}
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {layer.desc}
                </p>
              </div>

              <Switch
                id={layer.key}
                checked={isChecked}
                onCheckedChange={(val) => {
                  if (updatePref) updatePref(layer.key, val);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}