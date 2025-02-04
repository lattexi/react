/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/~lauralek/react/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest-setup.js",
  },
});
