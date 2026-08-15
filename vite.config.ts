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
              options: { cacheName: "quran-assets" },
            },
            {
              // ১১৪টি সূরার JSON ফাইল লোকাল ডিস্কে ক্যাশ করার নিয়ম (০ মিলিসেকেন্ডে লোড হবে)
              urlPattern: /\/data\/quran\/surahs\/.*\.json$/,
              handler: "CacheFirst",
              options: {
                cacheName: "quran-surahs-json-cache-v1",
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 90, // ৯০ দিন ক্যাশে সংরক্ষিত থাকবে
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // তেলাওয়াত অডিও ফাইল ক্যাশ করার নিয়ম
              urlPattern: /^https:\/\/everyayah\.com\/data\/.*\.mp3$/,
              handler: "CacheFirst",
              options: {
                cacheName: "quran-audio-cache-v1",
                expiration: {
                  maxEntries: 300,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // ৩০ দিন ক্যাশে থাকবে
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
              handler: "StaleWhileRevalidate",
              options: { cacheName: "quran-fonts" },
            },
          ],
        },
      }),
    ],
  },
});