import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FileText, EyeOff, User, X, Lock, LogIn, Sparkles } from "lucide-react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { useIsAdmin } from "@/lib/auth";
import { useCategoryAccess } from "@/lib/accessControl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const searchSchema = z.object({
  category: z.string().optional(),
  author: z.string().optional(),
});

export const Route = createFileRoute("/articles/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "আর্টিকেল — কুরআন অন্বেষা" },
      { name: "description", content: "কুরআনের গভীর তাদাব্বুর ও নতুন গবেষণামূলক আর্টিকেল সরাসরি আপনার ইনবক্সে পান।" },
      { property: "og:title", content: "আর্টিকেল — কুরআন অন্বেষা" },
      { property: "og:description", content: "কুরআনের গভীর তাদাব্বুর ও নতুন গবেষণামূলক আর্টিকেল।" },
    ],
  }),
  component: ArticlesIndexPage,
});

function getCleanExcerpt(excerpt?: string | null, body?: string | null, maxLength = 120): string {
  if (excerpt && excerpt.trim().length > 0) return excerpt.trim();
  if (!body) return "বিস্তারিত প্রবন্ধটি পড়তে ক্লিক করুন...";
  const clean = body.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}...` : clean;
}

function ArticlesIndexPage() {
  const { lang, t } = usePrefs();
  const { isAdmin } = useIsAdmin();
  const { canAccessCategory, isLoggedIn, isLoading: accessLoading } = useCategoryAccess();
  const searchParams = useSearch({ from: "/articles/" });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.category || null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(searchParams.author || null);
  const [showDraftsOnly, setShowDraftsOnly] = useState(false);

  useEffect(() => {
    if (searchParams.author) setSelectedAuthor(searchParams.author);
    if (searchParams.category) setSelectedCategory(searchParams.category);
  }, [searchParams.author, searchParams.category]);

  // সরাসরি ক্যাটাগরি ফেচ করা (যাতে মিসিং না হয়)
  const categoriesQuery = useQuery({
    queryKey: ["categories-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) return [];
      return data || [];
    },
  });

  // লেখক তালিকা ফেচ
  const authorsQuery = useQuery({
    queryKey: ["authors-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("id, name_bn, name_en");
      if (error) return [];
      return data || [];
    },
  });

  // আর্টিকেল ফেচ
  const query = useQuery({
    queryKey: ["articles", isAdmin],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("*, author:authors(id, name_bn, name_en), category:categories(id, name_bn, name_en, slug, is_restricted)")
        .order("created_at", { ascending: false });

      if (!isAdmin) {
        q = q.eq("published", true);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const allArticles = query.data || [];

  // ক্যাটাগরি পারমিশন অনুযায়ী দৃশ্যমান ক্যাটাগরি ফিল্টার
  const visibleCategories = (categoriesQuery.data || []).filter((cat) => canAccessCategory(cat));

  // আর্টিকেল ফিল্টারিং (রেস্ট্রিকটেড ক্যাটাগরি লুকানো এবং সার্চ ফিল্টার কার্যকর করা)
  const filteredArticles = allArticles.filter((a) => {
    // ১. রেস্ট্রিকটেড ক্যাটাগরির এক্সেস না থাকলে লুকানো
    if (a.category && !canAccessCategory(a.category)) {
      return false;
    }

    if (showDraftsOnly) {
      return !a.published;
    }
    if (!isAdmin && !a.published) return false;
    if (selectedCategory && a.category_id !== selectedCategory) {
      return false;
    }
    if (selectedAuthor && a.author_id !== selectedAuthor) {
      return false;
    }
    return true;
  });

  const draftCount = allArticles.filter((a) => !a.published).length;
  const activeAuthorObj = authorsQuery.data?.find((ath) => ath.id === selectedAuthor);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground font-serif">
            {t("articles")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            কুরআনের গভীর তাদাব্বুর ও নতুন গবেষণামূলক আর্টিকেল সরাসরি আপনার ইনবক্সে পান।
          </p>
        </div>

        <div>
          <Button asChild variant="outline" size="sm" className="text-xs cursor-pointer">
            <Link to="/authors">
              <User className="size-3.5 mr-1.5" />
              <span>লেখক ও গবেষকবৃন্দ</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* যদি ভিজিটর লগইন না করা থাকে - ফ্রেন্ডলি মেম্বারশিপ ব্যানার */}
      {!isLoggedIn && (
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" />
              <span>সম্পূর্ণ আর্টিকেল পাঠের জন্য লগইন করুন</span>
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              কুরআন অন্বেষার সমস্ত প্রবন্ধ ও গভীর গবেষণামূলক তাদাব্বুর পড়ার জন্য বিনামূল্যে অ্যাকাউন্ট খুলুন অথবা লগইন করুন।
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 text-xs gap-1.5 cursor-pointer">
            <Link to="/auth" search={{ redirect: "/articles" }}>
              <LogIn className="size-3.5" /> লগইন বা সাইন আপ
            </Link>
          </Button>
        </div>
      )}

      {/* যদি নির্দিষ্ট লেখক দ্বারা ফিল্টার হয়ে থাকে */}
      {selectedAuthor && activeAuthorObj && (
        <div className="mb-6 flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">লেখক ফিল্টার:</span>
            <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 bg-card border border-border">
              <User className="size-3 text-primary" />
              <span>{lang === "en" && activeAuthorObj.name_en ? activeAuthorObj.name_en : activeAuthorObj.name_bn}</span>
            </Badge>
          </div>
          <button
            type="button"
            onClick={() => setSelectedAuthor(null)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3.5" /> ফিল্টার সরান
          </button>
        </div>
      )}

      {/* ক্যাটাগরি ও ড্রাফট ফিল্টার বার */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory(null);
            setShowDraftsOnly(false);
          }}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
            !selectedCategory && !showDraftsOnly
              ? "bg-foreground text-background shadow-sm"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          সকল ক্যাটাগরি
        </button>

        {visibleCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id);
              setShowDraftsOnly(false);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id && !showDraftsOnly
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {cat.is_restricted && <Lock className="size-3 text-amber-500" />}
            <span>{lang === "en" && cat.name_en ? cat.name_en : cat.name_bn}</span>
          </button>
        ))}

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setShowDraftsOnly(true);
              setSelectedCategory(null);
            }}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              showDraftsOnly
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30"
            }`}
          >
            <EyeOff className="size-3.5" />
            <span>খসড়া / Draft ({draftCount})</span>
          </button>
        )}
      </div>

      {/* আর্টিকেল গ্রিড */}
      {query.isLoading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">লোড হচ্ছে...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <FileText className="mx-auto size-8 text-muted-foreground/40 mb-2" />
          <p className="text-xs text-muted-foreground">কোনো আর্টিকেল পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((a) => {
            const title = lang === "en" && a.title_en ? a.title_en : a.title_bn;
            const rawBody = a.content_bn || a.body_bn || a.content_en || a.body_en || "";
            const excerpt =
              lang === "en"
                ? getCleanExcerpt(a.excerpt_en, rawBody)
                : getCleanExcerpt(a.excerpt_bn, rawBody);
            const dateStr = a.published_at || a.created_at;
            const isRestrictedArticle = Boolean(a.category?.is_restricted);

            return (
              <div
                key={a.id}
                className="card-soft group relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                {/* খসড়া বা রেস্ট্রিকটেড ব্যাজ */}
                {!a.published ? (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow-sm backdrop-blur-sm">
                    <EyeOff className="size-3" />
                    <span>খসড়া / Draft</span>
                  </div>
                ) : isRestrictedArticle ? (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow-sm backdrop-blur-sm">
                    <Lock className="size-3" />
                    <span>এক্সক্লুসিভ</span>
                  </div>
                ) : null}

                {/* ইমেজ কভার বা বিসমিল্লাহ হেডার বক্স */}
                <Link
                  to="/articles/$slug"
                  params={{ slug: a.slug }}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30 flex items-center justify-center border-b border-border/40 cursor-pointer block"
                >
                  {a.cover_image_url ? (
                    <img
                      src={a.cover_image_url}
                      alt={title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-2xl font-serif text-muted-foreground/60 select-none tracking-wide text-center px-4">
                      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </div>
                  )}
                </Link>

                {/* কন্টেন্ট এরিয়া */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      <Link to="/articles/$slug" params={{ slug: a.slug }}>
                        {title}
                      </Link>
                    </h3>

                    <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground font-normal">
                      {excerpt}
                    </p>
                  </div>

                  {/* তারিখ ও লেখক সেকশন */}
                  <div className="mt-5 flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/50">
                    <span>
                      {dateStr
                        ? new Date(dateStr).toLocaleDateString(lang === "en" ? "en-US" : "bn-BD", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })
                        : ""}
                    </span>

                    {a.author && (
                      <Link
                        to="/authors/$id"
                        params={{ id: a.author.id }}
                        className="font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                        title="লেখকের সকল পোস্ট দেখুন"
                      >
                        {lang === "en" && a.author.name_en ? a.author.name_en : a.author.name_bn}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
