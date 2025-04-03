
import { v4 as uuidv4 } from 'uuid';
import type { UploadedFile } from '@/types';
import { StoreState } from '../types';

export interface FilesSlice {
  addFile: (file: Omit<UploadedFile, 'id'>) => string;
  removeFile: (fileId: string) => void;
}

const createFilesSlice = (set: any, get: () => StoreState) => ({
  addFile: (file) => {
    const id = uuidv4();
    const newFile = { ...file, id };

    // If the file is associated with a project, add it to the project
    if (file.projectId) {
      set(state => ({
        projects: state.projects.map(project => 
          project.id === file.projectId 
            ? { 
                ...project, 
                files: [...project.files, newFile],
                lastUpdated: new Date()
              } 
            : project
        )
      }));
    }

    return id;
  },

  removeFile: (fileId) => {
    // Remove file from all projects
    set(state => ({
      projects: state.projects.map(project => ({
        ...project,
        files: project.files.filter(file => file.id !== fileId),
        lastUpdated: project.files.some(file => file.id === fileId) ? new Date() : project.lastUpdated
      }))
    }));
  },
});

export default createFilesSlice;
