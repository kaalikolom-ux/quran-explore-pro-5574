import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Newspaper, Search, Sparkles } from "lucide-react";

import { chaptersQuery, localNumber } from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/NewsletterForm";
import { DisplayToggles } from "@/components/DisplayToggles";
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
      { property: "og:title", content: "কুরআন অন্বেষা — শব্দে শব্দে অর্থসহ কুরআন" },
      {
        property: "og:description",
        content: "শব্দে শব্দে অর্থ, প্রচলিত ও বিজ্ঞানভিত্তিক অনুবাদ একই পাতায়।",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(chaptersQuery("bn"));
  },
  component: HomePage,
});

// বাংলা ডিজিটকে ইংরেজি ডিজিটে রূপান্তর করার হেল্পার ফাংশন
function bnToEnDigits(str: string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.replace(/[০-৯]/g, (w) => String(bnDigits.indexOf(w)));
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
        .select("id, slug, title_bn, title_en, excerpt_bn, excerpt_en, published_at, cover_image_url")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const normalizedTerm = useMemo(() => {
    return bnToEnDigits(term.trim().toLowerCase());
  }, [term]);

  const filtered = useMemo(() => {
    const list = chapters.data ?? [];
    if (!normalizedTerm) return list;

    // যদি সুরার নম্বর দেয়া হয়
    const isNum = /^\d+$/.test(normalizedTerm);
    if (isNum) {
      return list.filter((c) => String(c.id) === normalizedTerm);
    }

    // যদি আয়াত সার্চ ফরম্যাট (যেমন 33:40) হয়, তবে পুরো লিস্ট রেখে প্রথম সুরা দেখাবে
    if (/^\d+[:ঃ/-]\d+$/.test(normalizedTerm)) {
      const [s] = normalizedTerm.split(/[:ঃ/-]/);
      return list.filter((c) => String(c.id) === s);
    }

    // টেক্সট সার্চ
    const rawQ = term.trim().toLowerCase();
    return list.filter(
      (c) =>
        c.name_simple.toLowerCase().includes(rawQ) ||
        c.translated_name.name.toLowerCase().includes(rawQ) ||
        String(c.id) === normalizedTerm
    );
  }, [chapters.data, normalizedTerm, term]);

  // সার্চ সাবমিট বা ইন্টার চাপলে আয়াতের পাতায় নিয়ে যাবে
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedTerm) return;

    // আয়াত সার্চ ফরম্যাট চেক: যেমন 33:40, ৩৩ঃ৪০, 33/40
    const match = normalizedTerm.match(/^(\d+)[:ঃ/-](\d+)$/);
    if (match) {
      const surahNum = match[1];
      const ayahNum = match[2];
      void navigate({
        to: `/surah/$id`,
        params: { id: surahNum },
        hash: `ayah-${ayahNum}`,
      });
      return;
    }

    // শুধু সুরার নম্বর হলে সরাসরি সেই সুরায় নিয়ে যাবে
    if (/^\d+$/.test(normalizedTerm)) {
      const sNum = Number(normalizedTerm);
      if (sNum >= 1 && sNum <= 114) {
        void navigate({
          to: `/surah/$id`,
          params: { id: String(sNum) },
        });
      }
    }
  };

  return (
    <div>
      <section className="hero-surface relative overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1 text-xs font-medium tracking-wide">
            <Sparkles className="size-3.5" /> {t("tagline")}
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            {lang === "bn" ? (
              <>
                পবিত্র কুরআন — বুঝে পড়ুন <br />
                <span className="inline-block mt-1 font-semibold">
                  <Typewriter
                    words={[
                      "শব্দে শব্দে অর্থসহ",
                      "বিজ্ঞানভিত্তিক ব্যাখ্যায়",
                      "সহজ বাংলা অনুবাদে",
                      "প্রামাণ্য তথ্যসূত্রসহ",
                    ]}
                    typingSpeed={90}
                    deletingSpeed={50}
                    delayBetweenWords={1500}
                  />
                </span>
              </>
            ) : (
              <>
                The Holy Quran — understand it <br />
                <span className="inline-block mt-1 font-semibold">
                  <Typewriter
                    words={[
                      "word by word",
                      "with scientific context",
                      "in clear translation",
                      "with authentic notes",
                    ]}
                    typingSpeed={80}
                    deletingSpeed={40}
                    delayBetweenWords={1500}
                  />
                </span>
              </>
            )}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80">{t("heroSub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="bg-white/10 text-white shadow-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:shadow-md hover:scale-[1.02]"
            >
              <Link to="/surah/$id" params={{ id: "1" }}>
                <BookOpen className="size-4" /> {t("readQuran")}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="bg-white/10 text-white shadow-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:shadow-md hover:scale-[1.02]"
            >
              <Link to="/articles">
                <Newspaper className="size-4" /> {t("articles")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <aside className="order-first space-y-4 lg:order-last lg:sticky lg:top-24 lg:self-start">
            <DisplayToggles />
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold">
                {t("surahs")} <span className="text-muted-foreground">({localNumber(114, lang)})</span>
              </h2>

              {/* সার্চ ফর্ম ও ট্রান্সপারেন্ট হিন্টস */}
              <div className="w-full max-w-sm space-y-1.5">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder={
                      lang === "bn"
                        ? "সুরা খুঁজুন... / আয়াত খুঁজুন..."
                        : "Search Surah... / Ayah..."
                    }
                    className="pl-9 pr-3"
                  />
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
                {filtered.map((c) => (
                  <Link
                    key={c.id}
                    to="/surah/$id"
                    params={{ id: String(c.id) }}
                    className="card-soft group flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                      {localNumber(c.id, lang)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{c.name_simple}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {c.translated_name.name} · {localNumber(c.verses_count, lang)} {t("verses")}
                      </span>
                    </span>
                    <span className="arabic text-lg text-primary">{c.name_arabic}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">{t("latestArticles")}</h2>
            <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-primary">
              {t("articles")} <ArrowRight className="size-4" />
            </Link>
          </div>
          {articles.data && articles.data.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {articles.data.map((a) => (
                <Link
                  key={a.id}
                  to="/articles/$slug"
                  params={{ slug: a.slug }}
                  className="card-soft flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                >
                  {a.cover_image_url && (
                    <img
                      src={a.cover_image_url}
                      alt={a.title_bn}
                      loading="lazy"
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-base font-semibold">
                      {lang === "en" && a.title_en ? a.title_en : a.title_bn}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {lang === "en" && a.excerpt_en ? a.excerpt_en : a.excerpt_bn}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">{t("noArticles")}</p>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-16">
        <div className="card-soft p-8 text-center">
          <h2 className="text-xl font-semibold">{t("newsletter")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("newsletterSub")}</p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}