import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getSingleProduct,
  getMyProducts,
} from "../controllers/productController.js";
import { auth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ==============================
// PUBLIC ROUTES
// ==============================
router.get("/", getProducts);

// 🔥 MUST COME BEFORE "/:id"
router.get("/my-products", auth, isAdmin, getMyProducts);

router.get("/:id", getSingleProduct);

// ==============================
// ADMIN ROUTES
// ==============================
router.post(
  "/",
  auth,
  isAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  createProduct
);

router.put(
  "/:id",
  auth,
  isAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  updateProduct
);
router.delete("/:id", auth, isAdmin, deleteProduct);

export default router;