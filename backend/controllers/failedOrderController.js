import asyncHandler from "express-async-handler";
import FailedOrder from "../models/failedOrders.js";
import Product from "../models/productSchema.js";

export const addToFailedOrders = asyncHandler(async (req, res) => {
  const { userId } = req.user; 
  const data = req.body;

  if (!userId || !data || !data.orderItems) {
    return res.status(400).json({
      success: false,
      message: "Required inputs missing. Please provide valid data.",
    });
  }

  try {
    const {
      orderItems,
      shippingAddress,
      shipping,
      couponCode,
      total,
    } = data;

    // Check stock for all items
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    // Validate coupon, if provided
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ couponId: couponCode });
      if (!coupon) {
        return res.status(404).json({ message: "Invalid coupon code" });
      }
    }

    // Construct the failed orders data
    const failedOrderDocuments = orderItems.map((item) => ({
      userId,
      productId: item.productId,
      name: item.name,
      model: item.model,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      returnPolicy: item.returnPolicy,
      shipping,
      shippingAddress,
      offerPrice: item.offerPrice,
      couponApplied: {
        couponCode: coupon?.couponId || null,
        offerAmount: coupon?.offerAmount || 0,
      },
      total,
    }));

    // Save failed orders in the database
    const createdFailedOrders = await FailedOrder.insertMany(
      failedOrderDocuments
    );

    res.status(200).json({
      success: true,
      message: "Failed orders added successfully",
      orderIds: createdFailedOrders.map((order) => order._id),
    });
  } catch (error) {
    console.error("Error adding to failed orders:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to failed orders",
      error: error.message,
    });
  }
});


