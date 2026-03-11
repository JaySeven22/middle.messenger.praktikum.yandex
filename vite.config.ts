import { defineConfig } from 'vite'

import dotenv from 'dotenv';

// используйте его. До этой строчки process.env не будет содержать указанных в .env переменных. После — будет
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: Number(process.env.PORT) || 8000,
        open: true,
    },
    build: {
        outDir: 'dist',
    },
}) 