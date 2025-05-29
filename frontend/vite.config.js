import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(() => {
    // 1) load all VITE_* env vars into `env`
    // const env = loadEnv(mode, process.cwd())

    // 2) pick your API URL (fall back to localhost:8000 in dev)
    // const API_URL = env.VITE_API_URL || "http://localhost:8000";
    const API_URL = 'http://localhost:8000'

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            host: '0.0.0.0', // listen on LAN & localhost
            port: 5173,
            proxy: {
                '/api': {
                    target: API_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
            allowedHosts: true,
        },
        // optional: if you want to use import.meta.env.VITE_API_URL inside your app
        define: {
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
