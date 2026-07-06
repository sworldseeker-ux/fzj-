import { Router, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const GALLERIES_FILE = path.join(DATA_DIR, 'galleries.json');

interface MediaItem {
  id: string;
  url: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  order: number;
}

interface Gallery {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  categoryId: string;
  photoCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
  mediaItems?: MediaItem[];
}

const defaultGalleries: Gallery[] = [
  { id: '1', title: '调色对照展示', description: '原图和成片对比展示，未放人像精修对照', coverImage: 'https://picsum.photos/seed/palette1/800/1000', categoryId: 'small', photoCount: 26, viewCount: 474, createdAt: '2024-01-15' },
  { id: '2', title: '夏季 川西', description: '川西高原的夏日风光', coverImage: 'https://picsum.photos/seed/sichuan1/800/1000', categoryId: 'nature', photoCount: 45, viewCount: 1234, createdAt: '2024-07-20' },
  { id: '3', title: '粉黛花海', description: '浪漫的等待是秋天里最美的期待', coverImage: 'https://picsum.photos/seed/pinkflower/800/1000', categoryId: 'nature', photoCount: 18, viewCount: 892, createdAt: '2024-10-05' },
  { id: '4', title: '冬季 川西', description: '图片较多，景点较多', coverImage: 'https://picsum.photos/seed/winter1/800/1000', categoryId: 'nature', photoCount: 67, viewCount: 2156, createdAt: '2024-12-15' },
  { id: '5', title: '天青色等烟雨', description: '最美的不是下雨天，是曾与你躲过雨的屋檐', coverImage: 'https://picsum.photos/seed/rainy/800/1000', categoryId: 'small', photoCount: 12, viewCount: 567, createdAt: '2024-03-20' },
  { id: '6', title: '扫街 人文', description: '城市街头的人文瞬间', coverImage: 'https://picsum.photos/seed/street1/800/1000', categoryId: 'documentary', photoCount: 24, viewCount: 342, createdAt: '2024-05-10' },
  { id: '7', title: '手心的蔷薇', description: '绚烂后枯萎 不完美 多美', coverImage: 'https://picsum.photos/seed/rose1/800/1000', categoryId: 'portrait', photoCount: 15, viewCount: 789, createdAt: '2024-06-15' },
  { id: '8', title: '打上花火', description: '夏日祭的烟火', coverImage: 'https://picsum.photos/seed/fireworks/800/1000', categoryId: 'small', photoCount: 8, viewCount: 432, createdAt: '2024-08-15' },
  { id: '9', title: '风与花的信', description: '风是信使，花是落款 把春日的温柔，一页页写进镜头里', coverImage: 'https://picsum.photos/seed/spring1/800/1000', categoryId: 'nature', photoCount: 30, viewCount: 1567, createdAt: '2024-04-10' },
  { id: '10', title: '光影 小景', description: '光影交织的小景', coverImage: 'https://picsum.photos/seed/light1/800/1000', categoryId: 'small', photoCount: 16, viewCount: 298, createdAt: '2024-02-20' },
  { id: '11', title: '人间四月天', description: '不必追赶花期，你本身就是一幅最鲜活的春日油画', coverImage: 'https://picsum.photos/seed/april/800/1000', categoryId: 'portrait', photoCount: 22, viewCount: 1123, createdAt: '2024-04-25' },
  { id: '12', title: '视频合集', description: 'B站id：亿点点不-样', coverImage: 'https://picsum.photos/seed/video1/800/1000', categoryId: 'video', photoCount: 5, viewCount: 678, createdAt: '2024-09-01' },
  { id: '13', title: '冬天的夏天', description: '哈尔滨索菲亚大教堂', coverImage: 'https://picsum.photos/seed/harbin/800/1000', categoryId: 'city', photoCount: 14, viewCount: 890, createdAt: '2024-01-10' },
  { id: '14', title: '四川 南充', description: '家乡的风景', coverImage: 'https://picsum.photos/seed/nanchong/800/1000', categoryId: 'city', photoCount: 20, viewCount: 456, createdAt: '2024-02-15' },
  { id: '15', title: '亲子照', description: '温馨的亲子时光', coverImage: 'https://picsum.photos/seed/family/800/1000', categoryId: 'portrait', photoCount: 18, viewCount: 723, createdAt: '2024-05-20' },
  { id: '16', title: '成都成都', description: '天府之国', coverImage: 'https://picsum.photos/seed/chengdu/800/1000', categoryId: 'city', photoCount: 25, viewCount: 1345, createdAt: '2024-03-10' },
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readGalleries(): Gallery[] {
  ensureDataDir();
  if (!fs.existsSync(GALLERIES_FILE)) {
    fs.writeFileSync(GALLERIES_FILE, JSON.stringify(defaultGalleries, null, 2));
    return defaultGalleries;
  }
  try {
    const data = fs.readFileSync(GALLERIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    fs.writeFileSync(GALLERIES_FILE, JSON.stringify(defaultGalleries, null, 2));
    return defaultGalleries;
  }
}

function writeGalleries(galleries: Gallery[]) {
  ensureDataDir();
  fs.writeFileSync(GALLERIES_FILE, JSON.stringify(galleries, null, 2));
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const categoryId = req.query.categoryId as string;
  
  if (categoryId && categoryId !== 'all') {
    const filtered = galleries.filter(g => g.categoryId === categoryId);
    res.json({ success: true, data: filtered });
  } else {
    res.json({ success: true, data: galleries });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const gallery = galleries.find(g => g.id === req.params.id);
  
  if (gallery) {
    res.json({ success: true, data: gallery });
  } else {
    res.status(404).json({ success: false, message: 'Gallery not found' });
  }
});

router.post('/:id/visit', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const index = galleries.findIndex(g => g.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Gallery not found' });
  }
  
  galleries[index].viewCount = (galleries[index].viewCount || 0) + 1;
  galleries[index].updatedAt = new Date().toISOString().split('T')[0];
  
  writeGalleries(galleries);
  
  res.json({ success: true, data: galleries[index] });
});

router.post('/', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const { title, description, coverImage, categoryId } = req.body;
  
  if (!title || !coverImage) {
    return res.status(400).json({ success: false, message: 'Title and coverImage are required' });
  }
  
  const newGallery: Gallery = {
    id: Date.now().toString(),
    title,
    description: description || '',
    coverImage,
    categoryId: categoryId || '',
    photoCount: 0,
    viewCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    mediaItems: [],
  };
  
  galleries.unshift(newGallery);
  writeGalleries(galleries);
  
  res.status(201).json({ success: true, data: newGallery });
});

router.put('/:id', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const index = galleries.findIndex(g => g.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Gallery not found' });
  }
  
  const { title, description, coverImage, categoryId } = req.body;
  
  galleries[index] = {
    ...galleries[index],
    title: title !== undefined ? title : galleries[index].title,
    description: description !== undefined ? description : galleries[index].description,
    coverImage: coverImage !== undefined ? coverImage : galleries[index].coverImage,
    categoryId: categoryId !== undefined ? categoryId : galleries[index].categoryId,
    updatedAt: new Date().toISOString().split('T')[0],
  };
  
  writeGalleries(galleries);
  
  res.json({ success: true, data: galleries[index] });
});

router.delete('/:id', (req: Request, res: Response) => {
  let galleries = readGalleries();
  const initialLength = galleries.length;
  
  galleries = galleries.filter(g => g.id !== req.params.id);
  
  if (galleries.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Gallery not found' });
  }
  
  writeGalleries(galleries);
  
  res.json({ success: true, message: 'Gallery deleted' });
});

router.get('/:id/media', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const gallery = galleries.find(g => g.id === req.params.id);
  
  if (!gallery) {
    return res.status(404).json({ success: false, message: 'Gallery not found' });
  }
  
  res.json({ success: true, data: gallery.mediaItems || [] });
});

router.post('/:id/media', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const gallery = galleries.find(g => g.id === req.params.id);
  
  if (!gallery) {
    return res.status(404).json({ success: false, message: 'Gallery not found' });
  }
  
  const { url, title, description, type } = req.body;
  
  if (!url || !type) {
    return res.status(400).json({ success: false, message: 'URL and type are required' });
  }
  
  if (!gallery.mediaItems) {
    gallery.mediaItems = [];
  }
  
  const newMediaItem: MediaItem = {
    id: Date.now().toString(),
    url,
    title: title || '',
    description: description || '',
    type: type as 'image' | 'video',
    order: gallery.mediaItems.length,
  };
  
  gallery.mediaItems.push(newMediaItem);
  gallery.photoCount = gallery.mediaItems.length;
  gallery.updatedAt = new Date().toISOString().split('T')[0];
  
  writeGalleries(galleries);
  
  res.status(201).json({ success: true, data: newMediaItem });
});

router.put('/:id/media/:mediaId', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const gallery = galleries.find(g => g.id === req.params.id);
  
  if (!gallery) {
    return res.status(404).json({ success: false, message: 'Gallery not found' });
  }
  
  if (!gallery.mediaItems) {
    return res.status(404).json({ success: false, message: 'No media items found' });
  }
  
  const mediaItemIndex = gallery.mediaItems.findIndex(m => m.id === req.params.mediaId);
  
  if (mediaItemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Media item not found' });
  }
  
  const { title, description, order } = req.body;
  
  gallery.mediaItems[mediaItemIndex] = {
    ...gallery.mediaItems[mediaItemIndex],
    title: title !== undefined ? title : gallery.mediaItems[mediaItemIndex].title,
    description: description !== undefined ? description : gallery.mediaItems[mediaItemIndex].description,
    order: order !== undefined ? order : gallery.mediaItems[mediaItemIndex].order,
  };
  
  gallery.updatedAt = new Date().toISOString().split('T')[0];
  
  writeGalleries(galleries);
  
  res.json({ success: true, data: gallery.mediaItems[mediaItemIndex] });
});

router.delete('/:id/media/:mediaId', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const gallery = galleries.find(g => g.id === req.params.id);
  
  if (!gallery) {
    return res.status(404).json({ success: false, message: 'Gallery not found' });
  }
  
  if (!gallery.mediaItems) {
    return res.status(404).json({ success: false, message: 'No media items found' });
  }
  
  const initialLength = gallery.mediaItems.length;
  gallery.mediaItems = gallery.mediaItems.filter(m => m.id !== req.params.mediaId);
  
  if (gallery.mediaItems.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Media item not found' });
  }
  
  gallery.mediaItems.forEach((item, index) => {
    item.order = index;
  });
  
  gallery.photoCount = gallery.mediaItems.length;
  gallery.updatedAt = new Date().toISOString().split('T')[0];
  
  writeGalleries(galleries);
  
  res.json({ success: true, message: 'Media item deleted' });
});

router.put('/:id/media/reorder', (req: Request, res: Response) => {
  const galleries = readGalleries();
  const gallery = galleries.find(g => g.id === req.params.id);
  
  if (!gallery) {
    return res.status(404).json({ success: false, message: 'Gallery not found' });
  }
  
  if (!gallery.mediaItems) {
    return res.status(404).json({ success: false, message: 'No media items found' });
  }
  
  const { mediaIds } = req.body;
  
  if (!mediaIds || !Array.isArray(mediaIds)) {
    return res.status(400).json({ success: false, message: 'mediaIds array is required' });
  }
  
  const reorderedItems = mediaIds.map((id: string, index: number) => {
    const item = gallery.mediaItems!.find(m => m.id === id);
    if (item) {
      item.order = index;
    }
    return item;
  }).filter(Boolean);
  
  gallery.mediaItems = reorderedItems as MediaItem[];
  gallery.updatedAt = new Date().toISOString().split('T')[0];
  
  writeGalleries(galleries);
  
  res.json({ success: true, data: gallery.mediaItems });
});

export default router;
