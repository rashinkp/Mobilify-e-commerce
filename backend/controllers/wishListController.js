import asyncHandler from "express-async-handler";
import WishList from "../models/wishListSchema.js";
import Product from "../models/productSchema.js";
import mongoose from "mongoose";

export const toggleWishList = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: "UserId or ProductId is missing" });
  }

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let wishList = await WishList.findOne({ userId });

  if (!wishList) {
    wishList = new WishList({
      userId,
      items: [{ productId }],
    });
    await wishList.save();

    return res.status(201).json({
      message: "Product added to wishlist",
      wishList,
    });
  }

  const productIndex = wishList.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (productIndex !== -1) {
    wishList.items.splice(productIndex, 1);
    await wishList.save();

    return res.status(200).json({
      message: "Product removed from wishlist",
      wishList,
    });
  }

  wishList.items.push({ productId });
  await wishList.save();

  res.status(201).json({
    message: "Product added to wishlist",
    wishList,
  });
});

export const getAllWishListProducts = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const userObjectId = new mongoose.Types.ObjectId(userId);
 const wishList = await WishList.aggregate([
   { $match: { userId: userObjectId } },
   { $unwind: "$items" },

   {
     $lookup: {
       from: "products",
       localField: "items.productId",
       foreignField: "_id",
       as: "productDetails",
     },
   },
   { $unwind: "$productDetails" },

   // Extract the first image URL from the images array
   {
     $project: {
       _id: 0,
       productId: "$productDetails._id",
       name: "$productDetails.name",
       price: "$productDetails.price",
       description: "$productDetails.description",
       offerPercent: "$productDetails.offerPercent",
       image: { $arrayElemAt: ["$productDetails.images", 0] },
     },
   },

   {
     $project: {
       productId: 1,
       name: 1,
       price: 1,
       description: 1,
       offerPercent: 1,
       image: { $ifNull: ["$image.secure_url", null] }, 
     },
   },
 ]);


 if (!wishList || wishList.length === 0) {
   return res.status(404).json({ message: "Wishlist not found" });
 }

 res.status(200).json(wishList);
});
