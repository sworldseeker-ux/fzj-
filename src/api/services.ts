import { Category, Gallery, Profile, MediaItem } from '../types';

const BASE_URL = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const galleryApi = {
  getAll: async (categoryId?: string): Promise<Gallery[]> => {
    const url = categoryId && categoryId !== 'all' 
      ? `${BASE_URL}/galleries?categoryId=${categoryId}` 
      : `${BASE_URL}/galleries`;
    const res = await fetch(url);
    const json = await res.json() as ApiResponse<Gallery[]>;
    return json.data || [];
  },

  getById: async (id: string): Promise<Gallery | null> => {
    const res = await fetch(`${BASE_URL}/galleries/${id}`);
    const json = await res.json() as ApiResponse<Gallery>;
    return json.data || null;
  },

  create: async (data: Omit<Gallery, 'id' | 'createdAt'>): Promise<Gallery | null> => {
    const res = await fetch(`${BASE_URL}/galleries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json() as ApiResponse<Gallery>;
    return json.data || null;
  },

  update: async (id: string, data: Partial<Omit<Gallery, 'id' | 'createdAt'>>): Promise<Gallery | null> => {
    const res = await fetch(`${BASE_URL}/galleries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json() as ApiResponse<Gallery>;
    return json.data || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const res = await fetch(`${BASE_URL}/galleries/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json() as ApiResponse<null>;
    return json.success;
  },

  getMedia: async (galleryId: string): Promise<MediaItem[]> => {
    const res = await fetch(`${BASE_URL}/galleries/${galleryId}/media`);
    const json = await res.json() as ApiResponse<MediaItem[]>;
    return json.data || [];
  },

  addMedia: async (galleryId: string, data: Omit<MediaItem, 'id' | 'order'>): Promise<MediaItem | null> => {
    const res = await fetch(`${BASE_URL}/galleries/${galleryId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json() as ApiResponse<MediaItem>;
    return json.data || null;
  },

  updateMedia: async (galleryId: string, mediaId: string, data: Partial<MediaItem>): Promise<MediaItem | null> => {
    const res = await fetch(`${BASE_URL}/galleries/${galleryId}/media/${mediaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json() as ApiResponse<MediaItem>;
    return json.data || null;
  },

  deleteMedia: async (galleryId: string, mediaId: string): Promise<boolean> => {
    const res = await fetch(`${BASE_URL}/galleries/${galleryId}/media/${mediaId}`, {
      method: 'DELETE',
    });
    const json = await res.json() as ApiResponse<null>;
    return json.success;
  },

  reorderMedia: async (galleryId: string, mediaIds: string[]): Promise<MediaItem[] | null> => {
    const res = await fetch(`${BASE_URL}/galleries/${galleryId}/media/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaIds }),
    });
    const json = await res.json() as ApiResponse<MediaItem[]>;
    return json.data || null;
  },

  incrementVisit: async (galleryId: string): Promise<Gallery | null> => {
    const res = await fetch(`${BASE_URL}/galleries/${galleryId}/visit`, {
      method: 'POST',
    });
    const json = await res.json() as ApiResponse<Gallery>;
    return json.data || null;
  },
};

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await fetch(`${BASE_URL}/categories`);
    const json = await res.json() as ApiResponse<Category[]>;
    return json.data || [];
  },

  create: async (data: Omit<Category, 'id' | 'photoCount'>): Promise<Category | null> => {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json() as ApiResponse<Category>;
    return json.data || null;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category | null> => {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json() as ApiResponse<Category>;
    return json.data || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json() as ApiResponse<null>;
    return json.success;
  },
};

export const profileApi = {
  get: async (): Promise<Profile | null> => {
    const res = await fetch(`${BASE_URL}/profile`);
    const json = await res.json() as ApiResponse<Profile>;
    return json.data || null;
  },

  update: async (data: Partial<Profile>): Promise<Profile | null> => {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json() as ApiResponse<Profile>;
    return json.data || null;
  },
};

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface Stats {
  totalVisits: number;
}

export const uploadApi = {
  upload: async (file: File): Promise<UploadResult | null> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json() as ApiResponse<UploadResult>;
    return json.data || null;
  },

  uploadMultiple: async (files: File[]): Promise<UploadResult[] | null> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const res = await fetch(`${BASE_URL}/upload/multiple`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json() as ApiResponse<UploadResult[]>;
    return json.data || null;
  },
};

export const statsApi = {
  get: async (): Promise<Stats | null> => {
    const res = await fetch(`${BASE_URL}/stats`);
    const json = await res.json() as ApiResponse<Stats>;
    return json.data || null;
  },

  incrementVisit: async (): Promise<Stats | null> => {
    const res = await fetch(`${BASE_URL}/stats/visit`, {
      method: 'POST',
    });
    const json = await res.json() as ApiResponse<Stats>;
    return json.data || null;
  },

  update: async (data: Partial<Stats>): Promise<Stats | null> => {
    const res = await fetch(`${BASE_URL}/stats`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json() as ApiResponse<Stats>;
    return json.data || null;
  },
};
