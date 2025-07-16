import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, Phone, Video, Settings, Sun, Moon, 
  MessageCircle, Check, CheckCheck, Smile, Paperclip, 
  Image, Mic, MoreVertical, Bell, BellOff, Users
} from 'lucide-react';
import './App.css';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  isRead: boolean;
  reactions?: Array<{ emoji: string; count: number; users: string[] }>;
}

interface Chat {
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
}

function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // App state
  const [currentUser] = useState<User>({
    id: 'user1',
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    status: 'online',
    lastSeen: new Date()
  });

  const [chats] = useState<Chat[]>([
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
        isRead: false
      },
      unreadCount: 2,
      isOnline: true,
      isMuted: false,
      isTyping: false
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
        isRead: true
      },
      unreadCount: 0,
      isOnline: true,
      isMuted: false,
      isTyping: true
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
        isRead: true
      },
      unreadCount: 0,
      isOnline: false,
      isMuted: false
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
        isRead: true
      },
      unreadCount: 0,
      isOnline: true,
      isMuted: true
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg1',
      content: 'Hey Alex! How\'s the new project coming along?',
      sender: 'user2',
      timestamp: new Date(Date.now() - 1800000),
      isOwn: false,
      isRead: true
    },
    {
      id: 'msg2',
      content: 'It\'s going really well! Just finished the wireframes and I\'m pretty excited about the direction we\'re taking.',
      sender: 'user1',
      timestamp: new Date(Date.now() - 1500000),
      isOwn: true,
      isRead: true,
      reactions: [{ emoji: '👍', count: 1, users: ['user2'] }]
    },
    {
      id: 'msg3',
      content: 'That sounds fantastic! I\'d love to see what you\'ve been working on. The team has been really curious about the progress.',
      sender: 'user2',
      timestamp: new Date(Date.now() - 900000),
      isOwn: false,
      isRead: true
    },
    {
      id: 'msg4',
      content: 'I\'ll share the designs in our next team meeting. I think everyone will be impressed with what we\'ve accomplished so far.',
      sender: 'user1',
      timestamp: new Date(Date.now() - 600000),
      isOwn: true,
      isRead: true,
      reactions: [
        { emoji: '🔥', count: 1, users: ['user2'] },
        { emoji: '💯', count: 1, users: ['user2'] }
      ]
    },
    {
      id: 'msg5',
      content: 'Perfect! I can\'t wait to see them. The client is going to love this direction.',
      sender: 'user2',
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
      isRead: false
    }
  ]);

  const [currentChatId, setCurrentChatId] = useState<string>('chat1');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Effects
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
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

  // Handlers
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: currentUser.id,
      timestamp: new Date(),
      isOwn: true,
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
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
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser.id)) {
            // Remove reaction
            return {
              ...msg,
              reactions: reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: r.users.filter(u => u !== currentUser.id), count: r.count - 1 }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add reaction
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
          // New reaction
          return {
            ...msg,
            reactions: [...reactions, { emoji, users: [currentUser.id], count: 1 }]
          };
        }
      }
      return msg;
    }));
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

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className={`messenger-app ${theme}`}>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="user-avatar">
              <img src={currentUser.avatar} alt={currentUser.name} />
              <div className="status-indicator"></div>
            </div>
            <div className="user-info">
              <h3>{currentUser.name}</h3>
              <p>Available</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-button" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="icon-button">
              <Settings size={20} />
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
          </div>
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${currentChatId === chat.id ? 'active' : ''} ${chat.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => setCurrentChatId(chat.id)}
            >
              <div className="chat-avatar">
                <img src={chat.avatar} alt={chat.name} />
                {chat.isOnline && <div className="online-dot"></div>}
              </div>
              <div className="chat-content">
                <div className="chat-header">
                  <h4 className="chat-name">{chat.name}</h4>
                  <span className="chat-time">
                    {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                  </span>
                </div>
                <div className="chat-preview">
                  <div className="last-message">
                    {chat.isTyping ? (
                      <div className="typing-indicator">
                        <div className="typing-dots">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                        typing...
                      </div>
                    ) : (
                      <>
                        {chat.lastMessage?.isOwn && <Check size={14} />}
                        <span>{chat.lastMessage?.content || 'No messages yet'}</span>
                      </>
                    )}
                  </div>
                  <div className="chat-badges">
                    {chat.isMuted && <BellOff size={14} className="mute-icon" />}
                    {chat.unreadCount > 0 && (
                      <span className="unread-count">{chat.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                  {currentChat.isOnline && <div className="online-dot"></div>}
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
                    ) : currentChat.isOnline ? (
                      'Online'
                    ) : (
                      `Last seen ${formatLastSeen(new Date(Date.now() - 3600000))}`
                    )}
                  </div>
                </div>
              </div>
              <div className="chat-actions">
                <button className="icon-button">
                  <Phone size={20} />
                </button>
                <button className="icon-button">
                  <Video size={20} />
                </button>
                <button className="icon-button">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.isOwn ? 'own' : ''} fade-in`}>
                  {!message.isOwn && (
                    <div className="message-avatar">
                      <img src={currentChat.avatar} alt="" />
                    </div>
                  )}
                  <div className="message-content">
                    <div className="message-bubble">
                      <p className="message-text">{message.content}</p>
                    </div>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="reactions">
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
                    <div className="message-time">
                      <span>{formatTime(message.timestamp)}</span>
                      {message.isOwn && (
                        <div className="read-status">
                          {message.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <div className="input-wrapper">
                <div className="input-actions-left">
                  <button className="icon-button">
                    <Paperclip size={20} />
                  </button>
                  <button className="icon-button">
                    <Image size={20} />
                  </button>
                </div>
                <textarea
                  ref={messageInputRef}
                  className="message-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                />
                <div className="input-actions-right">
                  <button className="icon-button">
                    <Smile size={20} />
                  </button>
                  <button className="icon-button">
                    <Mic size={20} />
                  </button>
                  <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;