import express from "express";
import { body, param } from "express-validator";
import {
    updateUser,
    updateProfile,
    updatePassword,
    getAllUsers,
    createUser,
    getUserProfile,
    getUserById,
    deleteUser,
} from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @desc    Create new user (admin only)
router.post(
    "/",
    protect,
    admin,
    [
        body("firstName").notEmpty(),
        body("lastName").notEmpty(),
        body("role").optional().isIn(["bartender", "admin"]),
    ],
    validate,
    createUser
);

// @desc    Get own profile
router.get("/profile", protect, getUserProfile);

// @desc    Get all users (admin only)
router.get("/", protect, admin, getAllUsers);

// @desc    Get user by ID (admin only)
router.get(
    "/:id",
    protect,
    admin,
    [param("id").isMongoId()],
    validate,
    getUserById
);

// @desc    Update user role (admin only)
router.put(
    "/:id",
    protect,
    admin,
    [param("id").isMongoId(), body("role").isIn(["bartender", "admin"])],
    validate,
    updateUser
);

// @desc    Delete user (admin only)
router.delete(
    "/:id",
    protect,
    admin,
    [param("id").isMongoId()],
    validate,
    deleteUser
);

// @desc    Update user profile
router.patch(
    "/profile",
    protect,
    [
        body("email").optional().isEmail(),
        body("birthdate").optional().isISO8601().toDate(),
        body("whatsappNumber").optional().isMobilePhone("any"),
        body("profilePicURL").optional(),
    ],
    validate,
    updateProfile
);

// @desc    Update user password
router.patch(
    "/password",
    protect,
    [
        body("newPassword")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
    ],
    validate,
    updatePassword
);

export default router;
