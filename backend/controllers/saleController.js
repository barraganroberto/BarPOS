import asyncHandler from "express-async-handler";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Shift from "../models/Shift.js";

// @desc    Create sale
// @route   POST /api/sales
// @access  Private
export const createSale = asyncHandler(async (req, res) => {
    const { items, method } = req.body;
    if (!items?.length) {
        res.status(400);
        throw new Error("No items in sale");
    }
    let total = 0;
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (product) {
            total += product.price * item.quantity;
        }
    }

    // 1) Find open shift
    const shift = await Shift.findOne({
        user: req.user._id,
        closed: false,
    });

    if (!shift) {
        res.status(400);
        throw new Error("No open shift found");
    }

    // 2) Build & save the sale
    const sale = await Sale.create({
        user: req.user._id,
        shift: shift._id,
        items,
        method,
        time: Date.now()
    })

    res.status(201).json(sale);
});

// @desc    Get sales
// @route   GET /api/sales
// @access  Private
export const getSales = asyncHandler(async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };

    // populate items.product with the "name" field
    const sales = await Sale.find(filter)
        .populate({
            path: "items.product",
            select: "name",
        })
        .sort({ createdAt: -1 });
        
    res.json(sales);
});
