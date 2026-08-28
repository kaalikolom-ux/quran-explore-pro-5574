import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { User, Calendar, BookOpen, ArrowLeft, FileText } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/authors/$id")({
  head: () => ({
    meta: [
      { title: "লেখক প্রোফাইল ও রচনাবলী — কুরআন অন্বেষা" },
      { name: "description", content: "নির্দিষ্ট লেখকের সকল প্রকাশিত আর্টিকেল ও প্রবন্ধ।" },
    ],
  }),
  component: AuthorDetailPage,
});

function getCleanExcerpt(content?: string | null, excerpt?: string | null, maxLength = 120): string {
  if (excerpt && excerpt.trim().length > 0) return excerpt.trim();
  if (!content) return "বিস্তারিত প্রবন্ধটি পড়তে ক্লিক করুন...";
  const clean = content.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}...` : clean;
}

function AuthorDetailPage() {
  const { id } = Route.useParams();
  const { lang } = usePrefs();

  // ১. লেখকের বিস্তারিত প্রোফাইল ও সংশ্লিষ্ট আর্টিকেল ফেচ (১০০% নির্ভরযোগ্য)
  const { data: author, isLoading } = useQuery({
    queryKey: ["author-detail-page", id],
    queryFn: async () => {
      const { data: authorData, error: authorErr } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (authorErr || !authorData) return null;

      // লেখকের সকল প্রকাশিত আর্টিকেল ফেচ
      const { data: articlesData } = await supabase
        .from("articles")
        .select("*")
        .eq("author_id", id)
        .eq("published", true)
        .order("published_at", { ascending: false });

      return {
        ...authorData,
        articles: articlesData || [],
      };
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-xs text-muted-foreground">
        লেখক প্রোফাইল ও পোস্ট লোড হচ্ছে...
      </div>
    );
  }

  if (!author) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <p className="text-muted-foreground text-sm">লেখক প্রোফাইলটি খুঁজে পাওয়া যায়নি।</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/authors">
            <ArrowLeft className="size-4 mr-1.5" /> সকল লেখকবৃন্দ
          </Link>
        </Button>
      </div>
    );
  }

  const name = lang === "en" && author.name_en ? author.name_en : author.name_bn;
  const bio = lang === "en" && author.bio_en ? author.bio_en : author.bio_bn;
  const authorArticles = author.articles || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14 space-y-10">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-xs">
          <Link to="/authors">
            <ArrowLeft className="size-3.5 mr-1" /> সকল লেখকবৃন্দ
          </Link>
        </Button>
      </div>

      {/* লেখক পরিচিতি হেডার বক্স */}
      <div className="card-soft p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {author.image_url ? (
          <img
            src={author.image_url}
            alt={name}
            className="size-24 rounded-full object-cover border-2 border-primary/30 shadow-md"
          />
        ) : (
          <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
            <User className="size-12" />
          </div>
        )}

        <div className="space-y-2 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">{name}</h1>
          <p className="text-xs text-primary font-medium inline-flex items-center gap-1 bg-primary/10 px-2.5 py-0.5 rounded-full">
            <FileText className="size-3" /> {authorArticles.length} টি প্রকাশিত আর্টিকেল
          </p>
          {bio && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 font-serif max-w-2xl">
              {bio}
            </p>
          )}
        </div>
      </div>

      {/* লেখকের প্রকাশিত আর্টিকেল তালিকা */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-foreground font-serif">
          {name} এর প্রকাশিত রচনাবলী ({authorArticles.length})
        </h2>

        {authorArticles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 p-10 text-center text-xs text-muted-foreground">
            এই লেখকের কোনো প্রকাশিত আর্টিকেল পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {authorArticles.map((art: any) => {
              const title = lang === "en" && art.title_en ? art.title_en : art.title_bn;
              const excerpt = getCleanExcerpt(
                lang === "en" ? art.content_en : art.content_bn,
                lang === "en" ? art.excerpt_en : art.excerpt_bn
              );

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
                  </Link>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        <Link to="/articles/$slug" params={{ slug: art.slug }}>
                          {title}
                        </Link>
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
                      <span>
                        {art.published_at
                          ? new Date(art.published_at).toLocaleDateString(lang === "en" ? "en-US" : "bn-BD")
                          : ""}
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
    </div>
  );
}
