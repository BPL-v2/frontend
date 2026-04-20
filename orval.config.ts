import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:8000/api/swagger/doc.json",
      override: {
        transformer: "./src/api/transformSpec.mjs",
      },
    },
    output: {
      target: "./src/api/generated/client.ts",
      schemas: "./src/api/generated/models",
      client: "react-query",
      httpClient: "fetch",
      mode: "tags-split",
      clean: true,
      formatter: "prettier",
      override: {
        header: false,
        useDates: true,
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: "./src/api/fetcher.ts",
          name: "customFetch",
        },
      },
    },
  },
});
