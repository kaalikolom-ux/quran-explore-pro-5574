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
  q: z.string().optional(),
});

export const Route = createFileRoute("/articles/")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "কুরআনের প্রবন্ধ ও গবেষণা — কুরআন অন্বেষা" },
      {
        name: "description",
        content: "পবিত্র কুরআন সম্পর্কিত তথ্যবহুল প্রবন্ধ, গবেষণা ও আধুনিক তাদাব্বুর।",
      },
      { property: "og:title", content: "কুরআনের প্রবন্ধ ও গবেষণা — কুরআন অন্বেষা" },
      {
        property: "og:description",
        content: "পবিত্র কুরআনের গভীর আলোচনা ও বিষয়ভিত্তিক বিশ্লেষণ।",
      },
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
  const [searchQuery, setSearchQuery] = useState<string | null>(searchParams.q || null);
  const [showDraftsOnly, setShowDraftsOnly] = useState(false);

  useEffect(() => {
    if (searchParams.author) setSelectedAuthor(searchParams.author);
    if (searchParams.category) setSelectedCategory(searchParams.category);
    if (searchParams.q) setSearchQuery(searchParams.q);
  }, [searchParams.author, searchParams.category, searchParams.q]);

  // সরাসরি ক্যাটাগরি ফেচ করা
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

  // আর্টিকেল ফেচ (১০০% নিরাপদ ও সুরক্ষিত কুয়েরি)
  const query = useQuery({
    queryKey: ["articles", isAdmin],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("*, author:authors(id, name_bn, name_en), category:categories(id, name_bn, name_en, slug)")
        .order("created_at", { ascending: false });

      if (!isAdmin) {
        q = q.eq("published", true);
      }

      const { data, error } = await q;
      if (error) {
        // Fallback plain query if joins fail
        let fallbackQ = supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });
        if (!isAdmin) {
          fallbackQ = fallbackQ.eq("published", true);
        }
        const fallbackRes = await fallbackQ;
        return fallbackRes.data || [];
      }
      return data || [];
    },
  });

  const allArticles = query.data || [];
  const categories = categoriesQuery.data || [];
  const authors = authorsQuery.data || [];

  // ক্যাটাগরি ও লেখক ফিল্টারিং
  const filteredArticles = allArticles.filter((art: any) => {
    // ১. ড্রাফট ফিল্টার
    if (isAdmin && showDraftsOnly && art.published) return false;

    // ২. নির্দিষ্ট ক্যাটাগরি ফিল্টার
    if (selectedCategory) {
      const catObj = categories.find((c) => c.slug === selectedCategory);
      if (catObj && art.category_id !== catObj.id && art.category?.slug !== selectedCategory) {
        return false;
      }
    }

    // ৩. নির্দিষ্ট লেখক ফিল্টার
    if (selectedAuthor) {
      if (art.author_id !== selectedAuthor && art.author?.id !== selectedAuthor) {
        return false;
      }
    }

    // ৪. রেস্ট্রিকটেড ক্যাটাগরি ফিল্টার
    const articleCategory = categories.find((c) => c.id === art.category_id) || art.category;
    if (!canAccessCategory(articleCategory)) {
      return false;
    }

    // ৫. সার্চ কোয়েরি ফিল্টার (?q=...)
    if (searchQuery && searchQuery.trim()) {
      const qLower = searchQuery.trim().toLowerCase();
      const titleBn = (art.title_bn || "").toLowerCase();
      const titleEn = (art.title_en || "").toLowerCase();
      const excerptBn = (art.excerpt_bn || "").toLowerCase();
      const catNameBn = (art.category?.name_bn || "").toLowerCase();
      const catSlug = (art.category?.slug || "").toLowerCase();
      
      const matches = 
        titleBn.includes(qLower) || 
        titleEn.includes(qLower) || 
        excerptBn.includes(qLower) || 
        catNameBn.includes(qLower) ||
        catSlug.includes(qLower);

      if (!matches) return false;
    }

    return true;
  });

  const activeAuthorObj = authors.find((a) => a.id === selectedAuthor);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      {/* হেডার */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
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

      {/* যদি নির্দিষ্ট সার্চ কোয়েরি থাকে (?q=...) */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/5 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span>অনুসন্ধান ফলাফল: <strong>"{searchQuery}"</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery(null)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3.5" /> সার্চ মুছুন
          </button>
        </div>
      )}

      {/* যদি নির্দিষ্ট লেখক দ্বারা ফিল্টার হয়ে থাকে */}
      {selectedAuthor && activeAuthorObj && (
        <div className="mb-6 flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/5 text-xs">
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span>লেখক ফিল্টার: <strong>{lang === "en" && activeAuthorObj.name_en ? activeAuthorObj.name_en : activeAuthorObj.name_bn}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedAuthor(null)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3.5" /> ফিল্টার মুছুন
          </button>
        </div>
      )}

      {/* ক্যাটাগরি পিলস (যদি ক্যাটাগরি থাকে) */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            সকল ({allArticles.length})
          </button>
          {categories
            .filter((cat) => canAccessCategory(cat))
            .map((cat) => {
              const name = lang === "en" && cat.name_en ? cat.name_en : cat.name_bn;
              const isSelected = selectedCategory === cat.slug;
              const count = allArticles.filter((a: any) => a.category_id === cat.id || a.category?.slug === cat.slug).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span>{name}</span>
                  {cat.is_restricted && <Lock className="size-3 text-amber-500" />}
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
        </div>
      )}

      {/* আর্টিকেল গ্রিড */}
      {query.isLoading ? (
        <div className="py-24 text-center text-xs text-muted-foreground">
          আর্টিকেল লোড হচ্ছে...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center space-y-3">
          <FileText className="mx-auto size-10 text-muted-foreground/40" />
          <h2 className="text-base font-bold text-foreground">কোনো আর্টিকেল পাওয়া যায়নি</h2>
          <p className="text-xs text-muted-foreground">
            এই ফিল্টারের অধীনে কোনো পোস্ট এখনো প্রকাশিত হয়নি।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredArticles.map((art: any) => {
            const title = lang === "en" && art.title_en ? art.title_en : art.title_bn;
            const excerpt = getCleanExcerpt(
              lang === "en" ? art.excerpt_en : art.excerpt_bn,
              lang === "en" ? art.content_en : art.content_bn
            );
            const author = authors.find((a) => a.id === art.author_id) || art.author;
            const authorName = author
              ? lang === "en" && author.name_en ? author.name_en : author.name_bn
              : null;
            const category = categories.find((c) => c.id === art.category_id) || art.category;
            const categoryName = category
              ? lang === "en" && category.name_en ? category.name_en : category.name_bn
              : null;

            return (
              <div
                key={art.id}
                className="card-soft group relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <Link
                  to="/articles/$slug"
                  params={{ slug: art.slug }}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30 flex items-center justify-center border-b border-border/40 cursor-pointer block"
                >
                  {art.cover_image_url ? (
                    <img
                      src={art.cover_image_url}
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-xl font-serif text-muted-foreground/60 select-none text-center px-4">
                      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </div>
                  )}
                  {categoryName && (
                    <span className="absolute top-2.5 right-2.5 rounded-md bg-background/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-xs">
                      {categoryName}
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h2 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      <Link to="/articles/$slug" params={{ slug: art.slug }}>
                        {title}
                      </Link>
                    </h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>
                      {authorName ? (
                        <span className="font-semibold text-foreground/80">{authorName}</span>
                      ) : (
                        art.published_at ? new Date(art.published_at).toLocaleDateString(lang === "en" ? "en-US" : "bn-BD") : ""
                      )}
                    </span>
                    <Link
                      to="/articles/$slug"
                      params={{ slug: art.slug }}
                      className="font-medium text-primary hover:underline"
                    >
                      পড়ুন →
                    </Link>
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
