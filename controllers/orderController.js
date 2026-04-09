import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

// BUY PRODUCT
export const buyProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // already owned check
    if (user.ownedProducts.includes(product._id)) {
      return res.status(400).json({
        success: false,
        message: "Already owned"
      });
    }

    // coins check
    if (user.coins < product.price) {
      return res.status(400).json({
        success: false,
        message: "Not enough coins"
      });
    }

    // deduct coins
    user.coins -= product.price;

    // add product to owned
    user.ownedProducts.push(product._id);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product purchased",
      data: {
        coinsLeft: user.coins,
        productId: product._id
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("ownedProducts");

    res.status(200).json({
      success: true,
      data: user.ownedProducts
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};