import React, { useState } from 'react';
import { X, Clock, Smile, Zap, Coffee, Moon, Briefcase, Heart, Music, Gamepad2, Book, Plane, Home } from 'lucide-react';
import { UserStatus } from '../types';

interface StatusModalProps {
  currentStatus: UserStatus;
  onUpdateStatus: (status: UserStatus) => void;
  onClose: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  currentStatus,
  onUpdateStatus,
  onClose
}) => {
  const [customText, setCustomText] = useState(currentStatus.text);
  const [selectedEmoji, setSelectedEmoji] = useState(currentStatus.emoji || '');
  const [expiryTime, setExpiryTime] = useState<string>('');

  const predefinedStatuses = [
    { text: 'Available', emoji: '😊', type: 'online' as const },
    { text: 'Busy', emoji: '🔴', type: 'busy' as const },
    { text: 'Away', emoji: '🟡', type: 'away' as const },
    { text: 'In a meeting', emoji: '📅', type: 'busy' as const },
    { text: 'Working from home', emoji: '🏠', type: 'online' as const },
    { text: 'On vacation', emoji: '🏖️', type: 'away' as const },
    { text: 'Sleeping', emoji: '😴', type: 'away' as const },
    { text: 'Studying', emoji: '📚', type: 'busy' as const },
    { text: 'Gaming', emoji: '🎮', type: 'away' as const },
    { text: 'Listening to music', emoji: '🎵', type: 'online' as const },
    { text: 'Exercising', emoji: '💪', type: 'busy' as const },
    { text: 'Cooking', emoji: '👨‍🍳', type: 'busy' as const }
  ];

  const quickEmojis = [
    '😊', '😎', '🤔', '😴', '🔥', '💪', '🎉', '❤️', '👍', '✨',
    '🚀', '⚡', '🌟', '💯', '🎯', '🎨', '🎵', '📚', '☕', '🍕'
  ];

  const expiryOptions = [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '4 hours', value: 240 },
    { label: 'Today', value: 1440 },
    { label: 'This week', value: 10080 }
  ];

  const handleStatusSelect = (status: typeof predefinedStatuses[0]) => {
    setCustomText(status.text);
    setSelectedEmoji(status.emoji);
  };

  const handleSave = () => {
    const expiresAt = expiryTime ? 
      new Date(Date.now() + parseInt(expiryTime) * 60 * 1000) : 
      undefined;

    const newStatus: UserStatus = {
      type: customText === 'Available' ? 'online' : 'custom',
      text: customText,
      emoji: selectedEmoji,
      expiresAt
    };

    onUpdateStatus(newStatus);
    onClose();
  };

  const handleClear = () => {
    onUpdateStatus({
      type: 'online',
      text: 'Available'
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="status-modal">
        <div className="status-header">
          <h2>Set Status</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="status-content">
          {/* Current Status Preview */}
          <div className="status-preview">
            <div className="status-avatar">
              <div className="avatar-placeholder">
                {selectedEmoji && <span className="status-emoji-large">{selectedEmoji}</span>}
              </div>
            </div>
            <div className="status-text">
              <h3>Your Status</h3>
              <p>{customText || 'Available'}</p>
            </div>
          </div>

          {/* Custom Status Input */}
          <div className="custom-status-section">
            <h4>Custom Status</h4>
            <div className="status-input-group">
              <div className="emoji-selector">
                <button 
                  className="emoji-button"
                  onClick={() => setSelectedEmoji('')}
                >
                  {selectedEmoji || '😊'}
                </button>
              </div>
              <input
                type="text"
                placeholder="What's your status?"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="status-input"
                maxLength={100}
              />
            </div>
            
            {/* Quick Emojis */}
            <div className="quick-emojis">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  className={`emoji-option ${selectedEmoji === emoji ? 'selected' : ''}`}
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry Time */}
          <div className="expiry-section">
            <h4>Clear after</h4>
            <div className="expiry-options">
              <button
                className={`expiry-option ${!expiryTime ? 'selected' : ''}`}
                onClick={() => setExpiryTime('')}
              >
                Don't clear
              </button>
              {expiryOptions.map((option) => (
                <button
                  key={option.value}
                  className={`expiry-option ${expiryTime === option.value.toString() ? 'selected' : ''}`}
                  onClick={() => setExpiryTime(option.value.toString())}
                >
                  <Clock size={16} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Predefined Statuses */}
          <div className="predefined-section">
            <h4>Quick Status</h4>
            <div className="predefined-statuses">
              {predefinedStatuses.map((status, index) => (
                <button
                  key={index}
                  className="predefined-status"
                  onClick={() => handleStatusSelect(status)}
                >
                  <span className="status-emoji">{status.emoji}</span>
                  <span className="status-text">{status.text}</span>
                  <div className={`status-indicator ${status.type}`}></div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="status-actions">
          <button className="clear-btn" onClick={handleClear}>
            Clear Status
          </button>
          <div className="action-buttons">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};