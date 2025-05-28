import mongoose from "mongoose";

const saleItemSchema = {
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    priceAtSale: { type: Number, required: true, min: 0 },
};

const saleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift" },
    items: {
        type: [saleItemSchema],
        required: true,
        validate: [(arr) => arr.length > 0, "Sale must have at least one item"],
    },
    method: { type: String, required: true, enum: ["cash", "card"] },
    total: { type: Number, required: true, min: 0 },
    time: { type: Date, default: Date.now },
});

export default mongoose.model("Sale", saleSchema);
