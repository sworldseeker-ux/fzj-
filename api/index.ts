import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../data/uploads')));

const DATA_DIR = path.join(__dirname, '../data');

app.use('/api/health', (req: VercelRequest, res: VercelResponse) => {
  res.status(200).json({ success: true, message: 'ok', dataDir: DATA_DIR });
});

app.use('/api/profile', async (req: VercelRequest, res: VercelResponse) => {
  try {
    const fs = await import('fs');
    const profilePath = path.join(DATA_DIR, 'profile.json');
    if (fs.default.existsSync(profilePath)) {
      const data = fs.default.readFileSync(profilePath, 'utf-8');
      res.status(200).json({ success: true, data: JSON.parse(data) });
    } else {
      res.status(404).json({ success: false, message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default app;
