
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createConversationsSlice from './slices/conversationsSlice';
import createProjectsSlice from './slices/projectsSlice';
import createFilesSlice from './slices/filesSlice';
import type { StoreState } from './types';

export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createConversationsSlice(set, get),
      ...createProjectsSlice(set, get),
      ...createFilesSlice(set, get),
    }),
    {
      name: 'query-craft-storage',
    }
  )
);
