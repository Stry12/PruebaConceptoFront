import { createContext, useContext, type ReactNode } from 'react';
import type { IMediaItemService } from '../core/interfaces/media-item/IMediaItemService';
import { dummyMediaItemService } from '../core/services/media-item/dummy-media-item-service';

interface AppContextValue {
  mediaItemService: IMediaItemService;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const value: AppContextValue = {
    mediaItemService: dummyMediaItemService,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
