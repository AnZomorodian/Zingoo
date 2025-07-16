import React, { useState } from 'react';
import { X, Moon, Sun, Bell, Lock, Globe, Palette, Download, Shield, HelpCircle, Info, User, Smartphone, Database, Zap } from 'lucide-react';
import { User } from '../types';
import '../styles/ProfileSettings.css';

interface SettingsModalProps {
  currentUser: User;
  theme: 'light' | 'dark';
  onClose: () => void;
  onThemeChange: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  theme,
  onClose,
  onThemeChange,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    sounds: true,
    desktop: true,
    previews: false,
    vibration: true
  });
  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    showReadReceipts: true,
    showTypingIndicator: true,
    showLastSeen: false
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={16} /> },
    { id: 'general', label: 'General', icon: <Globe size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'privacy', label: 'Privacy', icon: <Lock size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
    { id: 'advanced', label: 'Advanced', icon: <Zap size={16} /> },
    { id: 'data', label: 'Data & Storage', icon: <Database size={16} /> },
    { id: 'about', label: 'About', icon: <Info size={16} /> }
  ];

  const renderAccountSettings = () => (
    <div className="settings-section">
      <h3>Account Settings</h3>
      
      <div className="setting-group">
        <label>Profile Information</label>
        <div className="setting-item">
          <div className="setting-info">
            <label>Display Name</label>
            <p>Your name as it appears to other users</p>
          </div>
          <input 
            type="text" 
            value={currentUser.name} 
            className="profile-input"
            style={{ width: '200px' }}
          />
        </div>
      </div>
      
      <div className="setting-group">
        <label>Account Security</label>
        <div className="setting-item">
          <div className="setting-info">
            <label>Two-factor authentication</label>
            <p>Add an extra layer of security to your account</p>
          </div>
          <button className="theme-toggle">
            <Shield size={16} />
            Enable 2FA
          </button>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Change Password</label>
            <p>Update your account password</p>
          </div>
          <button className="theme-toggle">
            <Lock size={16} />
            Change
          </button>
        </div>
      </div>
      
      <div className="setting-group">
        <label>Account Actions</label>
        <div className="setting-item">
          <div className="setting-info">
            <label>Download your data</label>
            <p>Get a copy of your messages and media</p>
          </div>
          <button className="theme-toggle">
            <Download size={16} />
            Download
          </button>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Deactivate account</label>
            <p>Temporarily disable your account</p>
          </div>
          <button className="theme-toggle" style={{ color: 'var(--error-500)' }}>
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>General Settings</h3>
      
      <div className="setting-group">
        <label>Language</label>
        <select className="setting-select">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
      
      <div className="setting-group">
        <label>Regional Settings</label>
        <select className="setting-select">
          <option value="auto">Auto-detect</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
        </select>
      </div>
      
      <div className="setting-group">
        <label>Time Format</label>
        <select className="setting-select">
          <option value="12">12-hour</option>
          <option value="24">24-hour</option>
        </select>
      </div>
      
      <div className="setting-group">
        <label>Font Size</label>
        <select className="setting-select">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Enter to send messages</label>
          <p>Press Enter to send, Shift+Enter for new line</p>
        </div>
        <input type="checkbox" className="setting-checkbox" defaultChecked />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Auto-download media</label>
          <p>Automatically download images and videos</p>
        </div>
        <input type="checkbox" className="setting-checkbox" defaultChecked />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Show media in chat</label>
          <p>Automatically display images and videos</p>
        </div>
        <input type="checkbox" className="setting-checkbox" defaultChecked />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Spell check</label>
          <p>Check spelling as you type</p>
        </div>
        <input type="checkbox" className="setting-checkbox" defaultChecked />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Settings</h3>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Sound notifications</label>
          <p>Play sound for new messages</p>
        </div>
        <input
          type="checkbox"
          className="setting-checkbox"
          checked={notifications.sounds}
          onChange={(e) => setNotifications({...notifications, sounds: e.target.checked})}
        />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Desktop notifications</label>
          <p>Show notifications on desktop</p>
        </div>
        <input
          type="checkbox"
          className="setting-checkbox"
          checked={notifications.desktop}
          onChange={(e) => setNotifications({...notifications, desktop: e.target.checked})}
        />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Message previews</label>
          <p>Show message content in notifications</p>
        </div>
        <input
          type="checkbox"
          className="setting-checkbox"
          checked={notifications.previews}
          onChange={(e) => setNotifications({...notifications, previews: e.target.checked})}
        />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Vibration</label>
          <p>Vibrate for notifications (mobile)</p>
        </div>
        <input
          type="checkbox"
          className="setting-checkbox"
          checked={notifications.vibration}
          onChange={(e) => setNotifications({...notifications, vibration: e.target.checked})}
        />
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="settings-section">
      <h3>Privacy Settings</h3>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Show online status</label>
          <p>Let others see when you're online</p>
        </div>
        <input
          type="checkbox"
          className="setting-checkbox"
          checked={privacy.showOnlineStatus}
          onChange={(e) => setPrivacy({...privacy, showOnlineStatus: e.target.checked})}
        />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Read receipts</label>
          <p>Show when you've read messages</p>
        </div>
        <input
          type="checkbox"
          className="setting-checkbox"
          checked={privacy.showReadReceipts}
          onChange={(e) => setPrivacy({...privacy, showReadReceipts: e.target.checked})}
        />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Typing indicators</label>
          <p>Show when you're typing</p>
        </div>
        <input
          type="checkbox"
          className="setting-checkbox"
          checked={privacy.showTypingIndicator}
          onChange={(e) => setPrivacy({...privacy, showTypingIndicator: e.target.checked})}
        />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Last seen</label>
          <p>Show your last seen time</p>
        </div>
        <input
          type="checkbox"
          className="setting-checkbox"
          checked={privacy.showLastSeen}
          onChange={(e) => setPrivacy({...privacy, showLastSeen: e.target.checked})}
        />
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="settings-section">
      <h3>Advanced Settings</h3>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Hardware acceleration</label>
          <p>Use GPU acceleration for better performance</p>
        </div>
        <input type="checkbox" className="setting-checkbox" defaultChecked />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Developer mode</label>
          <p>Enable advanced debugging features</p>
        </div>
        <input type="checkbox" className="setting-checkbox" />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Beta features</label>
          <p>Get early access to new features</p>
        </div>
        <input type="checkbox" className="setting-checkbox" />
      </div>
      
      <div className="setting-group">
        <label>Performance</label>
        <div className="setting-item">
          <div className="setting-info">
            <label>Animation quality</label>
            <p>Adjust animation smoothness</p>
          </div>
          <select className="setting-select">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="off">Disabled</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="settings-section">
      <h3>Data & Storage</h3>
      
      <div className="setting-group">
        <label>Storage Usage</label>
        <div className="setting-item">
          <div className="setting-info">
            <label>Messages</label>
            <p>2.3 GB used</p>
          </div>
          <button className="theme-toggle">
            Clear Cache
          </button>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Media files</label>
            <p>1.8 GB used</p>
          </div>
          <button className="theme-toggle">
            Manage
          </button>
        </div>
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Auto-delete old messages</label>
          <p>Automatically delete messages older than 30 days</p>
        </div>
        <input type="checkbox" className="setting-checkbox" />
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Compress media uploads</label>
          <p>Reduce file sizes to save bandwidth</p>
        </div>
        <input type="checkbox" className="setting-checkbox" defaultChecked />
      </div>
      
      <div className="setting-group">
        <label>Backup & Sync</label>
        <div className="setting-item">
          <div className="setting-info">
            <label>Cloud backup</label>
            <p>Backup your messages to the cloud</p>
          </div>
          <input type="checkbox" className="setting-checkbox" defaultChecked />
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Sync across devices</label>
            <p>Keep messages in sync on all your devices</p>
          </div>
          <input type="checkbox" className="setting-checkbox" defaultChecked />
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <h3>Appearance Settings</h3>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Theme</label>
          <p>Choose between light and dark themes</p>
        </div>
        <button className="theme-toggle" onClick={onThemeChange}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      
      <div className="setting-group">
        <label>Message Display</label>
        <div className="setting-item">
          <div className="setting-info">
            <label>Message bubbles</label>
            <p>Show messages in chat bubbles</p>
          </div>
          <input type="checkbox" className="setting-checkbox" defaultChecked />
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Show avatars</label>
            <p>Display profile pictures in conversations</p>
          </div>
          <input type="checkbox" className="setting-checkbox" defaultChecked />
        </div>
      </div>
      
      <div className="setting-group">
        <label>Chat Background</label>
        <div className="wallpaper-options">
          <div className="wallpaper-option active">
            <div className="wallpaper-preview default"></div>
            <span>Default</span>
          </div>
          <div className="wallpaper-option">
            <div className="wallpaper-preview pattern1"></div>
            <span>Pattern 1</span>
          </div>
          <div className="wallpaper-option">
            <div className="wallpaper-preview pattern2"></div>
            <span>Pattern 2</span>
          </div>
        </div>
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Sidebar position</label>
          <p>Choose sidebar layout</p>
        </div>
        <select className="setting-select">
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
      
      <div className="setting-item">
        <div className="setting-info">
          <label>Compact mode</label>
          <p>Reduce spacing for more content</p>
        </div>
        <input type="checkbox" className="setting-checkbox" />
      </div>
    </div>
  );

  const renderAboutSettings = () => (
    <div className="settings-section">
      <h3>About Messenger</h3>
      
      <div className="about-section">
        <div className="app-info">
          <div className="app-icon">💬</div>
          <div className="app-details">
            <h4>Modern Messenger</h4>
            <p>Version 2.0.0</p>
            <p>Built with React and TypeScript</p>
          </div>
        </div>
        
        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-value">1M+</span>
            <span className="stat-label">Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Support</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">150+</span>
            <span className="stat-label">Countries</span>
          </div>
        </div>
        
        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Features</span>
          </div>
        </div>
        
        <div className="about-links">
          <a href="#" className="about-link">
            <Smartphone size={16} />
            Mobile Apps
          </a>
          <a href="#" className="about-link">
            <HelpCircle size={16} />
            Help Center
          </a>
          <a href="#" className="about-link">
            <Shield size={16} />
            Privacy Policy
          </a>
          <a href="#" className="about-link">
            <Download size={16} />
            Download Apps
          </a>
        </div>
        
        <div className="about-footer">
          <p>© 2024 Modern Messenger. All rights reserved.</p>
          <p>Made with ❤️ for seamless communication</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="settings-body">
          <div className="settings-sidebar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="settings-content">
            {activeTab === 'account' && renderAccountSettings()}
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'advanced' && renderAdvancedSettings()}
            {activeTab === 'data' && renderDataSettings()}
            {activeTab === 'about' && renderAboutSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};