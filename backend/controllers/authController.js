import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../middleware/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if(user && (await user.comparePassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
})