import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("lucide-react")) {
                return "vendor-icons";
              }
              if (id.includes("@tanstack")) {
                return "vendor-tanstack";
              }
              return "vendor";
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
          // ওয়ার্নিং দূর করতে সঠিক গ্লোব প্যাটার্ন ফিক্স করা হলো
          globPatterns: ["**/*.{js,css,html,json}"],
          globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
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
                  maxAgeSeconds: 60 * 60 * 24 * 365,
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