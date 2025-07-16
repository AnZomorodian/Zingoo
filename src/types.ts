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

export interface ChatFilter {
  type: 'all' | 'unread' | 'groups' | 'archived' | 'favorites' | 'bots';
  searchQuery: string;
  tags: string[];
  dateRange?: { start: Date; end: Date };
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

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  autoDownload: AutoDownloadSettings;
  chatWallpaper: string;
  enterToSend: boolean;
  showMediaInGallery: boolean;
  dataUsage: DataUsageSettings;
  accessibility: AccessibilitySettings;
  advanced: AdvancedSettings;
}

export interface AutoDownloadSettings {
  photos: 'always' | 'wifi' | 'never';
  videos: 'always' | 'wifi' | 'never';
  files: 'always' | 'wifi' | 'never';
  voiceMessages: 'always' | 'wifi' | 'never';
  maxFileSize: number;
}

export interface DataUsageSettings {
  lowDataMode: boolean;
  compressImages: boolean;
  compressVideos: boolean;
  preloadMessages: boolean;
  syncFrequency: 'realtime' | 'frequent' | 'normal' | 'battery';
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindSupport: boolean;
}

export interface AdvancedSettings {
  developerMode: boolean;
  debugLogging: boolean;
  experimentalFeatures: boolean;
  customCSS: string;
  apiEndpoint: string;
  cacheSize: number;
  maxBackupSize: number;
}

export interface EmojiCategory {
  id: string;
  name: string;
  icon: string;
  emojis: string[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  uploadProgress?: number;
  isUploading?: boolean;
  error?: string;
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

export interface TypingIndicator {
  userId: string;
  chatId: string;
  timestamp: Date;
}

export interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
  activity: 'active' | 'idle' | 'away';
}

export interface Notification {
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

export interface UserActivity {
  userId: string;
  type: 'message' | 'call' | 'login' | 'logout' | 'status_change' | 'profile_update';
  timestamp: Date;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
}

export interface ChatAnalytics {
  chatId: string;
  messageCount: number;
  participantCount: number;
  averageResponseTime: number;
  mostActiveHours: number[];
  mostUsedEmojis: Array<{ emoji: string; count: number }>;
  wordCloud: Array<{ word: string; frequency: number }>;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  mediaShared: {
    images: number;
    videos: number;
    files: number;
    voice: number;
  };
  topParticipants: Array<{ userId: string; messageCount: number }>;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  isCustom: boolean;
  usageCount: number;
  createdAt: Date;
  tags: string[];
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  action: string;
  shortcut?: string;
  isEnabled: boolean;
  category: string;
}

export interface BackupData {
  version: string;
  timestamp: Date;
  profile: User;
  chats: Chat[];
  messages: Record<string, Message[]>;
  settings: AppSettings;
  customizations: any;
}

export interface SearchResult {
  type: 'chat' | 'message' | 'contact';
  id: string;
  title: string;
  subtitle: string;
  avatar?: string;
  timestamp?: Date;
  relevance: number;
  context?: string;
}

export interface VoiceNote {
  id: string;
  duration: number;
  waveform: number[];
  transcript?: string;
  isTranscribing?: boolean;
  quality: 'low' | 'medium' | 'high';
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  timestamp: Date;
}

export interface ContactData {
  name: string;
  phoneNumbers: string[];
  emails: string[];
  avatar?: string;
  organization?: string;
}

export interface StickerPack {
  id: string;
  name: string;
  author: string;
  thumbnail: string;
  stickers: Sticker[];
  isInstalled: boolean;
  isPremium: boolean;
  downloadCount: number;
  rating: number;
}

export interface Sticker {
  id: string;
  url: string;
  emoji: string;
  keywords: string[];
}

export interface CallType {
  VOICE: 'voice';
  VIDEO: 'video';
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