import asyncHandler from "express-async-handler";
import WishList from "../models/wishListSchema.js";
import Product from "../models/productSchema.js";
import mongoose from "mongoose";
import Cart from "../models/cartSchema.js";

export const toggleWishList = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const  productId  = req.body.productId;

  console.log(userId, req.body);

  if (!userId || !productId) {
    return res.status(400).json({ message: "UserId or ProductId is missing" });
  }

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

  if (!wishList) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  res.status(200).json(wishList);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body;

  const convertedProductId = new mongoose.Types.ObjectId(productId);

  if (!productId || !userId) {
    return res.status(400).json({ message: "did not get required data" });
  }

  const wishlist = await WishList.findOne({ userId });

  if (!wishlist) {
    return res.status(404).json({ message: "No such wish list found" });
  }

  const updatedItems = wishlist.items.filter(
    (item) => item.productId.toString() !== convertedProductId.toString()
  );

  wishlist.items = updatedItems;

  await wishlist.save();

  res.status(200).json({ message: "wishlist updated successfully" });
});

export const addAllToCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const wishlist = await WishList.findOne({ userId });

  if (!wishlist || wishlist.items.length === 0) {
    return res.status(404).json({ message: "Wishlist not found or is empty" });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, cartItems: [] });
  }


  for (const wishlistItem of wishlist.items) {
    const { productId, quantity = 1 } = wishlistItem;

    const product = await Product.findById(productId);

    if (!product) {
      failedItems.push({
        productId: productId.toString(),
        reason: "Product not found",
      });
      continue;
    }

    if (product.stock < quantity) {
     
      continue;
    }

    const cartItemIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (cartItemIndex > -1) {
      cart.cartItems[cartItemIndex].quantity += quantity;
    } else {
      cart.cartItems.push({ productId, quantity });
    }
  }

  await cart.save();

  wishlist.items = []

  await wishlist.save();

  res.status(200).json({
    message: "Wishlist items added to cart",
    cart,
    failedItems,
  });
});
