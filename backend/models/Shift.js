import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startTime: { type: Date, default: Date.now, required: true },
    endTime: { type: Date },
    sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sale" }],
    cashInitial: { type: Number, min: 0 },
    cardInitial: { type: Number, min: 0 },
    cashCounted: { type: Number, min: 0 },
    cardCounted: { type: Number, min: 0 },
    discrepancyNotes: { type: String },
    closed: { type: Boolean, default: false },
});

// Compute cash/card totals
shiftSchema.methods.getPaymentTotals = async function () {
    await this.populate({
        path: "sales",
        select: "method total",
    });
    return this.sales.reduce(
        (acc, sale) => {
            if (sale.method === "cash") {
                acc.cash += sale.total;
                acc.total += sale.total;
            } else {
                acc.card += sale.total;
                acc.total += sale.total;
            }
            return acc;
        },
        { cash: 0, card: 0, total: 0 }
    );
};

export default mongoose.model("Shift", shiftSchema);
