import React from 'react';
import { Pin, Volume2, VolumeX, Archive, MessageCircle, Users, Check, CheckCheck } from 'lucide-react';
import { Chat } from '../types';

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
};