import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["tests/setup.ts"],
    include: ["tests/api/integration.generated.ts", "tests/api/manual/**/*.ts"],
    reporters: [
      "default",
      ["html", { outputFile: "test-reports/html/integration/report.html" }],
    ],
    outputFile: {
      html: "test-reports/html/integration/report.html",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
