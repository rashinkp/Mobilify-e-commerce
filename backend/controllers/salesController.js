import asyncHandler from "express-async-handler";
import Orders from "../models/orderSchema.js";

export const getSales = asyncHandler(async (req, res) => {
  const orders = await Orders.aggregate([
    { $match: { status: "Delivered" } },
    {
      $project: {
        name: 1,
        price: 1,
        quantity: 1,
        count: { $literal: 1 },
        couponApplied: 1,
        orderDate: 1,
      },
    },
    {
      $group: {
        _id: null,
        orders: { $push: "$$ROOT" },
        totalCount: { $sum: "$count" },
        totalPrice: { $sum: "$price" },
      },
    },
    {
      $project: {
        _id: 0,
        orders: 1,
        totalCount: 1,
        totalPrice: 1,
      },
    },
  ]);

  const OrderDetails = orders[0];
  res.status(200).json(OrderDetails);
});