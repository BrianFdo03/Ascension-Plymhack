import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useSocket } from './SocketContext';
import axios from 'axios';

interface Notification {
  _id: string;
  recipientType: 'driver' | 'passenger' | 'all';
  recipientId?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  readBy: Array<{ userId: string; readAt: Date }>;
  data?: any;
  createdAt: string;
  expiresAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotification: boolean;
  setShowNotification: (show: boolean) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  playNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  showNotification: false,
  setShowNotification: () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  fetchNotifications: async () => {},
  playNotificationSound: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
  userId: string;
  userType: 'driver' | 'passenger' | 'admin';
}

export const NotificationProvider = ({ children, userId, userType }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const { socket, isConnected } = useSocket();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications`, {
        params: { userType, userId, limit: 50 }
      });
      
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [API_URL, userType, userId]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Could not play sound:', err));
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await axios.patch(`${API_URL}/api/notifications/${notificationId}/read`, {
        userId
      });
      
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, readBy: [...notif.readBy, { userId, readAt: new Date() }] }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [API_URL, userId]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.post(`${API_URL}/api/notifications/read-all`, {
        userId,
        userType
      });
      
      setNotifications(prev =>
        prev.map(notif => ({
          ...notif,
          readBy: [...notif.readBy, { userId, readAt: new Date() }]
        }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [API_URL, userId, userType]);

  // Listen for new notifications via socket
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      setShowNotification(true);
      playNotificationSound();
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => setShowNotification(false), 5000);
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, isConnected, playNotificationSound]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showNotification,
        setShowNotification,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
        playNotificationSound,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
