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
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { useCategoryAccess } from "@/lib/accessControl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentsSection } from "@/components/CommentsSection";
import { SparkleCtaNotice } from "@/components/SparkleCtaNotice";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => {
    return {
      meta: [
        { title: "আর্টিকেল — কুরআন অন্বেষা" },
        { name: "description", content: "কুরআনের গভীর গবেষণা ও সমসাময়িক প্রবন্ধ।" },
        { property: "og:type", content: "article" },
      ],
      links: [
        { rel: "canonical", href: `https://qurananwesha.com/articles/${params.slug}` }
      ]
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

  // ১. সিঙ্গেল আর্টিকেল বিস্তারিত ফেচ (১০০% নিরাপদ ও নির্ভরযোগ্য কুয়েরি)
  const { data: article, isLoading } = useQuery({
    queryKey: ["article-single-detail", slug],
    queryFn: async () => {
      // প্রথমে আর্টিকেল ফেচ
      const { data: art, error: artErr } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (artErr || !art) {
        console.warn("Article fetch notice:", artErr?.message);
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
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-xs text-muted-foreground">
        আর্টিকেল লোড হচ্ছে...
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
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />

      {/* ট্যাগসমূহ */}
      {tagsList.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center gap-2">
          <TagIcon className="size-3.5 text-muted-foreground mr-1" />
          {tagsList.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-[11px] font-normal">
              #{tag}
            </Badge>
          ))}
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

      {/* মন্তব্য সেকশন */}
      <div className="mt-12 pt-8 border-t border-border/60">
        <CommentsSection articleId={article.id} />
      </div>
    </article>
  );
}
