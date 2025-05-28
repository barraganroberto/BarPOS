import express from "express";
import { body } from "express-validator";
import { authUser } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
    "/",
    body("username").isString(),
    body("password").isString(),
    validate,
    authUser
);

export default router;
