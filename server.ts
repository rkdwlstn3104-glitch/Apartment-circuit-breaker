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

  // API to upload field/page images and sync across PC & mobile.
  // Writes the new file first and only removes old apartment images after the write succeeds.
  app.post('/api/upload-image', (req, res) => {
    let tempPath = '';
    try {
      const { imageBase64, filename, apartmentId } = req.body ?? {};
      if (typeof imageBase64 !== 'string' || !imageBase64.trim()) {
        return res.status(400).json({ success: false, error: '이미지 데이터가 없습니다.' });
      }

      const dataUrlMatch = imageBase64.match(/^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,([\s\S]+)$/i);
      const base64Data = dataUrlMatch ? dataUrlMatch[2] : imageBase64;
      const mimeType = dataUrlMatch?.[1]?.toLowerCase();
      const extByMime: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif',
      };
      const extByFilename: Record<string, string> = {
        '.jpg': '.jpg', '.jpeg': '.jpg', '.png': '.png', '.webp': '.webp', '.gif': '.gif',
      };
      const requestedExt = typeof filename === 'string' ? path.extname(filename).toLowerCase() : '';
      const ext = (mimeType && extByMime[mimeType]) || extByFilename[requestedExt] || '.jpg';
      const buffer = Buffer.from(base64Data, 'base64');
      if (!buffer.length) {
        return res.status(400).json({ success: false, error: '이미지 데이터가 비어 있거나 올바르지 않습니다.' });
      }
      // Reject obviously non-image payloads rather than saving arbitrary data as an image.
      const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      const isPng = buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const isGif = buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii'));
      const isWebp = buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
      if (!(isJpeg || isPng || isGif || isWebp)) {
        return res.status(400).json({ success: false, error: '지원되는 이미지 파일(JPG, PNG, WEBP, GIF)이 아닙니다.' });
      }

      const imagesDir = path.resolve(process.env.IMAGE_STORAGE_DIR || path.resolve(process.cwd(), 'public', 'images'));
      fs.mkdirSync(imagesDir, { recursive: true });

      const safeAptId = apartmentId ? String(apartmentId).replace(/[^a-zA-Z0-9-_]/g, '') : '';
      if (apartmentId && !safeAptId) {
        return res.status(400).json({ success: false, error: '아파트 식별자가 올바르지 않습니다.' });
      }
      const cleanName = safeAptId
        ? `${safeAptId}${ext}`
        : `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
      const targetPath = path.join(imagesDir, cleanName);
      tempPath = path.join(imagesDir, `.${cleanName}.${process.pid}.${Date.now()}.tmp`);

      // Atomic replacement: preserve the previous image if writing the new one fails.
      fs.writeFileSync(tempPath, buffer, { flag: 'wx' });
      if (!fs.existsSync(tempPath) || fs.statSync(tempPath).size !== buffer.length) {
        throw new Error('서버에 저장된 이미지 검증에 실패했습니다.');
      }
      fs.renameSync(tempPath, targetPath);
      tempPath = '';

      // Remove older extensions only after the new image has been saved successfully.
      if (safeAptId) {
        for (const oldName of fs.readdirSync(imagesDir)) {
          if (oldName !== cleanName && oldName.startsWith(`${safeAptId}.`) && /\.(jpg|jpeg|png|webp|gif)$/i.test(oldName)) {
            try { fs.unlinkSync(path.join(imagesDir, oldName)); } catch (cleanupError) {
              console.warn('[Server] Old image cleanup failed:', cleanupError);
            }
          }
        }
      }

      const imageUrl = `/images/${cleanName}`;
      console.log(`[Server] Image saved and verified: ${imageUrl} (${buffer.length} bytes)`);
      return res.json({ success: true, url: imageUrl, size: buffer.length });
    } catch (err: any) {
      if (tempPath) {
        try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch {}
      }
      console.error('[Server] Failed to save image:', err);
      return res.status(500).json({ success: false, error: '서버 이미지 저장에 실패했습니다. 서버 로그를 확인해 주세요.' });
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
