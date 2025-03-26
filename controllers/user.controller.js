const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { fullName, phone, email, password,post} = req.body;

        if (!fullName || !phone || !email || !password ||!post) {
            return res.status(400).json({ msg: "Please provide all required fields" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists", errorCode: "USER_EXISTS" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({ fullName, phone, email,post, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Server error occurred. Please try again later.", errorCode: "SERVER_ERROR" });
    }
};

// Login API
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Please provide all required fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials", errorCode: "INVALID_CREDENTIALS" });
        }

        // Check if user is Active
        if (user.status !== "Active") {
            return res.status(403).json({ message: "User not verified yet", errorCode: "USER_NOT_VERIFIED" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials", errorCode: "INVALID_CREDENTIALS" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }  // Token expiry
        );

        // Save token in database (overwrite old token)
        user.currentToken = token;
        await user.save();

        res.status(200).json({ message: "Login successful", token });
        console.log("Login successful")
    } catch (error) {
        console.error("Error during user login:", error.message);
        res.status(500).json({ message: "Server error occurred. Please try again later.", errorCode: "SERVER_ERROR" });
    }
};



exports.getOwnProfile = async (req, res) => {
    try {
        const id = req.user.id;

        if (!id) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Fetched Successfully", data: user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getallUser = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        const skip = (page - 1) * limit;


        const users = await User.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments(query);

        res.status(200).json({
            message: "Fetched Successfully",
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
            users
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


exports.getbyIdUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Fetched Successfully", user });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
}

exports.updateUser = async (req, res) => {
    try {
        const { fullName, phone, email,status,post } = req.body
        const user = await User.findByIdAndUpdate(req.params.id, { post,fullName, phone, email,status}, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Fetched Successfully", user });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
}


exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "User and associated patients deleted successfully" });
    } catch (error) {
        console.error("Error deleting user and associated patients:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};