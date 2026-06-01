import app from './server';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;

async function startDevServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Serve static assets via Vite's middleware
  app.use(vite.middlewares);

  app.listen(PORT, 'localhost', () => {
    console.log(`\n------------------------------------------------`);
    console.log(`Development Server successfully started on http://localhost:${PORT}`);
    console.log(`Open in your browser: http://localhost:${PORT}`);
    console.log(`------------------------------------------------\n`);
  });
}

startDevServer().catch((err) => {
  console.error("Vite server initialization failed", err);
});
