import asyncHandler from "express-async-handler";
import Order from "../models/orderSchema.js";
import Cart from "../models/cartSchema.js";
import mongoose from "mongoose";

export const addOrder = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const data = req.body;

  if (!userId || !data) {
    res
      .status(400)
      .json({ message: "did not get required input, please try again" });
  }

  data.userId = userId;

  const order = new Order(data);
  const saveOrder = await order.save();

  const cart = await Cart.findOne({ userId });

  cart.cartItems = [];

  await cart.save();

  res.status(201).json({
    message: "Order place successfully",
    orderId: saveOrder._id,
  });
});



export const getOrder = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, userId: userId });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});


export const getAllOrdersWithEachProducts = async (req, res) => {
  const { userId } = req.user;
  const convertedUserId = new mongoose.Types.ObjectId(userId);
  try {
    const orders = await Order.aggregate([
      {
        $match: { userId: convertedUserId },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $project: {
          productId: "$orderItems.productId",
          productName: "$orderItems.name",
          productModel: "$orderItems.model",
          productPrice: "$orderItems.price",
          productQuantity: "$orderItems.quantity",
          productImageUrl: "$orderItems.imageUrl",
          orderNumber: 1,
          shippingAddress: 1,
          paymentMethod: 1,
          paymentStatus:1,
          pricing: 1,
          shipping: 1,
          status: 1,
          orderDate: 1,
        },
      },
    ]);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};