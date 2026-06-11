import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["tests/setup.ts"],
    include: ["tests/api/smoke.generated.ts", "tests/api/manual/**/*.ts"],
    reporters: [
      "default",
      ["html", { outputFile: "test-reports/html/smoke/report.html" }],
    ],
    outputFile: {
      html: "test-reports/html/smoke/report.html",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
