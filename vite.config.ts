import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        injectRegister: "auto",
        filename: "sw.js",
        devOptions: { enabled: true },
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
                networkTimeoutSeconds: 3,
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ url, sameOrigin }) =>
                sameOrigin && url.pathname.startsWith("/assets/"),
              handler: "CacheFirst",
              options: { cacheName: "quran-assets" },
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
              options: { cacheName: "quran-fonts" },
            },
          ],
        },
      }),
    ],
  },
});