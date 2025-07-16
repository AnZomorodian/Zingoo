import React, { useState } from 'react';
import { X, Edit3, Save, Camera, Phone, Mail, Calendar, MessageCircle, MapPin, Globe, Award } from 'lucide-react';
import { User } from '../types';
import '../styles/ProfileSettings.css';

interface UserProfileProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay">
      <div className="user-profile-modal">
        <div className="profile-header">
          <h2>Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="profile-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-container">
              <img src={user.avatar} alt={user.name} className="profile-avatar" />
              <button className="avatar-edit-btn">
                <Camera size={20} />
              </button>
            </div>
            <div className="profile-status">
              <div className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`}></div>
              <span>{user.isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="profile-info">
            <div className="profile-field">
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="profile-input"
                />
              ) : (
                <span className="profile-value">{user.name}</span>
              )}
            </div>
            
            <div className="profile-field">
              <label>Status</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.status}
                  onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value })}
                  className="profile-input"
                />
              ) : (
                <span className="profile-value">{user.status}</span>
              )}
            </div>
            
            <div className="profile-field">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  className="profile-input"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <span className="profile-value">{user.bio || 'No bio available'}</span>
              )}
            </div>
            
            <div className="profile-field">
              <label>Location</label>
              <div className="field-with-icon">
                <MapPin size={16} />
                <span className="profile-value">San Francisco, CA</span>
              </div>
            </div>
            
            <div className="profile-field">
              <label>Website</label>
              <div className="field-with-icon">
                <Globe size={16} />
                <span className="profile-value">www.example.com</span>
              </div>
            </div>
            
            <div className="profile-field">
              <label>Email</label>
              <div className="field-with-icon">
                <Mail size={16} />
                <span className="profile-value">{user.email}</span>
              </div>
            </div>
            
            <div className="profile-field">
              <label>Phone</label>
              <div className="field-with-icon">
                <Phone size={16} />
                <span className="profile-value">{user.phone}</span>
              </div>
            </div>
            
            <div className="profile-field">
              <label>Member Since</label>
              <div className="field-with-icon">
                <Award size={16} />
                <span className="profile-value">
                  {user.joinedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div className="profile-field">
              <label>Activity Status</label>
              <div className="field-with-icon">
                <Calendar size={16} />
                <span className="profile-value">
                  Last active {formatLastSeen(new Date(Date.now() - 300000))}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <Edit3 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
  function formatLastSeen(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
};