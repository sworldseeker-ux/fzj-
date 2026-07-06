import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const categoriesPath = path.join(DATA_DIR, 'categories.json');
    if (fs.existsSync(categoriesPath)) {
      const data = fs.readFileSync(categoriesPath, 'utf-8');
      res.status(200).json({ success: true, data: JSON.parse(data) });
    } else {
      res.status(404).json({ success: false, message: 'Categories not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
