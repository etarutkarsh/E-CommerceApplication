import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external/dev URLs
    strictPort: true,
    allowedHosts: true, // allow ALL Codesandbox hosts
  },
});
