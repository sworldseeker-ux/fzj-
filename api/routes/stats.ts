import express from 'express';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');

interface Stats {
  totalVisits: number;
}

const defaultStats: Stats = {
  totalVisits: 3795,
};

const statsFile = path.join(dataDir, 'stats.json');

const readStats = (): Stats => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(statsFile)) {
    fs.writeFileSync(statsFile, JSON.stringify(defaultStats, null, 2));
    return defaultStats;
  }
  const content = fs.readFileSync(statsFile, 'utf-8');
  return JSON.parse(content);
};

const writeStats = (stats: Stats): void => {
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
};

router.get('/', (req: Request, res: Response) => {
  const stats = readStats();
  res.json({ success: true, data: stats });
});

router.post('/visit', (req: Request, res: Response) => {
  const stats = readStats();
  stats.totalVisits += 1;
  writeStats(stats);
  res.json({ success: true, data: stats });
});

router.put('/', (req: Request, res: Response) => {
  const stats = readStats();
  const { totalVisits } = req.body;
  
  if (totalVisits !== undefined) {
    stats.totalVisits = totalVisits;
    writeStats(stats);
  }
  
  res.json({ success: true, data: stats });
});

export default router;
