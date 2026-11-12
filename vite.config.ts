import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// GitHub Pages project site: https://<user>.github.io/mehanika-fsb-pages/
const base = process.env.VITE_BASE ?? "/mehanika-fsb-pages/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  server: {
    port: 3847,
    host: "127.0.0.1",
  },
  preview: {
    port: 3847,
    host: "127.0.0.1",
  },
});
