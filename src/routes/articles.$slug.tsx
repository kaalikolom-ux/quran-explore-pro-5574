import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  User, 
  Layers, 
  Tag as TagIcon, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  BookOpen,
  Lock,
  LogIn,
  ShieldAlert,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { useCategoryAccess } from "@/lib/accessControl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentsSection } from "@/components/CommentsSection";
import { SparkleCtaNotice } from "@/components/SparkleCtaNotice";
import { formatArticleContent } from "@/lib/contentFormatter";
import { STATIC_ARTICLES } from "@/lib/staticArticlesData";
import { STATIC_ARTICLES_META } from "@/lib/staticArticlesMeta";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => {
    let cleanSlug = params.slug;
    try {
      cleanSlug = decodeURIComponent(params.slug);
    } catch {}

    const meta = STATIC_ARTICLES_META.find(
      (a) => a.slug === params.slug || a.slug === cleanSlug || a.id === params.slug || a.id === cleanSlug
    );

    const pageTitle = meta?.title_bn
      ? `${meta.title_bn} — কুরআন অন্বেষা`
      : "আর্টিকেল — কুরআন অন্বেষা | Quran Explorer";
    const pageDesc = meta?.excerpt_bn || "পবিত্র কুরআনের গভীর গবেষণা ও সমসাময়িক প্রবন্ধ।";

    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: pageDesc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://wooniche.com/articles/${params.slug}` },
        { property: "og:site_name", content: "কুরআন অন্বেষা — Quran Explorer" },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: pageDesc },
        { property: "og:image", content: meta?.cover_image_url || "https://wooniche.com/og-image.jpg" },
        { property: "og:image:secure_url", content: meta?.cover_image_url || "https://wooniche.com/og-image.jpg" },
        { property: "og:image:type", content: "image/jpeg" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: pageTitle },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: pageDesc },
        { name: "twitter:image", content: meta?.cover_image_url || "https://wooniche.com/og-image.jpg" },
      ],
      links: [
        { rel: "canonical", href: `https://wooniche.com/articles/${params.slug}` },
      ],
    };
  },
  component: SingleArticlePage,
});

function SingleArticlePage() {
  const { slug } = Route.useParams();
  const { lang } = usePrefs();
  const { isLoggedIn, canAccessCategory, isLoading: accessLoading } = useCategoryAccess();
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // স্ট্যাটিক আর্টিকেলের তাৎক্ষণিক সমাধান (0ms লোড - প্রথম ৬-৭ ইঞ্চি সাথে সাথে রেন্ডার)
  const initialStaticArticle = useMemo(() => {
    let cleanSlug = slug;
    try {
      cleanSlug = decodeURIComponent(slug);
    } catch {}

    return (
      STATIC_ARTICLES.find(
        (a) => a.slug === slug || a.slug === cleanSlug || a.id === slug || a.id === cleanSlug
      ) || undefined
    );
  }, [slug]);

  // ১. সিঙ্গেল আর্টিকেল বিস্তারিত ফেচ (১০০% নিরাপদ ও নির্ভরযোগ্য কুয়েরি)
  const { data: article, isLoading } = useQuery({
    queryKey: ["article-single-detail", slug],
    initialData: initialStaticArticle,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      // প্রথমে স্ট্যাটিক রেজিস্ট্রি চেক
      let cleanSlug = slug;
      try {
        cleanSlug = decodeURIComponent(slug);
      } catch {}

      const staticMatch = STATIC_ARTICLES.find(
        (a) => a.slug === slug || a.slug === cleanSlug || a.id === slug || a.id === cleanSlug
      );
      if (staticMatch) {
        return staticMatch;
      }

      // ডাটাবেজ থেকে slug দিয়ে ফেচ
      let { data: art, error: artErr } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      // যদি slug সরাসরি না মিলে, তাহলে decoded slug বা id হিসেবে খোঁজা
      if (!art) {
        const { data: fallbackArt } = await supabase
          .from("articles")
          .select("*")
          .or(`slug.eq.${cleanSlug},id.eq.${cleanSlug}`)
          .maybeSingle();
        art = fallbackArt;
      }

      if (!art) {
        return null;
      }

      // লেখক ফেচ (যদি author_id থাকে)
      let author = null;
      if (art.author_id) {
        const { data: authData } = await supabase
          .from("authors")
          .select("id, name_bn, name_en, image_url, bio_bn, bio_en")
          .eq("id", art.author_id)
          .maybeSingle();
        author = authData;
      }

      // ক্যাটাগরি ফেচ (যদি category_id থাকে)
      let category = null;
      if (art.category_id) {
        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .eq("id", art.category_id)
          .maybeSingle();
        category = catData;
      }

      return {
        ...art,
        author,
        category,
      };
    },
  });

  // ২. পূর্ববর্তী ও পরবর্তী আর্টিকেল ফেচ (Next & Prev Article Navigation - ১০০% নির্ভরযোগ্য)
  const { data: navArticles } = useQuery({
    queryKey: ["article-prev-next-nav", article?.id, slug],
    enabled: Boolean(article?.id),
    queryFn: async () => {
      if (!article) return { prev: null, next: null };

      // সব অ্যাক্টিভ প্রকাশিত আর্টিকেল ফেচ করা
      const { data: dbArticles, error } = await supabase
        .from("articles")
        .select("id, slug, title_bn, title_en, created_at, published_at")
        .eq("published", true)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      const rawDb = Array.isArray(dbArticles) ? dbArticles : [];
      const allArticles = [
        ...STATIC_ARTICLES.filter(
          (sa) => !rawDb.some((da) => da.slug === sa.slug || da.id === sa.id)
        ).map((sa) => ({
          id: sa.id,
          slug: sa.slug,
          title_bn: sa.title_bn,
          title_en: sa.title_en,
          created_at: sa.created_at,
          published_at: sa.published_at,
        })),
        ...rawDb,
      ];

      if (allArticles.length <= 1) {
        return { prev: null, next: null };
      }

      // বর্তমান আর্টিকেলের পজিশন বের করা
      const currentIndex = allArticles.findIndex(
        (a) => a.id === article.id || a.slug === slug
      );

      if (currentIndex === -1) {
        return { prev: null, next: null };
      }

      // যেহেতু created_at desc অনুযায়ী সাজানো:
      // currentIndex - 1 হলো নতুন (পরবর্তী / Next) পোস্ট
      // currentIndex + 1 হলো পুরানো (পূর্ববর্তী / Prev) পোস্ট
      const next = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
      const prev = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

      return {
        prev: prev || null,
        next: next || null,
      };
    },
  });

  const prevArticle = navArticles?.prev;
  const nextArticle = navArticles?.next;

  // শেয়ার হ্যান্ডলার
  const handleShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success(lang === "en" ? "Article link copied to clipboard!" : "আর্টিকেলের লিংক ক্লিপবোর্ডে কপি হয়েছে!");
    setTimeout(() => setCopied(false), 2500);
  };

  // বুকমার্ক টগল
  const toggleBookmark = () => {
    if (!isLoggedIn) {
      toast.error(lang === "en" ? "Please log in to save bookmarks" : "বুকমার্ক সংরক্ষণের জন্য লগইন করুন");
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked 
        ? (lang === "en" ? "Removed from bookmarks" : "বুকমার্ক থেকে সরানো হয়েছে")
        : (lang === "en" ? "Saved to bookmarks" : "বুকমার্কে সংরক্ষণ করা হয়েছে")
    );
  };

  if (isLoading || accessLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 animate-pulse space-y-6">
        <div className="h-6 w-28 bg-muted/60 rounded-md" />
        <div className="space-y-3">
          <div className="h-9 sm:h-12 w-4/5 bg-muted/80 rounded-xl" />
          <div className="h-5 w-3/5 bg-muted/50 rounded-md" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="size-10 rounded-full bg-muted/70" />
          <div className="space-y-1">
            <div className="h-4 w-24 bg-muted/70 rounded" />
            <div className="h-3 w-16 bg-muted/40 rounded" />
          </div>
        </div>
        <div className="h-48 rounded-3xl bg-muted/25 border border-border/60 p-6 space-y-3">
          <div className="h-4 w-full bg-muted/50 rounded" />
          <div className="h-4 w-5/6 bg-muted/40 rounded" />
          <div className="h-4 w-4/6 bg-muted/30 rounded" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
        <BookOpen className="mx-auto size-12 text-muted-foreground/40" />
        <h2 className="text-lg font-bold text-foreground">আর্টিকেলটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-xs text-muted-foreground">পোস্টটি মুছে ফেলা হয়ে থাকতে পারে অথবা লিংকটি ভুল।</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/articles">
            <ArrowLeft className="size-3.5 mr-1.5" /> সকল আর্টিকেল
          </Link>
        </Button>
      </div>
    );
  }

  // রেস্ট্রিকটেড ক্যাটাগরি পারমিশন চেক
  const isCategoryRestricted = Boolean(article.category?.is_restricted);
  const hasCategoryAccess = canAccessCategory(article.category);

  // যদি ক্যাটাগরিটি রেস্ট্রিকটেড হয় এবং ইউজারের অ্যাক্সেস না থাকে -> সম্পূর্ণ হিডেন গার্ড
  if (isCategoryRestricted && !hasCategoryAccess) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
        <div className="mx-auto size-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Lock className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">অ্যাক্সেস সংরক্ষিত / রেস্ট্রিকটেড</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          এই ক্যাটাগরির আর্টিকেলটি আপনার অ্যাকাউন্টের জন্য উন্মুক্ত নয়। আপনার প্রয়োজনীয় অনুমতি বা সহায়তার জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to="/articles">
              <ArrowLeft className="size-3.5 mr-1.5" /> সকল আর্টিকেল
            </Link>
          </Button>
          {!isLoggedIn && (
            <Button asChild size="sm">
              <Link to="/auth" search={{ redirect: `/articles/${slug}` }}>
                <LogIn className="size-3.5 mr-1.5" /> লগইন করুন
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  const title = lang === "en" && article.title_en ? article.title_en : article.title_bn;
  const excerpt = lang === "en" && article.excerpt_en ? article.excerpt_en : article.excerpt_bn;
  const content = lang === "en" && article.content_en ? article.content_en : article.content_bn;
  const author = article.author;
  const authorName = author
    ? lang === "en" && author.name_en ? author.name_en : author.name_bn
    : null;

  const category = article.category;
  const categoryName = category
    ? lang === "en" && category.name_en ? category.name_en : category.name_bn
    : null;

  const tagsList: string[] = Array.isArray(article.tags) ? article.tags : [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      {/* ব্যাক বাটন ও ক্যাটাগরি */}
      <div className="mb-6 flex items-center justify-between gap-3 text-xs">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-xs">
          <Link to="/articles">
            <ArrowLeft className="size-3.5 mr-1" /> সকল আর্টিকেল
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {category && (
            <Link
              to="/articles"
              search={{ category: category.slug }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-md"
            >
              <Layers className="size-3" />
              <span>{categoryName}</span>
              {isCategoryRestricted && (
                <Lock className="size-3 text-amber-500 ml-0.5" title="রেস্ট্রিকটেড ক্যাটাগরি" />
              )}
            </Link>
          )}
        </div>
      </div>

      {/* আর্টিকেল হেডার */}
      <header className="mb-8 space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground font-serif leading-tight">
          {title}
        </h1>

        {/* লেখক, তারিখ ও অ্যাকশন বার */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4">
            {author && (
              <Link
                to="/authors/$id"
                params={{ id: author.id }}
                className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary transition-colors cursor-pointer group"
                title={`${authorName} এর সকল লেখা দেখুন`}
              >
                {author.image_url ? (
                  <img
                    src={author.image_url}
                    alt={authorName || ""}
                    className="size-5 rounded-full object-cover border border-border"
                  />
                ) : (
                  <User className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
                )}
                <span className="underline decoration-muted-foreground/40 underline-offset-4 group-hover:decoration-primary">
                  {authorName}
                </span>
              </Link>
            )}

            {article.published_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" />
                {new Date(article.published_at).toLocaleDateString(lang === "en" ? "en-US" : "bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleBookmark}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary transition-colors cursor-pointer"
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="size-3.5 text-primary fill-primary" />
                  <span className="text-primary font-semibold">{lang === "en" ? "Saved" : "সংরক্ষিত"}</span>
                </>
              ) : (
                <>
                  <Bookmark className="size-3.5" />
                  <span>{lang === "en" ? "Save" : "বুকমার্ক"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-primary" />
                  <span className="text-primary font-semibold">{lang === "en" ? "Copied" : "কপি হয়েছে"}</span>
                </>
              ) : (
                <>
                  <Share2 className="size-3.5" />
                  <span>{lang === "en" ? "Share" : "শেয়ার"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* কভার ছবি */}
      {article.cover_image_url && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-border/70 shadow-sm">
          <img
            src={article.cover_image_url}
            alt={title}
            className="w-full h-auto max-h-[440px] object-cover"
          />
        </div>
      )}

      {/* মূল লেখার বিষয়বস্তু */}
      <div
        className="prose prose-base sm:prose-lg dark:prose-invert max-w-none leading-relaxed font-serif break-words mb-10"
        dangerouslySetInnerHTML={{ __html: formatArticleContent(content || "") }}
      />

      {/* ট্যাগসমূহ */}
      {tagsList.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center gap-2">
          <TagIcon className="size-3.5 text-muted-foreground mr-1" />
          {tagsList.map((tag: string, index: number) => {
            const cleanTag = tag.trim().replace(/^#/, "");
            return (
              <Link
                key={index}
                to="/articles"
                search={{ tag: cleanTag } as any}
                className="inline-block transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <Badge
                  variant="secondary"
                  className="text-[11px] font-normal hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/30"
                >
                  #{cleanTag}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}

      {/* লেখক পরিচিতি বক্স (যদি থাকে) */}
      {author && (
        <div className="mt-10 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {author.image_url ? (
            <img
              src={author.image_url}
              alt={authorName || ""}
              className="size-16 rounded-full object-cover border border-border shrink-0 shadow-sm"
            />
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
              <User className="size-8" />
            </div>
          )}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-between">
              <h2 className="text-sm sm:text-base font-bold text-foreground font-serif">
                {authorName}
              </h2>
              <Link
                to="/authors/$id"
                params={{ id: author.id }}
                className="hidden sm:inline-block text-xs font-semibold text-primary hover:underline"
              >
                লেখকের সকল লেখা →
              </Link>
            </div>
            {author.bio_bn && (
              <p className="text-xs text-muted-foreground leading-relaxed font-serif">
                {lang === "en" && author.bio_en ? author.bio_en : author.bio_bn}
              </p>
            )}
            <div className="pt-1 sm:hidden">
              <Link
                to="/authors/$id"
                params={{ id: author.id }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                লেখকের সকল লেখা →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* আগের ও পরের পোস্ট নেভিগেশন (Prev / Next Article Navigation Cards) */}
      {(prevArticle || nextArticle) && (
        <nav
          aria-label="আর্টিকেল নেভিগেশন"
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/70"
        >
          {/* Previous Article Card */}
          {prevArticle ? (
            <Link
              to="/articles/$slug"
              params={{ slug: prevArticle.slug }}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:bg-card/90 hover:border-primary/50 transition-all duration-200 shadow-xs hover:shadow-md text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                <span>{lang === "en" ? "Previous Article" : "পূর্ববর্তী আর্টিকেল"}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors font-serif line-clamp-2 leading-snug">
                {lang === "en" && prevArticle.title_en ? prevArticle.title_en : prevArticle.title_bn}
              </h3>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {/* Next Article Card */}
          {nextArticle ? (
            <Link
              to="/articles/$slug"
              params={{ slug: nextArticle.slug }}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:bg-card/90 hover:border-primary/50 transition-all duration-200 shadow-xs hover:shadow-md text-left sm:text-right cursor-pointer"
            >
              <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-primary mb-2">
                <span>{lang === "en" ? "Next Article" : "পরবর্তী আর্টিকেল"}</span>
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors font-serif line-clamp-2 leading-snug">
                {lang === "en" && nextArticle.title_en ? nextArticle.title_en : nextArticle.title_bn}
              </h3>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </nav>
      )}

      {/* মন্তব্য সেকশন */}
      <div className="mt-12 pt-8 border-t border-border/60">
        <CommentsSection articleId={article.id} />
      </div>
    </article>
  );
}
