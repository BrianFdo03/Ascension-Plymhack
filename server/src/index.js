const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running! " + PORT });
});



