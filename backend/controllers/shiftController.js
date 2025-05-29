import asyncHandler from "express-async-handler";
import Shift from "../models/Shift.js";
import Sale from "../models/Sale.js";

// @desc    Start shift
// @route   POST /api/shifts
// @access  Private
export const startShift = asyncHandler(async (req, res) => {
    const { cashInitial, cardInitial } = req.body;
    const shift = await Shift.create({
        user: req.user._id,
        cashInitial,
        cardInitial,
    });
    res.status(201).json(shift);
});


// @desc    Close shift
// @route   POST /api/shifts/:id
// @access  Private
export const closeShift = asyncHandler(async (req, res) => {
    const shift = await Shift.findById(req.params.id);

    if (!shift || shift.closed) {
        res.status(400);
        throw new Error("Shift not found or already closed");
    }

    // Compute the expected totals before closing the shift
    const allSales = await Sale.find({ shift: shift._id }).populate("items.product");

    const { cashCounted, cardCounted, discrepancyNotes } = req.body;
    const expected = await shift.getPaymentTotals();
    shift.cashExpected = expected.cash;
    shift.cardExpected = expected.card;
    shift.cashCounted = cashCounted;
    shift.cardCounted = cardCounted;
    shift.discrepancyNotes = discrepancyNotes;
    shift.closed = true;
    shift.endTime = Date.now();

    const updated = await shift.save();
    res.json({updated, allSales});
});

// @desc    Get all shifts
// @route   GET /api/shifts
// @access  Private
export const getShifts = asyncHandler(async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const shifts = await Shift.find(filter)
        .populate("user", "firstName lastName username")
        .sort({ startTime: -1 });
    res.json(shifts);
});

// @desc    Get current open shift and running cash/card totals
// @route   GET /api/shifts/current
// @access  Private
export const getCurrentShift = asyncHandler(async (req, res) => {
    const shift = await Shift.findOne({
        user: req.user._id,
        closed: false,
    }).populate("user", "firstName lastName username");

    if (!shift) {
        res.status(404);
        throw new Error("Shift not found");
    }

    // load shift's sales
    const sales = await Sale.find({ shift: shift._id });

    // compute sums
    const cashTotal = sales
        .filter((s) => s.method === "cash")
        .reduce(
            (sum, s) =>
                sum +
                s.items.reduce((ss, i) => ss + i.priceAtSale * i.quantity, 0),
            0
        );
    const cardTotal = sales
        .filter((s) => s.method === "card")
        .reduce(
            (sum, s) =>
                sum +
                s.items.reduce((ss, i) => ss + i.priceAtSale * i.quantity, 0),
            0
        );
    const actualTotal = cashTotal + cardTotal;

    // Return shift + totals
    res.json({
        shift,
        totals: {
            initial: {
                cash: shift.cashInitial,
                card: shift.cardInitial,
                total: shift.cashInitial + shift.cardInitial,
            },
            counted: {
                cash: shift.cashCounted,
                card: shift.cardCounted,
                total: shift.cashCounted + shift.cardCounted,
            },
            actual: {
                cash: cashTotal,
                card: cardTotal,
                total: actualTotal,
            },
        },
    });
});

// @desc    Get shift sales
// @route   GET /api/shifts/:id/sales
// @access  Private
export const getShiftSales = asyncHandler(async (req, res) => {
    const shift = await Shift.findById(req.params.id);

    if (!shift) {
        res.status(404);
        throw new Error("Shift not found");
    }
    const sales = await Sale.find({ shift: shift._id })
        .populate({
            path: "items.product",
            select: "name",
        })
        .sort({ time: -1 });

    res.json(sales);
});

// @desc    Create sale
// @route   POST /api/shifts/:id/sales
// @access  Private
export const createShiftSale = asyncHandler(async (req, res) => {
    const { id: shiftId} = req.params;
    const { items, method } = req.body;

    const shift = await Shift.findById(shiftId);
    if (!shift || shift.closed) {
        res.status(404);
        throw new Error("Open shift not found");
    }

    // Compute total from items
    const total = items.reduce((sum, item) => sum + item.priceAtSale * item.quantity, 0)

    const sale = await Sale.create({
        shift: shift._id,
        user: req.user._id,
        items,
        method,
        time: Date.now(),
        total
    });
    res.status(201).json(sale);
});
