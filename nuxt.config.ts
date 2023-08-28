import vuetify from "vite-plugin-vuetify";
import { InlineConfig } from "vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: "client/",
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: { transpile: ["vuetify"] },
  imports: { dirs: ["./stores"] },
  modules: [
    "@nuxtjs/apollo",
    ["@pinia/nuxt", { autoImports: ["defineStore", "acceptHMRUpdate"] }],
  ],
  apollo: {
    autoImports: true,
    proxyCookies: true,
    clients: {
      default: {
        httpEndpoint: "https://spacex-production.up.railway.app/",
      },
    },
  },
  hooks: {
    "vite:extendConfig": (config: InlineConfig) => {
      config?.plugins?.push(vuetify());
    },
  },
});
