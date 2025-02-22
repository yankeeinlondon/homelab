import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: "esm",
    dts: true,
    // experimentalDts: true,
    minify: true,
    outExtension: () => ({
        js: ".mjs",
        dts: ".ts"
    }),
    // sourcemap: true,
    clean: false,
    tsconfig: "./tsconfig.json",
});
