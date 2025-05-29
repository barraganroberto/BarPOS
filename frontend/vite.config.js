import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
    // Load any VITE_* vars from .env, .env.development, etc.
    const env = loadEnv(mode, process.cwd())

    // In production, VITE_API_URL should be set to your backend host.
    // In dev, fall back to localhost:8000
    const API_URL =
        env.VITE_API_URL ||
        (mode === 'development' ? 'http://localhost:8000' : '')

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            host: '0.0.0.0',
            port: 5173,
            proxy: {
                // Proxy /api/* to your backend
                '/api': {
                    target: API_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
            // allow any host (including ngrok domains)
            allowedHosts: true,
        },
        define: {
            // Make the final API_URL available in your client code
            'import.meta.env.VITE_API_URL': JSON.stringify(API_URL),
        },
    }
})

// https://vite.dev/config/
// export default defineConfig({
//     plugins: [react(), tailwindcss()],
//     server: {
//         host: '0.0.0.0',
//         port: 5173,
//         proxy: {
//             '/api': {
//                 target: import.meta.env.VITE_API_URL || 'http://localhost:8000',
//                 changeOrigin: true,
//                 secure: false,
//                 rewrite: (p) => p.replace(/^\/api/, ''),
//             },
//         },
//     },
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, './src'),
//         },
//     },
// })

// ngrok http 5173
