import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { PrefsProvider } from "../lib/prefs";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { Toaster } from "../components/ui/sonner";
import { FloatingQuickNav } from "../components/FloatingQuickNav";
import { BackToTop } from "../components/BackToTop";
import { supabase } from "../integrations/supabase/client";
import { useQueryPersistence } from "../lib/query-persist";
import { registerOfflineWorker } from "../lib/pwa";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">পাতাটি খুঁজে পাওয়া যায়নি</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Page not found — the page you are looking for does not exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            হোমে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">পাতাটি লোড হয়নি</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message || "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।"}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            আবার চেষ্টা করুন
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            হোম
          </a>
        </div>
      </div>
    </div>
  );
}

// Google Rich Snippet / Schema.org Structured Data
const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "কুরআন অন্বেষা — Quran Explorer",
  alternateName: "Quran Anwesha",
  url: "https://qurananwesha.com",
  description: "পবিত্র কুরআনের শব্দে শব্দে অর্থ, প্রামাণ্য অনুবাদ ও আধুনিক শব্দ বিশ্লেষণ।",
  inLanguage: ["bn", "ar", "en"],
  potentialAction: {
    "@type": "SearchAction",
    target: "https://qurananwesha.com/surah/1?ayah={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "কুরআন অন্বেষা — শব্দে শব্দে অর্থসহ কুরআন" },
      {
        name: "description",
        content:
          "পবিত্র কুরআনের প্রতিটি শব্দের বাংলা অর্থ, উচ্চারণ, প্রামাণ্য অনুবাদ ও প্রাঞ্জল ব্যাখ্যা একই পাতায় পড়ুন।",
      },
      {
        name: "keywords",
        content:
          "কুরআন, শব্দে শব্দে কুরআন, কুরআন অনুবাদ, বাংলা কুরআন, আল কুরআন, Quran Bangla, Word by word Quran",
      },
      { property: "og:title", content: "কুরআন অন্বেষা — শব্দে শব্দে অর্থসহ কুরআন" },
      {
        property: "og:description",
        content: "শব্দে শব্দে অর্থ, প্রচলিত ও আধুনিক বাংলা অনুবাদ একই পাতায়।",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "কুরআন অন্বেষা" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#020817" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "canonical", href: "https://qurananwesha.com/" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;600;700&family=Amiri:wght@400;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;600;700&family=Amiri:wght@400;700&display=swap"
          media="print"
          // @ts-expect-error non-blocking font swap
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;600;700&family=Amiri:wght@400;700&display=swap"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthSync() {
  const router = useRouter();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
    });
    return () => data.subscription.unsubscribe();
  }, [router]);
  return null;
}

function OfflineBoot() {
  useQueryPersistence();
  useEffect(() => {
    void registerOfflineWorker();
  }, []);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <PrefsProvider>
        <AuthSync />
        <OfflineBoot />
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <FloatingQuickNav />
        <BackToTop />
        <AuthPromptModal />
        <Toaster />
      </PrefsProvider>
    </QueryClientProvider>
  );
}
