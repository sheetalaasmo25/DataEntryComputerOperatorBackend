const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    link: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
