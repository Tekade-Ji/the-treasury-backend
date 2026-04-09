import express from "express";
import { buyProduct, getMyProducts } from "../controllers/orderController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/buy/:productId", auth, buyProduct);
router.get("/my-items", auth, getMyProducts);

export default router;