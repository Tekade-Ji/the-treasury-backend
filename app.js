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

// 🔥 THE VIP LIST (Pulls from your .env)
const allowedOrigins = [
  process.env.CLIENT_URL,      // Localhost
  process.env.LIVE_CLIENT_URL  // Vercel Live Site
];

// 🔥 UPGRADED CORS POLICY
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Critical for cookies/tokens
}));

app.use(express.json());
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
  console.log(`Server running on port ${process.env.PORT || 5000} 🚀`);
});