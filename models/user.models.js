const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: Number, required: true },
    post: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: "Inactive" },
    role: { type: String, default: "user" },
    currentToken: { type: String }  // New field for storing active token
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
