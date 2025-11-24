import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    port: 3006,
  },
  runtimeConfig: {
    public: {
      devAdminApiUrl: process.env.DEV_ADMIN_API_URL,
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/icon",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/tailwind.css", "~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
});
