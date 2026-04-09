import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import helmet from "helmet";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use("/uploads", express.static("uploads"));
app.use(express.json());
// ✅ ADD THIS LINE

app.use(helmet());


// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected ✅"))
  .catch((err) => {
    console.error("DB Error ❌", err);
    process.exit(1);
  });

  app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);

// server start
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running 🚀");
});