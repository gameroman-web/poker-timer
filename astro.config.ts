import solid from "@astrojs/solid-js";
import { serwist } from "@serwist/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [solid(), serwist()],
  vite: { plugins: [tailwindcss()] },
});
