import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node22",
    outDir: "dist",
    lib: {
      entry: "./src/app.ts",
      formats: ["es"],
      fileName: "app",
    },
    rollupOptions: {
      external: ["express", "dockerode", "discord-interactions"],
    },
  },
});
