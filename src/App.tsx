import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, Phone, Video, Settings, Sun, Moon, 
  MessageCircle, Check, CheckCheck, Smile, Paperclip, 
  Image, Mic, MoreVertical, Bell, BellOff, Users, User,
  Plus, Archive, Pin, VolumeX, Edit3, Trash2, Star
} from 'lucide-react';
import { ChatList } from '../components/ChatList';
import { ChatArea } from '../components/ChatArea';
import { MessageInput } from '../components/MessageInput';
import { EmojiPicker } from '../components/EmojiPicker';
import { MediaViewer } from '../components/MediaViewer';
import { UserProfile } from '../components/UserProfile';
import { SettingsModal } from '../components/SettingsModal';
import { ThemeCustomizer } from '../components/ThemeCustomizer';
import { User as UserType, Message, Chat, MessageReaction } from '../types';
import './App.css';

function App() {
  // Theme state with system preference detection
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('messenger-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return (saved as 'light' | 'dark') || (systemPrefersDark ? 'dark' : 'light');
  });

  // App state
  const [currentUser] = useState<UserType>({
    id: 'user1',
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    status: 'Available for chat',
    bio: 'Product Designer passionate about creating beautiful user experiences',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    isOnline: true,
    joinedDate: new Date('2023-01-15')
  });

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'chat1',
      name: 'Sarah Wilson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      type: 'direct',
      participants: ['user1', 'user2'],
      lastMessage: {
        id: 'msg1',
        content: 'Hey! How are you doing today? I was thinking we could grab coffee later.',
        sender: 'user2',
        timestamp: new Date(Date.now() - 300000),
        isOwn: false,
        isRead: false,
        type: 'text',
        reactions: []
      },
      unreadCount: 2,
      isOnline: true,
      isMuted: false,
      isTyping: false,
      isPinned: true,
      isArchived: false,
      updatedAt: new Date(Date.now() - 300000)
    },
    {
      id: 'chat2',
      name: 'Design Team',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
      type: 'group',
      participants: ['user1', 'user3', 'user4', 'user5'],
      lastMessage: {
        id: 'msg2',
        content: 'The new mockups look amazing! Great work everyone 🎨',
        sender: 'user3',
        timestamp: new Date(Date.now() - 600000),
        isOwn: false,
        isRead: true,
        type: 'text',
        reactions: []
      },
      unreadCount: 0,
      isOnline: true,
      isMuted: false,
      isTyping: true,
      isPinned: true,
      isArchived: false,
      updatedAt: new Date(Date.now() - 600000)
    },
    {
      id: 'chat3',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      type: 'direct',
      participants: ['user1', 'user6'],
      lastMessage: {
        id: 'msg3',
        content: 'Thanks for the help with the project! Really appreciate it.',
        sender: 'user1',
        timestamp: new Date(Date.now() - 3600000),
        isOwn: true,
        isRead: true,
        type: 'text',
        reactions: []
      },
      unreadCount: 0,
      isOnline: false,
      isMuted: false,
      isPinned: false,
      isArchived: false,
      updatedAt: new Date(Date.now() - 3600000)
    },
    {
      id: 'chat4',
      name: 'Emma Davis',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      type: 'direct',
      participants: ['user1', 'user7'],
      lastMessage: {
        id: 'msg4',
        content: 'See you at the meeting tomorrow!',
        sender: 'user7',
        timestamp: new Date(Date.now() - 7200000),
        isOwn: false,
        isRead: true,
        type: 'text',
        reactions: []
      },
      unreadCount: 0,
      isOnline: true,
      isMuted: true,
      isPinned: false,
      isArchived: false,
      updatedAt: new Date(Date.now() - 7200000)
    },
    {
      id: 'chat5',
      name: 'Development Team',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150',
      type: 'group',
      participants: ['user1', 'user8', 'user9', 'user10'],
      lastMessage: {
        id: 'msg5',
        content: 'New deployment is live! 🚀',
        sender: 'user8',
        timestamp: new Date(Date.now() - 10800000),
        isOwn: false,
        isRead: true,
        type: 'text',
        reactions: []
      },
      unreadCount: 5,
      isOnline: true,
      isMuted: false,
      isPinned: false,
      isArchived: false,
      updatedAt: new Date(Date.now() - 10800000)
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg1',
      content: 'Hey Alex! How\'s the new project coming along?',
      sender: 'user2',
      timestamp: new Date(Date.now() - 1800000),
      isOwn: false,
      isRead: true,
      type: 'text',
      reactions: []
    },
    {
      id: 'msg2',
      content: 'It\'s going really well! Just finished the wireframes and I\'m pretty excited about the direction we\'re taking.',
      sender: 'user1',
      timestamp: new Date(Date.now() - 1500000),
      isOwn: true,
      isRead: true,
      type: 'text',
      reactions: [{ emoji: '👍', count: 1, users: ['user2'] }],
      isEdited: false
    },
    {
      id: 'msg3',
      content: 'That sounds fantastic! I\'d love to see what you\'ve been working on. The team has been really curious about the progress.',
      sender: 'user2',
      timestamp: new Date(Date.now() - 900000),
      isOwn: false,
      isRead: true,
      type: 'text',
      reactions: []
    },
    {
      id: 'msg4',
      content: 'I\'ll share the designs in our next team meeting. I think everyone will be impressed with what we\'ve accomplished so far.',
      sender: 'user1',
      timestamp: new Date(Date.now() - 600000),
      isOwn: true,
      isRead: true,
      type: 'text',
      reactions: [
        { emoji: '🔥', count: 1, users: ['user2'] },
        { emoji: '💯', count: 1, users: ['user2'] }
      ],
      isEdited: false
    },
    {
      id: 'msg5',
      content: 'Perfect! I can\'t wait to see them. The client is going to love this direction.',
      sender: 'user2',
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
      isRead: false,
      type: 'text',
      reactions: []
    }
  ]);

  // UI state
  const [currentChatId, setCurrentChatId] = useState<string>('chat1');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [mediaViewerUrl, setMediaViewerUrl] = useState('');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [customTheme, setCustomTheme] = useState(null);
  const [onlineUsers] = useState(new Set(['user2', 'user3', 'user7', 'user8']));

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Effects
  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('messenger-theme', theme);
  }, [theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (newMessage.trim()) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [newMessage]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifierPressed = e.ctrlKey || e.metaKey;
      
      switch (true) {
        case isModifierPressed && e.key === 'k':
          e.preventDefault();
          const searchInput = document.querySelector('.search-input input') as HTMLInputElement;
          searchInput?.focus();
          break;
        case isModifierPressed && e.key === 't':
          e.preventDefault();
          toggleTheme();
          break;
        case e.key === 'Escape':
          setShowEmojiPicker(false);
          setShowMediaViewer(false);
          setShowUserProfile(false);
          setShowSettings(false);
          setShowThemeCustomizer(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!content.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser.id,
      timestamp: new Date(),
      isOwn: true,
      isRead: false,
      type,
      reactions: [],
      isEdited: false
    };

    setMessages(prev => [...prev, message]);
    
    // Update chat's last message
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, lastMessage: message, updatedAt: new Date() }
        : chat
    ));
  };

  const handleTyping = (typing: boolean) => {
    setIsTyping(typing);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser.id)) {
            return {
              ...msg,
              reactions: reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: r.users.filter(u => u !== currentUser.id), count: r.count - 1 }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            return {
              ...msg,
              reactions: reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: [...r.users, currentUser.id], count: r.count + 1 }
                  : r
              )
            };
          }
        } else {
          return {
            ...msg,
            reactions: [...reactions, { emoji, users: [currentUser.id], count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content, isEdited: true }
        : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    
    // Mark messages as read
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, unreadCount: 0 }
        : chat
    ));

    // Dispatch event for accessibility
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      window.dispatchEvent(new CustomEvent('app:chat-changed', { 
        detail: { chatName: chat.name }
      }));
    }
  };

  const handleUpdateUser = (updates: Partial<UserType>) => {
    // In a real app, this would update the user via API
    console.log('User updates:', updates);
  };

  const handleUpdateTheme = (theme: any) => {
    setCustomTheme(theme);
    // Apply custom theme variables
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value as string);
      });
    }
  };

  // Utility functions
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className={`messenger-app ${theme}`}>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="user-profile" onClick={() => setShowUserProfile(true)}>
            <div className="user-avatar">
              <img src={currentUser.avatar} alt={currentUser.name} />
              <div className="status-indicator online"></div>
            </div>
            <div className="user-info">
              <h3>{currentUser.name}</h3>
              <p>{currentUser.status}</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="icon-button" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              className="icon-button"
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button 
              className="icon-button"
              onClick={() => setShowThemeCustomizer(true)}
              title="Customize theme"
            >
              <Star size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="search-container">
          <div className="search-input">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Chat List */}
        <ChatList
          chats={chats}
          currentChat={currentChatId}
          onSelectChat={handleSelectChat}
          onlineUsers={onlineUsers}
          searchQuery={searchQuery}
        />
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="chat-header-main">
              <div className="chat-info">
                <div className="chat-avatar">
                  <img src={currentChat.avatar} alt={currentChat.name} />
                  {currentChat.type === 'direct' && onlineUsers.has(currentChat.id) && (
                    <div className="online-dot"></div>
                  )}
                  {currentChat.type === 'group' && (
                    <div className="group-indicator">
                      <Users size={12} />
                    </div>
                  )}
                </div>
                <div className="chat-details">
                  <h2>{currentChat.name}</h2>
                  <div className="chat-status">
                    {currentChat.isTyping ? (
                      <span className="typing-indicator">
                        <div className="typing-dots">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                        typing...
                      </span>
                    ) : currentChat.type === 'group' ? (
                      `${currentChat.participants.length} members`
                    ) : onlineUsers.has(currentChat.id) ? (
                      'Online'
                    ) : (
                      `Last seen ${formatLastSeen(new Date(Date.now() - 3600000))}`
                    )}
                  </div>
                </div>
              </div>
              <div className="chat-actions">
                <button className="icon-button" title="Voice call">
                  <Phone size={20} />
                </button>
                <button className="icon-button" title="Video call">
                  <Video size={20} />
                </button>
                <button className="icon-button" title="More options">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <ChatArea
              messages={messages}
              onAddReaction={handleAddReaction}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              currentUserId={currentUser.id}
            />

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              onShowEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
              showEmojiPicker={showEmojiPicker}
            />

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="emoji-picker-overlay">
                <EmojiPicker
                  onEmojiSelect={(emoji) => {
                    setNewMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content fade-in">
              <MessageCircle size={64} className="welcome-icon" />
              <h1 className="welcome-title">Welcome to Messenger</h1>
              <p className="welcome-subtitle">
                Select a conversation to start messaging with your friends and colleagues.
              </p>
              <div className="welcome-stats">
                <div className="stat-item">
                  <span className="stat-number">{chats.length}</span>
                  <span className="stat-label">Conversations</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{totalUnread}</span>
                  <span className="stat-label">Unread</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{onlineUsers.size}</span>
                  <span className="stat-label">Online</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Available</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUserProfile && (
        <UserProfile
          user={currentUser}
          onClose={() => setShowUserProfile(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {showSettings && (
        <SettingsModal
          currentUser={currentUser}
          theme={theme}
          onClose={() => setShowSettings(false)}
          onThemeChange={toggleTheme}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {showThemeCustomizer && (
        <ThemeCustomizer
          currentTheme={customTheme}
          onUpdateTheme={handleUpdateTheme}
          onClose={() => setShowThemeCustomizer(false)}
        />
      )}

      {showMediaViewer && (
        <MediaViewer
          mediaUrl={mediaViewerUrl}
          onClose={() => setShowMediaViewer(false)}
        />
      )}

      {/* Overlay for emoji picker */}
      {showEmojiPicker && (
        <div 
          className="overlay"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
}

export default App;