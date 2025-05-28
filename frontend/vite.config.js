import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        // host: true, // same as host: '0.0.0.0'
        // port: 5173, // or whatever port you use
        // strictPort: false, // try next port if 5173 is busy
        // allowedHosts: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})

// ngrok http 5173