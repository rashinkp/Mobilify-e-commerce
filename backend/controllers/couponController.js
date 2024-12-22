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

  const coupon = await Coupon.findOne({_id});

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
