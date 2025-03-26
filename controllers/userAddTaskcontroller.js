const User = require("../models/user.models");
const UserAddTask = require("../models/userAddTask.model");
const Task = require("../models/assign.task.models");
// ✅ Add User Task API
exports.addUserTask = async (req, res) => {
    try {
        // Extract user ID from token
        const userId = req.user.id; 

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        // Check if user already has a task entry
        const existingTask = await UserAddTask.findOne({ userId });
        if (existingTask) {
            return res.status(400).json({ message: "User task data already exists" });
        }

        // Create a new task entry with user ID
        const newUserTask = new UserAddTask({
            userId,
            ...req.body
        });

        await newUserTask.save();

        res.status(201).json({ message: "User task data added successfully", data: newUserTask });
    } catch (error) {
        console.error("Error adding user task:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

//get user own task

exports.getUserOwnTasks = async (req, res) => {
    try {
        // Extract user ID from token
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        // Fetch tasks added by the logged-in user
        const userTasks = await UserAddTask.find({ userId });

        if (!userTasks.length) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        res.status(200).json({ message: "User tasks retrieved successfully", data: userTasks });
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Get User by ID API (Includes User Task Data)
exports.getUserTasks = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch all tasks added by the user
        const userTasks = await UserAddTask.find({ userId });

        if (userTasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        res.status(200).json({ message: "User tasks fetched successfully", data: userTasks });
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


//user profile own with task aasign and task done
exports.getUserTaskSummary = async (req, res) => {  
    try {  
        const userId = req.user.id; // Assuming authentication middleware sets `req.user`  

        // Fetch user details  
        const user = await User.findById(userId).select("-password -__v -createdAt -updatedAt");  
        if (!user) {  
            return res.status(404).json({ message: "User not found" });  
        }  

        // Count assigned tasks  
        const assignedTaskCount = await Task.countDocuments({ userId });  

        // Count completed tasks  
        const completedTaskCount = await UserAddTask.countDocuments({ userId});  

        res.status(200).json({  
            message: "User task summary retrieved successfully",  
            user,  
            assignedTaskCount,  
            completedTaskCount  
        });  
    } catch (error) {  
        console.error("Error fetching user task summary:", error.message);  
        res.status(500).json({ message: "Server error occurred. Please try again later." });  
    }  
};

