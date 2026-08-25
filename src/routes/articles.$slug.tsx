import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronLeft, User, ArrowLeft, ArrowRight } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Button } from "@/components/ui/button";

function getCleanExcerpt(excerpt?: string | null, body?: string | null, maxLength = 150): string {
  if (excerpt && excerpt.trim().length > 0) {
    return excerpt.trim();
  }
  if (!body) return "ইসলাম ও বিজ্ঞান বিষয়ক প্রবন্ধ।";
  const clean = body.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}...` : clean;
}

export const Route = createFileRoute("/articles/$slug")({
  head: ({ loaderData }) => {
    const article = loaderData;
    const title = article ? `${article.title_bn} — কুরআন অন্বেষা` : "আর্টিকেল — কুরআন অন্বেষা";
    const desc = getCleanExcerpt(article?.excerpt_bn, article?.content_bn || article?.body_bn);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
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

  const listQuery = useQuery({
    queryKey: ["articles-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, slug, title_bn, title_en")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return data || [];
    },
  });

  const article = query.data;
  const articles = listQuery.data || [];

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
  const rawContent =
    lang === "en"
      ? article.content_en || article.body_en || ""
      : article.content_bn || article.body_bn || "";
  const authorName =
    article.author &&
    (lang === "en" && article.author.name_en ? article.author.name_en : article.author.name_bn);

  // HTML ট্যাগ আছে কিনা চেক করা
  const isHtml = /<[a-z][\s\S]*>/i.test(rawContent);

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
          className="mb-8 h-64 w-full rounded-2xl object-cover shadow-sm sm:h-80 border border-border"
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl text-foreground">{title}</h1>
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

      {/* মূল বিষয়বস্তু: প্রতিটি প্যারাগ্রাফকে আলাদা ব্লকে রূপান্তর */}
      <div className="mt-8 text-base leading-relaxed space-y-6 text-foreground/90 font-serif">
        {isHtml ? (
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: rawContent }}
          />
        ) : (
          rawContent.split(/\n\s*\n/).map((para: string, idx: number) => {
            const trimmed = para.trim();
            if (!trimmed) return null;
            return (
              <p key={idx} className="leading-8 tracking-normal">
                {trimmed}
              </p>
            );
          })
        )}
      </div>

      {/* নেভিগেশন কার্ডস */}
      <div className="mt-12 pt-8 border-t border-border/60">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {prevArticle ? (
            <Link
              to="/articles/$slug"
              params={{ slug: prevArticle.slug }}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-md"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-foreground mb-2">
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                <span>{lang === "en" ? "Previous Article" : "পূর্ববর্তী লেখা"}</span>
              </div>
              <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {lang === "en" && prevArticle.title_en ? prevArticle.title_en : prevArticle.title_bn}
              </h4>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextArticle ? (
            <Link
              to="/articles/$slug"
              params={{ slug: nextArticle.slug }}
              className="group relative flex flex-col justify-between items-end text-right rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-md"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-foreground mb-2">
                <span>{lang === "en" ? "Next Article" : "পরবর্তী লেখা"}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
              <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {lang === "en" && nextArticle.title_en ? nextArticle.title_en : nextArticle.title_bn}
              </h4>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      </div>
    </article>
  );
}