import { Router, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

interface Category {
  id: string;
  name: string;
  slug: string;
  photoCount: number;
}

const defaultCategories: Category[] = [
  { id: 'all', name: '全部', slug: 'all', photoCount: 45 },
  { id: 'portrait', name: '人像写真', slug: 'portrait', photoCount: 12 },
  { id: 'nature', name: '自然风光', slug: 'nature', photoCount: 15 },
  { id: 'city', name: '城市风光', slug: 'city', photoCount: 8 },
  { id: 'small', name: '小景', slug: 'small', photoCount: 5 },
  { id: 'documentary', name: '人文纪实', slug: 'documentary', photoCount: 3 },
  { id: 'video', name: '视频', slug: 'video', photoCount: 2 },
  { id: 'event', name: '活动拍摄', slug: 'event', photoCount: 3 },
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readCategories(): Category[] {
  ensureDataDir();
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(defaultCategories, null, 2));
    return defaultCategories;
  }
  try {
    const data = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(defaultCategories, null, 2));
    return defaultCategories;
  }
}

function writeCategories(categories: Category[]) {
  ensureDataDir();
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const categories = readCategories();
  res.json({ success: true, data: categories });
});

router.post('/', (req: Request, res: Response) => {
  const categories = readCategories();
  const { name, slug } = req.body;
  
  if (!name || !slug) {
    return res.status(400).json({ success: false, message: 'Name and slug are required' });
  }
  
  const newCategory: Category = {
    id: slug,
    name,
    slug,
    photoCount: 0,
  };
  
  categories.push(newCategory);
  writeCategories(categories);
  
  res.status(201).json({ success: true, data: newCategory });
});

router.put('/:id', (req: Request, res: Response) => {
  const categories = readCategories();
  const index = categories.findIndex(c => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  
  const { name, slug, photoCount } = req.body;
  
  categories[index] = {
    ...categories[index],
    name: name !== undefined ? name : categories[index].name,
    slug: slug !== undefined ? slug : categories[index].slug,
    photoCount: photoCount !== undefined ? photoCount : categories[index].photoCount,
  };
  
  writeCategories(categories);
  
  res.json({ success: true, data: categories[index] });
});

router.delete('/:id', (req: Request, res: Response) => {
  let categories = readCategories();
  
  if (req.params.id === 'all') {
    return res.status(400).json({ success: false, message: 'Cannot delete "all" category' });
  }
  
  const initialLength = categories.length;
  categories = categories.filter(c => c.id !== req.params.id);
  
  if (categories.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  
  writeCategories(categories);
  
  res.json({ success: true, message: 'Category deleted' });
});

export default router;
