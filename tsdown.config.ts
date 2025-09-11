import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/**/*.{js,ts}", "!src/**/*.d.{ts}"],
    platform: "neutral",
    dts: true
  }
]);
