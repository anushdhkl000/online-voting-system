import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


const manifestForPlugIn = {
  registerType: "autoUpdate",
  manifest: {
    name: "Online_Voting",
    short_name: "Online_Voting",
    description: "Online_Voting",
    theme_color: "#171717",
    background_color: "#14a2b5",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "any"
  }
}

export default defineConfig({
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic"
        });
      }
    },
    // tailwindcss(),
    react(),
    VitePWA(manifestForPlugIn)
  ],
  optimizeDeps: {
    force: true,
    exclude: ["pdfkit"],
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  server: {
    port: 3002
  }
})
