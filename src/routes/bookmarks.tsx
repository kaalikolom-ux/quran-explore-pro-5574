import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";

import { usePrefs } from "@/lib/prefs";
import { useBookmarks } from "@/lib/bookmarks";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "বুকমার্কসমূহ — কুরআন অন্বেষা" },
      { name: "description", content: "আপনার সংরক্ষিত সুরা, আয়াত ও আর্টিকেলসমূহ।" },
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const { t } = usePrefs();
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <Bookmark className="size-7 text-primary" /> {t("bookmarks")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            আপনার পছন্দের সুরা, আয়াত এবং আর্টিকেলসমূহ এখানে সংরক্ষিত থাকবে।
          </p>
        </div>
        {bookmarks.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearBookmarks}>
            <Trash2 className="size-4 mr-1.5 text-destructive" /> সব মুছে ফেলুন
          </Button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="card-soft mt-8 p-12 text-center">
          <Bookmark className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-sm text-muted-foreground">
            এখনো কোনো সুরা, আয়াত বা আর্টিকেল বুকমার্ক করা হয়নি।
          </p>
          <Button asChild className="mt-6">
            <Link to="/">{t("readQuran")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {bookmarks.map((b) => {
            const isArticle = b.kind === "article";

            return (
              <div
                key={
                  isArticle
                    ? `article-${b.slug}`
                    : `${b.kind}-${b.surah}-${'ayah' in b ? b.ayah : 0}`
                }
                className="card-soft group relative flex items-center justify-between p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                {/* ১. আর্টিকেলের জন্য ক্লিকেবল লিংক */}
                {isArticle && (
                  <Link
                    to="/articles/$slug"
                    params={{ slug: b.slug ?? "" }}
                    className="flex-1 min-w-0 pr-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                        আর্টিকেল
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-medium truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {b.label}
                      <ExternalLink className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                    </h3>
                  </Link>
                )}

                {/* ২. সুরা এবং আয়াতের জন্য ক্লিকেবল লিংক */}
                {!isArticle && (
                  <Link
                    to="/surah/$id"
                    params={{ id: String(b.surah) }}
                    search={'ayah' in b && b.ayah ? { ayah: String(b.ayah) } : undefined}
                    hash={'ayah' in b && b.ayah ? `ayah-${b.ayah}` : undefined}
                    className="flex-1 min-w-0 pr-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                        {b.kind === "ayah" ? "আয়াত" : "সুরা"}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {b.surah}{'ayah' in b && b.ayah ? `:${b.ayah}` : ""}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-medium truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {b.label}
                      <ExternalLink className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                    </h3>
                  </Link>
                )}

                {/* মুছে ফেলার বাটন */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  title="রিমুভ করুন"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmark(b);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}