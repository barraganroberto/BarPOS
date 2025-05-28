import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Protect routes: require a valid Bearer token
export const protect = asyncHandler(async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader?.startsWith("Bearer ")) {
        res.status(401);
        throw new Error("Not authorized, token missing");
    }

    const token = authorizationHeader.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedToken.id).select("-password");

        if (!req.user) {
            res.status(401);
            throw new Error("Not authorized, user not found");
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
    }
});

// Only allow admins to access routes
export const admin = asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        res.status(401);
        throw new Error("Not authorized as an admin");
    }
    next();
});
