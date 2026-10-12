import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));



  // API to upload and sync PDF for all users
  app.post('/api/upload-pdf', (req, res) => {
    try {
      const { pdfBase64, filename } = req.body;
      if (!pdfBase64) {
        return res.status(400).json({ error: 'No PDF base64 provided' });
      }

      const publicDir = path.resolve(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const targetPath = path.join(publicDir, 'guide.pdf');
      const buffer = Buffer.from(pdfBase64, 'base64');
      fs.writeFileSync(targetPath, buffer);

      console.log(`[Server] Successfully synced new PDF: ${filename || 'guide.pdf'} (${buffer.length} bytes) for all users!`);
      return res.json({ success: true, size: buffer.length });
    } catch (err: any) {
      console.error('[Server] Failed to save PDF:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // API to upload field/page images and sync across PC & mobile
  app.post('/api/upload-image', (req, res) => {
    try {
      const { imageBase64, filename, apartmentId } = req.body;
      if (!imageBase64) {
        console.error('[Server] /api/upload-image error: No image base64 provided');
        return res.status(400).json({ error: 'No image base64 provided' });
      }

      const imagesDir = path.resolve(process.cwd(), 'public', 'images');
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      let ext = '.jpg';
      if (filename && typeof filename === 'string') {
        const parsedExt = path.extname(filename).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(parsedExt)) {
          ext = parsedExt;
        }
      }

      const safeAptId = apartmentId ? String(apartmentId).replace(/[^a-zA-Z0-9-_]/g, '') : '';
      if (safeAptId) {
        const files = fs.readdirSync(imagesDir);
        for (const f of files) {
          if (f.startsWith(`${safeAptId}.`)) {
            try {
              fs.unlinkSync(path.join(imagesDir, f));
            } catch {}
          }
        }
      }
      const cleanName = safeAptId ? `${safeAptId}.jpg` : `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.jpg`;
      const targetPath = path.join(imagesDir, cleanName);
      
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(targetPath, buffer);

      // Verify file actually exists and is non-empty
      if (!fs.existsSync(targetPath) || fs.statSync(targetPath).size === 0) {
        throw new Error('File storage verification failed on server disk');
      }

      const imageUrl = `/images/${cleanName}`;
      console.log(`[Server] Successfully saved and verified image for apartment ${safeAptId || 'general'} at ${targetPath} -> URL: ${imageUrl} (${buffer.length} bytes)`);
      return res.json({ success: true, url: imageUrl });
    } catch (err: any) {
      console.error('[Server] Failed to save image:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Explicit middleware for /images/ to ensure image files are served correctly or return 404 (preventing text/html SPA fallback)
  app.use('/images', (req, res, next) => {
    const filename = req.path.replace(/^\/+/, '');
    const filePath = path.resolve(process.cwd(), 'public', 'images', filename);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.sendFile(filePath);
    } else {
      console.warn(`[Server] Image file not found on disk: ${filePath}`);
      res.status(404).json({ error: 'Image not found' });
    }
  });

  // API to save application state in .data directory outside public
  app.post('/api/save-state', (req, res) => {
    try {
      const stateData = req.body;
      const dataDir = path.resolve(process.cwd(), '.data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const statePath = path.join(dataDir, 'app-state.json');
      fs.writeFileSync(statePath, JSON.stringify(stateData, null, 2));
      console.log(`[Server] Successfully saved app state to ${statePath} (${JSON.stringify(stateData).length} chars)`);
      return res.json({ success: true });
    } catch (err: any) {
      console.error('[Server] Failed to save state:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // API to load application state from .data directory
  app.get('/api/load-state', (req, res) => {
    try {
      const statePath = path.resolve(process.cwd(), '.data', 'app-state.json');
      if (fs.existsSync(statePath)) {
        const raw = fs.readFileSync(statePath, 'utf-8');
        console.log(`[Server] Successfully loaded app state from ${statePath}`);
        return res.json(JSON.parse(raw));
      }
      console.log(`[Server] No saved app state found at ${statePath}, returning empty object.`);
      return res.json({});
    } catch (err: any) {
      console.error('[Server] Failed to load state:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Serve static files from public
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
