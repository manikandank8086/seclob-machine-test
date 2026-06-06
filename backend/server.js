import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";




dotenv.config();
connectDB();

const app = express();

cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app",
  ],
  credentials: true,
})
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/subcategories", subCategoryRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});