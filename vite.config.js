import { defineConfig } from "vite";
import { resolve } from "path";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: "build",
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      assets: resolve(__dirname, "src/assets"),
      components: resolve(__dirname, "src/components"),
      config: resolve(__dirname, "src/config"),
      contexts: resolve(__dirname, "src/contexts"),
      helpers: resolve(__dirname, "src/helpers"),
      hooks: resolve(__dirname, "src/hooks"),
    },
  },
});
