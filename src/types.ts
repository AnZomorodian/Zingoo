// Core User Types
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  isOnline: boolean;
  lastSeen: Date;
  bio: string;
  email: string;
  phone?: string;
  joinedDate: Date;
  theme: UserTheme;
  privacy: PrivacySettings;
  notifications: NotificationSettings;
  customization: UserCustomization;
  achievements: Achievement[];
  preferences: UserPreferences;
  blockedUsers: string[];
  favoriteChats: string[];
  pinnedChats: string[];
}

export interface UserStatus {
  type: 'online' | 'away' | 'busy' | 'invisible' | 'custom';
  text: string;
  emoji?: string;
  expiresAt?: Date;
  autoReply?: string;
  showToContacts?: boolean;
}

export interface UserTheme {
  mode: 'light' | 'dark' | 'auto' | 'custom';
  primaryColor: string;
  accentColor: string;
  backgroundImage?: string;
  customCSS?: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'sharp' | 'rounded' | 'pill';
  animations: boolean;
}

export interface UserCustomization {
  chatWallpaper: string;
  messageStyle: 'bubble' | 'compact' | 'minimal';
  soundTheme: string;
  animationsEnabled: boolean;
  compactMode: boolean;
  showAvatars: boolean;
  showTimestamps: boolean;
  groupMessagesBy: 'none' | 'sender' | 'time';
  messagePreview: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'messaging' | 'social' | 'customization' | 'milestone';
  progress?: number;
  maxProgress?: number;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  enterToSend: boolean;
  showTypingIndicators: boolean;
  showReadReceipts: boolean;
  showOnlineStatus: boolean;
  autoDownloadMedia: boolean;
  dataUsageMode: 'low' | 'medium' | 'high';
  backupFrequency: 'never' | 'daily' | 'weekly' | 'monthly';
  autoDeleteMessages: boolean;
  autoDeleteDuration: number; // in days
}

// Message Types
export interface Message {
  id: string;
  content: string;
  type: MessageType;
  sender: string;
  chatId: string;
  timestamp: Date;
  isOwn: boolean;
  isRead: boolean;
  reactions: MessageReaction[];
  replyTo?: string;
  forwardedFrom?: string;
  isEdited: boolean;
  editedAt?: Date;
  metadata?: MessageMetadata;
  deliveryStatus: DeliveryStatus;
  isScheduled?: boolean;
  scheduledFor?: Date;
  isImportant?: boolean;
  mentions?: string[];
  hashtags?: string[];
  isDeleted?: boolean;
  deletedAt?: Date;
  expiresAt?: Date;
}

export type MessageType = 
  | 'text' 
  | 'image' 
  | 'file' 
  | 'voice' 
  | 'video' 
  | 'location' 
  | 'contact' 
  | 'poll' 
  | 'sticker'
  | 'gif'
  | 'link'
  | 'code'
  | 'system';

export type DeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageMetadata {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnail?: string;
  duration?: number; // for voice/video messages
  dimensions?: { width: number; height: number };
  location?: LocationData;
  contact?: ContactData;
  poll?: PollData;
  voiceWaveform?: number[];
  linkPreview?: LinkPreview;
  codeLanguage?: string;
  encryption?: EncryptionData;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
  accuracy?: number;
}

export interface ContactData {
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  organization?: string;
}

export interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  expiresAt?: Date;
  isAnonymous: boolean;
  totalVotes: number;
  createdBy: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[];
  percentage: number;
}

export interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export interface EncryptionData {
  algorithm: string;
  keyId: string;
  isEncrypted: boolean;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
  timestamp: Date;
}

// Chat Types
export interface Chat {
  id: string;
  name: string;
  avatar: string;
  type: ChatType;
  participants: string[];
  adminIds?: string[];
  lastMessage: Message | null;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  settings: ChatSettings;
  permissions: ChatPermissions;
  tags: string[];
  category: string;
  isTyping?: boolean;
  typingUsers?: TypingUser[];
  lastActivity: Date;
  messageCount: number;
  mediaCount: number;
  linkCount: number;
}

export type ChatType = 'direct' | 'group' | 'channel' | 'bot' | 'broadcast';

export interface TypingUser {
  userId: string;
  timestamp: Date;
}

export interface ChatSettings {
  wallpaper: string;
  theme: string;
  notificationSound: string;
  autoDeleteMessages: boolean;
  autoDeleteDuration: number;
  readReceiptsEnabled: boolean;
  typingIndicatorsEnabled: boolean;
  messageEncryption: boolean;
  backupEnabled: boolean;
  allowInvites: boolean;
  moderationEnabled: boolean;
  slowMode?: number; // seconds between messages
  maxMessageLength?: number;
}

export interface ChatPermissions {
  canSendMessages: boolean;
  canSendMedia: boolean;
  canAddMembers: boolean;
  canRemoveMembers: boolean;
  canChangeSettings: boolean;
  canDeleteMessages: boolean;
  canPinMessages: boolean;
  canCreatePolls: boolean;
  canMentionAll: boolean;
  canChangeAvatar: boolean;
  canChangeDescription: boolean;
}

// Notification Types
export interface NotificationSettings {
  sounds: boolean;
  desktop: boolean;
  mobile: boolean;
  previews: boolean;
  vibration: boolean;
  messageReactions: boolean;
  newMessages: boolean;
  groupMentions: boolean;
  directMessages: boolean;
  calls: boolean;
  quietHours: QuietHours;
  customSounds: Record<string, string>;
  priority: NotificationPriority;
  groupByChat: boolean;
  showSender: boolean;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  days: string[];
  allowImportant: boolean;
  allowCalls: boolean;
}

export type NotificationPriority = 'all' | 'mentions' | 'direct' | 'none';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  actions?: NotificationAction[];
  data?: any;
  expiresAt?: Date;
  chatId?: string;
  userId?: string;
  avatar?: string;
}

export type NotificationType = 
  | 'message' 
  | 'call' 
  | 'mention' 
  | 'reaction' 
  | 'system' 
  | 'update' 
  | 'reminder' 
  | 'achievement'
  | 'friend_request'
  | 'group_invite'
  | 'status_update';

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  style: 'default' | 'primary' | 'destructive';
  data?: any;
}

// Privacy Types
export interface PrivacySettings {
  showOnlineStatus: PrivacyLevel;
  showReadReceipts: PrivacyLevel;
  showTypingIndicator: PrivacyLevel;
  showLastSeen: PrivacyLevel;
  profilePhotoPrivacy: PrivacyLevel;
  aboutPrivacy: PrivacyLevel;
  phoneNumberPrivacy: PrivacyLevel;
  groupInvitePrivacy: PrivacyLevel;
  callPrivacy: PrivacyLevel;
  forwardedMessagesPrivacy: PrivacyLevel;
  blockedUsers: string[];
  allowUnknownContacts: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  dataRetention: number; // days
  allowAnalytics: boolean;
  allowCrashReports: boolean;
}

export type PrivacyLevel = 'everyone' | 'contacts' | 'nobody' | 'custom';

// Call Types
export interface CallSession {
  id: string;
  chatId: string;
  type: CallType;
  participants: CallParticipant[];
  status: CallStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  quality: CallQuality;
  isRecorded?: boolean;
  recordingUrl?: string;
  settings: CallSettings;
  metadata?: CallMetadata;
}

export type CallType = 'voice' | 'video' | 'screen_share';
export type CallStatus = 'ringing' | 'active' | 'ended' | 'missed' | 'declined' | 'busy';
export type CallQuality = 'poor' | 'fair' | 'good' | 'excellent';

export interface CallParticipant {
  userId: string;
  joinedAt: Date;
  leftAt?: Date;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionQuality: CallQuality;
}

export interface CallSettings {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  recordingEnabled: boolean;
  backgroundBlur: boolean;
  noiseCancellation: boolean;
  echoCancellation: boolean;
}

export interface CallMetadata {
  bandwidth: number;
  latency: number;
  packetLoss: number;
  codec: string;
  resolution?: string;
  frameRate?: number;
}

// Statistics and Analytics
export interface ProfileStats {
  totalMessages: number;
  totalChats: number;
  totalCalls: number;
  totalFiles: number;
  averageResponseTime: number;
  mostActiveDay: string;
  joinedDaysAgo: number;
  favoriteEmojis: Array<{ emoji: string; count: number }>;
  chatDistribution: Array<{ type: string; count: number }>;
  activityHeatmap: Array<{ hour: number; activity: number }>;
  messagesByDay: Array<{ date: string; count: number }>;
  topContacts: Array<{ userId: string; messageCount: number }>;
  mediaShared: Array<{ type: string; count: number }>;
  callDuration: number; // total minutes
  achievementCount: number;
}

export interface ChatAnalytics {
  messageCount: number;
  participantCount: number;
  averageResponseTime: number;
  mostActiveUser: string;
  mostUsedEmojis: Array<{ emoji: string; count: number }>;
  messagesByHour: Array<{ hour: number; count: number }>;
  messagesByDay: Array<{ date: string; count: number }>;
  mediaShared: number;
  linksShared: number;
  pollsCreated: number;
  averageMessageLength: number;
  peakActivity: { hour: number; day: string };
}

// Search and Filter Types
export interface SearchResult {
  type: 'message' | 'chat' | 'user' | 'file';
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  timestamp?: Date;
  chatId?: string;
  messageId?: string;
  relevance: number;
  context?: string;
}

export interface SearchFilters {
  type?: 'all' | 'messages' | 'media' | 'files' | 'links';
  dateRange?: { start: Date; end: Date };
  sender?: string;
  chatId?: string;
  hasAttachments?: boolean;
  isImportant?: boolean;
  messageType?: MessageType;
}

// Theme and Customization
export interface CustomTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Export utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event types for real-time updates
export interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: Date;
  userId?: string;
  chatId?: string;
}

export interface MessageEvent extends RealtimeEvent {
  type: 'message_sent' | 'message_edited' | 'message_deleted' | 'message_reaction';
  data: Message | { messageId: string; reaction: MessageReaction };
}

export interface TypingEvent extends RealtimeEvent {
  type: 'typing_start' | 'typing_stop';
  data: { userId: string; chatId: string };
}

export interface PresenceEvent extends RealtimeEvent {
  type: 'user_online' | 'user_offline' | 'user_status_change';
  data: { userId: string; status?: UserStatus; lastSeen?: Date };
}

export interface CallEvent extends RealtimeEvent {
  type: 'call_start' | 'call_end' | 'call_join' | 'call_leave';
  data: CallSession | { callId: string; userId: string };
}
