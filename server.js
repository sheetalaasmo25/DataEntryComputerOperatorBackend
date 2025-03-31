// const express = require("express");
// const cors = require("cors");
// require("dotenv").config(); 
// const connectDB = require("./config/db");
// const adminRoutes = require("./routes/admin.routes");
// const userRoutes = require("./routes/user.routes");

// const app = express();

// // Load environment variables before using them
// const PORT = process.env.PORT || 8000;

// // Connect to the database before defining routes
// connectDB();

// // Middleware to parse JSON and URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // CORS configuration
// const corsOptions = {
//     // origin:"https://hrinfohub.com/",
//     origin: "*", // Allow all origins (you can restrict it later)
//     methods: ["GET", "PUT", "PATCH", "DELETE", "POST"], // Fixed spelling
//     allowedHeaders: ["Content-Type", "Authorization"], // Fixed `Content-type` to `Content-Type`
// };
// app.use(cors(corsOptions));

// // Define route
// app.use("/api/admin", adminRoutes);
// app.use("/api/user", userRoutes);

// // Global error handler (optional but recommended)
// app.use((err, req, res, next) => {
//     console.error("Global Error:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });



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
    origin: (origin, callback) => {
        // Allow requests from the specified origin or localhost for testing
        const allowedOrigins = ["https://hrinfohub.com", "http://localhost:3000"];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// HTTPS redirection middleware (optional)
app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https" && process.env.NODE_ENV === "production") {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

// Define routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Unhandled Promise Rejection Handling
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

