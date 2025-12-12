import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Относительный путь для GitHub Pages
  base: './',
  build: {
    // Явно указываем папку сборки
    outDir: 'dist',
    // Отключаем source maps для ускорения сборки
    sourcemap: false,
    // Увеличиваем лимит предупреждения о размере чанков
    chunkSizeWarningLimit: 1600,
  }
})