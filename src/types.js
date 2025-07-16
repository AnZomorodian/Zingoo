export interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
  bio?: string;
  email: string;
  phone: string;
  isOnline: boolean;
  joinedDate: Date;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
  reactions: MessageReaction[];
  isEdited?: boolean;
  fileName?: string;
  fileSize?: number;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage: Message | null;
  unreadCount: number;
  isOnline: boolean;
  isMuted: boolean;
  isTyping?: boolean;
  isPinned: boolean;
  isArchived: boolean;
  updatedAt: Date;
}

export interface Theme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  borderColor: string;
  borderRadius?: number;
  shadowIntensity?: number;
  animationSpeed?: string;
}