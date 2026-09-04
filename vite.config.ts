import { defineConfig } from "@lovable.dev/vite-tanstack-config";

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
              if (id.includes("@tiptap") || id.includes("prosemirror") || id.includes("markdown-it")) {
                return "vendor-editor";
              }
              if (id.includes("jszip")) {
                return "vendor-zip";
              }
              if (id.includes("lucide-react")) {
                return "vendor-icons";
              }
              if (id.includes("@tanstack")) {
                return "vendor-tanstack";
              }
              if (id.includes("@supabase")) {
                return "vendor-supabase";
              }
              return "vendor";
            }
          },
        },
      },
    },
    plugins: [],
  },
});