import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { Product } from "./models/Product.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

await mongoose.connect(process.env.MONGO_URI);

// ✅ FIXED FUNCTION
const getLocalPath = (url) => {
  if (!url || !url.includes("uploads")) return null;
  return path.join("./", url); // 🔥 IMPORTANT FIX
};

const migrate = async () => {
  const products = await Product.find();

  console.log("Products found:", products.length); // debug

  for (const product of products) {
    let updated = false;

    console.log("Checking:", product.title);

    // 🔹 THUMBNAIL
    const thumbPath = getLocalPath(product.thumbnail);

    if (thumbPath) {
      console.log("Thumbnail path:", thumbPath);
      console.log("Exists:", fs.existsSync(thumbPath));
    }

    if (thumbPath && fs.existsSync(thumbPath)) {
      const res = await cloudinary.uploader.upload(thumbPath);
      product.thumbnail = res.secure_url;
      updated = true;
      console.log("Thumbnail updated");
    }

    // 🔹 IMAGES
    const newImages = [];

    for (const img of product.images) {
      const imgPath = getLocalPath(img);

      if (imgPath) {
        console.log("Image path:", imgPath);
        console.log("Exists:", fs.existsSync(imgPath));
      }

      if (imgPath && fs.existsSync(imgPath)) {
        const res = await cloudinary.uploader.upload(imgPath);
        newImages.push(res.secure_url);
        updated = true;
        console.log("Image updated");
      } else {
        newImages.push(img);
      }
    }

    product.images = newImages;

    if (updated) {
      await product.save();
      console.log("Saved:", product.title);
    }
  }

  console.log("DONE ✅");
  process.exit();
};

migrate();