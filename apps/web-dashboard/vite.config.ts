import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_URL || "https://dealsense-api-6o2h.onrender.com";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@contracts": path.resolve(__dirname, "../../packages/contracts/src"),
      },
    },
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        // Proxy OAuth callback to API when running locally  
        "/oauth/callback": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => `/api/v1${path}`,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
