import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, 
          default: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now, 
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
