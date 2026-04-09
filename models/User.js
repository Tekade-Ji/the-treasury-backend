import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

    resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  role: {
    type: String,
    default: "user"
  },
  coins: {
    type: Number,
    default: 0
  },
  ownedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);