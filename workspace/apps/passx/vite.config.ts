import { fileURLToPath, URL } from "node:url";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("../../shared", import.meta.url)),
    },
  },
});
