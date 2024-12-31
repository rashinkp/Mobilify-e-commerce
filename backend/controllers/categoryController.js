import asyncHandler from "express-async-handler";
import Category from "../models/categorySchema.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name, description, offer } = req.body;
  const categoryExists = await Category.findOne({ name });

  if (offer && (offer > 100 || offer < 0)) {
    return res.status(400).json({ message: "Offer must be valid" });
  }

  if (categoryExists) {
    res.status(400);
    console.log("category already exists");
    throw new Error("category already exists");
  }

  const category = await Category.create({
    name,
    description,
    offer,
  });

  if (category) {
    res.status(201).json({
      _id: category._id,
      name: category.name,
      description: category.description,
      offer: category.offer,
    });
  } else {
    res.status(400);
    console.log("Invalid category data");
    throw new Error("Invalid category data");
  }
});

export const getAllCategory = asyncHandler(async (req, res) => {
  const { filterBy } = req.query;

  const filterCondetion = filterBy === "Active" ? { isSoftDeleted: false } : {};

  const categories = await Category.find(filterCondetion);
  if (categories) {
    res.status(200).json(categories);
  } else {
    res.status(404).json({ message: "Couldnt find any categories " });
  }
});

//delete category

export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findByIdAndDelete(categoryId);

  if (category) {
    res.status(200).json({ message: "category deleted successfully" });
  } else {
    res.status(404).json({ message: "category not found" });
  }
});

//update category

export const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { name, description, isSoftDeleted, offer } = req.body;

  // Validate the offer value
  if (offer && (offer > 100 || offer < 0)) {
    return res.status(400).json({ message: "Offer must be valid" });
  }

  // Check if a category with the new name exists, excluding the current category
  if (name) {
    const categoryExists = await Category.findOne({
      name,
      _id: { $ne: categoryId }, // Exclude the current category from the search
    });

    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }
  }

  const category = await Category.findById(categoryId);

  if (category) {
    category.name = name || category.name;
    category.description = description || category.description;
    category.offer = offer || category.offer;

    if (isSoftDeleted !== undefined) {
      category.isSoftDeleted = isSoftDeleted;
    }

    const updatedCategory = await category.save();
    res.status(200).json({
      id: updatedCategory._id,
      name: updatedCategory.name,
      description: updatedCategory.description,
    });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export const bestSellingCategory = asyncHandler(async (req, res) => {
  const bestSeller = await Order.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "productDetails.categoryId",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },
    {
      $group: {
        _id: "$categoryDetails.name",
        sales: { $sum: 1 },
        totalRevenue: { $sum: "$price" },
      },
    },

    { $sort: { sales: -1 } },
    { $limit: 5 },
    {
      $project: {
        name: "$_id",
        sales: 1,
        totalRevenue: 1,
        _id: 0,
      },
    },
  ]);

  // console.log(bestSeller);

  res.status(200).json(bestSeller);
});
