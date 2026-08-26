import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      target: "esnext",
      minify: "esbuild",
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // ১. ভারী এডিটর প্যাকেজ আলাদা চাঙ্কে রাখা (হিরো পেজের লোড স্পিড বাড়াবে)
            if (id.includes("@tiptap") || id.includes("prosemirror")) {
              return "editor-bundle";
            }
            // ২. কোর রাউটিং ও কুয়েরি লাইব্রেরি আলাদা রাখা
            if (id.includes("@tanstack/react-query") || id.includes("@tanstack/react-router")) {
              return "router-query";
            }
            // ৩. ব্যাকএন্ড কানেক্টর
            if (id.includes("@supabase/supabase-js")) {
              return "supabase";
            }
            // ৪. রিঅ্যাক্ট কোর ভেন্ডর
            if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
              return "react-core";
            }
          },
        },
      },
    },
    plugins: [
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        injectRegister: "auto",
        filename: "sw.js",
        devOptions: { enabled: false },
        manifest: false,
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: "/",
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//, /^\/_serverFn\//],
          globPatterns: ["**/*.{js,css,html,woff2,png,svg,json}"],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "quran-pages",
                networkTimeoutSeconds: 2,
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ url, sameOrigin }) =>
                sameOrigin && url.pathname.startsWith("/assets/"),
              handler: "CacheFirst",
              options: {
                cacheName: "quran-assets",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // ১ বছর ক্যাশ
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/data\/quran\/surahs\/.*\.json$/,
              handler: "CacheFirst",
              options: {
                cacheName: "quran-text-v1",
                expiration: {
                  maxEntries: 150,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/everyayah\.com\/data\/.*\.mp3$/,
              handler: "CacheFirst",
              options: {
                cacheName: "quran-audio-v1",
                expiration: {
                  maxEntries: 7000,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "quran-fonts",
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
      }),
    ],
  },
});