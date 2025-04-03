
import type { ConversationsSlice } from './slices/conversationsSlice';
import type { ProjectsSlice } from './slices/projectsSlice';
import type { FilesSlice } from './slices/filesSlice';

export type StoreState = ConversationsSlice & ProjectsSlice & FilesSlice;
