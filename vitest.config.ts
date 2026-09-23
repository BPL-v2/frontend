import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@api": path.resolve(import.meta.dirname, "./src/api"),
      "@utils": path.resolve(import.meta.dirname, "./src/utils"),
      "@components": path.resolve(import.meta.dirname, "./src/components"),
      "@mytypes": path.resolve(import.meta.dirname, "./src/mytypes"),
      "@icons": path.resolve(import.meta.dirname, "./src/icons"),
      "@rules": path.resolve(import.meta.dirname, "./src/rules"),
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
