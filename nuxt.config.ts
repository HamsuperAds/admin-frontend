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
      devApiUrl: process.env.DEV_API_URL,
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
    "@sidebase/nuxt-auth",
  ],
  css: ["~/assets/css/tailwind.css", "~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  auth: {
    baseURL: process.env.DEV_ADMIN_API_URL,
    globalAppMiddleware: true,
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "auth/sign-in", method: "post" },
        signOut: { path: "auth/sign-out", method: "post" },
        signUp: { path: "auth/signup", method: "post" },
        getSession: {
          path: "/auth/profile",
          method: "get",
        },
      },
      session: {
        dataResponsePointer: "/data",
      },
      token: {
        signInResponseTokenPointer: "data/token",
        maxAgeInSeconds: 2592000,
      },
      pages: {
        login: "/",
      },
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
});