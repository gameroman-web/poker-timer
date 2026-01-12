import solid from "@astrojs/solid-js";
import { serwist } from "@serwist/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    solid(),
    serwist({
      swSrc: "src/sw.ts",
      globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
