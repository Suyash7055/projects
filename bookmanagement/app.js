const express = require("express");
const app = express();

app.use(express.json());

// Import routes
const reviewRoutes = require("./routes/reviewRoutes");

// Use routes
app.use("/", reviewRoutes);

module.exports = app;