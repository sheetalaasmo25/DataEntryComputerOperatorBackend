const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id);

        // If the user is not found, assume they are an admin and allow access
        if (!user) {
            if (decoded.role === "admin") {
                req.user = { id: decoded.id, role: "admin" }; // Attach a temporary admin user object
                return next();
            }
            return res.status(401).json({ message: "Invalid user. Please log in again." });
        }

        // If user is an admin, allow access without checking session expiration
        if (user.role === "admin") {
            req.user = user;
            return next();
        }

        // If user is NOT an admin, validate session token
        if (user.currentToken !== token) {
            return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
        }

        req.user = user; // Attach user data
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Invalid token." });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. You are not an admin." });
    }
    next();
};

module.exports = { authenticate, isAdmin };






// const jwt = require("jsonwebtoken");
// const User = require("../models/user.models");

// const authenticate = async (req, res, next) => {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//         return res.status(401).json({ message: "Access denied. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user || user.currentToken !== token) {
//             return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
//         }

//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token." });
//     }
// };

// const isAdmin = (req, res, next) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).json({ message: "Access denied. You are not an admin." });
//     }
//     next();
// };

// module.exports = { authenticate, isAdmin };
