import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, EyeOff } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { useIsAdmin } from "@/lib/auth";
import { useCategories } from "@/lib/menu";

export const Route = createFileRoute("/articles/")({
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDraftsOnly, setShowDraftsOnly] = useState(false);

  const categories = useCategories();

  const query = useQuery({
    queryKey: ["articles", isAdmin],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("*, author:authors(name_bn, name_en), category:categories(name_bn, name_en, slug)")
        .order("created_at", { ascending: false });

      // ইউজার অ্যাডমিন না হলে শুধুমাত্র পাবলিশড পোস্ট আসবে
      if (!isAdmin) {
        q = q.eq("published", true);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const allArticles = query.data || [];

  // ফিল্টারিং লজিক
  const filteredArticles = allArticles.filter((a) => {
    if (showDraftsOnly) {
      return !a.published;
    }
    if (!isAdmin && !a.published) return false;
    if (selectedCategory) {
      return a.category_id === selectedCategory && a.published;
    }
    return a.published;
  });

  const draftCount = allArticles.filter((a) => !a.published).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground font-serif">
          {t("articles")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          কুরআনের গভীর তাদাব্বুর ও নতুন গবেষণামূলক আর্টিকেল সরাসরি আপনার ইনবক্সে পান।
        </p>
      </div>

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

        {categories.data?.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id);
              setShowDraftsOnly(false);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === cat.id && !showDraftsOnly
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {lang === "en" && cat.name_en ? cat.name_en : cat.name_bn}
          </button>
        ))}

        {/* শুধুমাত্র অ্যাডমিন হলে ড্রাফট ট্যাব প্রদর্শিত হবে */}
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

            return (
              <Link
                key={a.id}
                to="/articles/$slug"
                params={{ slug: a.slug }}
                className="card-soft group relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] cursor-pointer"
              >
                {/* খসড়া ব্যাজ */}
                {!a.published && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow-sm backdrop-blur-sm">
                    <EyeOff className="size-3" />
                    <span>খসড়া / Draft</span>
                  </div>
                )}

                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 flex items-center justify-center">
                  {a.cover_image_url ? (
                    <img
                      src={a.cover_image_url}
                      alt={title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-2xl font-serif text-muted-foreground/40 select-none">
                      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {title}
                    </h3>
                    
                    {/* Excerpt যোগ করা হলো */}
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {excerpt}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/40">
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
                      <span className="font-medium">
                        {lang === "en" && a.author.name_en ? a.author.name_en : a.author.name_bn}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}