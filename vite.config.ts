import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-serverless-routes',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const pathname = req.url ? req.url.split('?')[0] : '';
            if (pathname === '/api/health') {
              try {
                const mod = await server.ssrLoadModule('/api/health.ts');
                return await mod.default(req, res);
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
                return;
              }
            }
            if (pathname === '/api/traffic') {
              try {
                const mod = await server.ssrLoadModule('/api/traffic.ts');
                return await mod.default(req, res);
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
                return;
              }
            }
            if (pathname === '/api/trafficimages') {
              try {
                const mod = await server.ssrLoadModule('/api/trafficimages.ts');
                return await mod.default(req, res);
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
                return;
              }
            }
            if (pathname === '/api/trafficflow') {
              try {
                const mod = await server.ssrLoadModule('/api/trafficflow.ts');
                return await mod.default(req, res);
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
                return;
              }
            }
            if (pathname === '/api/vms') {
              try {
                const mod = await server.ssrLoadModule('/api/vms.ts');
                return await mod.default(req, res);
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
                return;
              }
            }
            next();
          });
        },
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

