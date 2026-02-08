const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// WebSocket connection handling
const connectedUsers = new Map(); // Track connected users

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room based on user type
  socket.on("join", (data) => {
    const { userId, userType, userName } = data;
    socket.join(userType); // 'admin' or 'driver'
    
    // Store user info
    connectedUsers.set(socket.id, { userId, userType, userName, socketId: socket.id });
    
    console.log(`${userType} ${userName} (${userId}) joined`);
    
    // Notify admins about online drivers
    if (userType === 'driver') {
      const drivers = Array.from(connectedUsers.values()).filter(u => u.userType === 'driver');
      io.to('admin').emit('drivers_update', drivers);
    }
  });

  // Handle broadcast messages (admin to all drivers)
  socket.on("send_broadcast", (data) => {
    const { message, sender, timestamp } = data;
    
    // Send to all drivers
    io.to("driver").emit("receive_message", {
      message,
      sender,
      senderType: 'admin',
      timestamp,
      isBroadcast: true
    });
    
    console.log("Broadcast message sent to all drivers:", data);
  });

  // Handle direct messages (admin to specific driver or driver to admin)
  socket.on("send_direct_message", (data) => {
    const { message, sender, senderType, recipientId, timestamp } = data;
    
    if (senderType === "admin") {
      // Find driver socket
      const driverSocket = Array.from(connectedUsers.entries())
        .find(([_, user]) => user.userId === recipientId && user.userType === 'driver');
      
      if (driverSocket) {
        io.to(driverSocket[0]).emit("receive_message", {
          message,
          sender,
          senderType: 'admin',
          timestamp,
          isBroadcast: false
        });
      }
    } else if (senderType === "driver") {
      // Send to all admins
      io.to("admin").emit("receive_message", {
        message,
        sender,
        senderType: 'driver',
        senderId: data.senderId,
        timestamp,
        isBroadcast: false
      });
    }
    
    console.log("Direct message sent:", data);
  });

  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`User disconnected: ${user.userName} (${user.userType})`);
      connectedUsers.delete(socket.id);
      
      // Update drivers list for admins
      if (user.userType === 'driver') {
        const drivers = Array.from(connectedUsers.values()).filter(u => u.userType === 'driver');
        io.to('admin').emit('drivers_update', drivers);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running! " + PORT });
});



