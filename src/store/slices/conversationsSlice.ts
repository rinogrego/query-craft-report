
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, Message } from '@/types';
import { StoreState } from '../types';

export interface ConversationsSlice {
  conversations: Conversation[];
  currentConversationId: string | null;
  createConversation: (projectId?: string) => string;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  addMessage: (conversationId: string, content: string, role: 'user' | 'bot') => void;
}

const createConversationsSlice = (set: any, get: () => StoreState) => ({
  conversations: [],
  currentConversationId: null,

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
});

export default createConversationsSlice;
