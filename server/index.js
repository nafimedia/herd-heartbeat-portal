import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import { config } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = express();

// Middleware
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ limit: '10mb', extended: true }));

// Mount API routes from app.js FIRST (these take priority)
server.use(app);

// Serve the Vite SPA build.
const publicPath = path.join(__dirname, '..', 'dist');
server.use(express.static(publicPath, {
  maxAge: '1d',
  etag: false,
}));

// SPA fallback: serve index.html for client-side routing
server.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Failed to serve index.html:', err);
      res.status(404).json({ error: 'Not found' });
    }
  });
});

// Error handler
server.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

server.listen(config.port, config.host, () => {
  console.log(`Farm Portal running at http://${config.host}:${config.port}`);
  console.log(`   API endpoints: /api/*`);
  console.log(`   Frontend: http://localhost:${config.port}`);
});
