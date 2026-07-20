import type { IMediaItemService } from '../../interfaces/media-item/IMediaItemService';
import type { MediaItem } from '../../types';
import { dummyMediaItems } from '../../data/dummy-media-items';

let items = [...dummyMediaItems];

function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const dummyMediaItemService: IMediaItemService = {
  async getAll(): Promise<MediaItem[]> {
    await new Promise((r) => setTimeout(r, 300));
    return [...items];
  },

  async getById(id: string): Promise<MediaItem | null> {
    await new Promise((r) => setTimeout(r, 200));
    return items.find((item) => item.id === id) ?? null;
  },

  async create(newItem: Omit<MediaItem, 'id' | 'userId' | 'addedAt'>): Promise<MediaItem> {
    await new Promise((r) => setTimeout(r, 400));
    const item: MediaItem = {
      ...newItem,
      id: generateId(),
      userId: 'user-1',
      addedAt: new Date().toISOString(),
    };
    items = [item, ...items];
    return item;
  },

  async update(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    await new Promise((r) => setTimeout(r, 400));
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Item not found');
    items[index] = { ...items[index], ...updates };
    return items[index];
  },

  async delete(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    items = items.filter((item) => item.id !== id);
  },

  async toggleFavorite(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 200));
    const item = items.find((i) => i.id === id);
    if (!item) throw new Error('Item not found');
    item.isFavorite = !item.isFavorite;
    return item.isFavorite;
  },

  async changeStatus(id: string, status: MediaItem['status']): Promise<MediaItem> {
    await new Promise((r) => setTimeout(r, 300));
    const item = items.find((i) => i.id === id);
    if (!item) throw new Error('Item not found');
    item.status = status;
    if (status === 'completed') {
      item.consumedAt = new Date().toISOString();
    }
    return item;
  },
};
