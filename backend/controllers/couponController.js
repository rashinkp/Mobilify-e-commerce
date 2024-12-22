import asyncHandler from "express-async-handler";
import Coupon from "../models/couponSchema.js";

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
  console.log(id);

  if (!id) {
    return res.status(400).json({ message: "id not found" });
  }

  const coupon = await Coupon.findOne({ _id: id });

  if (!coupon) {
    return res.status(404).json({ message: "No such coupon found" });
  }

  res.status(200).json(coupon);
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

  coupon.applicables = selectedProducts || 
  coupon.applicables;

  await coupon.save();

  return res.status(200).json({
    success: true,
    message: "Applicable products updated successfully",
    data: coupon,
  });
});
