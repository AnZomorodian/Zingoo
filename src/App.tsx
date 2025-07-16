import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, Search, Plus, Send, Paperclip, Smile, MoreVertical, Phone, Video, Pin, Star, Bell, BellOff, Archive, Trash2, Edit3, MessageCircle, Users, Clock, Check, CheckCheck, ArrowLeft, X, Heart, ThumbsUp, Laugh, Angry, Salad as Sad, Sunrise as Surprised, Camera, Upload, Palette, Shield, Globe, Moon, Sun, Zap, Activity, Headphones, Mic, MicOff, Volume2, VolumeX, Eye, EyeOff, Lock, Unlock, UserPlus, UserMinus, Crown, Award, Bookmark, Share, Download, Copy, RefreshCw, Wifi, WifiOff, Battery, Signal } from 'lucide-react';
import { ChatList } from './components/ChatList';
import { ChatArea } from './components/ChatArea';
import { UserProfile } from './components/UserProfile';
import { SettingsModal } from './components/SettingsModal';
import { EmojiPicker } from './components/EmojiPicker';
import { MessageInput } from './components/MessageInput';
import { StatusModal } from './components/StatusModal';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { VoiceCallModal } from './components/VoiceCallModal';
import { VideoCallModal } from './components/VideoCallModal';
import { MediaViewer } from './components/MediaViewer';
import { NotificationCenter } from './components/NotificationCenter';
import { useMessenger } from './hooks/useMessenger';
import { useTheme } from './hooks/useTheme';
import { useProfile } from './hooks/useProfile';
import { useNotifications } from './hooks/useNotifications';
import { useVoiceCall } from './hooks/useVoiceCall';
import { useVideoCall } from './hooks/useVideoCall';
import { Message, Chat, User as UserType, UserStatus, CallType } from './types';
import './App.css';

function App() {
  const { theme, toggleTheme, customTheme, updateCustomTheme } = useTheme();
  const { 
    profile, 
    updateProfile, 
    updateStatus, 
    updateAvatar, 
    updateTheme: updateProfileTheme,
    updatePrivacySettings,
    updateNotificationSettings,
    getProfileStats,
    exportProfile,
    importProfile
  } = useProfile();
  
  const {
    chats,
    currentChat,
    messages,
    selectChat,
    sendMessage,
    addReaction,
    editMessage,
    deleteMessage,
    createGroup,
    searchChats,
    pinChat,
    muteChat,
    archiveChat,
    blockUser,
    unblockUser,
    addToFavorites,
    removeFromFavorites
  } = useMessenger(profile);

  const { notifications, addNotification, markAsRead, clearAll } = useNotifications();
  const { isInCall: isInVoiceCall, startCall: startVoiceCall, endCall: endVoiceCall } = useVoiceCall();
  const { isInCall: isInVideoCall, startVideoCall, endVideoCall } = useVideoCall();

  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [activeUsers, setActiveUsers] = useState<Map<string, Date>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');

  // Advanced features state
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showChatAnalytics, setShowChatAnalytics] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordingTime, setVoiceRecordingTime] = useState(0);
  const [showScheduleMessage, setShowScheduleMessage] = useState(false);
  const [showMessageTemplates, setShowMessageTemplates] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const voiceRecordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Apply theme and profile changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (customTheme) {
      const root = document.documentElement;
      Object.entries(customTheme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [theme, customTheme]);

  // Update document title with unread count
  useEffect(() => {
    const totalUnread = Object.values(chats).reduce((sum, chat) => sum + chat.unreadCount, 0);
    document.title = totalUnread > 0 ? `(${totalUnread}) ${profile.name} - Messenger` : `${profile.name} - Messenger`;
  }, [chats, profile.name]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Simulate online users and activity
  useEffect(() => {
    const interval = setInterval(() => {
      const userIds = Object.keys(chats);
      const onlineCount = Math.floor(Math.random() * userIds.length);
      const shuffled = userIds.sort(() => 0.5 - Math.random());
      setOnlineUsers(new Set(shuffled.slice(0, onlineCount)));
      
      // Update active users
      const newActiveUsers = new Map();
      shuffled.slice(0, Math.floor(userIds.length * 0.3)).forEach(userId => {
        newActiveUsers.set(userId, new Date());
      });
      setActiveUsers(newActiveUsers);
    }, 10000);

    return () => clearInterval(interval);
  }, [chats]);

  // Connection status simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: Array<'online' | 'offline' | 'connecting'> = ['online', 'online', 'online', 'connecting', 'offline'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Voice recording timer
  useEffect(() => {
    if (isRecordingVoice) {
      voiceRecordingInterval.current = setInterval(() => {
        setVoiceRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (voiceRecordingInterval.current) {
        clearInterval(voiceRecordingInterval.current);
      }
      setVoiceRecordingTime(0);
    }

    return () => {
      if (voiceRecordingInterval.current) {
        clearInterval(voiceRecordingInterval.current);
      }
    };
  }, [isRecordingVoice]);

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' | 'voice' = 'text', metadata?: any) => {
    if (!currentChat || !content.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content,
      type,
      sender: profile.id,
      timestamp: new Date(),
      isOwn: true,
      isRead: false,
      reactions: [],
      replyTo: null,
      isEdited: false,
      metadata
    };

    sendMessage(message);
    setShowEmojiPicker(false);
    
    // Add notification for sent message
    addNotification({
      id: Date.now().toString(),
      type: 'message_sent',
      title: 'Message Sent',
      message: `Message sent to ${chats[currentChat]?.name}`,
      timestamp: new Date(),
      isRead: false
    });
  };

  const handleReaction = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji, profile.id);
  };

  const handleTyping = (typing: boolean) => {
    setIsTyping(typing);
    if (typing) {
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const handleProfileUpdate = (updates: Partial<UserType>) => {
    updateProfile(updates);
    
    // Update all related UI elements
    if (updates.name) {
      document.title = `${updates.name} - Messenger`;
    }
    
    // Notify about profile update
    addNotification({
      id: Date.now().toString(),
      type: 'profile_updated',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated',
      timestamp: new Date(),
      isRead: false
    });
  };

  const handleStatusUpdate = (status: UserStatus) => {
    updateStatus(status);
    addNotification({
      id: Date.now().toString(),
      type: 'status_updated',
      title: 'Status Updated',
      message: `Status changed to: ${status.text}`,
      timestamp: new Date(),
      isRead: false
    });
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    updateAvatar(avatarUrl);
    addNotification({
      id: Date.now().toString(),
      type: 'avatar_updated',
      title: 'Avatar Updated',
      message: 'Your profile picture has been updated',
      timestamp: new Date(),
      isRead: false
    });
  };

  const handleVoiceCall = (chatId: string) => {
    if (isInVoiceCall) {
      endVoiceCall();
    } else {
      startVoiceCall(chatId);
      addNotification({
        id: Date.now().toString(),
        type: 'call_started',
        title: 'Voice Call Started',
        message: `Calling ${chats[chatId]?.name}...`,
        timestamp: new Date(),
        isRead: false
      });
    }
  };

  const handleVideoCall = (chatId: string) => {
    if (isInVideoCall) {
      endVideoCall();
    } else {
      startVideoCall(chatId);
      addNotification({
        id: Date.now().toString(),
        type: 'call_started',
        title: 'Video Call Started',
        message: `Video calling ${chats[chatId]?.name}...`,
        timestamp: new Date(),
        isRead: false
      });
    }
  };

  const handleMediaView = (mediaUrl: string) => {
    setSelectedMedia(mediaUrl);
    setShowMediaViewer(true);
  };

  const handleVoiceRecording = () => {
    if (isRecordingVoice) {
      // Stop recording and send
      setIsRecordingVoice(false);
      const duration = voiceRecordingTime;
      handleSendMessage(`Voice message (${duration}s)`, 'voice', { duration });
    } else {
      // Start recording
      setIsRecordingVoice(true);
    }
  };

  const handleScheduleMessage = (content: string, scheduleTime: Date) => {
    // In a real app, this would schedule the message
    addNotification({
      id: Date.now().toString(),
      type: 'message_scheduled',
      title: 'Message Scheduled',
      message: `Message scheduled for ${scheduleTime.toLocaleString()}`,
      timestamp: new Date(),
      isRead: false
    });
  };

  const filteredChats = searchQuery
    ? Object.values(chats).filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : Object.values(chats);

  const profileStats = getProfileStats();

  return (
    <div className={`messenger-app ${theme}`} data-connection={connectionStatus}>
      {/* Connection Status Bar */}
      <div className={`connection-status ${connectionStatus}`}>
        <div className="connection-indicator">
          {connectionStatus === 'online' && <Wifi size={16} />}
          {connectionStatus === 'offline' && <WifiOff size={16} />}
          {connectionStatus === 'connecting' && <RefreshCw size={16} className="spinning" />}
          <span>{connectionStatus === 'online' ? 'Connected' : connectionStatus === 'offline' ? 'Disconnected' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Enhanced Header */}
        <div className="sidebar-header">
          <div className="user-info" onClick={() => setShowProfile(true)}>
            <div className="user-avatar">
              <img src={profile.avatar} alt={profile.name} />
              <div className={`status-indicator ${profile.status.type}`}>
                {profile.status.emoji && <span className="status-emoji">{profile.status.emoji}</span>}
              </div>
              <div className="activity-ring"></div>
            </div>
            <div className="user-details">
              <h3>{profile.name}</h3>
              <p className="user-status" onClick={(e) => {
                e.stopPropagation();
                setShowStatusModal(true);
              }}>
                {profile.status.text}
              </p>
              <div className="user-stats">
                <span>{profileStats.totalMessages} messages</span>
                <span>{profileStats.totalChats} chats</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="icon-button notification-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              data-count={notifications.filter(n => !n.isRead).length}
            >
              <Bell size={20} />
            </button>
            <button className="icon-button" onClick={() => setShowThemeCustomizer(true)}>
              <Palette size={20} />
            </button>
            <button className="icon-button" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-button" onClick={() => setShowSettings(true)}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search conversations, messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button className="filter-tab active">All</button>
          <button className="filter-tab">Unread</button>
          <button className="filter-tab">Groups</button>
          <button className="filter-tab">Favorites</button>
          <button className="filter-tab">Archived</button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => setShowUserSearch(true)}>
            <UserPlus size={16} />
            <span>Add Contact</span>
          </button>
          <button className="quick-action-btn" onClick={() => setShowQuickActions(true)}>
            <Zap size={16} />
            <span>Quick Actions</span>
          </button>
        </div>

        {/* Chat List */}
        <ChatList
          chats={filteredChats}
          currentChat={currentChat}
          onSelectChat={selectChat}
          onlineUsers={onlineUsers}
          activeUsers={activeUsers}
          searchQuery={searchQuery}
          profile={profile}
        />
      </div>

      {/* Main Chat Area */}
      <div className="main-chat-area">
        {currentChat ? (
          <>
            {/* Enhanced Chat Header */}
            <div className="chat-header">
              <div className="chat-info">
                <div className="chat-avatar">
                  <img src={chats[currentChat]?.avatar} alt={chats[currentChat]?.name} />
                  <div className={`status-indicator ${onlineUsers.has(currentChat) ? 'online' : 'offline'}`}></div>
                </div>
                <div className="chat-details">
                  <h3>{chats[currentChat]?.name}</h3>
                  <p className="status">
                    {isTyping ? (
                      <span className="typing-indicator">
                        <span className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                        typing...
                      </span>
                    ) : onlineUsers.has(currentChat) ? (
                      <span className="online-status">
                        <Activity size={12} />
                        Online
                      </span>
                    ) : (
                      'Last seen recently'
                    )}
                  </p>
                </div>
              </div>
              <div className="chat-actions">
                <button className="icon-button" onClick={() => handleVoiceCall(currentChat)}>
                  {isInVoiceCall ? <MicOff size={20} /> : <Phone size={20} />}
                </button>
                <button className="icon-button" onClick={() => handleVideoCall(currentChat)}>
                  <Video size={20} />
                </button>
                <button className="icon-button" onClick={() => setShowChatAnalytics(true)}>
                  <Activity size={20} />
                </button>
                <button className="icon-button" onClick={() => setShowChatOptions(!showChatOptions)}>
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="messages-area" ref={chatAreaRef}>
              <ChatArea
                messages={messages}
                onAddReaction={handleReaction}
                onEditMessage={editMessage}
                onDeleteMessage={deleteMessage}
                onMediaView={handleMediaView}
                currentUserId={profile.id}
                profile={profile}
              />
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              onShowEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
              onVoiceRecording={handleVoiceRecording}
              onScheduleMessage={() => setShowScheduleMessage(true)}
              onShowTemplates={() => setShowMessageTemplates(true)}
              showEmojiPicker={showEmojiPicker}
              isRecordingVoice={isRecordingVoice}
              voiceRecordingTime={voiceRecordingTime}
              profile={profile}
            />
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-animation">
                <MessageCircle size={64} className="welcome-icon" />
                <div className="pulse-rings">
                  <div className="pulse-ring"></div>
                  <div className="pulse-ring"></div>
                  <div className="pulse-ring"></div>
                </div>
              </div>
              <h2>Welcome back, {profile.name}!</h2>
              <p>Select a conversation to start messaging</p>
              <div className="welcome-stats">
                <div className="stat-item">
                  <span className="stat-number">{profileStats.totalChats}</span>
                  <span className="stat-label">Conversations</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profileStats.totalMessages}</span>
                  <span className="stat-label">Messages</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{onlineUsers.size}</span>
                  <span className="stat-label">Online</span>
                </div>
              </div>
              <button className="welcome-button" onClick={() => setShowUserSearch(true)}>
                <Plus size={20} />
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals and Overlays */}
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={(emoji) => {
            // Handle emoji selection
            setShowEmojiPicker(false);
          }}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {showChatOptions && currentChat && (
        <div className="chat-options-menu">
          <div className="options-overlay" onClick={() => setShowChatOptions(false)} />
          <div className="options-content">
            <button className="option-item" onClick={() => pinChat(currentChat)}>
              <Pin size={16} />
              {chats[currentChat]?.isPinned ? 'Unpin Chat' : 'Pin Chat'}
            </button>
            <button className="option-item" onClick={() => muteChat(currentChat)}>
              {chats[currentChat]?.isMuted ? <Bell size={16} /> : <BellOff size={16} />}
              {chats[currentChat]?.isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button className="option-item" onClick={() => addToFavorites(currentChat)}>
              <Star size={16} />
              Add to Favorites
            </button>
            <button className="option-item" onClick={() => archiveChat(currentChat)}>
              <Archive size={16} />
              Archive Chat
            </button>
            <button className="option-item">
              <Share size={16} />
              Share Chat
            </button>
            <button className="option-item">
              <Download size={16} />
              Export Chat
            </button>
            <button className="option-item danger" onClick={() => blockUser(currentChat)}>
              <Shield size={16} />
              Block User
            </button>
            <button className="option-item danger">
              <Trash2 size={16} />
              Delete Chat
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsModal
          profile={profile}
          theme={theme}
          onClose={() => setShowSettings(false)}
          onThemeChange={toggleTheme}
          onUpdateProfile={handleProfileUpdate}
          onUpdatePrivacy={updatePrivacySettings}
          onUpdateNotifications={updateNotificationSettings}
          onExportProfile={exportProfile}
          onImportProfile={importProfile}
        />
      )}

      {showProfile && (
        <UserProfile
          user={profile}
          stats={profileStats}
          onClose={() => setShowProfile(false)}
          onUpdateUser={handleProfileUpdate}
          onUpdateStatus={handleStatusUpdate}
          onUpdateAvatar={handleAvatarUpdate}
          onUpdateTheme={updateProfileTheme}
        />
      )}

      {showStatusModal && (
        <StatusModal
          currentStatus={profile.status}
          onUpdateStatus={handleStatusUpdate}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      {showThemeCustomizer && (
        <ThemeCustomizer
          currentTheme={customTheme}
          onUpdateTheme={updateCustomTheme}
          onClose={() => setShowThemeCustomizer(false)}
        />
      )}

      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onClearAll={clearAll}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showMediaViewer && selectedMedia && (
        <MediaViewer
          mediaUrl={selectedMedia}
          onClose={() => {
            setShowMediaViewer(false);
            setSelectedMedia(null);
          }}
        />
      )}

      {isInVoiceCall && (
        <VoiceCallModal
          chatName={currentChat ? chats[currentChat]?.name : ''}
          onEndCall={() => endVoiceCall()}
        />
      )}

      {isInVideoCall && (
        <VideoCallModal
          chatName={currentChat ? chats[currentChat]?.name : ''}
          onEndCall={() => endVideoCall()}
        />
      )}
    </div>
  );
}

export default App;