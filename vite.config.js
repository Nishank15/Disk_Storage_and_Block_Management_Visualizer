import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Disk_Storage_and_Block_Management_Visualizer/',
});
