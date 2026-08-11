import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv lê o .env manualmente aqui porque este arquivo roda em Node
  // (não no navegador) e precisamos da key SEM o prefixo VITE_, ou seja,
  // ela nunca é incluída no bundle que vai pro cliente.
  const env = loadEnv(mode, process.cwd(), '')
  const TICKETMASTER_API_KEY = env.TICKETMASTER_API_KEY

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/ticketmaster': {
          target: 'https://app.ticketmaster.com/discovery/v2',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ticketmaster/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const separator = proxyReq.path.includes('?') ? '&' : '?'
              proxyReq.path += `${separator}apikey=${TICKETMASTER_API_KEY}`
            })
          },
        },
      },
    },
  }
})
