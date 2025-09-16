import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/**/*.{js,ts}", "!src/**/*.d.{ts}"],
    copy: {
      from: "src/shell",
      to: "dist/shell"
    },
    platform: "node",
    dts: false,
    minify: true,
    clean: true,
    format: ["esm"]
  }
]);
