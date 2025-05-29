import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Helper: derive username (First letter of firstname + . + lastname), lowercase
const deriveUsername = (firstName, lastName) =>
    `${firstName[0].toLowerCase()}.${lastName.toLowerCase()}`;

// @desc    Create new user (admin only)
// @route   POST /api/users
// @access  Admin
export const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, role } = req.body;

    if (!firstName || !lastName) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const username = deriveUsername(firstName, lastName);
    const userExists = await User.findOne({ username });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const DEFAULT_PW = "password";
    const user = await User.create({
        firstName,
        lastName,
        username,
        password: DEFAULT_PW,
        role,
    });

    res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
    });
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// @desc    Update user role (admin only)
// @route   PUT /api/users/:id
// @access  Admin
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.role = req.body.role;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Get own profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -__v");
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json(user);
});

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json(user);
});

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (user) {
        user.email = req.body.email || user.email;
        user.birthdate = req.body.birthdate || user.birthdate;
        user.whatsappNumber = req.body.whatsappNumber || user.whatsappNumber;
        user.profilePicURL = req.body.profilePicURL || user.profilePicURL;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters");
    }

    user.password = newPassword;
    const updatedUser = await user.save();
    res.status(200).json({ message: "Password updated" });
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted" });
});
