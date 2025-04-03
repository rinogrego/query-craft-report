
export type MessageRole = 'user' | 'bot';

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  projectId?: string;
  lastUpdated: Date;
  created: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created: Date;
  lastUpdated: Date;
  conversations: string[]; // Conversation IDs linked to this project
  files: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  projectId?: string;
  uploadDate: Date;
}

export interface UserIntent {
  purpose: string;
  dataRequirements: string[];
  expectedOutput: string;
}
