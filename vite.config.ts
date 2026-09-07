import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	base: '/',
	build: {
		outDir: 'dist',
	},
	plugins: [react()],
	resolve: {
		alias: {
			src: '/src',
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use 'src/assets/styles/helpers' as *;`,
			},
		},
	},
	server: {
		// host: '192.168.31.171',
		port: 5666,
		open: true,
		cors: {
			origin: '*',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		},
		proxy: {
			'/api': {
				target: 'https://api.npotau.ru',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
})
