import asyncHandler from "express-async-handler";
import Order from "../models/orderSchema.js";
import Cart from "../models/cartSchema.js";
import mongoose from "mongoose";
import Product from "../models/productSchema.js";

export const addOrder = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const data = req.body;

  // Check required inputs
  if (!userId || !data || !data.orderItems) {
    return res.status(400).json({
      message: "Required inputs missing, please try again",
    });
  }

  try {
    const {
      orderItems,
      shippingAddress,
      shipping,
      paymentMethod,
      couponCode,
      total,
      paymentId,
      paymentStatus,
    } = data;

    // Check stock availability first
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}`,
        });
      }
    }

    const orderDocuments = orderItems.map((item) => ({
      userId: userId,
      productId: item.productId,
      name: item.name,
      model: item.model,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      shipping: shipping,
      paymentMethod: paymentMethod,
      shippingAddress: shippingAddress,
      couponCode: couponCode,
      status: "Order placed",
      paymentId: paymentId || null,
      paymentStatus:
        paymentStatus ||
        (paymentMethod === "Razorpay" ? "Pending" : "Cash on Delivery"),
    }));

    const createdOrders = await Order.insertMany(orderDocuments);

    // Update stock for each product
    for (const item of orderDocuments) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear cart
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.cartItems = [];
      await cart.save();
    }

    res.status(201).json({
      message:
        paymentMethod === "Razorpay"
          ? "Orders placed successfully with Razorpay"
          : "Orders placed successfully with Cash on Delivery",
      orderIds: createdOrders.map((order) => order._id),
      total,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
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

export const getAOrder = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);

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

export const getOrdersWithSingleProducts = async (req, res) => {
  const { userId } = req.user;
  const { ordId: orderId } = req.params;

  const convertedUserId = new mongoose.Types.ObjectId(userId);
  const convertedProductId = new mongoose.Types.ObjectId(productId);
  const convertedOrderId = new mongoose.Types.ObjectId(orderId);

  try {
    const orders = await Order.aggregate([
      {
        $match: {
          userId: convertedUserId,
          _id: convertedOrderId,
        },
      },
    ]);

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching order found for this product" });
    }

    return res.status(200).json(orders[0]);
  } catch (error) {
    console.error("Error fetching single order with product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await Order.find().skip(Number(skip)).limit(Number(limit));

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const totalCount = await Order.countDocuments();

    return res.status(200).json({ orders, totalCount });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { newStatus = "", newPaymentStatus = "", orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = newStatus || order.status;
  order.paymentStatus = newPaymentStatus || order.paymentStatus;

  if (order.status === "Delivered") {
    order.paymentStatus = "Success";
  }

  if (
    (order.status !== "Cancelled" || order.status !== "Returned") &&
    order.paymentStatus === "Refunded"
  ) {
    order.paymentStatus = "Pending";
  }

  await order.save();

  res
    .status(200)
    .json({ message: "Product status updated successfully", order });
};
