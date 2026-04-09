import express from "express";
import {
  createCoupon,
  redeemCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
  toggleCoupon
} from "../controllers/couponController.js";
import { auth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// admin
router.post("/", auth, isAdmin, createCoupon);
router.delete("/:id", auth, isAdmin, deleteCoupon);
router.get("/", auth, getCoupons);
router.patch("/:id", auth, isAdmin, updateCoupon);
router.patch("/:id/toggle", auth, isAdmin, toggleCoupon);

// user
router.post("/redeem", auth, redeemCoupon);

export default router;