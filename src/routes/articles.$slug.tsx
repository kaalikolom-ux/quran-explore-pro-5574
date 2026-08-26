import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  ChevronLeft,
  User,
  ArrowLeft,
  ArrowRight,
  EyeOff,
  Eye,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { useIsAdmin } from "@/lib/auth";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

function getCleanExcerpt(excerpt?: string | null, body?: string | null, maxLength = 150): string {
  if (excerpt && excerpt.trim().length > 0) return excerpt.trim();
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
        ...(article?.cover_image_url ? [{ property: "og:image", content: article.cover_image_url }] : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("articles")
      .select("*, author:authors(name_bn, name_en)")
      .eq("slug", params.slug)
      .maybeSingle();
    return data;
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { lang, t } = usePrefs();
  const { isAdmin } = useIsAdmin();
  const initial = Route.useLoaderData();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, author:authors(name_bn, name_en)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    initialData: initial ?? undefined,
  });

  const listQuery = useQuery({
    queryKey: ["articles-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, slug, title_bn, title_en, published")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return data || [];
    },
  });

  // সরাসরি পড়ার পেজ থেকে ড্রাফট বা পাবলিশ টগল করার মিউটেশন
  const togglePublish = useMutation({
    mutationFn: async (nextStatus: boolean) => {
      if (!query.data?.id) return;
      const { error } = await supabase
        .from("articles")
        .update({
          published: nextStatus,
          published_at: nextStatus ? new Date().toISOString() : null,
        })
        .eq("id", query.data.id);
      if (error) throw error;
    },
    onSuccess: (_, nextStatus) => {
      queryClient.invalidateQueries({ queryKey: ["article", slug] });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles-list"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(nextStatus ? "আর্টিকেল প্রকাশিত হয়েছে" : "আর্টিকেলটি খসড়া/ড্রাফট করা হয়েছে");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const article = query.data;
  const articles = listQuery.data || [];

  if (!article || (!article.published && !isAdmin)) {
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

  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;

  const title = lang === "en" && article.title_en ? article.title_en : article.title_bn;
  const rawContent =
    lang === "en"
      ? article.content_en || article.body_en || ""
      : article.content_bn || article.body_bn || "";
  const authorName =
    article.author &&
    (lang === "en" && article.author.name_en ? article.author.name_en : article.author.name_bn);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8">
      {/* শুধুমাত্র অ্যাডমিনের জন্য কুইক অ্যাকশন বার */}
      {isAdmin && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2271b1]/30 bg-[#2271b1]/5 p-3 sm:px-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <ShieldCheck className="size-4 text-[#2271b1]" />
            <span>অ্যাডমিন কুইক কন্ট্রোল:</span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                article.published
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              }`}
            >
              {article.published ? "প্রকাশিত (Live)" : "খসড়া (Draft)"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground font-medium">
                {article.published ? "Draft করুন" : "Publish করুন"}
              </span>
              <Switch
                checked={article.published}
                disabled={togglePublish.isPending}
                onCheckedChange={(checked) => togglePublish.mutate(checked)}
                title={article.published ? "ক্লিক করে খসড়া করুন" : "ক্লিক করে প্রকাশ করুন"}
              />
            </div>

            <div className="h-4 w-px bg-border mx-0.5" />

            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-7 px-2.5 text-xs gap-1.5 hover:bg-[#2271b1] hover:text-white"
            >
              <Link to="/admin">
                <Pencil className="size-3" />
                <span>এডিট করুন</span>
              </Link>
            </Button>
          </div>
        </div>
      )}

      {!article.published && !isAdmin && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-500 font-medium">
          <EyeOff className="size-4 shrink-0" />
          <span>এটি একটি খসড়া (Draft) পোস্ট।</span>
        </div>
      )}

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

      <div
        className="mt-8 text-base leading-relaxed text-foreground/90 font-serif 
                   [&>p]:mb-6 [&>p]:leading-8 [&>p]:tracking-normal
                   [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4
                   [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3
                   [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-5 [&>h3]:mb-2
                   [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-1.5
                   [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-1.5
                   [&>blockquote]:border-l-4 [&>blockquote]:border-primary/60 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6 [&>blockquote]:text-muted-foreground"
        style={{ whiteSpace: rawContent.includes("<p>") ? "normal" : "pre-line" }}
        dangerouslySetInnerHTML={{ __html: rawContent }}
      />

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
import { CommentsSection } from "@/components/CommentsSection";

// ... ArticlePage ফাংশনের রিটার্নে নেভিগেশন কার্ডসের ঠিক নিচে:
<CommentsSection articleId={article.id} />