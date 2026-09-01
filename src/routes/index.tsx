import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useDeferredValue } from "react";
import { ArrowRight, BookOpen, BookA, FileText, Search, Settings, Sparkles, Compass, Flame, Heart, Coins, ShieldAlert } from "lucide-react";

import { chaptersQuery, localNumber } from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Typewriter } from "@/components/Typewriter";
import { GlobalSearchDialog } from "@/components/GlobalSearchDialog";
import { QURAN_THEMATIC_DATABASE } from "@/lib/quranThematicData";
import { searchQuranSurahs, bnToEnDigits } from "@/lib/quranSearchEngine";
import { SparkleCtaNotice } from "@/components/SparkleCtaNotice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quran Explorer — Word by Word Quran in Bangla & English | কুরআন অন্বেষা" },
      {
        name: "description",
        content:
          "পবিত্র কুরআনের শব্দে শব্দে বাংলা অর্থ, ইংরেজি অনুবাদ এবং আধুনিক বিজ্ঞানভিত্তিক ব্যাখ্যাসহ সম্পূর্ণ কুরআন অধ্যয়ন করুন — কুরআন অন্বেষা (Quran Explorer)।",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://wooniche.com/" },
      { property: "og:site_name", content: "কুরআন অন্বেষা — Quran Explorer" },
      { property: "og:title", content: "কুরআন অন্বেষা — শব্দে শব্দে অর্থসহ কুরআন | Quran Explorer" },
      {
        property: "og:description",
        content: "শব্দে শব্দে বাংলা অর্থ, ইংরেজি অনুবাদ ও আধুনিক বিজ্ঞানভিত্তিক গবেষণাসহ পবিত্র কুরআন অধ্যয়ন করুন।",
      },
      { property: "og:image", content: "https://wooniche.com/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://wooniche.com/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "পবিত্র কুরআন — বুঝে পড়ুন | কুরআন অন্বেষা" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "কুরআন অন্বেষা — শব্দে শব্দে অর্থসহ কুরআন | Quran Explorer" },
      {
        name: "twitter:description",
        content: "শব্দে শব্দে বাংলা অর্থ, ইংরেজি অনুবাদ ও আধুনিক বিজ্ঞানভিত্তিক গবেষণাসহ পবিত্র কুরআন অধ্যয়ন করুন।",
      },
      { name: "twitter:image", content: "https://wooniche.com/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://wooniche.com/" },
    ],
  }),
  component: HomePage,
});


function getCleanExcerpt(excerpt?: string | null, body?: string | null, maxLength = 130): string {
  if (excerpt && excerpt.trim().length > 0) {
    return excerpt.trim();
  }
  if (!body) return "বিস্তারিত প্রবন্ধটি পড়তে ক্লিক করুন...";
  const clean = body.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}...` : clean;
}

function HomePage() {
  const { t, lang, themeMode } = usePrefs();
  const [term, setTerm] = useState("");
  const deferredTerm = useDeferredValue(term);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchDialogQuery, setSearchDialogQuery] = useState("");
  const chapters = useQuery(chaptersQuery(lang));
  const navigate = useNavigate();

  const handleOpenSearchWith = (q: string) => {
    setSearchDialogQuery(q);
    setSearchDialogOpen(true);
  };

  const articles = useQuery({
    queryKey: ["articles", "published", "home"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(3);
        if (error) return [];
        return data || [];
      } catch {
        return [];
      }
    },
    staleTime: 60 * 1000,
  });

  const { filtered, searchAyahTarget, homeDidYouMean } = useMemo(() => {
    const list = chapters.data ?? [];
    if (!deferredTerm.trim()) {
      return {
        filtered: list,
        searchAyahTarget: null,
        homeDidYouMean: undefined,
      };
    }

    const { matches, didYouMean } = searchQuranSurahs(deferredTerm);
    const chapterMap = new Map(list.map((c) => [c.id, c]));

    const matchedList = matches.map((m) => {
      const existing = chapterMap.get(m.id);
      if (existing) {
        return { ...existing, targetAyah: m.targetAyah };
      }
      return {
        id: m.id,
        name_simple: m.name_en,
        name_arabic: m.name_arabic,
        verses_count: m.total_verses,
        translated_name: { name: m.meaning_bn },
        targetAyah: m.targetAyah,
      };
    });

    const targetAyah = matches.find((m) => m.targetAyah)?.targetAyah;

    return {
      filtered: matchedList,
      searchAyahTarget: targetAyah ? { surah: matches[0]?.id, ayah: targetAyah } : null,
      homeDidYouMean: didYouMean,
    };
  }, [chapters.data, deferredTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;

    if (searchAyahTarget) {
      navigate({
        to: "/surah/$id",
        params: { id: String(searchAyahTarget.surah) },
        search: { ayah: Number(searchAyahTarget.ayah) },
      });
      return;
    }

    if (filtered.length > 0) {
      navigate({
        to: "/surah/$id",
        params: { id: String(filtered[0].id) },
        search: (filtered[0] as any).targetAyah ? { ayah: (filtered[0] as any).targetAyah } : undefined,
      });
      return;
    }

    // Direct match not found in surahs, open modal with term
    handleOpenSearchWith(term);
  };

  return (
    <div>
  {/* হিরো সেকশন */}
  {(() => {
    const tm = themeMode ?? "dark";
    const overlayClass =
      tm === "sepia"
        ? "absolute inset-0 z-[1] bg-gradient-to-br from-[#3d1f00]/75 via-[#5a2e00]/60 to-[#2d1500]/80"
        : tm === "slate"
        ? "absolute inset-0 z-[1] bg-gradient-to-br from-[#0c1f2e]/80 via-[#0f2d44]/65 to-[#071620]/85"
        : tm === "light"
        ? "absolute inset-0 z-[1] bg-gradient-to-br from-[#0a3d4a]/75 via-[#0d5060]/60 to-[#062530]/80"
        : /* dark */ "absolute inset-0 z-[1] bg-gradient-to-br from-[#030712]/85 via-[#0b1a2d]/75 to-[#030b14]/90";
    return (
      <section className="relative overflow-hidden text-white pb-16 sm:pb-24 min-h-[480px] sm:min-h-[540px] contain-paint">
        {/* ব্যাকগ্রাউন্ড ইমেজ */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.webp"
            alt=""
            aria-hidden="true"
            width="1920"
            height="1080"
            className="w-full h-full object-cover object-center -scale-x-100 select-none pointer-events-none"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* থিম-অনুযায়ী কালার ওভারলে */}
        <div className={overlayClass} />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-16 sm:pt-24 md:pt-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-md shadow-xs">
            <Sparkles className="size-3.5 text-[#60a5fa]" /> {t("tagline")}
          </p>

          {/* max-w-4xl ও whitespace ফিক্স যাতে ইংরেজি লাইন না ভাঙ্গে */}
          <div className="mt-6 max-w-4xl">
            <h1 className="text-3xl font-bold leading-normal text-white sm:text-4xl md:text-5xl font-serif">
              {lang === "bn" ? (
                "পবিত্র কুরআন — বুঝে পড়ুন"
              ) : (
                <span>
                  The Holy Quran — <span className="inline-block sm:inline whitespace-nowrap">understand it</span>
                </span>
              )}
            </h1>

            {/* ফিক্সড মিনিমাম হাইট দিয়ে লেআউট শিফট প্রতিরোধ */}
            <div className="mt-4 sm:mt-5 min-h-[44px] sm:min-h-[52px] text-xl font-semibold sm:text-2xl md:text-3xl font-serif flex items-center">
              <Typewriter
                words={
                  lang === "bn"
                    ? [
                        "শব্দে শব্দে অর্থসহ",
                        "বিজ্ঞানভিত্তিক ব্যাখ্যায়",
                        "সহজ বাংলা অনুবাদে",
                        "প্রামাণ্য তথ্যসূত্রসহ",
                      ]
                    : [
                        "word by word",
                        "with scientific context",
                        "in clear translation",
                        "with authentic notes",
                      ]
                }
                delayBetweenWords={4500}
              />
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{t("heroSub")}</p>
          
          {/* ৪টি সমান সাইজের Left-Aligned CTA বাটন (মোবাইলে ২ লাইনে ২x২ গ্রিড, ডেস্কটপে ৪ কলামে ১ লাইন) */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full">
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-11 sm:h-12 w-full rounded-xl border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-[1.02] flex items-center justify-center gap-2 px-3 text-sm sm:text-base font-semibold cursor-pointer"
            >
              <Link to="/surah/$id" params={{ id: "1" }}>
                <BookOpen className="size-4 shrink-0 text-[#60a5fa]" />
                <span>{lang === "bn" ? "কুরআন" : "Quran"}</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-11 sm:h-12 w-full rounded-xl border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-[1.02] flex items-center justify-center gap-2 px-3 text-sm sm:text-base font-semibold cursor-pointer"
            >
              <Link to="/lexicon">
                <BookA className="size-4 shrink-0 text-[#60a5fa]" />
                <span>{lang === "bn" ? "অভিধান" : "Lexicon"}</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-11 sm:h-12 w-full rounded-xl border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-[1.02] flex items-center justify-center gap-2 px-3 text-sm sm:text-base font-semibold cursor-pointer"
            >
              <Link to="/articles">
                <FileText className="size-4 shrink-0 text-[#60a5fa]" />
                <span>{lang === "bn" ? "আর্টিকেল" : "Articles"}</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-11 sm:h-12 w-full rounded-xl border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-[1.02] flex items-center justify-center gap-2 px-3 text-sm sm:text-base font-semibold cursor-pointer"
            >
              <Link to="/settings">
                <Settings className="size-4 shrink-0 text-[#60a5fa]" />
                <span>{lang === "bn" ? "সেটিংস" : "Settings"}</span>
              </Link>
            </Button>
          </div>

          {/* CTA বাটনগুলোর নীচে ১.৫ সেকেন্ড পরপর বার্স্ট করা অ্যানিমেটেড তারাবাত্তি বক্স CTA */}
          <div className="mt-4 max-w-xl w-full">
            <SparkleCtaNotice variant="hero" />
          </div>
        </div>

        {/* নিচের সেকশনের সাথে গ্র্যাডিয়েন্ট জয়েন্ট */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-b from-transparent via-[var(--background)]/70 to-[var(--background)]" />
      </section>
    );
  })()}

      {/* সুরা তালিকা ও সার্চ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground">
              {t("surahs")} <span className="text-muted-foreground">({localNumber(114, lang)})</span>
            </h2>

            <div className="w-full max-w-sm space-y-1.5">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center rounded-xl border border-border bg-card px-3 py-1.5 shadow-xs focus-within:border-foreground/60 transition-all"
              >
                <Search className="size-4 text-muted-foreground shrink-0 mr-2" />
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder={
                    lang === "bn"
                      ? "সুরা খুঁজুন... / আয়াত খুঁজুন..."
                      : "Search Surah... / Ayah..."
                  }
                  className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  aria-label={lang === "bn" ? "সুরা বা আয়াত খুঁজুন" : "Search surah or ayah"}
                  className="rounded-lg bg-[#2A6F97] hover:bg-[#1f5575] text-white px-3 py-1 text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  যান
                </button>
              </form>
              <p className="text-xs leading-normal text-muted-foreground px-1 font-medium">
                {lang === "bn"
                  ? "💡 সুরা খুঁজতে নাম বা নম্বর (৩৩ বা 33) লিখুন। আয়াত খুঁজতে ৩৩ঃ৪০ বা 33:40 লিখে ইন্টার চাপুন।"
                  : "💡 Search surah by name or no. (33). Search ayah like 33:40 and press Enter."}
              </p>
            </div>
          </div>

          {/* অনুবাদ উন্নয়ন ও ৪:৮২ সম্পর্কিত নোটিশ বক্স (Theme Sparkle Blast) */}
          <div className="relative mt-6 w-full">
            {/* চার কোণায় উড়ে যাওয়া থিম তারাবাত্তি */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 -top-2 text-emerald-400 dark:text-emerald-300 animate-star-fly-1 select-none z-10 text-sm"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-2 text-cyan-300 dark:text-cyan-400 animate-star-fly-2 select-none z-10 text-sm"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 -bottom-2 text-teal-300 dark:text-teal-400 animate-star-fly-3 select-none z-10 text-sm"
            >
              ★
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -bottom-2 text-emerald-300 dark:text-emerald-400 animate-star-fly-4 select-none z-10 text-sm"
            >
              ★
            </span>

            <div className="relative z-0 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 dark:bg-emerald-950/30 p-4 sm:p-5 text-center backdrop-blur-md shadow-[0_0_22px_rgba(16,185,129,0.2)] animate-sparkle-burst transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2 text-emerald-500 dark:text-emerald-400 font-bold text-sm sm:text-base">
                <Sparkles className="size-4 text-emerald-400 animate-pulse shrink-0" />
                <span>{lang === "bn" ? "অনুবাদ পরিমার্জন ও ৪:৮২ সামঞ্জস্য নীতি" : "Translation Refinement & 4:82 Consistency Principle"}</span>
                <Sparkles className="size-4 text-cyan-400 animate-pulse shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 dark:text-foreground/90 leading-relaxed font-normal">
                {lang === "bn"
                  ? "আধুনিক ও বিজ্ঞানভিত্তিক এই অনুবাদগুলোর কাজ এখনও চলমান। আমাদের বিশ্বাস, পরিমার্জন, সংশোধন ও উন্নতির এই প্রক্রিয়া ভবিষ্যতেও অব্যাহত থাকবে। যদি কোনো অনুবাদ কুরআনের ৪:৮২ আয়াতের মূলভাবের সঙ্গে সাংঘর্ষিক হয়, তাহলে সেই অনুবাদ গ্রহণযোগ্য বলে বিবেচিত হবে না। এই বিষয়ে আপনার জ্ঞানভিত্তিক ও চিন্তাশীল পরামর্শ সবসময়ই আমরা সাদরে গ্রহণ করি।"
                  : "The work on these modern, science-based translations is still ongoing. We believe that this process of revision, refinement, and improvement will continue over time. If any translation contradicts the core essence of verse 4:82 [of the Quran], it will be considered invalid. In this regard, your thoughtful, knowledge-based suggestions and feedback are always warmly welcomed."}
              </p>
            </div>
          </div>

          {chapters.isLoading ? (
            <p className="mt-8 text-sm text-muted-foreground">{t("loading")}</p>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c: any) => {
                const targetAyah = c.targetAyah || (searchAyahTarget && searchAyahTarget.surah === c.id ? searchAyahTarget.ayah : undefined);

                return (
                  <Link
                    key={c.id}
                    to="/surah/$id"
                    params={{ id: String(c.id) }}
                    search={targetAyah ? { ayah: targetAyah } : undefined}
                    className="card-soft group flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] cursor-pointer"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                      {localNumber(c.id, lang)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">
                        {c.name_simple}
                        {targetAyah && (
                          <span className="ml-2 text-xs font-semibold text-[#1c5576] dark:text-[#58b4e8]">
                            ({localNumber(targetAyah, lang)} নং আয়াত)
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground font-medium">
                        {c.translated_name.name} · {localNumber(c.verses_count, lang)} {t("verses")}
                      </span>
                    </span>
                    <span className="arabic text-lg text-primary">{c.name_arabic}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* বিষয়ভিত্তিক কুরআন ও গবেষণা অন্বেষা (Thematic & Scientific Quran Explorer) */}
      <section className="border-t border-border bg-gradient-to-b from-card/60 to-background py-14">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md mb-2">
                <Sparkles className="size-3.5 text-amber-500" />
                {lang === "bn" ? "ভাবার্থ ও বিষয়ভিত্তিক অন্বেষা" : "Thematic & Conceptual Explorer"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                {lang === "bn" ? "কুরআনের বিষয়ভিত্তিক জ্ঞানভাণ্ডার" : "Thematic Quranic Knowledge Base"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                {lang === "bn"
                  ? "বিজ্ঞান, সৃষ্টিতত্ত্ব, পারিবারিক অধিকার, অর্থনীতি, আত্মশুদ্ধি ও নবীদের জীবনী সম্পর্কিত আয়াতসমূহ সরাসরি অনুসন্ধান করুন।"
                  : "Explore verses on science, cosmology, family ethics, economics, inner peace, and prophetic stories."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenSearchWith("")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2A6F97] hover:bg-[#1f5575] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Search className="size-3.5" />
              <span>{lang === "bn" ? "সকল বিষয় ও আর্টিকেল সার্চ" : "Search All Topics & Articles"}</span>
            </button>
          </div>

          {/* থিমেটিক টপিক গ্রিড */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QURAN_THEMATIC_DATABASE.slice(0, 6).map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleOpenSearchWith(topic.title_bn.split(" ")[0])}
                className="card-soft group flex flex-col justify-between p-5 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {lang === "en" ? topic.category_en : topic.category_bn}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {topic.references.length}টি রেফারেন্স
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {lang === "en" ? topic.title_en : topic.title_bn}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {lang === "en" ? topic.description_en : topic.description_bn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-primary">
                  <span>{lang === "bn" ? "আয়াতসমূহ ও তাফসির দেখুন" : "View Verses & Insights"}</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* আর্টিকেল সেকশন */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground">{t("latestArticles")}</h2>
            <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-semibold">
              {t("articles")} <ArrowRight className="size-4" />
            </Link>
          </div>
          {articles.data && articles.data.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {articles.data.map((a: any) => {
                const title = lang === "en" && a.title_en ? a.title_en : a.title_bn;
                const rawBody = a.content_bn || a.body_bn || a.content_en || a.body_en || a.body || "";
                const excerpt =
                  lang === "en"
                    ? getCleanExcerpt(a.excerpt_en, rawBody)
                    : getCleanExcerpt(a.excerpt_bn, rawBody);

                return (
                  <Link
                    key={a.id}
                    to="/articles/$slug"
                    params={{ slug: a.slug }}
                    className="card-soft flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                  >
                    {a.cover_image_url && (
                      <img
                        src={a.cover_image_url}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        width="380"
                        height="160"
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-foreground">
                        {title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                        {excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground font-medium">{t("noArticles")}</p>
          )}
        </div>
      </section>

      {/* নিউজলেটার */}
      <section className="mx-auto w-full max-w-3xl px-4 py-16">
        <div className="card-soft p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">{t("newsletter")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground font-medium">{t("newsletterSub")}</p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* গ্লোবাল অমনিসার্চ ডায়ালগ */}
      <GlobalSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        initialQuery={searchDialogQuery}
      />
    </div>
  );
}