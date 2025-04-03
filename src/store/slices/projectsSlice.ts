
import { v4 as uuidv4 } from 'uuid';
import type { Project } from '@/types';
import { StoreState } from '../types';

export interface ProjectsSlice {
  projects: Project[];
  selectedProjectId: string | null;
  createProject: (name: string, description: string) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (id: string | null) => void;
  linkConversationToProject: (conversationId: string, projectId: string) => void;
}

const createProjectsSlice = (set: any, get: () => StoreState) => ({
  projects: [],
  selectedProjectId: null,

  createProject: (name, description) => {
    const id = uuidv4();
    const now = new Date();
    const newProject: Project = {
      id,
      name,
      description,
      created: now,
      lastUpdated: now,
      conversations: [],
      files: [],
    };
    
    set(state => ({ 
      projects: [...state.projects, newProject],
      selectedProjectId: id
    }));

    return id;
  },

  updateProject: (id, updates) => {
    set(state => ({
      projects: state.projects.map(project => 
        project.id === id 
          ? { ...project, ...updates, lastUpdated: new Date() } 
          : project
      )
    }));
  },

  deleteProject: (id) => {
    // First, get all conversation IDs linked to this project
    const project = get().projects.find(p => p.id === id);
    const conversationIds = project?.conversations || [];
    
    // Update conversations to remove project link
    set(state => ({
      conversations: state.conversations.map(conv => 
        conv.projectId === id 
          ? { ...conv, projectId: undefined, lastUpdated: new Date() } 
          : conv
      ),
      // Remove project
      projects: state.projects.filter(project => project.id !== id),
      // Update selected project if needed
      selectedProjectId: state.selectedProjectId === id 
        ? (state.projects.length > 1 
          ? state.projects.find(p => p.id !== id)?.id || null 
          : null) 
        : state.selectedProjectId
    }));
  },

  setSelectedProject: (id) => {
    set({ selectedProjectId: id });
  },

  linkConversationToProject: (conversationId, projectId) => {
    // Update the conversation
    set(state => ({
      conversations: state.conversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, projectId, lastUpdated: new Date() } 
          : conv
      )
    }));

    // Add the conversation to the project if not already there
    const project = get().projects.find(p => p.id === projectId);
    if (project && !project.conversations.includes(conversationId)) {
      set(state => ({
        projects: state.projects.map(p => 
          p.id === projectId 
            ? { 
                ...p, 
                conversations: [...p.conversations, conversationId],
                lastUpdated: new Date()
              } 
            : p
        )
      }));
    }
  },
});

export default createProjectsSlice;
