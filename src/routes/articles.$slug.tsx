import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronLeft, User, ArrowLeft, ArrowRight } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ loaderData }) => {
    const article = loaderData;
    const title = article ? `${article.title_bn} — কুরআন অন্বেষা` : "আর্টিকেল — কুরআন অন্বেষা";
    return {
      meta: [
        { title },
        { name: "description", content: article?.excerpt_bn ?? "ইসলাম ও বিজ্ঞান বিষয়ক প্রবন্ধ।" },
        { property: "og:title", content: title },
        { property: "og:description", content: article?.excerpt_bn ?? "" },
        ...(article?.cover_image_url
          ? [{ property: "og:image", content: article.cover_image_url }]
          : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("articles")
      .select("*, author:authors(name_bn, name_en)")
      .eq("slug", params.slug)
      .eq("published", true)
      .single();
    return data;
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { lang, t } = usePrefs();
  const initial = Route.useLoaderData();

  // বর্তমান আর্টিকেল
  const query = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, author:authors(name_bn, name_en)")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    initialData: initial ?? undefined,
  });

  // আর্টিকেলের লিস্ট (নেভিগেশনের জন্য)
  const listQuery = useQuery({
    queryKey: ["articles-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, slug, title_bn")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return data || [];
    },
  });

  const article = query.data;
  const articles = listQuery.data || [];

  // প্রিভিয়াস এবং নেক্সট আর্টিকেল বের করা
  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted-foreground">{t("notFound")}</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/articles">
            <ChevronLeft className="size-4" /> {t("articles")}
          </Link>
        </Button>
      </div>
    );
  }

  const title = lang === "en" && article.title_en ? article.title_en : article.title_bn;
  const content = lang === "en" && article.content_en ? article.content_en : article.content_bn;
  const authorName =
    article.author &&
    (lang === "en" && article.author.name_en ? article.author.name_en : article.author.name_bn);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link to="/articles">
          <ChevronLeft className="size-4" /> {t("articles")}
        </Link>
      </Button>

      {article.cover_image_url && (
        <img
          src={article.cover_image_url}
          alt={title}
          className="mb-8 h-64 w-full rounded-xl object-cover shadow-sm sm:h-80"
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
        <BookmarkButton
          target={{
            kind: "article",
            slug: article.slug,
            label: title,
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-b border-border pb-6">
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
        {authorName && (
          <span className="inline-flex items-center gap-1">
            <User className="size-3.5" />
            {authorName}
          </span>
        )}
      </div>

      <div
        className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content ?? "" }}
      />

      {/* নেভিগেশন কার্ডস */}
      <div className="mt-12 pt-8 border-t border-border/60">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {prevArticle ? (
            <Link
              to="/articles/$slug"
              params={{ slug: prevArticle.slug }}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/90 hover:shadow-md"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-primary mb-2">
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                <span>পূর্ববর্তী লেখা</span>
              </div>
              <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {prevArticle.title_bn}
              </h4>
            </Link>
          ) : <div className="hidden sm:block" />}

          {nextArticle ? (
            <Link
              to="/articles/$slug"
              params={{ slug: nextArticle.slug }}
              className="group relative flex flex-col justify-between items-end text-right rounded-2xl border border-border/70 bg-card/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/90 hover:shadow-md"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-primary mb-2">
                <span>পরবর্তী লেখা</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
              <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {nextArticle.title_bn}
              </h4>
            </Link>
          ) : <div className="hidden sm:block" />}
        </div>
      </div>
    </article>
  );
}