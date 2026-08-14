// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks: {
            // ভারি লাইব্রেরিগুলোকে আলাদা বান্ডেলে স্প্লিট করা হলো যাতে হোমপেজ হালকা থাকে
            "tiptap-vendor": ["@tiptap/react", "@tiptap/starter-kit", "tiptap-markdown"],
            "react-vendor": ["react", "react-dom"],
            "tanstack-vendor": ["@tanstack/react-query", "@tanstack/react-router"],
            "ui-vendor": ["lucide-react", "clsx", "tailwind-merge"],
          },
        },
      },
    },
    plugins: [
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        devOptions: { enabled: false },
        manifest: false,
        workbox: {
          navigateFallback: "/",
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//, /^\/_serverFn\//],
          globPatterns: ["**/*.{js,css,html,woff2,png,svg}"],
          runtimeCaching: [
            {
              // HTML navigations must stay network-first so deploys are picked up.
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: { cacheName: "quran-pages" },
            },
            {
              urlPattern: ({ url, sameOrigin }) =>
                sameOrigin && url.pathname.startsWith("/assets/"),
              handler: "CacheFirst",
              options: {
                cacheName: "quran-assets",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // ৩০ দিন ক্যাশ থাকবে
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "quran-fonts",
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // ১ বছর ক্যাশ থাকবে
                },
              },
            },
            {
              // কুরআন API ডাটা ব্রাউজারে ক্যাশ করা যাতে তাৎক্ষণিক পেজ লোড হয়
              urlPattern: /^https:\/\/api\.quran\.com\/api\/v4\//,
              handler: "CacheFirst",
              options: {
                cacheName: "quran-api-cache",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 14, // ১৪ দিন ক্যাশ থাকবে
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
  },
});