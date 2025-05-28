import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);