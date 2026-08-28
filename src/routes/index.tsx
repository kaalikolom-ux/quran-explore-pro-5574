import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BookA,
  FileText,
  Search,
  Settings,
  Sparkles,
  Compass,
  Flame,
  Heart,
  Coins,
  ShieldAlert,
} from "lucide-react";

import { chaptersQuery, localNumber } from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Typewriter } from "@/components/Typewriter";
import { GlobalSearchDialog } from "@/components/GlobalSearchDialog";
import { QURAN_THEMATIC_DATABASE } from "@/lib/quranThematicData";
import { searchQuranSurahs, bnToEnDigits, ALL_SURAHS_DATABASE } from "@/lib/quranSearchEngine";

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
      {
        property: "og:title",
        content: "Quran Explorer — Word by Word Quran in Bangla & English | কুরআন অন্বেষা",
      },
      {
        property: "og:description",
        content:
          "শব্দে শব্দে বাংলা অর্থ, ইংরেজি অনুবাদ ও বিজ্ঞানভিত্তিক গবেষণাসহ পবিত্র কুরআন অধ্যয়ন করুন।",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "কুরআন অন্বেষা — শব্দে শব্দে অর্থসহ কুরআন" },
      {
        name: "twitter:description",
        content: "শব্দে শব্দে অর্থ, প্রচলিত ও বিজ্ঞানভিত্তিক অনুবাদ একই পাতায়।",
      },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: HomePage,
});

function getCleanExcerpt(excerpt?: string | null, body?: string | null, maxLength = 130): string {
  if (excerpt && excerpt.trim().length > 0) {
    return excerpt.trim();
  }
  if (!body) return "বিস্তারিত প্রবন্ধটি পড়তে ক্লিক করুন...";
  const clean = body
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}...` : clean;
}

function HomePage() {
  const { t, lang } = usePrefs();
  const [term, setTerm] = useState("");
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchDialogQuery, setSearchDialogQuery] = useState("");
  const chapters = useQuery(chaptersQuery(lang));
  const navigate = useNavigate();

  const surahMetaMap = useMemo(() => {
    return new Map(ALL_SURAHS_DATABASE.map((s) => [s.id, s]));
  }, []);

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
    if (!term.trim()) {
      return {
        filtered: list,
        searchAyahTarget: null,
        homeDidYouMean: undefined,
      };
    }

    const { matches, didYouMean } = searchQuranSurahs(term);
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
  }, [chapters.data, term]);

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
        search: (filtered[0] as any).targetAyah
          ? { ayah: (filtered[0] as any).targetAyah }
          : undefined,
      });
      return;
    }

    // Direct match not found in surahs, open modal with term
    handleOpenSearchWith(term);
  };

  return (
    <div>
      {/* হিরো সেকশন */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1a2d] via-50% to-[#030712] text-white pb-16 sm:pb-24 min-h-[480px] sm:min-h-[540px] contain-paint">
        {/* উপরের হেডারের সাথে গ্র্যাডিয়েন্ট জয়েন্ট */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/70 to-transparent z-10" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* সফট অ্যাম্বিয়েন্ট গ্লো */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-[#1d4ed8]/12 blur-[150px]" />
          <div className="absolute -right-24 top-1/4 h-[450px] w-[450px] rounded-full bg-[#0284c7]/15 blur-[140px]" />
          <div className="absolute -left-24 top-1/3 h-[400px] w-[400px] rounded-full bg-[#1e3a8a]/20 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-16 sm:pt-24 md:pt-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-md shadow-xs">
            <Sparkles className="size-3.5 text-[#60a5fa]" /> শব্দে শব্দে কুরআন ও প্রামাণ্য অনুবাদ
          </p>

          <div className="mt-6 max-w-4xl">
            <h1 className="text-3xl font-bold leading-normal text-white sm:text-4xl md:text-5xl font-serif">
              পবিত্র কুরআন — বুঝে পড়ুন
            </h1>

            {/* শুধুমাত্র বাংলা ভাষায় টাইপিং এনিমেটেড টেক্সট দৃশ্যমান থাকবে, অন্য সব ভাষায় হাইড থাকবে */}
            <div className="typewriter-container mt-4 sm:mt-5 min-h-[44px] sm:min-h-[52px] text-xl font-semibold sm:text-2xl md:text-3xl font-serif flex items-center">
              <Typewriter
                words={[
                  "শব্দে শব্দে অর্থসহ",
                  "বিজ্ঞানভিত্তিক ব্যাখ্যায়",
                  "সহজ ও প্রাঞ্জল অনুবাদে",
                  "প্রামাণ্য তথ্যসূত্রসহ",
                ]}
                delayBetweenWords={2800}
              />
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            কুরআনের প্রতিটি শব্দের ব্যাকরণগত ব্যুৎপত্তি, শাব্দিক ও ভাবানুবাদ একই পাতায়।
          </p>

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
                <span>কুরআন</span>
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
                <span>অভিধান</span>
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
                <span>আর্টিকেল</span>
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
                <span>সেটিংস</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* নিচের সেকশনের সাথে গ্র্যাডিয়েন্ট জয়েন্ট */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-b from-transparent via-[var(--background)]/70 to-[var(--background)]" />
      </section>

      {/* ২. সুরার তালিকা ও ফিল্টার */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground">
              সুরাসমূহ <span className="text-muted-foreground">({localNumber(114, "bn")})</span>
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
                  placeholder="সুরা খুঁজুন... / আয়াত খুঁজুন..."
                  className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  aria-label="সুরা বা আয়াত খুঁজুন"
                  className="rounded-lg bg-[#2A6F97] hover:bg-[#1f5575] text-white px-3 py-1 text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  যান
                </button>
              </form>
              <p className="text-xs leading-normal text-muted-foreground px-1 font-medium">
                💡 সুরা খুঁজতে নাম বা নম্বর (৩৩ বা 33) লিখুন। আয়াত খুঁজতে ৩৩ঃ৪০ বা 33:40 লিখে
                ইন্টার চাপুন।
              </p>
            </div>
          </div>

          {chapters.isLoading ? (
            <p className="mt-8 text-sm text-muted-foreground">লোড হচ্ছে...</p>
          ) : (
            <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c: any) => {
                const meta = surahMetaMap.get(c.id);
                const nameBn = meta?.name_bn || c.name_simple;
                const nameArabic = meta?.name_arabic || c.name_arabic;
                const meaningBn = meta?.meaning_bn || c.translated_name?.name;
                const versesCount = meta?.total_verses || c.verses_count;
                const targetAyah =
                  c.targetAyah ||
                  (searchAyahTarget && searchAyahTarget.surah === c.id
                    ? searchAyahTarget.ayah
                    : undefined);

                return (
                  <Link
                    key={c.id}
                    to="/surah/$id"
                    params={{ id: String(c.id) }}
                    search={targetAyah ? { ayah: targetAyah } : undefined}
                    className="group relative flex items-center justify-between gap-3.5 rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-[#ede1ca] dark:hover:bg-accent/70 hover:shadow-md cursor-pointer overflow-hidden"
                  >
                    {/* বাম পাশের ডায়মন্ড/রোটেটেড স্কয়ার নম্বর ব্যাজ */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative flex size-10 shrink-0 items-center justify-center">
                        <div className="absolute inset-0 rotate-45 rounded-lg border border-border/90 bg-muted/90 transition-all duration-300 group-hover:rotate-90 group-hover:border-primary group-hover:bg-primary/10 group-hover:scale-105" />
                        <span className="relative z-10 font-bold text-xs sm:text-sm text-foreground/90 font-mono">
                          {localNumber(c.id, "bn")}
                        </span>
                      </div>

                      {/* সুরার নাম ও অর্থ */}
                      <div className="min-w-0 flex-1 leading-tight">
                        <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {nameBn}
                          {targetAyah && (
                            <span className="ml-2 text-xs font-semibold text-primary">
                              ({localNumber(targetAyah, "bn")} নং আয়াত)
                            </span>
                          )}
                        </h3>
                        <p className="truncate text-xs text-muted-foreground mt-1 font-medium">
                          {meaningBn || `${localNumber(versesCount, "bn")} আয়াত`}
                        </p>
                      </div>
                    </div>

                    {/* ডান পাশের সুন্দর আরবি ক্যালিগ্রাফি ও আয়াত সংখ্যা */}
                    <div className="text-right shrink-0">
                      <span className="arabic text-xl font-medium text-foreground/90 group-hover:text-primary transition-colors block leading-none">
                        {nameArabic}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-1.5 block font-medium">
                        {localNumber(versesCount, "bn")} আয়াত
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ৩. বিষয়ভিত্তিক কুরআন ও গবেষণা অন্বেষা (Thematic & Scientific Quran Explorer) */}
      <section className="border-t border-border bg-gradient-to-b from-card/60 to-background py-14">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md mb-2">
                <Sparkles className="size-3.5 text-amber-500" />
                ভাবার্থ ও বিষয়ভিত্তিক অন্বেষা
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                কুরআনের বিষয়ভিত্তিক জ্ঞানভাণ্ডার
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                বিজ্ঞান, সৃষ্টিতত্ত্ব, পারিবারিক অধিকার, অর্থনীতি, আত্মশুদ্ধি ও নবীদের জীবনী
                সম্পর্কিত আয়াতসমূহ সরাসরি অনুসন্ধান করুন।
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenSearchWith("")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2A6F97] hover:bg-[#1f5575] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Search className="size-3.5" />
              <span>সকল বিষয় ও আর্টিকেল সার্চ</span>
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
                      {topic.category_bn}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {topic.references.length}টি রেফারেন্স
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {topic.title_bn}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {topic.description_bn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-primary">
                  <span>আয়াতসমূহ ও তাফসির দেখুন</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ৪. আর্টিকেল সেকশন */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground">সাম্প্রতিক আর্টিকেল</h2>
            <Link
              to="/articles"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-semibold"
            >
              আর্টিকেল <ArrowRight className="size-4" />
            </Link>
          </div>
          {articles.data && articles.data.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {articles.data.map((a: any) => {
                const title = a.title_bn || a.title_en;
                const rawBody =
                  a.content_bn || a.body_bn || a.content_en || a.body_en || a.body || "";
                const excerpt = getCleanExcerpt(a.excerpt_bn, rawBody);

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
                      <h3 className="text-base font-semibold text-foreground">{title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                        {excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground font-medium">
              কোনো আর্টিকেল পাওয়া যায়নি।
            </p>
          )}
        </div>
      </section>

      {/* ৫. নিউজলেটার */}
      <section className="mx-auto w-full max-w-3xl px-4 py-16">
        <div className="card-soft p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            আমাদের নিউজলেটার সাবস্ক্রাইব করুন
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground font-medium">
            কুরআনের গভীর তাদাব্বুর ও নতুন গবেষণামূলক আর্টিকেল সরাসরি আপনার ইনবক্সে পান।
          </p>
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
