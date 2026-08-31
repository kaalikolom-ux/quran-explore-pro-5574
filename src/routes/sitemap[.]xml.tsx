import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { STATIC_ARTICLES } from "@/lib/staticArticlesData";

const BASE_URL = "https://quran-explore-pro.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls: string[] = [`${BASE_URL}/`, `${BASE_URL}/articles`];

        for (let i = 1; i <= 114; i += 1) urls.push(`${BASE_URL}/surah/${i}`);

        for (const sa of STATIC_ARTICLES) {
          if (sa.published && !urls.includes(`${BASE_URL}/articles/${sa.slug}`)) {
            urls.push(`${BASE_URL}/articles/${sa.slug}`);
          }
        }

        try {
          const supabase = createClient<Database>(
            process.env['SUPABASE_URL']!,
            process.env['SUPABASE_PUBLISHABLE_KEY']!,
            { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
          );
          const { data } = await supabase
            .from("articles")
            .select("slug")
            .eq("published", true)
            .order("published_at", { ascending: false })
            .limit(500);
          for (const a of data ?? []) {
            const artUrl = `${BASE_URL}/articles/${a.slug}`;
            if (!urls.includes(artUrl)) {
              urls.push(artUrl);
            }
          }
        } catch {
          // sitemap still serves static routes if the database is unreachable
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
