import type { MediaItem } from '../../types';

export interface MediaItemDTO {
  id: string;
  userId: string;
  title: string;
  coverImage: string | null;
  description: string | null;
  creator: string;
  type: MediaItem['type'];
  genre: string;
  categoryId: string | null;
  status: MediaItem['status'];
  addedAt: string;
  consumedAt: string | null;
  personalRating: number | null;
  notes: string | null;
  platform: string;
  sourceUrl: string | null;
  isFavorite: boolean;
}
