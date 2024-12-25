import asyncHandler from "express-async-handler";
import Cart from "../models/cartSchema.js";
import Product from "../models/productSchema.js";
import mongoose from "mongoose";
import WishList from "../models/wishListSchema.js";

export const addToCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { productId, quantity = 1 } = req.body;

  if (!productId || !quantity || quantity < 1) {
    res.status(400);
    throw new Error("Invalid product ID or quantity");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < 1) {
    return res.status(400).json({ message: "Product is out of stock" });
  }

  const wishList = await WishList.findOne({ userId });
  if (wishList) {
    await WishList.updateOne(
      { userId },
      { $pull: { items: { productId: productId } } }
    );
    console.log("Product removed from wishlist");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      cartItems: [{ productId, quantity }],
    });
  } else {
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      if (cart.cartItems[itemIndex].quantity >= 10) {
        return res
          .status(400)
          .json({ message: "Maximum limit to cart reached" });
      }
      cart.cartItems[itemIndex].quantity += quantity;
    } else {
      cart.cartItems.push({ productId, quantity });
    }
  }

  await cart.save();

  res.status(200).json({
    message: "Product added to cart successfully",
    cart,
  });
});

export const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const userObjectId = new mongoose.Types.ObjectId(userId);

  let cart = await Cart.aggregate([
    //finding the user
    { $match: { userId: userObjectId } },

    //unwind cart items to process each
    { $unwind: { path: "$cartItems", preserveNullAndEmptyArrays: true } },

    //lookup product details for each productId
    {
      $lookup: {
        from: "products",
        localField: "cartItems.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },

    {
      $addFields: {
        "cartItems.productDetails": { $arrayElemAt: ["$productDetails", 0] },
      },
    },

    {
      $lookup: {
        from: "categories",
        localField: "productDetails.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },

    {
      $addFields: {
        "cartItems.productDetails.category": {
          $arrayElemAt: ["$category", 0],
        },
      },
    },

    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        cartItems: { $push: "$cartItems" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },

    {
      $addFields: {
        totalProducts: { $sum: "$cartItems.quantity" },
      },
    },
  ]);

  if (!cart || cart.length === 0) {
    const newCart = new Cart({
      userId,
      cartItems: [],
    });
    await newCart.save();
    return res.status(200).json(newCart);
  }

  res.status(200).json(cart[0]);
});

export const deleteFromCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "did not get proper data, please try again" });
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "could not find such a cart" });
  }

  const updatedCart = await Cart.updateOne(
    { userId },
    { $pull: { cartItems: { productId } } }
  );

  if (updatedCart.modifiedCount === 0) {
    return res
      .status(400)
      .json({ message: "Product not found in cart or not removed" });
  }

  const updatedCartDetails = await Cart.findOne({ userId });
  return res.status(200).json(updatedCartDetails);
});

export const updateCartQuantity = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { productId, updatedQuantity: quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product ID or quantity" });
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const cartItemIndex = cart.cartItems.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (cartItemIndex === -1) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  const product = await Product.findById(productId);

  if (product.stock < quantity) {
    return res
      .status(400)
      .json({ message: "Don not have enough stock. Sorry!" });
  }

  if (quantity > 10) {
    return res.status(400).json({ message: "Maximum limit to cart reached" });
  }

  // Update the quantity
  cart.cartItems[cartItemIndex].quantity = quantity;

  // Save the updated cart
  await cart.save();

  res.status(200).json(cart);
});
