# Chat System Troubleshooting Guide

## 🔧 Fixed Issues:

### 1. Socket URL Updated
- **Problem:** Socket was connecting to port 3000
- **Fix:** Updated to use port 3001 (server port)
- **File:** `client/src/context/SocketContext.tsx`

```typescript
const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001');
```

## 🧪 Testing Chat System:

### Step 1: Check Server is Running
```bash
# Server should be running on port 3001
http://localhost:3001
```

### Step 2: Check Frontend is Running
```bash
# Frontend should be running on port 5173
http://localhost:5173
```

### Step 3: Open Browser Console
Press `F12` and check Console tab for:
- ✅ "Connected to WebSocket server"
- ❌ Any connection errors

### Step 4: Test Admin Chat
1. Open: `http://localhost:5173/admin/chat`
2. Check connection status (should show "Connected")
3. Type a message and click Send
4. Message should appear in chat

### Step 5: Test Driver Chat
1. Open: `http://localhost:5173/driver/chat`
2. Check connection status (should show "Connected")
3. Type a message and click Send
4. Message should appear in chat

## 🐛 Common Issues:

### Issue 1: "Disconnected" Status
**Cause:** Server not running or wrong port
**Solution:**
```bash
cd server
npm run dev
```

### Issue 2: Messages Not Sending
**Cause:** Socket not connected
**Solution:**
1. Check browser console for errors
2. Verify server is running
3. Check `.env` file has correct VITE_SOCKET_URL

### Issue 3: CORS Errors
**Cause:** Server CORS not configured
**Solution:** Server already configured for `http://localhost:5173`

## 📝 Environment Variables:

### Client `.env`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### Server `.env`:
```env
PORT=3001
CLIENT_URL=http://localhost:5173
```

## 🔍 Debug Steps:

### 1. Check Socket Connection:
Open browser console and type:
```javascript
// Should show socket object
window.socket
```

### 2. Check Server Logs:
Server console should show:
```
User connected: <socket-id>
admin Admin (admin-1) joined
```

### 3. Test Socket Events:
In browser console:
```javascript
// Manually emit test message
socket.emit('send_broadcast', {
  message: 'Test',
  sender: 'Admin',
  timestamp: new Date().toISOString()
});
```

## ✅ Expected Behavior:

### Admin Side:
1. Can see list of online drivers
2. Can broadcast to all drivers
3. Can send direct message to specific driver
4. Receives messages from drivers

### Driver Side:
1. Connects to admin room
2. Can send messages to admin
3. Receives broadcast messages
4. Receives direct messages

## 🚀 Testing Flow:

1. **Start Server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Client:**
   ```bash
   cd client
   npm run dev
   ```

3. **Open Two Browser Windows:**
   - Window 1: `http://localhost:5173/admin/chat`
   - Window 2: `http://localhost:5173/driver/chat`

4. **Test Messaging:**
   - Send message from admin → should appear in driver chat
   - Send message from driver → should appear in admin chat

## 📊 Server WebSocket Events:

### Events Handled:
- `join` - User joins room (admin/driver)
- `send_broadcast` - Admin broadcasts to all drivers
- `send_direct_message` - Direct messaging
- `disconnect` - User disconnects

### Events Emitted:
- `receive_message` - Incoming message
- `drivers_update` - Online drivers list update

## 🔗 Useful Links:

- Server: http://localhost:3001
- Frontend: http://localhost:5173
- Admin Chat: http://localhost:5173/admin/chat
- Driver Chat: http://localhost:5173/driver/chat

## 💡 Tips:

1. Always check browser console for errors
2. Verify both server and client are running
3. Check network tab for WebSocket connection
4. Use browser dev tools to inspect socket events
5. Test with multiple browser windows/tabs
