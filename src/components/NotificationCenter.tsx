import React, { useState } from 'react';
import { X, Bell, BellOff, Check, CheckCheck, Trash2, Clock, AlertCircle, MessageCircle, Phone, Heart, Award, Settings, Filter } from 'lucide-react';
import { Notification } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
  onClose
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'messages' | 'calls' | 'system'>('all');
  const [showSettings, setShowSettings] = useState(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle size={16} />;
      case 'call':
        return <Phone size={16} />;
      case 'mention':
        return <AlertCircle size={16} />;
      case 'reaction':
        return <Heart size={16} />;
      case 'achievement':
        return <Award size={16} />;
      case 'system':
        return <Settings size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return '#f44336';
      case 'high':
        return '#ff9800';
      case 'normal':
        return '#2196f3';
      case 'low':
        return '#9e9e9e';
      default:
        return '#2196f3';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'messages':
        return notification.type === 'message' || notification.type === 'mention';
      case 'calls':
        return notification.type === 'call';
      case 'system':
        return notification.type === 'system' || notification.type === 'update';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-center">
      <div className="notification-header">
        <div className="header-title">
          <Bell size={20} />
          <h3>Notifications</h3>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="header-actions">
          <button 
            className="icon-button"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={16} />
          </button>
          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="notification-settings">
          <h4>Notification Settings</h4>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Desktop notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Sound notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Show previews
            </label>
          </div>
        </div>
      )}

      <div className="notification-filters">
        {['all', 'unread', 'messages', 'calls', 'system'].map((filterType) => (
          <button
            key={filterType}
            className={`filter-btn ${filter === filterType ? 'active' : ''}`}
            onClick={() => setFilter(filterType as any)}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      <div className="notification-actions">
        <button className="action-btn" onClick={() => {
          notifications.filter(n => !n.isRead).forEach(n => onMarkAsRead(n.id));
        }}>
          <CheckCheck size={16} />
          Mark all as read
        </button>
        <button className="action-btn danger" onClick={onClearAll}>
          <Trash2 size={16} />
          Clear all
        </button>
      </div>

      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <BellOff size={48} />
            <h4>No notifications</h4>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
            >
              <div className="notification-content">
                <div className="notification-icon-wrapper">
                  <div 
                    className="notification-icon"
                    style={{ color: getPriorityColor(notification.priority) }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  {!notification.isRead && <div className="unread-dot"></div>}
                </div>
                
                <div className="notification-body">
                  <div className="notification-header-text">
                    <h5>{notification.title}</h5>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  
                  {notification.actions && (
                    <div className="notification-actions-inline">
                      {notification.actions.map((action) => (
                        <button
                          key={action.id}
                          className={`notification-action-btn ${action.style}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle action
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="notification-meta">
                  <div 
                    className="priority-indicator"
                    style={{ backgroundColor: getPriorityColor(notification.priority) }}
                  ></div>
                  {notification.expiresAt && (
                    <div className="expiry-indicator">
                      <Clock size={12} />
                      <span>Expires {formatTime(notification.expiresAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};