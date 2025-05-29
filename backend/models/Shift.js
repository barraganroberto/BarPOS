import mongoose from "mongoose";
import Sale from "./Sale.js";

const shiftSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startTime: { type: Date, default: Date.now, required: true },
    endTime: { type: Date },
    cashInitial: { type: Number, min: 0 },
    cardInitial: { type: Number, min: 0 },
    cashCounted: { type: Number, min: 0 },
    cardCounted: { type: Number, min: 0 },
    discrepancyNotes: { type: String },
    closed: { type: Boolean, default: false },
});

// Compute cash/card totals
shiftSchema.methods.getPaymentTotals = async function () {
    const sales = await Sale.find({ shift: this._id });
    const cash = sales.filter((s) => s.method === "cash").reduce((sum, s) => sum + s.total, 0);
    const card = sales.filter((s) => s.method === "card").reduce((sum, s) => sum + s.total, 0);

    return {cash, card}
};

export default mongoose.model("Shift", shiftSchema);
