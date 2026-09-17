import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const REPONAMN = "kommuncirkular";

export default defineConfig(({ command }) => ({
  base: command === "build" ? `/${REPONAMN}/` : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3010,
    open: true,
  },
}));
