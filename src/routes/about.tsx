import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  BookOpen, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Eye, 
  Headphones, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Languages, 
  Globe, 
  Cpu, 
  Check, 
  Info,
  BookA,
  FileText
} from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "আমাদের সম্পর্কে — কুরআন অন্বেষা | About Quran Explorer" },
      {
        name: "description",
        content: "কুরআন অন্বেষার দর্শন, ১০টি ডিসপ্লে লেয়ার, প্রচলিত ও আধুনিক অনুবাদ এবং বিজ্ঞানভিত্তিক গবেষণার সমন্বিত পরিচিতি।",
      },
      { property: "og:title", content: "আমাদের সম্পর্কে — কুরআন অন্বেষা" },
      { property: "og:description", content: "শব্দে শব্দে অর্থ, অনুবাদ ও বিজ্ঞানভিত্তিক গবেষণার সমন্বিত কুরআন প্ল্যাটফর্ম।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = usePrefs();

  const layersList = [
    {
      num: "০১",
      title_bn: "আরবি টেক্সট (Arabic Mushaf)",
      title_en: "Arabic Mushaf Text",
      desc_bn: "স্পষ্ট আরবি ফন্ট ও স্বাধীন ফন্ট সাইজ নিয়ন্ত্রণসহ মূল কুরআন পাঠ।",
      desc_en: "Crystal-clear Arabic script with independent font scaling.",
      badge: "কোর ভিত্তি",
      icon: BookOpen,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    },
    {
      num: "০২",
      title_bn: "শব্দে শব্দে অর্থ (Word-by-Word)",
      title_en: "Word by Word Meaning",
      desc_bn: "প্রতিটি শব্দের নিচে স্বতন্ত্র বাংলা অর্থ ও উচ্চারণ যাতে আরবি বোঝা সহজ হয়।",
      desc_en: "Precise word-by-word Bengali meanings and phonetics under each word.",
      badge: "শব্দকোষ",
      icon: BookA,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    },
    {
      num: "০৩",
      title_bn: "উচ্চারণ (Transliteration)",
      title_en: "Bengali Transliteration",
      desc_bn: "সহজে ও নির্ভুলভাবে পড়ার জন্য আয়াতের প্রমিত বাংলা উচ্চারণ নির্দেশিকা।",
      desc_en: "Standard transliteration for beginner readers.",
      badge: "সহায়ক",
      icon: Languages,
      color: "from-indigo-500/20 to-blue-500/10 border-indigo-500/30",
    },
    {
      num: "০৪",
      title_bn: "১. ইসলামিক ফাউন্ডেশন অনুবাদ",
      title_en: "1. Islamic Foundation Translation",
      desc_bn: "ইসলামিক ফাউন্ডেশন বাংলাদেশ ভিত্তিক নির্ভরযোগ্য ও প্রমিত বাংলা অনুবাদ।",
      desc_en: "Authentic and standard Bengali translation by Islamic Foundation Bangladesh.",
      badge: "বাংলা মানদণ্ড",
      icon: CheckCircle2,
      color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
    },
    {
      num: "০৫",
      title_bn: "২. সহীহ ইন্টারন্যাশনাল অনুবাদ",
      title_en: "2. Sahih International Translation",
      desc_bn: "আন্তর্জাতিকভাবে সর্বাধিক স্বীকৃত সহীহ ইন্টারন্যাশনাল ইংরেজি অনুবাদ।",
      desc_en: "Internationally standard and acclaimed Sahih International English translation.",
      badge: "ইংরেজি মানদণ্ড",
      icon: Globe,
      color: "from-slate-500/20 to-zinc-500/10 border-slate-500/30",
    },
    {
      num: "০৬",
      title_bn: "৩. আধুনিক বাংলা অনুবাদ",
      title_en: "3. Modern Bengali Translation",
      desc_bn: "আমাদের প্রাঞ্জল, সমসাময়িক ও সহজবোধ্য আধুনিক বাংলা অনুবাদ।",
      desc_en: "Contemporary, refined and highly accessible modern Bengali translation.",
      badge: "আধুনিক গবেষণা",
      icon: Sparkles,
      color: "from-teal-500/20 to-emerald-500/10 border-teal-500/30",
    },
    {
      num: "০৭",
      title_bn: "৪. Modern English",
      title_en: "4. Modern English Translation",
      desc_bn: "আধুনিক ইংরেজি ভাষাভাষী পাঠকদের জন্য সমসাময়িক অনুবাদ ও ব্যাখ্যা।",
      desc_en: "Contemporary English translation optimized for modern context.",
      badge: "গবেষণা",
      icon: FileText,
      color: "from-sky-500/20 to-blue-500/10 border-sky-500/30",
    },
    {
      num: "০৮",
      title_bn: "অভিধান / Lexicon",
      title_en: "Quranic Lexicon & Roots",
      desc_bn: "শব্দকোষ, মূল ধাতু (Root Word) ও ব্যাকরণগত পূর্ণাঙ্গ ভাষাতাত্ত্বিক বিশ্লেষণ।",
      desc_en: "Comprehensive root word analysis and linguistic grammar breakdown.",
      badge: "ভাষাতত্ত্ব",
      icon: BookA,
      color: "from-purple-500/20 to-violet-500/10 border-purple-500/30",
    },
    {
      num: "০৯",
      title_bn: "বিজ্ঞানভিত্তিক অর্থ ও গবেষণা",
      title_en: "Scientific Insights & Context",
      desc_bn: "অভিধানে মূল ধাতুর আধুনিক বিজ্ঞানভিত্তিক ব্যাখ্যা ও ঐতিহাসিক প্রেক্ষাপট।",
      desc_en: "Scientific perspectives and contextual discoveries linked to root words.",
      badge: "বিজ্ঞানভিত্তিক",
      icon: Cpu,
      color: "from-pink-500/20 to-rose-500/10 border-pink-500/30",
    },
    {
      num: "১০",
      title_bn: "আয়াত মেটা ডাটা (Topic Tags)",
      title_en: "Ayah Meta Data & Topics",
      desc_bn: "প্রতিটি আয়াতের নম্বরের পাশে বিষয়ভিত্তিক মেটা ডাটা ও প্রাসঙ্গিক টপিক ট্যাগ।",
      desc_en: "Contextual topic tags and thematic categorizations for every verse.",
      badge: "মেটা ডাটা",
      icon: Sliders,
      color: "from-emerald-500/20 to-green-500/10 border-emerald-500/30",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12 space-y-12 sm:space-y-16">
      
      {/* ১. হিরো সেকশন */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-b from-primary/10 via-primary/5 to-card p-6 sm:p-12 text-center shadow-md">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>{lang === "bn" ? "কুরআন অন্বেষা প্ল্যাটফর্ম পরিচিতি" : "Quran Explorer Platform Overview"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-display leading-tight">
            {lang === "bn" ? (
              <>কুরআনের আলোয় <span className="text-primary">আধুনিক মনন ও গবেষণা</span></>
            ) : (
              <>Illuminating Modern Minds with <span className="text-primary">Quranic Wisdom</span></>
            )}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {lang === "bn"
              ? "শব্দে শব্দে অর্থ, প্রচলিত ও আধুনিক অনুবাদ, মূল ধাতুর ভাষাতাত্ত্বিক বিশ্লেষণ এবং সমসাময়িক বিজ্ঞানভিত্তিক প্রেক্ষাপটের সমন্বয়ে নির্মিত একটি উন্মুক্ত ও উচ্চমানের কুরআন গবেষণা প্ল্যাটফর্ম।"
              : "An open, high-performance Quran exploration hub integrating word-by-word linguistics, classical & modern translations, root lexicons, and scientific contextual research."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
              <Check className="size-3.5 text-emerald-500" />
              {lang === "bn" ? "১০টি স্বতন্ত্র লেয়ার" : "10 Display Layers"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
              <Check className="size-3.5 text-emerald-500" />
              {lang === "bn" ? "বিজ্ঞাপনমুক্ত ও উন্মুক্ত" : "100% Ad-Free"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
              <Check className="size-3.5 text-emerald-500" />
              {lang === "bn" ? "ক্লাউডফ্লেয়ার এজ হোস্টেড" : "Edge Hosted"}
            </span>
          </div>
        </div>
      </div>

      {/* ২. ১০টি ডিসপ্লে লেয়ার গ্যালারি */}
      <div className="space-y-6">
        <div className="text-center space-y-1.5 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2.5">
            <Layers className="size-6 text-primary" />
            {lang === "bn" ? "১০টি স্বাধীন ডিসপ্লে লেয়ার" : "10 Independent Display Layers"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {lang === "bn"
              ? "আপনার প্রয়োজন ও পছন্দ অনুযায়ী প্রতিটি অংশকে স্বাধীনভাবে চালু বা বন্ধ করে পড়ার স্বাধীনতা।"
              : "Customize your reading experience by toggling independent display layers."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {layersList.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.num}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 bg-card hover:shadow-md transition-all duration-200 ${layer.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center size-7 rounded-lg bg-background/80 font-mono text-xs font-bold text-foreground border border-border/60">
                      {layer.num}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {layer.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                      <Icon className="size-4 text-primary shrink-0" />
                      <span>{lang === "bn" ? layer.title_bn : layer.title_en}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {lang === "bn" ? layer.desc_bn : layer.desc_en}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ৩. তুলনামূলক টেবিল */}
      <div className="space-y-6">
        <div className="text-center space-y-1.5 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2.5">
            <BookOpen className="size-6 text-primary" />
            {lang === "bn" ? "অনুবাদ ও গবেষণা কাঠামোর তুলনা" : "Translation & Research Matrix"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {lang === "bn"
              ? "প্রচলিত অনুবাদের পাশাপাশি আমাদের আধুনিক ও বিজ্ঞানভিত্তিক গবেষণার পার্থক্য।"
              : "Comparison between classical standards and our contemporary scientific research."}
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">{lang === "bn" ? "লেয়ারের নাম" : "Layer"}</th>
                  <th className="p-3.5 sm:p-4">{lang === "bn" ? "অনুবাদ শৈলী ও বৈশিষ্ট্য" : "Style & Focus"}</th>
                  <th className="p-3.5 sm:p-4">{lang === "bn" ? "উৎস / মানদণ্ড" : "Source Reference"}</th>
                  <th className="p-3.5 sm:p-4">{lang === "bn" ? "উপযুক্ত পাঠক" : "Target Audience"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    {lang === "bn" ? "ইসলামিক ফাউন্ডেশন / সহীহ ইন্টারন্যাশনাল" : "Islamic Foundation / Sahih International"}
                  </td>
                  <td className="p-3.5 sm:p-4 leading-relaxed">
                    {lang === "bn"
                      ? "শব্দার্থের ঐতিহ্যবাহী আক্ষরিক রূপ ও প্রচলিত শাব্দিক বাক্যবিন্যাস।"
                      : "Traditional literal phrasing and classical Islamic scholarship."}
                  </td>
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">
                    ইসলামিক ফাউন্ডেশন বাংলাদেশ / Sahih International
                  </td>
                  <td className="p-3.5 sm:p-4">
                    {lang === "bn" ? "সাধারণ তিলাওয়াত ও ঐতিহ্যগত পাঠ" : "General recitation & traditional study"}
                  </td>
                </tr>

                <tr className="hover:bg-muted/20 transition-colors bg-primary/2">
                  <td className="p-3.5 sm:p-4 font-semibold text-primary flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    {lang === "bn" ? "আধুনিক অনুবাদ (Modern)" : "Modern Translation"}
                  </td>
                  <td className="p-3.5 sm:p-4 leading-relaxed text-foreground">
                    {lang === "bn"
                      ? "সহজ, প্রাঞ্জল ও গতিশীল বাক্য যা সমসাময়িক ভাষায় কুরআনের মূল বার্তা স্পষ্ট করে।"
                      : "Fluid, contemporary language making core messages crystal clear."}
                  </td>
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">
                    কুরআন অন্বেষা সমসাময়িক সম্পাদনা
                  </td>
                  <td className="p-3.5 sm:p-4 font-medium text-emerald-600 dark:text-emerald-400">
                    {lang === "bn" ? "নতুন প্রজন্ম ও গভীর ভাবার্থ সন্ধানকারী" : "Next generation & conceptual readers"}
                  </td>
                </tr>

                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-purple-500" />
                    {lang === "bn" ? "বিজ্ঞানভিত্তিক অর্থ (Scientific)" : "Scientific Meanings"}
                  </td>
                  <td className="p-3.5 sm:p-4 leading-relaxed">
                    {lang === "bn"
                      ? "মূল আরবি ধাতুর বৈজ্ঞানিক, মহাজাগতিক ও জীববৈচিত্র্যমূলক গভীর অর্থ বিশ্লেষণ।"
                      : "Root word cosmological, biological, and natural science alignments."}
                  </td>
                  <td className="p-3.5 sm:p-4 font-medium text-foreground">
                    কুরআনিক লেক্সিকন ও আধুনিক গবেষণা
                  </td>
                  <td className="p-3.5 sm:p-4">
                    {lang === "bn" ? "গবেষক, চিন্তাবিদ ও বিজ্ঞানমনস্ক পাঠক" : "Researchers, scholars & rational thinkers"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ৪. আমাদের মূল নীতি ও নিরাপত্তা */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
          <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {lang === "bn" ? "ডেটা নির্ভুলতার গ্যারান্টি" : "Immutable Data Integrity"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {lang === "bn"
              ? "১১৪টি সুরার মূল পাঠ্য গিট-ব্যাকড স্ট্যাটিক সোর্সে সংরক্ষিত। ডাটাবেজের যেকোনো পরিস্থিতিতেও কুরআনের মূল টেক্সট অক্ষত থাকে।"
              : "Core Quran text is backed by version-controlled static structures guaranteeing zero corruption."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
          <div className="size-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Zap className="size-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {lang === "bn" ? "১.০০ সেকেন্ডে আল্ট্রাফাস্ট স্পিড" : "Edge-Accelerated Speed"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {lang === "bn"
              ? "ক্লাউডফ্লেয়ার এজ নেটওয়ার্কের মাধ্যমে পরিচালিত হওয়ায় পৃথিবীর যেকোনো প্রান্ত থেকে গড়ে ১.০০ সেকেন্ডের মধ্যে দ্রুততম পেজ লোড সম্পন্ন হয়।"
              : "Delivered via Cloudflare Global Edge CDN ensuring instantaneous page loads within ~1.00 second."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-xs">
          <div className="size-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Eye className="size-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {lang === "bn" ? "চক্ষু-বান্ধব পাঠাভিজ্ঞতা" : "Reader-Centric Design"}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {lang === "bn"
              ? "মুশাফ সেপিয়া, প্রাকৃতিক স্লেট ও ডার্ক মোডের মাধ্যমে দীর্ঘ সময় একটানা পড়ার পূর্ণ স্বাচ্ছন্দ্য।"
              : "Eye-comfort themes including Mushaf Sepia, Cool Slate, and OLED Dark for effortless study."}
          </p>
        </div>
      </div>

      {/* ৫. কল টু অ্যাকশন (CTA) */}
      <div className="rounded-3xl border border-border bg-linear-to-r from-card via-muted/30 to-card p-6 sm:p-10 text-center space-y-5 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {lang === "bn" ? "আজই শুরু হোক আপনার কুরআন অন্বেষা" : "Begin Your Quranic Journey Today"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          {lang === "bn"
            ? "আপনার সুবিধামতো সুরার তালিকা ব্রাউজ করুন অথবা সেটিংস থেকে ডিসপ্লে লেয়ারগুলো নিজের মতো সাজিয়ে নিন।"
            : "Browse surahs with full translation control or customize your display layers in settings."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="default" className="text-xs h-9 px-5">
            <Link to="/">
              <BookOpen className="size-4 mr-1.5" />
              {lang === "bn" ? "কুরআন পাঠ শুরু করুন" : "Explore Quran"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="default" className="text-xs h-9 px-5">
            <Link to="/settings">
              <Sliders className="size-4 mr-1.5" />
              {lang === "bn" ? "সেটিংস কাস্টমাইজ করুন" : "Customize Settings"}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="default" className="text-xs h-9 px-5">
            <Link to="/contact">
              {lang === "bn" ? "যোগাযোগ ও মতামত" : "Contact Us"}
              <ArrowRight className="size-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
