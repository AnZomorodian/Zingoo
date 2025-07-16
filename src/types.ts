export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  isOnline: boolean;
  lastSeen: Date;
  bio: string;
  email: string;
  phone: string;
  joinedDate: Date;
  theme: UserTheme;
  privacy: PrivacySettings;
  notifications: NotificationSettings;
  customization: UserCustomization;
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface UserStatus {
  type: 'online' | 'away' | 'busy' | 'invisible' | 'custom';
  text: string;
  emoji?: string;
  expiresAt?: Date;
  autoReply?: string;
}

export interface UserTheme {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  backgroundImage?: string;
  customCSS?: string;
}

export interface UserCustomization {
  chatWallpaper: string;
  fontSize: 'small' | 'medium' | 'large';
  messageStyle: 'bubble' | 'compact' | 'minimal';
  soundTheme: string;
  animationsEnabled: boolean;
  compactMode: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
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
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video' | 'location' | 'contact' | 'poll' | 'sticker';
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  isRead: boolean;
  reactions: MessageReaction[];
  replyTo: string | null;
  isEdited: boolean;
  editedAt?: Date;
  forwardedFrom?: string;
  metadata?: MessageMetadata;
  deliveryStatus: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  isScheduled?: boolean;
  scheduledFor?: Date;
  isImportant?: boolean;
  mentions?: string[];
  hashtags?: string[];
}

export interface MessageMetadata {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  thumbnail?: string;
  duration?: number;
  dimensions?: { width: number; height: number };
  location?: { lat: number; lng: number; address: string };
  contact?: { name: string; phone: string; email?: string };
  poll?: PollData;
  voiceWaveform?: number[];
}

export interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  expiresAt?: Date;
  isAnonymous: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[];
  percentage: number;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  type: 'direct' | 'group' | 'channel' | 'bot';
  participants: string[];
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
  adminIds?: string[];
  isTyping?: boolean;
  typingUsers?: string[];
  settings: ChatSettings;
  permissions: ChatPermissions;
  tags: string[];
  category: string;
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
}

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
}

export interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  days: string[];
  allowImportant: boolean;
}

export interface PrivacySettings {
  showOnlineStatus: 'everyone' | 'contacts' | 'nobody';
  showReadReceipts: 'everyone' | 'contacts' | 'nobody';
  showTypingIndicator: 'everyone' | 'contacts' | 'nobody';
  showLastSeen: 'everyone' | 'contacts' | 'nobody';
  profilePhotoPrivacy: 'everyone' | 'contacts' | 'nobody';
  aboutPrivacy: 'everyone' | 'contacts' | 'nobody';
  phoneNumberPrivacy: 'everyone' | 'contacts' | 'nobody';
  groupInvitePrivacy: 'everyone' | 'contacts' | 'nobody';
  callPrivacy: 'everyone' | 'contacts' | 'nobody';
  blockedUsers: string[];
  allowUnknownContacts: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
}

export interface CallSession {
  id: string;
  chatId: string;
  type: 'voice' | 'video';
  participants: string[];
  status: 'ringing' | 'active' | 'ended' | 'missed' | 'declined';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  isRecorded?: boolean;
  recordingUrl?: string;
}

export interface AppNotification {
  id: string;
  type: 'message' | 'call' | 'mention' | 'reaction' | 'system' | 'update' | 'reminder' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  actions?: NotificationAction[];
  data?: any;
  expiresAt?: Date;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  style: 'default' | 'primary' | 'destructive';
}

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
}

export interface CallType {
  VOICE: 'voice';
  VIDEO: 'video';
}