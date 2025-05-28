import express from "express";
import { body, param } from "express-validator";
import {
    getShifts,
    startShift,
    closeShift,
    getCurrentShift,
    getShiftSales,
    createShiftSale,
} from "../controllers/shiftController.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/",
    protect,
    [
        body("cashInitial").isFloat({ min: 0 }),
        body("cardInitial").isFloat({ min: 0 }),
    ],
    validate,
    startShift
);

router.post(
    "/:id",
    protect,
    [
        param("id").isMongoId(),
        body("cashCounted").isFloat({ min: 0 }),
        body("cardCounted").isFloat({ min: 0 }),
        body("discrepancyNotes").optional().isString(),
    ],
    validate,
    closeShift
);

router.get("/", protect, getShifts);

router.get("/current", protect, getCurrentShift);

router.get(
    "/:id/sales",
    protect,
    [param("id").isMongoId()],
    validate,
    getShiftSales
);

router.post(
    "/:id/sales",
    protect,
    [
        param("id").isMongoId(),
        body("items").isArray({ min: 1 }),
        body("items.*.product").isMongoId(),
        body("items.*.quantity").isInt({ min: 1 }),
        body("items.*.priceAtSale").isFloat({ min: 0 }),
        body("method").isIn(["cash", "card"]),
    ],
    validate,
    createShiftSale
);

export default router;

// cashCounted, cardCounted, discrepancyNotes
