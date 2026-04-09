import { Product } from "../models/Product.js";

// helper
const normalizePath = (filePath) => filePath.replace(/\\/g, "/");

// ==============================
// CREATE PRODUCT (ADMIN)
// ==============================
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      fileUrl,
      videoUrl,
      thumbnailUrl,
      imageUrls,
    } = req.body;

    const uploadedThumbnail = req.files?.thumbnail?.[0]?.path
      ? normalizePath(req.files.thumbnail[0].path)
      : null;

    const uploadedImages = req.files?.images
      ? req.files.images.map((file) => normalizePath(file.path))
      : [];

    const thumbnail = uploadedThumbnail || thumbnailUrl || "";

    let images = [...uploadedImages];

    if (imageUrls) {
      const urlsArray = imageUrls
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);

      images = [...images, ...urlsArray];
    }

    const product = await Product.create({
      title,
      description,
      price,
      fileUrl,
      videoUrl,
      thumbnail,
      images,
      createdBy: req.user.id, // ✅ already correct
    });

    res.status(201).json({
      success: true,
      message: "Product created",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// GET ALL PRODUCTS (PUBLIC)
// ==============================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// GET MY PRODUCTS (ADMIN ONLY 🔥)
// ==============================
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      createdBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// GET SINGLE PRODUCT
// ==============================
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name email");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT (only owner admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ ownership check
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // -----------------------------
    // HANDLE TEXT FIELDS
    // -----------------------------
    const { title, description, price, fileUrl, videoUrl } = req.body;

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (fileUrl !== undefined) product.fileUrl = fileUrl;
    if (videoUrl !== undefined) product.videoUrl = videoUrl;

    // -----------------------------
    // HANDLE FILES
    // -----------------------------
    if (req.files?.thumbnail?.[0]?.path) {
      product.thumbnail = normalizePath(req.files.thumbnail[0].path);
    }

    if (req.files?.images) {
      const newImages = req.files.images.map((file) =>
        normalizePath(file.path)
      );

      // 🔥 Replace OR append (choose behavior)

      // OPTION 1: Replace all images
      product.images = newImages;

      // OPTION 2 (better UX): Append instead
      // product.images = [...product.images, ...newImages];
    }

    // -----------------------------
    // SAVE
    // -----------------------------
    await product.save();

    res.json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// DELETE PRODUCT (only owner admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ check ownership
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};