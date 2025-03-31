const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const connectDB = require("./config/db");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Load environment variables before using them
const PORT = process.env.PORT || 8000;

// Connect to the database before defining routes
connectDB();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
    origin: "*", // Allow all origins (you can restrict it later)
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"], // Fixed spelling
    allowedHeaders: ["Content-Type", "Authorization"], // Fixed `Content-type` to `Content-Type`
};
app.use(cors(corsOptions));

// Define route
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
