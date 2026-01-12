import solid from "@astrojs/solid-js";
import { serwist as pwa } from "@serwist/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    solid(),
    pwa({ type: "module", globPatterns: ["**/*.{js,css,html,svg,png,ico}"] }),
  ],
  vite: { plugins: [tailwindcss()] },
});
