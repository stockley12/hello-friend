import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  build: {
    target: 'es2015',
    minify: false,  // NO MINIFICATION - easier to debug
    sourcemap: true,
  }
});
