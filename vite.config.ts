import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  readFileSync(join(__dirname, "package.json"), "utf-8")
);

export default defineConfig(({ mode }) => {
  const isSingleFile = mode === "singlefile";

  return {
    base: "/",
    plugins: [
      react(),
      ...(isSingleFile ? [viteSingleFile()] : []),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    define: {
      "import.meta.env.VITE_VERSION": JSON.stringify(packageJson.version),
    },
    build: isSingleFile
      ? {
          assetsInlineLimit: 100000000,
          chunkSizeWarningLimit: 100000000,
          cssCodeSplit: false,
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
            },
          },
        }
      : {},
  };
});
