import React from 'react';
import { Pin, Volume2, VolumeX, Archive, MessageCircle, Users, Check, CheckCheck, MoreVertical, Star, Shield } from 'lucide-react';
import { Chat } from '../types';
import '../styles/ChatList.css';

interface ChatListProps {
  chats: Chat[];
  currentChat: string | null;
  onSelectChat: (chatId: string) => void;
  onlineUsers: Set<string>;
  searchQuery: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentChat,
  onSelectChat,
  onlineUsers,
  searchQuery
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => (
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    ));
  };

  // Sort chats: pinned first, then by last message time
  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const aTime = a.lastMessage?.timestamp || a.updatedAt;
    const bTime = b.lastMessage?.timestamp || b.updatedAt;
    return bTime.getTime() - aTime.getTime();
  });

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <div className="chat-list-title">
          <h3>Messages</h3>
          <span className="chat-count">{chats.length}</span>
        </div>
        <div className="chat-filters">
          <button className="filter-tab active">All</button>
          <button className="filter-tab">Unread</button>
          <button className="filter-tab">Groups</button>
        </div>
      </div>
      
      <div className="chat-items-container">
        {/* Pinned Section */}
        {sortedChats.some(chat => chat.isPinned) && (
          <div className="chat-section">
            <div className="chat-section-header">
              <div className="section-title">
                <Pin size={12} className="section-icon" />
                Pinned
              </div>
              <span className="section-count">
                {sortedChats.filter(chat => chat.isPinned).length}
              </span>
            </div>
            {sortedChats.filter(chat => chat.isPinned).map(chat => renderChatItem(chat))}
          </div>
        )}
        
        {/* Recent Section */}
        <div className="chat-section">
          <div className="chat-section-header">
            <div className="section-title">
              <MessageCircle size={12} className="section-icon" />
              Recent
            </div>
            <span className="section-count">
              {sortedChats.filter(chat => !chat.isPinned).length}
            </span>
          </div>
          {sortedChats.filter(chat => !chat.isPinned).map(chat => renderChatItem(chat))}
        </div>
      </div>
      
      {sortedChats.map((chat) => (
        <div
          key={chat.id}
          className={`chat-item ${currentChat === chat.id ? 'active' : ''}`}
          onClick={() => onSelectChat(chat.id)}
        >
          <div className="chat-avatar-container">
            <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
            {chat.type === 'direct' && (
              <div className={`status-indicator ${onlineUsers.has(chat.id) ? 'online' : 'offline'}`} />
            )}
            {chat.type === 'group' && (
              <div className="group-indicator">
                <Users size={12} />
              </div>
            )}
          </div>
          
          <div className="chat-content">
            <div className="chat-header">
              <div className="chat-name-container">
                <h3 className="chat-name">
                  {highlightText(chat.name, searchQuery)}
                </h3>
                <div className="chat-indicators">
                  {chat.isPinned && <Pin size={12} className="pin-icon" />}
                  {chat.isMuted && <VolumeX size={12} className="mute-icon" />}
                  {chat.isArchived && <Archive size={12} className="archive-icon" />}
                </div>
              </div>
              <div className="chat-time">
                {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
              </div>
            </div>
            
            <div className="chat-preview">
              <div className="last-message">
                {chat.lastMessage ? (
                  <span className="message-content">
                    {chat.lastMessage.isOwn && (
                      <span className="message-status">
                        {chat.lastMessage.isRead ? (
                          <CheckCheck size={14} className="read" />
                        ) : (
                          <Check size={14} className="sent" />
                        )}
                      </span>
                    )}
                    {chat.lastMessage.type === 'text' && (
                      highlightText(
                        chat.lastMessage.content.length > 40 
                          ? chat.lastMessage.content.substring(0, 40) + '...'
                          : chat.lastMessage.content,
                        searchQuery
                      )
                    )}
                    {chat.lastMessage.type === 'image' && (
                      <span className="media-message">
                        📷 Photo
                      </span>
                    )}
                    {chat.lastMessage.type === 'file' && (
                      <span className="media-message">
                        📎 File
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="no-messages">No messages yet</span>
                )}
              </div>
              
              <div className="chat-meta">
                {chat.unreadCount > 0 && (
                  <div className="unread-badge">
                    {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                  </div>
                )}
                {chat.isTyping && (
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {chats.length === 0 && (
        <div className="empty-state">
          <MessageCircle size={48} className="empty-icon" />
          <h3>No conversations found</h3>
          <p>Try adjusting your search or start a new chat</p>
        </div>
      )}
    </div>
  );
  
  function renderChatItem(chat: Chat) {
    return (
      <div
        key={chat.id}
        className={`chat-item ${currentChat === chat.id ? 'active' : ''} ${
          chat.unreadCount > 0 ? 'unread' : ''
        } ${chat.isPinned ? 'pinned' : ''}`}
        onClick={() => onSelectChat(chat.id)}
      >
        <div className="chat-avatar-container">
          <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
          {chat.type === 'direct' && (
            <div className={`status-indicator ${onlineUsers.has(chat.id) ? 'online' : 'offline'}`} />
          )}
          {chat.type === 'group' && (
            <div className="group-indicator">
              <Users size={10} />
            </div>
          )}
        </div>
        
        <div className="chat-content">
          <div className="chat-header">
            <div className="chat-name-container">
              <h3 className="chat-name">
                {highlightText(chat.name, searchQuery)}
              </h3>
              <div className="chat-indicators">
                {chat.isPinned && <Pin size={12} className="pin-icon" />}
                {chat.isMuted && <VolumeX size={12} className="mute-icon" />}
                {chat.isArchived && <Archive size={12} className="archive-icon" />}
                {chat.type === 'group' && chat.name.includes('Team') && (
                  <Shield size={12} className="verified-badge" />
                )}
              </div>
            </div>
            <div className="chat-time">
              {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
            </div>
          </div>
          
          <div className="chat-preview">
            <div className="last-message">
              {chat.isTyping ? (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  typing...
                </div>
              ) : (
                <span className="message-content">
                  {chat.lastMessage?.isOwn && (
                    <span className={`message-status ${chat.lastMessage.isRead ? 'read' : 'sent'}`}>
                      {chat.lastMessage.isRead ? (
                        <CheckCheck size={14} />
                      ) : (
                        <Check size={14} />
                      )}
                    </span>
                  )}
                  {chat.lastMessage?.type === 'text' && (
                    highlightText(
                      chat.lastMessage.content.length > 40 
                        ? chat.lastMessage.content.substring(0, 40) + '...'
                        : chat.lastMessage.content,
                      searchQuery
                    )
                  )}
                  {chat.lastMessage?.type === 'image' && (
                    <span className="media-message">
                      📷 Photo
                    </span>
                  )}
                  {chat.lastMessage?.type === 'file' && (
                    <span className="media-message">
                      📎 File
                    </span>
                  )}
                  {!chat.lastMessage && (
                    <span className="no-messages">No messages yet</span>
                  )}
                </span>
              )}
            </div>
            
            <div className="chat-meta">
              {chat.unreadCount > 0 && (
                <div className={`unread-badge ${chat.unreadCount > 99 ? 'high-priority' : ''}`}>
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </div>
              )}
              {chat.isTyping && (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="chat-context-menu">
          <button className="context-menu-trigger">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    );
  }
};