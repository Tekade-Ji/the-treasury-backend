import { Coupon } from "../models/Coupon.js";
import { User } from "../models/User.js";

// CREATE
export const createCoupon = async (req, res) => {
  try {
    const { code, value } = req.body;

    let coupon = await Coupon.create({
      code,
      value,
      createdBy: req.user.id
    });

    // Populate createdBy before sending response
    coupon = await coupon.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Coupon created",
      data: coupon
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// REDEEM
export const redeemCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ success: false, message: "Invalid or inactive coupon" });
    }

    if (coupon.usedBy.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: "Coupon already used by you" });
    }

    const user = await User.findById(req.user.id);
    user.coins += coupon.value;
    await user.save();

    coupon.usedBy.push(req.user.id);
    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon redeemed",
      data: { addedCoins: coupon.value, totalCoins: user.coins }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate("createdBy", "name email");

    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
export const updateCoupon = async (req, res) => {
  try {
    const { code, value } = req.body;

    let coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { code, value },
      { new: true }
    ).populate("createdBy", "name email");

    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// TOGGLE ACTIVE
export const toggleCoupon = async (req, res) => {
  try {
    let coupon = await Coupon.findById(req.params.id);

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    coupon = await coupon.populate("createdBy", "name email");

    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};