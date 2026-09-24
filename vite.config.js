import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // listens on all network interfaces, shows your LAN IP
    port: 5173,   // change if you want a different port
  },
})