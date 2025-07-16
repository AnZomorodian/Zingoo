import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Settings, Search, Plus, Send, Paperclip, Smile, MoreVertical, 
  Phone, Video, Pin, Star, Bell, BellOff, Archive, Trash2, Edit3, 
  MessageCircle, Users, Clock, Check, CheckCheck, ArrowLeft, X, 
  Heart, ThumbsUp, Laugh, Angry, Frown, Surprise, Camera, Upload, 
  Palette, Shield, Globe, Moon, Sun, Zap, Activity, Headphones, 
  Mic, MicOff, Volume2, VolumeX, Eye, EyeOff, Lock, Unlock, 
  UserPlus, UserMinus, Crown, Award, Bookmark, Share, Download, 
  Copy, RefreshCw, Wifi, WifiOff, Battery, Signal, Image, File,
  MapPin, Calendar, Smile as StickerIcon, Trending, Filter,
  ChevronDown, ChevronRight, Maximize2, Minimize2, RotateCcw,
  Info, Hash, AtSign, Bold, Italic, Underline, Code, Link2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: {
    type: 'online' | 'away' | 'busy' | 'offline';
    text: string;
    emoji?: string;
  };
  isOnline: boolean;
  lastSeen: Date;
  bio: string;
}

interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  isRead: boolean;
  reactions: Array<{ emoji: string; users: string[]; count: number }>;
  replyTo?: string;
  isEdited?: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage: Message | null;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  isTyping?: boolean;
}

function App() {
  // Sample data
  const [currentUser] = useState<User>({
    id: 'user1',
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    status: { type: 'online', text: 'Available', emoji: '💚' },
    isOnline: true,
    lastSeen: new Date(),
    bio: 'Product Designer at TechCorp'
  });

  const [chats, setChats] = useState<Record<string, Chat>>({
    'chat1': {
      id: 'chat1',
      name: 'Sarah Wilson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      type: 'direct',
      participants: ['user1', 'user2'],
      lastMessage: {
        id: 'msg1',
        content: 'Hey! How are you doing today?',
        type: 'text',
        sender: 'user2',
        timestamp: new Date(Date.now() - 300000),
        isOwn: false,
        isRead: false,
        reactions: []
      },
      unreadCount: 2,
      isPinned: true,
      isMuted: false,
      isArchived: false,
      isTyping: false
    },
    'chat2': {
      id: 'chat2',
      name: 'Design Team',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
      type: 'group',
      participants: ['user1', 'user3', 'user4', 'user5'],
      lastMessage: {
        id: 'msg2',
        content: 'The new mockups look amazing! 🎨',
        type: 'text',
        sender: 'user3',
        timestamp: new Date(Date.now() - 600000),
        isOwn: false,
        isRead: true,
        reactions: [{ emoji: '👍', users: ['user1'], count: 1 }]
      },
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      isTyping: true
    },
    'chat3': {
      id: 'chat3',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      type: 'direct',
      participants: ['user1', 'user6'],
      lastMessage: {
        id: 'msg3',
        content: 'Thanks for the help with the project!',
        type: 'text',
        sender: 'user1',
        timestamp: new Date(Date.now() - 3600000),
        isOwn: true,
        isRead: true,
        reactions: []
      },
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false
    }
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg1',
      content: 'Hey Alex! How\'s the new project coming along?',
      type: 'text',
      sender: 'user2',
      timestamp: new Date(Date.now() - 1800000),
      isOwn: false,
      isRead: true,
      reactions: []
    },
    {
      id: 'msg2',
      content: 'It\'s going really well! Just finished the wireframes. Want to take a look?',
      type: 'text',
      sender: 'user1',
      timestamp: new Date(Date.now() - 1500000),
      isOwn: true,
      isRead: true,
      reactions: [{ emoji: '👍', users: ['user2'], count: 1 }]
    },
    {
      id: 'msg3',
      content: 'Absolutely! I\'d love to see what you\'ve been working on.',
      type: 'text',
      sender: 'user2',
      timestamp: new Date(Date.now() - 900000),
      isOwn: false,
      isRead: true,
      reactions: []
    },
    {
      id: 'msg4',
      content: 'Here\'s a preview of the main dashboard design',
      type: 'image',
      sender: 'user1',
      timestamp: new Date(Date.now() - 600000),
      isOwn: true,
      isRead: true,
      reactions: [
        { emoji: '🔥', users: ['user2'], count: 1 },
        { emoji: '💯', users: ['user2'], count: 1 }
      ]
    },
    {
      id: 'msg5',
      content: 'This looks incredible! The color scheme is perfect.',
      type: 'text',
      sender: 'user2',
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
      isRead: false,
      reactions: []
    }
  ]);

  // State management
  const [currentChat, setCurrentChat] = useState<string>('chat1');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  // Handlers
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentChat) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      type: 'text',
      sender: currentUser.id,
      timestamp: new Date(),
      isOwn: true,
      isRead: false,
      reactions: [],
      replyTo: replyingTo || undefined
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyingTo(null);
    
    // Update chat's last message
    setChats(prev => ({
      ...prev,
      [currentChat]: {
        ...prev[currentChat],
        lastMessage: message
      }
    }));

    messageInputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser.id)) {
            // Remove reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: r.users.filter(u => u !== currentUser.id), count: r.count - 1 }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: [...r.users, currentUser.id], count: r.count + 1 }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, users: [currentUser.id], count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // In a real app, this would process the recording
      const voiceMessage: Message = {
        id: Date.now().toString(),
        content: `Voice message (${recordingTime}s)`,
        type: 'voice',
        sender: currentUser.id,
        timestamp: new Date(),
        isOwn: true,
        isRead: false,
        reactions: []
      };
      setMessages(prev => [...prev, voiceMessage]);
    } else {
      setIsRecording(true);
    }
  };

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

  const filteredChats = Object.values(chats).filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChatData = currentChat ? chats[currentChat] : null;
  const totalUnread = Object.values(chats).reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className={`messenger-app ${theme} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="user-section" onClick={() => setShowProfile(true)}>
            <div className="user-avatar">
              <img src={currentUser.avatar} alt={currentUser.name} />
              <div className={`status-dot ${currentUser.status.type}`}></div>
            </div>
            <div className="user-info">
              <h3>{currentUser.name}</h3>
              <p className="status-text">
                {currentUser.status.emoji} {currentUser.status.text}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
            </button>
            <button className="icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="icon-btn" onClick={() => setShowSettings(true)}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn">
            <Plus size={16} />
            <span>New Chat</span>
          </button>
          <button className="quick-action-btn">
            <Users size={16} />
            <span>New Group</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${currentChat === chat.id ? 'active' : ''} ${chat.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => setCurrentChat(chat.id)}
            >
              <div className="chat-avatar">
                <img src={chat.avatar} alt={chat.name} />
                {chat.type === 'group' && <div className="group-indicator"><Users size={12} /></div>}
                <div className="online-indicator"></div>
              </div>
              <div className="chat-info">
                <div className="chat-header">
                  <h4>{chat.name}</h4>
                  <span className="timestamp">
                    {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                  </span>
                </div>
                <div className="chat-preview">
                  <p className={`last-message ${chat.isTyping ? 'typing' : ''}`}>
                    {chat.isTyping ? (
                      <span className="typing-indicator">
                        <span></span><span></span><span></span>
                        typing...
                      </span>
                    ) : (
                      <>
                        {chat.lastMessage?.isOwn && <Check size={14} />}
                        {chat.lastMessage?.content || 'No messages yet'}
                      </>
                    )}
                  </p>
                  <div className="chat-badges">
                    {chat.isPinned && <Pin size={12} />}
                    {chat.isMuted && <BellOff size={12} />}
                    {chat.unreadCount > 0 && (
                      <span className="unread-badge">{chat.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-area">
        {currentChatData ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-info">
                <div className="chat-avatar">
                  <img src={currentChatData.avatar} alt={currentChatData.name} />
                  <div className="online-indicator active"></div>
                </div>
                <div className="chat-details">
                  <h3>{currentChatData.name}</h3>
                  <p className="status">
                    {currentChatData.isTyping ? (
                      <span className="typing-text">
                        <Activity size={12} />
                        typing...
                      </span>
                    ) : (
                      'Last seen recently'
                    )}
                  </p>
                </div>
              </div>
              <div className="chat-actions">
                <button className="icon-btn">
                  <Phone size={20} />
                </button>
                <button className="icon-btn">
                  <Video size={20} />
                </button>
                <button className="icon-btn" onClick={() => setShowChatInfo(!showChatInfo)}>
                  <Info size={20} />
                </button>
                <button className="icon-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="messages-area">
              <div className="messages-container">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.isOwn ? 'own' : 'other'} ${selectedMessage === message.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                  >
                    {!message.isOwn && (
                      <div className="message-avatar">
                        <img src={currentChatData.avatar} alt="" />
                      </div>
                    )}
                    <div className="message-content">
                      {message.replyTo && (
                        <div className="reply-preview">
                          <div className="reply-line"></div>
                          <div className="reply-content">
                            <span className="reply-author">You</span>
                            <p>Original message content...</p>
                          </div>
                        </div>
                      )}
                      <div className="message-bubble">
                        {message.type === 'image' ? (
                          <div className="image-message">
                            <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Shared image" />
                            <p>{message.content}</p>
                          </div>
                        ) : message.type === 'voice' ? (
                          <div className="voice-message">
                            <button className="play-btn">
                              <Volume2 size={16} />
                            </button>
                            <div className="voice-waveform">
                              <div className="waveform-bars">
                                {Array.from({ length: 20 }).map((_, i) => (
                                  <div key={i} className="bar" style={{ height: `${Math.random() * 100}%` }}></div>
                                ))}
                              </div>
                            </div>
                            <span className="voice-duration">0:{recordingTime.toString().padStart(2, '0')}</span>
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        {message.reactions.length > 0 && (
                          <div className="message-reactions">
                            {message.reactions.map(reaction => (
                              <button
                                key={reaction.emoji}
                                className={`reaction ${reaction.users.includes(currentUser.id) ? 'own' : ''}`}
                                onClick={() => handleReaction(message.id, reaction.emoji)}
                              >
                                {reaction.emoji} {reaction.count}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="message-meta">
                        <span className="timestamp">{formatTime(message.timestamp)}</span>
                        {message.isOwn && (
                          <span className="read-status">
                            {message.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                          </span>
                        )}
                        {message.isEdited && <span className="edited">edited</span>}
                      </div>
                    </div>
                    {selectedMessage === message.id && (
                      <div className="message-actions">
                        <button onClick={() => setReplyingTo(message.id)}>
                          <ArrowLeft size={16} />
                        </button>
                        <button onClick={() => handleReaction(message.id, '👍')}>
                          <ThumbsUp size={16} />
                        </button>
                        <button onClick={() => handleReaction(message.id, '❤️')}>
                          <Heart size={16} />
                        </button>
                        <button>
                          <Copy size={16} />
                        </button>
                        {message.isOwn && (
                          <>
                            <button>
                              <Edit3 size={16} />
                            </button>
                            <button>
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="message-input-area">
              {replyingTo && (
                <div className="reply-bar">
                  <div className="reply-info">
                    <ArrowLeft size={16} />
                    <span>Replying to message</span>
                  </div>
                  <button onClick={() => setReplyingTo(null)}>
                    <X size={16} />
                  </button>
                </div>
              )}
              <div className="message-input-container">
                <div className="input-actions-left">
                  <button className="icon-btn">
                    <Paperclip size={20} />
                  </button>
                  <button className="icon-btn">
                    <Image size={20} />
                  </button>
                  <button className="icon-btn">
                    <Camera size={20} />
                  </button>
                </div>
                <div className="message-input-wrapper">
                  <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                  />
                  <div className="input-formatting">
                    <button className="format-btn"><Bold size={14} /></button>
                    <button className="format-btn"><Italic size={14} /></button>
                    <button className="format-btn"><Code size={14} /></button>
                  </div>
                </div>
                <div className="input-actions-right">
                  <button 
                    className="icon-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile size={20} />
                  </button>
                  <button 
                    className={`icon-btn voice-btn ${isRecording ? 'recording' : ''}`}
                    onClick={handleVoiceRecording}
                  >
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                    {isRecording && <span className="recording-time">{recordingTime}s</span>}
                  </button>
                  <button 
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <MessageCircle size={64} />
              <h2>Welcome to Messenger</h2>
              <p>Select a conversation to start messaging</p>
              <div className="welcome-stats">
                <div className="stat">
                  <span className="stat-number">{Object.keys(chats).length}</span>
                  <span className="stat-label">Conversations</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{totalUnread}</span>
                  <span className="stat-label">Unread</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Info Sidebar */}
      {showChatInfo && currentChatData && (
        <div className="chat-info-sidebar">
          <div className="chat-info-header">
            <h3>Chat Info</h3>
            <button onClick={() => setShowChatInfo(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="chat-info-content">
            <div className="chat-profile">
              <img src={currentChatData.avatar} alt={currentChatData.name} />
              <h4>{currentChatData.name}</h4>
              <p>Online</p>
            </div>
            <div className="chat-actions-grid">
              <button className="action-btn">
                <Phone size={20} />
                <span>Call</span>
              </button>
              <button className="action-btn">
                <Video size={20} />
                <span>Video</span>
              </button>
              <button className="action-btn">
                <Bell size={20} />
                <span>Mute</span>
              </button>
              <button className="action-btn">
                <Star size={20} />
                <span>Favorite</span>
              </button>
            </div>
            <div className="chat-options">
              <div className="option-item">
                <Shield size={20} />
                <span>Privacy & Support</span>
                <ChevronRight size={16} />
              </div>
              <div className="option-item">
                <Image size={20} />
                <span>Media & Files</span>
                <ChevronRight size={16} />
              </div>
              <div className="option-item">
                <Archive size={20} />
                <span>Archive Chat</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker">
          <div className="emoji-grid">
            {['😀', '😂', '😍', '🥰', '😊', '😎', '🤔', '😴', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '🎉'].map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  setNewMessage(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
