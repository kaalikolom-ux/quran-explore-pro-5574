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

function getCleanExcerpt(
  content?: string | null,
  excerpt?: string | null,
  maxLength = 120,
): string {
  if (excerpt && excerpt.trim().length > 0) return excerpt.trim();
  if (!content) return "বিস্তারিত প্রবন্ধটি পড়তে ক্লিক করুন...";
  const clean = content
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}...` : clean;
}

function AuthorDetailPage() {
  const { id } = Route.useParams();
  const { lang } = usePrefs();

  // ১. লেখকের বিস্তারিত প্রোফাইল ও সংশ্লিষ্ট আর্টিকেল ফেচ
  const { data: author, isLoading } = useQuery({
    queryKey: ["author-detail-page", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*, articles:articles(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) return null;
      return data;
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
  const authorArticles = (author.articles || []).filter((a: any) => a.published && !a.deleted_at);

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

      {/* লেখকের আর্টিকেলের তালিকা */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-serif text-foreground border-b border-border/60 pb-3">
          {name} এর প্রকাশিত রচনাবলী ({authorArticles.length})
        </h2>

        {authorArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-2">
            <BookOpen className="mx-auto size-8 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">
              এই লেখকের কোনো প্রকাশিত আর্টিকেল পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authorArticles.map((a: any) => {
              const title = lang === "en" && a.title_en ? a.title_en : a.title_bn;
              const rawBody = a.content_bn || a.body_bn || a.content_en || a.body_en || "";
              const excerpt =
                lang === "en"
                  ? getCleanExcerpt(rawBody, a.excerpt_en)
                  : getCleanExcerpt(rawBody, a.excerpt_bn);
              const dateStr = a.published_at || a.created_at;

              return (
                <div
                  key={a.id}
                  className="card-soft group relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
                >
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

                    <div className="mt-5 flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/50">
                      <span>
                        {dateStr
                          ? new Date(dateStr).toLocaleDateString(
                              lang === "en" ? "en-US" : "bn-BD",
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              },
                            )
                          : ""}
                      </span>

                      <Link
                        to="/articles/$slug"
                        params={{ slug: a.slug }}
                        className="font-semibold text-primary hover:underline"
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
