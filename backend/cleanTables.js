import mongoose from "mongoose";
import dotenv from "dotenv";
import Sale from "./models/Sale.js";
import Shift from "./models/Shift.js";

dotenv.config();

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    await Sale.deleteMany({});
    await Shift.deleteMany({});
    console.log("Tables cleaned");
    await mongoose.disconnect();
}

main().catch((error) => {
    console.log(error);
    process.exit(1);
});
