import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getProducts);

router.post(
    "/",
    protect,
    admin,
    [
        body("name").notEmpty(),
        body("category").notEmpty(),
        body("price").isFloat({ gt: 0 }),
        body("imageUrl").optional().isURL(),
    ],
    validate,
    createProduct
);

router.put(
    "/:id",
    protect,
    admin,
    [
        body("name").optional(),
        body("category").optional(),
        body("price").optional(),
        body("imageUrl").optional(),
    ],
    validate,
    updateProduct
);

router.delete("/:id", protect, admin, deleteProduct);

export default router;