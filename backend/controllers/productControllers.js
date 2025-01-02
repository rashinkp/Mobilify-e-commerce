import asyncHandler from "express-async-handler";
import Product from "../models/productSchema.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import WishList from "../models/wishListSchema.js";
import Category from "../models/categorySchema.js";
import Order from "../models/orderSchema.js";
import Review from "../models/reviewSchema.js";
export const addProduct = asyncHandler(async (req, res) => {
  const product = req.body;
  const addedProduct = await Product.create(product);
  if (addedProduct) {
    res.status(201).json(addedProduct);
  } else {
    res.status(400);
    console.log("Invalid product data");
    throw new Error("Invalid product data");
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "latest",
    order = "desc",
    filterBy = "All",
    searchTerm = "",
    categoryId = "",
  } = req.query;

  const userId = req.user?.userId;
  const skip = (page - 1) * limit;

  let matchFilter = {};

  if (categoryId) {
    matchFilter.categoryId = new mongoose.Types.ObjectId(categoryId);
  }

  if (filterBy === "active") {
    matchFilter.isSoftDelete = false;
  } else if (filterBy === "inactive") {
    matchFilter.isSoftDelete = true;
  } else if (filterBy === "low stock") {
    matchFilter.stock = { $lt: 20 };
  } else if (filterBy === "high stock") {
    matchFilter.stock = { $gt: 20 };
  }

  if (searchTerm.trim() !== "") {
    matchFilter.name = { $regex: searchTerm, $options: "i" };
  }


  const userIdObjectId = new mongoose.Types.ObjectId(userId);

  try {
    const pipeline = [
      { $match: matchFilter },

      // Lookup category details
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },

      // Unwind category details
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Filter out soft-deleted or non-existent categories
      {
        $match: {
          $or: [
            { "categoryDetails.isSoftDeleted": { $ne: true } },
            { categoryDetails: { $exists: false } },
          ],
        },
      },

      // Add lookup for reviews
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews",
        },
      },

      // Add review statistics
      {
        $addFields: {
          reviewStats: {
            avgRating: {
              $cond: {
                if: { $gt: [{ $size: "$reviews" }, 0] },
                then: { $avg: "$reviews.rating" },
                else: 0,
              },
            },
            reviewCount: { $size: "$reviews" },
          },
        },
      },

      // Lookup to check if product exists in a specific user's cart
      {
        $lookup: {
          from: "carts",
          let: { productId: "$_id" },
          pipeline: [
            { $match: { userId: userIdObjectId } },
            { $unwind: "$cartItems" },
            {
              $match: {
                $expr: { $eq: ["$cartItems.productId", "$$productId"] },
              },
            },
          ],
          as: "cartDetails",
        },
      },

      // Add isInCart field
      {
        $addFields: {
          isInCart: {
            $cond: {
              if: { $gt: [{ $size: "$cartDetails" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },

      // Sort based on input
      {
        $sort: {
          [sortBy]: order === "desc" ? -1 : 1,
          _id: 1,
        },
      },

      // Pagination
      { $skip: Number(skip) },
      { $limit: Number(limit) },
    ];

    const products = await Product.aggregate(pipeline);


    const totalCountPipeline = [
      ...pipeline.slice(0, -2),
      { $count: "totalCount" },
    ];
    const totalCountResult = await Product.aggregate(totalCountPipeline);
    const totalCount = totalCountResult[0]?.totalCount || 0;

    if (!products || products.length === 0) {
      return res.status(200).json({
        products: [],
        totalCount: 0,
        message: "No products found for the selected filters.",
      });
    }

    let productsWithWishlistStatus = products;
    if (userId) {
      const wishlistItems = await WishList.find({
        userId,
        "items.productId": { $in: products.map((product) => product._id) },
      });

      const wishlistProductIds = new Set(
        wishlistItems.reduce((acc, wishlist) => {
          return [
            ...acc,
            ...wishlist.items.map((item) => item.productId.toString()),
          ];
        }, [])
      );

      productsWithWishlistStatus = products.map((product) => ({
        ...product,
        isInWishList: wishlistProductIds.has(product._id.toString()),
      }));
    }

    res.status(200).json({
      products: productsWithWishlistStatus,
      totalCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  // Fetch the product
  const product = await Product.findById(id);

  if (!product) {
    return res
      .status(404)
      .json({ message: "Couldn't find any product with the id" });
  }

  // Fetch the category associated with the product
  const category = await Category.findById(product.categoryId);

  const wishList = await WishList.findOne({
    userId,
    "items.productId": id,
  });

  const isInWishList = wishList ? true : false;

  const review = await Review.aggregate([
    { $match: { productId: product._id } },
    {
      $group: {
        _id: "null",
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        averageRating: 1,
        count: 1,
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    ...product.toObject(),
    category,
    isInWishList,
    review: review[0],
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (deletedProduct) {
    res.status(200).json({ message: "Product deleted successfully" });
  } else {
    res.status(404).json({ message: "product not found" });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "categoryId" && mongoose.isValidObjectId(updateData[key])) {
          // Convert categoryId to ObjectId
          product[key] = new mongoose.Types.ObjectId(updateData[key]);
        } else {
          product[key] = updateData[key];
        }
      }
    });

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export const updateImages = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { uploadedUrl: images, deleteQueue } = req.body;

  if (!Array.isArray(images)) {
    return res
      .status(400)
      .json({ error: "Invalid data format. Expected an array of images." });
  }

  try {
    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle the delete queue
    if (deleteQueue && Array.isArray(deleteQueue)) {
      for (const index of deleteQueue) {
        const imageToDelete = product.images[index];
        if (imageToDelete) {
          // Delete the image from Cloudinary
          const publicId = imageToDelete.public_id;
          await cloudinary.uploader.destroy(publicId);

          // Remove the image from the product
          product.images.splice(index, 1);
        }
      }
    }

    // Add new images
    product.images.push(...images);

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Images updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while updating the product images",
      details: error.message,
    });
  }
});

export const productDetails = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments();

  const activeProducts = await Product.aggregate([
    { $match: { isSoftDelete: false } },
    { $group: { _id: "null", activeCount: { $sum: 1 } } },
  ]);

  console.log(activeProducts[0].activeCount);
  res
    .status(200)
    .json({ productCount, activeProducts: activeProducts[0].activeCount });
});

export const topSellingProducts = asyncHandler(async (req, res) => {
  const mostSoled = await Order.aggregate([
    {
      $group: {
        _id: "$name",
        sales: { $sum: 1 },
        totalRevenue: { $sum: "$price" },
      },
    },

    { $sort: { sales: -1 } },
    { $limit: 5 },
    {
      $project: {
        name: "$_id",
        _id: 0,
        sales: 1,
        totalRevenue: 1,
      },
    },
  ]);

  console.log(mostSoled);

  res.status(200).json(mostSoled);
});
