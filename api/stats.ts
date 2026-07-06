import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');

export default function handler(req: any, res: any) {
  try {
    const statsPath = path.join(DATA_DIR, 'stats.json');
    if (fs.existsSync(statsPath)) {
      const data = fs.readFileSync(statsPath, 'utf-8');
      res.status(200).json({ success: true, data: JSON.parse(data) });
    } else {
      res.status(404).json({ success: false, message: 'Stats not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
