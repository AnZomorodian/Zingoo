import { useState, useEffect, useCallback } from 'react';
import { User, UserStatus, UserTheme, PrivacySettings, NotificationSettings, ProfileStats, Achievement } from '../types';

const defaultProfile: User = {
  id: 'current-user',
  name: 'Alex Johnson',
  avatar: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
  status: {
    type: 'online',
    text: 'Available',
    emoji: '😊'
  },
  isOnline: true,
  lastSeen: new Date(),
  bio: 'Hey there! I am using this amazing messenger app.',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  joinedDate: new Date('2023-01-01'),
  theme: {
    mode: 'dark',
    primaryColor: '#2196f3',
    accentColor: '#4caf50'
  },
  privacy: {
    showOnlineStatus: 'everyone',
    showReadReceipts: 'everyone',
    showTypingIndicator: 'everyone',
    showLastSeen: 'contacts',
    profilePhotoPrivacy: 'everyone',
    aboutPrivacy: 'everyone',
    phoneNumberPrivacy: 'contacts',
    groupInvitePrivacy: 'contacts',
    callPrivacy: 'everyone',
    blockedUsers: [],
    allowUnknownContacts: true,
    twoFactorAuth: false,
    sessionTimeout: 30
  },
  notifications: {
    sounds: true,
    desktop: true,
    mobile: true,
    previews: true,
    vibration: true,
    messageReactions: true,
    newMessages: true,
    groupMentions: true,
    directMessages: true,
    calls: true,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      allowImportant: true
    },
    customSounds: {}
  },
  customization: {
    chatWallpaper: 'default',
    fontSize: 'medium',
    messageStyle: 'bubble',
    soundTheme: 'default',
    animationsEnabled: true,
    compactMode: false
  },
  achievements: [],
  preferences: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    enterToSend: true,
    showTypingIndicators: true,
    showReadReceipts: true,
    showOnlineStatus: true,
    autoDownloadMedia: true,
    dataUsageMode: 'medium'
  }
};

export const useProfile = () => {
  const [profile, setProfile] = useState<User>(() => {
    const saved = localStorage.getItem('messenger-profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultProfile,
        ...parsed,
        joinedDate: new Date(parsed.joinedDate || defaultProfile.joinedDate),
        lastSeen: new Date(parsed.lastSeen || defaultProfile.lastSeen),
        status: {
          ...parsed.status,
          expiresAt: parsed.status?.expiresAt ? new Date(parsed.status.expiresAt) : undefined
        },
        achievements: (parsed.achievements || []).map((achievement: any) => ({
          ...achievement,
          unlockedAt: new Date(achievement.unlockedAt)
        }))
      };
    }
    return defaultProfile;
  });

  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalMessages: 0,
    totalChats: 0,
    totalCalls: 0,
    totalFiles: 0,
    averageResponseTime: 0,
    mostActiveDay: 'Monday',
    joinedDaysAgo: 0,
    favoriteEmojis: [],
    chatDistribution: [],
    activityHeatmap: []
  });

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('messenger-profile', JSON.stringify(profile));
    
    // Update document title and favicon based on profile
    document.title = `${profile.name} - Messenger`;
    
    // Update CSS custom properties for theme
    const root = document.documentElement;
    root.style.setProperty('--user-primary-color', profile.theme.primaryColor);
    root.style.setProperty('--user-accent-color', profile.theme.accentColor);
    
    // Calculate stats
    calculateProfileStats();
  }, [profile]);

  const calculateProfileStats = useCallback(() => {
    const joinedDaysAgo = Math.floor((new Date().getTime() - profile.joinedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Simulate stats calculation (in real app, this would come from backend)
    const stats: ProfileStats = {
      totalMessages: Math.floor(Math.random() * 5000) + 1000,
      totalChats: Math.floor(Math.random() * 50) + 10,
      totalCalls: Math.floor(Math.random() * 100) + 20,
      totalFiles: Math.floor(Math.random() * 200) + 50,
      averageResponseTime: Math.floor(Math.random() * 300) + 60, // seconds
      mostActiveDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][Math.floor(Math.random() * 7)],
      joinedDaysAgo,
      favoriteEmojis: [
        { emoji: '😊', count: 45 },
        { emoji: '👍', count: 32 },
        { emoji: '❤️', count: 28 },
        { emoji: '😂', count: 25 },
        { emoji: '🔥', count: 18 }
      ],
      chatDistribution: [
        { type: 'Direct', count: 35 },
        { type: 'Groups', count: 12 },
        { type: 'Channels', count: 3 }
      ],
      activityHeatmap: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        activity: Math.floor(Math.random() * 100)
      }))
    };
    
    setProfileStats(stats);
  }, [profile.joinedDate]);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      
      // Trigger achievement check
      checkAchievements(updated);
      
      return updated;
    });
  }, []);

  const updateStatus = useCallback((status: UserStatus) => {
    setProfile(prev => ({
      ...prev,
      status,
      isOnline: status.type !== 'invisible'
    }));
  }, []);

  const updateAvatar = useCallback((avatarUrl: string) => {
    setProfile(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
  }, []);

  const updateTheme = useCallback((theme: Partial<UserTheme>) => {
    setProfile(prev => ({
      ...prev,
      theme: { ...prev.theme, ...theme }
    }));
  }, []);

  const updatePrivacySettings = useCallback((privacy: Partial<PrivacySettings>) => {
    setProfile(prev => ({
      ...prev,
      privacy: { ...prev.privacy, ...privacy }
    }));
  }, []);

  const updateNotificationSettings = useCallback((notifications: Partial<NotificationSettings>) => {
    setProfile(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...notifications }
    }));
  }, []);

  const checkAchievements = useCallback((updatedProfile: User) => {
    const newAchievements: Achievement[] = [];
    
    // Profile completion achievement
    if (updatedProfile.bio && updatedProfile.bio.length > 10 && 
        !updatedProfile.achievements.find(a => a.id === 'profile_complete')) {
      newAchievements.push({
        id: 'profile_complete',
        name: 'Profile Master',
        description: 'Complete your profile with a bio',
        icon: '👤',
        unlockedAt: new Date(),
        rarity: 'common'
      });
    }
    
    // Theme customization achievement
    if (updatedProfile.theme.primaryColor !== defaultProfile.theme.primaryColor &&
        !updatedProfile.achievements.find(a => a.id === 'theme_customizer')) {
      newAchievements.push({
        id: 'theme_customizer',
        name: 'Style Guru',
        description: 'Customize your theme colors',
        icon: '🎨',
        unlockedAt: new Date(),
        rarity: 'common'
      });
    }
    
    // Privacy conscious achievement
    if (updatedProfile.privacy.twoFactorAuth &&
        !updatedProfile.achievements.find(a => a.id === 'security_expert')) {
      newAchievements.push({
        id: 'security_expert',
        name: 'Security Expert',
        description: 'Enable two-factor authentication',
        icon: '🔒',
        unlockedAt: new Date(),
        rarity: 'rare'
      });
    }
    
    if (newAchievements.length > 0) {
      setProfile(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }));
    }
  }, []);

  const getProfileStats = useCallback(() => profileStats, [profileStats]);

  const exportProfile = useCallback(() => {
    const exportData = {
      profile,
      stats: profileStats,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '_')}_profile_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [profile, profileStats]);

  const importProfile = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);
          if (importData.profile && importData.version) {
            setProfile(prev => ({
              ...prev,
              ...importData.profile,
              id: prev.id // Keep current user ID
            }));
            resolve();
          } else {
            reject(new Error('Invalid profile file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse profile file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
    localStorage.removeItem('messenger-profile');
  }, []);

  const toggleOnlineStatus = useCallback(() => {
    setProfile(prev => ({
      ...prev,
      isOnline: !prev.isOnline,
      status: {
        ...prev.status,
        type: prev.isOnline ? 'invisible' : 'online'
      }
    }));
  }, []);

  const addCustomStatus = useCallback((statusText: string, emoji?: string, expiresAt?: Date) => {
    const customStatus: UserStatus = {
      type: 'custom',
      text: statusText,
      emoji,
      expiresAt
    };
    updateStatus(customStatus);
  }, [updateStatus]);

  const clearStatus = useCallback(() => {
    updateStatus({
      type: 'online',
      text: 'Available'
    });
  }, [updateStatus]);

  return {
    profile,
    updateProfile,
    updateStatus,
    updateAvatar,
    updateTheme,
    updatePrivacySettings,
    updateNotificationSettings,
    getProfileStats,
    exportProfile,
    importProfile,
    resetProfile,
    toggleOnlineStatus,
    addCustomStatus,
    clearStatus,
    achievements: profile.achievements
  };
};