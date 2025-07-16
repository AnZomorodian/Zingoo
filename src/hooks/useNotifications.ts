import { useState, useEffect, useCallback } from 'react';
import { Notification as AppNotification, NotificationAction } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(setPermission);
      }
    }

    // Load saved notifications
    const saved = localStorage.getItem('messenger-notifications');
    if (saved) {
      const parsedNotifications = JSON.parse(saved).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
        expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
      }));
      setNotifications(parsedNotifications);
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('messenger-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Clean up expired notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setNotifications(prev => prev.filter(n => !n.expiresAt || n.expiresAt > now));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const addNotification = useCallback((notification: Omit<AppNotification, 'id'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 99)]); // Keep max 100 notifications

    // Show browser notification if permission granted
    if (permission === 'granted' && !document.hasFocus()) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: newNotification.id,
        requireInteraction: notification.priority === 'urgent',
        silent: notification.priority === 'low'
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        markAsRead(newNotification.id);
      };

      // Auto close after 5 seconds for non-urgent notifications
      if (notification.priority !== 'urgent') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }

    // Play notification sound
    if (notification.priority !== 'low') {
      playNotificationSound(notification.type);
    }

    return newNotification.id;
  }, [permission]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const getNotificationsByType = useCallback((type: AppNotification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const playNotificationSound = useCallback((type: AppNotification['type']) => {
    try {
      const audio = new Audio();
      switch (type) {
        case 'message':
          audio.src = '/sounds/message.mp3';
          break;
        case 'call':
          audio.src = '/sounds/call.mp3';
          break;
        case 'mention':
          audio.src = '/sounds/mention.mp3';
          break;
        case 'achievement':
          audio.src = '/sounds/achievement.mp3';
          break;
        default:
          audio.src = '/sounds/default.mp3';
      }
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore audio play errors (user interaction required)
      });
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, []);

  const scheduleNotification = useCallback((notification: Omit<AppNotification, 'id'>, delay: number) => {
    setTimeout(() => {
      addNotification(notification);
    }, delay);
  }, [addNotification]);

  const addQuickReply = useCallback((notificationId: string, reply: string) => {
    // In a real app, this would send the reply
    console.log('Quick reply:', reply, 'to notification:', notificationId);
    markAsRead(notificationId);
  }, [markAsRead]);

  const snoozeNotification = useCallback((notificationId: string, minutes: number) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      removeNotification(notificationId);
      setTimeout(() => {
        addNotification({
          ...notification,
          title: `[Snoozed] ${notification.title}`,
          timestamp: new Date()
        });
      }, minutes * 60 * 1000);
    }
  }, [notifications, removeNotification, addNotification]);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnreadCount,
    getNotificationsByType,
    scheduleNotification,
    addQuickReply,
    snoozeNotification,
    permission
  };
};