import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface CreateNotificationDto {
  recipientType: 'driver' | 'passenger' | 'all';
  recipientId?: string;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error' | 'announcement';
  priority?: 'low' | 'medium' | 'high';
  data?: any;
  expiresAt?: Date;
}

export const notificationService = {
  // Create notification (Admin only)
  async createNotification(data: CreateNotificationDto) {
    const response = await axios.post(`${API_URL}/api/notifications`, data);
    return response.data;
  },

  // Get notifications for user
  async getNotifications(userType: string, userId: string, limit = 50, skip = 0) {
    const response = await axios.get(`${API_URL}/api/notifications`, {
      params: { userType, userId, limit, skip }
    });
    return response.data;
  },

  // Mark notification as read
  async markAsRead(notificationId: string, userId: string) {
    const response = await axios.patch(
      `${API_URL}/api/notifications/${notificationId}/read`,
      { userId }
    );
    return response.data;
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string, userType: string) {
    const response = await axios.post(`${API_URL}/api/notifications/read-all`, {
      userId,
      userType
    });
    return response.data;
  },

  // Delete notification (Admin only)
  async deleteNotification(notificationId: string) {
    const response = await axios.delete(`${API_URL}/api/notifications/${notificationId}`);
    return response.data;
  },

  // Get notification statistics (Admin only)
  async getNotificationStats() {
    const response = await axios.get(`${API_URL}/api/notifications/stats`);
    return response.data;
  },

  // Helper: Send booking confirmation
  async sendBookingConfirmation(passengerId: string, bookingDetails: any) {
    return this.createNotification({
      recipientType: 'passenger',
      recipientId: passengerId,
      title: 'Booking Confirmed',
      message: `Your booking for ${bookingDetails.routeName} has been confirmed.`,
      type: 'success',
      priority: 'high',
      data: bookingDetails
    });
  },

  // Helper: Send route delay alert
  async sendRouteDelayAlert(routeId: string, delayMinutes: number) {
    return this.createNotification({
      recipientType: 'all',
      title: 'Route Delay',
      message: `Route is delayed by ${delayMinutes} minutes due to traffic.`,
      type: 'warning',
      priority: 'high',
      data: { routeId, delayMinutes }
    });
  },

  // Helper: Send driver assignment
  async sendDriverAssignment(driverId: string, routeDetails: any) {
    return this.createNotification({
      recipientType: 'driver',
      recipientId: driverId,
      title: 'New Route Assignment',
      message: `You have been assigned to route ${routeDetails.routeName}.`,
      type: 'info',
      priority: 'high',
      data: routeDetails
    });
  },

  // Helper: Send general announcement
  async sendAnnouncement(title: string, message: string, recipientType: 'driver' | 'passenger' | 'all' = 'all') {
    return this.createNotification({
      recipientType,
      title,
      message,
      type: 'announcement',
      priority: 'medium'
    });
  }
};
