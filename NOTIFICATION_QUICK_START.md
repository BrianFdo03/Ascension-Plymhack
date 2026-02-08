# Notification System - Quick Start Guide

## 🚀 Setup (5 minutes)

### 1. Backend is Ready ✅
The notification system is already integrated into your backend. No additional setup needed!

### 2. Frontend is Ready ✅
All components and contexts are already created and integrated.

### 3. Test the System

#### Start the servers:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## 📱 How to Use

### For Admin (Send Notifications)

1. Navigate to: `http://localhost:5173/admin-notifications`
2. Fill in the form:
   - **Recipient Type**: Choose who receives it (All/Drivers/Passengers)
   - **Title**: Short heading
   - **Message**: Detailed message
   - **Type**: Info/Warning/Success/Error/Announcement
   - **Priority**: Low/Medium/High
3. Click "Send Notification"
4. Check driver/passenger pages to see the notification appear!

#### Quick Test Buttons
Use the "Quick Send" panel on the right for instant test notifications.

### For Drivers & Passengers (Receive Notifications)

1. Navigate to any driver or passenger page
2. Look for the 🔔 bell icon in the top navigation
3. When a notification arrives:
   - Toast appears in top-right corner (auto-dismisses in 5 seconds)
   - Bell icon shows unread count badge
   - Click bell to see all notifications
4. Click a notification to mark it as read
5. Click "සියල්ල කියවූ බව සලකුණු කරන්න" to mark all as read

## 🎯 Real-World Examples

### Example 1: Booking Confirmation
When a passenger books a seat, they automatically receive:
```
✅ Booking Confirmed
Your booking for Route 138 from Colombo to Kandy has been confirmed. 2 seat(s) booked.
```

### Example 2: Traffic Alert
When a driver reports traffic, everyone receives:
```
⚠️ High Traffic Alert
Traffic reported at Kaduwela Junction. Heavy congestion due to accident.
```

### Example 3: Service Announcement
Admin can send to everyone:
```
📢 Service Update
Bus service will be temporarily suspended on Main Street due to road maintenance.
```

## 🔧 Integration Examples

### Send Notification from Any Controller

```javascript
const Notification = require('../../models/Notification');

// In your controller function
const notification = await Notification.create({
  recipientType: 'passenger',  // or 'driver' or 'all'
  recipientId: 'user-123',     // optional, for specific user
  title: 'Your Title',
  message: 'Your message here',
  type: 'success',             // info/warning/success/error/announcement
  priority: 'high',            // low/medium/high
  data: {                      // optional extra data
    bookingId: '123',
    routeNo: '138'
  }
});

// Send real-time via Socket.IO
const io = req.app.get('io');
if (io) {
  if (recipientId) {
    io.to(recipientId).emit('new_notification', notification);
  } else {
    io.to(recipientType).emit('new_notification', notification);
  }
}
```

### Use Helper Functions (Frontend)

```typescript
import { notificationService } from './services/notificationService';

// Booking confirmation
await notificationService.sendBookingConfirmation(passengerId, {
  routeName: 'Colombo - Kandy',
  seats: 2,
  date: '2024-03-15'
});

// Route delay
await notificationService.sendRouteDelayAlert('route-123', 30);

// Driver assignment
await notificationService.sendDriverAssignment(driverId, {
  routeName: 'Route 138',
  startTime: '08:00 AM'
});

// General announcement
await notificationService.sendAnnouncement(
  'Service Update',
  'New route available!',
  'all'
);
```

## 🎨 Customization

### Change Toast Duration
Edit `client/src/context/NotificationContext.tsx`:
```typescript
setTimeout(() => setShowNotification(false), 5000); // Change to 3000 for 3 seconds
```

### Change Notification Sound
Replace `client/public/notification.mp3` with your sound file.

### Modify Colors
Edit `client/src/components/common/NotificationToast.tsx`:
```typescript
const getToastStyles = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-500 border-green-600'; // Change colors here
    // ...
  }
};
```

## 🐛 Troubleshooting

### Notifications not appearing?
1. Check browser console for errors
2. Verify Socket.IO connection: Look for "Connected to WebSocket server" in console
3. Check MongoDB is running
4. Verify backend server is running on correct port

### Bell icon not showing?
1. Check if NotificationBell component is imported
2. Verify NotificationProvider wraps your app
3. Check browser console for import errors

### Sound not playing?
1. Check browser autoplay policy (some browsers block autoplay)
2. Verify `/public/notification.mp3` exists
3. Try clicking on the page first (browsers require user interaction)

## 📊 Testing Checklist

- [ ] Admin can send notification to all users
- [ ] Admin can send notification to drivers only
- [ ] Admin can send notification to passengers only
- [ ] Toast appears when notification received
- [ ] Bell icon shows unread count
- [ ] Clicking notification marks it as read
- [ ] Mark all as read works
- [ ] Notifications persist after page refresh
- [ ] Real-time delivery works (no page refresh needed)
- [ ] Booking creates notification automatically
- [ ] Traffic alert creates notification automatically

## 🎓 Next Steps

1. **Add Authentication**: Replace hardcoded user IDs with real auth
2. **Add Notification Preferences**: Let users choose notification types
3. **Add Push Notifications**: For mobile devices
4. **Add Email Notifications**: For important alerts
5. **Add Notification History Page**: Show all past notifications
6. **Add Notification Scheduling**: Send notifications at specific times

## 📚 Full Documentation

See `NOTIFICATION_SYSTEM.md` for complete documentation including:
- Architecture details
- API reference
- Socket.IO events
- Database schema
- Advanced features

## 💡 Tips

- Use `priority: 'high'` for urgent notifications
- Use `type: 'warning'` for traffic/delays
- Use `type: 'success'` for confirmations
- Use `type: 'announcement'` for general updates
- Add `expiresAt` date for time-sensitive notifications
- Include relevant data in `data` field for context

## 🎉 You're Ready!

The notification system is fully functional. Start sending notifications from the admin panel and watch them appear in real-time on driver and passenger pages!
