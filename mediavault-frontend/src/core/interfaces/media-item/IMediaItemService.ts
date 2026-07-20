import type { MediaItem } from '../types';

export interface IMediaItemService {
  getAll(): Promise<MediaItem[]>;
  getById(id: string): Promise<MediaItem | null>;
  create(item: Omit<MediaItem, 'id' | 'userId' | 'addedAt'>): Promise<MediaItem>;
  update(id: string, updates: Partial<MediaItem>): Promise<MediaItem>;
  delete(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<boolean>;
  changeStatus(id: string, status: MediaItem['status']): Promise<MediaItem>;
}
