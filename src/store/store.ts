
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, Message, Project, UploadedFile } from '@/types';

interface AppState {
  conversations: Conversation[];
  currentConversationId: string | null;
  projects: Project[];
  selectedProjectId: string | null;

  // Conversation Actions
  createConversation: (projectId?: string) => string;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  
  // Message Actions
  addMessage: (conversationId: string, content: string, role: 'user' | 'bot') => void;
  
  // Project Actions
  createProject: (name: string, description: string) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (id: string | null) => void;
  linkConversationToProject: (conversationId: string, projectId: string) => void;
  
  // File Actions
  addFile: (file: Omit<UploadedFile, 'id'>) => string;
  removeFile: (fileId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      projects: [],
      selectedProjectId: null,

      createConversation: (projectId) => {
        const id = uuidv4();
        const now = new Date();
        const newConversation: Conversation = {
          id,
          name: `New Conversation ${get().conversations.length + 1}`,
          messages: [],
          projectId,
          lastUpdated: now,
          created: now,
        };
        
        set(state => ({ 
          conversations: [...state.conversations, newConversation],
          currentConversationId: id
        }));

        // If this conversation is linked to a project, update the project
        if (projectId) {
          get().linkConversationToProject(id, projectId);
        }

        return id;
      },

      updateConversation: (id, updates) => {
        set(state => ({
          conversations: state.conversations.map(conv => 
            conv.id === id 
              ? { ...conv, ...updates, lastUpdated: new Date() } 
              : conv
          )
        }));
      },

      deleteConversation: (id) => {
        const conversation = get().conversations.find(c => c.id === id);
        
        set(state => ({
          conversations: state.conversations.filter(conv => conv.id !== id),
          currentConversationId: state.currentConversationId === id 
            ? (state.conversations.length > 1 
              ? state.conversations.find(c => c.id !== id)?.id || null 
              : null) 
            : state.currentConversationId
        }));

        // If this conversation is linked to a project, update the project
        if (conversation?.projectId) {
          set(state => ({
            projects: state.projects.map(project => 
              project.id === conversation.projectId 
                ? { 
                    ...project, 
                    conversations: project.conversations.filter(convId => convId !== id),
                    lastUpdated: new Date()
                  } 
                : project
            )
          }));
        }
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id });
      },

      addMessage: (conversationId, content, role) => {
        const message: Message = {
          id: uuidv4(),
          content,
          role,
          timestamp: new Date(),
        };

        set(state => ({
          conversations: state.conversations.map(conv => 
            conv.id === conversationId 
              ? { 
                  ...conv, 
                  messages: [...conv.messages, message],
                  lastUpdated: new Date()
                } 
              : conv
          )
        }));
      },

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
    }),
    {
      name: 'query-craft-storage',
    }
  )
);
