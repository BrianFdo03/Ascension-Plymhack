const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("./config/db");
const driverRoutes = require("./routes/driverRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware - Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  console.log("✓ Root endpoint hit");
  res.json({
    message: "Backend is running! " + PORT,
    timestamp: new Date().toISOString(),
    endpoints: {
      drivers: "/api/drivers"
    }
  });
});

// Routes
app.use("/api/drivers", driverRoutes);

// 404 Handler
app.use((req, res) => {
  console.log(`✗ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.url,
    availableRoutes: ["/", "/api/drivers"]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("✗ Error:", err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`\n✓ Server is running on port ${PORT}`);
  console.log(`✓ API available at: http://localhost:${PORT}/api/drivers`);
  console.log(`✓ Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
});



