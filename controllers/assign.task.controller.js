const Task = require("../models/assign.task.models");
const User = require("../models/user.models");
const UserAddTask = require("../models/userAddTask.model");
exports.assignTask = async (req, res) => {
    const { userId, startDateTime, endDateTime, count, link } = req.body;

    if (!userId || !startDateTime || !endDateTime || !count || !link) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new task
        const newTask = new Task({
            userId,
            startDateTime,
            endDateTime,
            count,
            link
        });

        await newTask.save();

        // Update user status to Active
        user.status = "Active";
        await user.save();

        res.status(201).json({ message: "Task assigned successfully", task: newTask });
    } catch (error) {
        console.error("Error assigning task:", error.message);
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        let userFilter = {};
        if (search) {
            userFilter.fullName = { $regex: search, $options: "i" }; 
        }

        const users = await User.find(userFilter)
            .select("fullName email status")
            .skip(skip)
            .limit(limitNumber)
            .lean();

        const totalUsers = await User.countDocuments(userFilter);

        const usersWithTasks = await Promise.all(users.map(async (user) => {
            const tasks = await Task.find({ userId: user._id })
                .select("startDateTime endDateTime count link createdAt updatedAt");

            const userTaskCount = await UserAddTask.countDocuments({ userId: user._id });

            return { 
                ...user, 
                tasks,
                taskCount: userTaskCount,  // ✅ Added user task count
                startDate: tasks.length > 0 ? tasks[0].startDateTime : null,
                endDate: tasks.length > 0 ? tasks[tasks.length - 1].endDateTime : null
            };
        }));

        res.status(200).json({
            message: "All tasks retrieved successfully",
            currentPage: pageNumber,
            totalPages: Math.ceil(totalUsers / limitNumber),
            totalUsers,
            users: usersWithTasks
        });
    } catch (error) {
        console.error("Error fetching all tasks:", error.message);
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};


exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find task by ID
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task retrieved successfully", task });
    } catch (error) {
        console.error("Error fetching task:", error.message);
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};


exports.updateTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDateTime, endDateTime, count, link } = req.body;

        // Find and update the task
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { startDateTime, endDateTime, count, link },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error("Error updating task:", error.message);
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};
exports.deleteTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the task
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error.message);
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};



exports.getTasksByUserId = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from the request parameters

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find tasks for the specified user
        const tasks = await Task.find({ userId })
            .select("startDateTime endDateTime count link createdAt updatedAt")
            .sort({ createdAt: -1 }); // Sorting by latest created first

        res.status(200).json({
            message: "User tasks retrieved successfully",
            userId,
            totalTasks: tasks.length,
            tasks,
        });
    } catch (error) {
        console.error("Error fetching tasks by user ID:", error.message);
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};



//get user own task
exports.getMyTasks = async (req, res) => {
    try {
      // Assuming your auth middleware sets req.user with the logged-in user's info
      const userId = req.user.id;
  
      // Find tasks for the logged-in user
      const tasks = await Task.find({ userId })
        .select("startDateTime endDateTime count link createdAt updatedAt")
        .lean();
  
      res.status(200).json({
        message: "User tasks retrieved successfully",
        tasks,
      });
    } catch (error) {
      console.error("Error fetching user tasks:", error.message);
      res
        .status(500)
        .json({ message: "Server error occurred. Please try again later." });
    }
  };


  //user getown task by id
  exports.getTaskByIdUser = async (req, res) => {
    try {
        const { id } = req.params; // Get task ID from request parameters
        const userId = req.user.id; // Get logged-in user ID

        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }

        // Find the task by ID and ensure it belongs to the logged-in user
        const task = await Task.findOne({ _id: id, userId })
            .select("startDateTime endDateTime count link createdAt updatedAt")
            .lean();

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task retrieved successfully",
            task,
        });
    } catch (error) {
        console.error("Error fetching task by ID:", error.message);
        res.status(500).json({
            message: "Server error occurred. Please try again later.",
        });
    }
};
