import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Reply, Edit3, Trash2, Copy, Forward, Star, Heart, ThumbsUp, Laugh, Angry, Salad as Sad, Sunrise as Surprised } from 'lucide-react';
import { Message, MessageReaction } from '../types';

interface ChatAreaProps {
  messages: Message[];
  onAddReaction: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  currentUserId: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onAddReaction,
  onEditMessage,
  onDeleteMessage,
  currentUserId
}) => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReactions = ['❤️', '👍', '😂', '😢', '😮', '😡'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReactionClick = (messageId: string, emoji: string) => {
    onAddReaction(messageId, emoji);
    setShowReactions(null);
  };

  const handleEditSubmit = (messageId: string) => {
    if (editContent.trim()) {
      onEditMessage(messageId, editContent);
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    const isEditing = editingMessage === message.id;
    
    return (
      <div
        key={message.id}
        className={`message-container ${message.isOwn ? 'own' : 'other'}`}
      >
        <div className="message-bubble">
          {isEditing ? (
            <div className="message-edit">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEditSubmit(message.id)}
                className="edit-input"
                autoFocus
              />
              <div className="edit-actions">
                <button onClick={() => handleEditSubmit(message.id)} className="save-btn">
                  Save
                </button>
                <button onClick={() => setEditingMessage(null)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="message-content">
                {message.type === 'text' && (
                  <div className="message-text">{message.content}</div>
                )}
                {message.type === 'image' && (
                  <div className="message-image">
                    <img src={message.content} alt="Shared image" />
                  </div>
                )}
                {message.type === 'file' && (
                  <div className="message-file">
                    <div className="file-icon">📎</div>
                    <div className="file-info">
                      <div className="file-name">{message.fileName}</div>
                      <div className="file-size">{message.fileSize} KB</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="message-metadata">
                <span className="message-time">{formatTime(message.timestamp)}</span>
                {message.isEdited && <span className="edited-indicator">edited</span>}
              </div>
            </>
          )}
          
          {message.reactions.length > 0 && (
            <div className="message-reactions">
              {message.reactions.map((reaction, index) => (
                <button
                  key={index}
                  className="reaction-bubble"
                  onClick={() => handleReactionClick(message.id, reaction.emoji)}
                >
                  {reaction.emoji}
                  <span className="reaction-count">{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="message-actions">
            <button
              className="action-btn"
              onClick={() => setShowReactions(showReactions === message.id ? null : message.id)}
            >
              😊
            </button>
            <button className="action-btn">
              <Reply size={16} />
            </button>
            {message.isOwn && (
              <>
                <button
                  className="action-btn"
                  onClick={() => {
                    setEditingMessage(message.id);
                    setEditContent(message.content);
                  }}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  className="action-btn"
                  onClick={() => onDeleteMessage(message.id)}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <button className="action-btn">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
        
        {showReactions === message.id && (
          <div className="reaction-picker">
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                className="reaction-option"
                onClick={() => handleReactionClick(message.id, emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="chat-area">
      <div className="messages-container">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};