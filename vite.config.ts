import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import path from "path";
import { defineConfig } from "vite";

// Load environment variables from .env file
config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    // Disabling react compiler until we can fix the issues with table
    // react({
    //   babel: {
    //     plugins: ["babel-plugin-react-compiler"],
    //   },
    // }),
    tailwindcss(),
  ],
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
  // for dev
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "./src/api"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@mytypes": path.resolve(__dirname, "./src/mytypes"),
      "@icons": path.resolve(__dirname, "./src/icons"),
      "@rules": path.resolve(__dirname, "./src/rules"),
    },
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react/")
          ) {
            return "@react";
          }
          if (id.includes("node_modules/uplot")) {
            return "@uplot";
          }
          if (id.includes("node_modules/@tanstack/")) {
            return "@tanstack";
          }
          if (id.includes("node_modules/@headlessui/")) {
            return "@headlessui";
          }
          if (
            id.includes("node_modules/clsx/") ||
            id.includes("node_modules/dayjs/") ||
            id.includes("node_modules/isomorphic-fetch/") ||
            id.includes("node_modules/tailwind-merge/") ||
            id.includes("node_modules/url/")
          ) {
            return "@vendor";
          }
        },
      },
    },
  },
});
