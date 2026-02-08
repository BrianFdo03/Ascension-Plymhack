# Notification System Documentation

## Overview
Real-time notification system for GoBus application that allows admins to send notifications to drivers, passengers, or everyone. Notifications appear as toast messages and are accessible via a notification bell icon.

## Features

### Backend Features
- ✅ MongoDB-based notification storage
- ✅ Real-time delivery via Socket.IO
- ✅ Targeted notifications (specific user, user type, or broadcast)
- ✅ Notification types: info, warning, success, error, announcement
- ✅ Priority levels: low, medium, high
- ✅ Read/unread tracking
- ✅ Expiration support
- ✅ Notification statistics

### Frontend Features
- ✅ Real-time notification toast (auto-dismiss after 5 seconds)
- ✅ Notification bell with unread count badge
- ✅ Notification dropdown panel
- ✅ Mark as read functionality
- ✅ Mark all as read
- ✅ Sound notification (optional)
- ✅ Responsive design
- ✅ Sinhala language support

## Architecture

### Backend Structure
```
server/
├── src/
│   ├── models/
│   │   └── Notification.js          # Notification schema
│   ├── controllers/
│   │   └── notificationController.js # Notification logic
│   ├── routes/
│   │   └── notifications.js          # API routes
│   └── index.js                      # Socket.IO integration
```

### Frontend Structure
```
client/
├── src/
│   ├── context/
│   │   └── NotificationContext.tsx   # Notification state management
│   ├── components/
│   │   └── common/
│   │       ├── NotificationBell.tsx  # Bell icon with dropdown
│   │       └── NotificationToast.tsx # Toast notification
│   ├── services/
│   │   └── notificationService.ts    # API calls
│   └── pages/
│       └── AdminNotifications.tsx    # Admin notification page
```

## API Endpoints

### Create Notification (Admin)
```
POST /api/notifications
Body: {
  recipientType: 'driver' | 'passenger' | 'all',
  recipientId?: string,
  title: string,
  message: string,
  type?: 'info' | 'warning' | 'success' | 'error' | 'announcement',
  priority?: 'low' | 'medium' | 'high',
  data?: any,
  expiresAt?: Date
}
```

### Get Notifications
```
GET /api/notifications?userType=driver&userId=123&limit=50&skip=0
```

### Mark as Read
```
PATCH /api/notifications/:notificationId/read
Body: { userId: string }
```

### Mark All as Read
```
POST /api/notifications/read-all
Body: { userId: string, userType: string }
```

### Delete Notification (Admin)
```
DELETE /api/notifications/:notificationId
```

### Get Statistics (Admin)
```
GET /api/notifications/stats
```

## Socket.IO Events

### Client → Server
- `join`: Join notification room
  ```javascript
  socket.emit('join', { userId, userType, userName });
  ```

### Server → Client
- `new_notification`: Receive new notification
  ```javascript
  socket.on('new_notification', (notification) => {
    // Handle notification
  });
  ```

## Usage Examples

### Admin: Send Notification
```typescript
import { notificationService } from './services/notificationService';

// Send to all users
await notificationService.createNotification({
  recipientType: 'all',
  title: 'Service Update',
  message: 'Bus service will be delayed by 30 minutes',
  type: 'warning',
  priority: 'high'
});

// Send to specific driver
await notificationService.createNotification({
  recipientType: 'driver',
  recipientId: 'driver-123',
  title: 'New Route Assignment',
  message: 'You have been assigned to Route 138',
  type: 'info',
  priority: 'high'
});
```

### Driver/Passenger: Receive Notifications
```typescript
import { useNotifications } from './context/NotificationContext';

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div>
      <NotificationBell />
      <NotificationToast />
    </div>
  );
}
```

## Integration Guide

### 1. Backend Setup
The notification system is already integrated into the server. Make sure:
- MongoDB is running
- Socket.IO is configured in `server/src/index.js`
- Notification routes are registered

### 2. Frontend Setup
Wrap your app with providers in `App.tsx`:
```typescript
<SocketProvider>
  <NotificationProvider userId={userId} userType={userType}>
    <NotificationToast />
    <YourApp />
  </NotificationProvider>
</SocketProvider>
```

### 3. Add Notification Bell
Add to any component:
```typescript
import { NotificationBell } from './components/common/NotificationBell';

<NotificationBell />
```

## Helper Functions

The notification service includes helper functions for common scenarios:

```typescript
// Booking confirmation
await notificationService.sendBookingConfirmation(passengerId, bookingDetails);

// Route delay alert
await notificationService.sendRouteDelayAlert(routeId, delayMinutes);

// Driver assignment
await notificationService.sendDriverAssignment(driverId, routeDetails);

// General announcement
await notificationService.sendAnnouncement(title, message, recipientType);
```

## Customization

### Change Notification Sound
Replace `/public/notification.mp3` with your custom sound file.

### Modify Toast Duration
Edit `NotificationContext.tsx`:
```typescript
setTimeout(() => setShowNotification(false), 5000); // Change 5000 to desired ms
```

### Styling
All components use Tailwind CSS. Modify classes in:
- `NotificationBell.tsx` - Bell icon and dropdown
- `NotificationToast.tsx` - Toast notification
- `index.css` - Animations

## Testing

### Test Notification Flow
1. Start backend: `cd server && npm run dev`
2. Start frontend: `cd client && npm run dev`
3. Navigate to `/admin-notifications`
4. Send a test notification
5. Check driver/passenger pages for notification

### Quick Test Notifications
Use the "Quick Send" panel in Admin Notifications page for pre-configured test notifications.

## Troubleshooting

### Notifications Not Appearing
1. Check Socket.IO connection: `socket.isConnected` should be `true`
2. Verify user joined correct room: Check server logs for "joined" message
3. Check browser console for errors

### Notifications Not Persisting
1. Verify MongoDB connection
2. Check notification model schema
3. Verify API endpoints are working

### Sound Not Playing
1. Check browser autoplay policy
2. Verify `/public/notification.mp3` exists
3. Check browser console for audio errors

## Future Enhancements
- [ ] Push notifications for mobile
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Notification preferences per user
- [ ] Notification history page
- [ ] Notification scheduling
- [ ] Rich media notifications (images, links)
- [ ] Notification templates

## Notes
- Notifications expire automatically if `expiresAt` is set
- Unread count updates in real-time
- Notifications are stored in MongoDB for persistence
- Socket.IO handles real-time delivery
- Admin can send notifications from `/admin-notifications` page
