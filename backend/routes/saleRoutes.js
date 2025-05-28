import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import {
    getSales,
    createSale,
} from "../controllers/saleController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getSales);

router.post(
    "/",
    protect,
    [
        body("items").isArray({ min: 1 }),
        body("items.*.product").isMongoId(),
        body("items.*.quantity").isInt({ gt: 0 }),
        body("method").isIn(["cash", "card"]),
    ],
    validate,
    createSale
);

export default router;