import asyncHandler from "express-async-handler";
import Orders from "../models/orderSchema.js";
import Order from "../models/orderSchema.js";

export const getSales = asyncHandler(async (req, res) => {
  const { startingDate, endingDate } = req.query;

  const dateMatch = {};
  if (startingDate && endingDate) {
    dateMatch.orderDate = {
      $gte: new Date(startingDate),
      $lte: new Date(endingDate + "T23:59:59.999Z"),
    };
  }

  const orders = await Orders.aggregate([
    {
      $match: {
        status: "Delivered",
        ...dateMatch,
      },
    },
    {
      $project: {
        name: 1,
        price: 1,
        offerPrice: 1,
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

  const OrderDetails = orders[0] || {
    orders: [],
    totalCount: 0,
    totalPrice: 0,
  };
  res.status(200).json(OrderDetails);
});

export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = "monthly", year, startDate, endDate } = req.query;

  // Date matching logic
  let dateMatch = {};
  if (startDate && endDate) {
    dateMatch.orderDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  } else if (year) {
    dateMatch.orderDate = {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31T23:59:59.999Z`),
    };
  }

  // Define group by format and sort based on period
  let groupByFormat;
  let sortBy;
  let projectFormat;

  switch (period) {
    case "daily":
      groupByFormat = {
        year: { $year: "$orderDate" },
        month: { $month: "$orderDate" },
        day: { $dayOfMonth: "$orderDate" },
      };
      sortBy = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };
      projectFormat = {
        $concat: [
          { $toString: "$_id.year" },
          "-",
          {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                { case: { $eq: ["$_id.month", 12] }, then: "Dec" },
              ],
            },
          },
          "-",
          { $toString: "$_id.day" },
        ],
      };
      break;

    case "weekly":
      groupByFormat = {
        year: { $year: "$orderDate" },
        month: { $month: "$orderDate" },
        // Get the day of the month to calculate week within month
        dayOfMonth: { $dayOfMonth: "$orderDate" },
      };
      sortBy = { "_id.year": 1, "_id.month": 1, "_id.dayOfMonth": 1 };
      projectFormat = {
        $let: {
          vars: {
            // Calculate week number within month (1-5)
            weekInMonth: {
              $ceil: {
                $divide: ["$_id.dayOfMonth", 7],
              },
            },
          },
          in: {
            $concat: [
              "W",
              { $toString: "$$weekInMonth" },
              "-",
              {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                    { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                    { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                    { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                    { case: { $eq: ["$_id.month", 5] }, then: "May" },
                    { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                    { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                    { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                    { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                    { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                    { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                    { case: { $eq: ["$_id.month", 12] }, then: "Dec" },
                  ],
                },
              },
              "-",
              { $toString: "$_id.year" },
            ],
          },
        },
      };
      break;

    case "monthly":
      groupByFormat = {
        year: { $year: "$orderDate" },
        month: { $month: "$orderDate" },
      };
      sortBy = { "_id.year": 1, "_id.month": 1 };
      projectFormat = {
        $concat: [
          { $toString: "$_id.year" },
          "-",
          {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                { case: { $eq: ["$_id.month", 12] }, then: "Dec" },
              ],
            },
          },
        ],
      };
      break;

    case "yearly":
      groupByFormat = {
        year: { $year: "$orderDate" },
      };
      sortBy = { "_id.year": 1 };
      projectFormat = { $toString: "$_id.year" };
      break;

    default:
      throw new Error("Invalid period specified");
  }

  const salesData = await Orders.aggregate([
    {
      $match: {
        status: "Delivered",
        ...dateMatch,
      },
    },
    {
      $group: {
        _id: groupByFormat,
        totalSales: { $sum: "$price" },
        totalOrders: { $sum: 1 },
        totalItems: { $sum: "$quantity" },
      },
    },
    {
      $sort: sortBy,
    },
    {
      $project: {
        _id: 0,
        period: projectFormat,
        totalSales: 1,
        totalOrders: 1,
        totalItems: 1,
      },
    },
  ]);

  const formattedData = salesData.map((item) => ({
    name: item.period,
    sales: item.totalSales,
    orders: item.totalOrders,
    items: item.totalItems,
  }));

  res.status(200).json({ formattedData });
});

export const totalSalesDetails = asyncHandler(async (req, res) => {
  // Get total price and list of prices
  const orderDetails = await Order.aggregate([
    { $match: { status: "Delivered" } },
    {
      $group: {
        _id: null,
        totalPrice: { $sum: "$price" }, // Calculate total price
      },
    },
  ]);

  // Extract total price and list of prices
  const totalPrice = orderDetails[0]?.totalPrice || 0;
  const prices = orderDetails[0]?.prices || [];

  // Get total count of delivered orders
  const totalCountResult = await Order.aggregate([
    { $match: { status: "Delivered" } },
    { $count: "totalCount" },
  ]);
  const totalCount = totalCountResult[0]?.totalCount || 0;

  res.status(200).json({
    totalPrice,
    prices,
    totalCount,
  });
});

