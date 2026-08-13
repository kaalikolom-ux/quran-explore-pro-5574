import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { BookmarkButton } from "@/components/BookmarkButton";
import { AuthorCard } from "@/components/AuthorCard";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — কুরআন অন্বেষা` },
      { name: "description", content: "কুরআন ও বিজ্ঞান নিয়ে আর্টিকেল — কুরআন অন্বেষা।" },
      { property: "og:title", content: `${params.slug} — কুরআন অন্বেষা` },
      { property: "og:description", content: "কুরআন ও বিজ্ঞান নিয়ে আর্টিকেল।" },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: `https://quran-explore-pro.lovable.app/articles/${params.slug}`,
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: `https://quran-explore-pro.lovable.app/articles/${params.slug}`,
      },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { t, lang } = usePrefs();

  const article = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const publishedAt = article.data?.published_at ?? null;

  const neighbours = useQuery({
    queryKey: ["article-neighbours", slug, publishedAt],
    enabled: !!publishedAt,
    queryFn: async () => {
      const [prev, next] = await Promise.all([
        supabase
          .from("articles")
          .select("slug, title_bn, title_en")
          .eq("published", true)
          .lt("published_at", publishedAt!)
          .order("published_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("articles")
          .select("slug, title_bn, title_en")
          .eq("published", true)
          .gt("published_at", publishedAt!)
          .order("published_at", { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);
      if (prev.error) throw prev.error;
      if (next.error) throw next.error;
      return { prev: prev.data, next: next.data };
    },
  });



  if (article.isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">{t("loading")}</p>;
  }

  if (!article.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-muted-foreground">{t("noArticles")}</p>
        <Link to="/articles" className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
          <ArrowLeft className="size-4" /> {t("backToArticles")}
        </Link>
      </div>
    );
  }

  const a = article.data;
  const title = lang === "en" && a.title_en ? a.title_en : a.title_bn;
  const content = lang === "en" && a.content_en ? a.content_en : a.content_bn;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-primary">
        <ArrowLeft className="size-4" /> {t("backToArticles")}
      </Link>

      <h1 className="mt-6 text-3xl font-semibold leading-snug">{title}</h1>
      <div className="mt-3 flex items-center justify-between gap-3">
        {a.published_at && (
          <p className="text-xs text-muted-foreground">
            {new Date(a.published_at).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB")}
          </p>
        )}
        <BookmarkButton
          variant="outline"
          target={{ kind: "article", articleId: a.id, label: a.title_bn }}
        />
      </div>

      {a.cover_image_url && (
        <img
          src={a.cover_image_url}
          alt={title}
          className="mt-6 w-full rounded-xl object-cover"
          loading="lazy"
        />
      )}

      <div className="prose-reader mt-8 space-y-4 text-base leading-relaxed">
        {(content ?? "").split(/\n{2,}/).map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>

      {a.author_id && <AuthorCard authorId={a.author_id} />}

      <nav className="mt-12 grid gap-4 sm:grid-cols-2" aria-label={t("articles")}>
        {neighbours.data?.prev ? (
          <Link
            to="/articles/$slug"
            params={{ slug: neighbours.data.prev.slug }}
            className="card-soft group flex items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-lift)]"
          >
            <ArrowLeft className="size-4 shrink-0 text-primary transition-transform group-hover:-translate-x-1" />
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                {t("prevPost")}
              </span>
              <span className="mt-1 block line-clamp-2 text-xs font-medium group-hover:text-primary">
                {lang === "en" && neighbours.data.prev.title_en
                  ? neighbours.data.prev.title_en
                  : neighbours.data.prev.title_bn}
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {neighbours.data?.next && (
          <Link
            to="/articles/$slug"
            params={{ slug: neighbours.data.next.slug }}
            className="card-soft group flex items-center justify-end gap-3 p-4 text-right transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-lift)]"
          >
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                {t("nextPost")}
              </span>
              <span className="mt-1 block line-clamp-2 text-xs font-medium group-hover:text-primary">
                {lang === "en" && neighbours.data.next.title_en
                  ? neighbours.data.next.title_en
                  : neighbours.data.next.title_bn}
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </nav>
    </article>
  );
}
