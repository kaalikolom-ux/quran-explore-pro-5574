import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { User, FileText, ChevronRight, PenTool } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { STATIC_AUTHORS } from "@/lib/staticArticlesMeta";

export const Route = createFileRoute("/authors/")({
  head: () => ({
    meta: [
      { title: "লেখক ও গবেষকবৃন্দ — কুরআন অন্বেষা | Quran Explorer" },
      { name: "description", content: "কুরআন অন্বেষার সম্মানিত লেখক ও গবেষকবৃন্দের তালিকা।" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://wooniche.com/authors" },
      { property: "og:site_name", content: "কুরআন অন্বেষা — Quran Explorer" },
      { property: "og:title", content: "লেখক ও গবেষকবৃন্দ — কুরআন অন্বেষা | Quran Explorer" },
      { property: "og:description", content: "কুরআন অন্বেষার সম্মানিত লেখক ও গবেষকবৃন্দের তালিকা।" },
      { property: "og:image", content: "https://wooniche.com/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://wooniche.com/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "পবিত্র কুরআন — বুঝে পড়ুন | কুরআন অন্বেষা" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "লেখক ও গবেষকবৃন্দ — কুরআন অন্বেষা | Quran Explorer" },
      { name: "twitter:description", content: "কুরআন অন্বেষার সম্মানিত লেখক ও গবেষকবৃন্দের তালিকা।" },
      { name: "twitter:image", content: "https://wooniche.com/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://wooniche.com/authors" },
    ],
  }),
  component: AuthorsDirectoryPage,
});

function AuthorsDirectoryPage() {
  const { lang, t } = usePrefs();

  const { data: authors = [], isLoading } = useQuery({
    queryKey: ["authors-directory-list"],
    initialData: () => Object.values(STATIC_AUTHORS) as any,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*, articles:articles(id, published, deleted_at)")
        .order("name_bn");

      if (error) return [];
      return data || [];
    },
  });

  const authorsList = Array.isArray(authors) && authors.length > 0 ? authors : Object.values(STATIC_AUTHORS);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* কলম আইকনসহ ডেডিকেটেড পেইজ হেডার */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-primary/10 text-primary mb-2 shadow-xs border border-primary/20">
          <PenTool className="size-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">
          {lang === "en" ? "Authors & Contributors" : "লেখক ও গবেষকবৃন্দ"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          কুরআনের জ্ঞানগর্ভ তাদাব্বুর ও গবেষণাধর্মী লেখালেখির সাথে যুক্ত বিজ্ঞ লেখক ও চিন্তকগণ।
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-muted/40 animate-pulse border border-border" />
          ))}
        </div>
      ) : authorsList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
          <User className="mx-auto size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">কোনো লেখকের প্রোফাইল পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorsList.map((author: any) => {
            const name = lang === "en" && author.name_en ? author.name_en : author.name_bn;
            const bio = lang === "en" && author.bio_en ? author.bio_en : author.bio_bn;
            const publishedCount =
              author.articles?.filter((a: any) => a.published && !a.deleted_at).length || 0;

            return (
              <Link
                key={author.id}
                to="/authors/$id"
                params={{ id: author.id }}
                className="card-soft group flex flex-col justify-between p-6 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {author.image_url ? (
                      <img
                        src={author.image_url}
                        alt={name}
                        className="size-14 rounded-full object-cover border-2 border-primary/30"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                        <User className="size-7" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-base font-bold font-serif text-foreground group-hover:text-primary transition-colors">
                        {name}
                      </h2>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <FileText className="size-3" />
                        {publishedCount} টি প্রকাশিত আর্টিকেল
                      </span>
                    </div>
                  </div>

                  {bio && (
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-serif">
                      {bio}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-end border-t border-border/40 pt-3 text-xs font-semibold text-primary">
                  <span>সব লেখা দেখুন</span>
                  <ChevronRight className="size-4 ml-0.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}