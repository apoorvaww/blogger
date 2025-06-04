import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the v4 plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add the v4 Tailwind plugin here
  ],
});