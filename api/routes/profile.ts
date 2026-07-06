import { Router, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');

interface Profile {
  id: string;
  name: string;
  nickname: string;
  siteTitle: string;
  avatarUrl: string;
  bio: string;
  phone: string;
  wechat: string;
  wechatQrCodeUrl?: string;
  backgroundUrl: string;
}

const defaultProfile: Profile = {
  id: '1',
  name: 'Ljx',
  nickname: 'Ljx',
  siteTitle: 'Ljx Space',
  avatarUrl: 'https://picsum.photos/seed/avatar1/512/512',
  bio: '医学生一枚，纯爱好，瘾大\n所有图片均有RAW文件有版权\n站内图片均为压缩版，严禁盗图',
  phone: '189-8270-6989',
  wechat: 'LjxPhotograph',
  backgroundUrl: 'https://picsum.photos/seed/bg1/1920/1080',
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readProfile(): Profile {
  ensureDataDir();
  if (!fs.existsSync(PROFILE_FILE)) {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(defaultProfile, null, 2));
    return defaultProfile;
  }
  try {
    const data = fs.readFileSync(PROFILE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(defaultProfile, null, 2));
    return defaultProfile;
  }
}

function writeProfile(profile: Profile) {
  ensureDataDir();
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const profile = readProfile();
  res.json({ success: true, data: profile });
});

router.put('/', (req: Request, res: Response) => {
  const profile = readProfile();
  const { name, nickname, siteTitle, avatarUrl, bio, phone, wechat, wechatQrCodeUrl, backgroundUrl } = req.body;
  
  const updatedProfile: Profile = {
    ...profile,
    name: name !== undefined ? name : profile.name,
    nickname: nickname !== undefined ? nickname : profile.nickname,
    siteTitle: siteTitle !== undefined ? siteTitle : profile.siteTitle,
    avatarUrl: avatarUrl !== undefined ? avatarUrl : profile.avatarUrl,
    bio: bio !== undefined ? bio : profile.bio,
    phone: phone !== undefined ? phone : profile.phone,
    wechat: wechat !== undefined ? wechat : profile.wechat,
    wechatQrCodeUrl: wechatQrCodeUrl !== undefined ? wechatQrCodeUrl : profile.wechatQrCodeUrl,
    backgroundUrl: backgroundUrl !== undefined ? backgroundUrl : profile.backgroundUrl,
  };
  
  writeProfile(updatedProfile);
  
  res.json({ success: true, data: updatedProfile });
});

export default router;
