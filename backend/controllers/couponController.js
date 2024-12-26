import asyncHandler from "express-async-handler";
import Coupon from "../models/couponSchema.js";
import Product from "../models/productSchema.js";

export const AddCoupon = asyncHandler(async (req, res) => {
  const data = req.body;

  const isCouponExist = await Coupon.findOne({ couponId: data.couponId });

  if (isCouponExist) {
    res
      .status(400)
      .json({ message: "Coupon already exists, change coupon id" });
  }

  const newCoupon = new Coupon({
    ...data,
  });

  await newCoupon.save();
  res.status(200).json({ message: "Coupon added successfully" });
});

export const getAllCoupon = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.status(200).json(coupons);
});

export const editCoupon = asyncHandler(async (req, res) => {
  const { _id, data } = req.body;

  console.log(req.body);
  if (!_id) {
    return res.status(400).json({ message: "Coupon ID not received" });
  }

  const coupon = await Coupon.findOne({ _id });

  if (!coupon) {
    return res.status(404).json({ message: "No such coupon found" });
  }

  if (data && data.couponId && data.couponId !== coupon.couponId) {
    const existingCoupon = await Coupon.findOne({ couponId: data.couponId });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon ID already in use" });
    }
  }

  if (data && typeof data.isSoftDeleted !== "undefined") {
    coupon.isSoftDeleted = data.isSoftDeleted;
  }

  if (data) {
    Object.keys(data).forEach((key) => {
      if (key !== "isSoftDeleted") {
        coupon[key] = data[key];
      }
    });
  }

  await coupon.save();
  res.status(200).json({ message: "Coupon updated successfully" });
});

export const getACoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing coupon ID",
    });
  }

  try {
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "No such coupon found",
      });
    }

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching the coupon",
      error: error.message,
    });
  }
});

export const updateApplicables = asyncHandler(async (req, res) => {
  const { selectedProducts, couponId } = req.body;

  if (!couponId) {
    return res.status(400).json({ message: "No coupon id found" });
  }

  const coupon = await Coupon.findOne({ _id: couponId });
  if (!coupon) {
    return res.status(404).json({ message: "No such coupon found" });
  }

  coupon.applicables = selectedProducts || coupon.applicables;

  await coupon.save();

  return res.status(200).json({
    success: true,
    message: "Applicable products updated successfully",
    data: coupon,
  });
});

//apply coupon
export const applyCoupon = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { couponCode, orderProducts } = req.body;

  if (!couponCode) {
    return res.status(400).json({ message: "Coupon code is not received" });
  }

  // Find the coupon
  const coupon = await Coupon.findOne({ couponId: couponCode });

  if (!coupon) {
    return res.status(404).json({ message: "Such coupon not found" });
  }

  const isExpired = coupon.expiryDate < Date.now();
  const isActive = coupon.isSoftDeleted;

  if (isExpired || isActive) {
    return res.status(400).json({ message: "Coupon expired or not active" });
  }

  // Check if the coupon has already been used by the user
  if (coupon.usersTaken.includes(userId)) {
    return res.status(400).json({ message: "This coupon is expired for you" });
  }

  // Find the first matching product
  const matchedProductId = coupon.applicables.find((productId) =>
    orderProducts.includes(productId)
  );

  if (!matchedProductId) {
    return res.status(400).json({
      message: "This coupon is not applicable to the selected products",
    });
  }

  // Fetch the product details for the first matching product
  const product = await Product.findById(matchedProductId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Calculate prices
  const originalPrice = product.price;
  const offerPrice = (originalPrice * (100 - product.offerPercent)) / 100;

  // Apply coupon percentage
  const couponDiscount = (offerPrice * coupon.discount) / 100;
  const finalPriceAfterCoupon = offerPrice - couponDiscount;

  // Response
  return res.status(200).json({
    message: "Coupon applied successfully",
    productDetails: {
      productId: product._id,
      name: product.name,
      originalPrice,
      offerPrice,
    },
    couponDiscount,
    finalPriceAfterCoupon,
    couponCode,
    offerPercent: coupon.discount,
  });
});

export const getAllApplicableCoupons = asyncHandler(async (req, res) => {
  const productIds = req.body;
  const { userId } = req.user;


  if (!productIds || !userId || productIds.length < 1) {
    return res.status(400).json({ message: 'Did not get required data or no products' });
  }

  const coupons = await Coupon.find({
    applicables: { $in: productIds },
    expiryDate: { $gt: new Date() },
    isSoftDeleted: false,
    usersTaken: {$nin:[userId]}
  });

  res.status(200).json(coupons);

});
