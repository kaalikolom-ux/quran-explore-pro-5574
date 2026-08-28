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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentsSection } from "@/components/CommentsSection";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => {
    return {
      meta: [
        { title: `আর্টিকেল — কুরআন অন্বেষা` },
        { name: "description", content: "কুরআনের গভীর গবেষণা ও সমসাময়িক প্রবন্ধ।" },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `https://qurananwesha.com/articles/${params.slug}` }],
    };
  },
  component: SingleArticlePage,
});

function SingleArticlePage() {
  const { slug } = Route.useParams();
  const { lang, dark } = usePrefs();
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // ১. সিঙ্গেল আর্টিকেল বিস্তারিত ফেচ (লেখক ও ক্যাটাগরির রিলেশনসহ)
  const { data: article, isLoading } = useQuery({
    queryKey: ["article-single-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(
          "*, author:authors(id, name_bn, name_en, image_url, bio_bn, bio_en), category:categories(id, name_bn, name_en, slug)",
        )
        .eq("slug", slug)
        .maybeSingle();

      if (error) return null;
      return data;
    },
  });

  // শেয়ার হ্যান্ডলার
  const handleShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success(
      lang === "en"
        ? "Article link copied to clipboard!"
        : "আর্টিকেলের লিংক ক্লিপবোর্ডে কপি হয়েছে!",
    );
    setTimeout(() => setCopied(false), 2500);
  };

  // বুকমার্ক টগল
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked
        ? lang === "en"
          ? "Removed from bookmarks"
          : "বুকমার্ক থেকে সরানো হয়েছে"
        : lang === "en"
          ? "Saved to bookmarks"
          : "বুকমার্কে সংরক্ষণ করা হয়েছে",
    );
  };

  if (isLoading) {
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
        <p className="text-xs text-muted-foreground">
          পোস্টটি মুছে ফেলা হয়ে থাকতে পারে অথবা লিংকটি ভুল।
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/articles">
            <ArrowLeft className="size-3.5 mr-1.5" /> সকল আর্টিকেল
          </Link>
        </Button>
      </div>
    );
  }

  const title = lang === "en" && article.title_en ? article.title_en : article.title_bn;
  const content = lang === "en" && article.content_en ? article.content_en : article.content_bn;
  const author = article.author;
  const authorName = author
    ? lang === "en" && author.name_en
      ? author.name_en
      : author.name_bn
    : null;

  const category = article.category;
  const categoryName = category
    ? lang === "en" && category.name_en
      ? category.name_en
      : category.name_bn
    : null;

  const tagsList: string[] = Array.isArray(article.tags) ? article.tags : [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      {/* টপ নেভিগেশন ও একশন বাটন */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link to="/articles">
            <ArrowLeft className="size-3.5 mr-1.5" />{" "}
            {lang === "en" ? "Back to Articles" : "সকল আর্টিকেল"}
          </Link>
        </Button>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleBookmark}
            className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
            title="বুকমার্ক করুন"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="size-3.5 text-emerald-500" />
                <span className="hidden sm:inline">সংরক্ষিত</span>
              </>
            ) : (
              <>
                <Bookmark className="size-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">বুকমার্ক</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
            title="লিংক কপি করুন"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="hidden sm:inline">কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">শেয়ার</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* মেটা হেডার ও ক্যাটাগরি ব্যাজ (ক্লিকেবল ও হোভার ইফেক্টসহ) */}
      <header className="space-y-4 mb-8">
        {category && (
          <div className="flex items-center gap-2">
            <Link
              to="/articles"
              search={{ category: category.id }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2A6F97]/10 dark:bg-[#58b4e8]/15 border border-[#2A6F97]/30 dark:border-[#58b4e8]/40 px-3 py-1 text-xs font-bold text-[#1c5576] dark:text-[#58b4e8] transition-all hover:bg-[#2A6F97] hover:text-white dark:hover:bg-[#58b4e8] dark:hover:text-slate-950 cursor-pointer shadow-xs group"
              title={`${categoryName} ক্যাটাগরির সকল লেখা পড়ুন`}
            >
              <Layers className="size-3.5 transition-transform group-hover:scale-110" />
              <span>{categoryName}</span>
            </Link>
          </div>
        )}

        <h1 className="text-2xl sm:text-4xl font-bold font-serif leading-tight text-foreground tracking-tight">
          {title}
        </h1>

        {/* লেখক ও প্রকাশের তারিখ ইনফো বার */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-b border-border/60 pb-4">
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
              {new Date(article.published_at).toLocaleDateString(
                lang === "en" ? "en-US" : "bn-BD",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </span>
          )}
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

      {/* পোস্টের নিচের ট্যাগসমূহ (ক্লিকেবল ট্যাগ ব্যাজ) */}
      {tagsList.length > 0 && (
        <div className="my-8 pt-6 border-t border-border/60">
          <div className="flex items-center gap-2 mb-3">
            <TagIcon className="size-4 text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              ট্যাগসমূহ:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tagsList.map((tag, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="px-3 py-1 text-xs font-medium bg-muted/60 hover:bg-primary hover:text-white transition-all cursor-pointer select-none rounded-lg border border-border"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* কমেন্ট ও ফিডব্যাক সেকশন */}
      <CommentsSection articleId={article.id} />
    </article>
  );
}
