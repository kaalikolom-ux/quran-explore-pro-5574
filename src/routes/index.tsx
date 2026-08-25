import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, FileText, Search, Settings, Sparkles } from "lucide-react";

import { chaptersQuery, localNumber } from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Typewriter } from "@/components/Typewriter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "কুরআন অন্বেষা — শব্দে শব্দে অর্থসহ কুরআন ও আর্টিকেল" },
      {
        name: "description",
        content:
          "আরবি, শব্দে শব্দে অর্থ, বাংলা (তাইসিরুল কুরআন) ও ইংরেজি (Pickthall) অনুবাদ এবং বিজ্ঞানভিত্তিক অনুবাদসহ কুরআন পড়ুন। বুকমার্ক ও আর্টিকেল সুবিধা।",
      },
      // Open Graph / Facebook / WhatsApp
      { property: "og:type", content: "website" },
      { property: "og:title", content: "কুরআন অন্বেষা — শব্দে শব্দে অর্থসহ কুরআন" },
      {
        property: "og:description",
        content: "শব্দে শব্দে অর্থ, প্রচলিত ও বিজ্ঞানভিত্তিক অনুবাদ একই পাতায়।",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "কুরআন অন্বেষা — শব্দে শব্দে অর্থসহ কুরআন" },
      {
        name: "twitter:description",
        content: "শব্দে শব্দে অর্থ, প্রচলিত ও বিজ্ঞানভিত্তিক অনুবাদ একই পাতায়।",
      },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(chaptersQuery("bn"));
  },
  component: HomePage,
});

function bnToEnDigits(str: string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.replace(/[০-৯]/g, (w) => String(bnDigits.indexOf(w)));
}

function getCleanExcerpt(excerpt?: string | null, body?: string | null, maxLength = 130): string {
  if (excerpt && excerpt.trim().length > 0) {
    return excerpt.trim();
  }
  if (!body) return "বিস্তারিত প্রবন্ধটি পড়তে ক্লিক করুন...";
  const clean = body.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}...` : clean;
}

function HomePage() {
  const { t, lang } = usePrefs();
  const [term, setTerm] = useState("");
  const chapters = useQuery(chaptersQuery(lang));
  const navigate = useNavigate();

  const articles = useQuery({
    queryKey: ["articles", "published", "home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
  });

  const normalizedTerm = useMemo(() => {
    return bnToEnDigits(term.trim().toLowerCase());
  }, [term]);

  const parsedAyahTarget = useMemo(() => {
    const match = normalizedTerm.match(/^(\d{1,3})[:ঃ\/\.\-](\d{1,3})$/);
    if (match) {
      return {
        surah: Number(match[1]),
        ayah: Number(match[2]),
      };
    }
    return null;
  }, [normalizedTerm]);

  const filtered = useMemo(() => {
    const list = chapters.data ?? [];
    if (!normalizedTerm) return list;

    if (parsedAyahTarget) {
      return list.filter((c) => c.id === parsedAyahTarget.surah);
    }

    const isNum = /^\d+$/.test(normalizedTerm);
    if (isNum) {
      return list.filter((c) => String(c.id) === normalizedTerm);
    }

    const rawQ = term.trim().toLowerCase();
    return list.filter(
      (c) =>
        c.name_simple.toLowerCase().includes(rawQ) ||
        c.translated_name.name.toLowerCase().includes(rawQ) ||
        String(c.id) === normalizedTerm
    );
  }, [chapters.data, normalizedTerm, term, parsedAyahTarget]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedTerm) return;

    if (parsedAyahTarget) {
      const { surah, ayah } = parsedAyahTarget;
      if (surah >= 1 && surah <= 114) {
        navigate({
          to: "/surah/$id",
          params: { id: String(surah) },
          search: { ayah: Number(ayah) },
        });
        return;
      }
    }

    if (/^\d+$/.test(normalizedTerm)) {
      const sNum = Number(normalizedTerm);
      if (sNum >= 1 && sNum <= 114) {
        navigate({
          to: "/surah/$id",
          params: { id: String(sNum) },
        });
        return;
      }
    }

    if (filtered.length > 0) {
      navigate({
        to: "/surah/$id",
        params: { id: String(filtered[0].id) },
      });
    }
  };

  return (
    <div>
      {/* হিরো সেকশন */}
      <section className="hero-surface relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden">
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-amber-500/10 blur-3xl" />
          
          <div className="relative right-[-5%] lg:right-[6%] flex items-center justify-center opacity-70 lg:opacity-90 scale-90 sm:scale-100 lg:scale-110">
            <div className="absolute h-[480px] w-[480px] rounded-full border border-white/5" />
            <div className="absolute h-[380px] w-[380px] rounded-full border border-dashed border-white/10" />
            <div className="absolute h-[290px] w-[290px] rounded-full border border-white/10" />

            <div className="relative flex items-center justify-center">
              <div className="absolute h-40 w-40 rounded-sm border border-amber-400/40 bg-amber-400/[0.03] shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-transform duration-700 hover:rotate-6" />
              <div className="absolute h-40 w-40 rotate-45 rounded-sm border border-amber-400/40 bg-amber-400/[0.03] shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-transform duration-700 hover:rotate-[51deg]" />
              <div className="relative z-10 h-6 w-6 rounded-full bg-amber-400/80 shadow-[0_0_25px_8px_rgba(251,191,36,0.4)]" />
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:py-24 md:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm shadow-xs">
            <Sparkles className="size-3.5 text-amber-400" /> {t("tagline")}
          </p>

          <div className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-bold leading-tight tracking-normal text-white sm:text-4xl md:text-5xl font-serif">
              <span>{lang === "bn" ? "পবিত্র কুরআন — বুঝে পড়ুন" : "The Holy Quran — understand it"}</span>
              
              {/* টাইপিং এনিমেশন: সরাসরি পারফেক্ট মার্জিনে ইন্টিগ্রেটেড */}
              <span className="block mt-1 text-xl font-semibold tracking-normal text-amber-300 sm:text-2xl md:text-3xl leading-snug font-serif">
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
                  typingSpeed={lang === "bn" ? 90 : 80}
                  deletingSpeed={lang === "bn" ? 50 : 40}
                  delayBetweenWords={1500}
                />
              </span>
            </h1>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{t("heroSub")}</p>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-[1.02]"
            >
              <Link to="/surah/$id" params={{ id: "1" }}>
                <BookOpen className="size-4 mr-2 text-amber-300" /> {t("readQuran")}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-[1.02]"
            >
              <Link to="/articles">
                <FileText className="size-4 mr-2 text-amber-300" /> {lang === "bn" ? "আর্টিকেল" : "Articles"}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/30 hover:scale-[1.02]"
            >
              <Link to="/settings">
                <Settings className="size-4 mr-2 text-amber-300" /> {lang === "bn" ? "সেটিংস" : "Settings"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* সুরা তালিকা */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground">
              {t("surahs")} <span className="text-muted-foreground">({localNumber(114, lang)})</span>
            </h2>

            <div className="w-full max-w-sm space-y-1.5">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center rounded-xl border border-border/80 bg-card/70 px-3 py-1.5 shadow-xs focus-within:border-foreground/40 transition-all"
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
                  className="rounded-lg bg-primary/15 hover:bg-primary/25 text-primary px-2.5 py-1 text-xs font-semibold transition-colors border border-primary/20 shrink-0 cursor-pointer"
                >
                  যান
                </button>
              </form>
              <p className="text-[11px] leading-tight text-muted-foreground/70 px-1">
                {lang === "bn"
                  ? "💡 সুরা খুঁজতে নাম বা নম্বর (৩৩ বা 33) লিখুন। আয়াত খুঁজতে ৩৩ঃ৪০ বা 33:40 লিখে ইন্টার চাপুন।"
                  : "💡 Search surah by name or no. (33). Search ayah like 33:40 and press Enter."}
              </p>
            </div>
          </div>

          {chapters.isLoading ? (
            <p className="mt-8 text-sm text-muted-foreground">{t("loading")}</p>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => {
                const targetAyah = parsedAyahTarget && parsedAyahTarget.surah === c.id ? parsedAyahTarget.ayah : undefined;

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
                          <span className="ml-2 text-xs font-semibold text-primary">
                            ({localNumber(targetAyah, lang)} নং আয়াত)
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
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

      {/* আর্টিকেল সেকশন */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground">{t("latestArticles")}</h2>
            <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
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
            <p className="mt-6 text-sm text-muted-foreground">{t("noArticles")}</p>
          )}
        </div>
      </section>

      {/* নিউজলেটার */}
      <section className="mx-auto w-full max-w-3xl px-4 py-16">
        <div className="card-soft p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">{t("newsletter")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("newsletterSub")}</p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}