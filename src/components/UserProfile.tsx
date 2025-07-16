import React, { useState } from 'react';
import { X, Edit3, Save, Camera, Phone, Mail, Calendar, MessageCircle } from 'lucide-react';
import { User } from '../types';

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
                />
              ) : (
                <span className="profile-value">{user.bio}</span>
              )}
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
                <Calendar size={16} />
                <span className="profile-value">
                  {user.joinedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
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
};