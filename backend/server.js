import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Route modules
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import shiftRoutes from "./routes/shiftRoutes.js";

// Error & 404 middleware
import { errorHandler, notFound } from "./middleware/error.js";

// Load env variables
dotenv.config();

const app = express();
const PROD_ORIGIN = process.env.CLIENT_URL;
const DEV_ORIGINS = [
    'http://localhost:5173',
    'http://192.168.1.133:5173',
]
const whitelist = [PROD_ORIGIN, ...DEV_ORIGINS];


// Enable CORS and parse JSON
app.use(
    cors({
        origin: whitelist, // now matches your real frontend domain
        credentials: true, // allow cookies/auth headers
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Login
app.use("/api/users", userRoutes); // User CRUD & profile
app.use("/api/products", productRoutes); // Product CRUD
app.use("/api/sales", saleRoutes); // Sale CRUD
app.use("/api/shifts", shiftRoutes); // Shift CRUD

app.get("/", (req, res) => res.send("API running"));

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
