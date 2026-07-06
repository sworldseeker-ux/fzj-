export interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  photoCount: number;
}

export interface Profile {
  id: string;
  name: string;
  nickname: string;
  siteTitle?: string;
  avatarUrl: string;
  bio: string;
  phone: string;
  wechat: string;
  wechatQrCodeUrl?: string;
  backgroundUrl?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  order: number;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  categoryId: string;
  photoCount: number;
  viewCount: number;
  createdAt: string;
  mediaItems?: MediaItem[];
}