/* ─── Domain Types ─── */

export type MediaItemType =
  | 'book'
  | 'series'
  | 'film'
  | 'documentary'
  | 'manga'
  | 'comic'
  | 'magazine'
  | 'audiobook'
  | 'podcast'
  | 'course'
  | 'other';

export type ConsumptionStatus =
  | 'pending'
  | 'consuming'
  | 'completed'
  | 'abandoned'
  | 'favorite';

export interface MediaItem {
  id: string;
  userId: string;
  title: string;
  coverImage: string | null;
  description: string | null;
  creator: string;
  type: MediaItemType;
  genre: string;
  categoryId: string | null;
  status: ConsumptionStatus;
  addedAt: string;
  consumedAt: string | null;
  personalRating: 1 | 2 | 3 | 4 | 5 | null;
  notes: string | null;
  platform: string;
  sourceUrl: string | null;
  isFavorite: boolean;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CollectionItem {
  collectionId: string;
  mediaItemId: string;
}

export interface List {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface ListItem {
  listId: string;
  mediaItemId: string;
  position: number;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export const MEDIA_TYPE_LABELS: Record<MediaItemType, string> = {
  book: 'Book',
  series: 'Series',
  film: 'Film',
  documentary: 'Documentary',
  manga: 'Manga',
  comic: 'Comic',
  magazine: 'Magazine',
  audiobook: 'Audiobook',
  podcast: 'Podcast',
  course: 'Course',
  other: 'Other',
};

export const STATUS_LABELS: Record<ConsumptionStatus, string> = {
  pending: 'Pendiente',
  consuming: 'Consumiendo',
  completed: 'Completado',
  abandoned: 'Abandonado',
  favorite: 'Favorito',
};
